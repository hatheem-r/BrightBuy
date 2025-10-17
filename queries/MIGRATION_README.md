# Database Migration Guide

This guide helps you update your local database after pulling the latest changes.

## Quick Start

If you're experiencing cart-related errors or just pulled the latest code, run this migration:

```bash
mysql -u root -p brightbuy < queries/migration_cart_procedures.sql
```

## What This Migration Does

The `migration_cart_procedures.sql` file:

1. **Fixes cart system compatibility** - Updates stored procedures to work correctly with the Cart and Cart_item table structure
2. **Drops old procedures** - Removes outdated procedures that used `customer_id` directly
3. **Creates/updates procedures**:
   - `GetCartDetails` - Retrieves all items in a cart
   - `GetCartSummary` - Gets cart totals and counts
   - `AddToCart` - Adds items to cart
   - `UpdateCartItemQuantity` - Updates item quantities
   - `RemoveCartItem` - Removes items from cart
   - `ClearCart` - Clears all items from cart
   - `GetCartItemCount` - Gets total item count
   - `GetOrCreateCart` - Gets existing cart or creates new one
   - `ValidateCart` - Validates cart items against inventory
   - `MergeGuestCart` - Merges guest cart with customer cart

## Symptoms That Indicate You Need This Migration

- Error: "Failed to add item to cart" (500 Internal Server Error)
- Cart items not showing up after adding
- Console errors mentioning stored procedures
- Backend logs showing procedure-related errors

## Verification

After running the migration, verify it worked:

```bash
mysql -u root -p brightbuy -e "SHOW PROCEDURE STATUS WHERE Db = 'brightbuy' AND Name LIKE '%Cart%';"
```

You should see all cart-related procedures listed.

## Other Migrations

### Users Table Recreation

If you need to recreate the `users` table (e.g., after database reset):

```bash
mysql -u root -p brightbuy < queries/recreate_users_table.sql
```

**Note:** This will drop and recreate the users table. Make sure you have a backup!

## Full Database Schema

To recreate the entire database from scratch:

```bash
mysql -u root -p < queries/schema.sql
mysql -u root -p brightbuy < queries/migration_cart_procedures.sql
```

## Troubleshooting

### "Procedure already exists" error

This is normal - the migration drops existing procedures before recreating them.

### "Table doesn't exist" error

You may need to run the main schema first:

```bash
mysql -u root -p < queries/schema.sql
```

### "Access denied" error

Make sure you're using the correct database user and password.

### Still having issues?

1. Check that you're in the correct directory
2. Verify your MySQL/MariaDB is running
3. Check the backend `.env` file for correct database credentials

## For New Developers

If you're setting up the project for the first time:

1. **Create the database:**

   ```bash
   mysql -u root -p < queries/schema.sql
   ```

2. **Run cart procedures migration:**

   ```bash
   mysql -u root -p brightbuy < queries/migration_cart_procedures.sql
   ```

3. **Populate with sample data (optional):**

   ```bash
   mysql -u root -p brightbuy < queries/population.sql
   ```

4. **Configure backend:**

   - Copy `backend/.env.example` to `backend/.env`
   - Update database credentials

5. **Install dependencies:**

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

6. **Run the application:**

   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## Migration History

| Date       | File                            | Description                          |
| ---------- | ------------------------------- | ------------------------------------ |
| 2025-10-17 | `migration_cart_procedures.sql` | Fixed cart procedures to use cart_id |
| 2025-10-17 | `recreate_users_table.sql`      | Users table recreation script        |

---

**Last Updated:** October 17, 2025
