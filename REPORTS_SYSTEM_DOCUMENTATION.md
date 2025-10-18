# 📊 Staff Reports System - Complete Documentation

## Overview
A comprehensive reporting system for BrightBuy staff members (Level01 and Level02). This system provides 8 different types of reports using existing database views and stored procedures without modifying the database schema.

---

## 🎯 Features

### Available Reports

1. **📈 Sales Summary**
   - Total orders, revenue, and unique customers
   - Average order value
   - Top performing category
   - Real-time inventory status overview
   - Filterable by date range

2. **🏆 Top Selling Products**
   - Shows best-performing products by quantity and revenue
   - Ranked list with sales metrics
   - Filterable by date range
   - Uses stored procedure: `GetTopSellingProducts`

3. **📅 Quarterly Sales**
   - Sales breakdown by quarter
   - Total sales and order count per quarter
   - Filterable by year
   - Uses stored procedure: `GetQuarterlySalesByYear`

4. **👥 Customer Order Summary**
   - Complete customer purchase history
   - Total orders and spending per customer
   - Average order value calculation
   - Uses view: `Staff_CustomerOrderSummary`

5. **📦 Inventory Status**
   - Complete stock status of all product variants
   - Filter by: All / In Stock / Low Stock / Out of Stock
   - Shows SKU, product details, and current quantity
   - Color-coded status indicators

6. **🏷️ Category Orders**
   - Total orders per product category
   - Visual cards showing category performance
   - Uses view: `Staff_CategoryOrders`

7. **🔄 Inventory Updates**
   - Recent inventory changes (last 30 days)
   - Shows staff member who made changes
   - Displays quantity changes and notes
   - Audit trail for inventory management

8. **🚚 Delivery Estimates**
   - Order delivery tracking information
   - Estimated delivery dates
   - Filterable by city
   - Uses view: `Staff_OrderDeliveryEstimate`

---

## 🗄️ Database Components Used

### Stored Procedures
```sql
-- Get top N selling products for a date range
CALL GetTopSellingProducts(start_date, end_date, top_n);

-- Get quarterly sales for a specific year
CALL GetQuarterlySalesByYear(year);
```

### Database Views
```sql
-- Category order counts
Staff_CategoryOrders

-- Customer order summary with payment status
Staff_CustomerOrderSummary

-- Order delivery information
Staff_OrderDeliveryEstimate

-- Quarterly sales across all years
Staff_QuarterlySales
```

### Tables Accessed
- `Orders` - Order information
- `Order_item` - Order line items
- `Product` - Product details
- `ProductVariant` - Product variants with SKU
- `ProductCategory` - Product-category relationships
- `Category` - Category information
- `Customer` - Customer data
- `Inventory` - Stock levels
- `Inventory_updates` - Audit trail for inventory changes
- `Staff` - Staff member information
- `Address` - Delivery addresses
- `Payment` - Payment information

---

## 🔌 Backend API Endpoints

### Base URL
```
http://localhost:5001/api/reports
```

### Sales Reports

#### Get Sales Summary
```http
GET /api/reports/sales-summary?startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sales": {
      "total_orders": 150,
      "unique_customers": 45,
      "total_revenue": "15000.00",
      "avg_order_value": "100.00"
    },
    "topCategory": {
      "category_name": "Electronics",
      "order_count": 75
    },
    "inventory": {
      "total_variants": 147,
      "in_stock": 120,
      "out_of_stock": 10,
      "low_stock": 17
    }
  },
  "period": {
    "startDate": "2025-01-01",
    "endDate": "2025-12-31"
  }
}
```

#### Get Top Selling Products
```http
GET /api/reports/top-selling-products?startDate=2025-01-01&endDate=2025-12-31&limit=10
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product_id": 5,
      "product_name": "Smartphone X",
      "total_quantity_sold": 50,
      "total_sales": "25000.00"
    }
  ],
  "period": {
    "startDate": "2025-01-01",
    "endDate": "2025-12-31"
  }
}
```

#### Get Quarterly Sales
```http
GET /api/reports/quarterly-sales?year=2025
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "quarter": 1,
      "total_sales": "5000.00",
      "total_orders": 50
    },
    {
      "quarter": 2,
      "total_sales": "6000.00",
      "total_orders": 60
    }
  ],
  "year": 2025
}
```

#### Get All Quarterly Sales
```http
GET /api/reports/all-quarterly-sales
Authorization: Bearer {token}
```

### Customer Reports

#### Get Customer Order Summary
```http
GET /api/reports/customer-order-summary?limit=50&minOrders=1
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "customer_id": 1,
      "customer_name": "John Doe",
      "total_orders": 5,
      "total_spent": "500.00",
      "payment_statuses": "Order 1: paid; Order 2: paid"
    }
  ]
}
```

