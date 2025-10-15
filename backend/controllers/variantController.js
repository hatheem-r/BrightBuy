// controllers/variantController.js
const VariantModel = require('../models/variantModel');

// @desc    Fetch variant by ID
// @route   GET /api/variants/:id
const getVariantById = async (req, res) => {
    try {
        const variantId = req.params.id;
        const variant = await VariantModel.getVariantById(variantId);
        
        if (!variant) {
            return res.status(404).json({ message: "Variant not found" });
        }
        
        res.json(variant);
    } catch (error) {
        console.error("Error fetching variant:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Fetch all variants with inventory
// @route   GET /api/variants
const getAllVariantsWithInventory = async (req, res) => {
    try {
        const variants = await VariantModel.getAllVariantsWithInventory();
        res.json(variants);
    } catch (error) {
        console.error("Error fetching variants:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Fetch variants by product ID
// @route   GET /api/variants/product/:productId
const getVariantsByProductId = async (req, res) => {
    try {
        const productId = req.params.productId;
        const variants = await VariantModel.getVariantsByProductId(productId);
        res.json(variants);
    } catch (error) {
        console.error("Error fetching variants by product:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Check variant availability
// @route   POST /api/variants/:id/check-availability
const checkAvailability = async (req, res) => {
    try {
        const variantId = req.params.id;
        const { quantity } = req.body;
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Valid quantity is required" });
        }
        
        const availability = await VariantModel.checkAvailability(variantId, quantity);
        
        if (!availability) {
            return res.status(404).json({ message: "Variant not found" });
        }
        
        res.json(availability);
    } catch (error) {
        console.error("Error checking availability:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getVariantById,
    getAllVariantsWithInventory,
    getVariantsByProductId,
    checkAvailability
};
