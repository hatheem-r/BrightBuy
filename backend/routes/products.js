// routes/products.js
const express = require('express');
const router = express.Router();
const { getAllProducts } = require('../controllers/productController');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', getAllProducts);

module.exports = router;