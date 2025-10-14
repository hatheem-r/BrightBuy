// routes/categories.js
const express = require('express');
const router = express.Router();
const { 
    getAllCategories, 
    getCategoryById, 
    getMainCategories,
    getSubcategories,
    getCategoryHierarchy
} = require('../controllers/categoryController');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', getAllCategories);

// @route   GET /api/categories/main
// @desc    Get main categories (no parent)
// @access  Public
router.get('/main', getMainCategories);

// @route   GET /api/categories/hierarchy
// @desc    Get category hierarchy with product counts
// @access  Public
router.get('/hierarchy', getCategoryHierarchy);

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', getCategoryById);

// @route   GET /api/categories/:id/subcategories
// @desc    Get subcategories of a parent category
// @access  Public
router.get('/:id/subcategories', getSubcategories);

module.exports = router;
