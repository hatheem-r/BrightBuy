// routes/reports.js
const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");
const { authenticate, authorizeStaff } = require("../middleware/authMiddleware");

// All report routes require staff authentication (Level01 and Level02)

// Sales Reports
router.get("/top-selling-products", authenticate, authorizeStaff, reportsController.getTopSellingProducts);
router.get("/quarterly-sales", authenticate, authorizeStaff, reportsController.getQuarterlySales);
router.get("/all-quarterly-sales", authenticate, authorizeStaff, reportsController.getAllQuarterlySales);
router.get("/sales-summary", authenticate, authorizeStaff, reportsController.getSalesSummary);

// Customer Reports
router.get("/customer-order-summary", authenticate, authorizeStaff, reportsController.getCustomerOrderSummary);
router.get("/order-delivery-estimate", authenticate, authorizeStaff, reportsController.getOrderDeliveryEstimate);

// Inventory Reports
router.get("/inventory", authenticate, authorizeStaff, reportsController.getInventoryReport);
router.get("/inventory-updates", authenticate, authorizeStaff, reportsController.getInventoryUpdates);

// Category Reports
router.get("/category-orders", authenticate, authorizeStaff, reportsController.getCategoryOrders);

// Helper endpoints
router.get("/available-years", authenticate, authorizeStaff, reportsController.getAvailableYears);
router.get("/available-cities", authenticate, authorizeStaff, reportsController.getAvailableCities);

module.exports = router;
