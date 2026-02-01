const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profilePhoto: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: 'Global Nomad'
  },
  travelerClass: {
    type: String,
    enum: ['Economy', 'Premium Economy', 'Business', 'First Class'],
    default: 'Economy'
  },
  seatPreference: {
    type: String,
    enum: ['Window', 'Aisle', 'Extra Legroom', 'Exit Row'],
    default: 'Window'
  },
  mealPreference: {
    type: String,
    enum: ['Standard', 'Vegetarian', 'Vegan', 'Halal', 'Kosher'],
    default: 'Standard'
  },
  passportExpiry: {
    type: String,
    default: 'Not Provided'
  },
  savedDestinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  }],
  membershipPoints: {
    type: Number,
    default: 1250
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user without password
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
