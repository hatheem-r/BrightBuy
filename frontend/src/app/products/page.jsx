// src/app/products/page.jsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

// Product categories for consumer electronics retail chain
const categories = [
  { id: "all", name: "All Products", icon: "🛒" },
  { id: "laptops", name: "Laptops & Computers", icon: "💻" },
  { id: "smartphones", name: "Smartphones & Tablets", icon: "📱" },
  { id: "audio", name: "Audio & Headphones", icon: "🎧" },
  { id: "cameras", name: "Cameras & Photography", icon: "📷" },
  { id: "monitors", name: "Monitors & Displays", icon: "🖥️" },
  { id: "peripherals", name: "Gaming & Peripherals", icon: "🎮" },
  { id: "storage", name: "Storage & Memory", icon: "💾" },
  { id: "networking", name: "Networking & WiFi", icon: "📡" },
  { id: "wearables", name: "Wearables & Smart Devices", icon: "⌚" },
  { id: "power", name: "Power & Charging", icon: "🔋" },
  { id: "accessories", name: "Cables & Accessories", icon: "🔌" },
];

// Dummy data for products - this will come from an API later
const allProducts = [
  {
    id: 1,
    name: "Samsung 1TB NVME SSD",
    rating: 4.5,
    price: "1,999.00",
    categories: ["storage"],
  },
  {
    id: 2,
    name: "Logitech MX Master 3S",
    rating: 4.8,
    price: "8,499.00",
    categories: ["peripherals", "accessories"],
  },
  {
    id: 3,
    name: "Sony WH-1000XM5 Headphones",
    rating: 4.7,
    price: "29,990.00",
    categories: ["audio"],
  },
  {
    id: 4,
    name: "Anker PowerCore 20000",
    rating: 4.6,
    price: "4,500.00",
    categories: ["power", "accessories"],
  },
  {
    id: 5,
    name: 'Dell UltraSharp 27" Monitor',
    rating: 4.9,
    price: "45,000.00",
    categories: ["monitors"],
  },
  {
    id: 6,
    name: "Razer BlackWidow V4 Pro",
    rating: 4.5,
    price: "18,500.00",
    categories: ["peripherals"],
  },
  {
    id: 7,
    name: "Apple iPad Air (5th Gen)",
    rating: 4.8,
    price: "150,000.00",
    categories: ["smartphones"],
  },
  {
    id: 8,
    name: "GoPro HERO12 Black",
    rating: 4.7,
    price: "120,000.00",
    categories: ["cameras"],
  },
  {
    id: 9,
    name: "MacBook Pro M3",
    rating: 4.9,
    price: "285,000.00",
    categories: ["laptops"],
  },
  {
    id: 10,
    name: "Samsung Galaxy S24 Ultra",
    rating: 4.8,
    price: "145,000.00",
    categories: ["smartphones"],
  },
  {
    id: 11,
    name: "TP-Link WiFi 6 Router",
    rating: 4.6,
    price: "12,500.00",
    categories: ["networking"],
  },
  {
    id: 12,
    name: "Apple Watch Series 9",
    rating: 4.7,
    price: "85,000.00",
    categories: ["wearables"],
  },
  {
    id: 13,
    name: "Corsair Vengeance 32GB RAM",
    rating: 4.8,
    price: "18,900.00",
    categories: ["storage", "accessories"],
  },
  {
    id: 14,
    name: "Logitech C920 Webcam",
    rating: 4.5,
    price: "9,500.00",
    categories: ["cameras", "accessories"],
  },
  {
    id: 15,
    name: "USB-C Hub 7-in-1",
    rating: 4.4,
    price: "3,200.00",
    categories: ["accessories"],
  },
];

const ProductCard = ({ product }) => (
  // --- CARD STYLING FIX ---
  <div className="bg-card border border-card-border rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
    <Link href={`/products/${product.id}`}>
      <div className="p-4">
        <div className="h-48 bg-background rounded-md mb-4 flex items-center justify-center">
          <span className="text-text-secondary text-sm">Image</span>
        </div>
        <h3 className="font-semibold text-text-primary truncate">
          {product.name}
        </h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-yellow-500 flex items-center">
            <i className="fas fa-star mr-1"></i> {product.rating}
          </span>
          <span className="font-bold text-lg text-primary">
            Rs. {product.price}
          </span>
        </div>
      </div>
    </Link>
  </div>
);

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return allProducts;
    }
    return allProducts.filter((product) =>
      product.categories.includes(selectedCategory)
    );
  }, [selectedCategory]);

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
            {selectedCategory === "all"
              ? "All Products"
              : categories.find((c) => c.id === selectedCategory)?.name}
          </h1>
          <p className="text-text-secondary mt-2">
            {selectedCategory === "all"
              ? "Browse our curated selection of electronics and gadgets."
              : `Showing ${filteredProducts.length} product${
                  filteredProducts.length !== 1 ? "s" : ""
                } in this category`}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No Products Found
            </h3>
            <p className="text-text-secondary">
              Try selecting a different category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
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
