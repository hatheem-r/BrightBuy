// config/db.js
const mysql = require("mysql2/promise");

// Parse DATABASE_URL if provided, otherwise use individual variables
let poolConfig;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL if provided
  poolConfig = {
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
} else {
  // Fall back to individual environment variables
  poolConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

const pool = mysql.createPool(poolConfig);

pool
  .getConnection()
  .then((connection) => {
    console.log("MySQL Database connected successfully!");
    console.log(
      `Connected to database: ${process.env.DB_NAME || "from DATABASE_URL"}`
    );
    connection.release();
  })
  .catch((error) => {
    console.error("Error connecting to MySQL Database:", error.message);
    console.error(
      "Please check your DATABASE_URL or individual DB_* environment variables"
    );
  });

module.exports = pool;
