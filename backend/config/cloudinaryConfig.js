// backend/config/cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config(); // Ensure dotenv is loaded here too

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'brightbuy_products', // Folder name in your Cloudinary account
    allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional: optimize/resize image
  },
});

// Export only the cloudinary object and the storage configuration
module.exports = {
  cloudinary,
  storage
};