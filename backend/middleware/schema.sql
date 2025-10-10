-- ============================================
-- BrightBuy Database Schema
-- E-commerce Platform Database
-- ============================================
-- Drop existing tables if they exist (for clean setup)
--@block
CREATE DATABASE brightbuy;


DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;


--@block
-- ============================================
-- BLOCK 1: USER MANAGEMENT
-- Tables: users
-- Purpose: Handle user authentication and profiles
-- ============================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin', 'manager') DEFAULT 'customer',
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


--@block
-- ============================================
-- BLOCK 2: PRODUCT CATALOG
-- Tables: categories, products, product_variants, product_images
-- Purpose: Store product information and inventory
-- ============================================
-- Categories table for product organization

CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE
    SET NULL,
        INDEX idx_parent_category (parent_category_id),
        INDEX idx_active (is_active)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--@block
-- Main products table
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category_id INT,
    brand VARCHAR(100),
    rating DECIMAL(2, 1) DEFAULT 0.0,
    total_reviews INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE
    SET NULL,
        INDEX idx_category (category_id),
        INDEX idx_active (is_active),
        INDEX idx_featured (is_featured),
        INDEX idx_sku (sku),
        INDEX idx_name (name)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--@block
-- Product variants (for different colors, sizes, memory options, etc.)
CREATE TABLE product_variants (
    variant_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    variant_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(50),
    size VARCHAR(50),
    memory VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    stock_quantity INT DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_stock (stock_quantity),
    INDEX idx_active (is_active),
    INDEX idx_sku (sku)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--@block
-- Product images
CREATE TABLE product_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    variant_id INT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_variant (variant_id),
    INDEX idx_primary (is_primary)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--@block
-- ============================================
-- BLOCK 3: SHOPPING CART
-- Tables: cart_items
-- Purpose: Handle temporary cart storage for logged-in users
-- ============================================
CREATE TABLE cart_items (
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_variant (user_id, variant_id),
    INDEX idx_user (user_id),
    INDEX idx_variant (variant_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--@block
-- ============================================
-- BLOCK 4: ORDER MANAGEMENT
-- Tables: orders, order_items
-- Purpose: Store order information and order details
-- ============================================
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    -- Shipping information
    shipping_first_name VARCHAR(100) NOT NULL,
    shipping_last_name VARCHAR(100) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(20) NOT NULL,
    shipping_phone VARCHAR(20),
    -- Order totals
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    -- Payment and status
    payment_method ENUM('Card Payment', 'Cash on Delivery') NOT NULL,
    payment_status ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Pending',
    order_status ENUM(
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled'
    ) DEFAULT 'Pending',
    -- Tracking information
    courier_service VARCHAR(100),
    courier_contact VARCHAR(255),
    tracking_number VARCHAR(100),
    estimated_delivery_date DATE,
    delivered_at TIMESTAMP NULL,
    -- Notes and timestamps
    order_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_order_status (order_status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    variant_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_variant (variant_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--@block
-- ============================================
-- BLOCK 5: SAMPLE DATA FOR TESTING
-- Purpose: Insert sample data for development and testing
-- ============================================
-- Insert sample categories
INSERT INTO categories (name, description, is_active)
VALUES (
        'Cables',
        'Various types of cables and connectors',
        TRUE
    ),
    (
        'Peripherals',
        'Computer peripherals and accessories',
        TRUE
    ),
    ('Displays', 'Monitors and display devices', TRUE),
    (
        'Power',
        'Power banks and charging solutions',
        TRUE
    ),
    ('Audio', 'Audio devices and accessories', TRUE),
    ('Storage', 'Storage devices and solutions', TRUE);

    --@block
-- Insert sample products
INSERT INTO products (
        name,
        sku,
        description,
        category_id,
        brand,
        rating,
        is_active,
        is_featured
    )
VALUES (
        'Samsung NVME SSD',
        'SS-NVME-SSD',
        'High Speed 8,000MB/s, PCIe 5.0, NVME SSD, Type-C Connectivity, Original Branded',
        6,
        'Samsung',
        4.5,
        TRUE,
        TRUE
    ),
    (
        'USB-C Cable',
        'USB-C-1M',
        'High quality USB-C cable 1 meter',
        1,
        'Generic',
        4.2,
        TRUE,
        FALSE
    ),
    (
        'Wireless Mouse',
        'WM-001',
        'Ergonomic wireless mouse',
        2,
        'Logitech',
        4.3,
        TRUE,
        FALSE
    ),
    (
        'Mechanical Keyboard',
        'MK-RGB-001',
        'RGB Mechanical Gaming Keyboard',
        2,
        'Razer',
        4.6,
        TRUE,
        TRUE
    ),
    (
        '27" Monitor',
        'MON-27-4K',
        '4K UHD 27 inch monitor',
        3,
        'Dell',
        4.7,
        TRUE,
        TRUE
    ),
    (
        'Portable Charger 10000mAh',
        'PC-10K',
        '10000mAh power bank with fast charging',
        4,
        'Anker',
        4.4,
        TRUE,
        FALSE
    ),
    (
        'Bluetooth Speaker',
        'BT-SPK-001',
        'Portable Bluetooth speaker',
        5,
        'JBL',
        4.5,
        TRUE,
        FALSE
    );


    --@block
-- Insert sample product variants for Samsung SSD
INSERT INTO product_variants (
        product_id,
        variant_name,
        sku,
        color,
        memory,
        price,
        old_price,
        stock_quantity,
        is_default,
        is_active
    )
VALUES (
        1,
        'Samsung 1TB NVME SSD - Black',
        'SS-NVME-1TB-BLK',
        'Black',
        '1TB',
        2999.00,
        3499.00,
        15,
        TRUE,
        TRUE
    ),
    (
        1,
        'Samsung 1TB NVME SSD - White',
        'SS-NVME-1TB-WHT',
        'White',
        '1TB',
        3099.00,
        3599.00,
        8,
        FALSE,
        TRUE
    ),
    (
        1,
        'Samsung 2TB NVME SSD - Black',
        'SS-NVME-2TB-BLK',
        'Black',
        '2TB',
        4999.00,
        5999.00,
        5,
        FALSE,
        TRUE
    );


    --@block
-- Insert sample product variants for other products
INSERT INTO product_variants (
        product_id,
        variant_name,
        sku,
        color,
        size,
        price,
        old_price,
        stock_quantity,
        is_default,
        is_active
    )
VALUES (
        2,
        'USB-C Cable 1m - Black',
        'USB-C-1M-BLK',
        'Black',
        '1m',
        299.00,
        NULL,
        50,
        TRUE,
        TRUE
    ),
    (
        3,
        'Wireless Mouse - Black',
        'WM-001-BLK',
        'Black',
        NULL,
        1299.00,
        1499.00,
        25,
        TRUE,
        TRUE
    ),
    (
        4,
        'Mechanical Keyboard RGB',
        'MK-RGB-001-BLK',
        'Black',
        'Full Size',
        4999.00,
        5999.00,
        12,
        TRUE,
        TRUE
    ),
    (
        5,
        '27" Monitor 4K',
        'MON-27-4K-BLK',
        'Black',
        '27"',
        24999.00,
        29999.00,
        8,
        TRUE,
        TRUE
    ),
    (
        6,
        'Portable Charger 10000mAh',
        'PC-10K-BLK',
        'Black',
        NULL,
        1999.00,
        2499.00,
        30,
        TRUE,
        TRUE
    ),
    (
        7,
        'Bluetooth Speaker',
        'BT-SPK-001-BLK',
        'Black',
        NULL,
        3499.00,
        3999.00,
        20,
        TRUE,
        TRUE
    );


    --@block
-- Insert sample users (passwords should be hashed in real application)
-- Password: 'password123' hashed with bcrypt
INSERT INTO users (name, email, password_hash, role, is_active)
VALUES (
        'John Doe',
        'john@example.com',
        '$2a$10$rQ3qQ4Qz4qQ3qQ4Qz4qQ3qOK5j5K5j5K5j5K5j5K5j5K5j5K5j5K',
        'customer',
        TRUE
    ),
    (
        'Jane Smith',
        'jane@example.com',
        '$2a$10$rQ3qQ4Qz4qQ3qQ4Qz4qQ3qOK5j5K5j5K5j5K5j5K5j5K5j5K5j5K',
        'customer',
        TRUE
    ),
    (
        'Admin User',
        'admin@brightbuy.com',
        '$2a$10$rQ3qQ4Qz4qQ3qQ4Qz4qQ3qOK5j5K5j5K5j5K5j5K5j5K5j5K5j5K',
        'admin',
        TRUE
    );




-- ============================================
-- BLOCK 6: COMMON QUERIES FOR API ENDPOINTS
-- Purpose: SQL queries that will be used in the backend controllers
-- ============================================
-- Query 1: Get all active products with default variant (for product listing)
-- Used in: GET /api/products
/*
 SELECT 
 p.product_id,
 p.name,
 p.sku,
 p.description,
 p.brand,
 p.rating,
 p.is_featured,
 c.name AS category_name,
 pv.variant_id,
 pv.variant_name,
 pv.price,
 pv.old_price,
 pv.stock_quantity,
 pv.color,
 pv.memory,
 pi.image_url
 FROM products p
 LEFT JOIN categories c ON p.category_id = c.category_id
 LEFT JOIN product_variants pv ON p.product_id = pv.product_id AND pv.is_default = TRUE
 LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
 WHERE p.is_active = 1
 ORDER BY p.is_featured DESC, p.created_at DESC;
 */
-- Query 2: Get single product with all variants and images (for product detail page)
-- Used in: GET /api/products/:id
/*
 SELECT 
 p.product_id,
 p.name,
 p.sku,
 p.description,
 p.brand,
 p.rating,
 p.total_reviews,
 c.name AS category_name,
 pv.variant_id,
 pv.variant_name,
 pv.sku AS variant_sku,
 pv.color,
 pv.size,
 pv.memory,
 pv.price,
 pv.old_price,
 pv.stock_quantity,
 pv.is_default,
 pi.image_id,
 pi.image_url,
 pi.alt_text,
 pi.is_primary
 FROM products p
 LEFT JOIN categories c ON p.category_id = c.category_id
 LEFT JOIN product_variants pv ON p.product_id = pv.product_id
 LEFT JOIN product_images pi ON p.product_id = pi.product_id
 WHERE p.product_id = ? AND p.is_active = 1
 ORDER BY pv.is_default DESC, pi.is_primary DESC;
 */
-- Query 3: User registration
-- Used in: POST /api/auth/register
/*
 INSERT INTO users (name, email, password_hash, role) 
 VALUES (?, ?, ?, 'customer');
 */
-- Query 4: User login - get user by email
-- Used in: POST /api/auth/login
/*
 SELECT user_id, name, email, password_hash, role, is_active 
 FROM users 
 WHERE email = ? AND is_active = TRUE;
 */
-- Query 5: Get user profile
-- Used in: GET /api/auth/profile (with JWT authentication)
/*
 SELECT user_id, name, email, role, phone, created_at, last_login 
 FROM users 
 WHERE user_id = ?;
 */
-- Query 6: Add item to cart
-- Used in: POST /api/cart
/*
 INSERT INTO cart_items (user_id, variant_id, quantity) 
 VALUES (?, ?, ?)
 ON DUPLICATE KEY UPDATE 
 quantity = quantity + VALUES(quantity),
 updated_at = CURRENT_TIMESTAMP;
 */
-- Query 7: Get cart items for user
-- Used in: GET /api/cart
/*
 SELECT 
 ci.cart_item_id,
 ci.quantity,
 pv.variant_id,
 pv.variant_name,
 pv.color,
 pv.memory,
 pv.price,
 pv.stock_quantity,
 p.product_id,
 p.name AS product_name,
 pi.image_url
 FROM cart_items ci
 JOIN product_variants pv ON ci.variant_id = pv.variant_id
 JOIN products p ON pv.product_id = p.product_id
 LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
 WHERE ci.user_id = ?
 ORDER BY ci.added_at DESC;
 */
-- Query 8: Update cart item quantity
-- Used in: PUT /api/cart/:id
/*
 UPDATE cart_items 
 SET quantity = ?, updated_at = CURRENT_TIMESTAMP 
 WHERE cart_item_id = ? AND user_id = ?;
 */
-- Query 9: Remove item from cart
-- Used in: DELETE /api/cart/:id
/*
 DELETE FROM cart_items 
 WHERE cart_item_id = ? AND user_id = ?;
 */
-- Query 10: Clear user cart
-- Used in: DELETE /api/cart
/*
 DELETE FROM cart_items WHERE user_id = ?;
 */
-- Query 11: Create new order
-- Used in: POST /api/orders
/*
 INSERT INTO orders (
 order_number, user_id, 
 shipping_first_name, shipping_last_name, shipping_address, 
 shipping_city, shipping_postal_code, shipping_phone,
 subtotal, shipping_cost, total_amount,
 payment_method, payment_status, order_status
 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Pending');
 */
-- Query 12: Create order items
-- Used in: POST /api/orders (after creating order)
/*
 INSERT INTO order_items (
 order_id, variant_id, product_name, variant_name, 
 sku, quantity, unit_price, subtotal
 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
 */
-- Query 13: Get user orders
-- Used in: GET /api/orders
/*
 SELECT 
 o.order_id,
 o.order_number,
 o.total_amount,
 o.order_status,
 o.payment_status,
 o.payment_method,
 o.created_at,
 o.estimated_delivery_date,
 COUNT(oi.order_item_id) AS item_count
 FROM orders o
 LEFT JOIN order_items oi ON o.order_id = oi.order_id
 WHERE o.user_id = ?
 GROUP BY o.order_id
 ORDER BY o.created_at DESC;
 */
-- Query 14: Get order details by order number
-- Used in: GET /api/orders/:orderNumber
/*
 SELECT 
 o.order_id,
 o.order_number,
 o.shipping_first_name,
 o.shipping_last_name,
 o.shipping_address,
 o.shipping_city,
 o.shipping_postal_code,
 o.subtotal,
 o.shipping_cost,
 o.total_amount,
 o.payment_method,
 o.payment_status,
 o.order_status,
 o.courier_service,
 o.courier_contact,
 o.tracking_number,
 o.estimated_delivery_date,
 o.created_at,
 oi.order_item_id,
 oi.product_name,
 oi.variant_name,
 oi.quantity,
 oi.unit_price,
 oi.subtotal AS item_subtotal
 FROM orders o
 LEFT JOIN order_items oi ON o.order_id = oi.order_id
 WHERE o.order_number = ? AND o.user_id = ?;
 */
-- Query 15: Update order status
-- Used in: PUT /api/orders/:id/status (admin only)
/*
 UPDATE orders 
 SET order_status = ?, updated_at = CURRENT_TIMESTAMP 
 WHERE order_id = ?;
 */
-- Query 16: Search products by name or category
-- Used in: GET /api/products/search?q=keyword
/*
 SELECT DISTINCT
 p.product_id,
 p.name,
 p.sku,
 p.description,
 p.brand,
 p.rating,
 c.name AS category_name,
 pv.price,
 pv.old_price,
 pi.image_url
 FROM products p
 LEFT JOIN categories c ON p.category_id = c.category_id
 LEFT JOIN product_variants pv ON p.product_id = pv.product_id AND pv.is_default = TRUE
 LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
 WHERE p.is_active = 1 
 AND (
 p.name LIKE ? 
 OR p.description LIKE ? 
 OR c.name LIKE ?
 OR p.brand LIKE ?
 )
 ORDER BY p.rating DESC, p.created_at DESC;
 */
-- Query 17: Get inventory/stock levels (for admin/inventory page)
-- Used in: GET /api/inventory
/*
 SELECT 
 p.product_id,
 p.name AS product_name,
 p.sku AS product_sku,
 c.name AS category_name,
 pv.variant_id,
 pv.variant_name,
 pv.sku AS variant_sku,
 pv.color,
 pv.memory,
 pv.stock_quantity,
 pv.price,
 CASE 
 WHEN pv.stock_quantity = 0 THEN 'Out of Stock'
 WHEN pv.stock_quantity <= 5 THEN 'Low Stock'
 ELSE 'In Stock'
 END AS stock_status
 FROM products p
 JOIN product_variants pv ON p.product_id = pv.product_id
 LEFT JOIN categories c ON p.category_id = c.category_id
 WHERE p.is_active = 1
 ORDER BY pv.stock_quantity ASC, p.name ASC;
 */
-- Query 18: Update product stock
-- Used in: PUT /api/inventory/:variantId
/*
 UPDATE product_variants 
 SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP 
 WHERE variant_id = ?;
 */
-- Query 19: Get featured products (for homepage)
-- Used in: GET /api/products/featured
/*
 SELECT 
 p.product_id,
 p.name,
 p.description,
 p.rating,
 pv.variant_id,
 pv.price,
 pv.old_price,
 pi.image_url
 FROM products p
 LEFT JOIN product_variants pv ON p.product_id = pv.product_id AND pv.is_default = TRUE
 LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
 WHERE p.is_active = 1 AND p.is_featured = 1
 ORDER BY p.rating DESC
 LIMIT 10;
 */
-- Query 20: Get products by category
-- Used in: GET /api/products/category/:categoryId
/*
 SELECT 
 p.product_id,
 p.name,
 p.sku,
 p.brand,
 p.rating,
 pv.price,
 pv.old_price,
 pv.stock_quantity,
 pi.image_url
 FROM products p
 LEFT JOIN product_variants pv ON p.product_id = pv.product_id AND pv.is_default = TRUE
 LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
 WHERE p.category_id = ? AND p.is_active = 1
 ORDER BY p.name ASC;
 */
-- ============================================
-- END OF SCHEMA
-- ============================================