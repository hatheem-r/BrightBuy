// components/ImageUpload.jsx
import React, { useState, useRef } from 'react';

const ImageUpload = ({ onImageUploaded, currentImage = null }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:5001/api/products/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Call parent component's callback with the image URL
      if (onImageUploaded) {
        onImageUploaded(data.imageUrl);
      }

      setPreview(data.imageUrl);
      setSelectedFile(null);
      
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(currentImage);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      <style jsx>{`
        .image-upload-container {
          width: 100%;
          max-width: 500px;
        }

        .upload-area {
          border: 2px dashed #cbd5e0;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background-color: #f7fafc;
        }

        .upload-area.drag-active {
          border-color: #4299e1;
          background-color: #ebf8ff;
        }

        .upload-area:hover {
          border-color: #4299e1;
        }

        .preview-container {
          margin-top: 1rem;
          position: relative;
          display: inline-block;
        }

        .preview-image {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .upload-button {
          background-color: #4299e1;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          margin-top: 1rem;
          transition: background-color 0.2s;
        }

        .upload-button:hover:not(:disabled) {
          background-color: #3182ce;
        }

        .upload-button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
        }

        .remove-button {
          background-color: #fc8181;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin-left: 0.5rem;
          font-size: 0.875rem;
        }

        .remove-button:hover {
          background-color: #f56565;
        }

        .error-message {
          color: #e53e3e;
          margin-top: 0.5rem;
          font-size: 0.875rem;
        }

        .file-info {
          margin-top: 0.5rem;
          color: #4a5568;
          font-size: 0.875rem;
        }

        .upload-icon {
          font-size: 3rem;
          color: #cbd5e0;
          margin-bottom: 1rem;
        }

        .upload-text {
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .upload-subtext {
          color: #a0aec0;
          font-size: 0.875rem;
        }
      `}</style>

      {!preview ? (
        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📸</div>
          <div className="upload-text">
            {dragActive ? 'Drop image here' : 'Click or drag image to upload'}
          </div>
          <div className="upload-subtext">
            Supports: JPG, PNG, GIF, WebP (Max 5MB)
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="preview-container">
          <img 
            src={preview.startsWith('http') ? preview : `http://localhost:5001${preview}`} 
            alt="Preview" 
            className="preview-image" 
          />
        </div>
      )}

      {selectedFile && (
        <div className="file-info">
          Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div>
        {selectedFile && (
          <>
            <button
              className="upload-button"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <button
              className="remove-button"
              onClick={handleRemove}
              disabled={uploading}
            >
              Cancel
            </button>
          </>
        )}
        {preview && !selectedFile && (
          <button
            className="upload-button"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Image
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload;
