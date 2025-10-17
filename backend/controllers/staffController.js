// controllers/staffController.js
const bcrypt = require("bcryptjs");
const db = require("../config/db");

// Get all staff members
exports.getAllStaff = async (req, res) => {
  try {
    const [staff] = await db.query(
      `SELECT 
        s.staff_id,
        s.user_name,
        s.email,
        s.phone,
        s.role,
        s.created_at
      FROM Staff s
      ORDER BY s.role, s.created_at DESC`
    );

    res.json({
      success: true,
      staff,
    });
  } catch (error) {
    console.error("Get staff error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Create new staff member
exports.createStaff = async (req, res) => {
  try {
    const { userName, email, password, phone, role } = req.body;

    // Validate input
    if (!userName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Username, email, password, and role are required",
      });
    }

    // Validate role
    if (!["Level01", "Level02"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be Level01 or Level02",
      });
    }

    // Check if email already exists
    const [existingStaff] = await db.query(
      "SELECT staff_id FROM Staff WHERE email = ?",
      [email]
    );

    if (existingStaff.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Check if email exists in users table
    const [existingUsers] = await db.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Start transaction
    await db.query("START TRANSACTION");

    try {
      // Insert into Staff table
      const [staffResult] = await db.query(
        "INSERT INTO Staff (user_name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)",
        [userName, email, passwordHash, phone || null, role]
      );

      const staffId = staffResult.insertId;

      // Insert into users table
      await db.query(
        "INSERT INTO users (email, password_hash, role, is_active, staff_id) VALUES (?, ?, ?, ?, ?)",
        [email, passwordHash, "staff", 1, staffId]
      );

      // Commit transaction
      await db.query("COMMIT");

      res.status(201).json({
        success: true,
        message: "Staff member created successfully",
        staffId,
      });
    } catch (err) {
      // Rollback on error
      await db.query("ROLLBACK");
      throw err;
    }
  } catch (error) {
    console.error("Create staff error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Delete staff member
exports.deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.params;

    // Prevent deletion of own account
    if (parseInt(staffId) === req.user.staffId) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    // Check if staff exists
    const [staff] = await db.query(
      "SELECT staff_id FROM Staff WHERE staff_id = ?",
      [staffId]
    );

    if (staff.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
    }

    // Delete staff (CASCADE will delete user record too)
    await db.query("DELETE FROM Staff WHERE staff_id = ?", [staffId]);

    res.json({
      success: true,
      message: "Staff member deleted successfully",
    });
  } catch (error) {
    console.error("Delete staff error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Get all inventory (products with variants and stock)
exports.getInventory = async (req, res) => {
  try {
    const [inventory] = await db.query(
      `SELECT 
        p.product_id,
        p.name as product_name,
        p.sku,
        pv.variant_id,
        pv.color,
        pv.size,
        pv.price,
        i.quantity as stock,
        i.inventory_id
      FROM Product p
      LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id
      LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
      ORDER BY p.name, pv.color, pv.size`
    );

    res.json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error("Get inventory error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Update inventory
exports.updateInventory = async (req, res) => {
  try {
    const { variantId, quantityChange, notes } = req.body;
    const staffId = req.user.staffId;

    if (!variantId || quantityChange === undefined) {
      return res.status(400).json({
        success: false,
        message: "Variant ID and quantity change are required",
      });
    }

    // Get current inventory
    const [currentInventory] = await db.query(
      "SELECT inventory_id, quantity FROM Inventory WHERE variant_id = ?",
      [variantId]
    );

    if (currentInventory.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found for this variant",
      });
    }

    const currentQuantity = currentInventory[0].quantity;
    const newQuantity = currentQuantity + parseInt(quantityChange);

    if (newQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock. Cannot reduce below 0.",
      });
    }

    await db.query("START TRANSACTION");

    try {
      // Update Inventory table
      await db.query(
        "UPDATE Inventory SET quantity = ? WHERE variant_id = ?",
        [newQuantity, variantId]
      );

      // Insert into Inventory_updates table for tracking
      await db.query(
        "INSERT INTO Inventory_updates (inventory_id, staff_id, quantity_changed, notes) VALUES (?, ?, ?, ?)",
        [currentInventory[0].inventory_id, staffId, quantityChange, notes || null]
      );

      await db.query("COMMIT");

      res.json({
        success: true,
        message: "Inventory updated successfully",
        newQuantity,
      });
    } catch (err) {
      await db.query("ROLLBACK");
      throw err;
    }
  } catch (error) {
    console.error("Update inventory error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const [customers] = await db.query(
      `SELECT 
        c.customer_id,
        c.first_name,
        c.last_name,
        c.email,
        c.phone,
        c.created_at,
        COUNT(DISTINCT o.order_id) as total_orders,
        COALESCE(SUM(oi.quantity * oi.price), 0) as total_spent
      FROM Customer c
      LEFT JOIN \`Order\` o ON c.customer_id = o.customer_id
      LEFT JOIN OrderItem oi ON o.order_id = oi.order_id
      GROUP BY c.customer_id
      ORDER BY total_spent DESC, c.created_at DESC`
    );

    res.json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Get customer details by ID
exports.getCustomerDetails = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Get customer basic info
    const [customer] = await db.query(
      "SELECT * FROM Customer WHERE customer_id = ?",
      [customerId]
    );

    if (customer.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Get customer orders
    const [orders] = await db.query(
      `SELECT 
        o.order_id,
        o.order_date,
        o.total_price,
        o.status,
        COUNT(oi.item_id) as item_count
      FROM \`Order\` o
      LEFT JOIN OrderItem oi ON o.order_id = oi.order_id
      WHERE o.customer_id = ?
      GROUP BY o.order_id
      ORDER BY o.order_date DESC`,
      [customerId]
    );

    // Get customer addresses
    const [addresses] = await db.query(
      "SELECT * FROM Address WHERE customer_id = ?",
      [customerId]
    );

    // Calculate stats
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    res.json({
      success: true,
      customer: {
        ...customer[0],
        totalOrders,
        totalSpent,
        avgOrderValue,
        orders,
        addresses,
      },
    });
  } catch (error) {
    console.error("Get customer details error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
