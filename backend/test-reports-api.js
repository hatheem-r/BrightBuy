// test-reports-api.js
// Quick test script for the new reports API endpoints
// Make sure the backend server is running first: node server.js

const BASE_URL = "http://localhost:5001/api";

// Test credentials (admin staff account)
const testCredentials = {
  email: "admin@brightbuy.com",
  password: "123456"
};

async function testReportsAPI() {
  console.log("============================================");
  console.log("📊 Testing Reports API Endpoints");
  console.log("============================================\n");

  try {
    // Step 1: Login to get token
    console.log("1️⃣  Logging in as staff...");
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testCredentials)
    });

    if (!loginResponse.ok) {
      throw new Error("Login failed");
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log("✅ Login successful!");
    console.log(`   Role: ${loginData.user.role}`);
    console.log(`   Staff Role: ${loginData.user.staffRole}\n`);

    // Step 2: Test Sales Summary
    console.log("2️⃣  Testing Sales Summary Report...");
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0];
    
    const salesSummaryResponse = await fetch(
      `${BASE_URL}/reports/sales-summary?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: { "Authorization": `Bearer ${token}` }
      }
    );

    if (!salesSummaryResponse.ok) {
      console.log(`❌ Sales Summary failed: ${salesSummaryResponse.status}`);
    } else {
      const salesData = await salesSummaryResponse.json();
      console.log("✅ Sales Summary retrieved!");
      console.log("   Data:", JSON.stringify(salesData.data, null, 2));
    }

    // Step 3: Test Available Years
    console.log("\n3️⃣  Testing Available Years...");
    const yearsResponse = await fetch(`${BASE_URL}/reports/available-years`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!yearsResponse.ok) {
      console.log(`❌ Available Years failed: ${yearsResponse.status}`);
    } else {
      const yearsData = await yearsResponse.json();
      console.log("✅ Available Years retrieved!");
      console.log("   Years:", yearsData.years);
    }

    // Step 4: Test Category Orders
    console.log("\n4️⃣  Testing Category Orders Report...");
    const categoryResponse = await fetch(`${BASE_URL}/reports/category-orders`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!categoryResponse.ok) {
      console.log(`❌ Category Orders failed: ${categoryResponse.status}`);
    } else {
      const categoryData = await categoryResponse.json();
      console.log("✅ Category Orders retrieved!");
      console.log(`   Found ${categoryData.data.length} categories`);
      if (categoryData.data.length > 0) {
        console.log("   Sample:", categoryData.data[0]);
      }
    }

    // Step 5: Test Inventory Report
    console.log("\n5️⃣  Testing Inventory Report (Low Stock)...");
    const inventoryResponse = await fetch(
      `${BASE_URL}/reports/inventory?status=low_stock&limit=5`,
      {
        headers: { "Authorization": `Bearer ${token}` }
      }
    );

    if (!inventoryResponse.ok) {
      console.log(`❌ Inventory Report failed: ${inventoryResponse.status}`);
    } else {
      const inventoryData = await inventoryResponse.json();
      console.log("✅ Inventory Report retrieved!");
      console.log(`   Found ${inventoryData.data.length} low stock items`);
    }

    // Step 6: Test Top Selling Products
    console.log("\n6️⃣  Testing Top Selling Products...");
    const topProductsResponse = await fetch(
      `${BASE_URL}/reports/top-selling-products?startDate=${startDate}&endDate=${endDate}&limit=5`,
      {
        headers: { "Authorization": `Bearer ${token}` }
      }
    );

    if (!topProductsResponse.ok) {
      console.log(`❌ Top Products failed: ${topProductsResponse.status}`);
    } else {
      const topProductsData = await topProductsResponse.json();
      console.log("✅ Top Selling Products retrieved!");
      console.log(`   Found ${topProductsData.data.length} products`);
      if (topProductsData.data.length > 0) {
        console.log("   Top Product:", topProductsData.data[0]);
      }
    }

    console.log("\n============================================");
    console.log("✅ All Report API Tests Completed!");
    console.log("============================================");

  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    console.error(error.stack);
  }
}

// Run tests
testReportsAPI();
