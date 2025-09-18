// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/db'); // initializes the DB connection

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To accept JSON data in the body

// --- API Routes ---
// Example: We will create these files next
app.use('/api/products', require('./routes/products'));
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/orders', require('./routes/orders'));

// Basic Test Route
app.get('/', (req, res) => {
  res.send('BrightBuy Backend API is running!');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});