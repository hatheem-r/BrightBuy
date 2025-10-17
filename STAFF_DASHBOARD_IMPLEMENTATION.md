# Staff Dashboard Implementation

## Overview
This document describes the staff dashboard implementation for BrightBuy, including the staff account creation process and staff-specific features.

## Staff Account Created

### Default Staff Account Details
- **Username**: admin_brightbuy
- **Email**: admin@brightbuy.com
- **Password**: 123456
- **Role**: staff (Level01 in Staff table)

## Database Setup

### 1. SQL Script for Staff Account Creation
Location: `d:\Project\BrightBuy\queries\create_staff_account.sql`

This script:
- Creates a staff member in the `Staff` table
- Creates a corresponding user in the `users` table
- Links them together via `staff_id`
- Uses bcrypt hashed password for security

### 2. Password Hashing
The password '123456' is hashed using bcrypt with salt rounds of 10:
```
Hash: $2b$10$45/QFPHQShGN9eNfqfkeUeTAwjaPoivJjVRuaOtDc9Hb2aiDvQVvu
```

### 3. Running the SQL Script
To create the staff account in your database:

```sql
-- Connect to MySQL
mysql -u root -p

-- Run the script
source d:/Project/BrightBuy/queries/create_staff_account.sql
```

Or use MySQL Workbench:
1. Open the file `create_staff_account.sql`
2. Execute the entire script
3. Verify the results with the SELECT query at the end

## Staff Dashboard Features

### Location
Frontend path: `d:\Project\BrightBuy\frontend\src\app\staff\dashboard\page.jsx`

### Key Features

#### 1. **Authentication & Authorization**
- Only users with role='staff' can access the dashboard
- Automatic redirect to login if not authenticated
- Automatic redirect to home if user is not staff

#### 2. **Dashboard Statistics**
- **Pending Orders**: Number of orders waiting to be processed
- **Low Stock Items**: Products needing inventory replenishment
- **Today's Sales**: Total sales revenue for current day
- **Total Customers**: Total number of registered customers

#### 3. **Staff Controls & Actions**
The dashboard provides quick access to:

1. **Process Orders**
   - Route: `/staff/orders`
   - View and manage pending orders
   - Update order status
   - Process shipments

2. **Update Inventory**
   - Route: `/inventory`
   - Add or reduce stock quantities
   - Track inventory changes
   - View inventory history

3. **Customer Management**
   - Route: `/staff/customers`
   - View customer information
   - Handle customer inquiries
   - Manage customer accounts

4. **Product Information**
   - Route: `/staff/products`
   - View product details
   - Check product availability
   - Access product specifications

5. **View Reports**
   - Route: `/staff/reports`
   - Sales reports
   - Inventory reports
   - Order statistics

6. **Customer Support**
   - Route: `/staff/support`
   - Handle customer support tickets
   - Respond to inquiries
   - Track support issues

#### 4. **Recent Activity Feed**
- Shows recent actions performed by the staff member
- Displays timestamp for each activity
- Helps track work progress

#### 5. **Alert System**
- Displays alerts for low stock items
- Visual warnings for items requiring immediate attention
- Action prompts for critical tasks

## Staff Abilities & Permissions

Based on the database schema and dashboard implementation, staff members can:

### Order Management
- View all orders
- Update order status
- Process shipments
- Track order history

### Inventory Management
- Update inventory quantities
- Record inventory changes in `Inventory_updates` table
- Track stock levels
- Monitor low stock alerts

### Product Management
- View product information
- Access product variants
- Check product availability
- View product categories

### Customer Service
- View customer information
- Access order history for customers
- Handle customer inquiries
- Support ticket management

### Reporting (Read-Only)
- View sales reports
- Access inventory reports
- Check order statistics
- Analyze customer data

Staff members use the following database views:
- `Staff_CategoryOrders` - Orders by category
- `Staff_CustomerOrderSummary` - Customer order summaries
- `Staff_OrderDeliveryEstimate` - Delivery estimates
- `Staff_QuarterlySales` - Quarterly sales data

## Login Flow

### Staff Login Process
1. Navigate to `/login`
2. Enter credentials:
   - Email: admin@brightbuy.com
   - Password: 123456
3. System validates credentials against `users` table
4. JWT token is generated with user role
5. User is redirected to `/staff/dashboard`

### Authentication Implementation
The login process is handled in:
- Frontend: `frontend/src/app/login/page.jsx`
- Backend: `backend/controllers/authController.js`

