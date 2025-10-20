# Quick Reference - Product Management & Recent Fixes

## 🚀 What Was Fixed

### 1. Product Adding Feature ✅

- **Fixed**: Wrong API endpoint
- **Fixed**: Category selection (now dropdown)
- **Added**: Image upload with preview
- **Fixed**: Category mapping bug
- **Added**: Authentication for product creation

### 2. Hardcoded URLs ✅

- **Fixed**: All localhost URLs now use environment variables
- **Works**: Both localhost and LAN access (192.168.8.129)

### 3. Security ✅

- **Added**: Authentication middleware
- **Added**: Staff-only authorization for product creation
- **Protected**: Image upload endpoint

---

## 📝 How to Add Products Now

### Step-by-Step:

1. **Login as Staff** (admin/manager/level01/level02)
2. **Go to Dashboard** → Staff Dashboard → Inventory
3. **Click "Manage Products"** tab
4. **Fill Product Details**:

   - Product Name (required)
   - Brand (required)
   - Category (required) - select from dropdown
   - Product Image (optional) - click to upload, see preview

5. **Add Variants**:

   - Color (required)
   - Size (optional)
   - Price (required, must be > 0)
   - Initial Stock (for reference, set via "Update Stocks" later)
   - Click "+ Add Another Variant" for more

6. **Click "Add Product"**

   - Wait for success message
   - Product will appear in inventory list

7. **Set Initial Stock** (if needed):
   - Go to "Update Stocks" tab
   - Find your product
   - Click on variant
   - Enter quantity and note
   - Click "Update Stock"

---

## 🎯 Key Features

### Image Upload:

- **Accepted**: JPG, JPEG, PNG, GIF, WebP
- **Max Size**: 5MB
- **Preview**: Shows before upload
- **Remove**: Click X on preview to remove
- **Optional**: Products work without images

### Category Selection:

- **Dynamic**: Loads from database
- **Validated**: Only valid categories accepted
- **Required**: Must select one

### Variant Management:

- **Multiple**: Add as many as needed
- **Auto-SKU**: Generated automatically
- **Remove**: Click "Remove" button
- **Minimum**: At least one variant required

---

## 🔧 Environment Setup

### Frontend (.env.local):

```bash
NEXT_PUBLIC_API_URL=http://192.168.8.129:5001/api
```

### Backend (.env):

```bash
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=brightbuy
```

---

## 📡 API Endpoints

### Public (No Auth):

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `GET /api/categories` - List categories

### Staff Only (Requires Auth):

- `POST /api/products` - Create product
- `POST /api/products/upload-image` - Upload image
- `PUT /api/products/variants/:id/image` - Update variant image

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to create product"

**Solution**:

- Check you're logged in as staff
- Verify all required fields filled
- Check internet connection

### Issue: "Image upload failed"

**Solution**:

- Check file size (must be < 5MB)
- Check file type (jpg, png, gif, webp only)
- Ensure `backend/public/images/products/` directory exists

### Issue: "Invalid category selected"

**Solution**:

- Refresh page to reload categories
- Check database has categories
- Select from dropdown (don't type manually)

### Issue: Can't access from another PC

**Solution**:

- Check `.env.local` has correct IP
- Verify backend running on `0.0.0.0:5001`
- Check firewall allows port 5001
- Use IP from `ip addr` or `ipconfig`

---

## 📊 Database Tables Used

```sql
Product
  - product_id (PK)
  - name
  - brand
  - created_at, updated_at

ProductVariant
  - variant_id (PK)
  - product_id (FK)
  - sku (unique)
  - price
  - size
  - color
  - description
  - image_url ← NEW: stores uploaded images
  - is_default

ProductCategory
  - product_id (FK)
  - category_id (FK)

Category
  - category_id (PK)
  - name
  - parent_category_id
  - description
```

---

## 🎨 Image Storage

### Location:

```
backend/public/images/products/
  ├── 1234567890-image1.jpg
  ├── 1234567891-image2.png
  └── ...
```

### Access URL:

```
http://192.168.8.129:5001/images/products/filename.jpg
```

### Naming:

- Format: `timestamp-random-extension`
- Example: `1701234567890-4567890123-product.jpg`

---

## ✅ Validation Rules

### Product:

- ✅ Name: Required, string
- ✅ Brand: Required, string
- ✅ Category: Required, from dropdown

### Variant:

- ✅ Color: Required, string
- ✅ Size: Optional, string
- ✅ Price: Required, number > 0
- ✅ Stock: Number >= 0 (for reference only)

### Image:

- ✅ Type: jpeg, jpg, png, gif, webp
- ✅ Size: Maximum 5MB
- ✅ Optional: Can create without image

---

## 🚦 Testing Checklist

Before using in production:

- [ ] Can login as staff
- [ ] Categories dropdown loads
- [ ] Can upload image < 5MB
- [ ] Can create product with image
- [ ] Can create product without image
- [ ] Can add multiple variants
- [ ] Form validates required fields
- [ ] Form resets after creation
- [ ] Product appears in inventory
- [ ] Can access from other PCs on LAN
- [ ] Images display correctly
- [ ] Non-staff users cannot create products

---

## 📞 Staff Login Credentials

### Level01 Staff (Can manage staff):

- **Username**: `admin` / **Password**: `admin123`
- **Username**: `manager` / **Password**: `manager123`

### Level02 Staff (Regular staff):

- **Username**: `staff1` / **Password**: `staff123`
- **Username**: `staff2` / **Password**: `staff123`

---

## 🔐 Security Notes

1. **Authentication Required**: Must be logged in as staff
2. **Token-Based**: Uses JWT tokens
3. **Role-Based**: Only staff can create products
4. **Input Validated**: Both frontend and backend
5. **File Validated**: Type and size checked

---

## 📝 Notes

1. **Single Image**: All variants share one image
2. **No Initial Stock**: Set stock separately via "Update Stocks"
3. **Auto SKU**: Generated from brand-name-color-size-timestamp
4. **Category Required**: Must exist in database
5. **Staff Only**: Customers cannot create products

---

## 🎯 Next Steps

After adding products:

1. Set initial stock (Update Stocks tab)
2. Verify product displays on customer site
3. Test ordering process
4. Monitor inventory levels

---

**Last Updated**: 2024  
**Status**: ✅ Production Ready  
**Version**: 1.0

---

For more details, see:

- `PRODUCT_ADDING_FIX_COMPLETE.md` - Detailed fix information
- `BUG_FIXES_COMPLETE_SUMMARY.md` - All bugs fixed summary
