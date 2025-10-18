// controllers/reportsController.js
const db = require("../config/db");
const XLSX = require("xlsx");

/**
 * Get Top Selling Products Report
 * Uses stored procedure: GetTopSellingProducts
 */
exports.getTopSellingProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;

    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    console.log("Fetching top selling products:", { startDate, endDate, limit });

    // Call stored procedure
    const [results] = await db.query(
      "CALL GetTopSellingProducts(?, ?, ?)",
      [startDate, endDate, parseInt(limit)]
    );

    res.json({
      success: true,
      data: results[0], // First result set from procedure
      period: { startDate, endDate },
    });
  } catch (error) {
    console.error("Get top selling products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top selling products report",
      error: error.message,
    });
  }
};

/**
 * Get Quarterly Sales Report
 * Uses stored procedure: GetQuarterlySalesByYear
 */
exports.getQuarterlySales = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year is required",
      });
    }

    console.log("Fetching quarterly sales for year:", year);

    // Call stored procedure
    const [results] = await db.query(
      "CALL GetQuarterlySalesByYear(?)",
      [parseInt(year)]
    );

    res.json({
      success: true,
      data: results[0], // First result set from procedure
      year: parseInt(year),
    });
  } catch (error) {
    console.error("Get quarterly sales error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quarterly sales report",
      error: error.message,
    });
  }
};

/**
 * Get Category Orders Report
 * Uses view: Staff_CategoryOrders
 */
exports.getCategoryOrders = async (req, res) => {
  try {
    console.log("Fetching category orders report");

    const [results] = await db.query(
      `SELECT 
        category_id,
        category_name,
        total_orders
      FROM Staff_CategoryOrders
      ORDER BY total_orders DESC`
    );

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Get category orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category orders report",
      error: error.message,
    });
  }
};

/**
 * Get Customer Order Summary Report
 * Uses view: Staff_CustomerOrderSummary
 */
exports.getCustomerOrderSummary = async (req, res) => {
  try {
    const { limit = 50, minOrders = 0 } = req.query;

    console.log("Fetching customer order summary:", { limit, minOrders });

    const [results] = await db.query(
      `SELECT 
        customer_id,
        customer_name,
        total_orders,
        total_spent,
        payment_statuses
      FROM Staff_CustomerOrderSummary
      WHERE total_orders >= ?
      ORDER BY total_spent DESC
      LIMIT ?`,
      [parseInt(minOrders), parseInt(limit)]
    );

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Get customer order summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer order summary report",
      error: error.message,
    });
  }
};

/**
 * Get Order Delivery Estimate Report
 * Uses view: Staff_OrderDeliveryEstimate
 */
exports.getOrderDeliveryEstimate = async (req, res) => {
  try {
    const { city, limit = 100 } = req.query;

    console.log("Fetching order delivery estimates:", { city, limit });

    let query = `
      SELECT 
        order_id,
        customer_id,
        city,
        zip_code,
        estimated_delivery_days,
        order_date,
        DATE_ADD(order_date, INTERVAL estimated_delivery_days DAY) as estimated_delivery_date
      FROM Staff_OrderDeliveryEstimate
    `;

    const params = [];

    if (city) {
      query += " WHERE city = ?";
      params.push(city);
    }

    query += " ORDER BY order_date DESC LIMIT ?";
    params.push(parseInt(limit));

    const [results] = await db.query(query, params);

    res.json({
      success: true,
      data: results,
      filters: { city: city || 'all' },
    });
  } catch (error) {
    console.error("Get order delivery estimate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order delivery estimate report",
      error: error.message,
    });
  }
};

/**
 * Get All Years Quarterly Sales Report
 * Uses view: Staff_QuarterlySales
 */
exports.getAllQuarterlySales = async (req, res) => {
  try {
    console.log("Fetching all quarterly sales data");

    const [results] = await db.query(
      `SELECT 
        year,
        quarter,
        total_sales,
        total_orders
      FROM Staff_QuarterlySales
      ORDER BY year DESC, quarter DESC`
    );

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Get all quarterly sales error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quarterly sales report",
      error: error.message,
    });
  }
};

/**
 * Get Sales Summary Report
 * Custom report combining multiple data points
 */
