// controllers/productController.js
const db = require('../config/db'); 

// @desc    Fetch all products
// @route   GET /api/products
const getAllProducts = async (req, res) => {
    try {
        // --- THIS IS WHERE THE RAW SQL QUERY GOES ---
        const sql = "SELECT product_id, name, description, price FROM products WHERE is_active = 1";
        const [products] = await db.query(sql);
        // --- END OF SQL QUERY ---

        res.json(products);

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getAllProducts,
};