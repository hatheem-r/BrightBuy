# Database Setup Summary - Customer ID Approach

**Date:** October 20, 2025  
**Status:** ✅ Ready to Execute  
**Approach:** Customer ID (Direct customer_id in Cart_item)

---

## 🎯 What Was Done

### 1. **Created New Schema File**
**File:** `schema_customer_approach.sql`

**Why?** Your original `schema.sql` uses the **Cart Table Approach** (Customer→Cart→Cart_item), but you requested the **Customer ID Approach** (Customer→Cart_item).

**Changes Made:**
- ❌ **Removed** `Cart` table entirely
- ✅ **Modified** `Cart_item` to have `customer_id` instead of `cart_id`
- ✅ **Added** `image_url` column to `ProductVariant` (for product images)
- ✅ **Updated** constraints: `UNIQUE(customer_id, variant_id)` instead of `UNIQUE(cart_id, variant_id)`
- ✅ **Added** proper `DELIMITER` statements for all triggers/procedures
- ✅ **Added** timestamps to `Cart_item` (created_at, updated_at)

---

## 📊 Key Differences: schema.sql vs schema_customer_approach.sql

| Feature | schema.sql | schema_customer_approach.sql |
|---------|------------|----------------------------|
| **Cart Table** | ✅ Has it | ❌ Removed |
| **Cart_item.cart_id** | ✅ Has it | ❌ Removed |
| **Cart_item.customer_id** | ❌ No | ✅ Added (NOT NULL) |
| **Guest Cart Support** | ✅ Possible | ❌ Not possible |
| **DELIMITER statements** | ❌ Missing | ✅ Added |
| **ProductVariant.image_url** | ❌ No | ✅ Added |
| **Cart_item timestamps** | ❌ No | ✅ Added |
| **Total Tables** | 16 (with Cart) | 15 (without Cart) |

---

## 📋 Files Analysis

### ✅ Files Compatible (No Changes Needed)

#### 1. **recreate_users_table.sql**
- **Status:** ✅ Compatible
- **Purpose:** Creates `users` authentication table
- **Dependencies:** Requires `Customer` and `Staff` tables (present in schema_customer_approach.sql)
- **No conflicts:** This file doesn't reference Cart table

#### 2. **population.sql**
- **Status:** ✅ Compatible  
- **Purpose:** Inserts sample products, categories, variants
- **Checked for:** No `INSERT INTO Cart` statements found ✓
- **No conflicts:** Only populates Product, Category, ProductVariant tables

#### 3. **populate-2.sql**
- **Status:** ✅ Compatible
- **Purpose:** Sets inventory quantities for variants
- **Checked for:** No `INSERT INTO Cart` statements found ✓
- **No conflicts:** Only inserts into Inventory table

#### 4. **cart_procedures_customer.sql**
- **Status:** ✅ Compatible - This is the RIGHT file for customer_id approach
- **Created:** October 17, 2025 (5:52 PM - 6:40 PM)
- **Purpose:** Cart management procedures using `customer_id`
- **Procedures:** 7 procedures (AddToCart, GetCustomerCart, etc.)
- **Perfect match:** All procedures use `customer_id` parameter ✓

---

## ⚠️ Potential Mismatches Found & Resolved

### Issue #1: schema.sql Cart Table Conflict
**Problem:** Your `schema.sql` has a `Cart` table, but you want customer_id approach  
**Solution:** Created `schema_customer_approach.sql` without Cart table  
**Status:** ✅ Resolved

### Issue #2: Missing DELIMITER Statements
**Problem:** `schema.sql` missing DELIMITER for triggers/procedures (11 locations)  
**Solution:** Added DELIMITER statements in `schema_customer_approach.sql`  
**Status:** ✅ Resolved

### Issue #3: Missing image_url Column
**Problem:** Cart procedures reference `image_url` but schema.sql doesn't have it  
**Solution:** Added `image_url VARCHAR(512)` to ProductVariant table  
**Status:** ✅ Resolved

### Issue #4: Cart_item Missing Timestamps
**Problem:** Cart procedures return created_at but table doesn't have it  
**Solution:** Added `created_at` and `updated_at` to Cart_item  
**Status:** ✅ Resolved

---

## 🚀 Setup Files (Execution Order)

| # | File | Size | Purpose | Status |
|---|------|------|---------|--------|
| 1 | `schema_customer_approach.sql` | ~18 KB | Database schema (customer_id approach) | ✅ Ready |
| 2 | `recreate_users_table.sql` | ~2 KB | Authentication table | ✅ Ready |
| 3 | `cart_procedures_customer.sql` | ~6 KB | Cart management procedures | ✅ Ready |
| 4 | `population.sql` | ~50 KB | Sample products & categories | ✅ Ready |
| 5 | `populate-2.sql` | ~8 KB | Inventory quantities | ✅ Ready |

**Total Setup Size:** ~84 KB

---

## 🔧 Database Structure (After Setup)

### Tables (15 total):
1. Category
2. Product
3. ProductCategory
4. ProductVariant
5. Customer
6. Address
7. Shipment
8. ZipDeliveryZone
9. Orders
10. Order_item
11. Inventory
12. **Cart_item** (with customer_id)
13. Staff
14. Inventory_updates
15. Payment

### Stored Procedures (9 total):
**Reporting (2):**
- GetTopSellingProducts
- GetQuarterlySalesByYear

