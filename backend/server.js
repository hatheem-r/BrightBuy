// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./config/db"); // initializes the DB connection

// Load environment variables immediately
dotenv.config();

const app = express();

// --- ROUTE IMPORTS ---
// Import all route files to register their paths with Express
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const staffRoutes = require("./routes/staff"); 
// --- END ROUTE IMPORTS ---

// Middleware
// --- UPDATED CORS MIDDLEWARE ---
const frontendPort = process.env.FRONTEND_PORT || 3000; // Assuming frontend runs on 3000
const allowedOrigins = [`http://localhost:${frontendPort}`, 'http://127.0.0.1:3000']; 

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Ensure POST is allowed
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// --- END UPDATED CORS MIDDLEWARE ---
// We generally avoid express.json() for routes that handle file uploads 
// (like /api/products/add) because multer handles the request body parsing.
// However, for all other routes, it's still needed.
app.use(express.json()); 

// --- API Routes ---
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
// app.use('/api/orders', require('./routes/orders'));

// Basic Test Route
app.get("/", (req, res) => {
  res.send("BrightBuy Backend API is running!");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});