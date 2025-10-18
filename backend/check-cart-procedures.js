const db = require("./config/db");

async function checkCartProcedures() {
  try {
    console.log("============================================================");
    console.log("CHECKING CART PROCEDURES AND TABLE STRUCTURE");
    console.log("============================================================\n");

    // Check Cart_item table structure
    console.log("📋 Cart_item table structure:");
    const [columns] = await db.query(
      "SHOW COLUMNS FROM Cart_item"
    );
    console.table(columns);

    // Check Cart table structure
    console.log("\n📋 Cart table structure:");
    const [cartColumns] = await db.query(
      "SHOW COLUMNS FROM Cart"
    );
    console.table(cartColumns);

    // Check existing cart procedures
    console.log("\n📋 Cart-related stored procedures:");
    const [procedures] = await db.query(
      "SHOW PROCEDURE STATUS WHERE Db = 'brightbuy' AND Name LIKE '%Cart%'"
    );
    
    if (procedures.length === 0) {
      console.log("❌ NO CART PROCEDURES FOUND!");
    } else {
      console.log("✅ Found procedures:");
      procedures.forEach(proc => {
        console.log(`  - ${proc.Name}`);
      });
    }

    // Check if there's any data in Cart_item
    console.log("\n📋 Cart_item sample data:");
    const [cartItems] = await db.query("SELECT * FROM Cart_item LIMIT 5");
    console.table(cartItems);

    // Check if there's any data in Cart
    console.log("\n📋 Cart sample data:");
    const [carts] = await db.query("SELECT * FROM Cart LIMIT 5");
    console.table(carts);

    await db.end();
    console.log("\n✅ Check completed!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkCartProcedures();
