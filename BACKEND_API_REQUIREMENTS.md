# 🔧 Backend API Requirements for Inventory Features

## 📋 Overview

The new inventory management system requires **4 new API endpoints** to support:
1. Adding product variants
2. Removing product variants
3. Adding complete products
4. Removing complete products

---

## 🛠️ Required API Endpoints

### 1. **Add Product Variant**

```javascript
POST /api/staff/product-variants
```

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "product_id": 123,
  "color": "Black",
  "size": "M",
  "price": 2999.99,
  "stock": 50
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Variant added successfully!",
  "variant": {
    "variant_id": 456,
    "product_id": 123,
    "sku": "PRD123-BLK-M",
    "color": "Black",
    "size": "M",
    "price": 2999.99,
    "stock": 50
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

**Implementation Notes:**
- Generate unique SKU automatically
- Validate product_id exists
- Validate price > 0
- Validate stock >= 0
- Check for duplicate variants (same color + size for product)

---

### 2. **Remove Product Variant**

```javascript
DELETE /api/staff/product-variants/:variant_id
```

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**URL Parameters:**
```
variant_id: integer (required)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Variant removed successfully!"
}
```

**Error Response (404/500):**
```json
{
  "success": false,
  "message": "Variant not found" or "Error message"
}
```

**Implementation Notes:**
- Check if variant exists before deleting
- Consider cascade delete or prevent if variant has orders
- Optionally: Soft delete (set deleted_at timestamp)

---

### 3. **Add Complete Product**

```javascript
POST /api/staff/products
```

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Men's Sports T-Shirt",
  "brand": "Nike",
  "category": "Sportswear",
  "variants": [
    {
      "color": "Black",
      "size": "M",
      "price": 2999.99,
      "stock": 50
    },
    {
      "color": "Black",
      "size": "L",
      "price": 2999.99,
      "stock": 30
    },
    {
      "color": "White",
      "size": "M",
      "price": 2499.99,
      "stock": 40
    }
  ]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Product added successfully with 3 variants!",
  "product": {
    "product_id": 789,
    "name": "Men's Sports T-Shirt",
    "brand": "Nike",
    "category": "Sportswear",
    "variants": [
      {
        "variant_id": 1001,
        "sku": "PRD789-BLK-M",
        "color": "Black",
        "size": "M",
        "price": 2999.99,
        "stock": 50
      },
      // ... other variants
    ]
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

**Implementation Notes:**
- Transaction: Create product first, then all variants
- Rollback if any variant fails
- Validate at least one variant provided
- Auto-generate SKUs for all variants
- Validate category exists (if using category table)
- Check for duplicate product names (optional warning)

---

### 4. **Remove Complete Product**

```javascript
DELETE /api/staff/products/:product_id
```

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**URL Parameters:**
```
product_id: integer (required)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product and all its variants removed successfully!"
}
```

**Error Response (404/500):**
```json
{
  "success": false,
  "message": "Product not found" or "Cannot delete product with existing orders"
}
```

**Implementation Notes:**
- Check if product exists
- Consider cascade delete for all variants
- Check if product has existing orders
- Optionally: Prevent deletion if orders exist, or soft delete
- Transaction: Delete all variants first, then product

---

## 📊 Database Schema Requirements

### ProductVariants Table
```sql
CREATE TABLE ProductVariants (
  variant_id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  sku VARCHAR(50) UNIQUE NOT NULL,
  color VARCHAR(50) NOT NULL,
  size VARCHAR(20) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
  UNIQUE KEY unique_variant (product_id, color, size)
);
```

### Products Table
```sql
CREATE TABLE Products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔐 Authorization Middleware

All endpoints should use:
```javascript
authenticate, authorizeStaff
```

**This allows both Level01 and Level02 staff** to manage inventory.

---

## 📁 File Structure

### Backend Files to Create/Update:

```
backend/
├── controllers/
│   └── inventoryController.js      (Add 4 new functions)
├── routes/
│   └── staff.js                    (Add 4 new routes)
└── middleware/
    └── authMiddleware.js           (Already exists)
```

---

## 🎯 Controller Functions to Implement

```javascript
// backend/controllers/inventoryController.js

// 1. Add Variant
exports.addProductVariant = async (req, res) => {
  // Extract: product_id, color, size, price, stock
  // Validate inputs
  // Generate SKU
  // Insert into database
  // Return success
};

// 2. Remove Variant
exports.removeProductVariant = async (req, res) => {
  // Extract: variant_id from params
  // Check if exists
  // Delete from database
  // Return success
};

// 3. Add Product
exports.addProduct = async (req, res) => {
  // Extract: name, brand, category, variants[]
  // Validate inputs
  // Start transaction
  // Insert product
  // Insert all variants with generated SKUs
  // Commit transaction
  // Return success
};

// 4. Remove Product
exports.removeProduct = async (req, res) => {
  // Extract: product_id from params
  // Check if exists
  // Check for existing orders (optional)
  // Delete product (cascade delete variants)
  // Return success
};
```

---

## 🛣️ Routes to Add

```javascript
// backend/routes/staff.js

const { authenticate, authorizeStaff } = require('../middleware/authMiddleware');
const inventoryController = require('../controllers/inventoryController');

// Add Variant
router.post('/product-variants', 
  authenticate, 
  authorizeStaff, 
  inventoryController.addProductVariant
);

// Remove Variant
router.delete('/product-variants/:variant_id', 
  authenticate, 
  authorizeStaff, 
  inventoryController.removeProductVariant
);

// Add Product
router.post('/products', 
  authenticate, 
  authorizeStaff, 
  inventoryController.addProduct
);

// Remove Product
router.delete('/products/:product_id', 
  authenticate, 
  authorizeStaff, 
  inventoryController.removeProduct
);
```

---

## ✅ Testing Checklist

### Manual Testing:

**Add Variant:**
- [ ] Add variant to existing product
- [ ] Try duplicate variant (same color+size)
- [ ] Try invalid product_id
- [ ] Try negative price
- [ ] Try negative stock

**Remove Variant:**
- [ ] Remove existing variant
- [ ] Try remove non-existent variant
- [ ] Check if removed from database

**Add Product:**
- [ ] Add product with 1 variant
- [ ] Add product with multiple variants
- [ ] Try without variants
- [ ] Try with invalid data
- [ ] Check SKU generation

**Remove Product:**
- [ ] Remove product with variants
- [ ] Try remove non-existent product
- [ ] Check cascade delete of variants
- [ ] Check if has orders (optional)

---

## 🚀 Quick Implementation Guide

### Step 1: Create Controller
```bash
cd backend/controllers
# Create inventoryController.js with 4 functions
```

### Step 2: Add Routes
```bash
cd backend/routes
# Update staff.js with 4 new routes
```

### Step 3: Test Endpoints
```bash
# Start server
cd backend
node server.js

# Use Postman or Thunder Client to test:
# 1. POST /api/staff/product-variants
# 2. DELETE /api/staff/product-variants/123
# 3. POST /api/staff/products
# 4. DELETE /api/staff/products/456
```

### Step 4: Verify Frontend
```bash
cd frontend
npm run dev

# Login as staff
# Navigate to /staff/inventory
# Test all 4 sections
```

---

## 📌 Priority

**HIGH PRIORITY** 🔴

The frontend is ready and waiting for these endpoints!

---

## 💡 Optional Enhancements

1. **Image Upload** - Add image field for products
2. **Category Management** - CRUD for categories
3. **Bulk Operations** - Add/update multiple variants at once
4. **Import/Export** - CSV/XLSX import for products
5. **Audit Log** - Track who added/removed what
6. **Product History** - Track price changes over time

---

**Status:** 📝 DOCUMENTATION READY  
**Next Action:** Implement backend API endpoints  
**Estimated Time:** 2-3 hours for all 4 endpoints
