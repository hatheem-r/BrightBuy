# 🎯 QUICK REFERENCE CARD - Staff System

## 🟢 System Status: ALL OPERATIONAL

```
Backend:  http://localhost:5001 ✅
Frontend: http://localhost:3001 ✅
Database: MySQL (localhost:3306) ✅
```

---

## 👥 Test Accounts

### Level01 (Senior - Can manage staff)
```
admin@brightbuy.com : 123456
john@brightbuy.com  : 123456
sarah@brightbuy.com : 123456
```

### Level02 (Normal Staff)
```
mike@brightbuy.com  : 123456
emily@brightbuy.com : 123456
david@brightbuy.com : 123456
```

---

## 📱 Staff Pages

| Page | URL | Both Levels? |
|------|-----|--------------|
| Dashboard | `/staff/dashboard` | ✅ |
| Staff Management | `/staff/manage` | ❌ Level01 only |
| Inventory | `/staff/inventory` | ✅ |
| Customers | `/staff/customers` | ✅ |
| Support | `/staff/support` | ✅ |
| Products Info | `/staff/products` | ✅ |

---

## 🔐 What Staff CANNOT Do

- ❌ See cart icon in navbar
- ❌ See search bar in navbar
- ❌ See "Add to Cart" button
- ❌ See "Buy Now" button
- ❌ Access `/cart` page
- ❌ Access `/checkout` page
- ❌ Make purchases

---

## ✅ What Staff CAN Do

### Level01 & Level02:
- ✅ View product information (read-only)
- ✅ Update inventory levels
- ✅ View customer details
- ✅ View customer orders
- ✅ Manage support tickets
- ✅ View dashboard stats

### Level01 Only:
- ✅ Add new Level01 staff
- ✅ Add new Level02 staff
- ✅ Delete staff members
- ✅ Access Staff Management

---

## 🔌 API Endpoints

```
POST   /api/auth/login
GET    /api/staff/list                    (Level01)
POST   /api/staff/create                  (Level01)
DELETE /api/staff/:staffId                (Level01)
GET    /api/staff/inventory               (Both)
POST   /api/staff/inventory/update        (Both)
GET    /api/staff/customers               (Both)
GET    /api/staff/customers/:customerId   (Both)
```

---

## 🧪 Quick Test

```bash
# 1. Login
Go to: http://localhost:3001/login
Enter: mike@brightbuy.com / 123456

# 2. Verify Restrictions
✅ No cart icon in navbar
✅ No search bar in navbar
✅ See "Staff Dashboard" button

# 3. Test Features
Click "Customer Management"
  ✅ Should show customer list
Click "Customer Support"
  ✅ Should show ticket dashboard
Click "Product Information"
  ✅ Should show products table
  ✅ Click "View Details" on any product
  ✅ Should NOT see buy buttons
  ✅ Should see "view only" message

# 4. Test Level01 (logout and login as admin)
Login: admin@brightbuy.com / 123456
  ✅ Should see "Staff Management ⭐" button
  ✅ Can add new staff
  ✅ Can delete staff
```

---

## 🐛 Common Issues & Fixes

### Issue: Can't login
```bash
Check: Database connection
Fix: Verify DB_PASSWORD=1234 in backend/.env
```

### Issue: Inventory update fails
```bash
Check: Inventory_updates table exists
Fix: Run schema updates in database
```

### Issue: Staff Management not visible
```bash
Check: User is Level01
Fix: Login with admin@brightbuy.com
```

### Issue: Buy buttons still showing for staff
```bash
Check: localStorage has correct user data
Fix: Clear localStorage and re-login
```

---

## 📊 Feature Matrix

| Feature | Customer | Level02 | Level01 |
|---------|----------|---------|---------|
| Browse Products | ✅ | View Only | View Only |
| Add to Cart | ✅ | ❌ | ❌ |
| Checkout | ✅ | ❌ | ❌ |
| Dashboard | ❌ | ✅ | ✅ |
| Manage Staff | ❌ | ❌ | ✅ |
| Update Inventory | ❌ | ✅ | ✅ |
| View Customers | ❌ | ✅ | ✅ |
| Customer Support | ❌ | ✅ | ✅ |

---

## 🎨 UI Indicators

### Staff Level Badges
- 🟣 Purple with ⭐ = Level01 (Senior)
- 🔵 Blue = Level02 (Normal)

### Stock Status
- 🔴 Red = Out of Stock (0)
- 🟠 Orange = Low Stock (<10)
- 🟢 Green = In Stock (≥10)

### Ticket Priority
- 🔴 Red = High
- 🟠 Orange = Medium
- 🟢 Green = Low

### Ticket Status
- 🟡 Yellow = Open
- 🔵 Blue = In Progress
- 🟢 Green = Resolved
- ⚪ Gray = Closed

---

## 🔑 Key Files

```
Backend:
  controllers/staffController.js  (7 functions)
  routes/staff.js                 (7 routes)
  middleware/authMiddleware.js    (5 middleware)

Frontend:
  app/staff/dashboard/page.jsx    (Dashboard)
  app/staff/manage/page.jsx       (Staff mgmt)
  app/staff/inventory/page.jsx    (Inventory)
  app/staff/customers/page.jsx    (Customers)
  app/staff/support/page.jsx      (Support)
  app/staff/products/page.jsx     (Products)
  app/products/[id]/page.jsx      (Details)
  components/Navbar.jsx           (Navigation)
```

---

## ✅ Validation Checklist

- [x] Backend running
- [x] Frontend running
- [x] Database connected
- [x] Can login as Level01
- [x] Can login as Level02
- [x] Staff Management (Level01 only)
- [x] Inventory page works
- [x] Customers page works
- [x] Support page works
- [x] Products page works
- [x] Cart icon hidden for staff
- [x] Search hidden for staff
- [x] Buy buttons hidden for staff
- [x] Staff redirected from cart
- [x] Staff redirected from checkout

---

## 📚 Documentation

- `STAFF_IMPLEMENTATION_COMPLETE.md` - Full guide
- `QUICK_START_GUIDE.md` - Quick setup
- `FIXES_COMPLETE.md` - Recent fixes
- `VALIDATION_REPORT.md` - System check
- `QUICK_REFERENCE_CARD.md` - This card

---

## 🎉 Status: READY FOR USE

**All features implemented ✅**  
**All tests passing ✅**  
**Zero critical issues ✅**

**Last Checked:** 2025-10-17
