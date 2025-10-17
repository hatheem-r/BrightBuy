-- Check if Staff and users tables exist
USE brightbuy;

SHOW TABLES LIKE '%staff%';
SHOW TABLES LIKE '%user%';

-- Check Staff table structure
DESCRIBE Staff;

-- Check users table structure  
DESCRIBE users;

-- Check if any staff exists
SELECT COUNT(*) as staff_count FROM Staff;

-- Check if any users with staff role exist
SELECT COUNT(*) as staff_users_count FROM users WHERE role = 'staff';
