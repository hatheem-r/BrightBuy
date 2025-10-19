const ReportModel = require('../models/reportModel');

class ReportController {
  static async getSalesSummary(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'startDate and endDate are required'
        });
      }

      const db = require('../config/db');
      const [rows] = await db.query(`
        SELECT 
          COUNT(DISTINCT o.order_id) as total_orders,
          COUNT(DISTINCT o.customer_id) as unique_customers,
          SUM(o.total) as total_revenue,
          AVG(o.total) as avg_order_value,
          SUM(o.delivery_fee) as total_delivery_fees,
          COUNT(CASE WHEN o.status = 'paid' THEN 1 END) as completed_orders
        FROM Orders o
        WHERE DATE(o.created_at) BETWEEN ? AND ?
      `, [startDate, endDate]);

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error fetching sales summary:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching sales summary',
        error: error.message
      });
    }
  }

  static async getDailySalesReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'startDate and endDate are required'
        });
      }

      const db = require('../config/db');
      const [rows] = await db.query(`
        SELECT 
          DATE(o.created_at) as sale_date,
          COUNT(DISTINCT o.order_id) as total_orders,
          COUNT(DISTINCT o.customer_id) as unique_customers,
          SUM(o.total) as total_revenue,
          SUM(o.delivery_fee) as total_delivery_fees,
          AVG(o.total) as avg_order_value,
          COUNT(CASE WHEN o.status = 'paid' THEN 1 END) as completed_orders
        FROM Orders o
        WHERE DATE(o.created_at) BETWEEN ? AND ?
        GROUP BY DATE(o.created_at)
        ORDER BY sale_date DESC
      `, [startDate, endDate]);

      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error fetching daily sales report:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching report',
        error: error.message
      });
    }
  }

  static async getMonthlySalesReport(req, res) {
    try {
      const { year } = req.query;
      
      if (!year) {
        return res.status(400).json({ success: false, message: 'year is required' });
      }

      const db = require('../config/db');
      const [rows] = await db.query(`
        SELECT 
          MONTH(o.created_at) as month,
          MONTHNAME(o.created_at) as month_name,
          COUNT(DISTINCT o.order_id) as total_orders,
          COUNT(DISTINCT o.customer_id) as unique_customers,
          SUM(o.total) as total_revenue,
          SUM(o.delivery_fee) as total_delivery_fees,
          AVG(o.total) as avg_order_value
        FROM Orders o
        WHERE YEAR(o.created_at) = ?
        GROUP BY MONTH(o.created_at), MONTHNAME(o.created_at)
        ORDER BY MONTH(o.created_at)
      `, [year]);

      res.json({ success: true, data: rows, year });
    } catch (error) {
      console.error('Error fetching monthly sales report:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching report',
        error: error.message
      });
    }
  }

  static async getTopProducts(req, res) {
    try {
      const { limit = 10, days = 30 } = req.query;
      const db = require('../config/db');

      const [rows] = await db.query(`
        SELECT 
          p.product_id,
          p.name as product_name,
          p.brand,
          SUM(oi.quantity) as units_sold,
          SUM(oi.quantity * oi.unit_price) as revenue,
          COUNT(DISTINCT oi.order_id) as order_count,
          AVG(oi.unit_price) as avg_price
        FROM Product p
        INNER JOIN ProductVariant pv ON p.product_id = pv.product_id
        INNER JOIN Order_item oi ON pv.variant_id = oi.variant_id
        INNER JOIN Orders o ON oi.order_id = o.order_id
        WHERE DATE(o.created_at) >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY p.product_id, p.name, p.brand
        ORDER BY revenue DESC
        LIMIT ?
      `, [days, parseInt(limit)]);

      res.json({
        success: true,
        data: rows,
        period: `Last ${days} days`,
        count: rows.length
      });
    } catch (error) {
      console.error('Error fetching top products:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching report',
        error: error.message
      });
    }
  }

  static async getInventorySummary(req, res) {
    try {
      const db = require('../config/db');

      const [rows] = await db.query(`
        SELECT 
          pv.variant_id,
          p.product_id,
          p.name as product_name,
          p.brand,
          pv.sku,
          pv.color,
          pv.size,
          pv.price,
          i.quantity as current_stock,
          CASE 
            WHEN i.quantity = 0 THEN 'Out of Stock'
            WHEN i.quantity < 5 THEN 'Critical'
            WHEN i.quantity < 20 THEN 'Low'
            ELSE 'In Stock'
          END as stock_status,
          (pv.price * i.quantity) as total_value
        FROM ProductVariant pv
        LEFT JOIN Product p ON pv.product_id = p.product_id
        LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
        ORDER BY stock_status DESC, current_stock ASC
      `);

      res.json({ success: true, data: rows });
    } catch (error) {
      console.error('Error fetching inventory summary:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching report',
        error: error.message
      });
    }
  }

  static async getLowStockAlert(req, res) {
    try {
      const { threshold = 10 } = req.query;
      const db = require('../config/db');

      const [rows] = await db.query(`
        SELECT 
          pv.variant_id,
          p.product_id,
          p.name as product_name,
          p.brand,
          pv.sku,
          pv.color,
          i.quantity as current_stock,
          pv.price,
          (pv.price * i.quantity) as total_value
        FROM ProductVariant pv
        INNER JOIN Product p ON pv.product_id = p.product_id
        INNER JOIN Inventory i ON pv.variant_id = i.variant_id
        WHERE i.quantity <= ?
        ORDER BY i.quantity ASC
      `, [threshold]);

      res.json({
        success: true,
        data: rows,
        threshold,
        alertCount: rows.length
      });
    } catch (error) {
      console.error('Error fetching low stock alert:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching report',
        error: error.message
      });
    }
  }

  static async getProductPerformance(req, res) {
    try {
      const { limit = 50 } = req.query;
      const db = require('../config/db');

      const [rows] = await db.query(`
        SELECT 
          p.product_id,
          p.name as product_name,
          p.brand,
          COUNT(DISTINCT oi.order_id) as total_orders,
          SUM(oi.quantity) as total_units_sold,
          SUM(oi.quantity * oi.unit_price) as total_revenue,
          AVG(oi.unit_price) as avg_unit_price,
          MIN(o.created_at) as first_sale_date,
          MAX(o.created_at) as last_sale_date
        FROM Product p
        LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id
        LEFT JOIN Order_item oi ON pv.variant_id = oi.variant_id
        LEFT JOIN Orders o ON oi.order_id = o.order_id
        WHERE oi.order_id IS NOT NULL
        GROUP BY p.product_id, p.name, p.brand
        ORDER BY total_revenue DESC
        LIMIT ?
      `, [parseInt(limit)]);

      res.json({ success: true, data: rows });
    } catch (error) {
      console.error('Error fetching product performance:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching report',
        error: error.message
      });
    }
  }

  static async getCategoryPerformance(req, res) {
    try {
      const db = require('../config/db');

      const [rows] = await db.query(`
        SELECT 
          c.category_id,
          c.name as category_name,
          COUNT(DISTINCT p.product_id) as total_products,
          SUM(oi.quantity) as units_sold,
          SUM(oi.quantity * oi.unit_price) as total_revenue,
          AVG(oi.unit_price) as avg_price
        FROM Category c
        LEFT JOIN ProductCategory pc ON c.category_id = pc.category_id
        LEFT JOIN Product p ON pc.product_id = p.product_id
        LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id
        LEFT JOIN Order_item oi ON pv.variant_id = oi.variant_id
        WHERE c.parent_id IS NULL
        GROUP BY c.category_id, c.name
        ORDER BY total_revenue DESC
      `);

      res.json({ success: true, data: rows });
    } catch (error) {
      console.error('Error fetching category performance:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching report',
        error: error.message
      });
    }
  }

  static async getCustomerAnalysis(req, res) {
    try {
      const { limit = 100 } = req.query;
      const db = require('../config/db');

      const [rows] = await db.query(`
        SELECT 
          c.customer_id,
          CONCAT(c.first_name, ' ', c.last_name) as customer_name,
          c.email,
          c.phone,
          c.created_at as registration_date,
          COUNT(DISTINCT o.order_id) as total_orders,
          COALESCE(SUM(o.total), 0) as total_spent,
          AVG(o.total) as avg_order_value,
          MAX(o.created_at) as last_order_date
        FROM Customer c
        LEFT JOIN Orders o ON c.customer_id = o.customer_id
        GROUP BY c.customer_id, c.first_name, c.last_name, c.email, c.phone, c.created_at
        ORDER BY total_spent DESC
        LIMIT ?
      `, [parseInt(limit)]);

      res.json({ success: true, data: rows });
    } catch (error) {
      console.error('Error fetching customer analysis:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching report',
        error: error.message
      });
    }
  }
}

module.exports = ReportController;
