-- Migration: Allow Backorders (Negative Inventory)
-- This allows customers to order out-of-stock items
-- Delivery time will automatically add 3 days for out-of-stock items

-- Drop the quantity constraint that prevents negative inventory
ALTER TABLE Inventory DROP CONSTRAINT chk_inventory_quantity;

-- Verify the constraint was removed
SELECT 
    CONSTRAINT_NAME, 
    TABLE_NAME, 
    CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_NAME = 'Inventory' 
    AND TABLE_SCHEMA = 'brightbuy';

-- Check current inventory status
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
ORDER BY i.quantity ASC;

-- Test query: Show how many items are in backorder status
SELECT 
    COUNT(*) as backorder_count,
    SUM(ABS(quantity)) as total_backorder_quantity
FROM Inventory
WHERE quantity < 0;
