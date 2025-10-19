USE brightbuy;

-- ============================
-- 1. Sales Report View
-- ============================
DROP VIEW IF EXISTS vw_sales_report;
CREATE VIEW vw_sales_report AS
SELECT 
    o.order_id,
    o.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) as customer_name,
    o.created_at as order_date,
    o.total as order_total,
    o.delivery_fee,
    COUNT(oi.order_item_id) as total_items,
    o.status as order_status,
    YEAR(o.created_at) as year,
    MONTH(o.created_at) as month,
    WEEK(o.created_at) as week
FROM Orders o
LEFT JOIN Order_item oi ON o.order_id = oi.order_id
LEFT JOIN Customer c ON o.customer_id = c.customer_id
GROUP BY o.order_id, o.customer_id, c.first_name, c.last_name, o.created_at, o.total, o.status;

-- ============================
-- 2. Inventory Report View
-- ============================
DROP VIEW IF EXISTS vw_inventory_report;
CREATE VIEW vw_inventory_report AS
SELECT 
    pv.variant_id,
    p.product_id,
    p.name as product_name,
    p.brand,
    pv.sku,
    pv.color,
    pv.size,
    pv.price,
    i.quantity as current_stock,
    CASE 
        WHEN i.quantity = 0 THEN 'Out of Stock'
        WHEN i.quantity < 5 THEN 'Critical'
        WHEN i.quantity < 20 THEN 'Low'
        ELSE 'In Stock'
    END as stock_status,
    (pv.price * i.quantity) as total_value
FROM ProductVariant pv
LEFT JOIN Product p ON pv.product_id = p.product_id
LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
WHERE pv.is_default = 1;

-- ============================
-- 3. Product Performance View
-- ============================
DROP VIEW IF EXISTS vw_product_performance;
CREATE VIEW vw_product_performance AS
SELECT 
    p.product_id,
    p.name as product_name,
    p.brand,
    COUNT(DISTINCT oi.order_id) as total_orders,
    SUM(oi.quantity) as total_units_sold,
    SUM(oi.quantity * oi.unit_price) as total_revenue,
    AVG(oi.unit_price) as avg_unit_price,
    MIN(o.created_at) as first_sale_date,
    MAX(o.created_at) as last_sale_date
FROM Product p
LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id
LEFT JOIN Order_item oi ON pv.variant_id = oi.variant_id
LEFT JOIN Orders o ON oi.order_id = o.order_id
GROUP BY p.product_id, p.name, p.brand;

-- ============================
-- 4. Customer Analysis View
-- ============================
DROP VIEW IF EXISTS vw_customer_analysis;
CREATE VIEW vw_customer_analysis AS
SELECT 
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) as customer_name,
    c.email,
    c.phone,
    c.created_at as registration_date,
    COUNT(DISTINCT o.order_id) as total_orders,
    COALESCE(SUM(o.total), 0) as total_spent,
    AVG(o.total) as avg_order_value,
    MAX(o.created_at) as last_order_date,
    DATEDIFF(NOW(), MAX(o.created_at)) as days_since_last_order
FROM Customer c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name, c.email, c.phone, c.created_at;

