// routes/variants.js
const express = require('express');
const router = express.Router();
const { 
    getVariantById,
    getAllVariantsWithInventory,
    getVariantsByProductId,
    checkAvailability
} = require('../controllers/variantController');

// @route   GET /api/variants
// @desc    Get all variants with inventory status
// @access  Public
router.get('/', getAllVariantsWithInventory);

// @route   GET /api/variants/product/:productId
// @desc    Get variants by product ID
// @access  Public
router.get('/product/:productId', getVariantsByProductId);

// @route   GET /api/variants/:id
// @desc    Get variant by ID
// @access  Public
router.get('/:id', getVariantById);

// @route   POST /api/variants/:id/check-availability
// @desc    Check variant availability
// @access  Public
router.post('/:id/check-availability', checkAvailability);

module.exports = router;