#### Get Order Delivery Estimates
```http
GET /api/reports/order-delivery-estimate?city=Austin&limit=100
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "order_id": 1,
      "customer_id": 5,
      "city": "Austin",
      "zip_code": "78701",
      "estimated_delivery_days": 3,
      "order_date": "2025-10-15T00:00:00.000Z",
      "estimated_delivery_date": "2025-10-18T00:00:00.000Z"
    }
  ],
  "filters": {
    "city": "Austin"
  }
}
```

### Inventory Reports

#### Get Inventory Report
```http
GET /api/reports/inventory?status=low_stock&limit=100
Authorization: Bearer {token}
```

**Query Parameters:**
- `status`: `all`, `in_stock`, `low_stock`, `out_of_stock`
- `limit`: Number of records to return

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product_id": 1,
      "product_name": "Laptop Pro",
      "brand": "TechBrand",
      "variant_id": 1,
      "sku": "SKU001",
      "color": "Silver",
      "size": "15-inch",
      "price": "999.99",
      "stock": 5,
      "status": "Low Stock"
    }
  ],
  "filters": {
    "status": "low_stock"
  }
}
```

#### Get Inventory Updates
```http
GET /api/reports/inventory-updates?days=30&limit=50
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "update_id": 1,
      "updated_time": "2025-10-15T10:30:00.000Z",
      "old_quantity": 10,
      "added_quantity": 50,
      "note": "Restocked from supplier",
      "staff_name": "admin_brightbuy",
      "staff_email": "admin@brightbuy.com",
      "product_name": "Laptop Pro",
      "sku": "SKU001",
      "color": "Silver",
      "size": "15-inch"
    }
  ],
  "filters": {
    "days": 30
  }
}
```

### Category Reports

#### Get Category Orders
```http
GET /api/reports/category-orders
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "category_name": "Electronics",
      "total_orders": 150
    }
  ]
}
```

### Helper Endpoints

#### Get Available Years
```http
GET /api/reports/available-years
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "years": [2025, 2024, 2023]
}
```

#### Get Available Cities
```http
GET /api/reports/available-cities
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "cities": ["Austin", "Houston", "Dallas", "San Antonio"]
}
```

---

## 🎨 Frontend Implementation

### Route
```
/staff/reports
```

### Access Control
- ✅ Level01 Staff (admin role)
- ✅ Level02 Staff (normal staff)
- ❌ Customers (no access)

### Features

1. **Report Navigation**
   - 8 clickable report tabs
   - Visual indicators for active report
   - Responsive grid layout

2. **Dynamic Filters**
   - Date range picker for sales reports
   - Year selector for quarterly reports
   - Status filter for inventory
   - City filter for delivery estimates

3. **Real-time Data**
   - Automatic data fetching on report/filter change
   - Loading states with spinners
   - Error handling

4. **Visual Design**
   - Color-coded status indicators
   - Gradient cards for metrics
   - Responsive tables
   - Professional styling with Tailwind CSS

5. **User Experience**
   - Back to Dashboard button
   - Empty state messages
   - Hover effects on tables
   - Mobile-responsive design

---

## 🔐 Security & Authorization

### Authentication Required
All report endpoints require:
```javascript
Authorization: Bearer {JWT_TOKEN}
```

### Role-Based Access
```javascript
// Middleware chain
authenticate → authorizeStaff → controller

// Both Level01 and Level02 staff can access all reports
```

### Token Verification
```javascript
// Token must contain:
{
  userId: number,
  email: string,
  role: "staff",
  staffId: number,
  staffRole: "Level01" | "Level02"
}
```

---

## 📁 File Structure

```
BrightBuy/
├── backend/
│   ├── controllers/
│   │   └── reportsController.js    ⭐ NEW - All report logic
│   ├── routes/
│   │   └── reports.js               ⭐ NEW - Report API routes
│   └── server.js                    ✏️  UPDATED - Added reports route
│
└── frontend/
    └── src/
        └── app/
            └── staff/
                └── reports/
                    └── page.jsx     ⭐ NEW - Reports UI
```

---

## 🚀 Setup & Usage

### Backend Setup

1. **Reports routes are automatically registered** in `server.js`
2. **No database changes required** - Uses existing views and procedures

### Frontend Access

1. **Login as staff member:**
   ```
   Email: admin@brightbuy.com
   Password: 123456
   ```
   Or any Level02 staff account

2. **Navigate to reports:**
   - From staff dashboard, click "View Reports"
   - Or visit: `http://localhost:3000/staff/reports`

