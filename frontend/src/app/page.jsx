// src/app/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { productsAPI } from "@/services/api";
import { getImageUrl } from "@/utils/imageUrl";
import TextType from "@/components/TextType";
import Particles from "@/components/Particles";

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
  // Use utility function to handle both CDN URLs and local paths
  const imageUrl = getImageUrl(product.image_url);
  const stockStatus = product.stock_status || "Out of Stock";

  const getStockBadgeStyle = () => {
    if (stockStatus === "In Stock")
      return "bg-green-100 text-green-800 border-green-300";
    if (stockStatus === "Low Stock")
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  return (
    <div className="card bg-card border border-card-border rounded-lg shadow-sm overflow-hidden group">
      <Link href={`/products/${product.product_id}`}>
        <div className="relative h-48 bg-background overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "";
                e.target.style.display = "none";
                // Check if parentElement exists before modifying
                if (e.target.parentElement) {
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center">
                      <span class="text-text-secondary text-sm">
                        ${product.brand || "Product Image"}
                      </span>
                    </div>
                  `;
                }
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
      <section
        className="relative bg-gradient-to-br from-primary via-primary to-secondary py-20 border-b border-card-border overflow-hidden"
        style={{ minHeight: "600px" }}
      >
        {/* Particles Background */}
        <Particles
          particleCount={300}
          particleSpread={12}
          speed={0.15}
          particleColors={["#ffffff", "#fde047", "#FFD700", "#F9560B"]}
          moveParticlesOnHover={true}
          particleHoverFactor={2}
          alphaParticles={true}
          particleBaseSize={120}
          sizeRandomness={1.5}
          cameraDistance={25}
          disableRotation={false}
        />

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-fade-in-up min-h-[100px] flex items-center justify-center">
            <TextType
              text={[
                "Welcome to BrightBuy 🛍️",
                "Premium Electronics 🎧",
                "Latest Tech Gadgets 📱",
                "Best Deals Daily ⚡",
              ]}
              typingSpeed={100}
              pauseDuration={2000}
              deletingSpeed={50}
              showCursor={true}
              cursorCharacter="|"
              cursorClassName="text-yellow-300"
              className="text-5xl md:text-7xl font-extrabold"
              textColors={["#ffffff", "#fde047", "#ffffff", "#fde047"]}
            />
          </div>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 animate-fade-in-up delay-200">
            Your one-stop destination for the latest consumer electronics and
            tech gadgets
          </p>
          <div className="flex justify-center gap-4 animate-fade-in-up delay-300">
            <Link
              href="/products"
              className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
            >
              Shop Now
              <i className="fas fa-arrow-right ml-2"></i>
            </Link>
            <Link
              href="/products"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300"
            >
              Explore
              <i className="fas fa-compass ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Items Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              🔥 Trending Items
            </h2>
            <p className="text-text-secondary text-lg">
              Discover the hottest products everyone's talking about
            </p>
          </div>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {trendingProducts.map((product, index) => (
                  <div
                    key={product.product_id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <div className="text-center animate-fade-in-up delay-500">
                <Link
                  href="/products"
                  className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-12 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  <i className="fas fa-arrow-right mr-2"></i>
                  Explore More Products
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Feature Widgets */}
      <section className="py-16 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureWidgets.map((feature, index) => (
              <div
                key={feature.title}
                className="card text-center p-8 bg-card rounded-2xl border border-card-border shadow-lg hover:shadow-2xl animate-scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-pulse-slow">
                  <i className={`fas ${feature.icon} text-3xl text-white`}></i>
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