Role-based redirect logic:
```javascript
switch (response.user.role) {
  case "staff":
    router.push("/staff/dashboard");
    break;
  // ... other roles
}
```

## Database Schema Reference

### Users Table
```sql
CREATE TABLE `users` (
    `user_id` int(11) NOT NULL AUTO_INCREMENT,
    `email` varchar(255) NOT NULL,
    `password_hash` varchar(255) NOT NULL,
    `role` enum('customer', 'staff', 'manager', 'admin') NOT NULL DEFAULT 'customer',
    `is_active` tinyint(1) DEFAULT 1,
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    `last_login` timestamp NULL DEFAULT NULL,
    `customer_id` int(11) DEFAULT NULL,
    `staff_id` int(11) DEFAULT NULL,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `email` (`email`),
    CONSTRAINT `fk_users_staff` FOREIGN KEY (`staff_id`) REFERENCES `Staff` (`staff_id`)
);
```

### Staff Table
```sql
CREATE TABLE Staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('Level01', 'Level02') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Inventory Updates Table
```sql
CREATE TABLE Inventory_updates (
    update_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    variant_id INT NOT NULL,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_quantity INT NOT NULL,
    added_quantity INT NOT NULL,
    note VARCHAR(255),
    CONSTRAINT fk_update_staff FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
);
```

## Future Enhancements

### Suggested Features to Implement

1. **API Endpoints for Staff Dashboard**
   - `GET /api/staff/stats` - Get dashboard statistics
   - `GET /api/staff/orders` - Get pending orders
   - `PUT /api/staff/orders/:id` - Update order status
   - `POST /api/staff/inventory/:variantId` - Update inventory
   - `GET /api/staff/customers` - Get customer list
   - `GET /api/staff/reports` - Get various reports

2. **Order Management Page**
   - Create `frontend/src/app/staff/orders/page.jsx`
   - List all orders with filtering
   - Order detail view
   - Status update functionality

3. **Customer Management Page**
   - Create `frontend/src/app/staff/customers/page.jsx`
   - Customer list with search
   - Customer detail view
   - Order history per customer

4. **Product Information Page**
   - Create `frontend/src/app/staff/products/page.jsx`
   - Product catalog with search
   - Product details with variants
   - Stock level indicators

5. **Reports Page**
   - Create `frontend/src/app/staff/reports/page.jsx`
   - Sales reports with date filters
   - Inventory reports
   - Customer analytics
   - Export functionality

6. **Real-time Updates**
   - WebSocket integration for real-time notifications
   - Live order updates
   - Instant low stock alerts

## Testing the Staff Account

### Manual Testing Steps

1. **Test Login**
   ```
   Navigate to: http://localhost:3000/login
   Email: admin@brightbuy.com
   Password: 123456
   Expected: Redirect to /staff/dashboard
   ```

2. **Test Authorization**
   ```
   Try accessing /staff/dashboard without logging in
   Expected: Redirect to /login
   
   Try accessing /staff/dashboard with customer account
   Expected: Redirect to /
   ```

3. **Test Dashboard Display**
   ```
   Verify all stat cards display
   Verify all action buttons are present
   Verify recent activity feed shows
   Verify low stock alert shows (if applicable)
   ```

4. **Test Logout**
   ```
   Click logout button
   Expected: Redirect to /login
   Token and user data cleared from localStorage
   ```

## Security Considerations

1. **Password Hashing**: All passwords use bcrypt with 10 salt rounds
2. **JWT Tokens**: 7-day expiration for authentication tokens
3. **Role-Based Access**: Frontend and backend validate user roles
4. **SQL Injection Prevention**: Using parameterized queries
5. **XSS Prevention**: React automatically escapes output

## Troubleshooting

### Common Issues

**Issue: Cannot login with staff credentials**
- Verify the SQL script was executed successfully
- Check if the user exists: `SELECT * FROM users WHERE email = 'admin@brightbuy.com';`
- Verify password hash matches

**Issue: Redirected to home instead of staff dashboard**
- Check user role in database
- Verify localStorage has correct user data
- Check browser console for errors

**Issue: Dashboard shows "Loading..." indefinitely**
- Check if authentication token is valid
- Verify API endpoints are accessible
- Check network tab in browser dev tools

## Support

For issues or questions:
1. Check the database schema in `queries/schema.sql`
2. Review authentication logic in `backend/controllers/authController.js`
3. Verify frontend routing in `frontend/src/app/login/page.jsx`

---

**Last Updated**: October 17, 2025
**Version**: 1.0
**Author**: BrightBuy Development Team
