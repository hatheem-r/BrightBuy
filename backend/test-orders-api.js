const axios = require("axios");

async function testOrdersAPI() {
  try {
    console.log("=== Testing Orders API ===\n");

    // First, let's try to login as a customer to get a token
    console.log("1. Logging in as a customer...");
    const loginResponse = await axios.post("http://localhost:5001/api/auth/login", {
      email: "customer@test.com", // You might need to adjust this
      password: "password123",
    });

    const { token, user } = loginResponse.data;
    console.log(`   ✓ Logged in as: ${user.name} (ID: ${user.id})`);

    // Now fetch orders for this customer
    console.log(`\n2. Fetching orders for customer ${user.id}...`);
    const ordersResponse = await axios.get(
      `http://localhost:5001/api/orders/customer/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(`   ✓ Response received:`);
    console.log(JSON.stringify(ordersResponse.data, null, 2));

    console.log("\n=== Test Complete ===");
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

testOrdersAPI();
