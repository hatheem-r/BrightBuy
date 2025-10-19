// src/components/VariantImageInput.jsx
import React from 'react';

// This component handles the input fields and image preview for a single variant
const VariantImageInput = ({ variant, index, handleVariantChange, removeVariant, variantsLength }) => {
  return (
    <div className="grid grid-cols-5 gap-4 items-end p-3 border-b last:border-b-0 bg-white rounded-md">
      {/* 1. Variant Name, Price, Stock (Inputs simplified for space) */}
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" name="name" value={variant.name} onChange={(e) => handleVariantChange(index, e)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price (Rs.)</label>
        <input type="number" name="price" value={variant.price} onChange={(e) => handleVariantChange(index, e)} required min="0.01" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input type="number" name="stock" value={variant.stock} onChange={(e) => handleVariantChange(index, e)} required min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
      </div>
      
      {/* 2. Image Upload Input */}
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <input
          type="file"
          // CRITICAL: Name attribute identifies the file to the backend
          name={`variant_image_${index}`} 
          onChange={(e) => handleVariantChange(index, e)}
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-1"
        />
        {/* Image Preview */}
        {variant.imageUrl && (
            <img src={variant.imageUrl} alt="Preview" className="w-12 h-12 object-cover mt-2 rounded" />
        )}
      </div>

      {/* 3. Remove Button */}
      <div>
        {variantsLength > 1 && (
          <button
            type="button"
            onClick={() => removeVariant(index)}
            className="bg-red-500 text-white p-3 rounded-md font-semibold hover:bg-red-600 w-full"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default VariantImageInput;