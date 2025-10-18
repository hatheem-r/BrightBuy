-- Create test orders for testing the order history feature
-- This script creates sample orders for the first customer in the database

-- First, let's check which customers we have
SELECT customer_id, CONCAT(first_name, ' ', last_name) as customer_name, email 
FROM Customer 
LIMIT 5;

-- Create a test order for the first customer (adjust customer_id as needed)
-- You'll need to replace 1 with an actual customer_id from your database

SET @customer_id = 1;  -- Change this to match your actual customer ID
SET @variant_id = 1;   -- Change this to match an actual variant_id in your ProductVariant table

-- Insert a test order
INSERT INTO Orders (
    customer_id, 
    delivery_mode, 
    status, 
    sub_total, 
    delivery_fee, 
    total,
    estimated_delivery_days
) VALUES 
(@customer_id, 'Store Pickup', 'delivered', 599.99, 0, 599.99, 0),
(@customer_id, 'Standard Delivery', 'shipped', 1299.99, 50, 1349.99, 3),
(@customer_id, 'Standard Delivery', 'pending', 899.99, 50, 949.99, 5);

-- Get the order IDs we just created
SET @order_id_1 = LAST_INSERT_ID();
SET @order_id_2 = @order_id_1 + 1;
SET @order_id_3 = @order_id_1 + 2;

-- Add order items for each order
INSERT INTO Order_item (order_id, variant_id, quantity, unit_price) VALUES
(@order_id_1, @variant_id, 1, 599.99),
(@order_id_2, @variant_id, 2, 649.99),
(@order_id_3, @variant_id, 1, 899.99);

-- Create payment records
INSERT INTO Payment (order_id, method, amount, status) VALUES
(@order_id_1, 'Credit Card', 599.99, 'paid'),
(@order_id_2, 'Debit Card', 1349.99, 'paid'),
(@order_id_3, 'Cash on Delivery', 949.99, 'pending');

-- Update orders with payment IDs
UPDATE Orders o
SET payment_id = (SELECT payment_id FROM Payment WHERE order_id = o.order_id)
WHERE order_id IN (@order_id_1, @order_id_2, @order_id_3);

-- Verify the orders were created
SELECT 
    o.order_id,
    o.customer_id,
    o.status,
    o.total,
    o.created_at,
    p.status as payment_status,
    p.method as payment_method,
    COUNT(oi.order_item_id) as item_count
FROM Orders o
LEFT JOIN Payment p ON o.payment_id = p.payment_id
LEFT JOIN Order_item oi ON o.order_id = oi.order_id
WHERE o.customer_id = @customer_id
GROUP BY o.order_id
ORDER BY o.created_at DESC;
