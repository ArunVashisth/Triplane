const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallbacksecret', {
    expiresIn: '30d',
  });
};

// @desc    Check if admin exists
// @route   GET /api/auth/check-admin
// @access  Public
router.get('/check-admin', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    res.json({ adminExists: !!adminExists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Create user (Always as 'user', never admin from public registration)
    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
      otp,
      otpExpires,
      isVerified: false
    });

    if (user) {
      // Send OTP via email
      try {
        await sendEmail({
          email: user.email,
          subject: 'Triplane - Verify Your Account',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
              <h2 style="color: #ff5a5f;">Welcome to Triplane!</h2>
              <p>Your journey begins now. Please use the following code to verify your account:</p>
              <div style="background: #f5f9ff; padding: 20px; border-radius: 12px; font-size: 2rem; font-weight: 800; text-align: center; letter-spacing: 10px; color: #2196f3; border: 1px solid #e2e8f0;">
                ${otp}
              </div>
              <p style="margin-top: 20px;">This code will expire in 10 minutes.</p>
              <p>Happy travels,<br>The Triplane Team</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Email could not be sent:', emailError);
      }

      console.log(`OTP for ${email}: ${otp}`);

      res.status(201).json({
        message: 'Registration successful. Please verify your email with the OTP.',
        email: user.email,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only return OTP in dev
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark as verified and clear OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        location: user.location,
        travelerClass: user.travelerClass,
        seatPreference: user.seatPreference,
        mealPreference: user.mealPreference,
        passportExpiry: user.passportExpiry,
        savedDestinations: user.savedDestinations
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send the new OTP
    try {
      await sendEmail({
        email: user.email,
        subject: 'Triplane - New Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
            <p>You requested a new verification code. Please use the code below:</p>
            <div style="background: #f5f9ff; padding: 20px; border-radius: 12px; font-size: 2rem; font-weight: 800; text-align: center; letter-spacing: 10px; color: #2196f3; border: 1px solid #e2e8f0;">
              ${otp}
            </div>
            <p style="margin-top: 20px;">This code will expire in 10 minutes.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Email could not be sent:', emailError);
    }

    console.log(`New OTP for ${email}: ${otp}`);

    res.json({
      message: 'OTP resent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({
          message: 'Account not verified. Please verify your email.',
          unverified: true,
          email: user.email
        });
      }
      res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePhoto: user.profilePhoto,
          location: user.location,
          travelerClass: user.travelerClass,
          seatPreference: user.seatPreference,
          mealPreference: user.mealPreference,
          passportExpiry: user.passportExpiry,
          savedDestinations: user.savedDestinations
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedDestinations');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const {
      name, email, currentPassword, newPassword, profilePhoto,
      location, travelerClass, seatPreference, mealPreference, passportExpiry,
      savedDestinations
    } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic info
    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePhoto) user.profilePhoto = profilePhoto;

    // Update preferences
    if (location) user.location = location;
    if (travelerClass) user.travelerClass = travelerClass;
    if (seatPreference) user.seatPreference = seatPreference;
    if (mealPreference) user.mealPreference = mealPreference;
    if (passportExpiry) user.passportExpiry = passportExpiry;
    if (savedDestinations) user.savedDestinations = savedDestinations;

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required' });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      user.password = newPassword;
    }

    await user.save();
    const updatedUser = await User.findById(user._id).populate('savedDestinations');
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
