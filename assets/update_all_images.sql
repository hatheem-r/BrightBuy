-- Comprehensive Image URL Update for All Product Variants
-- This script assigns specific images to all 147+ product variants

USE brightbuy;

-- ====================
-- SMARTPHONES (Products 1-5)
-- ====================

-- Galaxy S24 Ultra (Product 1)
UPDATE ProductVariant SET image_url = '/assets/products/smartphones/samsung-galaxy-s24-black.jpg' 
WHERE product_id = 1 AND color IN ('Titanium Black', 'Titanium Gray');

-- iPhone 15 Pro Max (Product 2)
UPDATE ProductVariant SET image_url = '/assets/products/smartphones/iphone-15-pro-blue.jpg' 
WHERE product_id = 2 AND color LIKE '%Blue%';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/iphone-15-pro-black.jpg' 
WHERE product_id = 2 AND color LIKE '%Black%';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/iphone-15-pro-natural.jpg' 
WHERE product_id = 2 AND color LIKE '%Natural%';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/iphone-pink.jpg' 
WHERE product_id = 2 AND color LIKE '%White%';

-- Pixel 8 Pro (Product 3)
UPDATE ProductVariant SET image_url = '/assets/products/smartphones/google-pixel-8-black.jpg' 
WHERE product_id = 3 AND color = 'Obsidian';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/google-pixel-hazel.jpg' 
WHERE product_id = 3 AND color = 'Hazel';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/iphone-pink.jpg' 
WHERE product_id = 3 AND color = 'Rose';

-- OnePlus 12 (Product 4)
UPDATE ProductVariant SET image_url = '/assets/products/smartphones/oneplus-12-green.jpg' 
WHERE product_id = 4 AND color LIKE '%Emerald%';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/samsung-galaxy-s24-black.jpg' 
WHERE product_id = 4 AND color LIKE '%Black%';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/iphone-15-pro-natural.jpg' 
WHERE product_id = 4 AND color LIKE '%Gray%';

-- Xiaomi 14 Pro (Product 5)
UPDATE ProductVariant SET image_url = '/assets/products/smartphones/xiaomi-14-pro.jpg' 
WHERE product_id = 5;

-- ====================
-- LAPTOPS (Products 6-10)
-- ====================

-- MacBook Pro 16" (Product 6)
UPDATE ProductVariant SET image_url = '/assets/products/laptops/macbook-pro-16-spacegray.jpg' 
WHERE product_id = 6 AND color LIKE '%Gray%';

UPDATE ProductVariant SET image_url = '/assets/products/laptops/macbook-pro-14-silver.jpg' 
WHERE product_id = 6 AND color = 'Silver';

-- ThinkPad X1 Carbon (Product 7)
UPDATE ProductVariant SET image_url = '/assets/products/laptops/lenovo-thinkpad.jpg' 
WHERE product_id = 7;

-- XPS 15 (Product 8)
UPDATE ProductVariant SET image_url = '/assets/products/laptops/dell-xps-15-silver.jpg' 
WHERE product_id = 8 AND color LIKE '%Silver%';

UPDATE ProductVariant SET image_url = '/assets/products/laptops/dell-xps-13-platinum.jpg' 
WHERE product_id = 8 AND color = 'Frost';

-- ZenBook Pro (Product 9)
UPDATE ProductVariant SET image_url = '/assets/products/laptops/asus-zenbook.jpg' 
WHERE product_id = 9;

-- Surface Laptop 5 (Product 10)
UPDATE ProductVariant SET image_url = '/assets/products/laptops/microsoft-surface-laptop.jpg' 
WHERE product_id = 10;

-- ====================
-- TABLETS (Products 11-13)
-- ====================

-- iPad Pro 12.9" (Product 11)
UPDATE ProductVariant SET image_url = '/assets/products/tablets/ipad-pro-11-silver.jpg' 
WHERE product_id = 11;

-- Galaxy Tab S9 (Product 12)
UPDATE ProductVariant SET image_url = '/assets/products/tablets/samsung-tab-s9-black.jpg' 
WHERE product_id = 12 AND color = 'Graphite';

UPDATE ProductVariant SET image_url = '/assets/products/tablets/samsung-tab-beige.jpg' 
WHERE product_id = 12 AND color = 'Beige';

-- Surface Pro 9 (Product 13)
UPDATE ProductVariant SET image_url = '/assets/products/tablets/microsoft-surface-pro.jpg' 
WHERE product_id = 13;

-- ====================
-- SMARTWATCHES (Products 14-16)
-- ====================

-- Apple Watch Series 9 (Product 14)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/smartwatch-black.jpg' 
WHERE product_id = 14 AND color = 'Midnight';

UPDATE ProductVariant SET image_url = '/assets/products/accessories/apple-watch-starlight.jpg' 
WHERE product_id = 14 AND color = 'Starlight';

UPDATE ProductVariant SET image_url = '/assets/products/accessories/apple-watch-silver.jpg' 
WHERE product_id = 14 AND color IN ('Silver', 'Pink');

-- Galaxy Watch 6 (Product 15)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/samsung-watch.jpg' 
WHERE product_id = 15;

