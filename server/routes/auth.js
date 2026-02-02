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

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
      isVerified: true
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
router.post('/google-login', async (req, res) => {
  try {
    const { name, email, googleId, profilePhoto } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      // If user exists but doesn't have googleId, update it
      if (!user.googleId) {
        user.googleId = googleId;
        if (profilePhoto && !user.profilePhoto) user.profilePhoto = profilePhoto;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        profilePhoto,
        isVerified: true,
        password: Math.random().toString(36).slice(-10) // Random password for social users
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
