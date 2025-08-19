const express = require('express');
const Package = require('../models/Package');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/multerMiddleware');
const { createPackage } = require('../controllers/packageController');

const router = express.Router();

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find({});
    res.json(packages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    
    if (package) {
      res.json(package);
    } else {
      res.status(404).json({ message: 'Package not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a package with image upload or URL
// @route   POST /api/packages
// @access  Private/Admin
router.post(
  '/',
  protect,
  admin,
  upload.single('image'), // Middleware for handling a single file input named 'image' (optional)
  createPackage // Controller function to handle the request
);

// @desc    Update a package
// @route   PUT /api/packages/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const { title, location, price, description, duration, maxGroupSize, difficulty, featured, imageUrl } = req.body;
    
    let imageUrlToSave = package.image; // Keep existing image by default

    // Handle image update
    if (req.file) {
      // File upload - upload to Cloudinary
      const cloudinary = require('../config/cloudinary');
      const fs = require('fs');
      
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'travel-agency',
      });
      imageUrlToSave = result.secure_url;
      
      // Clean up the temporary file
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
    } else if (imageUrl) {
      // URL provided - use directly
      imageUrlToSave = imageUrl;
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      {
        title,
        location,
        price: Number(price),
        description,
        image: imageUrlToSave,
        duration,
        maxGroupSize: Number(maxGroupSize),
        difficulty: difficulty || 'medium',
        featured: featured === 'true' || featured === true
      },
      { new: true, runValidators: true }
    );
    
    res.json(updatedPackage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @desc    Delete a package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);

    if (package) {
      await Package.findByIdAndDelete(req.params.id);
      res.json({ message: 'Package removed' });
    } else {
      res.status(404).json({ message: 'Package not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