-- ============================
-- 5. Daily Sales Report Procedure
-- ============================
DROP PROCEDURE IF EXISTS GetDailySalesReport;
DELIMITER //
CREATE PROCEDURE GetDailySalesReport(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        DATE(o.created_at) as sale_date,
        COUNT(DISTINCT o.order_id) as total_orders,
        COUNT(DISTINCT o.customer_id) as unique_customers,
        SUM(o.total) as total_revenue,
        SUM(o.delivery_fee) as total_delivery_fees,
        AVG(o.total) as avg_order_value,
        COUNT(CASE WHEN o.status = 'paid' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pending_orders
    FROM Orders o
    WHERE DATE(o.created_at) BETWEEN p_start_date AND p_end_date
    GROUP BY DATE(o.created_at)
    ORDER BY sale_date DESC;
END//
DELIMITER ;

-- ============================
-- 6. Monthly Sales Report Procedure
-- ============================
DROP PROCEDURE IF EXISTS GetMonthlySalesReport;
DELIMITER //
CREATE PROCEDURE GetMonthlySalesReport(IN p_year INT)
BEGIN
    SELECT 
        MONTH(o.created_at) as month,
        MONTHNAME(o.created_at) as month_name,
        COUNT(DISTINCT o.order_id) as total_orders,
        COUNT(DISTINCT o.customer_id) as unique_customers,
        SUM(o.total) as total_revenue,
        SUM(o.delivery_fee) as total_delivery_fees,
        AVG(o.total) as avg_order_value
    FROM Orders o
    WHERE YEAR(o.created_at) = p_year
    GROUP BY MONTH(o.created_at), MONTHNAME(o.created_at)
    ORDER BY MONTH(o.created_at);
END//
DELIMITER ;

-- ============================
-- 7. Top Products Procedure
-- ============================
DROP PROCEDURE IF EXISTS GetTopProducts;
DELIMITER //
CREATE PROCEDURE GetTopProducts(
    IN p_limit INT,
    IN p_days INT
)
BEGIN
    SELECT 
        p.product_id,
        p.name as product_name,
        p.brand,
        SUM(oi.quantity) as units_sold,
        SUM(oi.quantity * oi.unit_price) as revenue,
        COUNT(DISTINCT oi.order_id) as order_count,
        AVG(oi.unit_price) as avg_price
    FROM Product p
    INNER JOIN ProductVariant pv ON p.product_id = pv.product_id
    INNER JOIN Order_item oi ON pv.variant_id = oi.variant_id
    INNER JOIN Orders o ON oi.order_id = o.order_id
    WHERE DATE(o.created_at) >= DATE_SUB(NOW(), INTERVAL p_days DAY)
    GROUP BY p.product_id, p.name, p.brand
    ORDER BY revenue DESC
    LIMIT p_limit;
END//
DELIMITER ;

-- ============================
-- 8. Low Stock Alert Procedure
-- ============================
DROP PROCEDURE IF EXISTS GetLowStockItems;
DELIMITER //
CREATE PROCEDURE GetLowStockItems(IN p_threshold INT)
BEGIN
    SELECT 
        pv.variant_id,
        p.product_id,
        p.name as product_name,
        p.brand,
        pv.sku,
        pv.color,
        i.quantity as current_stock,
        pv.price,
        (pv.price * i.quantity) as total_value
    FROM ProductVariant pv
    INNER JOIN Product p ON pv.product_id = p.product_id
    INNER JOIN Inventory i ON pv.variant_id = i.variant_id
    WHERE i.quantity <= p_threshold
    ORDER BY i.quantity ASC;
END//
DELIMITER ;

-- ============================
-- 9. Category Performance Procedure
-- ============================
DROP PROCEDURE IF EXISTS GetCategoryPerformance;
DELIMITER //
CREATE PROCEDURE GetCategoryPerformance()
BEGIN
    SELECT 
        c.category_id,
        c.name as category_name,
        COUNT(DISTINCT p.product_id) as total_products,
        SUM(oi.quantity) as units_sold,
        SUM(oi.quantity * oi.unit_price) as total_revenue,
        AVG(oi.unit_price) as avg_price
    FROM Category c
    LEFT JOIN ProductCategory pc ON c.category_id = pc.category_id
    LEFT JOIN Product p ON pc.product_id = p.product_id
    LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id
    LEFT JOIN Order_item oi ON pv.variant_id = oi.variant_id
    WHERE c.parent_id IS NULL
    GROUP BY c.category_id, c.name
    ORDER BY total_revenue DESC;
END//
DELIMITER ;

SELECT 'Reports setup completed!' as status;
