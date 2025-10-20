// src/contexts/CartContext.jsx
"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { cartAPI } from "@/services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize customer from localStorage on mount and when user changes
  useEffect(() => {
    const storedCustomerId = localStorage.getItem("customer_id");
    
    // Prefer customer_id from authenticated user object
    const effectiveCustomerId = user?.customer_id || storedCustomerId;

    if (effectiveCustomerId && effectiveCustomerId !== customerId) {
      setCustomerId(effectiveCustomerId);
      loadCart(effectiveCustomerId);
    } else if (!effectiveCustomerId && customerId) {
      // User logged out
      setCustomerId(null);
      setCartItems([]);
    }
  }, [user]);

  // Load cart from backend
  const loadCart = async (customerId) => {
    try {
      setLoading(true);
      const response = await cartAPI.getCartDetails(customerId);

      // Transform backend data to match frontend format
      const items = response.items.map((item) => ({
        cart_item_id: item.cart_item_id,
        variant: {
          variant_id: item.variant_id,
          sku: item.sku,
          price: parseFloat(item.price),
          size: item.size,
          color: item.color,
          image_url: item.image_url,
          description: item.variant_description,
          stock_quantity: item.stock_quantity,
          product_id: item.product_id,
          product_name: item.product_name,
          brand: item.brand,
        },
        quantity: item.quantity,
        item_total: parseFloat(item.item_total),
        availability_status: item.availability_status,
      }));

      setCartItems(items);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (productVariant, quantity = 1) => {
    try {
      setLoading(true);

      // Check if user is logged in
      if (!customerId) {
        throw new Error("Please login to add items to cart");
      }

      // Add item to backend
      const response = await cartAPI.addToCart(
        customerId,
        productVariant.variant_id,
        quantity
      );

      // Update local state with response
      const items = response.items.map((item) => ({
        cart_item_id: item.cart_item_id,
        variant: {
          variant_id: item.variant_id,
          sku: item.sku,
          price: parseFloat(item.price),
          size: item.size,
          color: item.color,
          image_url: item.image_url,
          description: item.variant_description,
          stock_quantity: item.stock_quantity,
          product_id: item.product_id,
          product_name: item.product_name,
          brand: item.brand,
        },
        quantity: item.quantity,
        item_total: parseFloat(item.item_total),
        availability_status: item.availability_status,
      }));

      setCartItems(items);
      console.log("Added to cart:", productVariant, "Quantity:", quantity);

      return response;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (variantId) => {
    try {
      setLoading(true);

      if (!customerId) {
        console.error("No customer ID available");
        return;
      }

      const response = await cartAPI.removeCartItem(customerId, variantId);

      // Update local state
      const items = response.items.map((item) => ({
        cart_item_id: item.cart_item_id,
        variant: {
          variant_id: item.variant_id,
          sku: item.sku,
          price: parseFloat(item.price),
          size: item.size,
          color: item.color,
          image_url: item.image_url,
          description: item.variant_description,
          stock_quantity: item.stock_quantity,
          product_id: item.product_id,
          product_name: item.product_name,
          brand: item.brand,
        },
        quantity: item.quantity,
        item_total: parseFloat(item.item_total),
        availability_status: item.availability_status,
      }));

      setCartItems(items);
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (variantId, newQuantity) => {
    try {
      setLoading(true);
      const quantity = parseInt(newQuantity, 10);

      if (!customerId) {
        console.error("No customer ID available");
        return;
      }

      if (quantity < 1) {
        await removeFromCart(variantId);
        return;
      }

      const response = await cartAPI.updateCartItem(
        customerId,
        variantId,
        quantity
      );

      // Update local state
      const items = response.items.map((item) => ({
        cart_item_id: item.cart_item_id,
        variant: {
          variant_id: item.variant_id,
          sku: item.sku,
          price: parseFloat(item.price),
          size: item.size,
          color: item.color,
          description: item.variant_description,
          stock_quantity: item.stock_quantity,
          product_id: item.product_id,
          product_name: item.product_name,
          brand: item.brand,
        },
        quantity: item.quantity,
        item_total: parseFloat(item.item_total),
        availability_status: item.availability_status,
      }));

      setCartItems(items);
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);

      if (customerId) {
        await cartAPI.clearCart(customerId);
      }

      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Set customer (for login)
  const setCustomer = (id) => {
    setCustomerId(id);
    if (id) {
      localStorage.setItem("customer_id", id);
      // Load cart when customer is set
      loadCart(id);
    } else {
      localStorage.removeItem("customer_id");
      setCartItems([]);
    }
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price =
        typeof item.variant.price === "number"
          ? item.variant.price
          : parseFloat(item.variant.price || 0);
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const value = {
    cartItems,
    customerId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    loading,
    setCustomer,
    refreshCart: () => customerId && loadCart(customerId),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