**Cart Management (7):**
- AddToCart(customer_id, variant_id, quantity)
- GetCustomerCart(customer_id)
- GetCustomerCartSummary(customer_id)
- UpdateCartItemQuantity(customer_id, variant_id, new_quantity)
- RemoveFromCart(customer_id, variant_id)
- ClearCustomerCart(customer_id)
- GetCustomerCartCount(customer_id)

### Views (4 total):
- Staff_CategoryOrders
- Staff_CustomerOrderSummary
- Staff_OrderDeliveryEstimate
- Staff_QuarterlySales

### Triggers (8 total):
- trg_variant_category_check
- trg_variant_create_inventory
- trg_orders_address_check
- trg_compute_delivery_fee
- trg_inventory_update_before_insert
- trg_payment_after_insert
- trg_order_paid_update_payment

---

## 🎮 How to Execute

### Option 1: PowerShell Script (Recommended)
```powershell
.\SETUP_DATABASE_CUSTOMER.ps1
```

The script will:
- Find MySQL installation automatically
- Prompt for root password
- Execute all 5 files in order
- Verify setup was successful
- Show table counts and structure

### Option 2: MySQL Command Line
```bash
mysql -u root -p < queries/SETUP_CUSTOMER_APPROACH.sql
```

### Option 3: MySQL Workbench
Open and execute each file in order:
1. schema_customer_approach.sql
2. recreate_users_table.sql
3. cart_procedures_customer.sql
4. population.sql
5. populate-2.sql

---

## ✅ Verification Queries

After setup, run these to verify:

```sql
-- Check database exists
SHOW DATABASES LIKE 'brightbuy';

-- Count tables (should be 15)
USE brightbuy;
SHOW TABLES;

-- Verify Cart table DOESN'T exist
SHOW TABLES LIKE 'Cart';  -- Should return empty

-- Check Cart_item structure (should have customer_id)
DESCRIBE Cart_item;

-- Count procedures (should be 9)
SHOW PROCEDURE STATUS WHERE Db = 'brightbuy';

-- Count views (should be 4)
SHOW FULL TABLES WHERE Table_type = 'VIEW';

-- Check sample data
SELECT COUNT(*) FROM Product;        -- Should be ~42
SELECT COUNT(*) FROM ProductVariant; -- Should be ~100+
SELECT COUNT(*) FROM Category;       -- Should be ~10-15
SELECT COUNT(*) FROM Inventory;      -- Should match ProductVariant count
```

---

## 🧪 Test Cart Functionality

```sql
-- Assuming you have customer_id = 1 (you'll need to insert a customer first)

-- Add item to cart
CALL AddToCart(1, 5, 2);

-- View cart
CALL GetCustomerCart(1);

-- Get cart summary
CALL GetCustomerCartSummary(1);

-- Update quantity
CALL UpdateCartItemQuantity(1, 5, 3);

-- Get cart count
CALL GetCustomerCartCount(1);

-- Remove item
CALL RemoveFromCart(1, 5);

-- Clear cart
CALL ClearCustomerCart(1);
```

---

## 📦 What You'll Get After Setup

### Products (~42 items):
- Electronics (laptops, phones, tablets)
- Clothing (shirts, pants, shoes)
- Home & Kitchen items
- Books & media
- Sports equipment
- And more...

### ProductVariants (~100+ variants):
- Different sizes (S, M, L, XL)
- Different colors (Black, White, Blue, Red, etc.)
- Different SKUs
- Prices ranging from $10 to $1500

### Inventory:
- Initial stock: 20-200 units per category
- Properly linked to variants

### Delivery Zones (5 Texas cities):
- Austin (78701, 78702) - $5.00 fee, 5 days
- Dallas (75001) - $8.00 fee, 5 days
- Houston (77001) - $7.00 fee, 5 days
- San Antonio (78201) - $6.00 fee, 5 days

---

## 🔄 Files NOT Used (Conflicting Approach)

These files are for **Cart Table Approach** - DO NOT use with customer_id setup:

❌ `schema.sql` - Uses Cart table  
❌ `schema_fixed.sql` - Uses Cart table  
❌ `cart-procedures.sql` - Old broken version  
❌ `migration_cart_procedures.sql` - For Cart table approach  
❌ `alter_cart_item_to_customer.sql` - Migration script (not needed for fresh setup)  
❌ `test.sql` - Old test file  
❌ `testing.sql` - Duplicate of create_staff_account.sql  
❌ `SIMPLE_create_staff.sql` - Incomplete version  

---

## 🎓 Summary

**✅ All Files Compatible:** No mismatches found in population files  
**✅ Schema Modified:** Created customer_id version without Cart table  
**✅ Procedures Ready:** cart_procedures_customer.sql matches perfectly  
**✅ Ready to Execute:** All 5 files ready in correct order  

**Next Step:** Run `.\SETUP_DATABASE_CUSTOMER.ps1` to set up your database!

---

## 📞 Need Help?

If you encounter errors during setup:

1. **Check MySQL is running:** `Get-Service MySQL*`
2. **Verify root password:** `mysql -u root -p -e "SELECT 1"`
3. **Check existing database:** `mysql -u root -p -e "DROP DATABASE IF EXISTS brightbuy"`
4. **Review error messages:** Look for foreign key or syntax errors

Common issues:
- **"Table doesn't exist"** → Run files in order (schema first!)
- **"Duplicate key"** → Database already exists (drop it first)
- **"Access denied"** → Check MySQL root password
- **"Unknown delimiter"** → Using old schema.sql (use schema_customer_approach.sql)
