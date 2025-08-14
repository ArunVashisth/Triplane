const mongoose = require('mongoose');

const packageSchema = mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true
  },
  location: { 
    type: String, 
    required: [true, 'Location is required'],
    trim: true
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    trim: true
  },
  image: { 
    type: String, 
    required: [true, 'Image URL is required']
  },
  duration: { 
    type: String, 
    required: [true, 'Duration is required'],
    trim: true
  },
  maxGroupSize: { 
    type: Number, 
    required: [true, 'Maximum group size is required'],
    min: [1, 'Group size must be at least 1']
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  featured: { 
    type: Boolean, 
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Package', packageSchema);