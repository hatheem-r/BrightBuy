-- ========================================
-- FIX CART SCHEMA - Remove Cart table, use customer_id approach
-- ========================================
-- This script fixes the Cart_item table to use customer_id directly
-- instead of referencing a separate Cart table

USE brightbuy;

-- Step 1: Drop the old Cart_item table (this will remove all cart data)
DROP TABLE IF EXISTS Cart_item;

-- Step 2: Drop the Cart table if it exists
DROP TABLE IF EXISTS Cart;

-- Step 3: Recreate Cart_item with customer_id approach
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

-- Step 4: Verify the structure
SELECT 'Cart_item table recreated successfully!' as Status;
SHOW CREATE TABLE Cart_item;

SELECT 'Checking if Cart table exists...' as Status;
SELECT COUNT(*) as cart_table_exists FROM information_schema.tables 
WHERE table_schema = 'brightbuy' AND table_name = 'Cart';
