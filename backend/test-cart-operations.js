const CartModel = require("./models/cartModel");
const db = require("./config/db");

async function testCartOperations() {
  try {
    console.log("============================================================");
    console.log("TESTING CART OPERATIONS");
    console.log("============================================================\n");

    const testCustomerId = 1; // Use customer_id = 1
    const testVariantId = 143; // Use an existing variant

    // Test 1: Get Cart Details (initially might be empty)
    console.log("📋 Test 1: Get Cart Details for customer", testCustomerId);
    const cartDetails = await CartModel.getCartDetails(testCustomerId);
    console.log("Cart Items:", cartDetails);

    // Test 2: Get Cart Summary
    console.log("\n📋 Test 2: Get Cart Summary");
    const summary = await CartModel.getCartSummary(testCustomerId);
    console.log("Summary:", summary);

    // Test 3: Add Item to Cart
    console.log("\n📋 Test 3: Add Item to Cart");
    await CartModel.addToCart(testCustomerId, testVariantId, 2);
    console.log("✅ Item added successfully");

    // Test 4: Get Updated Cart Details
    console.log("\n📋 Test 4: Get Updated Cart Details");
    const updatedCart = await CartModel.getCartDetails(testCustomerId);
    console.log("Updated Cart:", updatedCart);

    // Test 5: Get Cart Item Count
    console.log("\n📋 Test 5: Get Cart Item Count");
    const count = await CartModel.getCartItemCount(testCustomerId);
    console.log("Count:", count);

    // Test 6: Update Cart Item Quantity
    console.log("\n📋 Test 6: Update Cart Item Quantity");
    await CartModel.updateCartItemQuantity(testCustomerId, testVariantId, 5);
    console.log("✅ Quantity updated successfully");

    // Test 7: Check Item in Cart
    console.log("\n📋 Test 7: Check if Item is in Cart");
    const isInCart = await CartModel.isItemInCart(testCustomerId, testVariantId);
    console.log("Is in cart:", isInCart);

    console.log("\n✅ ALL TESTS PASSED!");
    
    await db.end();
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error(error);
    await db.end();
    process.exit(1);
  }
}

testCartOperations();
