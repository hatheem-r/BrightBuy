"use client";

import React, { useMemo, useState } from 'react';

const initialProducts = [
  { id: 1, name: 'USB-C Cable 1m', category: 'Cables' },
  { id: 2, name: 'Wireless Mouse', category: 'Peripherals' },
  { id: 3, name: 'Mechanical Keyboard', category: 'Peripherals' },
  { id: 4, name: '27" Monitor', category: 'Displays' },
  { id: 5, name: 'Portable Charger 10000mAh', category: 'Power' },
  { id: 6, name: 'Bluetooth Speaker', category: 'Audio' },
];

export default function InventoryPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState(initialProducts);

  // simple case-insensitive search over name and category
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p => {
      return (
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    });
  }, [query, products]);

  const addDummy = () => {
    const nextId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const samples = [
      { name: 'Gaming Headset', category: 'Audio' },
      { name: 'External HDD 2TB', category: 'Storage' },
      { name: 'HDMI 2.1 Cable', category: 'Cables' },
    ];
    // add one sample at a time for quick testing
    const sample = samples[(nextId - 1) % samples.length];
    setProducts(prev => [...prev, { id: nextId, ...sample }]);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary">Inventory</h1>
          <p className="text-text-secondary mt-1">Search and manage inventory (dummy data)</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center w-full sm:w-1/2">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products or categories..."
              className="w-full px-4 py-2 rounded-md border border-card-border bg-white text-text-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={addDummy}
              className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
            >
              Add Dummy Data
            </button>
            <span className="text-sm text-text-secondary">Showing {filtered.length} / {products.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(product => (
            <div key={product.id} className="bg-card border border-card-border rounded-lg p-4">
              <div className="h-36 bg-background rounded-md mb-3 flex items-center justify-center">
                <span className="text-text-secondary text-sm">Image</span>
              </div>
              <h3 className="font-semibold text-text-primary truncate">{product.name}</h3>
              <p className="text-sm text-text-secondary mt-1">{product.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}