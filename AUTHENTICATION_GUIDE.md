# Authentication Setup Guide

This guide explains how to set up and test the authentication system for BrightBuy.

## 🔧 Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

Edit `.env` and update:
```
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=brightbuy
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### 3. Set Up Database
Run the SQL scripts in order:
```bash
# 1. Create database and schema
mysql -u root -p < backend/middleware/schema.sql

# 2. Create test users
mysql -u root -p < backend/middleware/test_users.sql
```

### 4. Start Backend Server
```bash
cd backend
npm run dev
```

Server will run on: http://localhost:5001

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Frontend will run on: http://localhost:3000

## 🧪 Test Credentials

Use these credentials to test the authentication:

### Admin Account
- **Email:** admin@brightbuy.com
- **Password:** password123
- **Redirects to:** /admin/dashboard

### Manager Account
- **Email:** manager@brightbuy.com
- **Password:** password123
- **Redirects to:** /manager/dashboard

### Customer Account
- **Email:** customer@brightbuy.com
- **Password:** password123
- **Redirects to:** / (home page)

## 📡 API Endpoints

### Authentication Routes

#### POST `/api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "admin@brightbuy.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@brightbuy.com",
    "role": "admin"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### POST `/api/auth/register`
Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0771234567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "jwt_token_here",
  "user": {
    "id": 5,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### GET `/api/auth/me`
Get current logged-in user information (requires authentication).

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@brightbuy.com",
    "role": "admin",
    "phone": "0771234567",
    "createdAt": "2025-10-10T10:00:00.000Z",
    "lastLogin": "2025-10-10T12:30:00.000Z"
  }
}
```

## 🔐 Authentication Middleware

The backend includes middleware for protecting routes:

### Available Middleware Functions

1. **`authenticate`** - Verifies JWT token
2. **`authorize(...roles)`** - Checks if user has specific role(s)
3. **`isCustomer`** - Ensures user is a customer
4. **`isStaff`** - Ensures user is admin or manager
5. **`isAdmin`** - Ensures user is admin only

### Example Usage

```javascript
const { authenticate, isAdmin, isStaff } = require('./middleware/authMiddleware');

// Protect a route (any authenticated user)
router.get('/profile', authenticate, profileController.getProfile);

// Admin only route
router.delete('/users/:id', authenticate, isAdmin, userController.deleteUser);

// Staff only route (admin or manager)
router.get('/dashboard', authenticate, isStaff, dashboardController.getStats);

// Multiple roles allowed
router.post('/reports', authenticate, authorize('admin', 'manager'), reportController.create);
```

## 🔄 How Login Works

1. **User enters credentials** on `/login` page
2. **Frontend sends POST request** to `/api/auth/login`
3. **Backend validates** email and password
4. **Backend checks** if password hash matches using bcrypt
5. **Backend generates** JWT token with user info
6. **Frontend stores** token in localStorage
7. **Frontend redirects** based on user role:
   - `customer` → `/` (home)
   - `manager` → `/manager/dashboard`
   - `admin` → `/admin/dashboard`

## 🛡️ Security Features

- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ JWT tokens for authentication
- ✅ Token expiry (7 days)
- ✅ Role-based access control
- ✅ Protected routes with middleware
- ✅ Input validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS enabled for frontend

## 📁 File Structure

```
backend/
├── controllers/
│   └── authController.js       # Login, register, getMe functions
├── middleware/
│   ├── authMiddleware.js       # JWT verification & role checks
│   ├── schema.sql              # Database schema
│   └── test_users.sql          # Test user data
├── routes/
│   └── auth.js                 # Auth API routes
└── server.js                   # Main server file

frontend/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.jsx        # Login page with form
│   │   ├── admin/
│   │   │   └── dashboard/
│   │   │       └── page.jsx    # Admin dashboard
│   │   └── manager/
│   │       └── dashboard/
│   │           └── page.jsx    # Manager dashboard
│   └── lib/
│       └── api.js              # API helper functions
```

## 🐛 Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify database credentials in `.env`
- Ensure database `brightbuy` exists
- Check if port 5001 is available

### Login fails with "Server error"
- Check backend console for errors
- Verify test users are created in database
- Ensure JWT_SECRET is set in `.env`

### Frontend shows CORS error
- Ensure backend has CORS enabled (already configured)
- Check if backend is running on port 5001
- Verify API_BASE_URL in frontend/src/lib/api.js

### Token expired error
- Tokens expire after 7 days
- User needs to login again
- Clear localStorage and login fresh

## 🚀 Next Steps

1. Implement password reset functionality
2. Add email verification
3. Implement refresh tokens
4. Add session management
5. Create customer dashboard
6. Add user profile editing
7. Implement logout on all devices

## 📞 Support

For issues or questions, check the main project README or create an issue in the repository.
