# Files Cleanup Guide - Customer ID Approach

**Date:** October 20, 2025  
**Status:** Database successfully set up with customer_id approach

---

## 🗑️ Files You Can DELETE (Conflicting Approach)

These files are for the **Cart Table Approach** which you're NOT using:

### ❌ Schema Files (Cart Table Approach):
1. **`schema.sql`** - Original schema with Cart table (broken DELIMITER)
2. **`schema_fixed.sql`** - Fixed schema with Cart table (you're not using this approach)

### ❌ Cart Procedures (Cart Table Approach):
3. **`cart-procedures.sql`** - Old broken cart procedures (Oct 17, 5:33 PM)
4. **`migration_cart_procedures.sql`** - Cart procedures for Cart table approach (Oct 18, 10:17 AM)

### ❌ Migration Files (Not Needed for Fresh Setup):
5. **`alter_cart_item_to_customer.sql`** - Migration from Cart table to customer_id (only needed when migrating existing data)
6. **`setup_cart_images.sql`** - Old image setup (image_url already in schema_customer_approach.sql)

### ❌ Test/Duplicate Files:
7. **`test.sql`** - Old test file
8. **`SETUP_CUSTOMER_APPROACH.sql`** - Uses SOURCE commands (not compatible with all MySQL clients)

### ❌ Session Files:
9. **`brightbuy-2.session.sql`** - MySQL Workbench session file (can be deleted)

---

## ✅ Files You Should KEEP

### ✅ Current Schema & Setup:
- **`schema_customer_approach.sql`** ✅ YOUR CURRENT SCHEMA (customer_id approach)
- **`cart_procedures_customer_clean.sql`** ✅ EXECUTED (clean version without @block comments)

### ✅ Supporting Files:
- **`recreate_users_table.sql`** ✅ Authentication table
- **`population.sql`** ✅ Sample products
- **`populate-2.sql`** ✅ Inventory data

### ✅ Optional Keep:
- **`cart_procedures_customer.sql`** ⚠️ Original (has @block comments) - can delete since you have the _clean version
- **`create_staff_account.sql`** ⚠️ Staff creation (keep if you need to create staff accounts)
- **`allow_backorders.sql`** ⚠️ Removes inventory constraint (keep if you want backorder support)

---

## 📋 Recommended Cleanup Actions

### 🔴 DELETE IMMEDIATELY (Conflicting/Obsolete):
```powershell
# Remove conflicting schema files
Remove-Item "queries\schema.sql"
Remove-Item "queries\schema_fixed.sql"

# Remove cart table approach procedures
Remove-Item "queries\cart-procedures.sql"
Remove-Item "queries\migration_cart_procedures.sql"

# Remove migration files (not needed for fresh setup)
Remove-Item "queries\alter_cart_item_to_customer.sql"
Remove-Item "queries\setup_cart_images.sql"

# Remove test/duplicate files
Remove-Item "queries\test.sql"
Remove-Item "queries\SETUP_CUSTOMER_APPROACH.sql"
Remove-Item "queries\brightbuy-2.session.sql"
```

### 🟡 OPTIONAL DELETE (You have clean versions):
```powershell
# Delete original if you prefer the clean version
Remove-Item "queries\cart_procedures_customer.sql"  # Keep _clean version
```

---

## 📊 Before & After

### BEFORE Cleanup (17 files):
```
queries/
├── schema.sql ❌ DELETE
├── schema_fixed.sql ❌ DELETE
├── schema_customer_approach.sql ✅ KEEP
├── cart-procedures.sql ❌ DELETE
├── cart_procedures_customer.sql ⚠️ Optional delete
├── cart_procedures_customer_clean.sql ✅ KEEP
├── migration_cart_procedures.sql ❌ DELETE
├── alter_cart_item_to_customer.sql ❌ DELETE
├── setup_cart_images.sql ❌ DELETE
├── test.sql ❌ DELETE
├── SETUP_CUSTOMER_APPROACH.sql ❌ DELETE
├── brightbuy-2.session.sql ❌ DELETE
├── recreate_users_table.sql ✅ KEEP
├── population.sql ✅ KEEP
├── populate-2.sql ✅ KEEP
├── create_staff_account.sql ✅ KEEP
└── allow_backorders.sql ✅ KEEP
```

### AFTER Cleanup (7 files):
```
queries/
├── schema_customer_approach.sql ✅ Main schema
├── cart_procedures_customer_clean.sql ✅ Cart procedures
├── recreate_users_table.sql ✅ Authentication
├── population.sql ✅ Sample data
├── populate-2.sql ✅ Inventory
├── create_staff_account.sql ✅ Staff management
└── allow_backorders.sql ✅ Backorder support
```

---

## 🎯 File Purpose Summary (What to Keep)

| File | Size | Purpose | Keep? |
|------|------|---------|-------|
| `schema_customer_approach.sql` | ~18 KB | YOUR database schema | ✅ YES |
| `cart_procedures_customer_clean.sql` | ~6 KB | Cart procedures (executed) | ✅ YES |
| `recreate_users_table.sql` | ~2 KB | Authentication table | ✅ YES |
| `population.sql` | ~50 KB | Products & categories | ✅ YES |
| `populate-2.sql` | ~8 KB | Inventory quantities | ✅ YES |
| `create_staff_account.sql` | ~2 KB | Staff account creation | ✅ YES |
| `allow_backorders.sql` | ~1 KB | Enable backorders | ✅ YES |

---

## ⚠️ Why Delete These Files?

### `schema.sql` & `schema_fixed.sql`:
- ❌ Use **Cart Table approach** (Customer→Cart→Cart_item)
- ❌ You're using **Customer ID approach** (Customer→Cart_item)
- ❌ Will cause confusion if accidentally executed
- ❌ Would overwrite your current setup

### `cart-procedures.sql` & `migration_cart_procedures.sql`:
- ❌ Designed for Cart table approach
- ❌ Use `cart_id` parameter instead of `customer_id`
- ❌ Incompatible with your current Cart_item structure

### `alter_cart_item_to_customer.sql`:
- ❌ Migration script (converts Cart table → customer_id)
- ❌ Only needed when migrating existing database
- ❌ You did fresh setup, not migration

### `setup_cart_images.sql`:
- ❌ Old approach to add image_url
- ❌ Already included in schema_customer_approach.sql

### `cart_procedures_customer.sql`:
- ⚠️ Has `--@block` comments that cause MySQL errors
- ✅ You have `cart_procedures_customer_clean.sql` (same content, no @block)
- 🔄 Safe to delete if you keep the _clean version

---

## 🚀 Cleanup PowerShell Script

Save this as `cleanup_queries.ps1`:

```powershell
# BrightBuy Queries Cleanup Script
# Removes conflicting Cart Table approach files

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "BrightBuy Queries Cleanup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$filesToDelete = @(
    "queries\schema.sql",
    "queries\schema_fixed.sql",
    "queries\cart-procedures.sql",
    "queries\migration_cart_procedures.sql",
    "queries\alter_cart_item_to_customer.sql",
    "queries\setup_cart_images.sql",
    "queries\test.sql",
    "queries\SETUP_CUSTOMER_APPROACH.sql",
    "queries\brightbuy-2.session.sql",
    "queries\cart_procedures_customer.sql"
)

$deletedCount = 0

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Write-Host "Deleting: $file" -ForegroundColor Yellow
        Remove-Item $file -Force
        $deletedCount++
    } else {
        Write-Host "Not found: $file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Cleanup Complete!" -ForegroundColor Green
Write-Host "Files deleted: $deletedCount" -ForegroundColor White
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Remaining files:" -ForegroundColor Green
Get-ChildItem "queries\*.sql" | Select-Object Name, Length | Format-Table -AutoSize
```

---

## 🔍 Verification After Cleanup

Run this to verify you kept the right files:

```powershell
Get-ChildItem "queries\*.sql" | Select-Object Name, @{Name="Size";Expression={"{0:N0} KB" -f ($_.Length/1KB)}}
```

Expected output (7 files):
```
Name                                Size
----                                ----
allow_backorders.sql                1 KB
cart_procedures_customer_clean.sql  6 KB
create_staff_account.sql            2 KB
populate-2.sql                      8 KB
population.sql                      50 KB
recreate_users_table.sql            2 KB
schema_customer_approach.sql        18 KB
```

---

## 🎯 Summary

**Files to DELETE:** 10 files (~140 KB)
- 2 conflicting schema files
- 4 cart table approach files  
- 4 obsolete/duplicate files

**Files to KEEP:** 7 files (~87 KB)
- 1 schema (customer_id approach)
- 1 cart procedures (clean)
- 3 data files
- 2 utility files

**Result:** Clean, organized queries folder with only relevant files for customer_id approach.

---

## ⚠️ IMPORTANT

Before deleting, if you want to keep a backup:

```powershell
# Create backup folder
New-Item -ItemType Directory -Path "queries\backup_cart_table_approach" -Force

# Move conflicting files to backup instead of deleting
Move-Item "queries\schema.sql" "queries\backup_cart_table_approach\"
Move-Item "queries\schema_fixed.sql" "queries\backup_cart_table_approach\"
# ... etc
```

This way you can always switch back if needed!
