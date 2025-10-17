const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/authMiddleware");

// Create a new order
router.post("/", authenticate, orderController.createOrder);

// Get order by ID
router.get("/:order_id", authenticate, orderController.getOrderById);

// Get orders by customer ID
router.get(
  "/customer/:customer_id",
  authenticate,
  orderController.getOrdersByCustomer
);

// Update order status
router.patch(
  "/:order_id/status",
  authenticate,
  orderController.updateOrderStatus
);

module.exports = router;
