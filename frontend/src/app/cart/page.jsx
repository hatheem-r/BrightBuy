// src/app/cart/page.jsx
'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

const formatCurrency = (value) => {
    return `Rs. ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();
    
    return (
        <div className="flex items-center py-4 border-b border-card-border">
            <div className="w-24 h-24 bg-background rounded-md mr-4 flex-shrink-0">
                {/* Image placeholder */}
            </div>
            <div className="flex-grow">
                <h3 className="font-semibold text-primary">{item.variant.name || "Product Name"}</h3>
                <p className="text-sm text-text-secondary">Color: {item.variant.color}, Memory: {item.variant.memory}</p>
                <button onClick={() => removeFromCart(item.variant.id)} className="text-red-500 text-sm hover:underline mt-1">
                    Remove
                </button>
            </div>
            <div className="w-20 mx-4">
                <input type="number"
                    className="w-full border border-card-border rounded-md p-2 text-center bg-background text-text-primary"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.variant.id, parseInt(e.target.value, 10))}
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

    const shippingEstimate = 500.00; // Placeholder
    const total = cartSubtotal + shippingEstimate;

    if (cartCount === 0) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                <h1 className="text-3xl font-bold text-primary mb-2">Your cart is empty</h1>
                <p className="text-text-secondary mb-6">Looks like you haven't added anything to your cart yet.</p>
                <Link href="/" className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-secondary transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-text-primary mb-6">Your Shopping Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-sm border border-card-border">
                    <div className="flex justify-between items-center border-b border-card-border pb-4 mb-4">
                        <h2 className="text-xl font-semibold text-text-primary">Products</h2>
                        <button onClick={clearCart} className="text-text-secondary text-sm hover:text-red-500">Clear Cart</button>
                    </div>
                    {cartItems.map(item => (
                        <CartItem key={item.variant.id} item={item} />
                    ))}
                </div>

                {/* Order Summary */}
                <div className="bg-card p-6 rounded-lg shadow-sm h-fit border border-card-border">
                    <h2 className="text-xl font-semibold text-text-primary border-b border-card-border pb-4 mb-4">Order Summary</h2>
                    <div className="space-y-3 text-text-secondary">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="text-text-primary">{formatCurrency(cartSubtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping (Estimated)</span>
                            <span className="text-text-primary">{formatCurrency(shippingEstimate)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t border-card-border pt-3 mt-3 text-text-primary">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>
                    <Link href="/checkout" className="mt-6 w-full block text-center bg-secondary text-white py-3 rounded-md font-semibold hover:bg-opacity-90 transition">
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}
