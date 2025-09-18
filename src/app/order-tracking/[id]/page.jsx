// src/app/order-tracking/[id]/page.jsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Mock data for a single order
const mockOrder = {
    id: '2333295502473',
    items: [
        { id: 'v1', name: 'Samsung 1TB NVME SSD', quantity: 2, price: 2999.00 },
        { id: 'v2', name: 'Logitech MX Master 3S', quantity: 1, price: 8499.00 },
    ],
    status: 'Processing',
    estimatedDelivery: '6 more days',
    courierContact: 'ABC@courier.com'
};

const formatCurrency = (value) => `Rs. ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function OrderTrackingPage() {
    const params = useParams();
    const { id } = params; 

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-brightbuy-primary mb-2">Track Your Order</h1>
                    <p className="text-gray-500 mb-6">Order ID: #{mockOrder.id}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Order Status Section */}
                        <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center flex flex-col justify-center items-center">
                            <i className="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
                            <h2 className="text-xl font-semibold text-gray-800">Your order will take {mockOrder.estimatedDelivery} to reach the destination.</h2>
                            <p className="text-sm text-gray-600 mt-2">Contact: {mockOrder.courierContact}</p>
                            <Link href="/" className="mt-6 bg-brightbuy-secondary text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90">
                                Continue Shopping
                            </Link>
                        </div>

                        {/* Order Items Section */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Items in your order:</h3>
                            <div className="space-y-4">
                                {mockOrder.items.map(item => (
                                    <div key={item.id} className="flex items-center">
                                        <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 flex-shrink-0"></div>
                                        <div className="flex-grow">
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t mt-4 pt-4 text-right">
                                <p className="font-bold text-xl">Total Paid: {formatCurrency(mockOrder.items.reduce((acc, item) => acc + (item.price * item.quantity), 0) + 500)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}