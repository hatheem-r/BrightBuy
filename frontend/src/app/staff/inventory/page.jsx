"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InventoryManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateData, setUpdateData] = useState({
    addedQuantity: 0,
    note: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);

    // Check if user is staff
    if (parsedUser.role !== "staff") {
      router.push("/");
      return;
    }

    setUser(parsedUser);
    fetchInventory();
  }, [router]);

  const fetchInventory = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/staff/inventory", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.inventory || []);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInventory = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!selectedProduct) return;

    try {
      const response = await fetch("http://localhost:5001/api/staff/inventory/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          variantId: selectedProduct.variant_id,
          quantityChange: parseInt(updateData.addedQuantity),
          notes: updateData.note || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Inventory updated successfully!" });
        setUpdateData({ addedQuantity: 0, note: "" });
        setSelectedProduct(null);
        fetchInventory();
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update inventory" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Server error. Please try again." });
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <Link
              href="/staff/dashboard"
              className="text-primary hover:underline mb-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-text-primary flex items-center">
              <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Inventory Management
            </h1>
            <p className="text-text-secondary mt-2">
              Update product stock levels and track inventory changes
            </p>
          </div>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
            {message.text}
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Update Form - Shows when product selected */}
        {selectedProduct && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-text-primary">Update Inventory</h2>
                <p className="text-text-secondary">
                  {selectedProduct.product_name} - {selectedProduct.sku}
                </p>
                <p className="text-sm text-text-secondary">
                  Current Stock: <span className="font-bold">{selectedProduct.quantity}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setUpdateData({ addedQuantity: 0, note: "" });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUpdateInventory} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Quantity Change (+ to add, - to reduce)
                </label>
                <input
                  type="number"
                  value={updateData.addedQuantity}
                  onChange={(e) => setUpdateData({ ...updateData, addedQuantity: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 50 or -10"
                />
                <p className="text-xs text-text-secondary mt-1">
                  New stock will be: {selectedProduct.quantity + parseInt(updateData.addedQuantity || 0)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Note (optional)
                </label>
                <input
                  type="text"
                  value={updateData.note}
                  onChange={(e) => setUpdateData({ ...updateData, note: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  placeholder="Reason for update..."
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-card-border">
            <h2 className="text-xl font-bold text-text-primary">All Products</h2>
            <p className="text-sm text-text-secondary">Total: {filteredProducts.length} items</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Variant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-text-secondary">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.variant_id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-text-primary">{product.product_name}</div>
                        <div className="text-xs text-text-secondary">{product.brand}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-primary font-mono">{product.sku}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-text-primary">
                          {product.color && <span className="mr-2">🎨 {product.color}</span>}
                          {product.size && <span>📏 {product.size}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-sm font-bold rounded-full ${
                          product.quantity === 0 
                            ? 'bg-red-100 text-red-800' 
                            : product.quantity < 10 
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        Rs. {parseFloat(product.price).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="px-4 py-2 bg-primary text-white text-sm rounded hover:opacity-90"
                        >
                          Update Stock
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
