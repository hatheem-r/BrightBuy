// src/app/page.jsx
"use client";
import React from "react";
import Link from "next/link";

// Dummy data for products
const trendingProducts = [
  { id: 1, name: "Samsung 1TB NVME SSD", rating: 4.5, price: "1,999.00" },
  { id: 2, name: "Logitech MX Master 3S", rating: 4.8, price: "8,499.00" },
  {
    id: 3,
    name: "Sony WH-1000XM5 Headphones",
    rating: 4.7,
    price: "29,990.00",
  },
  { id: 4, name: "Anker PowerCore 20000", rating: 4.6, price: "4,500.00" },
  { id: 5, name: "Apple AirPods Pro", rating: 4.8, price: "24,900.00" },
  { id: 6, name: "Samsung Galaxy Watch 5", rating: 4.5, price: "28,999.00" },
  { id: 7, name: "Dell XPS 15 Laptop", rating: 4.9, price: "189,990.00" },
  { id: 8, name: "iPad Pro 11-inch", rating: 4.7, price: "94,900.00" },
];
// Widget data
const featureWidgets = [
  {
    icon: "fa-microchip",
    title: "Latest Gadgets",
    description: "Cutting-edge tech and electronics.",
  },
  {
    icon: "fa-truck-fast",
    title: "Island-wide Delivery",
    description: "Fast & reliable shipping across Texas.",
  },
  {
    icon: "fa-shield-halved",
    title: "Secure Payments",
    description: "Your transactions are safe with us.",
  },
];

const ProductCard = ({ product }) => (
  <div className="bg-card border border-card-border rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <Link href={`/products/${product.id}`}>
      <div className="p-4">
        <div className="h-48 bg-background rounded-md mb-4"></div>
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

export default function HomePage() {
  return (
    <div>
      {/* Welcome Section */}
      <section className="bg-card py-12 border-b border-card-border">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
            Welcome to BrightBuy
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Your one-stop destination for the latest consumer electronics and
            tech gadgets
          </p>
        </div>
      </section>

      {/* Trending Items Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-8">
            Trending Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary transition-colors text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <i className="fas fa-arrow-right mr-2"></i>
              Explore More
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Widgets */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureWidgets.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 bg-card rounded-lg border border-card-border"
              >
                <i
                  className={`fas ${feature.icon} text-3xl text-secondary mb-4`}
                ></i>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
