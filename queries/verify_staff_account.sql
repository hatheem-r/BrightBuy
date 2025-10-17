-- ============================
-- Verify Staff Account
-- ============================
USE brightbuy;

-- Check if staff exists
SELECT 'Staff Table:' as check_type;
SELECT * FROM Staff WHERE email = 'admin@brightbuy.com';

-- Check if user exists
SELECT 'Users Table:' as check_type;
SELECT * FROM users WHERE email = 'admin@brightbuy.com';

-- Check the join
SELECT 'Combined View:' as check_type;
SELECT 
    u.user_id,
    u.email,
    u.role AS user_role,
    u.is_active,
    u.staff_id,
    s.staff_id AS staff_table_id,
    s.user_name,
    s.role AS staff_level
FROM users u
LEFT JOIN Staff s ON u.staff_id = s.staff_id
WHERE u.email = 'admin@brightbuy.com';
