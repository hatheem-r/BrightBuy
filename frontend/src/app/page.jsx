// src/app/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { productsAPI } from "@/services/api";

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

const ProductCard = ({ product }) => {
  const imageUrl = product.image_url
    ? `http://localhost:5001${product.image_url}`
    : null;
  const stockStatus = product.stock_status || "Out of Stock";

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
                e.target.parentElement.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center">
                    <span class="text-text-secondary text-sm">
                      ${product.brand || "Product Image"}
                    </span>
                  </div>
                `;
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
        </div>
      </Link>
    </div>
  );
};

export default function HomePage() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);
        // Fetch all products from API
        const productsData = await productsAPI.getAllProducts();

        // Filter for in-stock products and limit to 8 items for trending section
        const inStockProducts = productsData
          .filter(
            (product) =>
              product.stock_status === "In Stock" ||
              product.stock_status === "Low Stock"
          )
          .slice(0, 8);

        setTrendingProducts(inStockProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trending products:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

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

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
              <span className="ml-4 text-text-secondary">
                Loading trending products...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">
                Error loading products: {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-opacity-90"
              >
                Retry
              </button>
            </div>
          ) : trendingProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-secondary">
                No products available at the moment.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {trendingProducts.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
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
            </>
          )}
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
