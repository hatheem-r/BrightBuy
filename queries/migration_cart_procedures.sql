-- ============================
-- Cart System Migration
-- Date: October 17, 2025
-- Description: Updates cart-related stored procedures to work with cart_id instead of customer_id
-- ============================
-- IMPORTANT: Run this migration if you're getting cart errors
-- This fixes the mismatch between Cart_item table structure and stored procedures
-- ============================
USE brightbuy;
-- ============================
-- Drop old procedures if they exist
-- ============================
DROP PROCEDURE IF EXISTS GetCustomerCart;
DROP PROCEDURE IF EXISTS GetCustomerCartSummary;
DROP PROCEDURE IF EXISTS GetCustomerCartCount;
DROP PROCEDURE IF EXISTS ClearCustomerCart;
-- ============================
-- Verify Cart and Cart_item table structure
-- ============================
-- Cart table should have: cart_id, customer_id, created_at, updated_at
-- Cart_item table should have: cart_item_id, cart_id, variant_id, quantity
-- If you need to check your table structure, uncomment and run:
-- DESCRIBE Cart;
-- DESCRIBE Cart_item;
-- ============================
-- Create/Update GetCartDetails Procedure
-- ============================
DROP PROCEDURE IF EXISTS GetCartDetails;
DELIMITER // CREATE PROCEDURE GetCartDetails(IN p_cart_id INT) BEGIN
SELECT ci.cart_item_id,
    ci.cart_id,
    ci.variant_id,
    ci.quantity,
    pv.sku,
    pv.price,
    pv.size,
    pv.color,
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
WHERE ci.cart_id = p_cart_id
ORDER BY ci.cart_item_id DESC;
END // DELIMITER;
-- ============================
-- Create/Update GetCartSummary Procedure
-- ============================
DROP PROCEDURE IF EXISTS GetCartSummary;
DELIMITER // CREATE PROCEDURE GetCartSummary(IN p_cart_id INT) BEGIN
SELECT COUNT(DISTINCT ci.cart_item_id) as total_items,
    COALESCE(SUM(ci.quantity), 0) as total_quantity,
    COALESCE(SUM(pv.price * ci.quantity), 0) as subtotal,
    COALESCE(SUM(pv.price * ci.quantity), 0) as total
FROM Cart_item ci
    INNER JOIN ProductVariant pv ON ci.variant_id = pv.variant_id
WHERE ci.cart_id = p_cart_id;
END // DELIMITER;
-- ============================
-- Create/Update AddToCart Procedure
-- ============================
DROP PROCEDURE IF EXISTS AddToCart;
DELIMITER // CREATE PROCEDURE AddToCart(
    IN p_cart_id INT,
    IN p_variant_id INT,
    IN p_quantity INT
) BEGIN -- Validate inputs
IF p_quantity <= 0 THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Quantity must be greater than 0';
END IF;
-- Check if variant exists
IF NOT EXISTS (
    SELECT 1
    FROM ProductVariant
    WHERE variant_id = p_variant_id
) THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Product variant does not exist';
END IF;
-- Upsert cart item
IF EXISTS (
    SELECT 1
    FROM Cart_item
    WHERE cart_id = p_cart_id
        AND variant_id = p_variant_id
) THEN
UPDATE Cart_item
SET quantity = quantity + p_quantity
WHERE cart_id = p_cart_id
    AND variant_id = p_variant_id;
ELSE
INSERT INTO Cart_item(cart_id, variant_id, quantity)
VALUES(p_cart_id, p_variant_id, p_quantity);
END IF;
END // DELIMITER;
-- ============================
-- Create/Update UpdateCartItemQuantity Procedure
-- ============================
DROP PROCEDURE IF EXISTS UpdateCartItemQuantity;
DELIMITER // CREATE PROCEDURE UpdateCartItemQuantity(
    IN p_cart_id INT,
    IN p_variant_id INT,
    IN p_new_quantity INT
) BEGIN -- Validate quantity
IF p_new_quantity <= 0 THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Quantity must be greater than 0';
END IF;
-- Check if item exists in cart
IF NOT EXISTS (
    SELECT 1
    FROM Cart_item
    WHERE cart_id = p_cart_id
        AND variant_id = p_variant_id
) THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Item not found in cart';
END IF;
-- Update quantity
UPDATE Cart_item
SET quantity = p_new_quantity
WHERE cart_id = p_cart_id
    AND variant_id = p_variant_id;
