// models/reportModel.js
const db = require('../config/db');

class ReportModel {
  // Daily Sales Report
  static async getDailySalesReport(startDate, endDate) {
    const sql = `CALL GetDailySalesReport(?, ?)`;
    try {
      const [rows] = await db.query(sql, [startDate, endDate]);
      return rows[0]; // First result set
    } catch (error) {
      throw error;
    }
  }

  // Monthly Sales Report
  static async getMonthlySalesReport(year) {
    const sql = `CALL GetMonthlySalesReport(?)`;
    try {
      const [rows] = await db.query(sql, [year]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Top Products
  static async getTopProducts(limit = 10, days = 30) {
    const sql = `CALL GetTopProducts(?, ?)`;
    try {
      const [rows] = await db.query(sql, [limit, days]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Low Stock Items
  static async getLowStockItems(threshold = 10) {
    const sql = `CALL GetLowStockItems(?)`;
    try {
      const [rows] = await db.query(sql, [threshold]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Category Performance
  static async getCategoryPerformance() {
    const sql = `CALL GetCategoryPerformance()`;
    try {
      const [rows] = await db.query(sql);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Custom Date Range Sales
  static async getSalesOverview(startDate, endDate) {
    const sql = `
      SELECT 
        COUNT(DISTINCT o.order_id) as total_orders,
        COUNT(DISTINCT o.customer_id) as unique_customers,
        SUM(o.total) as total_revenue,
        AVG(o.total) as avg_order_value,
        SUM(o.delivery_fee) as total_delivery_fees,
        COUNT(CASE WHEN o.status = 'paid' THEN 1 END) as completed_orders
      FROM Orders o
      WHERE DATE(o.created_at) BETWEEN ? AND ?
    `;
    try {
      const [rows] = await db.query(sql, [startDate, endDate]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Inventory Summary
  static async getInventorySummary() {
    const sql = `
      SELECT * FROM vw_inventory_report
      ORDER BY stock_status DESC, current_stock ASC
    `;
    try {
      const [rows] = await db.query(sql);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Customer Analysis
  static async getCustomerAnalysis(limit = 100) {
    const sql = `
      SELECT * FROM vw_customer_analysis
      ORDER BY total_spent DESC
      LIMIT ?
    `;
    try {
      const [rows] = await db.query(sql, [limit]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Product Performance
  static async getProductPerformance(limit = 50) {
    const sql = `
      SELECT * FROM vw_product_performance
      WHERE total_orders > 0
      ORDER BY total_revenue DESC
      LIMIT ?
    `;
    try {
      const [rows] = await db.query(sql, [limit]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ReportModel;