USE brightbuy;

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
        pv.image_url,  -- ← ADD THIS LINE!
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