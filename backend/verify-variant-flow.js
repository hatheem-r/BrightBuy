require("dotenv").config();
const db = require("./config/db");

async function verifyProductVariantFlow() {
  try {
    console.log("=== Verifying Product Variant Order Flow ===\n");

    // 1. Check a sample product variant with all details
    const [variants] = await db.execute(
      `SELECT 
        pv.variant_id,
        pv.product_id,
        pv.sku,
        pv.color,
        pv.size,
        pv.price,
        pv.image_url,
        p.name as product_name,
        p.brand
       FROM ProductVariant pv
       JOIN Product p ON pv.product_id = p.product_id
       LIMIT 5`
    );

    console.log("📦 SAMPLE PRODUCT VARIANTS:");
    console.log("=" .repeat(80));
    variants.forEach((v, idx) => {
      console.log(`\n${idx + 1}. Variant ID: ${v.variant_id}`);
      console.log(`   Product: ${v.product_name} by ${v.brand}`);
      console.log(`   SKU: ${v.sku}`);
      console.log(`   Color: ${v.color || "N/A"} | Size: ${v.size || "N/A"}`);
      console.log(`   Price: Rs. ${v.price}`);
      console.log(`   Image: ${v.image_url || "No image"}`);
    });

    // 2. Check recent orders and what variant info was stored
    console.log("\n\n📋 RECENT ORDERS WITH VARIANT DETAILS:");
    console.log("=" .repeat(80));

    const [orders] = await db.execute(
      `SELECT 
        o.order_id,
        o.customer_id,
        o.status,
        o.total,
        o.created_at,
        oi.variant_id,
        oi.quantity,
        oi.unit_price,
        pv.sku,
        pv.color,
        pv.size,
        pv.price as current_price,
        p.name as product_name,
        p.brand
       FROM Orders o
       JOIN Order_item oi ON o.order_id = oi.order_id
       JOIN ProductVariant pv ON oi.variant_id = pv.variant_id
       JOIN Product p ON pv.product_id = p.product_id
       ORDER BY o.created_at DESC
       LIMIT 10`
    );

    orders.forEach((order) => {
      console.log(`\nOrder #${order.order_id} - Customer ${order.customer_id}`);
      console.log(`  Product: ${order.product_name} (${order.brand})`);
      console.log(`  Variant: SKU ${order.sku} | Color: ${order.color || "N/A"} | Size: ${order.size || "N/A"}`);
      console.log(`  Ordered Price: Rs. ${order.unit_price} (Current: Rs. ${order.current_price})`);
      console.log(`  Quantity: ${order.quantity}`);
      console.log(`  Subtotal: Rs. ${order.unit_price * order.quantity}`);
      console.log(`  Status: ${order.status} | Date: ${new Date(order.created_at).toLocaleString()}`);
      
      // Check if prices match
      if (parseFloat(order.unit_price) !== parseFloat(order.current_price)) {
        console.log(`  ⚠️  WARNING: Price mismatch! Ordered at ${order.unit_price}, current price is ${order.current_price}`);
      }
    });

    // 3. Check what's in the cart right now
    console.log("\n\n🛒 CURRENT CART ITEMS:");
    console.log("=" .repeat(80));

    const [cartItems] = await db.execute(
      `SELECT 
        ci.cart_item_id,
        ci.customer_id,
        ci.variant_id,
        ci.quantity,
        pv.sku,
        pv.color,
        pv.size,
        pv.price,
        p.name as product_name,
        p.brand
       FROM Cart_item ci
       JOIN ProductVariant pv ON ci.variant_id = pv.variant_id
       JOIN Product p ON pv.product_id = p.product_id`
    );

    if (cartItems.length === 0) {
      console.log("No items in cart");
    } else {
      cartItems.forEach((item) => {
        console.log(`\nCustomer ${item.customer_id}'s Cart:`);
        console.log(`  Product: ${item.product_name} (${item.brand})`);
        console.log(`  Variant: SKU ${item.sku} | Color: ${item.color || "N/A"} | Size: ${item.size || "N/A"}`);
        console.log(`  Price: Rs. ${item.price} x ${item.quantity} = Rs. ${item.price * item.quantity}`);
      });
    }

    // 4. Simulate what happens during checkout
    console.log("\n\n🔍 CHECKOUT SIMULATION:");
    console.log("=" .repeat(80));

    if (cartItems.length > 0) {
      const sampleItem = cartItems[0];
      console.log("\nIf customer places order with first cart item:");
      console.log(`  Variant ID sent to backend: ${sampleItem.variant_id}`);
      console.log(`  Quantity sent: ${sampleItem.quantity}`);
      console.log(`  Unit price sent: ${sampleItem.price}`);
      console.log(`  Expected product: ${sampleItem.product_name}`);
      console.log(`  Expected color: ${sampleItem.color || "N/A"}`);
      console.log(`  Expected size: ${sampleItem.size || "N/A"}`);

      // Check if this variant exists and has correct details
      const [variantCheck] = await db.execute(
        `SELECT 
          pv.variant_id,
          pv.sku,
          pv.color,
          pv.size,
          pv.price,
          p.name as product_name,
          p.brand
         FROM ProductVariant pv
         JOIN Product p ON pv.product_id = p.product_id
         WHERE pv.variant_id = ?`,
        [sampleItem.variant_id]
      );

      if (variantCheck.length > 0) {
        const v = variantCheck[0];
        console.log("\n  ✅ Variant lookup in database:");
        console.log(`     Product: ${v.product_name} (${v.brand})`);
        console.log(`     SKU: ${v.sku}`);
        console.log(`     Color: ${v.color || "N/A"} | Size: ${v.size || "N/A"}`);
        console.log(`     Price: Rs. ${v.price}`);

        // Verification
        const matches = {
          product: v.product_name === sampleItem.product_name,
          color: v.color === sampleItem.color,
          size: v.size === sampleItem.size,
          price: parseFloat(v.price) === parseFloat(sampleItem.price),
        };

        console.log("\n  🔍 Verification:");
        console.log(`     Product name matches: ${matches.product ? "✅" : "❌"}`);
        console.log(`     Color matches: ${matches.color ? "✅" : "❌"}`);
        console.log(`     Size matches: ${matches.size ? "✅" : "❌"}`);
        console.log(`     Price matches: ${matches.price ? "✅" : "❌"}`);

        if (Object.values(matches).every((m) => m)) {
          console.log("\n  ✅ ALL DETAILS MATCH! Order would be correct.");
        } else {
          console.log("\n  ❌ MISMATCH DETECTED! There's a problem!");
        }
      }
    }

    // 5. Check inventory quantities
    console.log("\n\n📊 INVENTORY CHECK:");
    console.log("=" .repeat(80));

    const [inventory] = await db.execute(
      `SELECT 
        i.variant_id,
        i.quantity as stock,
        pv.sku,
        p.name as product_name,
        pv.color,
        pv.size
       FROM Inventory i
       JOIN ProductVariant pv ON i.variant_id = pv.variant_id
       JOIN Product p ON pv.product_id = p.product_id
       WHERE i.quantity > 0
       LIMIT 10`
    );

    console.log("Sample in-stock variants:");
    inventory.forEach((item) => {
      console.log(`  ${item.product_name} - ${item.sku} (${item.color || "N/A"}/${item.size || "N/A"}) - Stock: ${item.stock}`);
    });

    console.log("\n\n=== Verification Complete ===");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

verifyProductVariantFlow();
