# Quick Reference - BrightBuy API Integration (Updated Oct 15, 2025)

## 📋 Quick Start Checklist

### Setup (One-time)

```bash
# 1. Backend Setup
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials

# 2. Database Setup
mysql -u root -p < backend/middleware/schema.sql
mysql -u root -p < backend/middleware/test_users.sql

# 3. Frontend Setup
cd ../frontend
npm install
```

### Running the App

```bash
# Terminal 1: Start Backend
cd backend
npm run dev
# ✅ Backend running on http://localhost:5001

# Terminal 2: Start Frontend
cd frontend
npm run dev
# ✅ Frontend running on http://localhost:3000
```

### Testing Login

```
🌐 Go to: http://localhost:3000/login

📧 Test Accounts:
┌─────────┬──────────────────────────┬──────────────┬────────────────────┐
│ Role    │ Email                    │ Password     │ Redirects To       │
├─────────┼──────────────────────────┼──────────────┼────────────────────┤
│ Admin   │ admin@brightbuy.com      │ password123  │ /admin/dashboard   │
│ Manager │ manager@brightbuy.com    │ password123  │ /manager/dashboard │
│ Customer│ customer@brightbuy.com   │ password123  │ / (home page)      │
└─────────┴──────────────────────────┴──────────────┴────────────────────┘
```

## 🔄 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LOGIN PROCESS                               │
└─────────────────────────────────────────────────────────────────────┘

    FRONTEND                        BACKEND                    DATABASE
    ========                        =======                    ========

1.  User enters
    email/password
    ↓
2.  Click "Sign In"
    ↓
3.  POST /api/auth/login ──────→   Receive credentials
    {email, password}                       ↓
                                    4. Validate input
                                           ↓
                                    5. Query user ─────────→  SELECT * FROM users
                                           ↓                   WHERE email = ?
                                    6. User found? ←──────────  Return user data
                                           ↓
                                    7. bcrypt.compare()
                                       (verify password hash)
                                           ↓
                                    8. Password valid?
                                           ↓
                                    9. Check is_active
                                           ↓
                                    10. Update last_login ────→ UPDATE users
                                           ↓                    SET last_login = NOW()
                                    11. Generate JWT token
                                        (userId, email, role)
                                           ↓
4.  ←────────────────────────────  12. Return response
    {                                   {success, token, user}
      success: true,
      token: "jwt...",
      user: {id, name, email, role}
    }
    ↓
5.  Store in localStorage
    - authToken
    - user info
    ↓
6.  Check user.role
    ↓
7.  Redirect to dashboard:
    • customer  → /
    • manager   → /manager/dashboard
    • admin     → /admin/dashboard
```

## 🛡️ Security Features

```
┌──────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1️⃣  PASSWORD HASHING                                        │
│     • bcryptjs with 10 salt rounds                          │
│     • One-way encryption (cannot be reversed)               │
│     • Secure password storage                               │
│                                                              │
│  2️⃣  JWT TOKENS                                               │
│     • Stateless authentication                              │
│     • Cryptographically signed                              │
│     • 7-day expiration                                      │
│     • Contains: userId, email, role                         │
│                                                              │
│  3️⃣  ROLE-BASED ACCESS CONTROL (RBAC)                        │
│     • Middleware checks user roles                          │
│     • Protected routes (frontend & backend)                 │
│     • Hierarchical permissions                              │
│                                                              │
│  4️⃣  INPUT VALIDATION                                         │
│     • Email format validation                               │
│     • Required field checks                                 │
│     • SQL injection prevention                              │
│                                                              │
│  5️⃣  ERROR HANDLING                                           │
│     • Generic error messages (no info leakage)              │
│     • Proper HTTP status codes                              │
│     • User-friendly error display                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 🔌 API Endpoints

```
┌─────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION APIs                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  POST /api/auth/login                                          │
│  ├─ Description: User login                                    │
│  ├─ Auth: None (public)                                        │
│  ├─ Body: {email, password}                                    │
│  └─ Returns: {success, token, user}                            │
│                                                                 │
│  POST /api/auth/register                                       │
│  ├─ Description: New user registration                         │
│  ├─ Auth: None (public)                                        │
│  ├─ Body: {name, email, password, phone}                       │
│  └─ Returns: {success, token, user}                            │
│                                                                 │
│  GET /api/auth/me                                              │
│  ├─ Description: Get current user info                         │
│  ├─ Auth: Required (Bearer token)                              │
│  ├─ Headers: Authorization: Bearer <token>                     │
│  └─ Returns: {success, user}                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔐 Middleware Usage Examples

```javascript
// Protect any authenticated route
router.get("/profile", authenticate, getProfile);

