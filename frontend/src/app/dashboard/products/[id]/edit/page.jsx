// src/app/dashboard/products/[id]/edit/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import VariantImageInput from '@/components/VariantImageInput'; 
import { useParams, useRouter } from 'next/navigation';

// Initial state for a single variant
const initialVariant = {
  name: 'New Variant', 
  price: '', 
  stock: '', 
  imageFile: null, 
  imageUrl: null,
  id: null,       // Tracks existing variant ID (null for new variants)
  isDeleted: false, // Flag used to tell the backend which variants to delete
};

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', description: '', sku: '', categories: '', variants: [initialVariant],
  });
  const [message, setMessage] = useState('');

  // ----------------------------------------------------
  // --- FETCH DATA ON LOAD ---
  // ----------------------------------------------------
  useEffect(() => {
    async function fetchProductData() {
      try {
        const response = await fetch(`http://localhost:5001/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product data.');
        }
        const { product } = await response.json();
        
        // Map fetched variants to the state structure
        const fetchedVariants = product.variants.map(v => ({
            id: v.id, // CRITICAL: Existing variant ID
            name: v.name,
            price: v.price,
            stock: v.stock,
            imageUrl: v.image_url, // Existing image URL from Cloudinary
            imageFile: null, // No file initially
            isDeleted: false, // Not deleted yet
        }));

        setFormData({
          name: product.name,
          description: product.description,
          sku: product.sku,
          categories: product.categories,
          variants: fetchedVariants.length > 0 ? fetchedVariants : [initialVariant],
        });
        setLoading(false);
      } catch (e) {
        setMessage('Error loading product: ' + e.message);
        setLoading(false);
      }
    }
    if (id) {
      fetchProductData();
    }
  }, [id]);

  // ----------------------------------------------------
  // --- STATE HANDLERS ---
  // ----------------------------------------------------

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVariantChange = (index, e) => {
    const { name, value, files, type } = e.target;
    
    const newVariants = formData.variants.map((variant, i) => {
      if (i === index) {
        if (type === 'file' && files && files[0]) {
            // Handle new image upload
            const file = files[0];
            return {
                ...variant,
                imageFile: file,
                imageUrl: URL.createObjectURL(file), // For frontend preview
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
    if (formData.variants.length === 1) return; // Prevent deleting the last variant

    const variantToRemove = formData.variants[index];
    
    if (variantToRemove.id) {
        // If the variant has an ID (i.e., it exists in the database),
        // Mark it for deletion and hide it from the view.
        const updatedVariants = formData.variants.map((variant, i) => {
            if (i === index) {
                return { ...variant, isDeleted: true };
            }
            return variant;
        });
        setFormData({ ...formData, variants: updatedVariants });
    } else {
        // If it's a new, unsaved variant, just remove it from the array
        setFormData({
            ...formData,
            variants: formData.variants.filter((_, i) => i !== index),
        });
    }
  };


  // ----------------------------------------------------
  // --- HANDLE UPDATE SUBMISSION (PUT) ---
  // ----------------------------------------------------
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('Updating product data...');

    const dataToSend = new FormData();

    // 1. Append Core Text Fields
    dataToSend.append('name', formData.name);
    dataToSend.append('description', formData.description);
    dataToSend.append('sku', formData.sku);
    
    // Convert categories to JSON string and append
    const categoryArray = formData.categories.split(',').map(c => c.trim()).filter(c => c.length > 0);
    dataToSend.append('categories', JSON.stringify(categoryArray)); 

    // 2. Append Variants and Files
    // Filter out variants that are marked for deletion before stringifying the data
    const activeVariants = formData.variants.filter(v => !v.isDeleted);
    
    // Pass the cleaned variant data (omitting file/url objects)
    const variantData = activeVariants.map(({ imageFile, imageUrl, ...rest }) => rest);
    dataToSend.append('variants', JSON.stringify(variantData));

    // Append Image Files (Only send new files for active variants)
    activeVariants.forEach((variant, index) => {
        if (variant.imageFile) {
            // CRITICAL: Name must match backend expectation
            dataToSend.append(`variant_image_${index}`, variant.imageFile); 
        }
    });

    // Append a list of IDs to delete, if any
    const deletedVariantIds = formData.variants.filter(v => v.isDeleted && v.id).map(v => v.id);
    dataToSend.append('deletedVariantIds', JSON.stringify(deletedVariantIds));
    
    // --- API Call ---
    try {
        const response = await fetch(`http://localhost:5001/api/products/${id}`, {
            method: 'PUT', // Use PUT for updates
            body: dataToSend, 
        });
        
        const data = await response.json();

        if (response.ok) {
            setMessage(`✅ Product updated successfully! Redirecting...`);
            // Cleanup temporary image URLs
            formData.variants.forEach(v => v.imageUrl && URL.revokeObjectURL(v.imageUrl));
            setTimeout(() => router.push('/dashboard/products'), 1000); 
        } else {
            setMessage(`❌ Error: ${data.message || 'Failed to update product.'}`);
        }

    } catch (error) {
        setMessage('❌ Network Error: Could not connect to the Express server.');
    }
  };


  if (loading) {
    return <div className="p-6 text-center">Loading product details...</div>;
  }
  
  // ----------------------------------------------------
  // --- RENDER ---
  // ----------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Edit Product: {formData.name}</h1>
      
      {message && <div className={`p-3 mb-4 rounded ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

      <form onSubmit={handleUpdate} className="space-y-6">
        
        {/* === 1. Core Details === */}
        <h2 className="text-xl font-semibold border-b pb-2">1. Core Details</h2>
        <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="name">Product Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleProductChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="sku">SKU</label>
              <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleProductChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleProductChange} rows="3" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="categories">Categories (Comma separated)</label>
          <input type="text" id="categories" name="categories" value={formData.categories} onChange={handleProductChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
        </div>

        {/* === 2. Product Variants === */}
        <h2 className="text-xl font-semibold border-b pb-2 pt-4">2. Variants, Pricing & Images</h2>

        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
          {formData.variants
            .filter(v => !v.isDeleted) // Only show active variants
            .map((variant, index) => (
            <VariantImageInput 
              key={variant.id || `new-${index}`} 
              variant={variant}
              index={index}
              handleVariantChange={handleVariantChange}
              removeVariant={removeVariant}
              variantsLength={formData.variants.filter(v => !v.isDeleted).length}
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
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-indigo-700 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}