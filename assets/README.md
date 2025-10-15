# BrightBuy Assets

This folder contains all product images and other assets for the BrightBuy e-commerce platform.

## Folder Structure

```
assets/
└── products/
    ├── smartphones/
    ├── laptops/
    ├── tablets/
    └── accessories/
```

## Image Naming Convention

Images should follow this naming pattern:
```
{product-name}-{variant-color}.{extension}
```

Example: `iphone-15-pro-black.jpg`

## Current Product Images

### Smartphones
- `iphone-15-pro-black.jpg` - iPhone 15 Pro (Black/Titanium)
- `samsung-galaxy-s24-black.jpg` - Samsung Galaxy S24 (Phantom Black)
- `google-pixel-8-black.jpg` - Google Pixel 8 (Obsidian)

### Laptops
- `macbook-pro-14-silver.jpg` - MacBook Pro 14" (Silver)
- `dell-xps-15-silver.jpg` - Dell XPS 15 (Platinum Silver)

### Tablets
- `ipad-pro-11-silver.jpg` - iPad Pro 11" (Silver)
- `samsung-tab-s9-black.jpg` - Samsung Galaxy Tab S9 (Graphite)

### Accessories
- `headphones-black.jpg` - Wireless Headphones (Black)
- `smartwatch-black.jpg` - Smartwatch (Black)
- `wireless-earbuds-white.jpg` - Wireless Earbuds (White)

## Image Guidelines

- **Format**: JPEG for photos, PNG for graphics with transparency
- **Resolution**: Minimum 800px width for product images
- **Size**: Optimize images to be under 200KB when possible
- **Quality**: High quality, well-lit product photos
- **Background**: Clean, neutral backgrounds preferred

## Adding New Images

1. Place images in the appropriate category folder
2. Follow the naming convention: `product-name-color.jpg`
3. Update this README with the new image details
4. Update the database `ProductVariant` table with the image path

## Usage in Application

### Frontend
Images can be accessed using relative paths from the public folder or by setting up a static file server.

### Database Reference
Store image paths in the `ProductVariant` table's `image_url` column:
```sql
UPDATE ProductVariant 
SET image_url = '/assets/products/smartphones/iphone-15-pro-black.jpg'
WHERE variant_id = 1;
```

### Backend Setup (Optional)
To serve these images, you can configure Express to serve static files:
```javascript
app.use('/assets', express.static(path.join(__dirname, '../assets')));
```

## Image Sources

All images are sourced from Unsplash (https://unsplash.com) - free to use under the Unsplash License.

## Future Enhancements

- [ ] Add multiple images per variant (front, back, side views)
- [ ] Add product category banners
- [ ] Add brand logos
- [ ] Implement image optimization pipeline
- [ ] Add video demonstrations for complex products
