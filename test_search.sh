#!/bin/bash

# Test script for the Product Search Feature

echo "==================================="
echo "Testing Product Search Feature"
echo "==================================="
echo ""

API_BASE="http://localhost:5001/api"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Get product names endpoint
echo -e "${YELLOW}Test 1: GET /api/products/names${NC}"
response=$(curl -s -w "\n%{http_code}" "$API_BASE/products/names")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ]; then
    count=$(echo "$body" | grep -o '"product_id"' | wc -l)
    echo -e "${GREEN}✓ PASS${NC} - Status: $http_code"
    echo "  Found $count products"
    echo "  Sample: $(echo "$body" | head -c 150)..."
else
    echo -e "${RED}✗ FAIL${NC} - Status: $http_code"
fi
echo ""

# Test 2: Search for "iPhone"
echo -e "${YELLOW}Test 2: GET /api/products/search?q=iphone${NC}"
response=$(curl -s -w "\n%{http_code}" "$API_BASE/products/search?q=iphone")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $http_code"
    echo "  Results: $(echo "$body" | head -c 200)..."
else
    echo -e "${RED}✗ FAIL${NC} - Status: $http_code"
fi
echo ""

# Test 3: Search for "Samsung"
echo -e "${YELLOW}Test 3: GET /api/products/search?q=samsung${NC}"
response=$(curl -s -w "\n%{http_code}" "$API_BASE/products/search?q=samsung")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ]; then
    count=$(echo "$body" | grep -o '"product_id"' | wc -l)
    echo -e "${GREEN}✓ PASS${NC} - Status: $http_code"
    echo "  Found $count Samsung products"
else
    echo -e "${RED}✗ FAIL${NC} - Status: $http_code"
fi
echo ""

# Test 4: Search with no results
echo -e "${YELLOW}Test 4: GET /api/products/search?q=nonexistent${NC}"
response=$(curl -s -w "\n%{http_code}" "$API_BASE/products/search?q=nonexistent")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ] && [ "$body" = "[]" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $http_code"
    echo "  Correctly returned empty array"
else
    echo -e "${RED}✗ FAIL${NC} - Status: $http_code"
fi
echo ""

# Test 5: Search without query parameter
echo -e "${YELLOW}Test 5: GET /api/products/search (no query)${NC}"
response=$(curl -s -w "\n%{http_code}" "$API_BASE/products/search")
http_code=$(echo "$response" | tail -n 1)

if [ "$http_code" -eq 400 ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $http_code"
    echo "  Correctly rejected request without search term"
else
    echo -e "${RED}✗ FAIL${NC} - Status: $http_code (expected 400)"
fi
echo ""

echo "==================================="
echo "Frontend URLs to Test:"
echo "==================================="
echo "1. Navbar search bar: http://localhost:3000"
echo "2. Search results: http://localhost:3000/products?search=iphone"
echo "3. All products: http://localhost:3000/products"
echo ""
echo "==================================="
echo "Manual Testing Checklist:"
echo "==================================="
echo "[ ] Search bar appears in navbar"
echo "[ ] Typing shows autocomplete suggestions"
echo "[ ] Clicking suggestion navigates to product"
echo "[ ] Pressing Enter performs search"
echo "[ ] Arrow keys navigate suggestions"
echo "[ ] ESC closes suggestions"
echo "[ ] Click outside closes suggestions"
echo "[ ] Search results display correctly"
echo "[ ] Dark mode works properly"
echo ""
