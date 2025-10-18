// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists and get name from Customer or Staff table
    const [users] = await db.query(
      `SELECT 
        u.user_id, 
        u.email, 
        u.password_hash, 
        u.role, 
        u.is_active, 
        u.customer_id,
        u.staff_id,
        COALESCE(CONCAT(c.first_name, ' ', c.last_name), s.user_name) as name,
        s.role as staff_level
       FROM users u
       LEFT JOIN Customer c ON u.customer_id = c.customer_id
       LEFT JOIN Staff s ON u.staff_id = s.staff_id
       WHERE u.email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive. Please contact support.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    await db.query(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?",
      [user.user_id]
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        role: user.role,
        customerId: user.customer_id || null,
        staffId: user.staff_id || null,
        staffLevel: user.staff_level || null,
      },
      process.env.JWT_SECRET || "your-secret-key-change-in-production",
      { expiresIn: "7d" }
    );

    // Return success response with token and user info
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        customer_id: user.customer_id || null,
        staff_id: user.staff_id || null,
        staff_level: user.staff_level || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Register controller
exports.register = async (req, res) => {
  console.log("\n=== SIGNUP/REGISTER REQUEST ===");
  console.log("Request body received:", req.body);

  try {
    const { name, email, password, phone } = req.body;

    console.log("Extracted data:");
    console.log("  - Name:", name);
    console.log("  - Email:", email);
    console.log(
      "  - Password:",
      password ? "***" + password.slice(-3) : "undefined"
    );
    console.log("  - Phone:", phone || "not provided");

    // Validate input
    if (!name || !email || !password) {
      console.log("❌ Validation failed: Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    console.log("✓ Validation passed");

    // Check if user already exists
    console.log("Checking if user exists with email:", email);
    const [existingUsers] = await db.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      console.log("❌ User already exists with this email");
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    console.log("✓ Email is available");

    // Hash password
    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    console.log("✓ Password hashed successfully");

    // Split name into first_name and last_name
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    const userName = email.split("@")[0]; // Use email prefix as username

    console.log("Name processing:");
    console.log("  - First name:", firstName);
    console.log("  - Last name:", lastName);
    console.log("  - Username:", userName);

    // Start transaction
    console.log("Starting database transaction...");
    await db.query("START TRANSACTION");

    try {
      // Insert into Customer table first
      console.log("Inserting into Customer table...");
      const [customerResult] = await db.query(
        "INSERT INTO Customer (first_name, last_name, user_name, password_hash, email, phone) VALUES (?, ?, ?, ?, ?, ?)",
        [firstName, lastName, userName, passwordHash, email, phone || null]
      );

      const customerId = customerResult.insertId;
      console.log("✓ Customer created with ID:", customerId);

      // VERIFY: Check if customer was actually saved
      console.log("\n📊 VERIFYING Customer record in database...");
      const [customerCheck] = await db.query(
        "SELECT customer_id, first_name, last_name, email, user_name FROM Customer WHERE customer_id = ?",
        [customerId]
      );
      console.log("Database: brightbuy | Table: Customer");
      console.log(
        "Customer record found:",
        customerCheck.length > 0 ? "YES ✓" : "NO ✗"
      );
      if (customerCheck.length > 0) {
        console.log("Customer data:", customerCheck[0]);
      }

      // Insert into users table linking to customer
      console.log("\nInserting into users table...");
      const [userResult] = await db.query(
        "INSERT INTO users (email, password_hash, role, customer_id, staff_id) VALUES (?, ?, ?, ?, ?)",
        [email, passwordHash, "customer", customerId, null]
      );

      console.log("✓ User created with ID:", userResult.insertId);

      // VERIFY: Check if user was actually saved
      console.log("\n📊 VERIFYING User record in database...");
      const [userCheck] = await db.query(
        "SELECT user_id, email, role, customer_id, staff_id, is_active FROM users WHERE user_id = ?",
        [userResult.insertId]
      );
      console.log("Database: brightbuy | Table: users");
      console.log(
        "User record found:",
        userCheck.length > 0 ? "YES ✓" : "NO ✗"
      );
      if (userCheck.length > 0) {
        console.log("User data:", userCheck[0]);
      }

      // Commit transaction
      await db.query("COMMIT");
      console.log("\n✓ Transaction committed successfully");

      // FINAL VERIFICATION: Check both records after commit
      console.log("\n📊 FINAL VERIFICATION after COMMIT...");
      const [finalCustomerCheck] = await db.query(
        "SELECT customer_id, first_name, last_name, email FROM Customer WHERE customer_id = ?",
        [customerId]
      );
      const [finalUserCheck] = await db.query(
        "SELECT user_id, email, role, customer_id FROM users WHERE user_id = ?",
        [userResult.insertId]
      );
      console.log(
        "Customer still in DB:",
        finalCustomerCheck.length > 0 ? "YES ✓" : "NO ✗"
      );
      console.log(
        "User still in DB:",
        finalUserCheck.length > 0 ? "YES ✓" : "NO ✗"
      );

      // Also check total count in tables
      const [customerCount] = await db.query(
        "SELECT COUNT(*) as count FROM Customer"
      );
      const [userCount] = await db.query("SELECT COUNT(*) as count FROM users");
      console.log("Total Customers in DB:", customerCount[0].count);
      console.log("Total Users in DB:", userCount[0].count);
      console.log("");

      // Generate JWT token
      console.log("Generating JWT token...");
      const token = jwt.sign(
        {
          userId: userResult.insertId,
          email: email,
          role: "customer",
        },
        process.env.JWT_SECRET || "your-secret-key-change-in-production",
        { expiresIn: "7d" }
      );
      console.log("✓ JWT token generated");

      const responseData = {
        success: true,
        message: "Registration successful",
        token,
        user: {
          id: userResult.insertId,
          name,
          email,
          role: "customer",
        },
      };

      console.log("✅ Registration successful! Sending response:", {
        ...responseData,
        token: "JWT_TOKEN_" + token.slice(-10),
      });
      console.log("=== END SIGNUP REQUEST ===\n");

      res.status(201).json(responseData);
    } catch (err) {
      // Rollback on error
      console.log("❌ Error during transaction, rolling back...");
      await db.query("ROLLBACK");
      console.log("Transaction rolled back");
      throw err;
    }
  } catch (error) {
    console.error("❌ Registration error:", error);
    console.log("Error details:", {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
    });
    console.log("=== END SIGNUP REQUEST (ERROR) ===\n");
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Get current user info (for authenticated users)
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [users] = await db.query(
      `SELECT 
        u.user_id, 
        u.email, 
        u.role, 
        u.is_active, 
        u.created_at, 
        u.last_login,
        u.customer_id,
        u.staff_id,
        COALESCE(CONCAT(c.first_name, ' ', c.last_name), s.user_name) as name,
        COALESCE(c.phone, s.phone) as phone
       FROM users u
       LEFT JOIN Customer c ON u.customer_id = c.customer_id
       LEFT JOIN Staff s ON u.staff_id = s.staff_id
       WHERE u.user_id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: users[0].user_id,
        name: users[0].name,
        email: users[0].email,
        role: users[0].role,
        phone: users[0].phone,
        customer_id: users[0].customer_id,
        staff_id: users[0].staff_id,
        createdAt: users[0].created_at,
        lastLogin: users[0].last_login,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
