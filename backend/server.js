// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load environment variables FIRST before requiring db
dotenv.config();

const db = require("./config/db"); // initializes the DB connection

const app = express();

// Middleware
// Configure CORS to allow requests from frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Allow Next.js default ports
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json()); // To accept JSON data in the body

// Serve static assets (product images)
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// --- API Routes ---
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/variants", require("./routes/variants"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/customers", require("./routes/customer"));
// app.use('/api/orders', require('./routes/orders'));

// Basic Test Route
app.get("/", (req, res) => {
  res.send("BrightBuy Backend API is running!");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
