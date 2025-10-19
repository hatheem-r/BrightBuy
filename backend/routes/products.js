// backend/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload'); // CRITICAL: Declare 'upload' once

// Destructuring for clarity
const { addProduct, getProducts, getProductById, updateProduct } = productController; 

// Middleware for file upload that is used by both POST and PUT routes.
// It dynamically tells Multer which file fields to expect.
const configureVariantUpload = (req, res, next) => {
    try {
        // Define a maximum expected number of file fields (variants).
        // This is necessary because req.body (where 'variants' JSON is) is not yet parsed.
        const MAX_VARIANTS = 10; 
        const fields = [];
        for (let i = 0; i < MAX_VARIANTS; i++) {
            fields.push({ name: `variant_image_${i}`, maxCount: 1 });
        }

        // Run the configured upload middleware
        return upload.fields(fields)(req, res, next);
        
    } catch (error) {
        console.error("Error configuring Multer fields:", error);
        // If Multer fails to configure/run (e.g., file limit exceeded), respond with 500
        return res.status(500).json({ message: "File upload configuration error." });
    }
};

// --- API Routes ---

// POST /api/products/add (CREATE)
router.post(
    '/add', 
    configureVariantUpload, // Handles multipart form data and file upload
    addProduct
);

// GET /api/products (READ all products)
router.get('/', getProducts);

// GET /api/products/:id (READ single product details)
router.get('/:id', getProductById); 

// PUT /api/products/:id (UPDATE product)
router.put(
    '/:id', 
    configureVariantUpload, // Handles multipart form data and file upload
    updateProduct
);
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
// @desc    Search products by name or brand
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
