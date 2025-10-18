const db = require("./config/db");

async function testOrdersDebug() {
  try {
    console.log("=== Testing Orders Debug ===\n");

    // 1. Check if Orders table exists and has data
    const [orders] = await db.execute(`SELECT * FROM Orders LIMIT 5`);
    console.log(`1. Total orders in database: ${orders.length}`);
    if (orders.length > 0) {
      console.log("Sample order:", JSON.stringify(orders[0], null, 2));
    }

    // 2. Check customers
    const [customers] = await db.execute(
      `SELECT customer_id, CONCAT(first_name, ' ', last_name) as name, email FROM Customer LIMIT 5`
    );
    console.log(`\n2. Total customers: ${customers.length}`);
    customers.forEach((c) => {
      console.log(`   - Customer ID: ${c.customer_id}, Name: ${c.name}`);
    });

    // 3. Check if any customer has orders
    if (customers.length > 0) {
      const customerId = customers[0].customer_id;
      const [customerOrders] = await db.execute(
        `SELECT o.*, 
                p.method as payment_method, 
                p.status as payment_status,
                COUNT(oi.order_item_id) as item_count
         FROM Orders o
         LEFT JOIN Payment p ON o.payment_id = p.payment_id
         LEFT JOIN Order_item oi ON o.order_id = oi.order_id
         WHERE o.customer_id = ?
         GROUP BY o.order_id
         ORDER BY o.created_at DESC`,
        [customerId]
      );

      console.log(
        `\n3. Orders for customer ${customerId}: ${customerOrders.length}`
      );
      if (customerOrders.length > 0) {
        console.log(
          "Sample customer order:",
          JSON.stringify(customerOrders[0], null, 2)
        );
      }
    }

    // 4. Check Order_item table
    const [orderItems] = await db.execute(
      `SELECT * FROM Order_item LIMIT 5`
    );
    console.log(`\n4. Total order items: ${orderItems.length}`);

    // 5. Check Payment table
    const [payments] = await db.execute(`SELECT * FROM Payment LIMIT 5`);
    console.log(`\n5. Total payments: ${payments.length}`);

    console.log("\n=== Debug Complete ===");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testOrdersDebug();
