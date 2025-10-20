# BrightBuy Database Setup
# Customer ID Approach - Manual Instructions

## Step 1: Open MySQL Command Line or MySQL Workbench

## Step 2: Run these SQL files in order:

### File 1: schema_customer_approach.sql
```sql
SOURCE d:/Project/BrightBuy/queries/schema_customer_approach.sql;
```

### File 2: recreate_users_table.sql
```sql
SOURCE d:/Project/BrightBuy/queries/recreate_users_table.sql;
```

### File 3: cart_procedures_customer.sql
```sql
SOURCE d:/Project/BrightBuy/queries/cart_procedures_customer.sql;
```

### File 4: population.sql
```sql
SOURCE d:/Project/BrightBuy/queries/population.sql;
```

### File 5: populate-2.sql
```sql
SOURCE d:/Project/BrightBuy/queries/populate-2.sql;
```

## Or run all at once:
```sql
SOURCE d:/Project/BrightBuy/queries/schema_customer_approach.sql;
SOURCE d:/Project/BrightBuy/queries/recreate_users_table.sql;
SOURCE d:/Project/BrightBuy/queries/cart_procedures_customer.sql;
SOURCE d:/Project/BrightBuy/queries/population.sql;
SOURCE d:/Project/BrightBuy/queries/populate-2.sql;
```

## Verification:
```sql
USE brightbuy;
SHOW TABLES;
DESCRIBE Cart_item;
SHOW PROCEDURE STATUS WHERE Db = 'brightbuy';
SELECT COUNT(*) FROM Product;
SELECT COUNT(*) FROM ProductVariant;
```

## Expected Results:
- 15 tables total
- Cart_item has customer_id column (NOT cart_id)
- 9 stored procedures
- ~42 products
- ~100+ variants
