// controllers/categoryController.js
const CategoryModel = require('../models/categoryModel');

// @desc    Fetch all categories
// @route   GET /api/categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.getAllCategories();
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Fetch category by ID
// @route   GET /api/categories/:id
const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await CategoryModel.getCategoryById(categoryId);
        
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        res.json(category);
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Fetch main categories (no parent)
// @route   GET /api/categories/main
const getMainCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.getMainCategories();
        res.json(categories);
    } catch (error) {
        console.error("Error fetching main categories:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Fetch subcategories of a parent
// @route   GET /api/categories/:id/subcategories
const getSubcategories = async (req, res) => {
    try {
        const parentId = req.params.id;
        const subcategories = await CategoryModel.getSubcategories(parentId);
        res.json(subcategories);
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Fetch category hierarchy with product counts
// @route   GET /api/categories/hierarchy
const getCategoryHierarchy = async (req, res) => {
    try {
        const hierarchy = await CategoryModel.getCategoryHierarchy();
        res.json(hierarchy);
    } catch (error) {
        console.error("Error fetching category hierarchy:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    getMainCategories,
    getSubcategories,
    getCategoryHierarchy
};
