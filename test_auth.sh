#!/bin/bash

# BrightBuy Authentication Test Script
# This script tests the authentication endpoints

echo "🧪 Testing BrightBuy Authentication API"
echo "========================================"
echo ""

BASE_URL="http://localhost:5001/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Login with admin credentials
echo "📝 Test 1: Admin Login"
echo "Endpoint: POST /api/auth/login"
echo "Credentials: admin@brightbuy.com / password123"
echo ""

ADMIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@brightbuy.com",
    "password": "password123"
  }')

if echo "$ADMIN_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Admin login successful${NC}"
  ADMIN_TOKEN=$(echo "$ADMIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo "Token: ${ADMIN_TOKEN:0:50}..."
else
  echo -e "${RED}❌ Admin login failed${NC}"
  echo "Response: $ADMIN_RESPONSE"
fi
echo ""

# Test 2: Login with manager credentials
echo "📝 Test 2: Manager Login"
echo "Endpoint: POST /api/auth/login"
echo "Credentials: manager@brightbuy.com / password123"
echo ""

MANAGER_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@brightbuy.com",
    "password": "password123"
  }')

if echo "$MANAGER_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Manager login successful${NC}"
  MANAGER_TOKEN=$(echo "$MANAGER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo "Token: ${MANAGER_TOKEN:0:50}..."
else
  echo -e "${RED}❌ Manager login failed${NC}"
  echo "Response: $MANAGER_RESPONSE"
fi
echo ""

# Test 3: Login with customer credentials
echo "📝 Test 3: Customer Login"
echo "Endpoint: POST /api/auth/login"
echo "Credentials: customer@brightbuy.com / password123"
echo ""

CUSTOMER_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@brightbuy.com",
    "password": "password123"
  }')

if echo "$CUSTOMER_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Customer login successful${NC}"
  CUSTOMER_TOKEN=$(echo "$CUSTOMER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo "Token: ${CUSTOMER_TOKEN:0:50}..."
else
  echo -e "${RED}❌ Customer login failed${NC}"
  echo "Response: $CUSTOMER_RESPONSE"
fi
echo ""

# Test 4: Login with wrong password
echo "📝 Test 4: Wrong Password (should fail)"
echo "Endpoint: POST /api/auth/login"
echo "Credentials: admin@brightbuy.com / wrongpassword"
echo ""

WRONG_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@brightbuy.com",
    "password": "wrongpassword"
  }')

if echo "$WRONG_RESPONSE" | grep -q '"success":false'; then
  echo -e "${GREEN}✅ Correctly rejected wrong password${NC}"
else
  echo -e "${RED}❌ Should have rejected wrong password${NC}"
  echo "Response: $WRONG_RESPONSE"
fi
echo ""

# Test 5: Get user info with token
if [ ! -z "$ADMIN_TOKEN" ]; then
  echo "📝 Test 5: Get Current User Info (Admin)"
  echo "Endpoint: GET /api/auth/me"
  echo "With admin token"
  echo ""

  ME_RESPONSE=$(curl -s -X GET "${BASE_URL}/auth/me" \
    -H "Authorization: Bearer ${ADMIN_TOKEN}")

  if echo "$ME_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Successfully retrieved user info${NC}"
    echo "Response: $ME_RESPONSE" | jq '.' 2>/dev/null || echo "$ME_RESPONSE"
  else
    echo -e "${RED}❌ Failed to get user info${NC}"
    echo "Response: $ME_RESPONSE"
  fi
  echo ""
fi

# Test 6: Access protected route without token
echo "📝 Test 6: Access Protected Route Without Token (should fail)"
echo "Endpoint: GET /api/auth/me"
echo "Without token"
echo ""

NO_TOKEN_RESPONSE=$(curl -s -X GET "${BASE_URL}/auth/me")

if echo "$NO_TOKEN_RESPONSE" | grep -q '"success":false'; then
  echo -e "${GREEN}✅ Correctly rejected request without token${NC}"
else
  echo -e "${RED}❌ Should have rejected request without token${NC}"
  echo "Response: $NO_TOKEN_RESPONSE"
fi
echo ""

echo "========================================"
echo "🏁 Testing Complete!"
echo "========================================"
