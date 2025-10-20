# Customer ID Approach - Setup Summary

**Date:** October 20, 2025  
**Approach:** Direct `customer_id` in `Cart_item` (NO separate `Cart` table)

---

## 🎯 Key Decision: Customer ID Approach

You chose the **Customer ID Approach** which means:
- ✅ Cart_item table has `customer_id` column (directly linked to Customer)
- ❌ NO separate Cart table
- ✅ Simpler structure: Customer → Cart_item (2 tables instead of 3)
- ⚠️ **Guest users cannot add to cart** (must register first)

---

## 📊 Table Structure Comparison

### Original schema.sql (Cart Table Approach):
```
Customer ──→ Cart ──→ Cart_item ──→ ProductVariant
(3 tables for cart system)
```

### Modified schema_customer_approach.sql (Customer ID Approach):
```
Customer ──→ Cart_item ──→ ProductVariant
(2 tables for cart system)
```

---

## 📝 Files Used for Setup

| File | Purpose | Status |
|------|---------|--------|
| `schema_customer_approach.sql` | NEW - Modified schema without Cart table | ✅ Created |
| `recreate_users_table.sql` | Authentication table (links users to Customer/Staff) | ✅ Existing |
| `cart_procedures_customer.sql` | Cart procedures using customer_id | ✅ Existing (Oct 17) |
| `population.sql` | Sample products & categories | ✅ Existing |
| `populate-2.sql` | Inventory quantities | ✅ Existing |

---

## 🔧 Key Changes in schema_customer_approach.sql

### 1. **Removed Cart Table**
```sql
-- ❌ NOT INCLUDED (was in schema.sql):
CREATE TABLE Cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NULL,
    ...
);
```

### 2. **Modified Cart_item Table**
```sql
-- ✅ NEW STRUCTURE:
CREATE TABLE Cart_item (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,           -- Direct link to Customer (was cart_id)
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cartitem_customer FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    CONSTRAINT uc_customer_variant UNIQUE(customer_id, variant_id)  -- One item per customer
);
```

### 3. **Added image_url to ProductVariant**
```sql
CREATE TABLE ProductVariant (
    ...
    image_url VARCHAR(512),  -- Added for product images
    ...
);
```

---

## 🔌 Cart Procedures (cart_procedures_customer.sql)

These procedures use `customer_id` parameter:

1. **AddToCart**(customer_id, variant_id, quantity)
2. **GetCustomerCart**(customer_id)
3. **GetCustomerCartSummary**(customer_id)
4. **UpdateCartItemQuantity**(customer_id, variant_id, new_quantity)
5. **RemoveFromCart**(customer_id, variant_id)
6. **ClearCustomerCart**(customer_id)
7. **GetCustomerCartCount**(customer_id)

---

## ⚠️ Important Differences from Original schema.sql

| Feature | schema.sql (Cart Table) | schema_customer_approach.sql (Customer ID) |
|---------|-------------------------|-------------------------------------------|
| Cart Table | ✅ Has separate Cart table | ❌ No Cart table |
| Cart_item.cart_id | ✅ References Cart | ❌ Not present |
| Cart_item.customer_id | ❌ Not present | ✅ Direct reference to Customer |
| Guest Cart Support | ✅ Yes (cart_id can be NULL customer) | ❌ No (customer_id required) |
| Procedures | AddToCart(cart_id, ...) | AddToCart(customer_id, ...) |
| Constraint | UNIQUE(cart_id, variant_id) | UNIQUE(customer_id, variant_id) |

---

## 🚀 Setup Execution

Run this command in MySQL:
```sql
SOURCE queries/SETUP_CUSTOMER_APPROACH.sql;
```

Or execute individually:
```sql
SOURCE queries/schema_customer_approach.sql;
SOURCE queries/recreate_users_table.sql;
SOURCE queries/cart_procedures_customer.sql;
SOURCE queries/population.sql;
SOURCE queries/populate-2.sql;
```

---

## ✅ Verification Queries

After setup, verify the structure:

```sql
-- Check Cart_item structure
DESCRIBE Cart_item;

-- Verify Cart table doesn't exist
SHOW TABLES LIKE 'Cart';

-- Check cart procedures
SHOW PROCEDURE STATUS WHERE Db = 'brightbuy' AND Name LIKE '%Cart%';

-- Test cart procedures
CALL AddToCart(1, 5, 2);
CALL GetCustomerCart(1);
```

---

## 📦 Database Contents After Setup

- **Products:** ~42 items across categories
- **ProductVariants:** 100+ variants with sizes/colors
- **Inventory:** Initial stock levels (20-200 units)
- **Customers:** None (you'll need to register)
- **ZipDeliveryZone:** 5 Texas main cities

---

## 🔄 Migration Note

If you ever need to switch back to Cart Table approach:
1. Run `alter_cart_item_to_customer.sql` (reverses the migration)
2. Run `migration_cart_procedures.sql` (Oct 18 version)
3. Rebuild with `schema.sql` or `schema_fixed.sql`

---

## 📋 Files NOT Used (Conflicts)

These files are for the **Cart Table Approach** - DO NOT RUN with customer_id approach:
- ❌ `schema.sql` (has Cart table)
- ❌ `schema_fixed.sql` (has Cart table)
- ❌ `cart-procedures.sql` (old, broken)
- ❌ `migration_cart_procedures.sql` (for Cart table approach)
- ❌ `alter_cart_item_to_customer.sql` (migration script, not needed for fresh setup)

---

## 🎓 Summary

**Your Choice:** Customer ID Approach  
**Files Ready:** 5 files (1 new, 4 existing)  
**Setup Status:** Ready to execute  
**Next Action:** Run MySQL command to execute setup

**Ready to proceed? Run:**
```powershell
mysql -u root -p < queries/SETUP_CUSTOMER_APPROACH.sql
```

Or execute files one by one in MySQL Workbench.