END // DELIMITER;
-- ============================
-- Create/Update RemoveCartItem Procedure
-- ============================
DROP PROCEDURE IF EXISTS RemoveCartItem;
DELIMITER // CREATE PROCEDURE RemoveCartItem(IN p_cart_id INT, IN p_variant_id INT) BEGIN -- Check if item exists
IF NOT EXISTS (
    SELECT 1
    FROM Cart_item
    WHERE cart_id = p_cart_id
        AND variant_id = p_variant_id
) THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Item not found in cart';
END IF;
-- Remove item
DELETE FROM Cart_item
WHERE cart_id = p_cart_id
    AND variant_id = p_variant_id;
END // DELIMITER;
-- ============================
-- Create/Update ClearCart Procedure
-- ============================
DROP PROCEDURE IF EXISTS ClearCart;
DELIMITER // CREATE PROCEDURE ClearCart(IN p_cart_id INT) BEGIN
DELETE FROM Cart_item
WHERE cart_id = p_cart_id;
END // DELIMITER;
-- ============================
-- Create/Update GetCartItemCount Procedure
-- ============================
DROP PROCEDURE IF EXISTS GetCartItemCount;
DELIMITER // CREATE PROCEDURE GetCartItemCount(IN p_cart_id INT) BEGIN
SELECT COALESCE(SUM(quantity), 0) as item_count
FROM Cart_item
WHERE cart_id = p_cart_id;
END // DELIMITER;
-- ============================
-- Create/Update GetOrCreateCart Procedure
-- ============================
DROP PROCEDURE IF EXISTS GetOrCreateCart;
DELIMITER // CREATE PROCEDURE GetOrCreateCart(
    IN p_customer_id INT,
    OUT p_cart_id INT
) BEGIN -- Check if customer has a cart
SELECT cart_id INTO p_cart_id
FROM Cart
WHERE customer_id = p_customer_id
LIMIT 1;
-- Create cart if doesn't exist
IF p_cart_id IS NULL THEN
INSERT INTO Cart (customer_id)
VALUES (p_customer_id);
SET p_cart_id = LAST_INSERT_ID();
END IF;
END // DELIMITER;
-- ============================
-- Create/Update ValidateCart Procedure
-- ============================
DROP PROCEDURE IF EXISTS ValidateCart;
DELIMITER // CREATE PROCEDURE ValidateCart(IN p_cart_id INT) BEGIN
SELECT ci.cart_item_id,
    ci.variant_id,
    ci.quantity as requested_quantity,
    COALESCE(i.quantity, 0) as available_stock,
    pv.price,
    p.name as product_name,
    CASE
        WHEN i.quantity >= ci.quantity THEN 'Valid'
        WHEN i.quantity > 0 THEN 'Insufficient Stock'
        ELSE 'Out of Stock'
    END as validation_status
FROM Cart_item ci
    INNER JOIN ProductVariant pv ON ci.variant_id = pv.variant_id
    INNER JOIN Product p ON pv.product_id = p.product_id
    LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
WHERE ci.cart_id = p_cart_id;
END // DELIMITER;
-- ============================
-- Create/Update MergeGuestCart Procedure
-- ============================
DROP PROCEDURE IF EXISTS MergeGuestCart;
DELIMITER // CREATE PROCEDURE MergeGuestCart(
    IN p_guest_cart_id INT,
    IN p_customer_cart_id INT
) BEGIN -- Merge items from guest cart to customer cart
INSERT INTO Cart_item (cart_id, variant_id, quantity)
SELECT p_customer_cart_id,
    variant_id,
    quantity
FROM Cart_item
WHERE cart_id = p_guest_cart_id ON DUPLICATE KEY
UPDATE quantity = Cart_item.quantity +
VALUES(quantity);
-- Clear guest cart
DELETE FROM Cart_item
WHERE cart_id = p_guest_cart_id;
-- Optionally delete guest cart
DELETE FROM Cart
WHERE cart_id = p_guest_cart_id;
END // DELIMITER;
-- ============================
-- Verification Queries
-- ============================
-- Run these to verify procedures were created successfully:
-- SHOW PROCEDURE STATUS WHERE Db = 'brightbuy' AND Name LIKE '%Cart%';
-- SHOW CREATE PROCEDURE AddToCart;
-- SHOW CREATE PROCEDURE GetCartDetails;
-- ============================
-- Migration Complete
-- ============================
SELECT 'Cart procedures migration completed successfully!' as status;