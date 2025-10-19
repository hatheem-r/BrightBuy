// backend/middleware/upload.js
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig'); // Import the Cloudinary storage

// Initialize multer upload using the Cloudinary storage engine
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;