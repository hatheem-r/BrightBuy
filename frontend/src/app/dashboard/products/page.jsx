// src/app/dashboard/products/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Use Next.js Image component for optimization

export default function ProductsPage() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use your backend server URL
      const response = await fetch('http://localhost:5001/api/products');
      const data = await response.json();

      if (response.ok) {
        setProductList(data.products);
      } else {
        setError(data.message || 'Failed to load product list.');
      }
    } catch (err) {
      setError('Network error: Could not connect to the backend server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Product Management</h1>
        
        <Link 
          href="/dashboard/products/add" 
          className="bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition-colors"
        >
          + Add New Product
        </Link>
      </div>
      
      {/* Loading and Error States */}
      {loading && <p className="text-gray-500">Loading product data...</p>}
      {error && <p className="text-red-500 font-semibold">Error: {error}</p>}

      {/* Product List Table */}
      {!loading && !error && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productList.length > 0 ? (
                productList.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    {/* Image Cell */}
                    <td className="px-6 py-4 whitespace-nowrap">
                        {product.image_url ? (
                            <Image 
                                src={product.image_url} 
                                alt={product.name} 
                                width={40} 
                                height={40} 
                                className="object-cover rounded-md"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-xs">No Img</div>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">
                        Rs. {product.min_price ? parseFloat(product.min_price).toFixed(2) : 'N/A'}
                    </td>
                    {/* Stock Cell */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        <span className={`px-2 py-0.5 inline-flex text-xs leading-5 rounded-full ${
                            product.total_stock > 10 ? 'bg-green-100 text-green-800' :
                            product.total_stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                            {product.total_stock || 0}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.categories || 'N/A'}
                    </td>
                    {/* Action Cell (Edit Link) */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/dashboard/products/${product.id}/edit`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}