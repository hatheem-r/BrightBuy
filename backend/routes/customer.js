// routes/customer.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// Get customer profile with addresses
router.get("/:customerId/profile", customerController.getCustomerProfile);

// Update customer basic info
router.put("/:customerId/info", customerController.updateCustomerInfo);

// Get default address
router.get(
  "/:customerId/address/default",
  customerController.getCustomerDefaultAddress
);

// Add or update address
router.post("/:customerId/address", customerController.saveCustomerAddress);

// Delete address
router.delete(
  "/:customerId/address/:addressId",
  customerController.deleteCustomerAddress
);

module.exports = router;
