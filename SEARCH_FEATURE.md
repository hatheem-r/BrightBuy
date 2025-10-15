# Product Search Feature

## Overview

The product search feature provides real-time autocomplete suggestions to help users find products quickly and efficiently.

## Features

### 1. **Autocomplete Search Bar**

- Real-time search suggestions as users type
- Fetches all product names on component mount for fast filtering
- Highlights matching text in suggestions
- Keyboard navigation support (Arrow keys, Enter, Escape)
- Click outside to close suggestions

### 2. **Search Functionality**

- Search by product name or brand
- Redirect to products page with search results
- Click on suggestion to go directly to product detail page

### 3. **Backend API Endpoints**

#### Get Product Names (for Autocomplete)

```
GET /api/products/names
```

- Returns list of all products with `product_id`, `name`, and `brand`
- Used for frontend autocomplete filtering
- Lightweight response for better performance

**Response Example:**

```json
[
  {
    "product_id": 1,
    "name": "iPhone 15 Pro",
    "brand": "Apple"
  },
  {
    "product_id": 2,
    "name": "Samsung Galaxy S24",
    "brand": "Samsung"
  }
]
```

#### Search Products

```
GET /api/products/search?q=searchTerm
```

- Searches products by name or brand (case-insensitive, partial match)
- Returns full product details with variants, inventory, and categories
- Used when displaying search results on products page

**Response Example:**

```json
[
  {
    "product_id": 1,
    "name": "iPhone 15 Pro",
    "brand": "Apple",
    "variant_id": 1,
    "price": "999.99",
    "sku": "IPHONE15PRO-BLK-256",
    "size": "256GB",
    "color": "Black",
    "description": "Latest iPhone with advanced features",
    "stock_quantity": 25,
    "stock_status": "In Stock",
    "categories": "Smartphones,Electronics"
  }
]
```

## Frontend Components

### SearchBar Component (`/frontend/src/components/SearchBar.jsx`)

- Located in the Navbar
- Manages autocomplete state and user interactions
- Features:
  - Debounced filtering for performance
  - Keyboard navigation
  - Highlighted matching text
  - Responsive design
  - Dark mode support

### Products Page Updates (`/frontend/src/app/products/page.jsx`)

- Added support for URL search parameter (`?search=term`)
- Displays search results when search query is present
- Shows appropriate messaging for search results
- Maintains category filtering alongside search

## API Service Updates (`/frontend/src/services/api.js`)

### New API Method

```javascript
getProductNames: async () => {
  const response = await fetch(`${API_BASE_URL}/products/names`);
  if (!response.ok) throw new Error("Failed to fetch product names");
  return response.json();
};
```

## Database Queries

### Get Product Names (Model)

```sql
SELECT DISTINCT
  p.product_id,
  p.name,
  p.brand
FROM Product p
ORDER BY p.name ASC
```

### Search Products (Model)

```sql
SELECT
  p.product_id,
  p.name,
  p.brand,
  pv.variant_id,
  pv.price,
  pv.sku,
  pv.size,
  pv.color,
  pv.description,
  COALESCE(i.quantity, 0) as stock_quantity,
  CASE
    WHEN i.quantity > 10 THEN 'In Stock'
    WHEN i.quantity > 0 THEN 'Low Stock'
    ELSE 'Out of Stock'
  END as stock_status,
  GROUP_CONCAT(DISTINCT c.name) as categories
FROM Product p
LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id AND pv.is_default = 1
LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
LEFT JOIN ProductCategory pc ON p.product_id = pc.product_id
LEFT JOIN Category c ON pc.category_id = c.category_id
WHERE p.name LIKE ? OR p.brand LIKE ?
GROUP BY p.product_id, p.name, p.brand, pv.variant_id, pv.price, pv.sku, pv.size, pv.color, pv.description, i.quantity
ORDER BY p.product_id DESC
```

## User Experience

### Search Flow

1. User types in the search bar
2. Autocomplete suggestions appear (filtered from pre-loaded product names)
3. User can either:
   - Click a suggestion → Navigate to product detail page
   - Press Enter → Navigate to products page with search results
   - Use arrow keys to navigate suggestions → Press Enter to select

### Features

- **Instant Feedback**: Suggestions appear immediately as user types
- **Smart Filtering**: Matches both product name and brand
- **Visual Highlighting**: Matching text is bolded in suggestions
- **Keyboard Friendly**: Full keyboard navigation support
- **Responsive**: Works seamlessly on mobile and desktop
- **Accessible**: Proper focus management and click-outside behavior

## Performance Optimizations

1. **Pre-loading**: Product names are fetched once on component mount
2. **Client-side Filtering**: Fast filtering without additional API calls
3. **Limited Results**: Shows maximum 8 suggestions to prevent overwhelming UI
4. **Debouncing**: Prevents excessive re-renders during typing

## Testing

### Test the Backend API

```bash
# Test product names endpoint
curl http://localhost:5001/api/products/names

# Test search endpoint
curl http://localhost:5001/api/products/search?q=iphone
```

### Manual Testing Checklist

- [ ] Search bar appears in navbar
- [ ] Typing shows autocomplete suggestions
- [ ] Clicking suggestion navigates to product page
- [ ] Pressing Enter performs search
- [ ] Arrow keys navigate suggestions
- [ ] ESC key closes suggestions
- [ ] Clicking outside closes suggestions
- [ ] Search results page displays correctly
- [ ] "No results" message shows for invalid search
- [ ] Dark mode styling works correctly

## Future Enhancements

1. **Advanced Filters**: Add price range, category filters in search
2. **Search History**: Store recent searches
3. **Trending Searches**: Show popular search terms
4. **Fuzzy Search**: Handle typos and misspellings
5. **Search Analytics**: Track search patterns
6. **Voice Search**: Add speech-to-text capability
7. **Product Images**: Show product thumbnails in suggestions
8. **Category Tags**: Display product categories in suggestions

## Files Modified

### Backend

- `/backend/models/productModel.js` - Added `getProductNames()` method
- `/backend/controllers/productController.js` - Added `getProductNames` controller
- `/backend/routes/products.js` - Added `/names` route

### Frontend

- `/frontend/src/components/SearchBar.jsx` - New search component
- `/frontend/src/components/Navbar.jsx` - Integrated search bar
- `/frontend/src/app/products/page.jsx` - Added search query support
- `/frontend/src/services/api.js` - Added `getProductNames()` API method

## Integration Notes

The search feature is fully integrated with:

- Existing product catalog
- Category filtering system
- Inventory management
- Dark mode theming
- Responsive layout

No additional database migrations or dependencies are required.
