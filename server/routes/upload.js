const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// @desc    Upload image
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'travel-agency',
      use_filename: true,
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// @desc    Delete image
// @route   DELETE /api/upload/:public_id
// @access  Private/Admin
router.delete('/:public_id', protect, admin, async (req, res) => {
  try {
    const result = await cloudinary.uploader.destroy(req.params.public_id);
    res.json({ message: 'Image deleted successfully', result });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting image' });
  }
});

module.exports = router;
