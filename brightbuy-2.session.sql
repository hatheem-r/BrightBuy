--@block
SELECT *
FROM users;
--@block
UPDATE users
SET role = 'staff'
WHERE user_id = 7;