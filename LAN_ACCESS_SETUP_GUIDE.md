# LAN Access Setup Guide

## Overview

This guide explains how to access the BrightBuy application from other devices on your Local Area Network (LAN).

## What Was Fixed

1. **Backend Configuration**: Server now listens on `0.0.0.0` (all network interfaces) instead of just `localhost`
2. **Frontend Configuration**: All API calls now use environment variables instead of hardcoded `localhost:5001`
3. **CORS Policy**: Already configured to allow all origins

## Configuration

### Server IP Address

Your server's LAN IP: **192.168.8.129**

### Backend Configuration

File: `backend/server.js`

- Listens on: `0.0.0.0:5001` (accessible from LAN)
- CORS: Allows all origins

### Frontend Configuration

File: `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://192.168.8.129:5001/api
```

## How to Use

### On the Server Machine (192.168.8.129)

1. Start the backend:

   ```bash
   cd backend
   npm start
   ```

   You should see:

   ```
   Server running on port 5001
   Local access: http://localhost:5001
   LAN access: http://192.168.8.129:5001
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

### On Other Devices (Same LAN)

Open your browser and navigate to:

```
http://192.168.8.129:3000
```

## Troubleshooting

### Issue: "Cannot connect to server"

**Solution**:

1. Check if both backend and frontend are running
2. Verify your server's IP hasn't changed:
   ```bash
   ip addr show | grep "inet " | grep -v 127.0.0.1
   ```
3. If IP changed, update `frontend/.env.local` with the new IP
4. Restart the frontend server

### Issue: "CORS Error"

**Solution**: Already fixed! CORS is configured to allow all origins in `backend/server.js`

### Issue: "Images not loading"

**Solution**: The `imageUrl.js` utility now uses the environment variable for image URLs

### Issue: Connection refused

**Solution**:

1. Check firewall settings on the server machine
2. Ensure port 5001 (backend) and 3000 (frontend) are allowed
3. On Linux, check with:
   ```bash
   sudo ufw status
   sudo ufw allow 5001
   sudo ufw allow 3000
   ```

## Files Modified

### Backend

- `backend/server.js` - Updated to listen on 0.0.0.0

### Frontend

- `frontend/.env.local` - Environment configuration
- `frontend/src/utils/imageUrl.js` - Dynamic image URLs
- `frontend/src/app/staff/customers/page.jsx` - API calls
- `frontend/src/app/staff/manage/page.jsx` - API calls
- `frontend/src/app/staff/products/page.jsx` - API calls
- `frontend/src/app/staff/orders/page.jsx` - API calls
- `frontend/src/app/staff/inventory/page.jsx` - API calls
- `frontend/src/app/staff/settings/page.jsx` - API calls
- `frontend/src/app/staff/reports/page.jsx` - API calls
- `frontend/src/app/signup/page.jsx` - API calls
- `frontend/src/app/profile/page.jsx` - API calls
- `frontend/src/app/profile/settings/page.jsx` - API calls

## Switching Between Local and LAN Access

### For Local Development (on the same machine):

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### For LAN Access (from other devices):

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://192.168.8.129:5001/api
```

After changing, restart the frontend server:

```bash
cd frontend
npm run dev
```

## Network Requirements

- All devices must be on the same network
- Server machine must have a static or consistent IP (recommended)
- Firewall must allow incoming connections on ports 3000 and 5001

## Security Notes

⚠️ **For Development Only**: This setup is for local development and testing. For production deployment:

- Use HTTPS
- Configure specific CORS origins
- Add proper authentication
- Use environment-specific configurations
- Deploy behind a reverse proxy (nginx, Apache)
