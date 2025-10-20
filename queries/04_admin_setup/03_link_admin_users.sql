-- ============================
-- Link Staff Account to users Table
-- This allows admin_jvishula to login via /api/auth/login
-- ============================

USE brightbuy;

-- Get the staff_id for admin_jvishula
SET @staff_id = (SELECT staff_id FROM Staff WHERE email = 'admin_jvishula@brightbuy.com');

-- Get the password hash from Staff table
SET @password_hash = (SELECT password_hash FROM Staff WHERE email = 'admin_jvishula@brightbuy.com');

-- Check if user entry already exists
SELECT 'Checking for existing user entry...' AS Status;
SELECT user_id, email, role, staff_id FROM users WHERE email = 'admin_jvishula@brightbuy.com';

-- Insert into users table linking to staff
INSERT INTO users (email, password_hash, role, customer_id, staff_id, is_active)
VALUES (
    'admin_jvishula@brightbuy.com',
    @password_hash,
    'staff',
    NULL,
    @staff_id,
    1
)
ON DUPLICATE KEY UPDATE 
    staff_id = @staff_id,
    password_hash = @password_hash,
    is_active = 1;

-- Verify the complete setup
SELECT 'Verification: Staff Table' AS Check_Type;
SELECT 
    staff_id,
    user_name,
    email,
    role,
    LEFT(password_hash, 30) as password_preview
FROM Staff 
WHERE email = 'admin_jvishula@brightbuy.com';

SELECT 'Verification: users Table' AS Check_Type;
SELECT 
    user_id,
    email,
    role,
    staff_id,
    customer_id,
    is_active,
    LEFT(password_hash, 30) as password_preview
FROM users 
WHERE email = 'admin_jvishula@brightbuy.com';

SELECT 'Account is now ready for login!' AS Status;
SELECT 'Email: admin_jvishula@brightbuy.com' AS Login_Email;
SELECT 'Password: 123456' AS Login_Password;
SELECT 'Endpoint: POST /api/auth/login' AS Login_Endpoint;
