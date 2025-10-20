# 🧪 Testing Guide - Image Upload System

## ✅ Quick Verification

### 1. Check Database Images
```sql
USE brightbuy;

-- Count images
SELECT 
  COUNT(*) as total_variants,
  SUM(CASE WHEN image_url IS NOT NULL THEN 1 ELSE 0 END) as with_images,
  SUM(CASE WHEN image_url IS NULL THEN 1 ELSE 0 END) as without_images
FROM ProductVariant;

-- Expected Result:
-- total_variants: 147
-- with_images: 147
-- without_images: 0
```

### 2. View Sample Images
```sql
-- First 10 products with images
SELECT 
  p.name,
  pv.color,
  pv.size,
  pv.image_url
FROM ProductVariant pv
JOIN Product p ON pv.product_id = p.product_id
LIMIT 10;

-- Should show Unsplash CDN URLs for Galaxy S24, iPhone 15, etc.
```

---

## 🚀 Test Image Upload API

### Test 1: Upload an Image File

**Using PowerShell:**
```powershell
# Start backend first
cd backend
npm start

# In another terminal, test upload
$file = Get-Item "C:\path\to\your\image.jpg"
$form = @{
    image = $file
}

Invoke-RestMethod -Uri "http://localhost:5001/api/products/upload-image" `
    -Method Post -Form $form
```

**Using curl:**
```bash
curl -X POST http://localhost:5001/api/products/upload-image `
  -F "image=@C:\path\to\image.jpg"
```

**Expected Response:**
```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "/images/products/1729445678-123456789.jpg",
  "filename": "1729445678-123456789.jpg"
}
```

### Test 2: Create Product with Image

```powershell
$body = @{
    name = "Test Product"
    brand = "Test Brand"
    description = "Testing product creation"
    category_id = 1
    variants = @(
        @{
            sku = "TEST-001"
            price = 99.99
            size = "Standard"
            color = "Black"
            image_url = "/images/products/test-image.jpg"
            is_default = $true
        }
    )
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "http://localhost:5001/api/products" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

**Expected Response:**
```json
{
  "message": "Product created successfully",
  "productId": 43
}
```

### Test 3: Update Variant Image

```powershell
$body = @{
    image_url = "/images/products/new-image.jpg"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5001/api/products/variants/147/image" `
    -Method Put `
    -Body $body `
    -ContentType "application/json"
```

**Expected Response:**
```json
{
  "message": "Image updated successfully"
}
```

---

## 🎨 Test Frontend Component

### Setup
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### Test the Example Page

1. Open browser: `http://localhost:3000/add-product-example`
2. Fill in product details:
   - Name: "Test Product"
   - Brand: "Test Brand"
   - Category ID: 1
3. Fill in variant details:
   - SKU: "TEST-001"
   - Price: 99.99
   - Size: "256GB"
   - Color: "Black"
4. Upload image:
   - Click or drag image to upload area
   - Wait for preview
   - Click "Upload Image"
   - Should see success message
5. Click "Create Product"
6. Should see success message with product ID

### Test ImageUpload Component Independently

Create a test page:
```jsx
// pages/test-upload.jsx
import ImageUpload from '@/components/ImageUpload';

export default function TestUpload() {
  const handleUpload = (imageUrl) => {
    console.log('Image uploaded:', imageUrl);
    alert(`Image uploaded: ${imageUrl}`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test Image Upload</h1>
      <ImageUpload onImageUploaded={handleUpload} />
    </div>
  );
}
```

---

## 🔍 Verify Uploaded Files

### Check if files are being saved
```powershell
# List uploaded images
Get-ChildItem backend\public\images\products\ | Select-Object Name, Length, LastWriteTime

# Should show uploaded files with timestamp-based names
```

### Access image via browser
```
http://localhost:5001/images/products/1729445678-123456789.jpg
```

---

## ✅ Validation Tests

### Test File Type Validation
```javascript
// Should REJECT these:
const invalidFiles = [
  'document.pdf',
  'video.mp4',
  'audio.mp3',
  'text.txt'
];

// Should ACCEPT these:
const validFiles = [
  'image.jpg',
  'photo.jpeg',
  'picture.png',
  'graphic.gif',
  'modern.webp'
];
```

### Test File Size Validation
```javascript
// Should REJECT files > 5MB
const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.jpg');

// Should ACCEPT files <= 5MB
const normalFile = new File([new ArrayBuffer(2 * 1024 * 1024)], 'normal.jpg');
```

---

## 📊 Performance Test

### Test Upload Speed
```javascript
// Measure upload time
const start = Date.now();

// Upload file...

const end = Date.now();
console.log(`Upload took ${end - start}ms`);

// Expected: < 1000ms for images under 1MB
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find path" error
**Solution:** Make sure backend/public/images/products/ directory exists
```powershell
New-Item -ItemType Directory -Force -Path "backend\public\images\products"
```

### Issue: "File too large" error
**Solution:** Image must be under 5MB
```powershell
# Check file size
(Get-Item "image.jpg").Length / 1MB
# Should be < 5
```

### Issue: Images not showing in frontend
**Solution:** Check if static files are being served
```javascript
// In backend/server.js, should have:
app.use("/images", express.static(path.join(__dirname, "public/images")));
```

### Issue: CORS error
**Solution:** Check CORS configuration in server.js
```javascript
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));
```

---

## 📸 Sample Test Images

You can use these free image sources for testing:
1. **Unsplash:** https://unsplash.com/
2. **Pexels:** https://pexels.com/
3. **Pixabay:** https://pixabay.com/

Or create a test image:
```powershell
# Generate a simple test image (requires ImageMagick)
magick -size 800x800 xc:blue test-image.jpg
```

---

## ✅ Final Checklist

- [ ] Backend server running (port 5001)
- [ ] Frontend server running (port 3000)
- [ ] MySQL database running
- [ ] All 147 products have images
- [ ] Can upload new image via API
- [ ] Can create product with image
- [ ] Can update variant image
- [ ] ImageUpload component works
- [ ] Drag & drop works
- [ ] File validation works
- [ ] Preview shows correctly
- [ ] Images accessible via browser

---

## 🎉 Success Criteria

✅ All 147 existing products have images  
✅ Can upload new images via API  
✅ Can create products with images  
✅ Can update existing product images  
✅ Frontend component works perfectly  
✅ All validation works  
✅ No errors in console  

---

**If all tests pass, you're ready to go! 🚀**
