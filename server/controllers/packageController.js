const Package = require('../models/Package');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const createPackage = async (req, res) => {
  const { title, location, price, description, duration, maxGroupSize, difficulty, featured, imageUrl } = req.body;

  let imageUrlToSave = '';

  try {
    // Handle image upload or URL
    if (req.file) {
      // File upload - upload to Cloudinary
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
    } else {
      return res.status(400).json({ message: 'Either an image file or image URL is required' });
    }

    // Create new package
    const newPackage = new Package({
      title,
      location,
      price: Number(price),
      description,
      image: imageUrlToSave,
      duration,
      maxGroupSize: Number(maxGroupSize),
      difficulty: difficulty || 'medium',
      featured: featured === 'true' || featured === true
    });

    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    console.error('Error creating package:', error);
    // Clean up the temporary file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

module.exports = { createPackage };