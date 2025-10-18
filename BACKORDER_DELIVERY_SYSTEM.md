# 📦 Enhanced Delivery System - Out-of-Stock Support

## 🎯 New Features

### ✅ **Changes Implemented:**

1. **Allow Backorders**: Customers can now order out-of-stock items
2. **Smart Delivery Calculation**: Automatically adds 3 days for out-of-stock items
3. **Simplified Display**: Shows only days remaining (no hours/minutes/seconds)

---

## 📊 Delivery Time Calculation Rules

### **Formula:**
```
Base Delivery Days = Main City (5 days) OR Other City (7 days)
+ Out-of-Stock Penalty (3 days if any item is out of stock)
= Total Estimated Delivery Days
```

### **Scenarios:**

| Location | Stock Status | Base Days | Penalty | Total Days |
|----------|-------------|-----------|---------|------------|
| Main City (Austin, Dallas, Houston, San Antonio) | ✅ In Stock | 5 | +0 | **5 days** |
| Main City | ❌ Out of Stock | 5 | +3 | **8 days** |
| Other City | ✅ In Stock | 7 | +0 | **7 days** |
| Other City | ❌ Out of Stock | 7 | +3 | **10 days** |

### **Main Cities in Texas:**
- Austin (78701, 78702, etc.)
- Dallas (75001, 75002, etc.)
- Houston (77001, 77002, etc.)
- San Antonio (78201, 78202, etc.)

---

## 🔧 Technical Implementation

### **Backend Changes (`backend/controllers/orderController.js`)**

#### 1. **Stock Check Before Order Creation:**
```javascript
// Check if ANY item in the order is out of stock
let hasOutOfStockItems = false;
for (const item of items) {
  const [inventoryCheck] = await connection.execute(
    `SELECT quantity FROM Inventory WHERE variant_id = ?`,
    [item.variant_id]
  );
  
  if (inventoryCheck[0].quantity < item.quantity) {
    hasOutOfStockItems = true; // Flag for delivery calculation
  }
}
```

#### 2. **Allow Negative Inventory (Backorders):**
```javascript
// Old: Prevented out-of-stock orders
UPDATE Inventory 
SET quantity = quantity - ? 
WHERE variant_id = ? AND quantity >= ?  // ❌ This blocked orders

// New: Allows backorders
UPDATE Inventory 
SET quantity = quantity - ? 
WHERE variant_id = ?  // ✅ Can go negative
```

#### 3. **Smart Delivery Days Calculation:**
```javascript
// Get base days from ZipDeliveryZone
const [deliveryInfo] = await connection.execute(
  `SELECT base_days FROM ZipDeliveryZone WHERE zip_code = ?`,
  [delivery_zip]
);

let estimatedDays = 7; // Default for unknown zip codes
if (deliveryInfo.length > 0) {
  estimatedDays = deliveryInfo[0].base_days; // 5 or 7 days
}

// Add 3 days if any item is out of stock
if (hasOutOfStockItems) {
  estimatedDays += 3;
}

// Save to database
await connection.execute(
  `UPDATE Orders SET estimated_delivery_days = ? WHERE order_id = ?`,
  [estimatedDays, order_id]
);
```

---

### **Frontend Changes (`frontend/src/app/order-tracking/[id]/page.jsx`)**

#### 1. **Simplified Days Calculation:**
```javascript
// Old: Calculated days, hours, minutes, seconds
const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

// New: Only days
const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
```

#### 2. **Display Only Days:**
```jsx
{/* Old Display */}
<div className="grid grid-cols-4 gap-2">
  <div>Days</div>
  <div>Hours</div>
  <div>Minutes</div>
  <div>Seconds</div>
</div>

{/* New Display */}
<div className="flex justify-center">
  <div className="bg-white rounded-lg p-4 shadow-lg">
    <p className="text-5xl font-bold text-primary">
      {getDeliveryCountdown().timeRemaining.days}
    </p>
    <p className="text-sm text-black text-center mt-2">
      {getDeliveryCountdown().timeRemaining.days === 1 ? 'Day' : 'Days'}
    </p>
  </div>
</div>
```

---

## 🗄️ Database Migration

### **Remove Stock Constraint:**
```sql
-- Allow negative inventory for backorders
ALTER TABLE Inventory DROP CONSTRAINT chk_inventory_quantity;
```

**File:** `queries/allow_backorders.sql`

**Run Migration:**
```bash
cd d:\Project\BrightBuy
mysql -u root -p brightbuy < queries/allow_backorders.sql
```

