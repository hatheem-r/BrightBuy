# 🔌 Image Upload API - Quick Reference

## 📡 Available Endpoints

### 1. Upload Image File
```http
POST http://localhost:5001/api/products/upload-image
Content-Type: multipart/form-data
```

**Request:**
- Field name: `image`
- File types: JPEG, JPG, PNG, GIF, WebP
- Max size: 5MB

**Response:**
```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "/images/products/1729445678-987654321.jpg",
  "filename": "1729445678-987654321.jpg"
}
```

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('image', file);

const response = await fetch('http://localhost:5001/api/products/upload-image', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.imageUrl); // "/images/products/..."
```

---

### 2. Create Product with Variants & Images
```http
POST http://localhost:5001/api/products
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "iPhone 15 Pro",
  "brand": "Apple",
  "description": "Latest iPhone model",
  "category_id": 1,
  "variants": [
    {
      "sku": "IPHONE15-256-BLK",
      "price": 999.99,
      "size": "256GB",
      "color": "Black",
      "description": "256GB Black variant",
      "image_url": "/images/products/iphone15-black.jpg",
      "is_default": true
    },
    {
      "sku": "IPHONE15-512-BLK",
      "price": 1199.99,
      "size": "512GB",
      "color": "Black",
      "description": "512GB Black variant",
      "image_url": "/images/products/iphone15-black-512.jpg",
      "is_default": false
    }
  ]
}
```

**Response:**
```json
{
  "message": "Product created successfully",
  "productId": 43
}
```

**Example (JavaScript):**
```javascript
const productData = {
  name: "New Product",
  brand: "Brand Name",
  variants: [{
    sku: "SKU-001",
    price: 99.99,
    image_url: "/images/products/uploaded-image.jpg"
  }]
};

const response = await fetch('http://localhost:5001/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData)
});

const data = await response.json();
console.log(data.productId); // 43
```

---

### 3. Update Variant Image
```http
PUT http://localhost:5001/api/products/variants/{variantId}/image
Content-Type: application/json
```

**Request Body:**
```json
{
  "image_url": "/images/products/new-image.jpg"
}
```

**Response:**
```json
{
  "message": "Image updated successfully"
}
```

**Example (JavaScript):**
```javascript
const variantId = 147;
const newImageUrl = "/images/products/new-image.jpg";

const response = await fetch(`http://localhost:5001/api/products/variants/${variantId}/image`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ image_url: newImageUrl })
});

const data = await response.json();
console.log(data.message); // "Image updated successfully"
```

---

## 🔄 Complete Workflow

### Option 1: Upload Then Create
```javascript
// Step 1: Upload image
const formData = new FormData();
formData.append('image', file);

const uploadRes = await fetch('http://localhost:5001/api/products/upload-image', {
  method: 'POST',
  body: formData
});

const { imageUrl } = await uploadRes.json();

// Step 2: Create product with uploaded image
const productRes = await fetch('http://localhost:5001/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Product Name",
    brand: "Brand",
    variants: [{
      sku: "SKU-001",
      price: 99.99,
      image_url: imageUrl  // Use uploaded image
    }]
  })
});
```

### Option 2: Use CDN URL Directly
```javascript
// Skip upload, use existing CDN URL
const productRes = await fetch('http://localhost:5001/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Product Name",
    brand: "Brand",
    variants: [{
      sku: "SKU-001",
      price: 99.99,
      image_url: "https://images.unsplash.com/photo-xxx?w=800&q=80"
    }]
  })
});
```

---

## 🎨 Using the ImageUpload Component

### Basic Usage
```jsx
import ImageUpload from '@/components/ImageUpload';

function MyForm() {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <>
      <ImageUpload onImageUploaded={(url) => setImageUrl(url)} />
      {imageUrl && <p>Image uploaded: {imageUrl}</p>}
    </>
  );
}
```

### With Existing Image
```jsx
<ImageUpload
  currentImage="/images/products/existing-image.jpg"
  onImageUploaded={(url) => console.log('New image:', url)}
/>
```

### In Product Form
```jsx
function AddProductForm() {
  const [variants, setVariants] = useState([{
    sku: '',
    price: '',
    image_url: ''
  }]);

  const handleImageUpload = (index, imageUrl) => {
    setVariants(prev => prev.map((v, i) => 
      i === index ? { ...v, image_url: imageUrl } : v
    ));
  };

  return (
    <>
      {variants.map((variant, index) => (
        <div key={index}>
          <input
            value={variant.sku}
            onChange={(e) => {/* update sku */}}
          />
          <input
            value={variant.price}
            onChange={(e) => {/* update price */}}
          />
          <ImageUpload
            currentImage={variant.image_url}
            onImageUploaded={(url) => handleImageUpload(index, url)}
          />
        </div>
      ))}
    </>
  );
}
```

---

## 🧪 Test with curl (PowerShell)

### Upload Image
```powershell
curl -X POST http://localhost:5001/api/products/upload-image `
  -F "image=@C:\path\to\image.jpg"
```

### Create Product
```powershell
$body = @{
    name = "Test Product"
    brand = "Test Brand"
    variants = @(
        @{
            sku = "TEST-001"
            price = 99.99
            image_url = "/images/products/test.jpg"
        }
    )
} | ConvertTo-Json -Depth 3

curl -X POST http://localhost:5001/api/products `
  -H "Content-Type: application/json" `
  -d $body
```

### Update Image
```powershell
$body = @{
    image_url = "/images/products/new-image.jpg"
} | ConvertTo-Json

curl -X PUT http://localhost:5001/api/products/variants/147/image `
  -H "Content-Type: application/json" `
  -d $body
```

---

## 📋 Field Reference

### Product Fields
| Field | Type | Required | Example |
|-------|------|----------|---------|
| name | string | ✅ Yes | "iPhone 15 Pro" |
| brand | string | ✅ Yes | "Apple" |
| description | string | ❌ No | "Latest model" |
| category_id | number | ❌ No | 1 |

### Variant Fields
| Field | Type | Required | Example |
|-------|------|----------|---------|
| sku | string | ✅ Yes | "IPHONE15-256-BLK" |
| price | number | ✅ Yes | 999.99 |
| size | string | ❌ No | "256GB" |
| color | string | ❌ No | "Black" |
| description | string | ❌ No | "256GB variant" |
| image_url | string | ❌ No | "/images/products/..." |
| is_default | boolean | ❌ No | true |

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "message": "No file uploaded"
}
```
**Cause:** No image file provided in upload request

### 400 Bad Request
```json
{
  "message": "Name and brand are required"
}
```
**Cause:** Missing required product fields

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error details..."
}
```
**Cause:** Database or server issue

---

## ✅ Validation Rules

### Image Upload
- ✅ File types: JPEG, JPG, PNG, GIF, WebP
- ✅ Max size: 5MB
- ✅ Required: File must be provided
- ❌ Rejected: PDFs, videos, audio, documents

### Product Creation
- ✅ Required: name, brand
- ✅ Optional: description, category_id
- ✅ Variants: At least one variant recommended
- ✅ SKU: Must be unique

---

## 🚀 Quick Start

1. **Start backend:** `cd backend && npm start`
2. **Start frontend:** `cd frontend && npm run dev`
3. **Test upload:** Upload image via component
4. **Create product:** Use the API or form
5. **View images:** All products have images!

---

## 📚 More Info

- **Full Guide:** See `PRODUCT_IMAGES_COMPLETE.md`
- **Testing:** See `TESTING_GUIDE.md`
- **Example:** See `frontend/src/pages/AddProductExample.jsx`

---

**Everything is ready! Start uploading images! 🎉**
