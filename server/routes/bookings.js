const express = require('express');
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      packageId,
      bookingDate,
      numberOfPeople,
      duration,
      specialRequests
    } = req.body;

    // Get package to calculate total price
    const package = await Package.findById(packageId);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const totalPrice = package.price * numberOfPeople;

    const booking = await Booking.create({
      userId: req.user._id,
      packageId,
      bookingDate,
      numberOfPeople,
      duration: duration || package.duration,
      totalPrice,
      specialRequests
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user bookings
// @route   GET /api/bookings/user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('packageId', 'title location image duration maxGroupSize price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'name email')
      .populate('packageId', 'title location image duration maxGroupSize price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    console.log('Updating booking:', req.params.id, 'with status:', status);
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be one of: pending, confirmed, cancelled, completed' });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      console.log('Booking not found:', req.params.id);
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    console.log('Found booking:', booking._id, 'Current status:', booking.status);
    
    // Update the booking status
    booking.status = status;
    const updatedBooking = await booking.save();
    
    console.log('Booking updated successfully:', updatedBooking._id, 'New status:', updatedBooking.status);
    
    // Populate the updated booking
    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('userId', 'name email')
      .populate('packageId', 'title location image duration maxGroupSize price');
    
    res.json(populatedBooking);
  } catch (error) {
    console.error('Booking update error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('packageId', 'title location image duration maxGroupSize price');
    
    if (booking) {
      // Check if user is admin or the booking owner
      if (req.user.role === 'admin' || booking.userId._id.toString() === req.user._id.toString()) {
        res.json(booking);
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
