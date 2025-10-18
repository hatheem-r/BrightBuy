"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InventoryManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [expandedProducts, setExpandedProducts] = useState(new Set());
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [updateData, setUpdateData] = useState({
    addedQuantity: 0,
    note: "",
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
      const response = await fetch(
        "http://localhost:5001/api/staff/inventory",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Group variants by product
        const groupedProducts = groupVariantsByProduct(data.inventory || []);
        setProducts(groupedProducts);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group variants by product and calculate total stock
  const groupVariantsByProduct = (inventory) => {
    const grouped = {};

    inventory.forEach((item) => {
      if (!grouped[item.product_id]) {
        grouped[item.product_id] = {
          product_id: item.product_id,
          product_name: item.product_name,
          brand: item.brand,
          total_stock: 0,
          variants: [],
        };
      }

      grouped[item.product_id].total_stock += item.stock;
      grouped[item.product_id].variants.push({
        variant_id: item.variant_id,
        sku: item.sku,
        color: item.color,
        size: item.size,
        price: item.price,
        stock: item.stock,
      });
    });

    return Object.values(grouped);
  };

  const toggleProductExpand = (productId) => {
    setExpandedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleUpdateInventory = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (updating) return;

    setMessage({ type: "", text: "" });

    if (!selectedVariant) return;

    setUpdating(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/staff/inventory/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            variantId: selectedVariant.variant_id,
            quantityChange: parseInt(updateData.addedQuantity),
            notes: updateData.note || null,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Inventory updated successfully!",
        });
        setUpdateData({ addedQuantity: 0, note: "" });
        setSelectedVariant(null);
        fetchInventory();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to update inventory",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setUpdating(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = stockFilter === "all" || product.total_stock <= 10;
    return matchesSearch && matchesStock;
  });
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
              <svg
                className="w-8 h-8 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
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
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
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

        {/* Stock Filter */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setStockFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              stockFilter === "all"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setStockFilter("low")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              stockFilter === "low"
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Low Stock (≤10)
          </button>
        </div>

        {/* Inventory Table */}
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-card-border">
            <h2 className="text-xl font-bold text-text-primary">
              All Products
            </h2>
            <p className="text-sm text-text-secondary">
              Total: {filteredProducts.length} items
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Total Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-text-secondary"
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <React.Fragment key={product.product_id}>
                      {/* Product Row */}
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                toggleProductExpand(product.product_id)
                              }
                              className="mr-3 text-primary hover:text-primary-dark transition-colors"
                            >
                              {expandedProducts.has(product.product_id)
                                ? "▼"
                                : "▶"}
                            </button>
                            <div className="text-sm font-medium text-text-primary">
                              {product.product_name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-text-primary">
                            {product.brand}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-sm font-bold rounded-full ${
                              product.total_stock === 0
                                ? "bg-red-100 text-red-800"
                                : product.total_stock <= 10
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {product.total_stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {expandedProducts.has(product.product_id)
                            ? "Expand to update variants"
                            : "Click arrow to view variants"}
                        </td>
                      </tr>

                      {/* Variant Rows (when expanded) */}
                      {expandedProducts.has(product.product_id) &&
                        product.variants.map((variant) => (
                          <React.Fragment key={variant.variant_id}>
                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                              <td className="px-6 py-4 pl-16">
                                <div className="text-sm text-text-secondary font-mono">
                                  {variant.sku}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-text-primary">
                                  {variant.color && (
                                    <span className="mr-2">
                                      🎨 {variant.color}
                                    </span>
                                  )}
                                  {variant.size && (
                                    <span>📏 {variant.size}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-3 py-1 inline-flex text-sm font-bold rounded-full ${
                                    variant.stock === 0
                                      ? "bg-red-100 text-red-800"
                                      : variant.stock <= 10
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {variant.stock}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() =>
                                    setSelectedVariant(
                                      selectedVariant?.variant_id ===
                                        variant.variant_id
                                        ? null
                                        : {
                                            ...variant,
                                            product_name: product.product_name,
                                          }
                                    )
                                  }
                                  className={`px-4 py-2 text-sm rounded transition-colors ${
                                    selectedVariant?.variant_id ===
                                    variant.variant_id
                                      ? "bg-gray-500 text-white hover:bg-gray-600"
                                      : "bg-primary text-white hover:opacity-90"
                                  }`}
                                >
                                  {selectedVariant?.variant_id ===
                                  variant.variant_id
                                    ? "Cancel"
                                    : "Update Stock"}
                                </button>
                              </td>
                            </tr>

                            {/* Inline Update Form */}
                            {selectedVariant?.variant_id ===
                              variant.variant_id && (
                              <tr className="bg-blue-50 dark:bg-blue-900/20">
                                <td colSpan="4" className="px-6 py-4">
                                  <div className="border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4">
                                    <div className="mb-3">
                                      <h3 className="text-lg font-bold text-text-primary">
                                        Update Inventory
                                      </h3>
                                      <p className="text-sm text-text-secondary">
                                        {selectedVariant.product_name} -{" "}
                                        {selectedVariant.sku} (
                                        {selectedVariant.color} /{" "}
                                        {selectedVariant.size})
                                      </p>
                                      <p className="text-sm text-text-secondary">
                                        Current Stock:{" "}
                                        <span className="font-bold">
                                          {selectedVariant.stock}
                                        </span>
                                      </p>
                                    </div>

                                    <form
                                      onSubmit={handleUpdateInventory}
                                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                    >
                                      <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                          Quantity Change (+ to add, - to
                                          reduce)
                                        </label>
                                        <input
                                          type="number"
                                          value={updateData.addedQuantity}
                                          onChange={(e) =>
                                            setUpdateData({
                                              ...updateData,
                                              addedQuantity: e.target.value,
                                            })
                                          }
                                          required
                                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                                          placeholder="e.g., 50 or -10"
                                        />
                                        <p className="text-xs text-text-secondary mt-1">
                                          New stock will be:{" "}
                                          {selectedVariant.stock +
                                            parseInt(
                                              updateData.addedQuantity || 0
                                            )}
                                        </p>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                          Note (optional)
                                        </label>
                                        <input
                                          type="text"
                                          value={updateData.note}
                                          onChange={(e) =>
                                            setUpdateData({
                                              ...updateData,
                                              note: e.target.value,
                                            })
                                          }
                                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                                          placeholder="Reason for update..."
                                        />
                                      </div>

                                      <div className="flex items-end">
                                        <button
                                          type="submit"
                                          disabled={updating}
                                          className={`w-full px-6 py-2 bg-primary text-white rounded-md transition-opacity ${
                                            updating
                                              ? "opacity-50 cursor-not-allowed"
                                              : "hover:opacity-90"
                                          }`}
                                        >
                                          {updating
                                            ? "Updating..."
                                            : "Update Stock"}
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                    </React.Fragment>
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
