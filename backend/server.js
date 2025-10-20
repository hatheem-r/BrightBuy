// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load environment variables immediately
// Load environment variables FIRST before requiring db
dotenv.config();

const db = require("./config/db"); // initializes the DB connection

const app = express();

// --- ROUTE IMPORTS ---
// Import all route files to register their paths with Express
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const staffRoutes = require("./routes/staff"); 
// --- END ROUTE IMPORTS ---

// Middleware
// Configure CORS to allow requests from frontend
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json()); // To accept JSON data in the body

// Serve static assets (product images)
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// --- API Routes ---
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/variants", require("./routes/variants"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/staff", require("./routes/staff"));
app.use("/api/customers", require("./routes/customer"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/reports", require("./routes/reports"));

// Basic Test Route
app.get("/", (req, res) => {
  res.send("BrightBuy Backend API is running!");
});

const PORT = process.env.PORT || 5001;

// Listen on all network interfaces (0.0.0.0) to allow LAN access
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`LAN access: http://192.168.8.129:${PORT}`);
});