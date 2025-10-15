// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // Your MySQL connection pool

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // 1. Basic Validation
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required" });
  }

  try {
    // 2. Check if user already exists
    const [existingUsers] = await db.query("SELECT user_id FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Insert the new user into the database
    const [result] = await db.query(
      "INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, passwordHash, phone || null, "customer"]
    );
    const newUserId = result.insertId;

    // 5. Generate a JWT token for immediate login
    const token = jwt.sign({ userId: newUserId, email: email, role: "customer" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // 6. Send success response
    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: { id: newUserId, name, email, role: "customer" },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// @desc    Authenticate a user and get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Login attempt: Missing email or password.");
    return res.status(400).json({ success: false, message: "Please enter email and password" });
  }

  try {
    console.log(`Login attempt for email: ${email}`);
    // 1. Find user by email
    const [users] = await db.query("SELECT user_id, name, email, password_hash, role, is_active FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      console.log(`Login failed: User with email ${email} not found.`);
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const user = users[0];
    console.log("User found:", { id: user.user_id, email: user.email, role: user.role, is_active: user.is_active });

    // 2. Check if account is active
    if (!user.is_active) {
      console.log(`Login failed: Account for ${email} is inactive.`);
      return res.status(403).json({ success: false, message: "Account is inactive. Please contact support." });
    }

    // 3. Compare submitted password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log(`Password comparison result for ${email}: ${isMatch}`);
    if (!isMatch) {
      console.log(`Login failed: Incorrect password for ${email}.`);
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // 4. Update the last_login timestamp
    await db.query("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?", [user.user_id]);

    // 5. Generate JWT token
    const token = jwt.sign({ userId: user.user_id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // 6. Send success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.user_id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  // The user's info is attached to req.user by the 'authenticate' middleware
  const userId = req.user.userId;

  try {
    // Fetch fresh data from the DB to ensure it's up-to-date
    const [users] = await db.query(
      "SELECT user_id, name, email, role, phone, created_at, last_login FROM users WHERE user_id = ?",
      [userId]
    );
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const user = users[0];

    res.status(200).json({
      success: true,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.created_at,
        lastLogin: user.last_login,
      },
    });
  } catch (error) {
    console.error("Get Me error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
