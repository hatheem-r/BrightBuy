// routes/products.js
const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getProductNames,
} = require("../controllers/productController");

// @route   GET /api/products
// @desc    Get all products with default variants
// @access  Public
router.get("/", getAllProducts);

// @route   GET /api/products/names
// @desc    Get all product names for autocomplete
// @access  Public
router.get("/names", getProductNames);

// @route   GET /api/products/search
// @desc    Search products by keyword (name, brand, description, category, SKU, color, size)
// @access  Public
router.get("/search", searchProducts);

// @route   GET /api/products/category/:categoryId
// @desc    Get products by category
// @access  Public
router.get("/category/:categoryId", getProductsByCategory);

// @route   GET /api/products/:id
// @desc    Get single product by ID with all variants
// @access  Public
router.get("/:id", getProductById);

module.exports = router;
