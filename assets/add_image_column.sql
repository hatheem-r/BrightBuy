-- Add image_url column to ProductVariant table
-- Run this BEFORE running update_image_urls.sql

USE brightbuy;

-- Check if column exists and add it if it doesn't
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

-- Verify the column was added
DESCRIBE ProductVariant;

-- Show count of variants
SELECT COUNT(*) as total_variants FROM ProductVariant;

SELECT 'image_url column is ready!' as status;
