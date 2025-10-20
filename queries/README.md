# BrightBuy SQL Queries

This folder contains all SQL queries organized by category for the BrightBuy database.

## Directory Structure

### 01_schema/

Database schema definitions

- `01_main_schema.sql` - Main database schema with all tables

### 02_data/

Data population scripts

- `01_initial_population.sql` - Initial data population
- `02_additional_population.sql` - Additional data records
- `03_product_images.sql` - Product images data

### 03_procedures/

Stored procedures and functions

- `01_cart_procedures.sql` - Cart-related stored procedures

### 04_admin_setup/

Admin and staff account setup

- `01_create_admin.sql` - Create admin accounts
- `02_create_staff.sql` - Create staff accounts
- `03_link_admin_users.sql` - Link admin to users table

### 05_maintenance/

Maintenance and fix scripts

- `01_fix_cart_schema.sql` - Cart schema fixes
- `02_allow_backorders.sql` - Backorder configuration
- `03_recreate_users_table.sql` - Users table recreation

## Usage Order

For a fresh database setup, run queries in this order:

1. Schema files (01_schema/)
2. Data population files (02_data/)
3. Procedures (03_procedures/)
4. Admin setup (04_admin_setup/)
5. Maintenance scripts as needed (05_maintenance/)

## Notes

- Always backup your database before running maintenance scripts
- Check database backups in `/database_backups/` folder
- Ensure your MySQL user has appropriate privileges for all operations
