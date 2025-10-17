-- ============================
-- SIMPLE: Create Staff Account
-- ============================
-- Copy and paste this ENTIRE script into MySQL Workbench
-- Then click Execute (Lightning bolt icon)

USE brightbuy;

-- Step 1: Clean up any existing account (if exists)
DELETE FROM Staff WHERE email = 'admin@brightbuy.com';

-- Step 2: Create the staff member
INSERT INTO Staff (user_name, email, password_hash, phone, role)
VALUES (
    'admin_brightbuy',
    'admin@brightbuy.com',
    '$2b$10$45/QFPHQShGN9eNfqfkeUeTAwjaPoivJjVRuaOtDc9Hb2aiDvQVvu',
    '1234567890',
    'Level01'
);

-- Step 3: Get the staff_id
SET @staff_id = LAST_INSERT_ID();

-- Step 4: Create the user account
INSERT INTO users (email, password_hash, role, is_active, staff_id)
VALUES (
    'admin@brightbuy.com',
    '$2b$10$45/QFPHQShGN9eNfqfkeUeTAwjaPoivJjVRuaOtDc9Hb2aiDvQVvu',
    'staff',
    1,
    @staff_id
);

-- Step 5: Verify it worked
SELECT 
    'SUCCESS! Staff account created:' AS message,
    u.user_id,
    u.email,
    u.role,
    s.user_name,
    s.role AS staff_level
FROM users u
JOIN Staff s ON u.staff_id = s.staff_id
WHERE u.email = 'admin@brightbuy.com';
