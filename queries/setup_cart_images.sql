-- ========================================
-- Setup Cart Images - Run this in MySQL
-- ========================================

USE brightbuy;

-- Step 1: Add image_url column if it doesn't exist
SET @dbname = DATABASE();
SET @tablename = "ProductVariant";
SET @columnname = "image_url";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 'Column already exists, skipping...' AS message;",
  "ALTER TABLE ProductVariant ADD COLUMN image_url VARCHAR(255) NULL COMMENT 'Path to product variant image';"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Step 2: Update GetCustomerCart procedure
DROP PROCEDURE IF EXISTS GetCustomerCart;

DELIMITER //
CREATE PROCEDURE GetCustomerCart(IN p_customer_id INT) 
BEGIN
    SELECT 
        ci.cart_item_id,
        ci.customer_id,
        ci.variant_id,
        ci.quantity,
        pv.sku,
        pv.price,
        pv.size,
        pv.color,
        pv.image_url,
        pv.description as variant_description,
        p.product_id,
        p.name as product_name,
        p.brand,
        COALESCE(i.quantity, 0) as stock_quantity,
        CASE
            WHEN i.quantity >= ci.quantity THEN 'Available'
            WHEN i.quantity > 0 THEN 'Partially Available'
            ELSE 'Out of Stock'
        END as availability_status,
        (pv.price * ci.quantity) as item_total
    FROM Cart_item ci
        INNER JOIN ProductVariant pv ON ci.variant_id = pv.variant_id
        INNER JOIN Product p ON pv.product_id = p.product_id
        LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
    WHERE ci.customer_id = p_customer_id
    ORDER BY ci.cart_item_id DESC;
END//
DELIMITER ;

-- Step 3: Check results
SELECT 'Setup complete!' as status;

-- Verify column exists
DESCRIBE ProductVariant;

-- Check how many variants have images
SELECT 
    COUNT(*) as total_variants,
    SUM(CASE WHEN image_url IS NOT NULL THEN 1 ELSE 0 END) as with_images,
    SUM(CASE WHEN image_url IS NULL THEN 1 ELSE 0 END) as without_images
FROM ProductVariant;
