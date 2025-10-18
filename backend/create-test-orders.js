require("dotenv").config();
const db = require("./config/db");

async function createTestOrders() {
  let connection;
  try {
    connection = await db.getConnection();
  } catch (error) {
    console.error("Failed to get database connection:", error);
    process.exit(1);
  }
  try {
    console.log("=== Creating Test Orders ===\n");

    // 1. Get the first customer
    const [customers] = await connection.execute(
      `SELECT customer_id, CONCAT(first_name, ' ', last_name) as name, email FROM Customer LIMIT 1`
    );

    if (customers.length === 0) {
      console.log("❌ No customers found. Please create a customer first.");
      process.exit(1);
    }

    const customer = customers[0];
    console.log(`✓ Found customer: ${customer.name} (ID: ${customer.customer_id})`);

    // 2. Get the first product variant
    const [variants] = await connection.execute(
      `SELECT pv.variant_id, p.name, pv.sku, pv.price 
       FROM ProductVariant pv
       JOIN Product p ON pv.product_id = p.product_id
       LIMIT 3`
    );

    if (variants.length === 0) {
      console.log("❌ No product variants found.");
      process.exit(1);
    }

    console.log(`✓ Found ${variants.length} product variants`);

    // 2.5 Get an address for the customer (or create one)
    let [addresses] = await connection.execute(
      `SELECT address_id FROM Address WHERE customer_id = ? LIMIT 1`,
      [customer.customer_id]
    );

    let addressId = null;
    if (addresses.length === 0) {
      // Create a test address
      const [addressResult] = await connection.execute(
        `INSERT INTO Address (customer_id, line1, city, state, zip_code, is_default)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [customer.customer_id, "123 Test St", "Austin", "TX", "73301", 1]
      );
      addressId = addressResult.insertId;
      console.log(`✓ Created test address (ID: ${addressId})`);
    } else {
      addressId = addresses[0].address_id;
      console.log(`✓ Found existing address (ID: ${addressId})`);
    }

    console.log("");
    await connection.beginTransaction();

    // 3. Create 3 test orders
    const ordersData = [
      {
        status: "delivered",
        delivery_mode: "Store Pickup",
        sub_total: 599.99,
        delivery_fee: 0,
        total: 599.99,
        payment_method: "Card Payment",
        payment_status: "completed",
      },
      {
        status: "shipped",
        delivery_mode: "Standard Delivery",
        sub_total: 1299.99,
        delivery_fee: 50,
        total: 1349.99,
        payment_method: "Card Payment",
        payment_status: "completed",
        delivery_zip: "73301",
        estimated_delivery_days: 3,
        needsAddress: true,
      },
      {
        status: "pending",
        delivery_mode: "Standard Delivery",
        sub_total: 899.99,
        delivery_fee: 50,
        total: 949.99,
        payment_method: "Cash on Delivery",
        payment_status: "pending",
        delivery_zip: "73301",
        estimated_delivery_days: 5,
        needsAddress: true,
      },
    ];

    for (let i = 0; i < ordersData.length; i++) {
      const orderData = ordersData[i];
      
      // Create order
      const [orderResult] = await connection.execute(
        `INSERT INTO Orders (
          customer_id,
          address_id, 
          delivery_mode, 
          delivery_zip,
          status, 
          sub_total, 
          delivery_fee, 
          total,
          estimated_delivery_days
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          customer.customer_id,
          orderData.needsAddress ? addressId : null,
          orderData.delivery_mode,
          orderData.delivery_zip || null,
          orderData.status,
          orderData.sub_total,
          orderData.delivery_fee,
          orderData.total,
          orderData.estimated_delivery_days || 0,
        ]
      );

      const orderId = orderResult.insertId;

      // Add order items
      const variant = variants[i % variants.length];
      await connection.execute(
        `INSERT INTO Order_item (order_id, variant_id, quantity, unit_price) 
         VALUES (?, ?, ?, ?)`,
        [orderId, variant.variant_id, 1, orderData.sub_total]
      );

      // Create payment
      const [paymentResult] = await connection.execute(
        `INSERT INTO Payment (order_id, method, amount, status) 
         VALUES (?, ?, ?, ?)`,
        [orderId, orderData.payment_method, orderData.total, orderData.payment_status]
      );

      // Update order with payment_id
      await connection.execute(
        `UPDATE Orders SET payment_id = ? WHERE order_id = ?`,
        [paymentResult.insertId, orderId]
      );

      console.log(
        `✓ Created order #${orderId}: ${orderData.status} - Rs. ${orderData.total}`
      );
    }

    await connection.commit();
    console.log("\n✅ Successfully created 3 test orders!");

    // Display the orders
    console.log("\n=== Orders for customer ===");
    const [orders] = await connection.execute(
      `SELECT o.order_id, o.status, o.total, o.delivery_mode,
              p.status as payment_status, p.method as payment_method,
              o.created_at
       FROM Orders o
       LEFT JOIN Payment p ON o.payment_id = p.payment_id
       WHERE o.customer_id = ?
       ORDER BY o.created_at DESC`,
      [customer.customer_id]
    );

    orders.forEach((order) => {
      console.log(`Order #${order.order_id}:`);
      console.log(`  Status: ${order.status}`);
      console.log(`  Payment: ${order.payment_status} (${order.payment_method})`);
      console.log(`  Total: Rs. ${order.total}`);
      console.log(`  Date: ${order.created_at}`);
      console.log("");
    });

    console.log("=== Done ===");
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("❌ Error:", error);
  } finally {
    if (connection) {
      connection.release();
    }
    process.exit(0);
  }
}

createTestOrders();
