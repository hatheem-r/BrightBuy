# Cart API Quick Reference

## 🛒 Cart Endpoints

All endpoints are under `/api/cart`

### 1. Get Cart Details
```http
GET /api/cart/:customerId
GET /api/cart?customer_id=:customerId
```

**Response:**
```json
{
  "customer_id": "1",
  "summary": {
    "customer_id": 1,
    "total_items": 2,
    "total_quantity": "7",
    "subtotal": "119.93",
    "out_of_stock_items": "0"
  },
  "items": [...]
}
```

### 2. Get Cart Summary
```http
GET /api/cart/:customerId/summary
```

**Response:**
```json
{
  "customer_id": 1,
  "total_items": 2,
  "total_quantity": "7",
  "subtotal": "119.93",
  "out_of_stock_items": "0"
}
```

### 3. Get Cart Item Count
```http
GET /api/cart/:customerId/count
```

**Response:**
```json
{
  "total_items": 2,
  "total_quantity": "7"
}
```

### 4. Add Item to Cart
```http
POST /api/cart/items
POST /api/cart/:customerId/items
```

**Request Body:**
```json
{
  "customer_id": 1,     // Required if not in URL
  "variant_id": 140,    // Required
  "quantity": 2         // Required
}
```

**Response:**
```json
{
  "message": "Item added to cart successfully",
  "customer_id": 1,
  "summary": {...},
  "items": [...]
}
```

### 5. Update Cart Item Quantity
```http
PUT /api/cart/:customerId/items/:variantId
```

**Request Body:**
```json
{
  "quantity": 3  // Required, must be > 0
}
```

**Response:**
```json
{
  "message": "Cart item updated successfully",
  "summary": {...},
  "items": [...]
}
```

### 6. Remove Item from Cart
```http
DELETE /api/cart/:customerId/items/:variantId
```

**Response:**
```json
{
  "message": "Item removed from cart successfully",
  "summary": {...},
  "items": [...]
}
```

### 7. Clear Cart
```http
DELETE /api/cart/:customerId
```

**Response:**
```json
{
  "message": "Cart cleared successfully",
  "customer_id": "1"
}
```

## 🧪 Testing Examples

### PowerShell

```powershell
# Get cart
Invoke-WebRequest -Uri "http://localhost:5001/api/cart/1"

# Add to cart
$body = @{ customer_id = 1; variant_id = 140; quantity = 2 } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:5001/api/cart/items" -Method POST -Body $body -ContentType "application/json"

# Update quantity
$body = @{ quantity = 3 } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:5001/api/cart/1/items/140" -Method PUT -Body $body -ContentType "application/json"

# Remove item
Invoke-WebRequest -Uri "http://localhost:5001/api/cart/1/items/140" -Method DELETE

# Clear cart
Invoke-WebRequest -Uri "http://localhost:5001/api/cart/1" -Method DELETE
```

### JavaScript (Frontend)

```javascript
// Get cart
const response = await fetch(`/api/cart/${customerId}`);
const data = await response.json();

// Add to cart
const response = await fetch('/api/cart/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customer_id: customerId,
    variant_id: variantId,
    quantity: quantity
  })
});

// Update quantity
const response = await fetch(`/api/cart/${customerId}/items/${variantId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ quantity: newQuantity })
});

// Remove item
const response = await fetch(`/api/cart/${customerId}/items/${variantId}`, {
  method: 'DELETE'
});

// Get cart count
const response = await fetch(`/api/cart/${customerId}/count`);
const { total_items, total_quantity } = await response.json();
```

## 📊 Database Procedures

Direct database procedures (used by the model):

```sql
-- Add item
CALL AddToCart(customer_id, variant_id, quantity);

-- Get cart items
CALL GetCustomerCart(customer_id);

-- Get summary
CALL GetCustomerCartSummary(customer_id);

-- Update quantity
CALL UpdateCartItemQuantity(customer_id, variant_id, new_quantity);

-- Remove item
CALL RemoveFromCart(customer_id, variant_id);

-- Clear cart
CALL ClearCustomerCart(customer_id);

-- Get count
CALL GetCustomerCartCount(customer_id);
```

## ⚠️ Important Notes

1. **customer_id is required** for all operations
2. **quantity must be > 0** when adding/updating
3. Items are **automatically merged** if same variant is added twice
4. Cart items have **UNIQUE constraint** on (customer_id, variant_id)
5. Deleting a customer will **CASCADE delete** their cart items
6. Stock validation happens at **checkout**, not at cart add

## 🔍 Error Handling

### Common Errors

**401 - Customer ID Required**
```json
{
  "message": "Customer ID is required. Please login first."
}
```

**400 - Invalid Quantity**
```json
{
  "message": "Quantity must be at least 1"
}
```

**404 - Item Not Found**
```json
{
  "message": "Item not found in cart"
}
```

**500 - Server Error**
```json
{
  "message": "Server error",
  "error": "Error details..."
}
```

---

**Last Updated:** October 18, 2025  
**Status:** ✅ All endpoints tested and working
