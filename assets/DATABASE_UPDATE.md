# Database Update Instructions

## ⚠️ IMPORTANT: Run These Scripts in Order!

### Step 1: Add image_url Column (Run This First!)

1. Open **MySQL Workbench**
2. Connect to your `brightbuy` database
3. Open the file: `d:\BrightBuy\BrightBuy\assets\add_image_column.sql`
4. Click the **Execute** button (⚡ lightning icon)
5. You should see: "image_url column added successfully!"

### Step 2: Update Image URLs (Run This Second!)

1. Still in **MySQL Workbench**
2. Open the file: `d:\BrightBuy\BrightBuy\assets\update_image_urls.sql`
3. Click the **Execute** button (⚡ lightning icon)
4. Verify with this query:
   ```sql
   SELECT variant_id, product_id, color, image_url 
   FROM ProductVariant 
   WHERE image_url IS NOT NULL 
   LIMIT 10;
   ```

## Option 2: Using Command Line (if MySQL is in PATH)

```bash
cd d:\BrightBuy\BrightBuy
mysql -u root -p brightbuy < assets\update_image_urls.sql
```

## Option 3: Copy-Paste into MySQL Client

Simply open the `update_image_urls.sql` file, copy all content, and paste it into your MySQL client.

## Verification

After running the SQL, check if images are assigned:

```sql
-- Check variants with images
SELECT 
    pv.variant_id,
    p.name,
    pv.color,
    pv.image_url
FROM ProductVariant pv
JOIN Product p ON pv.product_id = p.product_id
WHERE pv.image_url IS NOT NULL
LIMIT 20;

-- Count variants with images
SELECT COUNT(*) as variants_with_images 
FROM ProductVariant 
WHERE image_url IS NOT NULL;
```

## What This Does

The SQL script:
- Updates all smartphone variants with appropriate images
- Updates laptop variants with MacBook and Dell images
- Updates tablet variants with iPad and Samsung Tab images
- Updates accessory variants with headphones, smartwatch, and earbuds images
- Sets fallback images for any remaining variants

After this, your products will display actual product images! 🎉
