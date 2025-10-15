/**
 * SEARCH FEATURE ARCHITECTURE
 * ===========================
 *
 * Data Flow Diagram:
 *
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │                     USER INTERFACE                           │
 *  │  ┌────────────────────────────────────────────────────────┐ │
 *  │  │              Navbar (SearchBar Component)              │ │
 *  │  │  ┌──────────────────────────────────────────────────┐ │ │
 *  │  │  │  [Search Input]  🔍                              │ │ │
 *  │  │  └──────────────────────────────────────────────────┘ │ │
 *  │  │                      ↓                                  │ │
 *  │  │         ┌────────────────────────┐                     │ │
 *  │  │         │  Autocomplete Dropdown  │                     │ │
 *  │  │         │  - iPhone 15 Pro Max    │                     │ │
 *  │  │         │  - iPhone 14 Pro        │                     │ │
 *  │  │         │  - iPad Pro 12.9"       │                     │ │
 *  │  │         └────────────────────────┘                     │ │
 *  │  └────────────────────────────────────────────────────────┘ │
 *  └─────────────────────────────────────────────────────────────┘
 *                           ↓
 *                    User Actions:
 *                    1. Click Suggestion → /products/:id
 *                    2. Press Enter → /products?search=term
 *
 *
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │                    FRONTEND LAYER                            │
 *  │                                                               │
 *  │  Components:                                                 │
 *  │  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
 *  │  │   SearchBar    │  │   Navbar     │  │  Products Page  │ │
 *  │  │                │  │              │  │                 │ │
 *  │  │ - State Mgmt   │  │ - Integrates │  │ - Handles       │ │
 *  │  │ - Filtering    │  │   SearchBar  │  │   ?search=term  │ │
 *  │  │ - Suggestions  │  │              │  │ - Displays      │ │
 *  │  │ - Keyboard Nav │  │              │  │   Results       │ │
 *  │  └────────────────┘  └──────────────┘  └─────────────────┘ │
 *  │           ↓                                      ↓           │
 *  │  ┌────────────────────────────────────────────────────────┐ │
 *  │  │              API Service (api.js)                      │ │
 *  │  │                                                         │ │
 *  │  │  - getProductNames()     → For autocomplete           │ │
 *  │  │  - searchProducts(term)  → For search results         │ │
 *  │  └────────────────────────────────────────────────────────┘ │
 *  └─────────────────────────────────────────────────────────────┘
 *                           ↓
 *                    HTTP Requests
 *                           ↓
 *
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │                    BACKEND API LAYER                         │
 *  │                                                               │
 *  │  Routes:                                                     │
 *  │  ┌────────────────────────────────────────────────────────┐ │
 *  │  │  GET /api/products/names                               │ │
 *  │  │  GET /api/products/search?q=term                       │ │
 *  │  └────────────────────────────────────────────────────────┘ │
 *  │           ↓                                                  │
 *  │  Controllers:                                                │
 *  │  ┌────────────────────────────────────────────────────────┐ │
 *  │  │  productController.js                                  │ │
 *  │  │  - getProductNames()                                   │ │
 *  │  │  - searchProducts()                                    │ │
 *  │  └────────────────────────────────────────────────────────┘ │
 *  │           ↓                                                  │
 *  │  Models:                                                     │
 *  │  ┌────────────────────────────────────────────────────────┐ │
 *  │  │  ProductModel.js                                       │ │
 *  │  │  - static getProductNames()                            │ │
 *  │  │  - static searchProducts(term)                         │ │
 *  │  └────────────────────────────────────────────────────────┘ │
 *  └─────────────────────────────────────────────────────────────┘
 *                           ↓
 *                    SQL Queries
 *                           ↓
 *
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │                    DATABASE LAYER                            │
 *  │                                                               │
 *  │  Tables:                                                     │
 *  │  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
 *  │  │  Product   │  │  Variant   │  │ Inventory  │            │
 *  │  │            │  │            │  │            │            │
 *  │  │ product_id │  │ variant_id │  │ variant_id │            │
 *  │  │ name       │  │ product_id │  │ quantity   │            │
 *  │  │ brand      │  │ price      │  │            │            │
 *  │  └────────────┘  └────────────┘  └────────────┘            │
 *  └─────────────────────────────────────────────────────────────┘
 *
 *
 * PERFORMANCE OPTIMIZATION:
 * ========================
 *
 * Initial Load:
 * 1. SearchBar mounts → Calls getProductNames()
 * 2. Fetches ~40 products (ID, name, brand only)
 * 3. Stores in component state
 *
 * User Types:
 * 1. Filter stored products client-side
 * 2. No API calls = INSTANT results
 * 3. Show top 8 matches
 *
 * User Selects/Searches:
 * 1. Click suggestion → Navigate to product page
 * 2. Press Enter → Fetch full search results
 *
 *
 * COMPONENT LIFECYCLE:
 * ===================
 *
 * SearchBar Component:
 *
 *  Mount
 *    ↓
 *  useEffect() → Fetch product names
 *    ↓
 *  Store in state [allProducts]
 *    ↓
 *  User types → Update [searchTerm]
 *    ↓
 *  useEffect() → Filter allProducts
 *    ↓
 *  Update [suggestions]
 *    ↓
 *  Render dropdown with suggestions
 *    ↓
 *  User interaction:
 *    - Click → Navigate to product
 *    - Enter → Navigate to search results
 *    - Arrows → Change selection
 *    - Esc → Close dropdown
 *
 *
 * STATE MANAGEMENT:
 * ================
 *
 * SearchBar State:
 * - searchTerm: string           (current input value)
 * - suggestions: array           (filtered product matches)
 * - allProducts: array           (all products from API)
 * - showSuggestions: boolean     (dropdown visibility)
 * - selectedIndex: number        (keyboard navigation)
 *
 *
 * API ENDPOINTS COMPARISON:
 * ========================
 *
 * /api/products/names
 * - Purpose: Autocomplete
 * - Returns: Minimal data (id, name, brand)
 * - Speed: Fast (< 50ms)
 * - Used by: SearchBar on mount
 *
 * /api/products/search?q=term
 * - Purpose: Full search results
 * - Returns: Complete product data (variants, inventory, etc.)
 * - Speed: Medium (100-200ms)
 * - Used by: Products page with search param
 */

export default {
  name: "Product Search Feature",
  version: "1.0.0",
  status: "Implemented",
  components: [
    "SearchBar",
    "Navbar",
    "ProductsPage",
    "ProductModel",
    "ProductController",
  ],
  features: [
    "Real-time autocomplete",
    "Keyboard navigation",
    "Highlighted matching",
    "Search results page",
    "Dark mode support",
    "Mobile responsive",
  ],
};
