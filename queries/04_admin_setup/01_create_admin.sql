-- ============================
-- Create Level01 Staff Account
-- Admin: admin_jvishula@brightbuy.com
-- Password: 123456 (bcrypt hashed)
-- ============================

USE brightbuy;

-- Insert Level01 Staff Account
INSERT INTO Staff (user_name, email, password_hash, phone, role)
VALUES (
    'admin_jvishula',
    'admin_jvishula@brightbuy.com',
    '$2b$10$FVKavkRNr22xFXs0wlrz1eGlUE.Vp1uQOydSoT/cotUwD8sKY1Jx.',
    NULL,
    'Level01'
);

-- Verify the account was created
SELECT 
    staff_id,
    user_name,
    email,
    role,
    created_at
FROM Staff
WHERE email = 'admin_jvishula@brightbuy.com';

SELECT 'Level01 staff account created successfully!' AS Status;
SELECT 'Username: admin_jvishula' AS Username;
SELECT 'Email: admin_jvishula@brightbuy.com' AS Email;
SELECT 'Password: 123456' AS Password;
SELECT 'Role: Level01 (Full Admin Access)' AS Role;