---

## 📝 Examples

### **Example 1: In-Stock Order (Austin)**
```
Customer: Jane Doe
Location: 78701 (Austin, TX - Main City)
Items: 
  - iPhone 15 Pro (Variant #1) - Qty: 1, Stock: 50 ✅
  
Calculation:
  Base Days (Main City): 5
  Out-of-Stock Penalty: 0 (all items in stock)
  Total: 5 days
  
Order Screen Shows:
  "Estimated delivery: 5 days left"
  [5] Days
```

### **Example 2: Out-of-Stock Order (Dallas)**
```
Customer: John Smith
Location: 75001 (Dallas, TX - Main City)
Items:
  - MacBook Pro (Variant #10) - Qty: 2, Stock: 1 ❌
  - Magic Mouse (Variant #15) - Qty: 1, Stock: 100 ✅
  
Calculation:
  Base Days (Main City): 5
  Out-of-Stock Penalty: 3 (MacBook is out of stock)
  Total: 8 days
  
Order Screen Shows:
  "Estimated delivery: 8 days left"
  [8] Days
  
Inventory After Order:
  MacBook Pro: -1 (BACKORDER)
  Magic Mouse: 99 (IN STOCK)
```

### **Example 3: Out-of-Stock Order (Other City)**
```
Customer: Alice Brown
Location: 90210 (Beverly Hills, CA - Other City)
Items:
  - iPad Pro (Variant #20) - Qty: 3, Stock: 0 ❌
  
Calculation:
  Base Days (Other City): 7
  Out-of-Stock Penalty: 3 (iPad is out of stock)
  Total: 10 days
  
Order Screen Shows:
  "Estimated delivery: 10 days left"
  [10] Days
  
Inventory After Order:
  iPad Pro: -3 (BACKORDER)
```

---

## 🎨 UI Changes

### **Before:**
```
┌─────────────────────────────────────┐
│ Estimated delivery: 5 days left     │
│                                     │
│ Time Remaining:                     │
│ ┌────┬────┬────┬────┐              │
│ │ 5  │ 12 │ 34 │ 56 │              │
│ │Days│Hrs │Mins│Secs│              │
│ └────┴────┴────┴────┘              │
└─────────────────────────────────────┘
```

### **After:**
```
┌─────────────────────────────────────┐
│ Estimated delivery: 5 days left     │
│                                     │
│ Days Remaining:                     │
│     ┌───────┐                       │
│     │   5   │                       │
│     │ Days  │                       │
│     └───────┘                       │
└─────────────────────────────────────┘
```

---

## ✅ Benefits

1. **Better Customer Experience:**
   - Customers can order out-of-stock items
   - Clear expectation of delivery time
   - Simpler display (just days)

2. **Business Advantages:**
   - Capture sales even when stock is low
   - Automatic inventory management
   - Smart delivery time calculation

3. **Technical Improvements:**
   - Cleaner code (removed complex time calculations)
   - Better performance (no real-time second updates needed)
   - Accurate delivery estimates

---

## 🧪 Testing Checklist

- [ ] **In-Stock Order (Main City)**: Should show 5 days
- [ ] **In-Stock Order (Other City)**: Should show 7 days
- [ ] **Out-of-Stock Order (Main City)**: Should show 8 days (5+3)
- [ ] **Out-of-Stock Order (Other City)**: Should show 10 days (7+3)
- [ ] **Mixed Order**: One item in stock, one out of stock → Should add 3 days
- [ ] **Store Pickup**: Should show "Ready for pickup at store"
- [ ] **Negative Inventory**: Check that inventory can go negative
- [ ] **Display**: Only days shown (no hours/minutes/seconds)

---

## 🚀 Deployment Steps

1. **Run Database Migration:**
   ```bash
   mysql -u root -p brightbuy < queries/allow_backorders.sql
   ```

2. **Restart Backend Server:**
   ```bash
   cd backend
   npm start
   ```

3. **Test Order Creation:**
   - Create order with in-stock items
   - Create order with out-of-stock items
   - Verify delivery days calculation

4. **Verify Frontend Display:**
   - Check order tracking page
   - Confirm only days are shown
   - Test with different scenarios

---

## 📚 Related Files

- `backend/controllers/orderController.js` - Order creation logic
- `frontend/src/app/order-tracking/[id]/page.jsx` - Order tracking display
- `queries/allow_backorders.sql` - Database migration
- `queries/schema.sql` - Original table definitions

---

**System is now ready to accept backorders and calculate delivery times accurately!** 🎉
