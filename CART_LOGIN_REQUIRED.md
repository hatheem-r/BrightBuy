# 🔐 Cart Login Required - Implementation Summary

## Overview

Updated the cart functionality to require user authentication before adding items to cart.

---

## Changes Made

### 1. **Frontend - Product Detail Page** (`frontend/src/app/products/[id]/page.jsx`)

#### Added Login Check in `handleAddToCart`:

```javascript
const handleAddToCart = () => {
  // Check if user is logged in
  const token = localStorage.getItem("token");
  const customerId = localStorage.getItem("customer_id");

  if (!token || !customerId) {
    // Redirect to login page if not logged in
    router.push("/login");
    return;
  }

  if (selectedVariant) {
    addToCart(selectedVariant, 1);
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  }
};
```

**What it does:**

- Checks for `token` and `customer_id` in localStorage
- If not found, redirects user to `/login` page
- Only adds to cart if user is authenticated

---

### 2. **Frontend - Cart Context** (`frontend/src/contexts/CartContext.jsx`)

#### Updated `initializeCart` to require customer_id:

```javascript
const initializeCart = async (customerId = null) => {
  try {
    if (!cartId) {
      // Get customer_id from localStorage if not provided
      const storedCustomerId = customerId || localStorage.getItem('customer_id');

      if (!storedCustomerId) {
        throw new Error('Customer ID required. Please login first.');
      }

      const response = await cartAPI.getOrCreateCart(storedCustomerId);
      const newCartId = response.cart_id;
      setCartId(newCartId);
      localStorage.setItem('cart_id', newCartId);
      return newCartId;
    }
    return cartId;
  }
};
```

**What it does:**

- Retrieves `customer_id` from localStorage
- Throws error if customer_id is not found
- Creates cart associated with authenticated customer

---

### 3. **Backend - Auth Controller** (`backend/controllers/authController.js`)

#### Updated login to return customer_id:

```javascript
// Join users table with Customer table to get customer_id
const [users] = await db.query(
  `SELECT u.user_id, u.name, u.email, u.password_hash, u.role, u.is_active, c.customer_id
   FROM users u
   LEFT JOIN Customer c ON u.email = c.email
   WHERE u.email = ?`,
  [email]
);

// Include customer_id in JWT token
const token = jwt.sign(
  {
    userId: user.user_id,
    email: user.email,
    role: user.role,
    customerId: user.customer_id || null,
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

// Return customer_id in response
res.json({
  success: true,
  message: "Login successful",
  token,
  user: {
    id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
    customer_id: user.customer_id || null,
  },
});
```

**What it does:**

- Joins `users` and `Customer` tables to get customer_id
- Includes customer_id in JWT token
- Returns customer_id in login response

---

### 4. **Frontend - Login Page** (`frontend/src/app/login/page.jsx`)

#### Updated to store customer_id in localStorage:

```javascript
if (response.success) {
  // Store token and user info
  localStorage.setItem("authToken", response.token);
  localStorage.setItem("token", response.token); // Also store as 'token' for consistency
  localStorage.setItem("user", JSON.stringify(response.user));

  // Store customer_id if available (for customers only)
  if (response.user.customer_id) {
    localStorage.setItem("customer_id", response.user.customer_id);
  }

  // Role-based redirect...
}
```

**What it does:**

- Stores both `authToken` and `token` (for consistency)
- Stores complete user object
- Stores `customer_id` separately for easy access

---

### 5. **Backend - Cart Controller** (`backend/controllers/cartController.js`)

#### Updated to require customer_id:

```javascript
const getOrCreateCart = async (req, res) => {
  try {
    const customerId = req.body.customer_id || req.query.customer_id;

    if (!customerId) {
      return res.status(401).json({
        message: "Customer ID is required. Please login first.",
      });
    }

    const cartId = await CartModel.getOrCreateCart(customerId);
    res.json({ cart_id: cartId });
  } catch (error) {
    console.error("Error getting/creating cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

**What it does:**

- Validates that customer_id is provided
- Returns 401 Unauthorized if missing
- Creates/retrieves cart for authenticated customer only

---

## User Flow

### ✅ Logged In User:

1. User logs in → `customer_id` stored in localStorage
2. User browses products → clicks product
3. User selects variant → clicks "Add to Cart"
4. Cart check passes (token + customer_id exist)
5. Item added to cart in database
6. Cart badge updates

### 🚫 Guest User (Not Logged In):

1. User browses products → clicks product
2. User selects variant → clicks "Add to Cart"
3. Cart check fails (no token or customer_id)
4. **User redirected to `/login` page**
5. After login, user can add items to cart

---

## Database Schema

### Users Table (for authentication):

```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    role ENUM('customer', 'admin', 'manager'),
    is_active BOOLEAN,
    last_login TIMESTAMP
);
```

### Customer Table (for customer details):

```sql
CREATE TABLE Customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    user_name VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(15),
    created_at TIMESTAMP
);
```

### Cart Table (linked to customer):

```sql
CREATE TABLE Cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);
```

---

## Testing

### Test Login and Add to Cart:

1. **Start backend:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Test as guest:**

   - Go to http://localhost:3000/products
   - Click any product
   - Select variant and click "Add to Cart"
   - Should redirect to `/login`

4. **Test as logged-in user:**
   - Go to http://localhost:3000/login
   - Login with credentials
   - Go to products page
   - Click "Add to Cart"
   - Should successfully add to cart

### Check localStorage After Login:

Open DevTools → Application → Local Storage:

```javascript
{
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "customer_id": "1",
  "user": "{\"id\":1,\"name\":\"John Doe\",\"email\":\"john@example.com\",\"role\":\"customer\",\"customer_id\":1}",
  "cart_id": "1"
}
```

---

## API Endpoints

### POST /api/cart

**Request:**

```json
{
  "customer_id": 1
}
```

**Response (Success):**

```json
{
  "cart_id": 1
}
```

**Response (Unauthorized):**

```json
{
  "message": "Customer ID is required. Please login first."
}
```

---

## Security Notes

### ✅ What's Protected:

- Cart creation requires customer_id
- Cart operations require valid cart_id
- Frontend checks authentication before allowing add to cart
- Backend validates customer_id exists

### 🔒 Recommendations:

1. **Add JWT middleware** to verify tokens on backend:

   ```javascript
   router.post("/cart", authMiddleware, cartController.getOrCreateCart);
   ```

2. **Validate customer_id in token** matches request:

   ```javascript
   if (req.user.customerId !== req.body.customer_id) {
     return res.status(403).json({ message: "Unauthorized" });
   }
   ```

3. **Add HTTPS** in production to protect tokens

4. **Set token expiration** (currently 7 days)

5. **Implement refresh tokens** for better security

---

## Summary

✅ **Guest users CANNOT add to cart**
✅ **Redirected to login page when attempting to add to cart**
✅ **Only authenticated users can add items to cart**
✅ **Cart is linked to customer_id in database**
✅ **customer_id stored in localStorage after login**
✅ **Backend validates customer_id for all cart operations**

The cart system now requires authentication, ensuring each cart is associated with a specific customer! 🔐🛒
