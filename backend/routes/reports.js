const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// All report routes require authentication and staff role (manager/admin)
router.use(authenticate);
router.use(authorize('admin', 'manager'));

// Sales Reports
router.get('/sales/summary', reportController.getSalesSummary);
router.get('/sales/daily', reportController.getDailySalesReport);
router.get('/sales/monthly', reportController.getMonthlySalesReport);

// Product Reports
router.get('/products/top', reportController.getTopProducts);
router.get('/products/performance', reportController.getProductPerformance);

// Inventory Reports
router.get('/inventory/summary', reportController.getInventorySummary);
router.get('/inventory/low-stock', reportController.getLowStockAlert);

// Category Reports
router.get('/categories/performance', reportController.getCategoryPerformance);

// Customer Reports
router.get('/customers/analysis', reportController.getCustomerAnalysis);

module.exports = router;
