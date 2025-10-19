# Authentication System Architecture - BrightBuy

## Database Schema

### Table Structure

The authentication system uses THREE tables:

1. **`users`** - Central authentication table
   - `user_id` (PK)
   - `email` (unique)
   - `password_hash`
   - `role` (customer, staff, manager, admin)
   - `is_active`
   - `created_at`
   - `last_login`
   - `customer_id` (FK to Customer table, NULL for staff)
   - `staff_id` (FK to Staff table, NULL for customers)

2. **`Customer`** - Customer-specific information
   - `customer_id` (PK)
   - `first_name`
   - `last_name`
   - `user_name`
   - `email`
   - `phone`
   - `password_hash` (duplicate for legacy, but `users` table is source of truth)

3. **`Staff`** - Staff-specific information
   - `staff_id` (PK)
   - `user_name`
   - `email`
   - `phone`
   - `role` (Level01, Level02, admin, manager)
   - `password_hash` (duplicate for legacy, but `users` table is source of truth)

## How It Works

### Registration (Signup)
1. User submits: name, email, password, phone (optional)
2. Backend creates **TWO records**:
   - **Customer record**: Stores name (split into first/last), email, username, phone
   - **users record**: Stores email, password_hash, role='customer', links to customer_id
3. Both use the SAME password_hash
4. Transaction ensures both are created or neither

### Login
1. User submits: email, password
2. Backend queries **users table** for authentication
3. **JOINS with Customer OR Staff** to get the name:
   ```sql
   SELECT u.*, 
          COALESCE(CONCAT(c.first_name, ' ', c.last_name), s.user_name) as name
   FROM users u
   LEFT JOIN Customer c ON u.customer_id = c.customer_id
   LEFT JOIN Staff s ON u.staff_id = s.staff_id
   WHERE u.email = ?
   ```
4. Verifies password against `users.password_hash`
5. Returns JWT token with user info

### Get Current User (getMe)
1. Receives JWT token
2. Extracts userId from token
3. Queries **users table** with JOIN to get complete user info
4. Returns user profile

## Why This Design?

### ✅ Advantages:
- **Single source of truth** for authentication (users table)
- **Separation of concerns**: Authentication vs. Profile data
- **Flexible**: Can link to either Customer or Staff
- **Role-based access**: Role stored in users table
- **Maintains legacy data**: Customer and Staff tables still exist

### 📊 Data Flow:

```
Signup:
  Frontend → Backend → Customer table (name, email, phone)
                    → users table (email, password, role, customer_id)

Login:
  Frontend → Backend → users table JOIN Customer/Staff → Verify password → JWT

GetMe:
  Frontend → Backend → users table JOIN Customer/Staff → User profile
```

## Current Database State

```sql
-- Check users
SELECT u.user_id, u.email, u.role, u.customer_id, u.staff_id,
       COALESCE(CONCAT(c.first_name, ' ', c.last_name), s.user_name) as name
FROM users u
LEFT JOIN Customer c ON u.customer_id = c.customer_id
LEFT JOIN Staff s ON u.staff_id = s.staff_id;
```

## Test Users

| Email | Password | Role | Linked To |
|-------|----------|------|-----------|
| kalharajay@gmail.com | admin123 | customer | Customer #6 |
| customer@brightbuy.com | admin123 | customer | Customer #7 |
| admin@brightbuy.com | admin123 | admin | Staff #1 |
| manager@brightbuy.com | admin123 | manager | Staff #2 |
| test@test.com | (from signup) | customer | Customer #10 |
| test2@test.com | (from signup) | customer | Customer #11 |

## Fixed Issues

1. ✅ Login was trying to query `users.name` which doesn't exist → Now JOINS to get name
2. ✅ GetMe was trying to query `users.name` → Now JOINS to get name
3. ✅ Registration creates both Customer AND users records with proper linking
4. ✅ Both password hashes stored in respective tables (users is primary)
5. ✅ Comprehensive logging shows exactly what's saved where
