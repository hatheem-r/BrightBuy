// routes/customer.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { authenticate } = require("../middleware/authMiddleware");

// Get customer profile with addresses
router.get("/:customerId/profile", authenticate, customerController.getCustomerProfile);

// Update customer basic info
router.put("/:customerId/info", authenticate, customerController.updateCustomerInfo);

// Update customer account (full profile)
router.put("/:customerId", authenticate, customerController.updateCustomerAccount);

// Delete customer account
router.delete("/:customerId", authenticate, customerController.deleteCustomerAccount);

// Get default address
router.get(
  "/:customerId/address/default",
  authenticate,
  customerController.getCustomerDefaultAddress
);

// Add or update address
router.post("/:customerId/address", authenticate, customerController.saveCustomerAddress);

// Delete address
router.delete(
  "/:customerId/address/:addressId",
  authenticate,
  customerController.deleteCustomerAddress
);

module.exports = router;
