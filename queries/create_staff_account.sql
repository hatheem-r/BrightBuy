-- ============================
-- Create Staff Account: admin_brightbuy
-- ============================
-- This script creates a staff member and associated user account
-- Username: admin_brightbuy
-- Password: 123456 (will be hashed by bcrypt in application)
-- Role: staff

USE brightbuy;

-- Delete existing staff account if it exists (CASCADE will delete from users table too)
DELETE FROM Staff WHERE email = 'admin@brightbuy.com';

-- Insert into Staff table
INSERT INTO Staff (user_name, email, password_hash, phone, role)
VALUES (
    'admin_brightbuy',
    'admin@brightbuy.com',
    '$2b$10$45/QFPHQShGN9eNfqfkeUeTAwjaPoivJjVRuaOtDc9Hb2aiDvQVvu', -- bcrypt hash for '123456'
    '1234567890',
    'Level01'
);

-- Get the staff_id that was just created
SET @staff_id = LAST_INSERT_ID();

-- Now insert into users table
INSERT INTO users (email, password_hash, role, is_active, staff_id)
VALUES (
    'admin@brightbuy.com',
    '$2b$10$45/QFPHQShGN9eNfqfkeUeTAwjaPoivJjVRuaOtDc9Hb2aiDvQVvu', -- bcrypt hash for '123456'
    'staff',
    1,
    @staff_id
);

-- Verify the insertion
SELECT 
    u.user_id,
    u.email,
    u.role,
    u.is_active,
    s.staff_id,
    s.user_name,
    s.role AS staff_role
FROM users u
JOIN Staff s ON u.staff_id = s.staff_id
WHERE u.email = 'admin@brightbuy.com';
