# Staff System - Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Start the Servers

```bash
# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

### Step 2: Test Login

1. Open browser: `http://localhost:3000/login`
2. Use any staff account:
   - **Level01**: `admin@brightbuy.com` / `123456`
   - **Level02**: `mike@brightbuy.com` / `123456`
3. Should redirect to `/staff/dashboard`

### Step 3: Test Each Feature

#### ✅ Inventory Management
- Click "Update Inventory" button
- Search for "laptop" or any product
- Select a product
- Add quantity (e.g., +50) and notes
- Click Update
- ✅ Success message should appear

#### ✅ Customer Details
- Click "Customer Management" button
- Search for customers by name/email
- Click "View Details" on any customer
- ✅ Modal should show customer info, orders, addresses

#### ✅ Customer Support
- Click "Customer Support" button
- Filter tickets by status
- Click any ticket to view details
- Type a response and click "Send Response"
- ✅ Confirmation should appear

#### ✅ Staff Management (Level01 only)
- Click "Staff Management ⭐" button (only for Level01)
- Fill in form to add new staff
- Select Level01 or Level02
- Click "Add Staff Member"
- ✅ New staff should appear in table

#### ✅ Access Restrictions
- Try to access `/products` URL
- ✅ Should auto-redirect to `/staff/dashboard`
- Try to access `/cart` URL
- ✅ Should auto-redirect to `/staff/dashboard`
- Check navbar
- ✅ Cart icon should be hidden
- ✅ Search bar should be hidden

---

## 📋 All Test Accounts

### Level 01 (Senior Staff - Can manage staff)
```
admin@brightbuy.com   : 123456
john@brightbuy.com    : 123456
sarah@brightbuy.com   : 123456
```

### Level 02 (Normal Staff)
```
mike@brightbuy.com    : 123456
emily@brightbuy.com   : 123456
david@brightbuy.com   : 123456
```

---

## 🔍 Quick Verification

### Database Checks

```sql
-- Check staff accounts
SELECT staff_id, user_name, email, role FROM Staff;

-- Check inventory updates by staff
SELECT * FROM Inventory_updates ORDER BY updated_at DESC LIMIT 5;

-- Check customers
SELECT customer_id, first_name, last_name, email FROM Customer LIMIT 5;
```

### API Checks

```bash
# Test login (replace with actual credentials)
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@brightbuy.com","password":"123456"}'

# Test inventory (replace TOKEN with actual JWT)
curl http://localhost:5001/api/staff/inventory \
  -H "Authorization: Bearer TOKEN"

# Test customers (replace TOKEN with actual JWT)
curl http://localhost:5001/api/staff/customers \
  -H "Authorization: Bearer TOKEN"
```

---

## ✨ Key Features Summary

| Feature | Level01 | Level02 | Path |
|---------|---------|---------|------|
| Staff Dashboard | ✅ | ✅ | `/staff/dashboard` |
| Staff Management | ✅ | ❌ | `/staff/manage` |
| Inventory Management | ✅ | ✅ | `/staff/inventory` |
| Customer Details | ✅ | ✅ | `/staff/customers` |
| Customer Support | ✅ | ✅ | `/staff/support` |
| Product Browsing | ❌ | ❌ | Redirects to dashboard |
| Shopping Cart | ❌ | ❌ | Redirects to dashboard |
| Checkout | ❌ | ❌ | Redirects to dashboard |

---

## 🛠️ Troubleshooting

### Issue: Can't login
**Solution:**
```bash
# Check backend is running
curl http://localhost:5001/api/auth/login

# Check database connection
mysql -u root -p1234 -e "SELECT * FROM Staff LIMIT 1;"
```

### Issue: Inventory update fails
**Solution:**
1. Check `Inventory_updates` table exists
2. Verify JWT token in browser DevTools → Application → LocalStorage
3. Check backend console for errors

### Issue: Staff Management not visible
**Solution:**
- Verify you're logged in as Level01
- Check `staff_level` in localStorage user object:
```javascript
console.log(JSON.parse(localStorage.getItem('user')).staff_level)
// Should show: "Level01"
```

### Issue: Pages not redirecting staff
**Solution:**
1. Clear browser cache and localStorage
2. Re-login
3. Check user role:
```javascript
console.log(JSON.parse(localStorage.getItem('user')).role)
// Should show: "staff"
```

---

## 📊 Expected Results

### Dashboard Stats (Mock Data)
- Pending Orders: 15
- Low Stock Items: 5
- Today's Sales: Rs. 8,750
- Total Customers: 234

### Inventory Page
- Should show products with variants
- Stock color-coded: Red (0), Orange (<10), Green (≥10)
- Search should filter products in real-time

### Customers Page
- Should show customer list with order counts
- Total spent displayed for each customer
- Details modal shows orders and addresses

### Support Page
- Shows 3 sample tickets
- Filter buttons work
- Ticket details open in expanded view
- Response submission shows confirmation

---

## 📝 Test Checklist

Use this checklist to verify everything works:

- [ ] Backend starts without errors on port 5001
- [ ] Frontend starts without errors on port 3000
- [ ] Can login with Level01 account
- [ ] Can login with Level02 account
- [ ] Dashboard shows correct staff level badge
- [ ] Staff Management visible for Level01 only
- [ ] Can add new Level01 staff (as Level01)
- [ ] Can add new Level02 staff (as Level01)
- [ ] Cannot delete own staff account
- [ ] Inventory page loads products
- [ ] Can search products by name/SKU
- [ ] Can update inventory with positive quantity
- [ ] Can update inventory with negative quantity
- [ ] Customers page loads customer list
- [ ] Can search customers
- [ ] Customer details modal opens
- [ ] Support page shows tickets
- [ ] Can filter tickets by status
- [ ] Can view ticket details
- [ ] Staff cannot access `/products`
- [ ] Staff cannot access `/cart`
- [ ] Staff cannot access `/checkout`
- [ ] Cart icon hidden in navbar for staff
- [ ] Search bar hidden in navbar for staff
- [ ] Profile button shows "Staff Dashboard" for staff

---

## 🎯 Success Criteria

Your implementation is successful if:

1. ✅ All 6 test staff accounts can login
2. ✅ Level01 can access Staff Management page
3. ✅ Level02 cannot see Staff Management button
4. ✅ Inventory updates reflect in database
5. ✅ Customer details display correctly
6. ✅ Support tickets are manageable
7. ✅ Staff redirected from shopping pages
8. ✅ Navbar doesn't show cart/search for staff

---

## 📚 Related Documentation

- **Full Implementation Guide:** `STAFF_IMPLEMENTATION_COMPLETE.md`
- **API Documentation:** `backend/API_DOCUMENTATION.md`
- **Database Schema:** `assets/DATABASE_UPDATE.md`
- **Previous Staff Docs:** `STAFF_MANAGEMENT_DOCUMENTATION.md`

---

## 🆘 Need Help?

If tests fail:
1. Check backend console for errors
2. Check browser console for errors
3. Verify database connection: `DB_PASSWORD=1234` in `.env`
4. Restart both backend and frontend
5. Clear browser localStorage and try again

---

**Last Updated:** 2025-10-20
**Status:** ✅ All systems operational
