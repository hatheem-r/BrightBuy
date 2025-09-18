// src/app/contact/page.jsx
'use client';
import React from 'react';

export default function ContactPage() {
    return (
        <div className="bg-background">
            <div className="container mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-text-primary">Get In Touch</h1>
                    <p className="text-lg text-text-secondary mt-2">We'd love to hear from you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-primary flex items-center gap-3"><i className="fas fa-map-marker-alt"></i> Address</h3>
                            <p className="text-text-secondary mt-2">123 Electronics Ave, Dallas, Texas, 75201, USA</p>
                        </div>
                         <div>
                            <h3 className="text-xl font-semibold text-primary flex items-center gap-3"><i className="fas fa-phone"></i> Phone</h3>
                            <p className="text-text-secondary mt-2">+1 (123) 456-7890</p>
                        </div>
                         <div>
                            <h3 className="text-xl font-semibold text-primary flex items-center gap-3"><i className="fas fa-envelope"></i> Email</h3>
                            <p className="text-text-secondary mt-2">support@brightbuy.com</p>
                        </div>
                    </div>

                    <div className="bg-card p-8 rounded-lg shadow-md border border-card-border">
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Your Name</label>
                                <input type="text" id="name" className="w-full p-3 bg-background border border-card-border rounded-md" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Your Email</label>
                                <input type="email" id="email" className="w-full p-3 bg-background border border-card-border rounded-md" />
                            </div>
                             <div>
                                <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">Message</label>
                                <textarea id="message" rows="5" className="w-full p-3 bg-background border border-card-border rounded-md"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-secondary text-white py-3 rounded-md font-semibold hover:bg-opacity-90">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}