exports.getSalesSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    console.log("Fetching sales summary:", { startDate, endDate });

    // Build date filter
    let dateFilter = "";
    const params = [];

    if (startDate && endDate) {
      dateFilter = "WHERE o.created_at BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    // Get total sales and orders
    const [salesStats] = await db.query(
      `SELECT 
        COUNT(DISTINCT o.order_id) as total_orders,
        COUNT(DISTINCT o.customer_id) as unique_customers,
        SUM(oi.quantity * oi.unit_price) as total_revenue,
        AVG(oi.quantity * oi.unit_price) as avg_order_value
      FROM Orders o
      JOIN Order_item oi ON o.order_id = oi.order_id
      ${dateFilter}`,
      params
    );

    // Get top selling category
    const [topCategory] = await db.query(
      `SELECT 
        c.name as category_name,
        COUNT(DISTINCT oi.order_id) as order_count
      FROM Order_item oi
      JOIN ProductVariant pv ON oi.variant_id = pv.variant_id
      JOIN ProductCategory pc ON pv.product_id = pc.product_id
      JOIN Category c ON pc.category_id = c.category_id
      JOIN Orders o ON oi.order_id = o.order_id
      ${dateFilter}
      GROUP BY c.category_id, c.name
      ORDER BY order_count DESC
      LIMIT 1`,
      params
    );

    // Get inventory status
    const [inventoryStats] = await db.query(
      `SELECT 
        COUNT(*) as total_variants,
        SUM(CASE WHEN quantity > 0 THEN 1 ELSE 0 END) as in_stock,
        SUM(CASE WHEN quantity = 0 THEN 1 ELSE 0 END) as out_of_stock,
        SUM(CASE WHEN quantity < 10 AND quantity > 0 THEN 1 ELSE 0 END) as low_stock
      FROM Inventory`
    );

    res.json({
      success: true,
      data: {
        sales: salesStats[0],
        topCategory: topCategory[0] || null,
        inventory: inventoryStats[0],
      },
      period: startDate && endDate ? { startDate, endDate } : 'all_time',
    });
  } catch (error) {
    console.error("Get sales summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales summary report",
      error: error.message,
    });
  }
};

/**
 * Get Inventory Status Report
 * Detailed inventory analysis
 */
exports.getInventoryReport = async (req, res) => {
  try {
    const { status, limit = 100 } = req.query;

    console.log("Fetching inventory report:", { status, limit });

    let whereClause = "";
    
    switch(status) {
      case 'out_of_stock':
        whereClause = "WHERE i.quantity = 0";
        break;
      case 'low_stock':
        whereClause = "WHERE i.quantity > 0 AND i.quantity < 10";
        break;
      case 'in_stock':
        whereClause = "WHERE i.quantity >= 10";
        break;
      default:
        whereClause = "";
    }

    const [results] = await db.query(
      `SELECT 
        p.product_id,
        p.name as product_name,
        p.brand,
        pv.variant_id,
        pv.sku,
        pv.color,
        pv.size,
        pv.price,
        COALESCE(i.quantity, 0) as stock,
        CASE 
          WHEN i.quantity = 0 THEN 'Out of Stock'
          WHEN i.quantity < 10 THEN 'Low Stock'
          ELSE 'In Stock'
        END as status
      FROM Product p
      JOIN ProductVariant pv ON p.product_id = pv.product_id
      LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
      ${whereClause}
      ORDER BY i.quantity ASC, p.name
      LIMIT ?`,
      [parseInt(limit)]
    );

    res.json({
      success: true,
      data: results,
      filters: { status: status || 'all' },
    });
  } catch (error) {
    console.error("Get inventory report error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory report",
      error: error.message,
    });
  }
};

/**
 * Get Recent Inventory Updates Report
 * Shows staff inventory management activity
 */
exports.getInventoryUpdates = async (req, res) => {
  try {
    const { days = 30, limit = 50 } = req.query;

    console.log("Fetching inventory updates:", { days, limit });

    const [results] = await db.query(
      `SELECT 
        iu.update_id,
        iu.updated_time,
        iu.old_quantity,
        iu.added_quantity,
        iu.note,
        s.user_name as staff_name,
        s.email as staff_email,
        p.name as product_name,
        pv.sku,
        pv.color,
        pv.size
      FROM Inventory_updates iu
      JOIN Staff s ON iu.staff_id = s.staff_id
      JOIN ProductVariant pv ON iu.variant_id = pv.variant_id
      JOIN Product p ON pv.product_id = p.product_id
      WHERE iu.updated_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ORDER BY iu.updated_time DESC
      LIMIT ?`,
      [parseInt(days), parseInt(limit)]
    );

    res.json({
      success: true,
      data: results,
      filters: { days: parseInt(days) },
    });
  } catch (error) {
    console.error("Get inventory updates error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory updates report",
      error: error.message,
    });
  }
};

/**
 * Get Available Years for Reports
 * Helper endpoint to get years with order data
 */
