// Test database connection
require("dotenv").config();
const mysql = require("mysql2/promise");

async function testConnection() {
  console.log("=".repeat(60));
  console.log("DATABASE CONNECTION TEST");
  console.log("=".repeat(60));

  console.log("\n📋 Environment Variables:");
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL || "Not set"}`);
  console.log(`DB_HOST: ${process.env.DB_HOST || "Not set"}`);
  console.log(`DB_PORT: ${process.env.DB_PORT || "Not set"}`);
  console.log(`DB_USER: ${process.env.DB_USER || "Not set"}`);
  console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? "***" : "Not set"}`);
  console.log(`DB_NAME: ${process.env.DB_NAME || "Not set"}`);

  console.log("\n🔍 Testing connection...\n");

  // Test 1: Ping the host
  console.log("Test 1: Checking if host is reachable...");
  const { exec } = require("child_process");
  const host = process.env.DB_HOST;

  exec(`ping -c 1 ${host}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`❌ Host ${host} is NOT reachable via ping`);
    } else {
      console.log(`✅ Host ${host} is reachable`);
    }
  });

  // Test 2: Try to connect with individual parameters
  console.log(
    "\nTest 2: Attempting MySQL connection with individual parameters..."
  );

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000, // 10 seconds timeout
    });

    console.log("✅ Successfully connected to MySQL!");

    // Test query
    const [rows] = await connection.execute("SELECT 1 + 1 AS result");
    console.log("✅ Test query successful:", rows[0]);

    // Check database
    const [databases] = await connection.execute("SHOW DATABASES");
    console.log("\n📊 Available databases:");
    databases.forEach((db) => console.log(`  - ${db.Database}`));

    await connection.end();
    console.log("\n✅ All tests passed!");
  } catch (error) {
    console.log("❌ Connection failed!");
    console.log("\n🔴 Error Details:");
    console.log(`Error Code: ${error.code}`);
    console.log(`Error Message: ${error.message}`);
    console.log(`Error Errno: ${error.errno}`);

    console.log("\n💡 Troubleshooting Tips:");

    if (error.code === "ETIMEDOUT" || error.code === "ECONNREFUSED") {
      console.log("\n⚠️  CONNECTION TIMEOUT/REFUSED - Possible issues:");
      console.log("  1. MySQL server is not running on the remote host");
      console.log("  2. Firewall is blocking port 3306");
      console.log("  3. MySQL is not configured to accept remote connections");
      console.log("  4. Wrong IP address");
      console.log("\n📝 Steps to fix:");
      console.log("  On the database server, run:");
      console.log(
        "  1. Check if MySQL is running: sudo systemctl status mysql"
      );
      console.log(
        "  2. Check MySQL bind-address in /etc/mysql/mysql.conf.d/mysqld.cnf"
      );
      console.log("     It should be: bind-address = 0.0.0.0");
      console.log("  3. Restart MySQL: sudo systemctl restart mysql");
      console.log("  4. Allow firewall: sudo ufw allow 3306/tcp");
      console.log("  5. Grant remote access in MySQL:");
      console.log(
        `     GRANT ALL ON brightbuy.* TO 'root'@'%' IDENTIFIED BY '${process.env.DB_PASSWORD}';`
      );
      console.log("     FLUSH PRIVILEGES;");
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.log("\n⚠️  ACCESS DENIED - Wrong username or password");
      console.log("  Check your DB_USER and DB_PASSWORD in .env file");
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.log("\n⚠️  DATABASE NOT FOUND - The database does not exist");
      console.log(
        `  Create the database: CREATE DATABASE ${process.env.DB_NAME};`
      );
    }
  }

  console.log("\n" + "=".repeat(60));
}

testConnection();
