-- Update ProductVariant table with image URLs
-- Run this SQL script to add image paths to your product variants

-- Smartphones
UPDATE ProductVariant SET image_url = '/assets/products/smartphones/iphone-15-pro-black.jpg' 
WHERE product_id = 1 AND color = 'Titanium Black';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/iphone-15-pro-black.jpg' 
WHERE product_id = 1 AND color = 'Titanium Blue';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/iphone-15-pro-black.jpg' 
WHERE product_id = 1 AND color = 'Titanium White';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/iphone-15-pro-black.jpg' 
WHERE product_id = 1 AND color = 'Titanium Natural';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/samsung-galaxy-s24-black.jpg' 
WHERE product_id = 2 AND color = 'Phantom Black';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/samsung-galaxy-s24-black.jpg' 
WHERE product_id = 2 AND color = 'Cream';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/samsung-galaxy-s24-black.jpg' 
WHERE product_id = 2 AND color = 'Violet';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/google-pixel-8-black.jpg' 
WHERE product_id = 3 AND color = 'Obsidian';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/google-pixel-8-black.jpg' 
WHERE product_id = 3 AND color = 'Hazel';

UPDATE ProductVariant SET image_url = '/assets/products/smartphones/google-pixel-8-black.jpg' 
WHERE product_id = 3 AND color = 'Rose';

-- Laptops
UPDATE ProductVariant SET image_url = '/assets/products/laptops/macbook-pro-14-silver.jpg' 
WHERE product_id IN (4, 5) AND color = 'Silver';

UPDATE ProductVariant SET image_url = '/assets/products/laptops/macbook-pro-14-silver.jpg' 
WHERE product_id IN (4, 5) AND color = 'Space Gray';

UPDATE ProductVariant SET image_url = '/assets/products/laptops/dell-xps-15-silver.jpg' 
WHERE product_id = 6 AND color = 'Platinum Silver';

UPDATE ProductVariant SET image_url = '/assets/products/laptops/dell-xps-15-silver.jpg' 
WHERE product_id = 6 AND color = 'Frost';

UPDATE ProductVariant SET image_url = '/assets/products/laptops/dell-xps-15-silver.jpg' 
WHERE product_id IN (7, 8, 9) AND color IN ('Platinum Silver', 'Natural Silver', 'Abyss Blue');

-- Tablets
UPDATE ProductVariant SET image_url = '/assets/products/tablets/ipad-pro-11-silver.jpg' 
WHERE product_id IN (10, 11, 12) AND color = 'Silver';

UPDATE ProductVariant SET image_url = '/assets/products/tablets/ipad-pro-11-silver.jpg' 
WHERE product_id IN (10, 11, 12) AND color = 'Space Gray';

UPDATE ProductVariant SET image_url = '/assets/products/tablets/samsung-tab-s9-black.jpg' 
WHERE product_id = 13 AND color = 'Graphite';

UPDATE ProductVariant SET image_url = '/assets/products/tablets/samsung-tab-s9-black.jpg' 
WHERE product_id = 13 AND color = 'Beige';

-- Accessories
UPDATE ProductVariant SET image_url = '/assets/products/accessories/headphones-black.jpg' 
WHERE product_id IN (20, 21, 22) AND (color = 'Black' OR color = 'Midnight');

UPDATE ProductVariant SET image_url = '/assets/products/accessories/headphones-black.jpg' 
WHERE product_id IN (20, 21, 22) AND color IN ('Silver', 'Space Gray', 'Pink');

UPDATE ProductVariant SET image_url = '/assets/products/accessories/smartwatch-black.jpg' 
WHERE product_id IN (23, 24, 25) AND color IN ('Midnight', 'Graphite', 'Black');

UPDATE ProductVariant SET image_url = '/assets/products/accessories/smartwatch-black.jpg' 
WHERE product_id IN (23, 24, 25) AND color IN ('Starlight', 'Silver', 'Cream');

UPDATE ProductVariant SET image_url = '/assets/products/accessories/wireless-earbuds-white.jpg' 
WHERE product_id IN (26, 27, 28);

-- Generic fallback for any remaining variants without images
UPDATE ProductVariant SET image_url = '/assets/products/smartphones/iphone-15-pro-black.jpg' 
WHERE image_url IS NULL AND product_id BETWEEN 1 AND 3;

UPDATE ProductVariant SET image_url = '/assets/products/laptops/macbook-pro-14-silver.jpg' 
WHERE image_url IS NULL AND product_id BETWEEN 4 AND 9;

UPDATE ProductVariant SET image_url = '/assets/products/tablets/ipad-pro-11-silver.jpg' 
WHERE image_url IS NULL AND product_id BETWEEN 10 AND 19;

UPDATE ProductVariant SET image_url = '/assets/products/accessories/headphones-black.jpg' 
WHERE image_url IS NULL AND product_id BETWEEN 20 AND 42;

-- Verify the updates
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
LIMIT 50;