exports.getAvailableYears = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT DISTINCT YEAR(created_at) as year
      FROM Orders
      ORDER BY year DESC`
    );

    const years = results.map(r => r.year);

    res.json({
      success: true,
      years,
    });
  } catch (error) {
    console.error("Get available years error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available years",
      error: error.message,
    });
  }
};

/**
 * Get Available Cities for Reports
 * Helper endpoint to get cities from addresses
 */
exports.getAvailableCities = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT DISTINCT city
      FROM Address
      WHERE city IS NOT NULL
      ORDER BY city`
    );

    const cities = results.map(r => r.city);

    res.json({
      success: true,
      cities,
    });
  } catch (error) {
    console.error("Get available cities error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available cities",
      error: error.message,
    });
  }
};

// ============================================
// XLSX EXPORT FUNCTIONS
// ============================================

/**
 * Export Top Selling Products to XLSX
 */
exports.exportTopSellingProductsXLSX = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const [results] = await db.query(
      "CALL GetTopSellingProducts(?, ?, ?)",
      [startDate, endDate, parseInt(limit)]
    );

    const data = results[0];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data, {
      header: ["product_id", "product_name", "total_quantity_sold", "total_sales"]
    });

    // Set column widths
    ws['!cols'] = [
      { wch: 12 }, // product_id
      { wch: 40 }, // product_name
      { wch: 18 }, // total_quantity_sold
      { wch: 15 }  // total_sales
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Top Selling Products");

    // Generate buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Set headers for file download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="top-selling-products-${startDate}-to-${endDate}.xlsx"`);

    res.send(buffer);
  } catch (error) {
    console.error("Export top selling products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export top selling products",
      error: error.message,
    });
  }
};

/**
 * Export Quarterly Sales to XLSX
 */
exports.exportQuarterlySalesXLSX = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year is required",
      });
    }

    const [results] = await db.query(
      "CALL GetQuarterlySalesByYear(?)",
      [parseInt(year)]
    );

    const data = results[0];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data, {
      header: ["quarter", "total_sales", "total_orders"]
    });

    ws['!cols'] = [
      { wch: 10 },
      { wch: 15 },
      { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, `Quarterly Sales ${year}`);

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="quarterly-sales-${year}.xlsx"`);

    res.send(buffer);
  } catch (error) {
    console.error("Export quarterly sales error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export quarterly sales",
      error: error.message,
    });
  }
};

/**
 * Export Category Orders to XLSX
 */
exports.exportCategoryOrdersXLSX = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT 
        category_id,
        category_name,
        total_orders
      FROM Staff_CategoryOrders
      ORDER BY total_orders DESC`
    );

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(results, {
      header: ["category_id", "category_name", "total_orders"]
    });

    ws['!cols'] = [
      { wch: 12 },
      { wch: 30 },
      { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Category Orders");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="category-orders-${new Date().toISOString().split('T')[0]}.xlsx"`);

    res.send(buffer);
  } catch (error) {
    console.error("Export category orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export category orders",
      error: error.message,
    });
  }
};

/**
 * Export Customer Order Summary to XLSX
 */
