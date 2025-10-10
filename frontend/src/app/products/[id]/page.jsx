// src/app/products/[id]/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { getProductById } from "@/lib/api";

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        setSelectedVariant(
          data.variants.find((v) => v.default) || data.variants[0]
        );
        setLoading(false);
      };
      fetchProduct();
    }
  }, [id]);

  const handleVariantChange = (variantId) => {
    setSelectedVariant(product.variants.find((v) => v.id === variantId));
    setAddedToCart(false);
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(selectedVariant, 1);
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
  };

  if (loading || !product)
    return <div className="text-center py-12">Loading...</div>;

  const isInStock = selectedVariant && selectedVariant.stock > 0;
  const estimatedDelivery = isInStock
    ? "5-7 business days"
    : "8-10 business days";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-card-border rounded-lg h-96 flex items-center justify-center">
            <span className="text-text-secondary">Main Image Placeholder</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((_, index) => (
              <div
                key={index}
                className="bg-card h-24 rounded-md border border-card-border cursor-pointer hover:border-secondary"
              ></div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {product.name}
          </h1>
          <div className="flex items-center mb-4 gap-2">
            <span className="text-yellow-500 flex items-center gap-1">
              <i className="fas fa-star"></i>
              {product.rating}
            </span>
            <span className="text-gray-300">|</span>
            <span
              className={`font-semibold ${
                isInStock ? "text-green-600" : "text-red-500"
              }`}
            >
              {isInStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <ul className="list-disc list-inside text-text-secondary mb-6 space-y-1">
            {product.description.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>

          <div className="mb-4">
            <label className="text-md font-semibold text-text-primary">
              Color:{" "}
              <span className="font-normal text-text-secondary">
                {selectedVariant?.color}
              </span>
            </label>
          </div>
          <div className="mb-6">
            <label className="text-md font-semibold text-text-primary mb-2 block">
              Memory:
            </label>
            <div className="flex gap-2">
              {[...new Set(product.variants.map((v) => v.memory))].map(
                (memory) => (
                  <button
                    key={memory}
                    onClick={() =>
                      handleVariantChange(
                        product.variants.find(
                          (v) =>
                            v.memory === memory &&
                            v.color === selectedVariant.color
                        )?.id ||
                          product.variants.find((v) => v.memory === memory).id
                      )
                    }
                    className={`px-4 py-2 rounded-md text-sm font-semibold border-2 ${
                      selectedVariant.memory === memory
                        ? "border-secondary bg-orange-50 text-secondary"
                        : "border-card-border bg-card text-text-primary"
                    }`}
                  >
                    {memory}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="mb-6">
            <span className="text-2xl text-text-secondary line-through mr-3">
              Rs. {selectedVariant?.oldPrice.toFixed(2)}
            </span>
            <span className="text-4xl font-extrabold text-primary">
              Rs. {selectedVariant?.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="w-full bg-secondary text-white py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
            </button>
            <button
              disabled={!isInStock}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-lg hover:bg-secondary transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

          {addedToCart && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-md text-center">
              Successfully added to cart!
            </div>
          )}

          <div className="mt-6 border-t border-card-border pt-4 text-sm text-text-secondary">
            <p>
              <i className="fas fa-truck mr-2"></i> Est. Delivery:{" "}
              <span className="font-semibold">{estimatedDelivery}</span>
            </p>
          </div>
        </div>
      </div>
      {/* Similar Products section can be added here if needed */}
    </div>
  );
}
