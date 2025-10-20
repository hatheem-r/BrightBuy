# Cart Schema Fix

## Problem
Your database has a `Cart` table with foreign key constraint `fk_cartitem_cart`, but your stored procedures and code expect the **customer_id approach** where `Cart_item` directly references `customer_id` without a separate `Cart` table.

## Error
```
Cannot add or update a child row: a foreign key constraint fails 
(`brightbuy`.`Cart_item`, CONSTRAINT `fk_cartitem_cart` FOREIGN KEY (`cart_id`) 
REFERENCES `Cart` (`cart_id`) ON DELETE CASCADE ON UPDATE CASCADE)
```

## Solution

You need to drop the old Cart_item table and recreate it with the correct schema.

### Step 1: Check Current Schema
Run this in MySQL to see the current structure:
```sql
SHOW CREATE TABLE Cart_item;
SHOW CREATE TABLE Cart;
```

### Step 2: Fix the Schema

**Option A: Quick Fix (Recreate Cart_item table)**
```sql
-- Drop the old Cart_item table
DROP TABLE IF EXISTS Cart_item;

-- Recreate with customer_id approach
CREATE TABLE Cart_item (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cartitem_customer FOREIGN KEY (customer_id) 
        REFERENCES Customer(customer_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_cartitem_variant FOREIGN KEY (variant_id) 
        REFERENCES ProductVariant(variant_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_cartitem_quantity CHECK (quantity > 0),
    CONSTRAINT uc_customer_variant UNIQUE(customer_id, variant_id)
);

CREATE INDEX idx_cartitem_customer ON Cart_item(customer_id);

-- Drop the Cart table if it exists
DROP TABLE IF EXISTS Cart;
```

**Option B: Full Database Reset (if you don't have important data)**
```bash
# From the queries directory
mysql -u root -p brightbuy < schema_customer_approach.sql
mysql -u root -p brightbuy < cart_procedures_customer_clean.sql
```

### Step 3: Verify the Fix
```sql
-- Check the new structure
SHOW CREATE TABLE Cart_item;

-- Verify no Cart table exists
SHOW TABLES LIKE 'Cart';
```

### Step 4: Test Adding to Cart
After fixing the schema, restart your server and test adding items to the cart.

## Prevention
Always ensure your database schema matches your code. The customer_id approach (no Cart table) is simpler and what your code expects.
