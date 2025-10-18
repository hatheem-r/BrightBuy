-- 1. Check Cart_item structure
DESCRIBE Cart_item;

-- 2. Check Cart table structure
DESCRIBE Cart;

-- 3. List all cart-related procedures
SHOW PROCEDURE STATUS WHERE Db = 'brightbuy' AND Name LIKE '%Cart%';

-- 4. Check constraints on Cart_item
SHOW CREATE TABLE Cart_item;