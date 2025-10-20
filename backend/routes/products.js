// routes/products.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getProductNames,
  uploadProductImage,
  createProduct,
  updateVariantImage,
} = require("../controllers/productController");

// @route   POST /api/products/upload-image
// @desc    Upload a product image
// @access  Public (you can add auth middleware later)
router.post("/upload-image", upload.single('image'), uploadProductImage);

// @route   POST /api/products
// @desc    Create new product with variants
// @access  Public (you can add auth middleware later)
router.post("/", createProduct);

// @route   PUT /api/products/variants/:variantId/image
// @desc    Update product variant image URL
// @access  Public (you can add auth middleware later)
router.put("/variants/:variantId/image", updateVariantImage);

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
