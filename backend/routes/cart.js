// routes/cart.js
const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/cartController");

// @route   POST /api/cart
// @desc    Get or create cart for customer
// @access  Public
router.post("/", getOrCreateCart);

// @route   POST /api/cart/merge
// @desc    Merge guest cart to customer cart
// @access  Public
router.post("/merge", mergeGuestCart);

// @route   GET /api/cart/:cartId
// @desc    Get cart details with items
// @access  Public
router.get("/:cartId", getCartDetails);

// @route   GET /api/cart/:cartId/summary
// @desc    Get cart summary
// @access  Public
router.get("/:cartId/summary", getCartSummary);

// @route   GET /api/cart/:cartId/count
// @desc    Get cart item count
// @access  Public
router.get("/:cartId/count", getCartItemCount);

// @route   GET /api/cart/:cartId/validate
// @desc    Validate cart before checkout
// @access  Public
router.get("/:cartId/validate", validateCart);

// @route   POST /api/cart/:cartId/items
// @desc    Add item to cart
// @access  Public
router.post("/:cartId/items", addToCart);

// @route   PUT /api/cart/:cartId/items/:variantId
// @desc    Update cart item quantity
// @access  Public
router.put("/:cartId/items/:variantId", updateCartItem);

// @route   POST /api/cart/:cartId/items/:variantId/decrease
// @desc    Decrease item quantity or remove if quantity becomes 0
// @access  Public
router.post("/:cartId/items/:variantId/decrease", decreaseCartItem);

// @route   DELETE /api/cart/:cartId/items/:variantId
// @desc    Remove item from cart
// @access  Public
router.delete("/:cartId/items/:variantId", removeCartItem);

// @route   DELETE /api/cart/:cartId
// @desc    Clear all items from cart
// @access  Public
router.delete("/:cartId", clearCart);

module.exports = router;
