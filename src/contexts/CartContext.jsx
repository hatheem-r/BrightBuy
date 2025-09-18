// src/contexts/CartContext.jsx
'use client';

import React, { createContext, useState, useContext, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (productVariant, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.variant.id === productVariant.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.variant.id === productVariant.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { variant: productVariant, quantity }];
        });
        console.log("Added to cart:", productVariant, "Quantity:", quantity);
    };

    const removeFromCart = (variantId) => {
        setCartItems(prevItems => {
            return prevItems.filter(item => item.variant.id !== variantId);
        });
    };

    const updateQuantity = (variantId, newQuantity) => {
        const quantity = parseInt(newQuantity, 10);
        if (quantity < 1) {
            removeFromCart(variantId);
            return;
        }
        setCartItems(prevItems => {
            return prevItems.map(item =>
                item.variant.id === variantId
                    ? { ...item, quantity: quantity }
                    : item
            );
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    const cartSubtotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.variant.price * item.quantity), 0);
    }, [cartItems]);


    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};