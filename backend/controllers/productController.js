// controllers/productController.js
const ProductModel = require('../models/productModel');

// @desc    Fetch all products with default variants
// @route   GET /api/products
const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Fetch single product by ID with all variants
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await ProductModel.getProductById(productId);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Fetch products by category
// @route   GET /api/products/category/:categoryId
const getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await ProductModel.getProductsByCategory(categoryId);
        res.json(products);
    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Search products
// @route   GET /api/products/search?q=searchTerm
const searchProducts = async (req, res) => {
    try {
        const searchTerm = req.query.q;
        
        if (!searchTerm) {
            return res.status(400).json({ message: "Search term is required" });
        }
        
        const products = await ProductModel.searchProducts(searchTerm);
        res.json(products);
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    searchProducts
};