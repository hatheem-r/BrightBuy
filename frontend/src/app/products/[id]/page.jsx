// src/app/products/[id]/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { productsAPI } from "@/services/api";

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
        try {
          setLoading(true);
          const data = await productsAPI.getProductById(id);
          setProduct(data);
          // Set default variant (is_default = 1) or first variant
          setSelectedVariant(
            data.variants?.find((v) => v.is_default === 1) || data.variants?.[0]
          );
          setLoading(false);
        } catch (error) {
          console.error("Error fetching product:", error);
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleVariantChange = (variantId) => {
    setSelectedVariant(product.variants.find((v) => v.variant_id === variantId));
    setAddedToCart(false);
  };

  // Get unique variant attributes
  const getUniqueAttributes = (attribute) => {
    return [
      ...new Set(product?.variants.map((v) => v[attribute]).filter(Boolean)),
    ];
  };

  // Find best matching variant when switching attributes
  const findMatchingVariant = (attributeType, attributeValue) => {
    // Try to find variant with same other attributes
    const candidates = product.variants.filter(
      (v) => v[attributeType] === attributeValue
    );

    if (candidates.length === 1) return candidates[0].variant_id;

    // Try to match other attributes from current selection
    const bestMatch = candidates.find((v) => {
      if (attributeType !== "color" && v.color === selectedVariant?.color)
        return true;
      if (attributeType !== "size" && v.size === selectedVariant?.size)
        return true;
      return false;
    });

    return bestMatch ? bestMatch.variant_id : candidates[0].variant_id;
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-text-primary text-xl">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Product Not Found
          </h3>
          <p className="text-text-secondary">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isInStock = selectedVariant && selectedVariant.stock_quantity > 0;
  const estimatedDelivery = isInStock
    ? "5-7 business days"
    : "8-10 business days";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-card-border rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <span className="text-text-secondary text-lg block">{product.brand || "Product"}</span>
              <span className="text-text-secondary text-sm">Image Placeholder</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {product.name}
          </h1>
          {product.brand && (
            <p className="text-lg text-text-secondary mb-4">
              by <span className="font-semibold">{product.brand}</span>
            </p>
          )}
          <div className="flex items-center mb-4 gap-2">
            <span
              className={`font-semibold ${
                isInStock ? "text-green-600" : "text-red-500"
              }`}
            >
              {isInStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          {selectedVariant?.description && (
            <div className="text-text-secondary mb-6">
              <p>{selectedVariant.description}</p>
            </div>
          )}

          {/* Variant Selection Section */}
          {product.variants && product.variants.length > 1 && (
            <div className="mb-6 p-4 bg-card border border-card-border rounded-lg">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Choose Your Variant
              </h3>

              {/* Color Selection */}
              {getUniqueAttributes("color").length > 0 && (
                <div className="mb-4">
                  <label className="text-md font-semibold text-text-primary mb-2 block">
                    Color:{" "}
                    <span className="font-normal text-text-secondary">
                      {selectedVariant?.color}
                    </span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {getUniqueAttributes("color").map((color) => {
                      const isAvailable = product.variants.some(
                        (v) => v.color === color && v.stock_quantity > 0
                      );
                      const isSelected = selectedVariant?.color === color;

                      return (
                        <button
                          key={color}
                          onClick={() =>
                            handleVariantChange(
                              findMatchingVariant("color", color)
                            )
                          }
                          disabled={!isAvailable}
                          className={`px-4 py-2 rounded-md text-sm font-semibold border-2 transition-all ${
                            isSelected
                              ? "border-secondary bg-secondary text-white shadow-md"
                              : isAvailable
                              ? "border-card-border bg-card text-text-primary hover:border-primary"
                              : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {color}
                          {!isAvailable && (
                            <span className="ml-1 text-xs">(Out of Stock)</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}



              {/* Size Selection */}
              {getUniqueAttributes("size").length > 0 && (
                <div className="mb-4">
                  <label className="text-md font-semibold text-text-primary mb-2 block">
                    Size:{" "}
                    <span className="font-normal text-text-secondary">
                      {selectedVariant?.size}
                    </span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {getUniqueAttributes("size").map((size) => {
                      const isAvailable = product.variants.some(
                        (v) => v.size === size && v.stock_quantity > 0
                      );
                      const isSelected = selectedVariant?.size === size;

                      return (
                        <button
                          key={size}
                          onClick={() =>
                            handleVariantChange(
                              findMatchingVariant("size", size)
                            )
                          }
                          disabled={!isAvailable}
                          className={`px-4 py-2 rounded-md text-sm font-semibold border-2 transition-all ${
                            isSelected
                              ? "border-secondary bg-secondary text-white shadow-md"
                              : isAvailable
                              ? "border-card-border bg-card text-text-primary hover:border-primary"
                              : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {size}
                          {!isAvailable && (
                            <span className="ml-1 text-xs">(Out of Stock)</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Selected Variant Info */}
              <div className="mt-4 pt-4 border-t border-card-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">
                    SKU:{" "}
                    <span className="font-mono">{selectedVariant?.sku}</span>
                  </span>
                  <span
                    className={`font-semibold ${
                      selectedVariant?.stock_quantity > 0
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {selectedVariant?.stock_quantity > 0
                      ? `${selectedVariant.stock_quantity} in stock`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Single Variant Info */}
          {product.variants && product.variants.length === 1 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <i className="fas fa-info-circle mr-2"></i>
                This product has only one variant available
              </p>
            </div>
          )}

          <div className="mb-6">
            <span className="text-4xl font-extrabold text-primary">
              ${selectedVariant?.price ? parseFloat(selectedVariant.price).toFixed(2) : 'N/A'}
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
