const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testCartAPI() {
  try {
    console.log("============================================================");
    console.log("TESTING CART API ENDPOINTS");
    console.log("============================================================\n");

    const testCustomerId = 1;
    const testVariantId = 143;

    // Test 1: Get cart details
    console.log("📋 Test 1: GET /api/cart/:customerId");
    try {
      const response = await axios.get(`${BASE_URL}/cart/${testCustomerId}`);
      console.log("✅ Status:", response.status);
      console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log("❌ Error:", error.response?.status, error.response?.data || error.message);
    }

    // Test 2: Get cart summary
    console.log("\n📋 Test 2: GET /api/cart/:customerId/summary");
    try {
      const response = await axios.get(`${BASE_URL}/cart/${testCustomerId}/summary`);
      console.log("✅ Status:", response.status);
      console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log("❌ Error:", error.response?.status, error.response?.data || error.message);
    }

    // Test 3: Add item to cart
    console.log("\n📋 Test 3: POST /api/cart/items");
    try {
      const response = await axios.post(`${BASE_URL}/cart/items`, {
        customer_id: testCustomerId,
        variant_id: 140,
        quantity: 1
      });
      console.log("✅ Status:", response.status);
      console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log("❌ Error:", error.response?.status, error.response?.data || error.message);
    }

    // Test 4: Get cart item count
    console.log("\n📋 Test 4: GET /api/cart/:customerId/count");
    try {
      const response = await axios.get(`${BASE_URL}/cart/${testCustomerId}/count`);
      console.log("✅ Status:", response.status);
      console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log("❌ Error:", error.response?.status, error.response?.data || error.message);
    }

    console.log("\n✅ API TESTS COMPLETED!");
  } catch (error) {
    console.error("\n❌ Unexpected error:", error.message);
  }
}

testCartAPI();
