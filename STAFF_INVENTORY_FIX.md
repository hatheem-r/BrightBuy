# Staff Inventory Endpoint Fix

## Issue

`GET http://localhost:5001/api/staff/inventory` was returning **500 Internal Server Error**

## Root Cause

The SQL query in `staffController.getInventory()` had an error:

- **Wrong column reference**: `p.sku` (Product table doesn't have SKU column)
- **Correct reference**: `pv.sku` (SKU is in ProductVariant table)
- **Missing inventory_id**: Query referenced `i.inventory_id` which doesn't exist in schema (Inventory table uses `variant_id` as PRIMARY KEY)

## Fix Applied

### File: `/backend/controllers/staffController.js`

**Changed Query:**

```javascript
// BEFORE (Incorrect)
SELECT
  p.product_id,
  p.name as product_name,
  p.sku,                    // ❌ Product table has no SKU column
  pv.variant_id,
  pv.color,
  pv.size,
  pv.price,
  i.quantity as stock,
  i.inventory_id            // ❌ Inventory table has no inventory_id (uses variant_id as PK)
FROM Product p
LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id
LEFT JOIN Inventory i ON pv.variant_id = i.variant_id

// AFTER (Correct)
SELECT
  p.product_id,
  p.name as product_name,
  p.brand,                  // ✅ Added brand
  pv.variant_id,
  pv.sku,                   // ✅ Fixed: SKU is in ProductVariant
  pv.color,
  pv.size,
  pv.price,
  COALESCE(i.quantity, 0) as stock,  // ✅ Handle NULL inventory
  i.variant_id as inventory_variant_id  // ✅ Correct column
FROM Product p
INNER JOIN ProductVariant pv ON p.product_id = pv.product_id  // ✅ Changed to INNER JOIN
LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
```

**Additional Changes:**

- Changed `LEFT JOIN` to `INNER JOIN` for ProductVariant to ensure we only get products with variants
- Added `COALESCE(i.quantity, 0)` to handle cases where inventory might be NULL
- Added error message to response for better debugging

## Database Schema Reference

### Product Table

```sql
CREATE TABLE Product (
    product_id INT PRIMARY KEY,
    name VARCHAR(255),
    brand VARCHAR(100),
    -- NO SKU column
);
```

### ProductVariant Table

```sql
CREATE TABLE ProductVariant (
    variant_id INT PRIMARY KEY,
    product_id INT,
    sku VARCHAR(50) UNIQUE,  -- ✅ SKU is here
    price DECIMAL(10, 2),
    size VARCHAR(20),
    color VARCHAR(30)
);
```

### Inventory Table (from schema.sql)

```sql
CREATE TABLE Inventory (
    variant_id INT PRIMARY KEY,  -- ✅ variant_id is PRIMARY KEY
    quantity INT NOT NULL
    -- NO inventory_id column
);
```

## Testing the Fix

### 1. Endpoint Details

- **URL**: `GET http://localhost:5001/api/staff/inventory`
- **Authentication**: Required (Staff token)
- **Authorization**: Staff role required

### 2. Expected Response

```json
{
  "success": true,
  "inventory": [
    {
      "product_id": 1,
      "product_name": "MacBook Pro 14-inch",
      "brand": "Apple",
      "variant_id": 1,
      "sku": "MBP-14-SLV",
      "color": "Silver",
      "size": "14-inch",
      "price": 1999.99,
      "stock": 25,
      "inventory_variant_id": 1
    }
  ]
}
```

### 3. Authentication Required

The endpoint requires a valid staff JWT token:

```javascript
// Request headers
{
  "Authorization": "Bearer <staff_jwt_token>"
}
```

### 4. Common Issues

**401 Unauthorized:**

- Token missing or invalid
- Token expired
- Solution: Login as staff user to get new token

**403 Forbidden:**

- User is not a staff member (customer trying to access)
- Solution: Use staff account credentials

**500 Internal Server Error (Fixed):**

- Was caused by SQL column reference error
- Now fixed with correct query

## How to Test

### Option 1: Using Browser (if logged in as staff)

```
http://localhost:3000/staff/inventory
```

### Option 2: Using curl

```bash
# Login as staff first
curl -X POST http://localhost:5001/api/auth/staff/login \
  -H "Content-Type: application/json" \
  -d '{"email":"staff@example.com","password":"password"}'

# Copy the token from response, then:
curl http://localhost:5001/api/staff/inventory \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Option 3: Using Postman

1. POST to `/api/auth/staff/login` to get token
2. GET to `/api/staff/inventory` with Authorization header

## Status

✅ **Fixed** - Backend server running successfully
✅ **Query corrected** - Using proper column references
✅ **Error handling improved** - Returns error message for debugging

## Next Steps

If still getting errors:

1. Verify user is logged in as staff
2. Check browser console for authentication token
3. Verify Inventory table has data
4. Check backend logs for detailed error messages