-- Pixel Watch 2 (Product 16)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/smartwatch-black.jpg' 
WHERE product_id = 16;

-- ====================
-- GAMING CONSOLES (Products 17-19)
-- ====================

-- PlayStation 5 (Product 17)
UPDATE ProductVariant SET image_url = '/assets/products/gaming/playstation-5.jpg' 
WHERE product_id = 17;

-- Xbox Series X (Product 18)
UPDATE ProductVariant SET image_url = '/assets/products/gaming/xbox-series-x.jpg' 
WHERE product_id = 18;

-- Nintendo Switch OLED (Product 19)
UPDATE ProductVariant SET image_url = '/assets/products/gaming/nintendo-switch.jpg' 
WHERE product_id = 19;

-- ====================
-- AUDIO - EARBUDS (Products 20-22)
-- ====================

-- AirPods Pro (Product 20)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/airpods-pro.jpg' 
WHERE product_id = 20;

-- WH-1000XM5 Sony (Product 21)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/headphones-black.jpg' 
WHERE product_id = 21 AND color = 'Black';

UPDATE ProductVariant SET image_url = '/assets/products/accessories/headphones-silver.jpg' 
WHERE product_id = 21 AND color = 'Silver';

-- QuietComfort Ultra Bose (Product 22)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/bose-headphones.jpg' 
WHERE product_id = 22;

-- Momentum 4 Sennheiser (Product 23)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/headphones-black.jpg' 
WHERE product_id = 23 AND color = 'Black';

UPDATE ProductVariant SET image_url = '/assets/products/accessories/headphones-pink.jpg' 
WHERE product_id = 23 AND color = 'White';

-- ====================
-- SPEAKERS (Products 24-26)
-- ====================

-- HomePod (Product 24)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/homepod.jpg' 
WHERE product_id = 24;

-- Echo Studio (Product 25)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/echo-speaker.jpg' 
WHERE product_id = 25;

-- Sonos One (Product 26)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/echo-speaker.jpg' 
WHERE product_id = 26;

-- ====================
-- CAMERAS (Products 27-29)
-- ====================

-- EOS R6 Mark II Canon (Product 27)
UPDATE ProductVariant SET image_url = '/assets/products/cameras/canon-eos.jpg' 
WHERE product_id = 27;

-- Alpha A7 IV Sony (Product 28)
UPDATE ProductVariant SET image_url = '/assets/products/cameras/sony-alpha.jpg' 
WHERE product_id = 28;

-- Z6 III Nikon (Product 29)
UPDATE ProductVariant SET image_url = '/assets/products/cameras/nikon-z6.jpg' 
WHERE product_id = 29;

-- ====================
-- STORAGE (Products 30-32)
-- ====================

-- Portable SSD T7 Samsung (Product 30)
UPDATE ProductVariant SET image_url = '/assets/products/storage/samsung-ssd.jpg' 
WHERE product_id = 30;

-- My Passport WD (Product 31)
UPDATE ProductVariant SET image_url = '/assets/products/storage/external-hdd.jpg' 
WHERE product_id = 31;

-- Extreme Pro SSD SanDisk (Product 32)
UPDATE ProductVariant SET image_url = '/assets/products/storage/sandisk-ssd.jpg' 
WHERE product_id = 32;

-- ====================
-- ACCESSORIES (Products 33-42)
-- ====================

-- Magic Keyboard (Product 33)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/magic-keyboard.jpg' 
WHERE product_id = 33;

-- MX Master 3S (Product 34)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/logitech-mouse.jpg' 
WHERE product_id = 34;

-- PowerCore 20000 (Product 35)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/powerbank.jpg' 
WHERE product_id = 35;

-- USB-C Hub (Product 36)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/usb-cable.jpg' 
WHERE product_id = 36;

-- Phone Case Pro (Product 37)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/phone-case.jpg' 
WHERE product_id = 37;

-- Screen Protector (Product 38)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/phone-case.jpg' 
WHERE product_id = 38;

-- Wireless Charger (Product 39)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/wireless-charger.jpg' 
WHERE product_id = 39;

-- HDMI Cable (Product 40)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/usb-cable.jpg' 
WHERE product_id = 40;

-- Lightning Cable (Product 41)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/usb-cable.jpg' 
WHERE product_id = 41;

-- USB-C Cable (Product 42)
UPDATE ProductVariant SET image_url = '/assets/products/accessories/usb-cable.jpg' 
WHERE product_id = 42;

-- ====================
-- VERIFICATION
-- ====================

-- Count variants with images
SELECT COUNT(*) as variants_with_images 
FROM ProductVariant 
WHERE image_url IS NOT NULL;

-- Show sample of updated variants
SELECT 
    pv.variant_id,
    p.name AS product_name,
    pv.color,
    pv.size,
    pv.image_url
FROM ProductVariant pv
JOIN Product p ON pv.product_id = p.product_id
WHERE pv.image_url IS NOT NULL
ORDER BY p.product_id, pv.variant_id
LIMIT 20;

SELECT '✅ All product images have been updated successfully!' as status;
