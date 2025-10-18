# Order Management System Implementation

## Overview
Implemented a complete order management system that creates orders in the database, stores order items, and manages inventory when items are purchased.

## Database Structure (No Changes Made)

### Orders Table
```sql
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    address_id INT NULL,
    customer_id INT NOT NULL,
    payment_id INT NULL,
    shipment_id INT NULL,
    delivery_mode ENUM('Standard Delivery', 'Store Pickup') NOT NULL,
    delivery_zip VARCHAR(10) NULL,
    status ENUM('pending', 'paid', 'shipped', 'delivered') DEFAULT 'pending',
    sub_total DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) DEFAULT 0,
    estimated_delivery_days INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Order_item Table
```sql
CREATE TABLE Order_item (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    CONSTRAINT fk_orderitem_variant FOREIGN KEY (variant_id) REFERENCES ProductVariant(variant_id)
);
```

### Payment Table
```sql
CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NULL,
    method ENUM('Cash on Delivery', 'Card Payment') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(255) NULL,
    status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);
```

## Implementation Details

### Backend Components

#### 1. Order Controller (`backend/controllers/orderController.js`)
Created a new controller with the following functions:

- **createOrder**: Creates a new order with order items
  - Validates required fields (customer_id, delivery_mode, items, totals)
  - Uses database transactions for data integrity
  - Inserts order record
  - Inserts order items for each product
  - Deducts quantities from inventory
  - Creates payment record
  - Updates estimated delivery days from ZipDeliveryZone table
  - Returns complete order details with items

- **getOrderById**: Fetches a single order with all details
  - Includes payment information
  - Includes shipping address
  - Includes customer information
  - Lists all order items with product details

- **getOrdersByCustomer**: Gets all orders for a specific customer
  - Ordered by creation date (newest first)
  - Includes item count per order
  - Includes payment status

- **updateOrderStatus**: Updates order status (pending, paid, shipped, delivered)

#### 2. Order Routes (`backend/routes/orders.js`)
Created RESTful API endpoints:

- `POST /api/orders` - Create a new order (authenticated)
- `GET /api/orders/:order_id` - Get order by ID (authenticated)
- `GET /api/orders/customer/:customer_id` - Get customer orders (authenticated)
- `PATCH /api/orders/:order_id/status` - Update order status (authenticated)

#### 3. Server Integration (`backend/server.js`)
Registered the orders routes:
```javascript
app.use('/api/orders', require('./routes/orders'));
```

### Frontend Components

#### 1. Orders API Service (`frontend/src/services/api.js`)
Added ordersAPI module with methods:

- **createOrder**: Creates order with authentication token
- **getOrderById**: Fetches order details
- **getOrdersByCustomer**: Gets all orders for a customer
- **updateOrderStatus**: Updates order status

#### 2. Checkout Page Updates (`frontend/src/app/checkout/page.jsx`)
Enhanced the checkout page to:

- Import and use the ordersAPI
- Prepare order data from checkout items
- Create order items array with variant_id, quantity, and unit_price
- Call the ordersAPI.createOrder with complete order data
- Handle the order creation response
- Show order ID in success message
- Remove purchased items from cart after successful order

### Cart Checkout Enhancements

#### 1. Cart Page (`frontend/src/app/cart/page.jsx`)
Added functionality to:

- Select individual items using checkboxes
- Display selected item count and subtotal
- Pass selected item IDs to checkout via URL parameters
- "Checkout Selected" button only enabled when items are selected
- "Checkout All" button for convenience

#### 2. Checkout Page
Enhanced to handle:

- Selected items from cart (via URL parameters)
- Calculate totals based only on selected items
- Remove only the selected/purchased items from cart after successful checkout
- Support three checkout modes:
  - Buy Now (single product)
  - Buy from Cart (single item from cart)
  - Cart Checkout (multiple selected items)

## Order Creation Flow

1. **User Selects Items**
   - Can select individual cart items or buy now from product page
   - Selected item IDs passed to checkout via URL parameters

2. **Checkout Form**
   - User fills in shipping information (auto-populated if previously saved)
   - Selects payment method (Card or Cash on Delivery)
   - Validates all required fields

3. **Order Processing**
   - Updates customer information (phone number)
   - Saves/updates shipping address
   - Creates order with all items in database
   - Deducts quantities from inventory
   - Creates payment record
   - Links payment to order

4. **Post-Order Actions**
   - Removes purchased items from cart
   - Shows success message with order ID
   - Redirects to home page

## API Request Format

### Create Order Request
```javascript
POST /api/orders
Headers: {
  Authorization: Bearer <token>
}
Body: {
  customer_id: 1,
  address_id: 1,
  delivery_mode: "Standard Delivery",
  delivery_zip: "78701",
  payment_method: "Card Payment",
  items: [
    {
      variant_id: 1,
      quantity: 2,
      unit_price: 999.99
    }
  ],
  sub_total: 1999.98,
  delivery_fee: 5.00,
  total: 2159.98
}
```

### Create Order Response
```javascript
{
  message: "Order created successfully",
  order: {
    order_id: 123,
    customer_id: 1,
    address_id: 1,
    delivery_mode: "Standard Delivery",
    status: "pending",
    sub_total: 1999.98,
    delivery_fee: 5.00,
    total: 2159.98,
    payment_method: "Card Payment",
    payment_status: "pending",
    created_at: "2025-10-17T...",
    items: [
      {
        order_item_id: 1,
        variant_id: 1,
        quantity: 2,
        unit_price: 999.99,
        product_name: "MacBook Pro",
        brand: "Apple",
        sku: "MBP-14-SLV"
      }
    ]
  }
}
```

## Database Transactions

The order creation uses database transactions to ensure data integrity:

1. Begin transaction
2. Insert order record
3. Insert all order items
4. Deduct from inventory (with validation)
5. Create payment record
6. Update estimated delivery
7. Commit transaction
8. If any step fails, rollback all changes

## Inventory Management

- Inventory is automatically deducted when order is created
- Validates sufficient inventory before deduction
- Throws error if insufficient stock
- Updates are atomic within the transaction

## Error Handling

- Validates all required fields before processing
- Checks for sufficient inventory
- Validates delivery mode requirements
- Returns detailed error messages
- Rolls back transaction on any error
- Shows user-friendly error messages on frontend

## Testing Checklist

- [x] Backend server starts without errors
- [x] Frontend server starts without errors
- [x] Orders API endpoints registered
- [ ] Test single product checkout (Buy Now)
- [ ] Test single item from cart checkout
- [ ] Test multiple items checkout from cart
- [ ] Verify order creation in database
- [ ] Verify order items creation
- [ ] Verify inventory deduction
- [ ] Verify payment record creation
- [ ] Verify cart items removal after purchase

## Files Created/Modified

### Created Files:
1. `/backend/controllers/orderController.js` - Order business logic
2. `/backend/routes/orders.js` - Order API routes
3. `/ORDERS_IMPLEMENTATION.md` - This documentation

### Modified Files:
1. `/backend/server.js` - Added orders routes registration
2. `/frontend/src/services/api.js` - Added ordersAPI methods
3. `/frontend/src/app/checkout/page.jsx` - Integrated order creation API
4. `/frontend/src/app/cart/page.jsx` - Added item selection and checkout

## Next Steps

1. Test the complete order flow
2. Add order confirmation page
3. Add order history page for customers
4. Implement order tracking
5. Add email notifications for order status
6. Implement payment gateway integration
7. Add order management for staff/admin

## Notes

- No database schema changes were made
- All existing database triggers and procedures remain intact
- The implementation follows the existing database structure
- Transaction safety ensures data consistency
- Authentication required for all order endpoints
