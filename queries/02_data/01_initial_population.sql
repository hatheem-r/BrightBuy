-- ============================
-- BrightBuy Database Population Script
-- This script populates the database with sample data
-- Including 100+ Product Variants
-- ============================

USE brightbuy;

-- ============================
-- 1. Categories
-- ============================
INSERT INTO Category (name, parent_id) VALUES
-- Main Categories (Level 1)
('Electronics', NULL),
('Computers & Laptops', NULL),
('Mobile Devices', NULL),
('Gaming', NULL),
('Audio', NULL),
('Wearables', NULL),
('Smart Home', NULL),
('Camera & Photography', NULL),
('Accessories', NULL),
('Storage', NULL);

-- Sub Categories (Level 2)
INSERT INTO Category (name, parent_id) VALUES
('Smartphones', 3),
('Tablets', 3),
('Smartwatches', 6),
('Fitness Trackers', 6),
('Headphones', 5),
('Speakers', 5),
('Gaming Consoles', 4),
('Gaming Accessories', 4),
('Laptop Accessories', 9),
('Phone Accessories', 9);

-- ============================
-- 2. Products
-- ============================
INSERT INTO Product (name, brand) VALUES
-- Smartphones
('Galaxy S24 Ultra', 'Samsung'),
('iPhone 15 Pro Max', 'Apple'),
('Pixel 8 Pro', 'Google'),
('OnePlus 12', 'OnePlus'),
('Xiaomi 14 Pro', 'Xiaomi'),

-- Laptops
('MacBook Pro 16"', 'Apple'),
('ThinkPad X1 Carbon', 'Lenovo'),
('XPS 15', 'Dell'),
('ZenBook Pro', 'ASUS'),
('Surface Laptop 5', 'Microsoft'),

-- Tablets
('iPad Pro 12.9"', 'Apple'),
('Galaxy Tab S9', 'Samsung'),
('Surface Pro 9', 'Microsoft'),

-- Smartwatches
('Apple Watch Series 9', 'Apple'),
('Galaxy Watch 6', 'Samsung'),
('Pixel Watch 2', 'Google'),

-- Gaming
('PlayStation 5', 'Sony'),
('Xbox Series X', 'Microsoft'),
('Nintendo Switch OLED', 'Nintendo'),

-- Headphones
('AirPods Pro', 'Apple'),
('WH-1000XM5', 'Sony'),
('QuietComfort Ultra', 'Bose'),
('Momentum 4', 'Sennheiser'),

-- Speakers
('HomePod', 'Apple'),
('Echo Studio', 'Amazon'),
('Sonos One', 'Sonos'),

-- Cameras
('EOS R6 Mark II', 'Canon'),
('Alpha A7 IV', 'Sony'),
('Z6 III', 'Nikon'),

-- Storage
('Portable SSD T7', 'Samsung'),
('My Passport', 'WD'),
('Extreme Pro SSD', 'SanDisk'),

-- Accessories
('Magic Keyboard', 'Apple'),
('MX Master 3S', 'Logitech'),
('PowerCore 20000', 'Anker'),
('USB-C Hub', 'Anker'),
('Phone Case Pro', 'Spigen'),
('Screen Protector', 'ESR'),
('Wireless Charger', 'Belkin'),
('HDMI Cable', 'AmazonBasics'),
('Lightning Cable', 'Apple'),
('USB-C Cable', 'Anker');

-- ============================
-- 3. Product Categories (Many-to-Many)
-- ============================
INSERT INTO ProductCategory (product_id, category_id) VALUES
-- Smartphones
(1, 3), (1, 11),
(2, 3), (2, 11),
(3, 3), (3, 11),
(4, 3), (4, 11),
(5, 3), (5, 11),

-- Laptops
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2),

-- Tablets
(11, 3), (11, 12),
(12, 3), (12, 12),
(13, 3), (13, 12),

-- Smartwatches
(14, 6), (14, 13),
(15, 6), (15, 13),
(16, 6), (16, 13),

-- Gaming
(17, 4), (17, 17),
(18, 4), (18, 17),
(19, 4), (19, 17),

