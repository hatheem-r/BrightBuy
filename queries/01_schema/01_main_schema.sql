-- ============================
-- BrightBuy Database Schema - Customer ID Approach
-- Modified to use customer_id directly in Cart_item (no separate Cart table)
-- Date: October 20, 2025
-- ============================

DROP DATABASE IF EXISTS brightbuy;
CREATE DATABASE brightbuy;
USE brightbuy;

-- ============================
-- 1. Category
-- ============================
CREATE TABLE Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INT NULL,
    CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES Category(category_id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- ============================
-- 2. Product
-- ============================
CREATE TABLE Product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================
-- 3. ProductCategory
-- ============================
CREATE TABLE ProductCategory (
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    CONSTRAINT fk_pc_product FOREIGN KEY (product_id) REFERENCES Product(product_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_pc_category FOREIGN KEY (category_id) REFERENCES Category(category_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- ============================
-- 4. ProductVariant
-- ============================
CREATE TABLE ProductVariant (
    variant_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    sku VARCHAR(50) UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    size VARCHAR(20),
    color VARCHAR(30),
    description TEXT,
    image_url VARCHAR(512),
    is_default TINYINT(1) DEFAULT 0,
    CONSTRAINT fk_variant_product FOREIGN KEY (product_id) REFERENCES Product(product_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT chk_variant_price CHECK (price > 0)
);
CREATE INDEX idx_productvariant_product ON ProductVariant(product_id);

DELIMITER //
CREATE TRIGGER trg_variant_category_check BEFORE INSERT ON ProductVariant FOR EACH ROW 
BEGIN
    DECLARE category_count INT;
    SELECT COUNT(*) INTO category_count
    FROM ProductCategory
    WHERE product_id = NEW.product_id;
    IF category_count = 0 THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot insert ProductVariant: parent Product not assigned to any Category';
    END IF;
END//
DELIMITER ;

-- ============================
-- 5. Customer
-- ============================
CREATE TABLE Customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- 6. Address
-- ============================
CREATE TABLE Address (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(10),
    is_default TINYINT(1) DEFAULT 0,
    CONSTRAINT fk_address_customer FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- ============================
-- 7. Shipment
-- ============================
CREATE TABLE Shipment (
    shipment_id INT AUTO_INCREMENT PRIMARY KEY,
    shipment_provider VARCHAR(100),
    tracking_number VARCHAR(100),
    shipped_date TIMESTAMP NULL,
    delivered_date TIMESTAMP NULL,
    notes VARCHAR(255)
);

-- ============================
-- 8. ZipDeliveryZone
-- ============================
CREATE TABLE ZipDeliveryZone (
    zip_code VARCHAR(10) PRIMARY KEY,
    state CHAR(2) NOT NULL,
    is_texas TINYINT(1) NOT NULL DEFAULT 0,
    is_main_city TINYINT(1) NOT NULL DEFAULT 0,
    base_fee DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
    base_days INT NOT NULL DEFAULT 7,
    nearest_main_zip VARCHAR(10) NULL,
    city_name VARCHAR(100)
);
CREATE INDEX ix_zip_state ON ZipDeliveryZone(is_texas, is_main_city);

INSERT INTO ZipDeliveryZone(zip_code, state, is_texas, is_main_city, base_fee, base_days, nearest_main_zip, city_name)
VALUES 
    ('78701', 'TX', 1, 1, 5.00, 5, NULL, 'Austin'),
    ('78702', 'TX', 1, 1, 5.00, 5, NULL, 'Austin'),
    ('75001', 'TX', 1, 1, 8.00, 5, NULL, 'Dallas'),
    ('77001', 'TX', 1, 1, 7.00, 5, NULL, 'Houston'),
    ('78201', 'TX', 1, 1, 6.00, 5, NULL, 'San Antonio');

-- ============================
-- 9. Orders
-- ============================
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    address_id INT NULL,
    customer_id INT NOT NULL,
    payment_id INT NULL,
    shipment_id INT NULL,
    delivery_mode ENUM('Standard Delivery', 'Store Pickup') NOT NULL,
    delivery_zip VARCHAR(10) NULL,
    status ENUM('pending', 'paid', 'shipped', 'delivered') DEFAULT 'pending',
    sub_total DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) DEFAULT 0,
    estimated_delivery_days INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_order_address FOREIGN KEY (address_id) REFERENCES Address(address_id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_order_shipment FOREIGN KEY (shipment_id) REFERENCES Shipment(shipment_id) ON UPDATE CASCADE ON DELETE SET NULL
);
CREATE INDEX idx_orders_customer_created ON Orders(customer_id, created_at);

DELIMITER //
CREATE TRIGGER trg_orders_address_check BEFORE INSERT ON Orders FOR EACH ROW 
BEGIN 
    IF NEW.delivery_mode = 'Standard Delivery' AND NEW.address_id IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Standard Delivery requires a valid address_id';
    END IF;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_compute_delivery_fee BEFORE INSERT ON Orders FOR EACH ROW 
BEGIN
    DECLARE v_base_fee DECIMAL(10, 2);
    DECLARE v_base_days INT;
    
    delivery_block: BEGIN 
        IF NEW.delivery_mode = 'Store Pickup' THEN
            SET NEW.delivery_fee = 0;
            LEAVE delivery_block;
        END IF;
        
        SELECT base_fee INTO v_base_fee
        FROM ZipDeliveryZone
        WHERE zip_code = NEW.delivery_zip;
        
        IF v_base_fee IS NULL THEN
            SET v_base_fee = 10.00;
        END IF;
        
        SET NEW.delivery_fee = v_base_fee;
    END delivery_block;
END//
DELIMITER ;

-- ============================
-- 10. Order_item
-- ============================
CREATE TABLE Order_item (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_orderitem_variant FOREIGN KEY (variant_id) REFERENCES ProductVariant(variant_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_orderitem_quantity CHECK (quantity > 0)
);
CREATE INDEX idx_orderitem_variant ON Order_item(variant_id);

-- ============================
-- 11. Inventory
-- ============================
CREATE TABLE Inventory (
    variant_id INT PRIMARY KEY,
    quantity INT NOT NULL,
    CONSTRAINT fk_inventory_variant FOREIGN KEY (variant_id) REFERENCES ProductVariant(variant_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT chk_inventory_quantity CHECK (quantity >= 0)
);
CREATE INDEX idx_inventory_variant ON Inventory(variant_id);

DELIMITER //
CREATE TRIGGER trg_variant_create_inventory AFTER INSERT ON ProductVariant FOR EACH ROW 
BEGIN
    INSERT INTO Inventory(variant_id, quantity)
    VALUES (NEW.variant_id, 0) 
    ON DUPLICATE KEY UPDATE variant_id = variant_id;
END//
DELIMITER ;

-- ============================
-- 12. Cart_item (CUSTOMER_ID APPROACH - NO CART TABLE)
-- ============================
CREATE TABLE Cart_item (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cartitem_customer FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_cartitem_variant FOREIGN KEY (variant_id) REFERENCES ProductVariant(variant_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_cartitem_quantity CHECK (quantity > 0),
    CONSTRAINT uc_customer_variant UNIQUE(customer_id, variant_id)
);
CREATE INDEX idx_cartitem_customer ON Cart_item(customer_id);

-- ============================
-- 13. Staff
-- ============================
CREATE TABLE Staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('Level01', 'Level02') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- 14. Inventory_updates
-- ============================
CREATE TABLE Inventory_updates (
    update_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    variant_id INT NOT NULL,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_quantity INT NOT NULL,
    added_quantity INT NOT NULL,
    note VARCHAR(255),
    CONSTRAINT fk_update_staff FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_update_variant FOREIGN KEY (variant_id) REFERENCES ProductVariant(variant_id) ON UPDATE CASCADE
);

DELIMITER //
CREATE TRIGGER trg_inventory_update_before_insert BEFORE INSERT ON Inventory_updates FOR EACH ROW 
BEGIN
    DECLARE current_qty INT;
    SELECT quantity INTO current_qty
    FROM Inventory
    WHERE variant_id = NEW.variant_id FOR UPDATE;
    
    IF current_qty IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Variant not found in Inventory';
    END IF;
    
    SET NEW.old_quantity = current_qty;
    
    IF (current_qty + NEW.added_quantity) < 0 THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Inventory cannot be negative';
    END IF;
    
    UPDATE Inventory
    SET quantity = quantity + NEW.added_quantity
    WHERE variant_id = NEW.variant_id;
END//
DELIMITER ;

-- ============================
-- 15. Payment
-- ============================
CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NULL,
    method ENUM('Cash on Delivery', 'Card Payment') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(255) NULL,
    status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON UPDATE CASCADE ON DELETE SET NULL
);
CREATE INDEX idx_payment_status ON Payment(status);

DELIMITER //
CREATE TRIGGER trg_payment_after_insert AFTER INSERT ON Payment FOR EACH ROW 
BEGIN 
    IF NEW.order_id IS NOT NULL THEN
        UPDATE Orders
        SET payment_id = NEW.payment_id
        WHERE order_id = NEW.order_id;
    END IF;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_order_paid_update_payment AFTER UPDATE ON Orders FOR EACH ROW 
BEGIN 
    IF NEW.status = 'paid' AND NEW.payment_id IS NOT NULL THEN
        UPDATE Payment
        SET status = 'completed',
            date_time = IF(date_time IS NULL, NOW(), date_time)
        WHERE payment_id = NEW.payment_id;
    END IF;
END//
DELIMITER ;

-- ============================
-- 16. Reporting Procedures & Views
-- ============================
DELIMITER //
CREATE PROCEDURE GetTopSellingProducts(
    IN start_date DATE,
    IN end_date DATE,
    IN top_n INT
) 
BEGIN
    SELECT p.product_id,
        p.name AS product_name,
        SUM(oi.quantity) AS total_quantity_sold,
        SUM(oi.quantity * oi.unit_price) AS total_sales
    FROM Order_item oi
        JOIN ProductVariant pv ON oi.variant_id = pv.variant_id
        JOIN Product p ON pv.product_id = p.product_id
        JOIN Orders o ON oi.order_id = o.order_id
    WHERE o.created_at BETWEEN start_date AND end_date
    GROUP BY p.product_id, p.name
    ORDER BY total_quantity_sold DESC
    LIMIT top_n;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetQuarterlySalesByYear(IN p_year INT) 
BEGIN
    SELECT QUARTER(o.created_at) AS quarter,
        SUM(oi.quantity * oi.unit_price) AS total_sales,
        COUNT(DISTINCT o.order_id) AS total_orders
    FROM Orders o
        JOIN Order_item oi ON o.order_id = oi.order_id
    WHERE YEAR(o.created_at) = p_year
    GROUP BY QUARTER(o.created_at)
    ORDER BY quarter;
END//
DELIMITER ;

CREATE OR REPLACE VIEW Staff_CategoryOrders AS
SELECT c.category_id,
    c.name AS category_name,
    COUNT(DISTINCT oi.order_id) AS total_orders
FROM Order_item oi
    JOIN ProductVariant pv ON oi.variant_id = pv.variant_id
    JOIN ProductCategory pc ON pv.product_id = pc.product_id
    JOIN Category c ON pc.category_id = c.category_id
GROUP BY c.category_id, c.name;

CREATE OR REPLACE VIEW Staff_CustomerOrderSummary AS
SELECT c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(o.total) AS total_spent,
    GROUP_CONCAT(
        DISTINCT CONCAT('Order ', o.order_id, ': ', IFNULL(p.status, 'no-payment')) 
        SEPARATOR '; '
    ) AS payment_statuses
FROM Customer c
    LEFT JOIN Orders o ON c.customer_id = o.customer_id
    LEFT JOIN Payment p ON o.payment_id = p.payment_id
GROUP BY c.customer_id, c.first_name, c.last_name;
    
CREATE OR REPLACE VIEW Staff_OrderDeliveryEstimate AS
SELECT o.order_id,
    o.customer_id,
    a.city,
    a.zip_code,
    o.estimated_delivery_days,
    o.created_at AS order_date
FROM Orders o
    LEFT JOIN Address a ON o.address_id = a.address_id;

CREATE OR REPLACE VIEW Staff_QuarterlySales AS
SELECT YEAR(o.created_at) AS year,
    QUARTER(o.created_at) AS quarter,
    SUM(oi.quantity * oi.unit_price) AS total_sales,
    COUNT(DISTINCT o.order_id) AS total_orders
FROM Orders o
    JOIN Order_item oi ON o.order_id = oi.order_id
GROUP BY YEAR(o.created_at), QUARTER(o.created_at);

-- ============================
-- Additional Indexes
-- ============================
CREATE INDEX idx_productcategory_category ON ProductCategory(category_id);

-- ============================
-- Summary
-- ============================
SELECT 'BrightBuy Database Schema (Customer ID Approach) created successfully!' AS Status;
SELECT 'Next: Run recreate_users_table.sql, then cart_procedures_customer.sql' AS Next_Step;
