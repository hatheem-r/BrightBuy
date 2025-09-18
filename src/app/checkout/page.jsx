'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function CheckoutPage() {
    const { cartItems, cartSubtotal, cartCount } = useCart();
    const router = useRouter();
    
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [loadingAuth, setLoadingAuth] = useState(true);

    const [shippingInfo, setShippingInfo] = useState({ firstName: '', lastName: '', address: '', city: '', postalCode: '' });
    const [paymentMethod, setPaymentMethod] = useState('Card Payment');

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        setIsLoggedIn(!!token);
        setLoadingAuth(false);
        
        if (cartCount === 0 && !loadingAuth) {
            router.push('/cart');
        }
    }, [cartCount, router, loadingAuth]);

    const handleInputChange = (e) => {
        setShippingInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        if (!isLoggedIn) { router.push('/login'); return; }
        alert("Order placed successfully! (Simulation)");
    };

    if (loadingAuth) {
        return <div className="text-center py-12">Loading...</div>;
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Side: Shipping & Payment Forms */}
                <div className="bg-card border border-card-border p-8 rounded-lg">
                    <h1 className="text-3xl font-bold text-text-primary mb-6">Checkout</h1>
                    
                    {!isLoggedIn && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-md" role="alert">
                            <p>Please <Link href="/login" className="font-semibold underline">Login</Link> to place an order.</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmitOrder}>
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4 text-text-primary">Shipping Address</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input type="text" name="firstName" placeholder="First Name" onChange={handleInputChange} className="w-full p-3 bg-background border border-card-border rounded-md" />
                                <input type="text" name="lastName" placeholder="Last Name" onChange={handleInputChange} className="w-full p-3 bg-background border border-card-border rounded-md" />
                                <input type="text" name="address" placeholder="Address" onChange={handleInputChange} className="w-full p-3 bg-background border border-card-border rounded-md sm:col-span-2" required/>
                                <input type="text" name="city" placeholder="City" onChange={handleInputChange} className="w-full p-3 bg-background border border-card-border rounded-md" required/>
                                <input type="text" name="postalCode" placeholder="Postal Code" onChange={handleInputChange} className="w-full p-3 bg-background border border-card-border rounded-md" required/>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-text-primary">Payment Method</h2>
                            <div className="space-y-3">
                                <label className="flex items-center p-4 border border-card-border rounded-lg cursor-pointer has-[:checked]:border-secondary has-[:checked]:bg-orange-50 dark:has-[:checked]:bg-secondary/10">
                                    <input type="radio" name="paymentMethod" value="Card Payment" 
                                        checked={paymentMethod === 'Card Payment'} 
                                        onChange={(e) => setPaymentMethod(e.target.value)} 
                                        className="form-radio-custom mr-3" />
                                    <span>Card Payment</span>
                                </label>
                                <label className="flex items-center p-4 border border-card-border rounded-lg cursor-pointer has-[:checked]:border-secondary has-[:checked]:bg-orange-50 dark:has-[:checked]:bg-secondary/10">
                                    <input type="radio" name="paymentMethod" value="Cash on Delivery" 
                                        checked={paymentMethod === 'Cash on Delivery'} 
                                        onChange={(e) => setPaymentMethod(e.target.value)} 
                                        className="form-radio-custom mr-3" />
                                    <span>Cash on Delivery</span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Side: Order Summary */}
                <div className="bg-card p-8 rounded-lg h-fit border border-card-border">
                    <h2 className="text-xl font-semibold border-b border-card-border pb-4 mb-4 text-text-primary">Order Summary</h2>
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.variant.id} className="flex items-center">
                                <div className="w-16 h-16 bg-background rounded-md mr-4 flex-shrink-0 border border-card-border"></div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-text-primary">{item.variant.name || "Product Name"}</p>
                                    <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-text-primary">{formatCurrency(item.variant.price * item.quantity)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-card-border mt-4 pt-4 space-y-2 text-text-secondary">
                        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(cartSubtotal)}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(500)}</span></div>
                        <div className="flex justify-between font-bold text-lg text-text-primary"><span>Total</span><span>{formatCurrency(cartSubtotal + 500)}</span></div>
                    </div>
                    <button onClick={handleSubmitOrder} className="mt-6 w-full bg-secondary text-white py-3 rounded-md font-semibold hover:bg-opacity-90 transition">
                       {isLoggedIn ? 'Place Order' : 'Login to Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
}
