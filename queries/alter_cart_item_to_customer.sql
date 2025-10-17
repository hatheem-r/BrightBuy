-- ============================
-- ALTER Cart_item to use customer_id instead of cart_id
-- Migration Script for BrightBuy Database
-- Date: October 17, 2025
-- ============================
-- Purpose: Modify Cart_item table to directly link to customers
-- instead of going through the Cart table
-- ============================

USE brightbuy;

-- Step 1: Drop existing foreign key constraint on cart_id (if exists)
SET @constraint_exists = (SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'brightbuy' 
    AND TABLE_NAME = 'Cart_item' 
    AND CONSTRAINT_NAME = 'fk_cartitem_cart' 
    AND CONSTRAINT_TYPE = 'FOREIGN KEY');

SET @sql = IF(@constraint_exists > 0, 
    'ALTER TABLE Cart_item DROP FOREIGN KEY fk_cartitem_cart', 
    'SELECT "Foreign key fk_cartitem_cart does not exist, skipping..."');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 2: Drop the unique constraint that includes cart_id (if exists)
SET @index_exists = (SELECT COUNT(*) 
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'brightbuy' 
    AND TABLE_NAME = 'Cart_item' 
    AND INDEX_NAME = 'uc_cart_variant');

SET @sql = IF(@index_exists > 0, 
    'ALTER TABLE Cart_item DROP INDEX uc_cart_variant', 
    'SELECT "Index uc_cart_variant does not exist, skipping..."');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 3: Add customer_id column to Cart_item (temporarily nullable)
ALTER TABLE Cart_item
ADD COLUMN customer_id INT NULL AFTER cart_item_id;

-- Step 4: Populate customer_id from Cart table for existing records
UPDATE Cart_item ci
INNER JOIN Cart c ON ci.cart_id = c.cart_id
SET ci.customer_id = c.customer_id;

-- Step 5: Make customer_id NOT NULL now that it's populated
ALTER TABLE Cart_item
MODIFY COLUMN customer_id INT NOT NULL;

-- Step 6: Drop the cart_id column (no longer needed)
ALTER TABLE Cart_item
DROP COLUMN cart_id;

-- Step 7: Add foreign key constraint for customer_id
ALTER TABLE Cart_item
ADD CONSTRAINT fk_cartitem_customer 
FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) 
ON UPDATE CASCADE 
ON DELETE CASCADE;

-- Step 8: Add unique constraint to prevent duplicate items per customer
ALTER TABLE Cart_item
ADD CONSTRAINT uc_customer_variant 
UNIQUE(customer_id, variant_id);

-- Step 9: Create index for better performance
CREATE INDEX idx_cartitem_customer ON Cart_item(customer_id);

-- ============================
-- Clean up obsolete procedures
-- ============================
-- Drop procedures that used cart_id approach
DROP PROCEDURE IF EXISTS MergeGuestCart;
DROP PROCEDURE IF EXISTS GetOrCreateCart;

-- ============================
-- Summary
-- ============================
SELECT 'Cart_item table successfully migrated to use customer_id!' AS Status;
SELECT 'Run cart_procedures_customer.sql to create the new cart procedures!' AS Note;
