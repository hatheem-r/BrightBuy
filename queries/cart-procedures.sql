-- ============================
-- BrightBuy Cart Management Procedures
-- Additional procedures and functions for cart functionality
-- ============================
USE brightbuy;
-- ============================
-- 1. Get or Create Cart for Customer
-- ============================
DROP PROCEDURE IF EXISTS GetOrCreateCart;
CREATE PROCEDURE GetOrCreateCart(
    IN p_customer_id INT,
    OUT p_cart_id INT
) BEGIN -- Check if customer already has a cart
SELECT cart_id INTO p_cart_id
FROM Cart
WHERE customer_id = p_customer_id
LIMIT 1;
-- If no cart exists, create one
IF p_cart_id IS NULL THEN
INSERT INTO Cart (customer_id)
VALUES (p_customer_id);
SET p_cart_id = LAST_INSERT_ID();
END IF;
END;
-- ============================
-- 2. Get Cart Details with Items
-- ============================
DROP PROCEDURE IF EXISTS GetCartDetails;
CREATE PROCEDURE GetCartDetails(IN p_cart_id INT) BEGIN
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
END;
-- ============================
-- 3. Get Cart Summary
-- ============================
DROP PROCEDURE IF EXISTS GetCartSummary;
CREATE PROCEDURE GetCartSummary(IN p_cart_id INT) BEGIN
SELECT c.cart_id,
    c.customer_id,
    c.created_at,
    c.updated_at,
    COUNT(ci.cart_item_id) as total_items,
    SUM(ci.quantity) as total_quantity,
    SUM(pv.price * ci.quantity) as subtotal,
    SUM(
        CASE
            WHEN i.quantity >= ci.quantity THEN 0
            ELSE 1
        END
    ) as out_of_stock_items
FROM Cart c
    LEFT JOIN Cart_item ci ON c.cart_id = ci.cart_id
    LEFT JOIN ProductVariant pv ON ci.variant_id = pv.variant_id
    LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
WHERE c.cart_id = p_cart_id
GROUP BY c.cart_id,
    c.customer_id,
    c.created_at,
    c.updated_at;
END;
-- ============================
-- 4. Update Cart Item Quantity
-- ============================
DROP PROCEDURE IF EXISTS UpdateCartItemQuantity;
CREATE PROCEDURE UpdateCartItemQuantity(
    IN p_cart_id INT,
    IN p_variant_id INT,
    IN p_new_quantity INT
) BEGIN
DECLARE available_stock INT;
-- Check available stock
SELECT COALESCE(quantity, 0) INTO available_stock
FROM Inventory
WHERE variant_id = p_variant_id;
-- Validate quantity
IF p_new_quantity <= 0 THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Quantity must be greater than 0';
END IF;
IF p_new_quantity > available_stock THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Requested quantity exceeds available stock';
END IF;
-- Update quantity
UPDATE Cart_item
SET quantity = p_new_quantity
WHERE cart_id = p_cart_id
    AND variant_id = p_variant_id;
IF ROW_COUNT() = 0 THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Item not found in cart';
END IF;
END;
-- ============================
-- 5. Clear Cart
-- ============================
DROP PROCEDURE IF EXISTS ClearCart;
CREATE PROCEDURE ClearCart(IN p_cart_id INT) BEGIN
DELETE FROM Cart_item
WHERE cart_id = p_cart_id;
END;
-- ============================
-- 6. Remove Single Item from Cart
-- ============================
DROP PROCEDURE IF EXISTS RemoveCartItem;
CREATE PROCEDURE RemoveCartItem(IN p_cart_id INT, IN p_variant_id INT) BEGIN
DELETE FROM Cart_item
WHERE cart_id = p_cart_id
    AND variant_id = p_variant_id;
