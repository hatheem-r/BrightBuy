// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post("/login", login);

// @route   GET /api/auth/me
// @desc    Get the current logged-in user's profile
// @access  Private
router.get("/me", authenticate, getMe);

module.exports = router;