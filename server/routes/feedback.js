const express = require('express');
const Feedback = require('../models/Feedback');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const feedback = await Feedback.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to submit feedback' 
    });
  }
});

// @desc    Get all feedback (admin only)
// @route   GET /api/feedback
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const feedback = await Feedback.find({}).sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update feedback status (admin only)
// @route   PUT /api/feedback/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete feedback (admin only)
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
