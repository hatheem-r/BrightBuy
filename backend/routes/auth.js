// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

// Public routes
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/signup", authController.register); // Alias for register

// Protected routes (require authentication)
router.get("/me", authenticate, authController.getMe);

module.exports = router;
