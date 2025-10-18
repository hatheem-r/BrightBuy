require("dotenv").config();
const db = require("./config/db");

async function verifyOrderSystem() {
  try {
    console.log("=== Verifying Order System Setup ===\n");

    // 1. Check Customers
    const [customers] = await db.execute(
      `SELECT customer_id, CONCAT(first_name, ' ', last_name) as name, email, phone 
       FROM Customer LIMIT 5`
    );
    console.log(`✅ Customers: ${customers.length} found`);
    customers.forEach(c => {
      console.log(`   - ${c.name} (ID: ${c.customer_id}, Email: ${c.email})`);
    });

    // 2. Check Products
    const [products] = await db.execute(
      `SELECT COUNT(*) as count FROM Product`
    );
    console.log(`\n✅ Products: ${products[0].count} in database`);

    // 3. Check ProductVariants
    const [variants] = await db.execute(
      `SELECT COUNT(*) as count FROM ProductVariant`
    );
    console.log(`✅ Product Variants: ${variants[0].count} in database`);

    // 4. Check Inventory
    const [inventory] = await db.execute(
      `SELECT COUNT(*) as count FROM Inventory WHERE quantity > 0`
    );
    console.log(`✅ In-Stock Variants: ${inventory[0].count} available`);

    // 5. Check Addresses
    const [addresses] = await db.execute(
      `SELECT a.address_id, a.customer_id, CONCAT(a.line1, ', ', a.city, ', ', a.state) as address
       FROM Address a LIMIT 5`
    );
    console.log(`\n✅ Saved Addresses: ${addresses.length} found`);
    addresses.forEach(a => {
      console.log(`   - Customer ${a.customer_id}: ${a.address}`);
    });

    // 6. Check Orders
    const [orders] = await db.execute(
      `SELECT COUNT(*) as count FROM Orders`
    );
    console.log(`\n✅ Total Orders: ${orders[0].count} in database`);

    // 7. Check recent orders with details
    const [recentOrders] = await db.execute(
      `SELECT o.order_id, o.customer_id, o.status, o.total, o.created_at,
              p.status as payment_status, p.method as payment_method,
              COUNT(oi.order_item_id) as item_count
       FROM Orders o
       LEFT JOIN Payment p ON o.payment_id = p.payment_id
       LEFT JOIN Order_item oi ON o.order_id = oi.order_id
       GROUP BY o.order_id
       ORDER BY o.created_at DESC
       LIMIT 5`
    );
    
    if (recentOrders.length > 0) {
      console.log(`\n✅ Recent Orders:`);
      recentOrders.forEach(order => {
        console.log(`   Order #${order.order_id}:`);
        console.log(`     Customer: ${order.customer_id}`);
        console.log(`     Status: ${order.status} | Payment: ${order.payment_status}`);
        console.log(`     Items: ${order.item_count} | Total: Rs. ${order.total}`);
        console.log(`     Date: ${new Date(order.created_at).toLocaleDateString()}`);
        console.log();
      });
    } else {
      console.log(`\n⚠️  No orders found yet - System ready for first purchase!`);
    }

    // 8. Check users table
    const [users] = await db.execute(
      `SELECT user_id, email, role, customer_id, staff_id, is_active
       FROM users
       LIMIT 5`
    );
    console.log(`\n✅ User Accounts: ${users.length} found`);
    users.forEach(u => {
      const roleInfo = u.customer_id ? `Customer ID: ${u.customer_id}` : u.staff_id ? `Staff ID: ${u.staff_id}` : 'No link';
      console.log(`   - ${u.email} (${u.role}) - ${roleInfo} - ${u.is_active ? 'Active' : 'Inactive'}`);
    });

    // 9. Check Cart
    const [cartItems] = await db.execute(
      `SELECT COUNT(*) as count FROM Cart_item`
    );
    console.log(`\n✅ Active Cart Items: ${cartItems[0].count}`);

    // 10. System Readiness Check
    console.log("\n=== SYSTEM READINESS ===");
    const checks = {
      "Customers exist": customers.length > 0,
      "Products available": products[0].count > 0,
      "Variants available": variants[0].count > 0,
      "Inventory stocked": inventory[0].count > 0,
      "User accounts active": users.length > 0
    };

    let allReady = true;
    Object.entries(checks).forEach(([check, status]) => {
      console.log(`${status ? '✅' : '❌'} ${check}`);
      if (!status) allReady = false;
    });

    console.log("\n" + (allReady 
      ? "🎉 System is READY for real-time order creation!" 
      : "⚠️  Some setup required before orders can be placed"));

    console.log("\n=== Verification Complete ===");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

verifyOrderSystem();