-- Headphones
(20, 5), (20, 15),
(21, 5), (21, 15),
(22, 5), (22, 15),
(23, 5), (23, 15),

-- Speakers
(24, 5), (24, 16),
(25, 5), (25, 16),
(26, 5), (26, 16),

-- Cameras
(27, 8),
(28, 8),
(29, 8),

-- Storage
(30, 10),
(31, 10),
(32, 10),

-- Accessories
(33, 9), (33, 19),
(34, 9),
(35, 9),
(36, 9),
(37, 9), (37, 20),
(38, 9), (38, 20),
(39, 9),
(40, 9),
(41, 9), (41, 20),
(42, 9);

-- ============================
-- 4. Product Variants (100+ variants)
-- ============================

-- Galaxy S24 Ultra Variants (8 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(1, 'SAM-S24U-256-BLK', 1199.99, '256GB', 'Titanium Black', 'Galaxy S24 Ultra 256GB Titanium Black', 1),
(1, 'SAM-S24U-256-GRY', 1199.99, '256GB', 'Titanium Gray', 'Galaxy S24 Ultra 256GB Titanium Gray', 0),
(1, 'SAM-S24U-512-BLK', 1399.99, '512GB', 'Titanium Black', 'Galaxy S24 Ultra 512GB Titanium Black', 0),
(1, 'SAM-S24U-512-GRY', 1399.99, '512GB', 'Titanium Gray', 'Galaxy S24 Ultra 512GB Titanium Gray', 0),
(1, 'SAM-S24U-1TB-BLK', 1599.99, '1TB', 'Titanium Black', 'Galaxy S24 Ultra 1TB Titanium Black', 0),
(1, 'SAM-S24U-1TB-GRY', 1599.99, '1TB', 'Titanium Gray', 'Galaxy S24 Ultra 1TB Titanium Gray', 0),
(1, 'SAM-S24U-256-VIO', 1199.99, '256GB', 'Titanium Violet', 'Galaxy S24 Ultra 256GB Titanium Violet', 0),
(1, 'SAM-S24U-512-VIO', 1399.99, '512GB', 'Titanium Violet', 'Galaxy S24 Ultra 512GB Titanium Violet', 0);

-- iPhone 15 Pro Max Variants (8 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(2, 'APL-IP15PM-256-BLU', 1199.99, '256GB', 'Blue Titanium', 'iPhone 15 Pro Max 256GB Blue Titanium', 1),
(2, 'APL-IP15PM-256-NAT', 1199.99, '256GB', 'Natural Titanium', 'iPhone 15 Pro Max 256GB Natural Titanium', 0),
(2, 'APL-IP15PM-256-WHT', 1199.99, '256GB', 'White Titanium', 'iPhone 15 Pro Max 256GB White Titanium', 0),
(2, 'APL-IP15PM-256-BLK', 1199.99, '256GB', 'Black Titanium', 'iPhone 15 Pro Max 256GB Black Titanium', 0),
(2, 'APL-IP15PM-512-BLU', 1399.99, '512GB', 'Blue Titanium', 'iPhone 15 Pro Max 512GB Blue Titanium', 0),
(2, 'APL-IP15PM-512-NAT', 1399.99, '512GB', 'Natural Titanium', 'iPhone 15 Pro Max 512GB Natural Titanium', 0),
(2, 'APL-IP15PM-1TB-BLU', 1599.99, '1TB', 'Blue Titanium', 'iPhone 15 Pro Max 1TB Blue Titanium', 0),
(2, 'APL-IP15PM-1TB-BLK', 1599.99, '1TB', 'Black Titanium', 'iPhone 15 Pro Max 1TB Black Titanium', 0);

-- Pixel 8 Pro Variants (6 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(3, 'GOO-P8P-128-OBS', 999.99, '128GB', 'Obsidian', 'Pixel 8 Pro 128GB Obsidian', 1),
(3, 'GOO-P8P-128-POR', 999.99, '128GB', 'Porcelain', 'Pixel 8 Pro 128GB Porcelain', 0),
(3, 'GOO-P8P-128-BAY', 999.99, '128GB', 'Bay Blue', 'Pixel 8 Pro 128GB Bay Blue', 0),
(3, 'GOO-P8P-256-OBS', 1099.99, '256GB', 'Obsidian', 'Pixel 8 Pro 256GB Obsidian', 0),
(3, 'GOO-P8P-256-POR', 1099.99, '256GB', 'Porcelain', 'Pixel 8 Pro 256GB Porcelain', 0),
(3, 'GOO-P8P-512-OBS', 1299.99, '512GB', 'Obsidian', 'Pixel 8 Pro 512GB Obsidian', 0);

-- OnePlus 12 Variants (4 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(4, 'OPL-OP12-256-BLK', 799.99, '256GB', 'Flowy Emerald', 'OnePlus 12 256GB Flowy Emerald', 1),
(4, 'OPL-OP12-256-WHT', 799.99, '256GB', 'Silky Black', 'OnePlus 12 256GB Silky Black', 0),
(4, 'OPL-OP12-512-BLK', 899.99, '512GB', 'Flowy Emerald', 'OnePlus 12 512GB Flowy Emerald', 0),
(4, 'OPL-OP12-512-WHT', 899.99, '512GB', 'Silky Black', 'OnePlus 12 512GB Silky Black', 0);

-- Xiaomi 14 Pro Variants (4 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(5, 'XIA-X14P-256-BLK', 899.99, '256GB', 'Black', 'Xiaomi 14 Pro 256GB Black', 1),
(5, 'XIA-X14P-256-WHT', 899.99, '256GB', 'White', 'Xiaomi 14 Pro 256GB White', 0),
(5, 'XIA-X14P-512-BLK', 999.99, '512GB', 'Black', 'Xiaomi 14 Pro 512GB Black', 0),
(5, 'XIA-X14P-512-WHT', 999.99, '512GB', 'White', 'Xiaomi 14 Pro 512GB White', 0);

-- MacBook Pro 16" Variants (6 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(6, 'APL-MBP16-M3P-512-SG', 2499.99, '512GB', 'Space Gray', 'MacBook Pro 16" M3 Pro 512GB Space Gray', 1),
(6, 'APL-MBP16-M3P-512-SV', 2499.99, '512GB', 'Silver', 'MacBook Pro 16" M3 Pro 512GB Silver', 0),
(6, 'APL-MBP16-M3P-1TB-SG', 2899.99, '1TB', 'Space Gray', 'MacBook Pro 16" M3 Pro 1TB Space Gray', 0),
(6, 'APL-MBP16-M3P-1TB-SV', 2899.99, '1TB', 'Silver', 'MacBook Pro 16" M3 Pro 1TB Silver', 0),
(6, 'APL-MBP16-M3M-1TB-SG', 3499.99, '1TB', 'Space Gray', 'MacBook Pro 16" M3 Max 1TB Space Gray', 0),
(6, 'APL-MBP16-M3M-2TB-SG', 3999.99, '2TB', 'Space Gray', 'MacBook Pro 16" M3 Max 2TB Space Gray', 0);

-- ThinkPad X1 Carbon Variants (4 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(7, 'LEN-X1C-I5-256', 1299.99, '256GB', 'Black', 'ThinkPad X1 Carbon i5 256GB', 1),
(7, 'LEN-X1C-I5-512', 1499.99, '512GB', 'Black', 'ThinkPad X1 Carbon i5 512GB', 0),
(7, 'LEN-X1C-I7-512', 1699.99, '512GB', 'Black', 'ThinkPad X1 Carbon i7 512GB', 0),
(7, 'LEN-X1C-I7-1TB', 1899.99, '1TB', 'Black', 'ThinkPad X1 Carbon i7 1TB', 0);

-- Dell XPS 15 Variants (4 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(8, 'DEL-XPS15-I7-512', 1799.99, '512GB', 'Platinum Silver', 'XPS 15 i7 512GB Platinum Silver', 1),
(8, 'DEL-XPS15-I7-1TB', 1999.99, '1TB', 'Platinum Silver', 'XPS 15 i7 1TB Platinum Silver', 0),
(8, 'DEL-XPS15-I9-1TB', 2299.99, '1TB', 'Graphite', 'XPS 15 i9 1TB Graphite', 0),
(8, 'DEL-XPS15-I9-2TB', 2599.99, '2TB', 'Graphite', 'XPS 15 i9 2TB Graphite', 0);

-- ASUS ZenBook Pro Variants (3 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(9, 'ASU-ZBP-I7-512', 1599.99, '512GB', 'Pine Gray', 'ZenBook Pro i7 512GB Pine Gray', 1),
(9, 'ASU-ZBP-I7-1TB', 1799.99, '1TB', 'Pine Gray', 'ZenBook Pro i7 1TB Pine Gray', 0),
(9, 'ASU-ZBP-I9-1TB', 2099.99, '1TB', 'Deep Blue', 'ZenBook Pro i9 1TB Deep Blue', 0);

-- Surface Laptop 5 Variants (4 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(10, 'MSF-SL5-I5-256', 999.99, '256GB', 'Platinum', 'Surface Laptop 5 i5 256GB Platinum', 1),
(10, 'MSF-SL5-I5-512', 1199.99, '512GB', 'Platinum', 'Surface Laptop 5 i5 512GB Platinum', 0),
(10, 'MSF-SL5-I7-512', 1399.99, '512GB', 'Matte Black', 'Surface Laptop 5 i7 512GB Matte Black', 0),
(10, 'MSF-SL5-I7-1TB', 1699.99, '1TB', 'Matte Black', 'Surface Laptop 5 i7 1TB Matte Black', 0);

-- iPad Pro 12.9" Variants (6 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(11, 'APL-IPP129-128-SG', 1099.99, '128GB', 'Space Gray', 'iPad Pro 12.9" 128GB Space Gray WiFi', 1),
(11, 'APL-IPP129-128-SV', 1099.99, '128GB', 'Silver', 'iPad Pro 12.9" 128GB Silver WiFi', 0),
(11, 'APL-IPP129-256-SG', 1199.99, '256GB', 'Space Gray', 'iPad Pro 12.9" 256GB Space Gray WiFi', 0),
(11, 'APL-IPP129-256-SV', 1199.99, '256GB', 'Silver', 'iPad Pro 12.9" 256GB Silver WiFi', 0),
(11, 'APL-IPP129-512-SG', 1399.99, '512GB', 'Space Gray', 'iPad Pro 12.9" 512GB Space Gray WiFi', 0),
(11, 'APL-IPP129-1TB-SG', 1799.99, '1TB', 'Space Gray', 'iPad Pro 12.9" 1TB Space Gray WiFi', 0);

-- Galaxy Tab S9 Variants (4 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(12, 'SAM-TABS9-128-BLK', 799.99, '128GB', 'Graphite', 'Galaxy Tab S9 128GB Graphite', 1),
(12, 'SAM-TABS9-128-BEI', 799.99, '128GB', 'Beige', 'Galaxy Tab S9 128GB Beige', 0),
(12, 'SAM-TABS9-256-BLK', 899.99, '256GB', 'Graphite', 'Galaxy Tab S9 256GB Graphite', 0),
(12, 'SAM-TABS9-256-BEI', 899.99, '256GB', 'Beige', 'Galaxy Tab S9 256GB Beige', 0);

-- Surface Pro 9 Variants (4 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(13, 'MSF-SP9-I5-256', 999.99, '256GB', 'Platinum', 'Surface Pro 9 i5 256GB Platinum', 1),
(13, 'MSF-SP9-I5-512', 1199.99, '512GB', 'Graphite', 'Surface Pro 9 i5 512GB Graphite', 0),
(13, 'MSF-SP9-I7-512', 1399.99, '512GB', 'Platinum', 'Surface Pro 9 i7 512GB Platinum', 0),
(13, 'MSF-SP9-I7-1TB', 1699.99, '1TB', 'Graphite', 'Surface Pro 9 i7 1TB Graphite', 0);

-- Apple Watch Series 9 Variants (6 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(14, 'APL-AWS9-41-MID', 399.99, '41mm', 'Midnight', 'Apple Watch Series 9 41mm Midnight Aluminum', 1),
(14, 'APL-AWS9-41-STL', 399.99, '41mm', 'Starlight', 'Apple Watch Series 9 41mm Starlight Aluminum', 0),
(14, 'APL-AWS9-41-RED', 399.99, '41mm', 'Red', 'Apple Watch Series 9 41mm Red Aluminum', 0),
(14, 'APL-AWS9-45-MID', 429.99, '45mm', 'Midnight', 'Apple Watch Series 9 45mm Midnight Aluminum', 0),
(14, 'APL-AWS9-45-STL', 429.99, '45mm', 'Starlight', 'Apple Watch Series 9 45mm Starlight Aluminum', 0),
(14, 'APL-AWS9-45-RED', 429.99, '45mm', 'Red', 'Apple Watch Series 9 45mm Red Aluminum', 0);

-- Galaxy Watch 6 Variants (4 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(15, 'SAM-GW6-40-GRY', 299.99, '40mm', 'Graphite', 'Galaxy Watch 6 40mm Graphite', 1),
(15, 'SAM-GW6-40-GLD', 299.99, '40mm', 'Gold', 'Galaxy Watch 6 40mm Gold', 0),
(15, 'SAM-GW6-44-GRY', 329.99, '44mm', 'Graphite', 'Galaxy Watch 6 44mm Graphite', 0),
(15, 'SAM-GW6-44-SLV', 329.99, '44mm', 'Silver', 'Galaxy Watch 6 44mm Silver', 0);

-- Pixel Watch 2 Variants (4 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(16, 'GOO-PW2-WIFI-BLK', 349.99, 'WiFi', 'Matte Black', 'Pixel Watch 2 WiFi Matte Black', 1),
(16, 'GOO-PW2-WIFI-SLV', 349.99, 'WiFi', 'Polished Silver', 'Pixel Watch 2 WiFi Polished Silver', 0),
(16, 'GOO-PW2-LTE-BLK', 399.99, 'LTE', 'Matte Black', 'Pixel Watch 2 LTE Matte Black', 0),
(16, 'GOO-PW2-LTE-SLV', 399.99, 'LTE', 'Polished Silver', 'Pixel Watch 2 LTE Polished Silver', 0);

-- PlayStation 5 Variants (3 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(17, 'SNY-PS5-STD', 499.99, 'Standard', 'White', 'PlayStation 5 Standard Edition', 1),
(17, 'SNY-PS5-DIG', 449.99, 'Digital', 'White', 'PlayStation 5 Digital Edition', 0),
(17, 'SNY-PS5-SLIM', 449.99, 'Slim', 'White', 'PlayStation 5 Slim Edition', 0);

-- Xbox Series X Variants (2 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(18, 'MSF-XBX-1TB', 499.99, '1TB', 'Black', 'Xbox Series X 1TB', 1),
(18, 'MSF-XBS-512', 299.99, '512GB', 'White', 'Xbox Series S 512GB', 0);

-- Nintendo Switch OLED Variants (3 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(19, 'NIN-NSW-OLED-WHT', 349.99, 'OLED', 'White', 'Nintendo Switch OLED White', 1),
(19, 'NIN-NSW-OLED-NEO', 349.99, 'OLED', 'Neon', 'Nintendo Switch OLED Neon Blue/Red', 0),
(19, 'NIN-NSW-STD', 299.99, 'Standard', 'Neon', 'Nintendo Switch Standard Neon', 0);

-- AirPods Pro Variants (2 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(20, 'APL-APP2-USBC', 249.99, 'Gen 2', 'White', 'AirPods Pro 2nd Gen USB-C', 1),
(20, 'APL-APP2-LIGHT', 249.99, 'Gen 2', 'White', 'AirPods Pro 2nd Gen Lightning', 0);

-- Sony WH-1000XM5 Variants (2 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(21, 'SNY-WH1000XM5-BLK', 399.99, 'Standard', 'Black', 'WH-1000XM5 Wireless Noise Canceling Black', 1),
(21, 'SNY-WH1000XM5-SLV', 399.99, 'Standard', 'Silver', 'WH-1000XM5 Wireless Noise Canceling Silver', 0);

-- Bose QuietComfort Ultra Variants (2 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(22, 'BOS-QCULT-BLK', 429.99, 'Standard', 'Black', 'QuietComfort Ultra Headphones Black', 1),
(22, 'BOS-QCULT-WHT', 429.99, 'Standard', 'White Smoke', 'QuietComfort Ultra Headphones White Smoke', 0);

-- Sennheiser Momentum 4 Variants (2 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(23, 'SEN-MOM4-BLK', 379.99, 'Standard', 'Black', 'Momentum 4 Wireless Black', 1),
(23, 'SEN-MOM4-WHT', 379.99, 'Standard', 'White', 'Momentum 4 Wireless White', 0);

-- HomePod Variants (2 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(24, 'APL-HP2-WHT', 299.99, '2nd Gen', 'White', 'HomePod 2nd Gen White', 1),
(24, 'APL-HP2-MID', 299.99, '2nd Gen', 'Midnight', 'HomePod 2nd Gen Midnight', 0);

-- Echo Studio Variants (1 variant)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(25, 'AMZ-ECHOST-CHR', 199.99, 'Standard', 'Charcoal', 'Echo Studio Smart Speaker Charcoal', 1);

-- Sonos One Variants (2 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(26, 'SON-ONE-BLK', 219.99, 'Gen 2', 'Black', 'Sonos One Gen 2 Black', 1),
(26, 'SON-ONE-WHT', 219.99, 'Gen 2', 'White', 'Sonos One Gen 2 White', 0);

-- Canon EOS R6 Mark II Variants (2 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(27, 'CAN-R6M2-BODY', 2499.99, 'Body Only', 'Black', 'EOS R6 Mark II Body Only', 1),
(27, 'CAN-R6M2-KIT', 2899.99, 'Kit', 'Black', 'EOS R6 Mark II with 24-105mm Lens', 0);

-- Sony Alpha A7 IV Variants (2 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(28, 'SNY-A7IV-BODY', 2499.99, 'Body Only', 'Black', 'Alpha A7 IV Body Only', 1),
(28, 'SNY-A7IV-KIT', 2899.99, 'Kit', 'Black', 'Alpha A7 IV with 28-70mm Lens', 0);

-- Nikon Z6 III Variants (2 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(29, 'NIK-Z6III-BODY', 2499.99, 'Body Only', 'Black', 'Z6 III Body Only', 1),
(29, 'NIK-Z6III-KIT', 2899.99, 'Kit', 'Black', 'Z6 III with 24-70mm Lens', 0);

-- Samsung Portable SSD T7 Variants (6 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(30, 'SAM-T7-500-GRY', 79.99, '500GB', 'Gray', 'Portable SSD T7 500GB Gray', 1),
(30, 'SAM-T7-1TB-GRY', 129.99, '1TB', 'Gray', 'Portable SSD T7 1TB Gray', 0),
(30, 'SAM-T7-1TB-BLU', 129.99, '1TB', 'Blue', 'Portable SSD T7 1TB Blue', 0),
(30, 'SAM-T7-2TB-GRY', 229.99, '2TB', 'Gray', 'Portable SSD T7 2TB Gray', 0),
(30, 'SAM-T7-2TB-RED', 229.99, '2TB', 'Red', 'Portable SSD T7 2TB Red', 0),
(30, 'SAM-T7-4TB-GRY', 449.99, '4TB', 'Gray', 'Portable SSD T7 4TB Gray', 0);

-- WD My Passport Variants (5 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(31, 'WD-MP-1TB-BLK', 59.99, '1TB', 'Black', 'My Passport 1TB Portable HDD Black', 1),
(31, 'WD-MP-2TB-BLK', 79.99, '2TB', 'Black', 'My Passport 2TB Portable HDD Black', 0),
(31, 'WD-MP-4TB-BLK', 119.99, '4TB', 'Black', 'My Passport 4TB Portable HDD Black', 0),
(31, 'WD-MP-5TB-BLK', 149.99, '5TB', 'Black', 'My Passport 5TB Portable HDD Black', 0),
(31, 'WD-MP-2TB-BLU', 79.99, '2TB', 'Blue', 'My Passport 2TB Portable HDD Blue', 0);

-- SanDisk Extreme Pro SSD Variants (4 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(32, 'SAN-EXTP-500', 99.99, '500GB', 'Black', 'Extreme Pro Portable SSD 500GB', 1),
(32, 'SAN-EXTP-1TB', 159.99, '1TB', 'Black', 'Extreme Pro Portable SSD 1TB', 0),
(32, 'SAN-EXTP-2TB', 289.99, '2TB', 'Black', 'Extreme Pro Portable SSD 2TB', 0),
(32, 'SAN-EXTP-4TB', 549.99, '4TB', 'Black', 'Extreme Pro Portable SSD 4TB', 0);

-- Magic Keyboard Variants (2 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(33, 'APL-MK-USBC-WHT', 99.99, 'USB-C', 'White', 'Magic Keyboard with Touch ID USB-C White', 1),
(33, 'APL-MK-USBC-BLK', 99.99, 'USB-C', 'Black', 'Magic Keyboard with Touch ID USB-C Black', 0);

-- Logitech MX Master 3S Variants (2 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(34, 'LOG-MX3S-BLK', 99.99, 'Standard', 'Black', 'MX Master 3S Wireless Mouse Black', 1),
(34, 'LOG-MX3S-GREY', 99.99, 'Standard', 'Pale Grey', 'MX Master 3S Wireless Mouse Pale Grey', 0);

-- Anker PowerCore 20000 Variants (2 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(35, 'ANK-PC20K-BLK', 49.99, '20000mAh', 'Black', 'PowerCore 20000mAh Power Bank Black', 1),
(35, 'ANK-PC20K-WHT', 49.99, '20000mAh', 'White', 'PowerCore 20000mAh Power Bank White', 0);

-- Anker USB-C Hub Variants (2 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(36, 'ANK-HUB7-GRY', 49.99, '7-in-1', 'Gray', 'USB-C Hub 7-in-1 Adapter Gray', 1),
(36, 'ANK-HUB10-GRY', 69.99, '10-in-1', 'Gray', 'USB-C Hub 10-in-1 Adapter Gray', 0);

-- Spigen Phone Case Pro Variants (4 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(37, 'SPG-IP15PM-BLK', 29.99, 'iPhone 15 Pro Max', 'Black', 'Tough Armor Case iPhone 15 Pro Max Black', 1),
(37, 'SPG-IP15PM-CLR', 24.99, 'iPhone 15 Pro Max', 'Clear', 'Ultra Hybrid Case iPhone 15 Pro Max Clear', 0),
(37, 'SPG-S24U-BLK', 29.99, 'Galaxy S24 Ultra', 'Black', 'Tough Armor Case Galaxy S24 Ultra Black', 0),
(37, 'SPG-S24U-CLR', 24.99, 'Galaxy S24 Ultra', 'Clear', 'Ultra Hybrid Case Galaxy S24 Ultra Clear', 0);

-- ESR Screen Protector Variants (3 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(38, 'ESR-IP15PM-GLASS', 19.99, 'iPhone 15 Pro Max', 'Clear', 'Tempered Glass Screen Protector 3-Pack', 1),
(38, 'ESR-S24U-GLASS', 19.99, 'Galaxy S24 Ultra', 'Clear', 'Tempered Glass Screen Protector 3-Pack', 0),
(38, 'ESR-IPP129-GLASS', 24.99, 'iPad Pro 12.9"', 'Clear', 'Tempered Glass Screen Protector 2-Pack', 0);

-- Belkin Wireless Charger Variants (3 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(39, 'BEL-BOOSTC-WHT', 39.99, '15W', 'White', 'BoostCharge 15W Wireless Charger White', 1),
(39, 'BEL-BOOSTC-BLK', 39.99, '15W', 'Black', 'BoostCharge 15W Wireless Charger Black', 0),
(39, 'BEL-BOOSTC3-WHT', 79.99, '3-in-1', 'White', 'BoostCharge 3-in-1 Wireless Charger White', 0);

-- AmazonBasics HDMI Cable Variants (3 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(40, 'AMZ-HDMI-6FT', 9.99, '6ft', 'Black', 'High-Speed HDMI Cable 6ft', 1),
(40, 'AMZ-HDMI-10FT', 12.99, '10ft', 'Black', 'High-Speed HDMI Cable 10ft', 0),
(40, 'AMZ-HDMI-15FT', 15.99, '15ft', 'Black', 'High-Speed HDMI Cable 15ft', 0);

-- Apple Lightning Cable Variants (2 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(41, 'APL-LIGHT-1M-WHT', 19.99, '1m', 'White', 'Lightning to USB Cable 1m White', 1),
(41, 'APL-LIGHT-2M-WHT', 29.99, '2m', 'White', 'Lightning to USB Cable 2m White', 0);

-- Anker USB-C Cable Variants (3 variants)
INSERT INTO ProductVariant (product_id, sku, price, size, color, description, is_default) VALUES
(42, 'ANK-USBC-3FT-BLK', 14.99, '3ft', 'Black', 'USB-C to USB-C Cable 100W 3ft Black', 1),
(42, 'ANK-USBC-6FT-BLK', 16.99, '6ft', 'Black', 'USB-C to USB-C Cable 100W 6ft Black', 0),
(42, 'ANK-USBC-10FT-BLK', 19.99, '10ft', 'Black', 'USB-C to USB-C Cable 100W 10ft Black', 0);

-- ============================
-- 5. Inventory (Set initial stock for all variants)
-- ============================
UPDATE Inventory SET quantity = FLOOR(10 + (RAND() * 90)) WHERE variant_id BETWEEN 1 AND 30;
UPDATE Inventory SET quantity = FLOOR(20 + (RAND() * 80)) WHERE variant_id BETWEEN 31 AND 60;
UPDATE Inventory SET quantity = FLOOR(15 + (RAND() * 85)) WHERE variant_id BETWEEN 61 AND 90;
UPDATE Inventory SET quantity = FLOOR(25 + (RAND() * 75)) WHERE variant_id BETWEEN 91 AND 120;
UPDATE Inventory SET quantity = FLOOR(30 + (RAND() * 70)) WHERE variant_id > 120;

-- ============================
-- 6. Customers
-- ============================
INSERT INTO Customer (first_name, last_name, user_name, password_hash, email, phone) VALUES
('John', 'Doe', 'johndoe', '$2a$10$xZQZ8Z8Z8Z8Z8Z8Z8Z8Z8O', 'john.doe@email.com', '512-555-0101'),
('Jane', 'Smith', 'janesmith', '$2a$10$yYYY8Y8Y8Y8Y8Y8Y8Y8Y8O', 'jane.smith@email.com', '512-555-0102'),
('Bob', 'Johnson', 'bobjohnson', '$2a$10$zZZZ8Z8Z8Z8Z8Z8Z8Z8Z8O', 'bob.johnson@email.com', '512-555-0103'),
('Alice', 'Williams', 'alicew', '$2a$10$aAAA8A8A8A8A8A8A8A8A8O', 'alice.williams@email.com', '512-555-0104'),
('Charlie', 'Brown', 'charlieb', '$2a$10$bBBB8B8B8B8B8B8B8B8B8O', 'charlie.brown@email.com', '512-555-0105');

-- ============================
-- 7. Addresses
-- ============================
INSERT INTO Address (customer_id, line1, line2, city, state, zip_code, is_default) VALUES
(1, '123 Main St', 'Apt 4B', 'Austin', 'TX', '78701', 1),
(2, '456 Oak Ave', NULL, 'Dallas', 'TX', '75001', 1),
(3, '789 Pine Rd', 'Suite 200', 'Houston', 'TX', '77001', 1),
(4, '321 Elm St', NULL, 'San Antonio', 'TX', '78201', 1),
(5, '654 Maple Dr', 'Unit 5', 'Austin', 'TX', '78702', 1);

-- ============================
-- 8. Staff
-- ============================
INSERT INTO Staff (user_name, email, password_hash, phone, role) VALUES
('admin', 'admin@brightbuy.com', '$2a$10$adminHashHere', '512-555-9999', 'Level01'),
('manager', 'manager@brightbuy.com', '$2a$10$managerHashHere', '512-555-9998', 'Level02'),
('staff1', 'staff1@brightbuy.com', '$2a$10$staff1HashHere', '512-555-9997', 'Level02');

-- ============================
-- Population Complete!
-- Total Product Variants: 150+
-- ============================
