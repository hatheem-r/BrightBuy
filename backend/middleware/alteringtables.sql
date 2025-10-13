--@block
ALTER TABLE users
ADD COLUMN role VARCHAR(50) DEFAULT 'customer';
--@/block