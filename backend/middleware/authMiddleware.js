// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
exports.authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-in-production"
    );

    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

// Middleware to check user role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

// Middleware to check if user is customer
exports.isCustomer = (req, res, next) => {
  if (!req.user || req.user.role !== "customer") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Customer access only.",
    });
  }
  next();
};

// Middleware to check if user is admin or manager
exports.isStaff = (req, res, next) => {
  if (!req.user || !["admin", "manager"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Staff access only.",
    });
  }
  next();
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin access only.",
    });
  }
  next();
};

// Middleware to check if user is staff (any level)
exports.authorizeStaff = (req, res, next) => {
  if (!req.user || req.user.role !== "staff") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Staff access only.",
    });
  }
  next();
};

// Middleware to check if user is Level01 staff
exports.authorizeLevel01 = (req, res, next) => {
  if (!req.user || req.user.role !== "staff" || req.user.staffLevel !== "Level01") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Level01 staff access only.",
    });
  }
  next();
};
