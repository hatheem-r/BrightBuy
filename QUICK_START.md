# 🚀 Quick Start Guide - Staff & Customer Login

## ⚡ Start the Application

### 1. Start Backend (Terminal 1):
```bash
cd d:\Project\BrightBuy\backend
npm start
```
**Should see**: `Server running on port 5001`

### 2. Start Frontend (Terminal 2):
```bash
cd d:\Project\BrightBuy\frontend
npm run dev
```
**Should see**: `Ready on http://localhost:3000`

---

## 🧪 Test Accounts - Ready to Use!

### 🌟 LEVEL01 STAFF (Can manage staff)
```
Email: admin@brightbuy.com
Password: 123456
Access: Full staff management + all staff features
```

```
Email: john@brightbuy.com
Password: 123456
Access: Full staff management + all staff features
```

### 👤 LEVEL02 STAFF (Normal staff)
```
Email: mike@brightbuy.com
Password: 123456
Access: Dashboard, reports, inventory (no staff management)
```

```
Email: emily@brightbuy.com
Password: 123456
Access: Dashboard, reports, inventory (no staff management)
```

---

## ✅ Testing Steps

### Test 1: Level01 Staff Login
1. Go to: http://localhost:3000/login
2. Login with: **admin@brightbuy.com** / **123456**
3. ✅ Should see: Staff Dashboard with **Level01** badge
4. ✅ Should see: "⭐ Senior Staff - Staff Management Access"
5. ✅ Should see: Purple **"Staff Management ⭐"** button
6. Click "Staff Management"
7. ✅ Should see: Table with all 6 staff members
8. ✅ Should see: "Add New Staff" button
9. Try adding a new staff member
10. ✅ Success!

### Test 2: Level02 Staff Login
1. Logout (click Logout button)
2. Login with: **mike@brightbuy.com** / **123456**
3. ✅ Should see: Staff Dashboard with **Level02** badge
4. ❌ Should NOT see: "Senior Staff" text
5. ❌ Should NOT see: "Staff Management" button
6. Try accessing: http://localhost:3000/staff/manage
7. ✅ Should redirect back to dashboard (no access)

### Test 3: Customer Login
1. Logout
2. Login with your customer account
3. ✅ Should see: Home page / Shop
4. ✅ Should NOT see: Staff dashboard

---

## 🎯 What Each Role Can Do

### Level01 Staff:
- ✅ View staff dashboard
- ✅ See all statistics
- ✅ Process orders
- ✅ Update inventory
- ✅ Manage customers
- ✅ View reports
- ✅ **Add Level01 staff**
- ✅ **Add Level02 staff**
- ✅ **Delete any staff (except self)**

### Level02 Staff:
- ✅ View staff dashboard
- ✅ See all statistics
- ✅ Process orders
- ✅ Update inventory
- ✅ Manage customers
- ✅ View reports
- ❌ Cannot add staff
- ❌ Cannot delete staff
- ❌ Cannot access staff management

### Customers:
- ✅ Browse products
- ✅ Add to cart
- ✅ Place orders
- ✅ View order history
- ❌ No staff access

---

## 📊 Quick Reference

| Account | Email | Password | Level | Can Manage Staff? |
|---------|-------|----------|-------|-------------------|
| Admin Staff | admin@brightbuy.com | 123456 | Level01 | ✅ Yes |
| Manager John | john@brightbuy.com | 123456 | Level01 | ✅ Yes |
| Manager Sarah | sarah@brightbuy.com | 123456 | Level01 | ✅ Yes |
| Staff Mike | mike@brightbuy.com | 123456 | Level02 | ❌ No |
| Staff Emily | emily@brightbuy.com | 123456 | Level02 | ❌ No |
| Staff David | david@brightbuy.com | 123456 | Level02 | ❌ No |

---

## 🔍 Verification Checklist

After starting the app:

- [ ] Backend running on port 5001
- [ ] Frontend running on port 3000
- [ ] Can access login page
- [ ] Level01 login works
- [ ] Level01 sees "Staff Management" button
- [ ] Staff Management page accessible
- [ ] Can add new staff
- [ ] Can delete staff (not self)
- [ ] Level02 login works
- [ ] Level02 does NOT see "Staff Management" button
- [ ] Level02 cannot access /staff/manage
- [ ] Customer login redirects to home

---

## 🎨 Visual Indicators

### Level01 Staff Dashboard:
```
┌─────────────────────────────────────┐
│ Staff Dashboard                     │
│ Welcome back, admin_brightbuy!      │
│ Staff ID: 7 | Level: Level01        │
│ ⭐ Senior Staff - Staff Mgmt Access │
└─────────────────────────────────────┘

Action Buttons:
┌──────────────────┐ ┌──────────────────┐
│ Staff Management│ │ Process Orders   │
│       ⭐        │ │                  │
└──────────────────┘ └──────────────────┘
  (Purple gradient)    (Blue primary)
```

### Level02 Staff Dashboard:
```
┌─────────────────────────────────────┐
│ Staff Dashboard                     │
│ Welcome back, staff_mike!           │
│ Staff ID: 6 | Level: Level02        │
│ (No senior staff badge)             │
└─────────────────────────────────────┘

Action Buttons:
┌──────────────────┐ ┌──────────────────┐
│ Process Orders   │ │ Update Inventory │
└──────────────────┘ └──────────────────┘
  (No Staff Management button)
```

---

## 🛠️ Troubleshooting

### Issue: "Server error" on login
**Solution**: 
- Check backend terminal for errors
- Verify database password in `backend/.env` is `1234`
- Restart MySQL service
- Restart backend server

### Issue: Staff Management button not showing
**Solution**:
- Verify you're logged in as Level01 (check badge)
- Clear browser cache/localStorage
- Logout and login again
- Check JWT token in localStorage includes `staff_level: "Level01"`

### Issue: Cannot add staff
**Solution**:
- Check backend terminal for errors
- Verify `/api/staff/create` endpoint is working
- Check browser console (F12) for errors
- Ensure backend server was restarted after code changes

---

## 📱 Access URLs

- **Login**: http://localhost:3000/login
- **Staff Dashboard**: http://localhost:3000/staff/dashboard
- **Staff Management**: http://localhost:3000/staff/manage (Level01 only)
- **Home/Shop**: http://localhost:3000/

---

## 🎉 Success!

You now have a fully functional login system with:
- ✅ Single login page for all users
- ✅ Role-based dashboards
- ✅ Staff level permissions (Level01 & Level02)
- ✅ Staff management for Level01 only
- ✅ 6 test accounts ready to use
- ✅ Full backend API
- ✅ Beautiful UI with badges and icons

**Ready to test? Go to http://localhost:3000/login and try logging in!** 🚀

---

**Need Help?** Check `COMPLETE_STAFF_CUSTOMER_LOGIN.md` for full documentation.
