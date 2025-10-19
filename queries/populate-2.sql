-- ============================
-- BrightBuy Inventory Population Script
-- This script adds inventory quantities for all product variants
-- Uses the trg_variant_create_inventory trigger (which auto-creates inventory rows)
-- Then updates them with specific quantities
-- ============================
USE brightbuy;
-- ============================
-- Update Inventory for All Variants
-- Note: Inventory rows are automatically created by trigger when variants are inserted
-- This script updates those rows with realistic stock quantities
-- ============================
-- ============================
-- Smartphones (Variants 1-30)
-- High demand items - moderate to high stock
-- ============================
-- Galaxy S24 Ultra (Variants 1-8) - Popular flagship
UPDATE Inventory
SET quantity = 45
WHERE variant_id = 1;
-- 256GB Titanium Black (default)
UPDATE Inventory
SET quantity = 35
WHERE variant_id = 2;
-- 256GB Titanium Gray
UPDATE Inventory
SET quantity = 50
WHERE variant_id = 3;
-- 512GB Titanium Black
UPDATE Inventory
SET quantity = 40
WHERE variant_id = 4;
-- 512GB Titanium Gray
UPDATE Inventory
SET quantity = 30
WHERE variant_id = 5;
-- 1TB Titanium Black
UPDATE Inventory
SET quantity = 25
WHERE variant_id = 6;
-- 1TB Titanium Gray
UPDATE Inventory
SET quantity = 28
WHERE variant_id = 7;
-- 256GB Titanium Violet
UPDATE Inventory
SET quantity = 22
WHERE variant_id = 8;
-- 512GB Titanium Violet
-- iPhone 15 Pro Max (Variants 9-16) - Very popular
UPDATE Inventory
SET quantity = 60
WHERE variant_id = 9;
-- 256GB Blue Titanium (default)
UPDATE Inventory
SET quantity = 55
WHERE variant_id = 10;
-- 256GB Natural Titanium
UPDATE Inventory
SET quantity = 50
WHERE variant_id = 11;
-- 256GB White Titanium
UPDATE Inventory
SET quantity = 48
WHERE variant_id = 12;
-- 256GB Black Titanium
UPDATE Inventory
SET quantity = 42
WHERE variant_id = 13;
-- 512GB Blue Titanium
UPDATE Inventory
SET quantity = 38
WHERE variant_id = 14;
-- 512GB Natural Titanium
UPDATE Inventory
SET quantity = 25
WHERE variant_id = 15;
-- 1TB Blue Titanium
UPDATE Inventory
SET quantity = 20
WHERE variant_id = 16;
-- 1TB Black Titanium
-- Pixel 8 Pro (Variants 17-22)
UPDATE Inventory
SET quantity = 35
WHERE variant_id = 17;
-- 128GB Obsidian (default)
UPDATE Inventory
SET quantity = 30
WHERE variant_id = 18;
-- 128GB Porcelain
UPDATE Inventory
SET quantity = 28
WHERE variant_id = 19;
-- 128GB Bay Blue
UPDATE Inventory
SET quantity = 32
WHERE variant_id = 20;
-- 256GB Obsidian
UPDATE Inventory
SET quantity = 27
WHERE variant_id = 21;
-- 256GB Porcelain
UPDATE Inventory
SET quantity = 18
WHERE variant_id = 22;
-- 512GB Obsidian
-- OnePlus 12 (Variants 23-26)
UPDATE Inventory
SET quantity = 40
WHERE variant_id = 23;
-- 256GB Flowy Emerald (default)
UPDATE Inventory
SET quantity = 38
WHERE variant_id = 24;
-- 256GB Silky Black
UPDATE Inventory
SET quantity = 30
WHERE variant_id = 25;
-- 512GB Flowy Emerald
UPDATE Inventory
SET quantity = 28
WHERE variant_id = 26;
-- 512GB Silky Black
-- Xiaomi 14 Pro (Variants 27-30)
UPDATE Inventory
SET quantity = 35
WHERE variant_id = 27;
-- 256GB Black (default)
UPDATE Inventory
SET quantity = 32
WHERE variant_id = 28;
-- 256GB White
UPDATE Inventory
SET quantity = 25
WHERE variant_id = 29;
-- 512GB Black
UPDATE Inventory
SET quantity = 22
WHERE variant_id = 30;
-- 512GB White
-- ============================
-- Laptops (Variants 31-51)
-- Premium items - lower stock, higher value
-- ============================
-- MacBook Pro 16" (Variants 31-36)
UPDATE Inventory
SET quantity = 25
WHERE variant_id = 31;
-- M3 Pro 512GB Space Gray (default)
UPDATE Inventory
SET quantity = 22
WHERE variant_id = 32;
-- M3 Pro 512GB Silver
UPDATE Inventory
SET quantity = 28
WHERE variant_id = 33;
-- M3 Pro 1TB Space Gray
UPDATE Inventory
SET quantity = 24
WHERE variant_id = 34;
-- M3 Pro 1TB Silver
UPDATE Inventory
SET quantity = 15
WHERE variant_id = 35;
-- M3 Max 1TB Space Gray
UPDATE Inventory
SET quantity = 12
WHERE variant_id = 36;
-- M3 Max 2TB Space Gray
-- ThinkPad X1 Carbon (Variants 37-40)
UPDATE Inventory
SET quantity = 30
WHERE variant_id = 37;
-- i5 256GB (default)
UPDATE Inventory
SET quantity = 28
WHERE variant_id = 38;
-- i5 512GB
UPDATE Inventory
SET quantity = 25
WHERE variant_id = 39;
-- i7 512GB
UPDATE Inventory
SET quantity = 20
WHERE variant_id = 40;
-- i7 1TB
-- Dell XPS 15 (Variants 41-44)
UPDATE Inventory
SET quantity = 24
WHERE variant_id = 41;
-- i7 512GB Platinum Silver (default)
UPDATE Inventory
SET quantity = 22
WHERE variant_id = 42;
-- i7 1TB Platinum Silver
UPDATE Inventory
SET quantity = 18
WHERE variant_id = 43;
-- i9 1TB Graphite
UPDATE Inventory
SET quantity = 15
WHERE variant_id = 44;
-- i9 2TB Graphite
-- ASUS ZenBook Pro (Variants 45-47)
UPDATE Inventory
SET quantity = 26
WHERE variant_id = 45;
-- i7 512GB Pine Gray (default)
UPDATE Inventory
SET quantity = 22
WHERE variant_id = 46;
-- i7 1TB Pine Gray
UPDATE Inventory
SET quantity = 18
WHERE variant_id = 47;
-- i9 1TB Deep Blue
-- Surface Laptop 5 (Variants 48-51)
UPDATE Inventory
SET quantity = 32
WHERE variant_id = 48;
-- i5 256GB Platinum (default)
UPDATE Inventory
SET quantity = 28
WHERE variant_id = 49;
-- i5 512GB Platinum
UPDATE Inventory
SET quantity = 24
WHERE variant_id = 50;
-- i7 512GB Sage
UPDATE Inventory
SET quantity = 20
WHERE variant_id = 51;
-- i7 1TB Graphite
-- ============================
-- Tablets (Variants 52-61)
-- Moderate stock levels
-- ============================
-- iPad Pro 12.9" (Variants 52-57)
UPDATE Inventory
SET quantity = 30
WHERE variant_id = 52;
-- 128GB Space Gray (default)
UPDATE Inventory
SET quantity = 28
WHERE variant_id = 53;
-- 128GB Silver
UPDATE Inventory
SET quantity = 32
WHERE variant_id = 54;
-- 256GB Space Gray
UPDATE Inventory
SET quantity = 30
WHERE variant_id = 55;
-- 256GB Silver
UPDATE Inventory
SET quantity = 20
WHERE variant_id = 56;
-- 512GB Space Gray
UPDATE Inventory
SET quantity = 18
WHERE variant_id = 57;
-- 1TB Space Gray
-- Galaxy Tab S9 (Variants 58-61)
UPDATE Inventory
SET quantity = 35
WHERE variant_id = 58;
-- 128GB Beige (default)
UPDATE Inventory
SET quantity = 32
WHERE variant_id = 59;
-- 256GB Beige
UPDATE Inventory
SET quantity = 28
WHERE variant_id = 60;
-- 256GB Graphite
UPDATE Inventory
SET quantity = 25
WHERE variant_id = 61;
-- 512GB Graphite
-- Surface Pro 9 (Variants 62-65)
UPDATE Inventory
SET quantity = 28
WHERE variant_id = 62;
-- i5 256GB Platinum (default)
UPDATE Inventory
SET quantity = 26
WHERE variant_id = 63;
-- i5 512GB Platinum
UPDATE Inventory
SET quantity = 22
WHERE variant_id = 64;
-- i7 512GB Graphite
UPDATE Inventory
SET quantity = 18
WHERE variant_id = 65;
-- i7 1TB Sapphire
-- ============================
-- Smartwatches (Variants 66-77)
-- High turnover - good stock
-- ============================
-- Apple Watch Series 9 (Variants 66-71)
UPDATE Inventory
SET quantity = 50
WHERE variant_id = 66;
-- 41mm Midnight (default)
UPDATE Inventory
SET quantity = 48
WHERE variant_id = 67;
-- 41mm Starlight
UPDATE Inventory
SET quantity = 45
WHERE variant_id = 68;
-- 41mm Pink
UPDATE Inventory
SET quantity = 42
WHERE variant_id = 69;
-- 45mm Midnight
UPDATE Inventory
SET quantity = 40
WHERE variant_id = 70;
-- 45mm Starlight
UPDATE Inventory
SET quantity = 35
WHERE variant_id = 71;
-- 45mm Product Red
-- Galaxy Watch 6 (Variants 72-75)
UPDATE Inventory
SET quantity = 38
WHERE variant_id = 72;
-- 40mm Graphite (default)
UPDATE Inventory
SET quantity = 35
WHERE variant_id = 73;
-- 40mm Gold
UPDATE Inventory
SET quantity = 32
WHERE variant_id = 74;
-- 44mm Graphite
UPDATE Inventory
SET quantity = 30
WHERE variant_id = 75;
-- 44mm Silver
-- Pixel Watch 2 (Variants 76-77)
UPDATE Inventory
SET quantity = 30
WHERE variant_id = 76;
-- Polished Silver (default)
UPDATE Inventory
SET quantity = 28
WHERE variant_id = 77;
-- Matte Black
-- ============================
-- Gaming Consoles (Variants 78-86)
-- High demand - controlled stock
-- ============================
-- PlayStation 5 (Variants 78-80)
UPDATE Inventory
SET quantity = 45
WHERE variant_id = 78;
-- Standard Edition (default)
UPDATE Inventory
SET quantity = 40
WHERE variant_id = 79;
-- Digital Edition
UPDATE Inventory
SET quantity = 35
WHERE variant_id = 80;
-- Standard + Extra Controller
-- Xbox Series X (Variants 81-83)
UPDATE Inventory
SET quantity = 42
WHERE variant_id = 81;
-- 1TB (default)
UPDATE Inventory
SET quantity = 35
WHERE variant_id = 82;
-- 1TB + Game Pass
UPDATE Inventory
SET quantity = 30
WHERE variant_id = 83;
-- 1TB Carbon Black
-- Nintendo Switch OLED (Variants 84-86)
UPDATE Inventory
SET quantity = 55
WHERE variant_id = 84;
-- White (default)
UPDATE Inventory
SET quantity = 50
WHERE variant_id = 85;
-- Neon Red/Blue
UPDATE Inventory
SET quantity = 45
WHERE variant_id = 86;
-- Splatoon Edition
-- ============================
-- Headphones (Variants 87-102)
-- Popular accessories - high stock
-- ============================
-- AirPods Pro (Variants 87-88)
UPDATE Inventory
SET quantity = 80
WHERE variant_id = 87;
-- 2nd Gen (default)
UPDATE Inventory
SET quantity = 75
WHERE variant_id = 88;
-- 2nd Gen + MagSafe
-- Sony WH-1000XM5 (Variants 89-91)
UPDATE Inventory
SET quantity = 55
WHERE variant_id = 89;
-- Black (default)
UPDATE Inventory
SET quantity = 50
WHERE variant_id = 90;
-- Silver
UPDATE Inventory
SET quantity = 45
WHERE variant_id = 91;
-- Midnight Blue
-- Bose QuietComfort Ultra (Variants 92-94)
UPDATE Inventory
SET quantity = 48
WHERE variant_id = 92;
-- Black (default)
UPDATE Inventory
SET quantity = 45
WHERE variant_id = 93;
-- White Smoke
UPDATE Inventory
SET quantity = 42
WHERE variant_id = 94;
-- Sandstone
-- Sennheiser Momentum 4 (Variants 95-96)
UPDATE Inventory
SET quantity = 40
WHERE variant_id = 95;
-- Black (default)
UPDATE Inventory
SET quantity = 35
WHERE variant_id = 96;
-- White
-- Gaming Headsets (Variants 97-102)
UPDATE Inventory
SET quantity = 60
WHERE variant_id = 97;
-- SteelSeries Arctis Nova Pro
UPDATE Inventory
SET quantity = 55
WHERE variant_id = 98;
-- Logitech G Pro X
UPDATE Inventory
SET quantity = 50
WHERE variant_id = 99;
-- Razer BlackShark V2
UPDATE Inventory
SET quantity = 52
WHERE variant_id = 100;
-- HyperX Cloud Alpha
UPDATE Inventory
SET quantity = 48
WHERE variant_id = 101;
-- Corsair HS80
UPDATE Inventory
SET quantity = 45
WHERE variant_id = 102;
-- Astro A50
-- ============================
-- Speakers (Variants 103-112)
-- ============================
-- HomePod (Variants 103-104)
UPDATE Inventory
SET quantity = 40
WHERE variant_id = 103;
-- White (default)
UPDATE Inventory
SET quantity = 38
WHERE variant_id = 104;
-- Midnight
-- Echo Studio (Variants 105-106)
UPDATE Inventory
SET quantity = 50
WHERE variant_id = 105;
-- Charcoal (default)
UPDATE Inventory
SET quantity = 45
WHERE variant_id = 106;
-- Glacier White
-- Sonos One (Variants 107-108)
UPDATE Inventory
SET quantity = 52
WHERE variant_id = 107;
-- Black (default)
UPDATE Inventory
SET quantity = 48
WHERE variant_id = 108;
-- White
-- Portable Speakers (Variants 109-112)
UPDATE Inventory
SET quantity = 65
WHERE variant_id = 109;
-- JBL Flip 6
UPDATE Inventory
SET quantity = 60
WHERE variant_id = 110;
-- UE Boom 3
UPDATE Inventory
SET quantity = 55
WHERE variant_id = 111;
-- Bose SoundLink Flex
UPDATE Inventory
SET quantity = 58
WHERE variant_id = 112;
-- Sony SRS-XB43
-- ============================
-- Cameras (Variants 113-124)
-- Professional equipment - lower stock
-- ============================
-- Canon EOS R6 Mark II (Variants 113-115)
UPDATE Inventory
SET quantity = 15
WHERE variant_id = 113;
-- Body Only (default)
UPDATE Inventory
SET quantity = 12
WHERE variant_id = 114;
-- With 24-105mm Lens
UPDATE Inventory
SET quantity = 10
WHERE variant_id = 115;
-- With 24-70mm Lens
-- Sony Alpha A7 IV (Variants 116-118)
UPDATE Inventory
SET quantity = 18
WHERE variant_id = 116;
-- Body Only (default)
UPDATE Inventory
SET quantity = 14
WHERE variant_id = 117;
-- With 28-70mm Lens
UPDATE Inventory
SET quantity = 11
WHERE variant_id = 118;
-- With 24-105mm Lens
-- Nikon Z6 III (Variants 119-121)
UPDATE Inventory
SET quantity = 16
WHERE variant_id = 119;
-- Body Only (default)
UPDATE Inventory
SET quantity = 13
WHERE variant_id = 120;
-- With 24-70mm Lens
UPDATE Inventory
SET quantity = 10
WHERE variant_id = 121;
-- With 24-120mm Lens
-- Action Cameras (Variants 122-124)
UPDATE Inventory
SET quantity = 45
WHERE variant_id = 122;
-- GoPro Hero 12
UPDATE Inventory
SET quantity = 40
WHERE variant_id = 123;
-- DJI Osmo Action 4
UPDATE Inventory
SET quantity = 35
WHERE variant_id = 124;
-- Insta360 X3
-- ============================
-- Storage Devices (Variants 125-136)
-- High demand accessories - good stock
-- ============================
-- Samsung Portable SSD T7 (Variants 125-128)
UPDATE Inventory
SET quantity = 70
WHERE variant_id = 125;
-- 500GB Gray (default)
UPDATE Inventory
SET quantity = 75
WHERE variant_id = 126;
-- 1TB Gray
UPDATE Inventory
SET quantity = 65
WHERE variant_id = 127;
-- 2TB Gray
UPDATE Inventory
SET quantity = 55
WHERE variant_id = 128;
-- 2TB Blue
-- WD My Passport (Variants 129-132)
UPDATE Inventory
SET quantity = 80
WHERE variant_id = 129;
-- 1TB Black (default)
UPDATE Inventory
SET quantity = 75
WHERE variant_id = 130;
-- 2TB Black
UPDATE Inventory
SET quantity = 70
WHERE variant_id = 131;
-- 4TB Black
UPDATE Inventory
SET quantity = 60
WHERE variant_id = 132;
-- 5TB Black
-- SanDisk Extreme Pro SSD (Variants 133-136)
UPDATE Inventory
SET quantity = 65
WHERE variant_id = 133;
-- 500GB (default)
UPDATE Inventory
SET quantity = 70
WHERE variant_id = 134;
-- 1TB
UPDATE Inventory
SET quantity = 60
WHERE variant_id = 135;
-- 2TB
UPDATE Inventory
SET quantity = 50
WHERE variant_id = 136;
-- 4TB
-- ============================
-- Accessories (Variants 137-150+)
-- Very high stock - fast movers
-- ============================
-- Keyboards (Variants 137-140)
UPDATE Inventory
SET quantity = 90
WHERE variant_id = 137;
-- Apple Magic Keyboard (default)
UPDATE Inventory
SET quantity = 85
WHERE variant_id = 138;
-- Logitech MX Keys
UPDATE Inventory
SET quantity = 80
WHERE variant_id = 139;
-- Keychron K2
UPDATE Inventory
SET quantity = 75
WHERE variant_id = 140;
-- Corsair K70
-- Mice (Variants 141-144)
UPDATE Inventory
SET quantity = 95
WHERE variant_id = 141;
-- Logitech MX Master 3S (default)
UPDATE Inventory
SET quantity = 90
WHERE variant_id = 142;
-- Apple Magic Mouse
UPDATE Inventory
SET quantity = 85
WHERE variant_id = 143;
-- Razer DeathAdder V3
UPDATE Inventory
SET quantity = 80
WHERE variant_id = 144;
-- Logitech G502
-- Power Banks (Variants 145-147)
UPDATE Inventory
SET quantity = 100
WHERE variant_id = 145;
-- Anker PowerCore 20000 (default)
UPDATE Inventory
SET quantity = 95
WHERE variant_id = 146;
-- Anker PowerCore 26800
UPDATE Inventory
SET quantity = 90
WHERE variant_id = 147;
-- RAVPower 30000mAh
-- USB-C Hubs (Variants 148-150)
UPDATE Inventory
SET quantity = 85
WHERE variant_id = 148;
-- Anker 7-in-1 Hub (default)
UPDATE Inventory
SET quantity = 80
WHERE variant_id = 149;
-- Satechi Aluminum Hub
UPDATE Inventory
SET quantity = 75
WHERE variant_id = 150;
-- HyperDrive 8-in-1 Hub
-- Phone Cases (Variants 151-155) - If they exist
UPDATE Inventory
SET quantity = 120
WHERE variant_id = 151;
-- Spigen Tough Armor
UPDATE Inventory
SET quantity = 115
WHERE variant_id = 152;
-- OtterBox Defender
UPDATE Inventory
SET quantity = 110
WHERE variant_id = 153;
-- Apple Silicone Case
UPDATE Inventory
SET quantity = 105
WHERE variant_id = 154;
-- Caseology Parallax
UPDATE Inventory
SET quantity = 100
WHERE variant_id = 155;
-- UAG Plasma
-- Screen Protectors (Variants 156-158)
UPDATE Inventory
SET quantity = 150
WHERE variant_id = 156;
-- ESR Tempered Glass (default)
UPDATE Inventory
SET quantity = 140
WHERE variant_id = 157;
-- Spigen GlasTR
UPDATE Inventory
SET quantity = 130
WHERE variant_id = 158;
-- amFilm Glass
-- Wireless Chargers (Variants 159-161)
UPDATE Inventory
SET quantity = 95
WHERE variant_id = 159;
-- Belkin BoostCharge (default)
UPDATE Inventory
SET quantity = 90
WHERE variant_id = 160;
-- Anker PowerWave
UPDATE Inventory
SET quantity = 85
WHERE variant_id = 161;
-- Apple MagSafe Charger
-- Cables (Variants 162-170)
UPDATE Inventory
SET quantity = 200
WHERE variant_id = 162;
-- HDMI Cable 6ft
UPDATE Inventory
SET quantity = 195
WHERE variant_id = 163;
-- HDMI Cable 10ft
UPDATE Inventory
SET quantity = 180
WHERE variant_id = 164;
-- Lightning Cable 3ft
UPDATE Inventory
SET quantity = 175
WHERE variant_id = 165;
-- Lightning Cable 6ft
UPDATE Inventory
SET quantity = 190
WHERE variant_id = 166;
-- USB-C Cable 3ft
UPDATE Inventory
SET quantity = 185
WHERE variant_id = 167;
-- USB-C Cable 6ft
UPDATE Inventory
SET quantity = 170
WHERE variant_id = 168;
-- USB-C to Lightning
UPDATE Inventory
SET quantity = 160
WHERE variant_id = 169;
-- Thunderbolt 4 Cable
UPDATE Inventory
SET quantity = 150
WHERE variant_id = 170;
-- DisplayPort Cable
-- ============================
-- Summary
-- ============================
-- Inventory has been populated for all variants
-- Stock levels are based on product category:
--   - Smartphones: 20-60 units
--   - Laptops: 12-30 units
--   - Tablets: 18-35 units
--   - Smartwatches: 28-50 units
--   - Gaming Consoles: 30-55 units
--   - Headphones: 35-80 units
--   - Speakers: 38-65 units
--   - Cameras: 10-45 units
--   - Storage: 50-80 units
--   - Accessories: 75-200 units
-- ============================
SELECT 'Inventory population completed!' AS Status;
SELECT COUNT(*) AS Total_Variants_With_Inventory
FROM Inventory;
SELECT SUM(quantity) AS Total_Items_In_Stock
FROM Inventory;
SELECT AVG(quantity) AS Average_Stock_Per_Variant
FROM Inventory;