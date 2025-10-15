// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token and attach user to request
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // The decoded payload (userId, email, role) is attached to the request object
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please login again." });
    }
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};

// Middleware to authorize based on roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `User role '${req.user.role}' is not authorized to access this route.` });
    }
    next();
  };
};

// Specific role middleware for convenience
exports.isAdmin = exports.authorize('admin');
exports.isStaff = exports.authorize('admin', 'manager');
exports.isCustomer = exports.authorize('customer');