-- Test Users for BrightBuy
-- This script creates test users with different roles
-- Default password for all users: "password123"
-- Passwords are hashed using bcryptjs with salt rounds = 10
USE brightbuy_db;
-- Insert test users
-- Password hash for "password123": $2a$10$xVvVQJZPF0C7bqrwO8YWHudlzlD3y7vJ8jVvjPvKUWF6UPXxK5PSm
INSERT INTO users (
        name,
        email,
        password_hash,
        role,
        phone,
        is_active
    )
VALUES (
        'Admin User',
        'admin@brightbuy.com',
        '$2a$10$xVvVQJZPF0C7bqrwO8YWHudlzlD3y7vJ8jVvjPvKUWF6UPXxK5PSm',
        'admin',
        '0771234567',
        TRUE
    ),
    (
        'Manager User',
        'manager@brightbuy.com',
        '$2a$10$xVvVQJZPF0C7bqrwO8YWHudlzlD3y7vJ8jVvjPvKUWF6UPXxK5PSm',
        'manager',
        '0772345678',
        TRUE
    ),
    (
        'John Doe',
        'customer@brightbuy.com',
        '$2a$10$xVvVQJZPF0C7bqrwO8YWHudlzlD3y7vJ8jVvjPvKUWF6UPXxK5PSm',
        'customer',
        '0773456789',
        TRUE
    ),
    (
        'Jane Smith',
        'jane@example.com',
        '$2a$10$xVvVQJZPF0C7bqrwO8YWHudlzlD3y7vJ8jVvjPvKUWF6UPXxK5PSm',
        'customer',
        '0774567890',
        TRUE
    );
-- Display created users
SELECT user_id,
    name,
    email,
    role,
    is_active,
    created_at
FROM users;
-- =====================================================
-- TEST CREDENTIALS:
-- =====================================================
-- Admin:
--   Email: admin@brightbuy.com
--   Password: password123
--
-- Manager:
--   Email: manager@brightbuy.com
--   Password: password123
--
-- Customer:
--   Email: customer@brightbuy.com
--   Password: password123
-- =====================================================