3. **Select a report type** from the navigation tabs

4. **Apply filters** as needed (dates, years, status, etc.)

---

## 🧪 Testing the Reports

### Test Accounts

**Level01 Staff:**
```
admin@brightbuy.com : 123456
john@brightbuy.com  : 123456
sarah@brightbuy.com : 123456
```

**Level02 Staff:**
```
mike@brightbuy.com  : 123456
emily@brightbuy.com : 123456
david@brightbuy.com : 123456
```

### Test Scenarios

1. **Sales Summary**
   - Change date range to see different periods
   - Verify calculations match order data

2. **Top Products**
   - Compare rankings with actual order data
   - Test different date ranges

3. **Quarterly Sales**
   - Switch between years
   - Verify Q1-Q4 data appears correctly

4. **Customer Summary**
   - Check if customer totals match order history
   - Verify payment status strings

5. **Inventory Report**
   - Filter by different stock statuses
   - Verify color coding (green/orange/red)

6. **Category Orders**
   - Ensure all categories are listed
   - Verify order counts

7. **Inventory Updates**
   - Check if recent changes appear
   - Verify staff names and timestamps

8. **Delivery Estimates**
   - Filter by different cities
   - Check date calculations

---

## 💡 Key Features

### ✅ No Database Changes
- Uses existing views and stored procedures
- No schema modifications required
- Leverages current database structure

### ✅ Role-Based Access
- Both Level01 and Level02 staff can access
- Proper authentication and authorization
- JWT token validation

### ✅ Comprehensive Data
- 8 different report types
- Multiple data perspectives
- Filterable and customizable

### ✅ Professional UI
- Clean, modern design
- Responsive layout
- Color-coded indicators
- Loading and error states

### ✅ Real-time Updates
- Live data from database
- Automatic refresh on filter changes
- No caching issues

---

## 🔧 Maintenance

### Adding New Reports

1. **Add controller method** in `reportsController.js`:
```javascript
exports.getNewReport = async (req, res) => {
  // Query logic
};
```

2. **Add route** in `routes/reports.js`:
```javascript
router.get("/new-report", authenticate, authorizeStaff, reportsController.getNewReport);
```

3. **Add UI section** in `frontend/src/app/staff/reports/page.jsx`:
```javascript
// Add button in navigation
// Add report rendering section
// Add fetch function
```

### Modifying Existing Reports

1. Update controller in `reportsController.js`
2. Update UI in `page.jsx`
3. Test with staff account

---

## 📊 Report Performance

### Optimization Tips

1. **Use database indexes** (already in place)
2. **Limit result sets** with query parameters
3. **Use views for complex queries** (already implemented)
4. **Add pagination** for large datasets (future enhancement)

### Current Limits
- Top Products: 10 items (configurable)
- Customer Summary: 50 customers (configurable)
- Inventory Updates: 50 records (configurable)
- Delivery Estimates: 50 orders (configurable)

---

## 🎯 Future Enhancements

### Possible Additions
1. **Export to CSV/Excel**
2. **Print-friendly views**
3. **Chart visualizations** (graphs, pie charts)
4. **Date range presets** (This Week, This Month, etc.)
5. **Scheduled reports** (email delivery)
6. **Report favorites/bookmarks**
7. **Advanced filtering** (multi-select, range filters)
8. **Report comparisons** (year-over-year, etc.)

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "Unauthorized" error**
- Solution: Login again to get fresh token
- Check: Token exists in localStorage
- Verify: User role is "staff"

**Issue: No data showing in reports**
- Solution: Check database has orders/products
- Verify: Date ranges include data period
- Check: Filters aren't too restrictive

**Issue: Reports loading slowly**
- Solution: Add database indexes (already done)
- Check: Network connection
- Verify: Backend server running

**Issue: Wrong totals or calculations**
- Solution: Check database views are up to date
- Verify: Order_item table has correct data
- Test: Run SQL queries directly

---

## 📞 Support

For issues or questions:
1. Check database views in `queries/schema.sql`
2. Review controller logic in `backend/controllers/reportsController.js`
3. Test API endpoints with Postman/Thunder Client
4. Verify JWT token in browser DevTools

---

## ✅ Checklist

- [x] Backend controller created
- [x] Backend routes registered
- [x] Frontend reports page implemented
- [x] 8 report types working
- [x] Authentication & authorization
- [x] Responsive design
- [x] Error handling
- [x] Loading states
- [x] Filter functionality
- [x] Documentation complete

---

**Last Updated**: October 19, 2025  
**Version**: 1.0  
**Author**: BrightBuy Development Team
