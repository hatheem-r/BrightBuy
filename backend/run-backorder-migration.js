require('dotenv').config();
const db = require('./config/db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🔧 Running Backorder Migration...\n');

    // Drop the quantity constraint
    console.log('Step 1: Removing inventory quantity constraint...');
    try {
      await db.execute('ALTER TABLE Inventory DROP CONSTRAINT chk_inventory_quantity');
      console.log('✅ Constraint removed successfully\n');
    } catch (error) {
      if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('⚠️  Constraint already removed or does not exist\n');
      } else {
        throw error;
      }
    }

    // Verify the constraint was removed
    console.log('Step 2: Verifying constraint status...');
    const [constraints] = await db.execute(`
      SELECT 
        CONSTRAINT_NAME, 
        TABLE_NAME, 
        CONSTRAINT_TYPE
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE TABLE_NAME = 'Inventory' 
        AND TABLE_SCHEMA = 'brightbuy'
    `);
    
    console.log('Current constraints on Inventory table:');
    console.table(constraints);
    console.log('');

    // Check current inventory status
    console.log('Step 3: Checking current inventory status...');
    const [inventory] = await db.execute(`
      SELECT 
        i.variant_id,
        i.quantity,
        CASE 
          WHEN i.quantity < 0 THEN 'BACKORDER'
          WHEN i.quantity = 0 THEN 'OUT OF STOCK'
          WHEN i.quantity > 0 AND i.quantity <= 10 THEN 'LOW STOCK'
          ELSE 'IN STOCK'
        END as stock_status,
        p.name as product_name,
        pv.sku,
        pv.color,
        pv.size
      FROM Inventory i
      JOIN ProductVariant pv ON i.variant_id = pv.variant_id
      JOIN Product p ON pv.product_id = p.product_id
      ORDER BY i.quantity ASC
      LIMIT 10
    `);

    console.log('Inventory Status (First 10 items):');
    console.table(inventory);
    console.log('');

    // Test query: Show how many items are in backorder status
    console.log('Step 4: Checking backorder status...');
    const [backorders] = await db.execute(`
      SELECT 
        COUNT(*) as backorder_count,
        COALESCE(SUM(ABS(quantity)), 0) as total_backorder_quantity
      FROM Inventory
      WHERE quantity < 0
    `);

    console.log('Backorder Summary:');
    console.table(backorders);
    console.log('');

    console.log('✅ Migration completed successfully!');
    console.log('\n📦 System now supports backorders:');
    console.log('   - Customers can order out-of-stock items');
    console.log('   - Delivery time adds +3 days for out-of-stock orders');
    console.log('   - Inventory can go negative (backorder status)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
