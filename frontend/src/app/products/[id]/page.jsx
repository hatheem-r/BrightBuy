// src/app/products/[id]/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { productsAPI } from "@/services/api";
import BackButton from "@/components/BackButton";

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Check if user is staff
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
      // Allow staff to view product details, just hide buy buttons
    }
  }, [router]);

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
    setSelectedVariant(
      product.variants.find((v) => v.variant_id === variantId)
    );
    setAddedToCart(false);
    setQuantity(1); // Reset quantity when variant changes
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
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const customerId = localStorage.getItem("customer_id");

    if (!token || !customerId) {
      // Redirect to login page if not logged in
      router.push("/login");
      return;
    }

    if (selectedVariant) {
      addToCart(selectedVariant, quantity); // Use selected quantity
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
  };

  const handleBuyNow = async () => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const customerId = localStorage.getItem("customer_id");

    if (!token || !customerId) {
      // Redirect to login page with return URL to checkout
      router.push("/login?redirect=/checkout");
      return;
    }

    if (selectedVariant) {
      // Redirect to checkout with product variant ID and quantity as URL params
      // This allows checkout page to show only this product, not the entire cart
      router.push(
        `/checkout?buyNow=true&variantId=${selectedVariant.variant_id}&quantity=${quantity}`
      );
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-text-primary text-xl">
            Loading product details...
          </p>
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
          <p className="text-text-secondary">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const isInStock = selectedVariant && selectedVariant.stock_quantity > 0;
  const estimatedDelivery = isInStock
    ? "5-7 business days"
    : "8-10 business days";

  const imageUrl = selectedVariant?.image_url
    ? `http://localhost:5001${selectedVariant.image_url}`
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <BackButton variant="outline" label="Back to Products" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-card-border rounded-lg overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${product.name} - ${selectedVariant.color}`}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.parentElement.innerHTML = `
                    <div class="h-96 flex items-center justify-center">
                      <div class="text-center">
                        <span class="text-text-secondary text-lg block">${
                          product.brand || "Product"
                        }</span>
                        <span class="text-text-secondary text-sm">Image Not Available</span>
                      </div>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-text-secondary text-lg block">
                    {product.brand || "Product"}
                  </span>
                  <span className="text-text-secondary text-sm">
                    Image Not Available
                  </span>
                </div>
              </div>
            )}
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
                      ? "In Stock"
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
              ${" "}
              {selectedVariant?.price
                ? parseFloat(selectedVariant.price).toFixed(2)
                : "N/A"}
            </span>
          </div>

          {/* Delivery Information */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                  Estimated Delivery
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  {estimatedDelivery}
                  {!isInStock && (
                    <span className="block mt-1 text-xs text-blue-600 dark:text-blue-500">
                      (Item currently out of stock - will be dispatched once available)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Quantity Selector - Only show for customers, not staff */}
          {userRole !== "staff" && (
            <div className="mb-6">
              <label className="text-md font-semibold text-text-primary mb-2 block">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-card-border rounded-lg overflow-hidden">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="px-4 py-2 bg-card hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityInput}
                    className="w-20 text-center py-2 border-x-2 border-card-border bg-background text-text-primary font-semibold focus:outline-none"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="px-4 py-2 bg-card hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                {isInStock && (
                  <span className="text-sm text-text-secondary">
                    Available
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons - Hide for staff */}
          {userRole !== "staff" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="w-full bg-secondary text-white py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!isInStock}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-lg hover:bg-secondary transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              {addedToCart && (
                <div className="p-3 bg-green-100 border border-green-300 text-green-800 rounded-md text-center">
                  Successfully added {quantity} {quantity === 1 ? "item" : "items"} to cart!
                </div>
              )}
            </div>
          )}

          {/* Staff view - no action buttons */}
          {userRole === "staff" && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You are viewing this as staff. Purchase functionality is disabled.
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Similar Products section can be added here if needed */}
    </div>
  );
}
