// src/app/products/page.jsx
'use client';

import React from 'react';
import Link from 'next/link';

// Dummy data for products - this will come from an API later
const allProducts = [
  { id: 1, name: 'Samsung 1TB NVME SSD', rating: 4.5, price: '1,999.00' },
  { id: 2, name: 'Logitech MX Master 3S', rating: 4.8, price: '8,499.00' },
  { id: 3, name: 'Sony WH-1000XM5 Headphones', rating: 4.7, price: '29,990.00' },
  { id: 4, name: 'Anker PowerCore 20000', rating: 4.6, price: '4,500.00' },
  { id: 5, name: 'Dell UltraSharp 27" Monitor', rating: 4.9, price: '45,000.00' },
  { id: 6, name: 'Razer BlackWidow V4 Pro', rating: 4.5, price: '18,500.00' },
  { id: 7, name: 'Apple iPad Air (5th Gen)', rating: 4.8, price: '150,000.00' },
  { id: 8, name: 'GoPro HERO12 Black', rating: 4.7, price: '120,000.00' },
];

const ProductCard = ({ product }) => (
  // --- CARD STYLING FIX ---
  <div className="bg-card border border-card-border rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
    <Link href={`/products/${product.id}`}>
      <div className="p-4">
        <div className="h-48 bg-background rounded-md mb-4 flex items-center justify-center">
            <span className="text-text-secondary text-sm">Image</span>
        </div>
        <h3 className="font-semibold text-text-primary truncate">{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-yellow-500 flex items-center">
            <i className="fas fa-star mr-1"></i> {product.rating}
          </span>
          <span className="font-bold text-lg text-primary">Rs. {product.price}</span>
        </div>
      </div>
    </Link>
  </div>
);

export default function ProductsPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-text-primary">All Products</h1>
          <p className="text-text-secondary mt-2">Browse our curated selection of electronics and gadgets.</p>
        </div>
      
        {/* Filters would go here in a future step */}
      
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {allProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}