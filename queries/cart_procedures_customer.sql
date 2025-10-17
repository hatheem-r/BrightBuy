-- ============================
-- BrightBuy Cart Management Procedures
-- Using customer_id approach (direct customer-to-cart-item relationship)
-- Date: October 17, 2025
-- ============================

USE brightbuy;

--@block Add Item to Cart
-- ============================
-- 1. Add Item to Customer's Cart
-- ============================
DROP PROCEDURE IF EXISTS AddToCart;

DELIMITER //
CREATE PROCEDURE AddToCart(
    IN p_customer_id INT,
    IN p_variant_id INT,
    IN p_quantity INT
) 
BEGIN 
    -- Check if customer exists
    IF NOT EXISTS (SELECT 1 FROM Customer WHERE customer_id = p_customer_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer does not exist';
    END IF;

    -- Check if variant exists
    IF NOT EXISTS (SELECT 1 FROM ProductVariant WHERE variant_id = p_variant_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Product variant does not exist';
    END IF;

    -- Validate quantity
    IF p_quantity <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Quantity must be greater than 0';
    END IF;

    -- Upsert cart item
    INSERT INTO Cart_item(customer_id, variant_id, quantity)
    VALUES(p_customer_id, p_variant_id, p_quantity)
    ON DUPLICATE KEY UPDATE 
        quantity = quantity + p_quantity;
END//
DELIMITER ;

--@block Get Customer Cart
-- ============================
-- 2. Get Customer's Cart Items
-- ============================
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

--@block Get Customer Cart Summary
-- ============================
-- 3. Get Customer's Cart Summary
-- ============================
DROP PROCEDURE IF EXISTS GetCustomerCartSummary;

DELIMITER //
CREATE PROCEDURE GetCustomerCartSummary(IN p_customer_id INT) 
BEGIN
    SELECT 
        p_customer_id as customer_id,
        COUNT(ci.cart_item_id) as total_items,
        COALESCE(SUM(ci.quantity), 0) as total_quantity,
        COALESCE(SUM(pv.price * ci.quantity), 0) as subtotal,
        SUM(
            CASE
                WHEN i.quantity < ci.quantity THEN 1
                ELSE 0
            END
        ) as out_of_stock_items
    FROM Cart_item ci
        INNER JOIN ProductVariant pv ON ci.variant_id = pv.variant_id
        LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
    WHERE ci.customer_id = p_customer_id;
END//
DELIMITER ;

--@block Update Cart Item Quantity
-- ============================
-- 4. Update Cart Item Quantity
-- ============================
DROP PROCEDURE IF EXISTS UpdateCartItemQuantity;

DELIMITER //
CREATE PROCEDURE UpdateCartItemQuantity(
    IN p_customer_id INT,
    IN p_variant_id INT,
    IN p_new_quantity INT
) 
BEGIN
    -- Validate quantity
    IF p_new_quantity <= 0 THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Quantity must be greater than 0';
    END IF;
    
    -- Update quantity
    UPDATE Cart_item
    SET quantity = p_new_quantity
    WHERE customer_id = p_customer_id
        AND variant_id = p_variant_id;
    
    IF ROW_COUNT() = 0 THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Item not found in cart';
    END IF;
END//
DELIMITER ;

--@block Remove Item from Cart
-- ============================
-- 5. Remove Item from Customer's Cart
-- ============================
DROP PROCEDURE IF EXISTS RemoveFromCart;

DELIMITER //
CREATE PROCEDURE RemoveFromCart(
    IN p_customer_id INT,
    IN p_variant_id INT
) 
BEGIN
    DELETE FROM Cart_item
    WHERE customer_id = p_customer_id
        AND variant_id = p_variant_id;
    
    IF ROW_COUNT() = 0 THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Item not found in cart';
    END IF;
END//
DELIMITER ;

--@block Clear Customer Cart
-- ============================
-- 6. Clear Customer's Cart
-- ============================
DROP PROCEDURE IF EXISTS ClearCustomerCart;

DELIMITER //
CREATE PROCEDURE ClearCustomerCart(IN p_customer_id INT) 
BEGIN
    DELETE FROM Cart_item
    WHERE customer_id = p_customer_id;
    
    SELECT ROW_COUNT() as items_removed;
END//
DELIMITER ;

--@block Get Customer Cart Count
-- ============================
-- 7. Get Cart Item Count for Customer
-- ============================
DROP PROCEDURE IF EXISTS GetCustomerCartCount;

DELIMITER //
CREATE PROCEDURE GetCustomerCartCount(IN p_customer_id INT) 
BEGIN
    SELECT 
        COUNT(cart_item_id) as total_items,
        COALESCE(SUM(quantity), 0) as total_quantity
    FROM Cart_item
    WHERE customer_id = p_customer_id;
END//
DELIMITER ;

--@block Test Procedures
-- ============================
-- Usage Examples
-- ============================
/*
-- Add item to cart
CALL AddToCart(1, 5, 2);

-- Get all cart items for customer
CALL GetCustomerCart(1);

-- Get cart summary
CALL GetCustomerCartSummary(1);

-- Update quantity
CALL UpdateCartItemQuantity(1, 5, 3);

-- Remove specific item
CALL RemoveFromCart(1, 5);

-- Clear entire cart
CALL ClearCustomerCart(1);

-- Get cart count
CALL GetCustomerCartCount(1);
*/

SELECT 'Cart procedures created successfully!' AS Status;
