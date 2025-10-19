# BrightBuy Backend API Documentation

## Base URL
```
http://localhost:5001/api
```

## Endpoints

### Products API

#### 1. Get All Products
- **Endpoint:** `GET /api/products`
- **Description:** Fetches all products with their default variants and categories
- **Response:**
```json
[
  {
    "product_id": 1,
    "name": "Galaxy S24 Ultra",
    "brand": "Samsung",
    "variant_id": 1,
    "price": "1199.99",
    "sku": "SAM-S24U-256-BLK",
    "size": "256GB",
    "color": "Titanium Black",
    "description": "Galaxy S24 Ultra 256GB Titanium Black",
    "categories": "Mobile Devices,Smartphones",
    "category_ids": "3,11"
  }
]
```

#### 2. Get Product by ID
- **Endpoint:** `GET /api/products/:id`
- **Description:** Fetches a single product with all its variants and categories
- **Response:**
```json
{
  "product_id": 1,
  "name": "Galaxy S24 Ultra",
  "brand": "Samsung",
  "created_at": "2025-10-14T...",
  "updated_at": "2025-10-14T...",
  "variants": [
    {
      "variant_id": 1,
      "product_id": 1,
      "sku": "SAM-S24U-256-BLK",
      "price": "1199.99",
      "size": "256GB",
      "color": "Titanium Black",
      "description": "Galaxy S24 Ultra 256GB Titanium Black",
      "is_default": 1
    }
  ],
  "categories": [
    {
      "category_id": 3,
      "name": "Mobile Devices",
      "parent_id": null
    }
  ]
}
```

#### 3. Get Products by Category
- **Endpoint:** `GET /api/products/category/:categoryId`
- **Description:** Fetches all products in a specific category
- **Example:** `GET /api/products/category/3`

#### 4. Search Products
- **Endpoint:** `GET /api/products/search?q=searchTerm`
- **Description:** Searches products by name or brand
- **Example:** `GET /api/products/search?q=Samsung`

---

### Categories API

#### 1. Get All Categories
- **Endpoint:** `GET /api/categories`
- **Description:** Fetches all categories
- **Response:**
```json
[
  {
    "category_id": 1,
    "name": "Electronics",
    "parent_id": null
  },
  {
    "category_id": 11,
    "name": "Smartphones",
    "parent_id": 3
  }
]
```

#### 2. Get Category by ID
- **Endpoint:** `GET /api/categories/:id`
- **Description:** Fetches a single category

#### 3. Get Main Categories
- **Endpoint:** `GET /api/categories/main`
- **Description:** Fetches top-level categories (no parent)

#### 4. Get Subcategories
- **Endpoint:** `GET /api/categories/:id/subcategories`
- **Description:** Fetches subcategories of a parent category

#### 5. Get Category Hierarchy
- **Endpoint:** `GET /api/categories/hierarchy`
- **Description:** Fetches all categories with product counts
- **Response:**
```json
[
  {
    "category_id": 1,
    "name": "Electronics",
    "parent_id": null,
    "product_count": 15
  }
]
```

---

### Variants API

#### 1. Get All Variants
- **Endpoint:** `GET /api/variants`
- **Description:** Fetches all product variants with inventory status
- **Response:**
```json
[
  {
    "variant_id": 1,
    "product_id": 1,
    "sku": "SAM-S24U-256-BLK",
    "price": "1199.99",
    "size": "256GB",
    "color": "Titanium Black",
    "description": "Galaxy S24 Ultra 256GB Titanium Black",
    "is_default": 1,
    "stock_quantity": 45,
    "product_name": "Galaxy S24 Ultra",
    "brand": "Samsung",
    "stock_status": "In Stock"
  }
]
```

#### 2. Get Variant by ID
- **Endpoint:** `GET /api/variants/:id`
- **Description:** Fetches a single variant with inventory info

#### 3. Get Variants by Product ID
- **Endpoint:** `GET /api/variants/product/:productId`
- **Description:** Fetches all variants for a specific product
- **Example:** `GET /api/variants/product/1`

#### 4. Check Variant Availability
- **Endpoint:** `POST /api/variants/:id/check-availability`
- **Description:** Checks if requested quantity is available
- **Request Body:**
```json
{
  "quantity": 2
}
```
- **Response:**
```json
{
  "available_quantity": 45,
  "price": "1199.99",
  "is_available": true
}
```

---

## Database Schema

### Key Tables

1. **Product**
   - product_id (PK)
   - name
   - brand
   - created_at
   - updated_at

2. **ProductVariant**
   - variant_id (PK)
   - product_id (FK)
   - sku (unique)
   - price
   - size
   - color
   - description
   - is_default

3. **Category**
   - category_id (PK)
   - name
   - parent_id (FK to self)

4. **ProductCategory** (many-to-many)
   - product_id (FK)
   - category_id (FK)

5. **Inventory**
   - variant_id (PK, FK)
   - quantity

---

## Frontend Integration

### Using the API Service

```javascript
import { productsAPI, categoriesAPI, variantsAPI } from '@/services/api';

// Example: Fetch all products
const products = await productsAPI.getAllProducts();

// Example: Fetch product by ID
const product = await productsAPI.getProductById(1);

// Example: Search products
const results = await productsAPI.searchProducts('Samsung');

// Example: Fetch categories
const categories = await categoriesAPI.getAllCategories();

// Example: Check variant availability
const availability = await variantsAPI.checkAvailability(1, 2);
```

---

## Testing with curl

```bash
# Get all products
curl http://localhost:5001/api/products

# Get product by ID
curl http://localhost:5001/api/products/1

# Search products
curl "http://localhost:5001/api/products/search?q=Samsung"

# Get all categories
curl http://localhost:5001/api/categories

# Get variants for product
curl http://localhost:5001/api/variants/product/1

# Check availability
curl -X POST http://localhost:5001/api/variants/1/check-availability \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'
```

---

## Error Responses

All endpoints return appropriate HTTP status codes:

- **200 OK:** Success
- **400 Bad Request:** Invalid parameters
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server error

Error response format:
```json
{
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```