// Admin only
router.delete("/users/:id", authenticate, isAdmin, deleteUser);

// Staff only (admin OR manager)
router.get("/reports", authenticate, isStaff, getReports);

// Multiple roles allowed
router.post(
  "/inventory",
  authenticate,
  authorize("admin", "manager"),
  updateInventory
);

// Customer only
router.post("/orders", authenticate, isCustomer, createOrder);
```

## 📁 Project Structure

```
BrightBuy/
│
├── backend/
│   ├── controllers/
│   │   └── authController.js      ⭐ Login/Register logic
│   ├── middleware/
│   │   ├── authMiddleware.js      ⭐ JWT verification & RBAC
│   │   ├── schema.sql             📄 Database schema
│   │   └── test_users.sql         📄 Test user data
│   ├── routes/
│   │   └── auth.js                ⭐ Auth API routes
│   └── server.js                  ⭐ Main server
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── login/
│       │   │   └── page.jsx       ⭐ Login UI
│       │   ├── admin/
│       │   │   └── dashboard/
│       │   │       └── page.jsx   ⭐ Admin dashboard
│       │   └── manager/
│       │       └── dashboard/
│       │           └── page.jsx   ⭐ Manager dashboard
│       └── lib/
│           └── api.js             ⭐ API helpers
│
├── AUTHENTICATION_GUIDE.md        📘 Detailed guide
├── IMPLEMENTATION_SUMMARY.md      📘 Complete summary
├── QUICK_REFERENCE.md             📘 This file
└── test_auth.sh                   🧪 Test script
```

## 🧪 Testing Commands

```bash
# Test all endpoints automatically
./test_auth.sh

# Manual cURL tests
# Login as admin
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@brightbuy.com","password":"password123"}'

# Get user info (replace TOKEN)
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## ⚠️ Common Issues & Solutions

```
┌────────────────────────────────────────────────────────────────┐
│ Issue                           │ Solution                     │
├─────────────────────────────────┼──────────────────────────────┤
│ Backend won't start             │ Check MySQL is running       │
│                                 │ Verify .env credentials      │
├─────────────────────────────────┼──────────────────────────────┤
│ "Invalid email or password"     │ Run test_users.sql           │
│                                 │ Use password: password123    │
├─────────────────────────────────┼──────────────────────────────┤
│ CORS error                      │ Ensure backend on port 5001  │
│                                 │ Check API_BASE_URL in api.js │
├─────────────────────────────────┼──────────────────────────────┤
│ Token expired                   │ Login again (7-day expiry)   │
│                                 │ Clear localStorage           │
├─────────────────────────────────┼──────────────────────────────┤
│ Can't access dashboard          │ Check user role in database  │
│                                 │ Verify token is stored       │
└─────────────────────────────────┴──────────────────────────────┘
```

## 🎯 Role Permissions Matrix

```
┌────────────────────────────────────────────────────────────────┐
│ Feature                 │ Customer │ Manager │ Admin           │
├─────────────────────────┼──────────┼─────────┼─────────────────┤
│ Browse Products         │    ✅    │   ✅    │      ✅         │
│ Add to Cart             │    ✅    │   ✅    │      ✅         │
│ Place Orders            │    ✅    │   ✅    │      ✅         │
│ View Own Orders         │    ✅    │   ✅    │      ✅         │
│ Process Orders          │    ❌    │   ✅    │      ✅         │
│ Manage Inventory        │    ❌    │   ✅    │      ✅         │
│ View All Users          │    ❌    │   ❌    │      ✅         │
│ Manage Users            │    ❌    │   ❌    │      ✅         │
│ System Settings         │    ❌    │   ❌    │      ✅         │
│ View Analytics          │    ❌    │   ✅    │      ✅         │
└─────────────────────────┴──────────┴─────────┴─────────────────┘
```

## 🚀 Next Steps

1. ✅ Authentication system complete
2. ⬜ Implement password reset
3. ⬜ Add email verification
4. ⬜ Build customer dashboard
5. ⬜ Implement order management
6. ⬜ Add product management for staff
7. ⬜ Create analytics dashboard
8. ⬜ Implement real-time notifications

---

**Created**: October 10, 2025  
**Status**: ✅ Fully Functional  
**Documentation**: See AUTHENTICATION_GUIDE.md for detailed info
