// src/app/products/page.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { productsAPI, categoriesAPI } from "@/services/api";

const ProductCard = ({ product }) => {
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
        <div className="p-4">
          <div className="h-48 bg-background rounded-md mb-4 flex items-center justify-center relative">
            <span className="text-text-secondary text-sm">
              {product.brand || "Product Image"}
            </span>
            {/* Stock Badge */}
            <div
              className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-semibold border ${getStockBadgeStyle()}`}
            >
              {stockStatus}
            </div>
          </div>
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
          {stockQuantity > 0 && stockQuantity <= 10 && (
            <div className="mt-2 text-xs text-yellow-600 font-medium">
              Only {stockQuantity} left in stock!
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

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }

    // Filter products that have the selected category
    return products.filter((product) => {
      if (product.category_ids) {
        const categoryIds = product.category_ids.split(",");
        return categoryIds.includes(selectedCategory);
      }
      return false;
    });
  }, [products, selectedCategory]);

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
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-text-primary">
            {searchQuery ? (
              <>Search Results for "{searchQuery}"</>
            ) : selectedCategory === "all" ? (
              "All Products"
            ) : (
              categories.find((c) => c.id === selectedCategory)?.name
            )}
          </h1>
          <p className="text-text-secondary mt-2">
            {searchQuery
              ? `Found ${filteredProducts.length} product${
                  filteredProducts.length !== 1 ? "s" : ""
                }`
              : selectedCategory === "all"
              ? "Browse our curated selection of electronics and gadgets."
              : `Showing ${filteredProducts.length} product${
                  filteredProducts.length !== 1 ? "s" : ""
                } in this category`}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">{searchQuery ? "�" : "�📦"}</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {searchQuery ? "No Results Found" : "No Products Found"}
            </h3>
            <p className="text-text-secondary">
              {searchQuery
                ? `No products match "${searchQuery}". Try a different search term.`
                : "Try selecting a different category"}
            </p>
            {searchQuery && (
              <Link
                href="/products"
                className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                View All Products
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
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
