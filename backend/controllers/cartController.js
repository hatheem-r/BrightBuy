// controllers/cartController.js
const CartModel = require("../models/cartModel");

// @desc    Get cart details for customer
// @route   GET /api/cart?customer_id=X or GET /api/cart/:customerId
const getCartDetails = async (req, res) => {
  try {
    const customerId = req.params.customerId || req.query.customer_id;

    if (!customerId) {
      return res
        .status(401)
        .json({ message: "Customer ID is required. Please login first." });
    }

    const [items, summary] = await Promise.all([
      CartModel.getCartDetails(customerId),
      CartModel.getCartSummary(customerId),
    ]);

    res.json({
      customer_id: customerId,
      summary,
      items,
    });
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get cart summary for customer
// @route   GET /api/cart/:customerId/summary
const getCartSummary = async (req, res) => {
  try {
    const customerId = req.params.customerId || req.query.customer_id;

    if (!customerId) {
      return res
        .status(401)
        .json({ message: "Customer ID is required. Please login first." });
    }

    const summary = await CartModel.getCartSummary(customerId);
    res.json(summary);
  } catch (error) {
    console.error("Error fetching cart summary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/:customerId/items or POST /api/cart/items
const addToCart = async (req, res) => {
  try {
    const customerId = req.params.customerId || req.body.customer_id;
    const { variant_id, quantity } = req.body;

    if (!customerId) {
      return res
        .status(401)
        .json({ message: "Customer ID is required. Please login first." });
    }

    if (!variant_id || !quantity) {
      return res
        .status(400)
        .json({ message: "Variant ID and quantity are required" });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    await CartModel.addToCart(customerId, variant_id, quantity);

    // Get updated cart details
    const items = await CartModel.getCartDetails(customerId);
    const summary = await CartModel.getCartSummary(customerId);

    res.json({
      message: "Item added to cart successfully",
      customer_id: customerId,
      summary,
      items,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:customerId/items/:variantId
const updateCartItem = async (req, res) => {
  try {
    const { customerId, variantId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Valid quantity is required" });
    }

    await CartModel.updateCartItemQuantity(customerId, variantId, quantity);

    // Get updated cart details
    const items = await CartModel.getCartDetails(customerId);
    const summary = await CartModel.getCartSummary(customerId);

    res.json({
      message: "Cart item updated successfully",
      summary,
      items,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);

    if (error.message.includes("exceeds available stock")) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:customerId/items/:variantId
const removeCartItem = async (req, res) => {
  try {
    const { customerId, variantId } = req.params;

    await CartModel.removeCartItem(customerId, variantId);

    // Get updated cart details
    const items = await CartModel.getCartDetails(customerId);
    const summary = await CartModel.getCartSummary(customerId);

    res.json({
      message: "Item removed from cart successfully",
      summary,
      items,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/:customerId
const clearCart = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    await CartModel.clearCart(customerId);

    res.json({
      message: "Cart cleared successfully",
      customer_id: customerId,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get cart item count
// @route   GET /api/cart/:customerId/count
const getCartItemCount = async (req, res) => {
  try {
    const customerId = req.params.customerId || req.query.customer_id;

    if (!customerId) {
      return res
        .status(401)
        .json({ message: "Customer ID is required. Please login first." });
    }

    const counts = await CartModel.getCartItemCount(customerId);
    res.json(counts);
  } catch (error) {
    console.error("Error getting cart count:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getCartDetails,
  getCartSummary,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartItemCount,
};
