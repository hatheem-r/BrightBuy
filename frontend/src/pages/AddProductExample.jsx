// Example: How to use ImageUpload component for adding products

import React, { useState } from "react";
import ImageUpload from "../components/ImageUpload";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const AddProductPage = () => {
  const [productData, setProductData] = useState({
    name: "",
    brand: "",
    description: "",
    category_id: "",
    variants: [
      {
        sku: "",
        price: "",
        size: "",
        color: "",
        description: "",
        image_url: "",
        is_default: true,
      },
    ],
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setProductData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      ),
    }));
  };

  const handleImageUploaded = (index, imageUrl) => {
    handleVariantChange(index, "image_url", imageUrl);
    setMessage({ type: "success", text: "Image uploaded successfully!" });
    setTimeout(() => setMessage(null), 3000);
  };

  const addVariant = () => {
    setProductData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          sku: "",
          price: "",
          size: "",
          color: "",
          description: "",
          image_url: "",
          is_default: false,
        },
      ],
    }));
  };

  const removeVariant = (index) => {
    if (productData.variants.length > 1) {
      setProductData((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const data = await response.json();
      setMessage({
        type: "success",
        text: `Product created successfully! ID: ${data.productId}`,
      });

      // Reset form
      setProductData({
        name: "",
        brand: "",
        description: "",
        category_id: "",
        variants: [
          {
            sku: "",
            price: "",
            size: "",
            color: "",
            description: "",
            image_url: "",
            is_default: true,
          },
        ],
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to create product. Please try again.",
      });
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
      <style jsx>{`
        .form-container {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        h1 {
          color: #2d3748;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4a5568;
          font-weight: 500;
        }

        input,
        textarea,
        select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-size: 1rem;
        }

        input:focus,
        textarea:focus,
        select:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }

        textarea {
          min-height: 100px;
          resize: vertical;
        }

        .variant-section {
          border: 2px solid #e2e8f0;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          background: #f7fafc;
        }

        .variant-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .variant-title {
          color: #2d3748;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .button-primary {
          background-color: #4299e1;
          color: white;
        }

        .button-primary:hover:not(:disabled) {
          background-color: #3182ce;
        }

        .button-secondary {
          background-color: #48bb78;
          color: white;
        }

        .button-secondary:hover {
          background-color: #38a169;
        }

        .button-danger {
          background-color: #fc8181;
          color: white;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .button-danger:hover {
          background-color: #f56565;
        }

        .button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
        }

        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .message {
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
        }

        .message-success {
          background-color: #c6f6d5;
          color: #22543d;
          border: 1px solid #9ae6b4;
        }

        .message-error {
          background-color: #fed7d7;
          color: #742a2a;
          border: 1px solid #fc8181;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="form-container">
        <h1>Add New Product</h1>

        {message && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Product Basic Info */}
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={productData.brand}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category_id">Category ID</label>
              <input
                type="number"
                id="category_id"
                name="category_id"
                value={productData.category_id}
                onChange={handleInputChange}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              placeholder="Product description (optional)"
            />
          </div>

          {/* Variants */}
          <h2
            style={{
              marginTop: "2rem",
              marginBottom: "1rem",
              color: "#2d3748",
            }}
          >
            Product Variants
          </h2>

          {productData.variants.map((variant, index) => (
            <div key={index} className="variant-section">
              <div className="variant-header">
                <div className="variant-title">
                  Variant {index + 1} {variant.is_default && "(Default)"}
                </div>
                {productData.variants.length > 1 && (
                  <button
                    type="button"
                    className="button button-danger"
                    onClick={() => removeVariant(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>SKU *</label>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) =>
                      handleVariantChange(index, "sku", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(index, "price", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Size</label>
                  <input
                    type="text"
                    value={variant.size}
                    onChange={(e) =>
                      handleVariantChange(index, "size", e.target.value)
                    }
                    placeholder="e.g., 256GB, M, L"
                  />
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) =>
                      handleVariantChange(index, "color", e.target.value)
                    }
                    placeholder="e.g., Black, White"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Variant Description</label>
                <textarea
                  value={variant.description}
                  onChange={(e) =>
                    handleVariantChange(index, "description", e.target.value)
                  }
                  placeholder="Variant-specific description (optional)"
                  style={{ minHeight: "80px" }}
                />
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <ImageUpload
                  currentImage={variant.image_url}
                  onImageUploaded={(imageUrl) =>
                    handleImageUploaded(index, imageUrl)
                  }
                />
                {variant.image_url && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      color: "#48bb78",
                      fontSize: "0.875rem",
                    }}
                  >
                    ✓ Image URL: {variant.image_url}
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            className="button button-secondary"
            onClick={addVariant}
          >
            + Add Another Variant
          </button>

          <div className="button-group">
            <button
              type="submit"
              className="button button-primary"
              disabled={submitting}
            >
              {submitting ? "Creating Product..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
