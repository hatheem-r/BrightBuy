// src/app/products/page.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { productsAPI, categoriesAPI } from "@/services/api";
import { getImageUrl } from "@/utils/imageUrl";

const ProductCard = ({ product }) => {
  const imageUrl = getImageUrl(product.image_url);
  const stockStatus = product.stock_status || "Out of Stock";
  const stockQuantity = product.stock_quantity || 0;

  const getStockBadgeStyle = () => {
    if (stockStatus === "In Stock")
      return "bg-green-100 text-green-800 border-green-300";
    if (stockStatus === "Low Stock")
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  return (
    <div className="bg-card border border-card-border rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <Link href={`/products/${product.product_id}`}>
        <div className="relative h-48 bg-background overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "";
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-text-secondary text-sm">
                {product.brand || "Product Image"}
              </span>
            </div>
          )}
          {/* Stock Badge */}
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-semibold border ${getStockBadgeStyle()}`}
          >
            {stockStatus}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-text-primary truncate">
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-xs text-text-secondary mb-2">{product.brand}</p>
          )}
          {product.description && (
            <p className="text-xs text-text-secondary mb-2 line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-text-secondary">
              {product.size && <span className="mr-2">{product.size}</span>}
              {product.color && <span>{product.color}</span>}
            </div>
            <span className="font-bold text-lg text-primary">
              ${product.price ? parseFloat(product.price).toFixed(2) : "N/A"}
            </span>
          </div>
          {/* Show low stock warning only when stock is low (not the exact number) */}
          {stockQuantity > 0 && stockQuantity <= 10 && (
            <div className="mt-2 text-xs text-yellow-600 font-medium">
              Low stock - Order soon!
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Sorting and filtering states
  const [sortBy, setSortBy] = useState("default");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // If search query exists, use search API
        let productsData;
        if (searchQuery) {
          productsData = await productsAPI.searchProducts(searchQuery);
        } else {
          productsData = await productsAPI.getAllProducts();
        }

        // Fetch categories
        const categoriesData = await categoriesAPI.getAllCategories();

        setProducts(productsData);

        // Transform categories for display
        const transformedCategories = [
          { id: "all", name: "All Products", icon: "🛒" },
          ...categoriesData.map((cat) => ({
            id: cat.category_id.toString(),
            name: cat.name,
            icon: getCategoryIcon(cat.name),
          })),
        ];

        setCategories(transformedCategories);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  // Helper function to assign icons based on category name
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      Electronics: "⚡",
      "Computers & Laptops": "💻",
      "Mobile Devices": "📱",
      Smartphones: "📱",
      Tablets: "📱",
      Gaming: "🎮",
      Audio: "🎧",
      Headphones: "🎧",
      Speakers: "🔊",
      Wearables: "⌚",
      Smartwatches: "⌚",
      "Fitness Trackers": "🏃",
      "Smart Home": "🏠",
      "Camera & Photography": "📷",
      Accessories: "🔌",
      Storage: "💾",
      "Gaming Consoles": "🎮",
      "Gaming Accessories": "🕹️",
      "Laptop Accessories": "💼",
      "Phone Accessories": "📱",
    };

    return iconMap[categoryName] || "📦";
  };

  // Get unique brands from products
  const availableBrands = useMemo(() => {
    const brands = new Set();
    products.forEach((product) => {
      if (product.brand) {
        brands.add(product.brand);
      }
    });
    return Array.from(brands).sort();
  }, [products]);

  // Filter products based on selected category and brands
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => {
        if (product.category_ids) {
          const categoryIds = product.category_ids.split(",");
          return categoryIds.includes(selectedCategory);
        }
        return false;
      });
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    return filtered;
  }, [products, selectedCategory, selectedBrands]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case "price-desc":
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "newest":
        return sorted.sort((a, b) => b.product_id - a.product_id);
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Toggle brand selection
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedBrands([]);
    setSortBy("default");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-text-primary text-xl">Loading products...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Error Loading Products
          </h3>
          <p className="text-text-secondary">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Horizontal Scrollable Category Navbar */}
      <div className="sticky top-0 z-40 bg-background border-b border-card-border shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap
                  transition-all duration-200 flex-shrink-0
                  ${
                    selectedCategory === category.id
                      ? "bg-primary text-white shadow-md scale-105"
                      : "bg-card text-text-primary border border-card-border hover:border-primary hover:text-primary hover:shadow-sm"
                  }
                `}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium text-sm">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Header with title */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-text-primary mb-2">
            {searchQuery ? (
              <>Search Results for "{searchQuery}"</>
            ) : selectedCategory === "all" ? (
              "All Products"
            ) : (
              categories.find((c) => c.id === selectedCategory)?.name
            )}
          </h1>
          <p className="text-text-secondary">
            {searchQuery
              ? `Found ${sortedProducts.length} product${
                  sortedProducts.length !== 1 ? "s" : ""
                }`
              : selectedCategory === "all"
              ? "Browse our curated selection of electronics and gadgets."
              : `Showing ${sortedProducts.length} product${
                  sortedProducts.length !== 1 ? "s" : ""
                } in this category`}
          </p>
        </div>

        {/* Sorting and Filter Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-card p-4 rounded-lg border border-card-border">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text-primary">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-card-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                showFilters || selectedBrands.length > 0
                  ? "bg-primary text-white"
                  : "bg-background border border-card-border text-text-primary hover:border-primary"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
              {selectedBrands.length > 0 && (
                <span className="bg-white text-primary rounded-full px-2 py-0.5 text-xs font-bold">
                  {selectedBrands.length}
                </span>
              )}
            </button>
          </div>

          {/* Clear Filters Button */}
          {(selectedBrands.length > 0 || sortBy !== "default") && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear Filters
            </button>
          )}
        </div>

        {/* Brand Filters Panel */}
        {showFilters && availableBrands.length > 0 && (
          <div className="mb-6 bg-card p-6 rounded-lg border border-card-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <span>🏷️</span>
              Filter by Brand
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {availableBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-text-primary group-hover:text-primary transition-colors">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">{searchQuery ? "🔍" : "📦"}</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {searchQuery ? "No Results Found" : "No Products Found"}
            </h3>
            <p className="text-text-secondary">
              {searchQuery
                ? `No products match "${searchQuery}". Try a different search term.`
                : selectedBrands.length > 0
                ? "No products match the selected filters. Try different filter options."
                : "Try selecting a different category"}
            </p>
            {(searchQuery || selectedBrands.length > 0) && (
              <div className="mt-4 flex gap-3 justify-center">
                {selectedBrands.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Clear Filters
                  </button>
                )}
                {searchQuery && (
                  <Link
                    href="/products"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    View All Products
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Custom CSS for hiding scrollbar while maintaining scroll functionality */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
