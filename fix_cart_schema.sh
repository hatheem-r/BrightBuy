#!/bin/bash

# Fix Cart Schema - Bash Script
# This script fixes the Cart_item table to use customer_id approach

echo "========================================"
echo "FIX CART SCHEMA"
echo "========================================"
echo ""

# Get MySQL credentials
read -p "Enter MySQL username (default: root): " mysqlUser
mysqlUser=${mysqlUser:-root}

read -sp "Enter MySQL password: " mysqlPassword
echo ""

echo ""
echo "Warning: This will drop the Cart_item and Cart tables!"
echo "All current cart data will be lost."
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Operation cancelled."
    exit 1
fi

echo ""
echo "Fixing cart schema..."

# Run the fix script
export MYSQL_PWD="$mysqlPassword"
mysql -u "$mysqlUser" brightbuy < queries/fix_cart_schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Cart schema fixed successfully!"
    echo "========================================"
    echo ""
    echo "Next steps:"
    echo "1. Restart your Node.js server"
    echo "2. Test adding items to cart"
    echo "3. Cart data has been cleared"
else
    echo "Error fixing cart schema!"
    exit 1
fi

unset MYSQL_PWD
echo ""
