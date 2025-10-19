# Search Feature - Quick Reference

## 🚀 Getting Started

### Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Open http://localhost:3000
```

## 📡 API Endpoints

### Get Product Names (NEW)

```bash
curl http://localhost:5001/api/products/names
```

**Returns:** Array of `{product_id, name, brand}`

### Search Products (Existing)

```bash
curl "http://localhost:5001/api/products/search?q=iphone"
```

**Returns:** Array of products with full details

## 🎨 Frontend Components

### SearchBar Component

**Location:** `/frontend/src/components/SearchBar.jsx`

**Props:** None (standalone component)

**Usage:**

```jsx
import SearchBar from "@/components/SearchBar";

<SearchBar />;
```

**Features:**

- Autocomplete dropdown
- Keyboard navigation (↑ ↓ Enter Esc)
- Highlighted matching text
- Click-outside-to-close

### Navbar Integration

**Location:** `/frontend/src/components/Navbar.jsx`

```jsx
<SearchBar />
```

Already integrated!

### Products Page

**Location:** `/frontend/src/app/products/page.jsx`

**URL Patterns:**

- `/products` - All products
- `/products?search=iphone` - Search results
- `/products/:id` - Product detail

## 🔍 How to Use

### For Users:

1. Type in search bar
2. See autocomplete suggestions
3. Click suggestion OR press Enter
4. View product/results

### For Developers:

```javascript
// Import API
import { productsAPI } from "@/services/api";

// Get product names
const names = await productsAPI.getProductNames();

// Search products
const results = await productsAPI.searchProducts("iphone");
```

## 🧪 Testing

### Quick Test

```bash
# Test backend
curl http://localhost:5001/api/products/names

# Test search
curl "http://localhost:5001/api/products/search?q=samsung"

# Run test script
./test_search.sh
```

### Manual Testing Checklist

- [ ] Search bar visible in navbar
- [ ] Typing shows suggestions
- [ ] Click suggestion works
- [ ] Enter key works
- [ ] Arrow keys work
- [ ] Esc closes dropdown
- [ ] Dark mode looks good
- [ ] Mobile responsive

## 📝 Code Snippets

### Add Search to Another Page

```jsx
"use client";
import { useState, useEffect } from "react";
import { productsAPI } from "@/services/api";

export default function MyPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const results = await productsAPI.searchProducts("laptop");
      setProducts(results);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {products.map((p) => (
        <div key={p.product_id}>{p.name}</div>
      ))}
    </div>
  );
}
```

### Custom Search Hook

```javascript
import { useState, useEffect } from "react";
import { productsAPI } from "@/services/api";

export function useProductSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const search = async () => {
      setLoading(true);
      try {
        const data = await productsAPI.searchProducts(query);
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [query]);

  return { results, loading };
}
```

## 🎯 Key Files

### Backend

- `/backend/models/productModel.js` - Database queries
- `/backend/controllers/productController.js` - Business logic
- `/backend/routes/products.js` - API routes

### Frontend

- `/frontend/src/components/SearchBar.jsx` - Search UI
- `/frontend/src/components/Navbar.jsx` - Integration
- `/frontend/src/app/products/page.jsx` - Results page
- `/frontend/src/services/api.js` - API calls

## 🐛 Troubleshooting

### No suggestions appearing

- Check if backend is running (port 5001)
- Check browser console for errors
- Verify API is returning data: `curl http://localhost:5001/api/products/names`

### Search not working

- Check if frontend is running (port 3000)
- Check network tab for failed requests
- Verify search query is being sent

### Styling issues

- Clear browser cache
- Check dark mode toggle
- Verify Tailwind classes are loaded

## 💡 Tips

- **Performance**: Product names are cached on mount
- **Keyboard**: Use arrow keys + Enter for quick navigation
- **Mobile**: Search bar is responsive but may need adjustment
- **Dark Mode**: All components support dark mode
- **Accessibility**: Includes proper focus management

## 📚 Documentation

- Full docs: `SEARCH_FEATURE.md`
- Architecture: `SEARCH_ARCHITECTURE.js`
- Summary: `SEARCH_IMPLEMENTATION_SUMMARY.md`
- Tests: `test_search.sh`

## 🔗 Related Files

```
BrightBuy/
├── backend/
│   ├── models/productModel.js          ⭐ Database queries
│   ├── controllers/productController.js ⭐ API logic
│   └── routes/products.js              ⭐ Routes
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── SearchBar.jsx           ⭐ Search component
│       │   └── Navbar.jsx              ⭐ Integration
│       ├── app/products/page.jsx       ⭐ Results page
│       └── services/api.js             ⭐ API client
└── docs/
    ├── SEARCH_FEATURE.md
    ├── SEARCH_IMPLEMENTATION_SUMMARY.md
    ├── SEARCH_ARCHITECTURE.js
    └── test_search.sh
```

⭐ = Modified/Created for search feature

## ✨ That's It!

The search feature is ready to use. Happy searching! 🔍