IF ROW_COUNT() = 0 THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Item not found in cart';
END IF;
END;
-- ============================
-- 7. Validate Cart (Check stock availability for all items)
-- ============================
DROP PROCEDURE IF EXISTS ValidateCart;
CREATE PROCEDURE ValidateCart(IN p_cart_id INT) BEGIN
SELECT ci.cart_item_id,
    ci.variant_id,
    pv.sku,
    p.name as product_name,
    ci.quantity as requested_quantity,
    COALESCE(i.quantity, 0) as available_quantity,
    CASE
        WHEN i.quantity >= ci.quantity THEN 'OK'
        WHEN i.quantity > 0 THEN 'INSUFFICIENT'
        ELSE 'OUT_OF_STOCK'
    END as status,
    CASE
        WHEN i.quantity >= ci.quantity THEN ''
        WHEN i.quantity > 0 THEN CONCAT('Only ', i.quantity, ' available')
        ELSE 'Out of stock'
    END as message
FROM Cart_item ci
    INNER JOIN ProductVariant pv ON ci.variant_id = pv.variant_id
    INNER JOIN Product p ON pv.product_id = p.product_id
    LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
WHERE ci.cart_id = p_cart_id;
END;
-- ============================
-- 8. Merge Guest Cart to Customer Cart (for login/signup)
-- ============================
DROP PROCEDURE IF EXISTS MergeGuestCart;
CREATE PROCEDURE MergeGuestCart(
    IN p_guest_cart_id INT,
    IN p_customer_cart_id INT
) BEGIN
DECLARE done INT DEFAULT FALSE;
DECLARE v_variant_id INT;
DECLARE v_quantity INT;
DECLARE cur CURSOR FOR
SELECT variant_id,
    quantity
FROM Cart_item
WHERE cart_id = p_guest_cart_id;
DECLARE CONTINUE HANDLER FOR NOT FOUND
SET done = TRUE;
OPEN cur;
read_loop: LOOP FETCH cur INTO v_variant_id,
v_quantity;
IF done THEN LEAVE read_loop;
END IF;
-- Check if item already exists in customer cart
IF EXISTS (
    SELECT 1
    FROM Cart_item
    WHERE cart_id = p_customer_cart_id
        AND variant_id = v_variant_id
) THEN -- Update existing item
UPDATE Cart_item
SET quantity = quantity + v_quantity
WHERE cart_id = p_customer_cart_id
    AND variant_id = v_variant_id;
ELSE -- Insert new item
INSERT INTO Cart_item (cart_id, variant_id, quantity)
VALUES (p_customer_cart_id, v_variant_id, v_quantity);
END IF;
END LOOP;
CLOSE cur;
-- Clear guest cart
DELETE FROM Cart_item
WHERE cart_id = p_guest_cart_id;
DELETE FROM Cart
WHERE cart_id = p_guest_cart_id;
END;
-- ============================
-- 9. Get Cart Item Count
-- ============================
DROP PROCEDURE IF EXISTS GetCartItemCount;
CREATE PROCEDURE GetCartItemCount(
    IN p_cart_id INT,
    OUT p_item_count INT,
    OUT p_total_quantity INT
) BEGIN
SELECT COUNT(cart_item_id),
    COALESCE(SUM(quantity), 0) INTO p_item_count,
    p_total_quantity
FROM Cart_item
WHERE cart_id = p_cart_id;
END;
-- ============================
-- 10. Check if Item Exists in Cart
-- ============================
DROP FUNCTION IF EXISTS IsItemInCart;
CREATE FUNCTION IsItemInCart(p_cart_id INT, p_variant_id INT) RETURNS BOOLEAN DETERMINISTIC BEGIN
DECLARE item_exists BOOLEAN;
SELECT EXISTS(
        SELECT 1
        FROM Cart_item
        WHERE cart_id = p_cart_id
            AND variant_id = p_variant_id
    ) INTO item_exists;
RETURN item_exists;
END;
-- ============================
-- Summary
-- ============================
-- Created comprehensive cart management procedures:
-- 1. GetOrCreateCart - Get or create cart for customer
-- 2. GetCartDetails - Get all cart items with product details
-- 3. GetCartSummary - Get cart summary (totals, counts)
-- 4. UpdateCartItemQuantity - Update item quantity with validation
-- 5. ClearCart - Remove all items from cart
-- 6. RemoveCartItem - Remove single item from cart
-- 7. ValidateCart - Check stock availability for checkout
-- 8. MergeGuestCart - Merge guest cart to customer cart
-- 9. GetCartItemCount - Get item and quantity counts
-- 10. IsItemInCart - Check if item exists in cart
-- ============================
SELECT 'Cart procedures created successfully!' AS Status;