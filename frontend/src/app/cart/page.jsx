// src/app/cart/page.jsx
"use client";

import React, { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/currency';
import BackButton from '@/components/BackButton';
import { getImageUrl } from '@/utils/imageUrl';

const CartItem = ({ item, isSelected, onToggleSelect }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  // Construct image URL similar to products page
  const imageUrl = getImageUrl(item.variant.image_url);

  const handleBuyNow = (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    // Navigate to checkout with this specific item
    router.push(
      `/checkout?buyNow=true&variantId=${item.variant.variant_id}&quantity=${item.quantity}&fromCart=true`
    );
  };

  const handleCardClick = () => {
    // Navigate to product detail page
    if (item.variant.product_id) {
      router.push(`/products/${item.variant.product_id}`);
    }
  };

  return (
    <div
      className="flex items-center py-4 border-b border-card-border hover:bg-background/50 transition-colors rounded-lg px-2 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Checkbox for selection */}
      <div
        className="flex items-center mr-3"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(item.variant.variant_id)}
          className="w-5 h-5 text-secondary border-card-border rounded focus:ring-secondary cursor-pointer"
        />
      </div>

      <div className="w-24 h-24 bg-gray-100 rounded-md mr-4 flex-shrink-0 overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.variant.product_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "";
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center">
                                    <span class="text-gray-400 text-xs text-center px-2">
                                        ${
                                          item.variant.brand || "Product"
                                        }<br/>Image
                                    </span>
                                </div>
                            `;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-xs text-center px-2">
              {item.variant.brand || "Product"}
              <br />
              Image
            </span>
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-primary hover:text-secondary transition-colors">
          {item.variant.product_name || "Product Name"}
        </h3>
        <p className="text-sm text-text-secondary">
          {item.variant.brand && <span>Brand: {item.variant.brand}</span>}
          {item.variant.brand && (item.variant.color || item.variant.size) && (
            <span> • </span>
          )}
          {item.variant.color && <span>Color: {item.variant.color}</span>}
          {item.variant.color && item.variant.size && <span> • </span>}
          {item.variant.size && <span>Size: {item.variant.size}</span>}
        </p>
        <p className="text-xs text-text-secondary mt-1">
          SKU: {item.variant.sku}
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFromCart(item.variant.variant_id);
            }}
            className="text-red-500 text-sm hover:underline"
          >
            Remove
          </button>
          <button
            onClick={handleBuyNow}
            className="text-secondary text-sm font-semibold hover:underline"
          >
            Buy This Now
          </button>
        </div>
      </div>
      <div className="w-20 mx-4">
        <input
          type="number"
          className="w-full border border-card-border rounded-md p-2 text-center bg-background text-text-primary"
          value={item.quantity}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            updateQuantity(
              item.variant.variant_id,
              parseInt(e.target.value, 10)
            );
          }}
          min="1"
        />
      </div>
      <div className="w-24 text-right font-semibold text-text-primary">
        {formatCurrency(item.variant.price * item.quantity)}
      </div>
    </div>
  );
};

export default function CartPage() {
  const { cartItems, cartSubtotal, clearCart, cartCount } = useCart();
  const router = useRouter();

  // State for selected items
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Select all items by default when cart loads
  useEffect(() => {
    if (cartItems.length > 0) {
      const allVariantIds = new Set(
        cartItems.map((item) => item.variant.variant_id)
      );
      setSelectedItems(allVariantIds);
    }
  }, [cartItems]);

  const toggleSelectItem = (variantId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(variantId)) {
        newSet.delete(variantId);
      } else {
        newSet.add(variantId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      const allVariantIds = new Set(
        cartItems.map((item) => item.variant.variant_id)
      );
      setSelectedItems(allVariantIds);
    }
  };

  // Calculate totals for selected items only
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.has(item.variant.variant_id)
  );
  const selectedSubtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );
  const selectedCount = selectedCartItems.length;

  const shippingEstimate = 5.00; // Standard delivery
  const total = selectedSubtotal + shippingEstimate;

  const handleProceedToCheckout = () => {
    if (selectedCount === 0) {
      alert("Please select at least one item to checkout");
      return;
    }

    // Pass selected variant IDs to checkout
    const selectedIds = Array.from(selectedItems).join(",");
    router.push(`/checkout?selectedItems=${selectedIds}`);
  };

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Your cart is empty
        </h1>
        <p className="text-text-secondary mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          href="/"
          className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-secondary transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <BackButton variant="outline" label="Continue Shopping" />
      </div>

      <h1 className="text-3xl font-bold text-text-primary mb-6">
        Your Shopping Cart
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-sm border border-card-border">
          <div className="flex justify-between items-center border-b border-card-border pb-4 mb-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  selectedItems.size === cartItems.length &&
                  cartItems.length > 0
                }
                onChange={toggleSelectAll}
                className="w-5 h-5 text-secondary border-card-border rounded focus:ring-secondary cursor-pointer"
              />
              <h2 className="text-xl font-semibold text-text-primary">
                Products {selectedCount > 0 && `(${selectedCount} selected)`}
              </h2>
            </div>
            <button
              onClick={clearCart}
              className="text-text-secondary text-sm hover:text-red-500"
            >
              Clear Cart
            </button>
          </div>
          {cartItems.map((item) => (
            <CartItem
              key={item.cart_item_id}
              item={item}
              isSelected={selectedItems.has(item.variant.variant_id)}
              onToggleSelect={toggleSelectItem}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-card p-6 rounded-lg shadow-sm h-fit border border-card-border">
          <h2 className="text-xl font-semibold text-text-primary border-b border-card-border pb-4 mb-4">
            Order Summary
          </h2>
          <div className="space-y-3 text-text-secondary">
            <div className="flex justify-between">
              <span>Subtotal ({selectedCount} items)</span>
              <span className="text-text-primary">
                {formatCurrency(selectedSubtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span>Standard Delivery</span>
                <span className="text-xs text-text-secondary">Or choose Store Pickup at checkout</span>
              </div>
              <span className="text-text-primary">
                {formatCurrency(shippingEstimate)}
              </span>
            </div>
            
            {/* Store Pickup Info */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 text-sm">
              <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
                <i className="fas fa-store text-lg"></i>
                <div>
                  <div className="font-semibold">
                    Store Pickup Available 
                    <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded">
                      FREE
                    </span>
                  </div>
                  <div className="text-xs mt-1">
                    Save ${shippingEstimate.toFixed(2)} on delivery! Select at checkout.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between font-bold text-lg border-t border-card-border pt-3 mt-3 text-text-primary">
              <span>Total (with delivery)</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <p className="text-xs text-center text-text-secondary italic">
              Final total depends on delivery option chosen at checkout
            </p>
          </div>
          <button
            onClick={handleProceedToCheckout}
            disabled={selectedCount === 0}
            className={`mt-6 w-full block text-center py-3 rounded-md font-semibold transition ${
              selectedCount === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-secondary text-white hover:bg-opacity-90"
            }`}
          >
            Proceed to Checkout {selectedCount > 0 && `(${selectedCount})`}
          </button>
          {selectedCount === 0 && (
            <p className="text-xs text-text-secondary text-center mt-2">
              Select at least one item to checkout
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
