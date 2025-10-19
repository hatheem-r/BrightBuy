// routes/staff.js
const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const { authenticate, authorizeStaff, authorizeLevel01 } = require("../middleware/authMiddleware");

// Staff management routes (Level01 only)
router.get("/list", authenticate, authorizeLevel01, staffController.getAllStaff);
router.post("/create", authenticate, authorizeLevel01, staffController.createStaff);
router.delete("/:staffId/admin", authenticate, authorizeLevel01, staffController.deleteStaff);

// Staff account management routes (Own account)
router.put("/:staffId", authenticate, authorizeStaff, staffController.updateStaffAccount);
router.delete("/:staffId", authenticate, authorizeStaff, staffController.deleteStaffAccount);

// Inventory management routes (All staff)
router.get("/inventory", authenticate, authorizeStaff, staffController.getInventory);
router.post("/inventory/update", authenticate, authorizeStaff, staffController.updateInventory);

// Customer management routes (All staff)
router.get("/customers", authenticate, authorizeStaff, staffController.getCustomers);
router.get("/customers/:customerId", authenticate, authorizeStaff, staffController.getCustomerDetails);

module.exports = router;
