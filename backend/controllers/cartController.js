// controllers/cartController.js
const CartModel = require("../models/cartModel");

// @desc    Get or create cart
// @route   GET /api/cart or POST /api/cart
const getOrCreateCart = async (req, res) => {
  try {
    const customerId = req.body.customer_id || req.query.customer_id;

    if (!customerId) {
      return res
        .status(401)
        .json({ message: "Customer ID is required. Please login first." });
    }

    const cartId = await CartModel.getOrCreateCart(customerId);
    res.json({ cart_id: cartId });
  } catch (error) {
    console.error("Error getting/creating cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get cart details
// @route   GET /api/cart/:cartId
const getCartDetails = async (req, res) => {
  try {
    const cartId = req.params.cartId;

    const [items, summary] = await Promise.all([
      CartModel.getCartDetails(cartId),
      CartModel.getCartSummary(cartId),
    ]);

    res.json({
      cart_id: cartId,
      summary,
      items,
    });
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get cart summary
// @route   GET /api/cart/:cartId/summary
const getCartSummary = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const summary = await CartModel.getCartSummary(cartId);
    res.json(summary);
  } catch (error) {
    console.error("Error fetching cart summary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/:cartId/items
const addToCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const { variant_id, quantity } = req.body;

    if (!variant_id || !quantity) {
      return res
        .status(400)
        .json({ message: "Variant ID and quantity are required" });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    await CartModel.addToCart(cartId, variant_id, quantity);

    // Get updated cart details
    const items = await CartModel.getCartDetails(cartId);
    const summary = await CartModel.getCartSummary(cartId);

    res.json({
      message: "Item added to cart successfully",
      cart_id: cartId,
      summary,
      items,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:cartId/items/:variantId
const updateCartItem = async (req, res) => {
  try {
    const { cartId, variantId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Valid quantity is required" });
    }

    await CartModel.updateCartItemQuantity(cartId, variantId, quantity);

    // Get updated cart details
    const items = await CartModel.getCartDetails(cartId);
    const summary = await CartModel.getCartSummary(cartId);

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
// @route   DELETE /api/cart/:cartId/items/:variantId
const removeCartItem = async (req, res) => {
  try {
    const { cartId, variantId } = req.params;

    await CartModel.removeCartItem(cartId, variantId);

    // Get updated cart details
    const items = await CartModel.getCartDetails(cartId);
    const summary = await CartModel.getCartSummary(cartId);

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

// @desc    Decrease item quantity or remove
// @route   POST /api/cart/:cartId/items/:variantId/decrease
const decreaseCartItem = async (req, res) => {
  try {
    const { cartId, variantId } = req.params;
    const { quantity } = req.body;

    const decreaseAmount = quantity || 1;

    await CartModel.removeFromCart(cartId, variantId, decreaseAmount);

    // Get updated cart details
    const items = await CartModel.getCartDetails(cartId);
    const summary = await CartModel.getCartSummary(cartId);

    res.json({
      message: "Cart updated successfully",
      summary,
      items,
    });
  } catch (error) {
    console.error("Error decreasing cart item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/:cartId
const clearCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;

    await CartModel.clearCart(cartId);

    res.json({
      message: "Cart cleared successfully",
      cart_id: cartId,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Validate cart before checkout
// @route   GET /api/cart/:cartId/validate
const validateCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;

    const validationResults = await CartModel.validateCart(cartId);

    const hasIssues = validationResults.some((item) => item.status !== "OK");

    res.json({
      cart_id: cartId,
      is_valid: !hasIssues,
      items: validationResults,
    });
  } catch (error) {
    console.error("Error validating cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get cart item count
// @route   GET /api/cart/:cartId/count
const getCartItemCount = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const counts = await CartModel.getCartItemCount(cartId);
    res.json(counts);
  } catch (error) {
    console.error("Error getting cart count:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Merge guest cart to customer cart
// @route   POST /api/cart/merge
const mergeGuestCart = async (req, res) => {
  try {
    const { guest_cart_id, customer_cart_id } = req.body;

    if (!guest_cart_id || !customer_cart_id) {
      return res.status(400).json({
        message: "Both guest cart ID and customer cart ID are required",
      });
    }

    await CartModel.mergeGuestCart(guest_cart_id, customer_cart_id);

    // Get updated customer cart
    const items = await CartModel.getCartDetails(customer_cart_id);
    const summary = await CartModel.getCartSummary(customer_cart_id);

    res.json({
      message: "Carts merged successfully",
      cart_id: customer_cart_id,
      summary,
      items,
    });
  } catch (error) {
    console.error("Error merging carts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getOrCreateCart,
  getCartDetails,
  getCartSummary,
  addToCart,
  updateCartItem,
  removeCartItem,
  decreaseCartItem,
  clearCart,
  validateCart,
  getCartItemCount,
  mergeGuestCart,
};
