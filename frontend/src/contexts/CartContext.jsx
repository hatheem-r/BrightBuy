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

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const storedCartId = localStorage.getItem("cart_id");
    const storedCustomerId = localStorage.getItem("customer_id");

    if (storedCartId) {
      setCartId(storedCartId);
      loadCart(storedCartId);
    }

    if (storedCustomerId) {
      setCustomerId(storedCustomerId);
    }
  }, []);

  // Load cart from backend
  const loadCart = async (id) => {
    try {
      setLoading(true);
      const response = await cartAPI.getCartDetails(id);

      // Transform backend data to match frontend format
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
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get or create cart
  const initializeCart = async (customerId = null) => {
    try {
      // If no cart ID, create a new cart
      if (!cartId) {
        // Get customer_id from localStorage if not provided
        const storedCustomerId =
          customerId || localStorage.getItem("customer_id");

        if (!storedCustomerId) {
          throw new Error("Customer ID required. Please login first.");
        }

        const response = await cartAPI.getOrCreateCart(storedCustomerId);
        const newCartId = response.cart_id;
        setCartId(newCartId);
        localStorage.setItem("cart_id", newCartId);
        return newCartId;
      }
      return cartId;
    } catch (error) {
      console.error("Error initializing cart:", error);
      throw error;
    }
  };

  // Add to cart
  const addToCart = async (productVariant, quantity = 1) => {
    try {
      setLoading(true);

      // Initialize cart if needed
      let currentCartId = cartId;
      if (!currentCartId) {
        currentCartId = await initializeCart(customerId);
      }

      // Add item to backend
      const response = await cartAPI.addToCart(
        currentCartId,
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

      if (!cartId) {
        console.error("No cart ID available");
        return;
      }

      const response = await cartAPI.removeCartItem(cartId, variantId);

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

      if (!cartId) {
        console.error("No cart ID available");
        return;
      }

      if (quantity < 1) {
        await removeFromCart(variantId);
        return;
      }

      const response = await cartAPI.updateCartItem(
        cartId,
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

      if (cartId) {
        await cartAPI.clearCart(cartId);
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
    } else {
      localStorage.removeItem("customer_id");
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
    cartId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    loading,
    setCustomer,
    refreshCart: () => cartId && loadCart(cartId),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
