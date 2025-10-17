-- ============================
-- Recreate users table
-- ============================
-- This file recreates the `users` table exactly as it exists in the brightbuy database
-- Retrieved using: SHOW CREATE TABLE users
-- Date: 2025-10-17
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `user_id` int(11) NOT NULL AUTO_INCREMENT,
    `email` varchar(255) NOT NULL,
    `password_hash` varchar(255) NOT NULL,
    `role` enum('customer', 'staff', 'manager', 'admin') NOT NULL DEFAULT 'customer',
    `is_active` tinyint(1) DEFAULT 1,
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    `last_login` timestamp NULL DEFAULT NULL,
    `customer_id` int(11) DEFAULT NULL,
    `staff_id` int(11) DEFAULT NULL,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `email` (`email`),
    UNIQUE KEY `customer_id` (`customer_id`),
    UNIQUE KEY `staff_id` (`staff_id`),
    KEY `idx_email` (`email`),
    KEY `idx_role` (`role`),
    KEY `idx_customer` (`customer_id`),
    KEY `idx_staff` (`staff_id`),
    CONSTRAINT `fk_users_customer` FOREIGN KEY (`customer_id`) REFERENCES `Customer` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_users_staff` FOREIGN KEY (`staff_id`) REFERENCES `Staff` (`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================
-- Table Description:
-- ============================
-- user_id       : Primary key, auto-increment
-- email         : Unique email address for login
-- password_hash : Bcrypt hashed password
-- role          : User role (customer, staff, manager, admin)
-- is_active     : Account status flag (1=active, 0=inactive)
-- created_at    : Account creation timestamp
-- last_login    : Last login timestamp
-- customer_id   : Foreign key to Customer table (unique, one-to-one)
-- staff_id      : Foreign key to Staff table (unique, one-to-one)
--
-- Foreign Keys:
-- - Links to Customer table via customer_id (CASCADE delete/update)
-- - Links to Staff table via staff_id (CASCADE delete/update)
--
-- Indexes:
-- - Primary key on user_id
-- - Unique indexes on email, customer_id, staff_id
-- - Additional indexes on email, role, customer_id, staff_id for query performance