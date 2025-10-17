// routes/cart.js
const express = require("express");
const router = express.Router();
const {
  getCartDetails,
  getCartSummary,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartItemCount,
} = require("../controllers/cartController");

// @route   GET /api/cart (with ?customer_id=X)
// @desc    Get cart details with items for customer
// @access  Public
router.get("/", getCartDetails);

// @route   POST /api/cart/items
// @desc    Add item to customer's cart
// @access  Public
router.post("/items", addToCart);

// @route   GET /api/cart/:customerId
// @desc    Get cart details with items
// @access  Public
router.get("/:customerId", getCartDetails);

// @route   GET /api/cart/:customerId/summary
// @desc    Get cart summary
// @access  Public
router.get("/:customerId/summary", getCartSummary);

// @route   GET /api/cart/:customerId/count
// @desc    Get cart item count
// @access  Public
router.get("/:customerId/count", getCartItemCount);

// @route   POST /api/cart/:customerId/items
// @desc    Add item to cart
// @access  Public
router.post("/:customerId/items", addToCart);

// @route   PUT /api/cart/:customerId/items/:variantId
// @desc    Update cart item quantity
// @access  Public
router.put("/:customerId/items/:variantId", updateCartItem);

// @route   DELETE /api/cart/:customerId/items/:variantId
// @desc    Remove item from cart
// @access  Public
router.delete("/:customerId/items/:variantId", removeCartItem);

// @route   DELETE /api/cart/:customerId
// @desc    Clear all items from cart
// @access  Public
router.delete("/:customerId", clearCart);

module.exports = router;
