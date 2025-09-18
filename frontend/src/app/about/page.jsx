// src/app/about/page.jsx
'use client';
import React from 'react';

export default function AboutPage() {
    return (
        <div className="bg-background">
            <div className="container mx-auto px-6 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-primary mb-4">About BrightBuy</h1>
                    <p className="text-lg text-text-secondary leading-relaxed">
                        BrightBuy is a medium-scale consumer electronics retail chain based in Texas, dedicated to bringing the latest technology and gadgets to our community. As we expand into the digital world, our mission remains the same: to provide quality products, exceptional service, and a seamless shopping experience you can trust.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
                    <div className="bg-card p-8 rounded-lg border border-card-border">
                        <i className="fas fa-award text-4xl text-secondary mb-4"></i>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">Quality First</h3>
                        <p className="text-text-secondary">We source and curate a limited, high-quality catalogue to ensure you get the best products available.</p>
                    </div>
                    <div className="bg-card p-8 rounded-lg border border-card-border">
                        <i className="fas fa-headset text-4xl text-secondary mb-4"></i>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">Customer Focused</h3>
                        <p className="text-text-secondary">Your satisfaction is our priority. From browsing to delivery, we're here to help.</p>
                    </div>
                    <div className="bg-card p-8 rounded-lg border border-card-border">
                        <i className="fas fa-truck-fast text-4xl text-secondary mb-4"></i>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">Reliable Delivery</h3>
                        <p className="text-text-secondary">With options for store pickup and standard delivery, we get your order to you safely and on time.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}