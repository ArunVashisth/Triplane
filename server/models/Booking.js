const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: [true, 'Package ID is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  numberOfPeople: {
    type: Number,
    required: [true, 'Number of people is required'],
    min: [1, 'At least 1 person is required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required']
  },
  specialRequests: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Populate user and package details when querying
bookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'name email'
  }).populate({
    path: 'packageId',
    select: 'title location price image duration maxGroupSize'
  });
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
