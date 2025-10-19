// src/app/dashboard/products/add/page.jsx
'use client';

import React, { useState } from 'react';
// ⭐ CRITICAL: Ensure this path is correct based on where you saved the component
import VariantImageInput from '@/components/VariantImageInput'; 

const initialVariant = {
  name: 'Default',
  price: '',
  stock: '',
  imageFile: null, // Stores the actual File object
  imageUrl: null,  // Stores the temporary URL for image preview
};

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    categories: '',
    variants: [initialVariant],
  });
  const [message, setMessage] = useState('');

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVariantChange = (index, e) => {
    const { name, value, files, type } = e.target;
    
    const newVariants = formData.variants.map((variant, i) => {
      if (i === index) {
        if (type === 'file' && files && files[0]) {
            // ⭐ Handle File Input: Store the File object and create a URL for preview
            const file = files[0];
            return {
                ...variant,
                imageFile: file,
                imageUrl: URL.createObjectURL(file), 
            };
        }
        
        // Handle text/number inputs
        return {
          ...variant,
          [name]: type === 'number' ? parseFloat(value) : value,
        };
      }
      return variant;
    });
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, initialVariant] });
  };

  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      // Also revoke the temporary URL if it exists
      if (formData.variants[index].imageUrl) {
        URL.revokeObjectURL(formData.variants[index].imageUrl);
      }
      setFormData({
        ...formData,
        variants: formData.variants.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting product data...');

    // ⭐ 1. Initialize FormData (REQUIRED for sending files)
    const dataToSend = new FormData();

    // 2. Append Core Text Fields
    dataToSend.append('name', formData.name);
    dataToSend.append('description', formData.description);
    dataToSend.append('sku', formData.sku);
    
    // Convert categories to JSON string and append
    const categoryArray = formData.categories.split(',').map(c => c.trim()).filter(c => c.length > 0);
    dataToSend.append('categories', JSON.stringify(categoryArray)); 

    // 3. Append Variants (Text fields converted to JSON string)
    // NOTE: We must omit the imageFile/imageUrl objects from the JSON variants data
    const variantData = formData.variants.map(({ imageFile, imageUrl, ...rest }) => rest);
    dataToSend.append('variants', JSON.stringify(variantData));

    // 4. Append Image Files (Must be appended separately using the correct name)
    formData.variants.forEach((variant, index) => {
        if (variant.imageFile) {
            // CRITICAL: Name must match backend expectation: variant_image_0, variant_image_1, etc.
            dataToSend.append(`variant_image_${index}`, variant.imageFile); 
        }
    });
    
    // --- API Call ---
    try {
        const response = await fetch('http://localhost:5001/api/products/add', {
            method: 'POST',
            // NOTE: DO NOT set Content-Type header. The browser handles multipart/form-data.
            body: dataToSend, 
        });
        
        const data = await response.json();

        if (response.ok) {
            setMessage(`✅ Product added successfully! ID: ${data.productId}`);
            setFormData({ ...formData, 
                name: '', description: '', sku: '', categories: '', variants: [initialVariant] 
            });
        } else {
            setMessage(`❌ Error: ${data.message || 'Failed to add product.'}`);
        }

    } catch (error) {
        setMessage('❌ Network Error: Could not connect to the Express server.');
        console.error('Submission Error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Add New Product (Image Upload Ready)</h1>
      
      {message && <div className={`p-3 mb-4 rounded ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* === 1. Core Details === */}
        <h2 className="text-xl font-semibold border-b pb-2">1. Core Details</h2>
        <div className="grid grid-cols-2 gap-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="name">Product Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleProductChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
            </div>
            {/* SKU Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="sku">SKU (Warehouse Unique)</label>
              <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleProductChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
            </div>
        </div>
        
        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleProductChange} rows="3" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"></textarea>
        </div>

        {/* Categories Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="categories">Categories (Comma separated)</label>
          <input type="text" id="categories" name="categories" value={formData.categories} onChange={handleProductChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
        </div>

        {/* === 2. Product Variants (Image Ready) === */}
        <h2 className="text-xl font-semibold border-b pb-2 pt-4">2. Variants, Pricing & Images</h2>

        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
          {formData.variants.map((variant, index) => (
            <VariantImageInput 
              key={index} 
              variant={variant}
              index={index}
              handleVariantChange={handleVariantChange}
              removeVariant={removeVariant}
              variantsLength={formData.variants.length}
            />
          ))}
          
          <button
            type="button"
            onClick={addVariant}
            className="bg-gray-700 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            + Add Another Variant
          </button>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}