exports.exportCustomerOrderSummaryXLSX = async (req, res) => {
  try {
    const { limit = 50, minOrders = 0 } = req.query;

    const [results] = await db.query(
      `SELECT 
        customer_id,
        customer_name,
        total_orders,
        total_spent,
        payment_statuses
      FROM Staff_CustomerOrderSummary
      WHERE total_orders >= ?
      ORDER BY total_spent DESC
      LIMIT ?`,
      [parseInt(minOrders), parseInt(limit)]
    );

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(results, {
      header: ["customer_id", "customer_name", "total_orders", "total_spent", "payment_statuses"]
    });

    ws['!cols'] = [
      { wch: 12 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 50 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Customer Order Summary");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="customer-order-summary-${new Date().toISOString().split('T')[0]}.xlsx"`);

    res.send(buffer);
  } catch (error) {
    console.error("Export customer order summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export customer order summary",
      error: error.message,
    });
  }
};

/**
 * Export Order Delivery Estimates to XLSX
 */
exports.exportOrderDeliveryEstimateXLSX = async (req, res) => {
  try {
    const { city, limit = 100 } = req.query;

    let query = `
      SELECT 
        order_id,
        customer_id,
        city,
        zip_code,
        estimated_delivery_days,
        order_date,
        DATE_ADD(order_date, INTERVAL estimated_delivery_days DAY) as estimated_delivery_date
      FROM Staff_OrderDeliveryEstimate
    `;

    const params = [];

    if (city) {
      query += " WHERE city = ?";
      params.push(city);
    }

    query += " ORDER BY order_date DESC LIMIT ?";
    params.push(parseInt(limit));

    const [results] = await db.query(query, params);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(results, {
      header: ["order_id", "customer_id", "city", "zip_code", "estimated_delivery_days", "order_date", "estimated_delivery_date"]
    });

    ws['!cols'] = [
      { wch: 12 },
      { wch: 12 },
      { wch: 20 },
      { wch: 12 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Delivery Estimates");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    const cityLabel = city ? `-${city}` : '';
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="delivery-estimates${cityLabel}-${new Date().toISOString().split('T')[0]}.xlsx"`);

    res.send(buffer);
  } catch (error) {
    console.error("Export delivery estimates error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export delivery estimates",
      error: error.message,
    });
  }
};

/**
 * Export Sales Summary to XLSX
 */
exports.exportSalesSummaryXLSX = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = "";
    const params = [];

    if (startDate && endDate) {
      dateFilter = "WHERE o.created_at BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    // Get sales data
    const [salesStats] = await db.query(
      `SELECT 
        COUNT(DISTINCT o.order_id) as total_orders,
        COUNT(DISTINCT o.customer_id) as unique_customers,
        SUM(oi.quantity * oi.unit_price) as total_revenue,
        AVG(oi.quantity * oi.unit_price) as avg_order_value
      FROM Orders o
      JOIN Order_item oi ON o.order_id = oi.order_id
      ${dateFilter}`,
      params
    );

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(salesStats, {
      header: ["total_orders", "unique_customers", "total_revenue", "avg_order_value"]
    });

    ws['!cols'] = [
      { wch: 15 },
      { wch: 18 },
      { wch: 15 },
      { wch: 18 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Sales Summary");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    const dateLabel = startDate && endDate ? `-${startDate}-to-${endDate}` : '';
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="sales-summary${dateLabel}.xlsx"`);

    res.send(buffer);
  } catch (error) {
    console.error("Export sales summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export sales summary",
      error: error.message,
    });
  }
};

/**
 * Export Inventory Report to XLSX
 */
exports.exportInventoryReportXLSX = async (req, res) => {
  try {
    const { status, limit = 100 } = req.query;

    let whereClause = "";
    
    switch(status) {
      case 'out_of_stock':
        whereClause = "WHERE i.quantity = 0";
        break;
      case 'low_stock':
        whereClause = "WHERE i.quantity > 0 AND i.quantity < 10";
        break;
      case 'in_stock':
        whereClause = "WHERE i.quantity >= 10";
        break;
      default:
        whereClause = "";
    }

    const [results] = await db.query(
      `SELECT 
        p.product_id,
        p.name as product_name,
        p.brand,
        pv.variant_id,
        pv.sku,
        pv.color,
        pv.size,
        pv.price,
        COALESCE(i.quantity, 0) as stock,
        CASE 
          WHEN i.quantity = 0 THEN 'Out of Stock'
          WHEN i.quantity < 10 THEN 'Low Stock'
          ELSE 'In Stock'
        END as status
      FROM Product p
      JOIN ProductVariant pv ON p.product_id = pv.product_id
      LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
      ${whereClause}
      ORDER BY i.quantity ASC, p.name
      LIMIT ?`,
      [parseInt(limit)]
    );

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(results, {
      header: ["product_id", "product_name", "brand", "variant_id", "sku", "color", "size", "price", "stock", "status"]
    });

    ws['!cols'] = [
      { wch: 12 },
      { wch: 30 },
      { wch: 20 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
      { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Inventory Report");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    const statusLabel = status ? `-${status}` : '';
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="inventory-report${statusLabel}-${new Date().toISOString().split('T')[0]}.xlsx"`);

    res.send(buffer);
  } catch (error) {
    console.error("Export inventory report error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export inventory report",
      error: error.message,
    });
  }
};

/**
 * Export Inventory Updates to XLSX
 */
exports.exportInventoryUpdatesXLSX = async (req, res) => {
  try {
    const { days = 30, limit = 50 } = req.query;

    const [results] = await db.query(
      `SELECT 
        iu.update_id,
        iu.updated_time,
        iu.old_quantity,
        iu.added_quantity,
        iu.note,
        s.user_name as staff_name,
        s.email as staff_email,
        p.name as product_name,
        pv.sku,
        pv.color,
        pv.size
      FROM Inventory_updates iu
      JOIN Staff s ON iu.staff_id = s.staff_id
      JOIN ProductVariant pv ON iu.variant_id = pv.variant_id
      JOIN Product p ON pv.product_id = p.product_id
      WHERE iu.updated_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ORDER BY iu.updated_time DESC
      LIMIT ?`,
      [parseInt(days), parseInt(limit)]
    );

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(results, {
      header: ["update_id", "updated_time", "old_quantity", "added_quantity", "note", "staff_name", "staff_email", "product_name", "sku", "color", "size"]
    });

    ws['!cols'] = [
      { wch: 12 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 20 },
      { wch: 25 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Inventory Updates");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="inventory-updates-last-${days}-days-${new Date().toISOString().split('T')[0]}.xlsx"`);

    res.send(buffer);
  } catch (error) {
    console.error("Export inventory updates error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export inventory updates",
      error: error.message,
    });
  }
};
