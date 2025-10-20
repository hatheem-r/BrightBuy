"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5001";

export default function InventoryManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("update-stocks");

  // States for Update Stocks
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [expandedProducts, setExpandedProducts] = useState(new Set());
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [updateData, setUpdateData] = useState({
    addedQuantity: "",
    note: "",
  });

  // States for Add/Remove Products
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    category: "",
    variants: [{ color: "", size: "", price: "", stock: 0 }],
  });

  // State for removing variants
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);

    if (parsedUser.role !== "staff") {
      router.push("/");
      return;
    }

    setUser(parsedUser);
    fetchInventory();
  }, [router]);

  const fetchInventory = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/staff/inventory`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const groupedProducts = groupVariantsByProduct(data.inventory || []);
        setProducts(groupedProducts);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdateStock = async () => {
    if (!selectedVariant) {
      setMessage({ type: "error", text: "Please select a variant first" });
      return;
    }

    const quantity = parseInt(updateData.addedQuantity);
    if (isNaN(quantity) || updateData.addedQuantity === "") {
      setMessage({
        type: "error",
        text: "Please enter a valid quantity (positive to add, negative to remove)",
      });
      return;
    }

    setUpdating(true);
    try {
      console.log("=== UPDATE STOCK REQUEST ===");
      console.log("Selected Variant:", selectedVariant);
      console.log("Quantity Change:", quantity);
      console.log("Notes:", updateData.note);
      console.log(
        "Token:",
        localStorage.getItem("authToken") ? "Present" : "Missing"
      );

      const requestBody = {
        variantId: selectedVariant.variant_id,
        quantityChange: quantity,
        notes: updateData.note || "",
      };

      console.log("Request Body:", requestBody);

      const response = await fetch(
        `${BACKEND_URL}/api/staff/inventory/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      console.log("=== SERVER RESPONSE ===");
      console.log("Status:", response.status);
      console.log("Response Data:", data);

      if (response.ok) {
        setMessage({
          type: "success",
          text: data.message || "Stock updated successfully!",
        });
        setSelectedVariant(null);
        setUpdateData({ addedQuantity: "", note: "" });
        await fetchInventory();
      } else {
        console.error("Update failed:", data);
        setMessage({
          type: "error",
          text: data.message || "Failed to update stock",
        });
      }
    } catch (error) {
      console.error("=== UPDATE ERROR ===");
      console.error(error);
      setMessage({ type: "error", text: `Error: ${error.message}` });
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveVariant = async (variantId) => {
    if (
      !confirm(
        "Are you sure you want to remove this variant? This action cannot be undone."
      )
    )
      return;

    setUpdating(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/staff/product-variants/${variantId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage({
          type: "success",
          text: data.message || "Variant removed successfully!",
        });
        await fetchInventory();
      } else {
        const data = await response.json();
        setMessage({
          type: "error",
          text: data.message || "Failed to remove variant",
        });
      }
    } catch (error) {
      console.error("Remove variant error:", error);
      setMessage({
        type: "error",
        text: "This feature requires backend API support",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.brand || !newProduct.category) {
      setMessage({ type: "error", text: "Please fill all product fields" });
      return;
    }

    if (newProduct.variants.length === 0 || !newProduct.variants[0].color) {
      setMessage({ type: "error", text: "Please add at least one variant" });
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/staff/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Product added successfully!" });
        setNewProduct({
          name: "",
          brand: "",
          category: "",
          variants: [{ color: "", size: "", price: "", stock: 0 }],
        });
        await fetchInventory();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to add product",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "This feature requires backend API support",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveProduct = async (productId) => {
    if (
      !confirm(
        "Are you sure you want to remove this product and all its variants?"
      )
    )
      return;

    setUpdating(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/staff/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Product removed successfully!" });
        await fetchInventory();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to remove product",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "This feature requires backend API support",
      });
    } finally {
      setUpdating(false);
    }
  };

  const addNewProductVariantRow = () => {
    setNewProduct({
      ...newProduct,
      variants: [
        ...newProduct.variants,
        { color: "", size: "", price: "", stock: 0 },
      ],
    });
  };

  const updateVariantField = (index, field, value) => {
    const newVariants = [...newProduct.variants];
    newVariants[index][field] = value;
    setNewProduct({ ...newProduct, variants: newVariants });
  };

  const removeVariantRow = (index) => {
    if (newProduct.variants.length === 1) {
      setMessage({
        type: "error",
        text: "Product must have at least one variant",
      });
      return;
    }
    const newVariants = newProduct.variants.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, variants: newVariants });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && product.total_stock < 10) ||
      (stockFilter === "out" && product.total_stock === 0);

    return matchesSearch && matchesStock;
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      id: "update-stocks",
      name: "Update Stocks",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
    },
    {
      id: "manage-products",
      name: "Add/Remove Products",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar for Inventory Sections */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 fixed h-full overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Inventory Management
        </h2>
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                setMessage({ type: "", text: "" });
                setSelectedVariant(null);
                setSelectedProduct(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                activeSection === section.id
                  ? "bg-primary text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {section.icon}
              <span className="text-sm font-medium">{section.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Message Display */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex justify-between items-center ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <span>{message.text}</span>
              <button
                onClick={() => setMessage({ type: "", text: "" })}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
          )}

          {/* UPDATE STOCKS SECTION */}
          {activeSection === "update-stocks" && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">
                  Update Stock Levels
                </h1>
                <p className="text-text-secondary mt-1">
                  Add or remove stock for product variants
                </p>
              </div>

              {/* Search and Filters */}
              <div className="bg-card border border-card-border rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Search Products
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by product name or brand..."
                      className="w-full px-4 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Filter by Stock
                    </label>
                    <select
                      value={stockFilter}
                      onChange={(e) => setStockFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">All Products</option>
                      <option value="low">Low Stock (&lt; 10)</option>
                      <option value="out">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Selected Variant Update Form */}
              {selectedVariant && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Update Stock: {selectedVariant.sku}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-text-secondary">
                        Current Stock
                      </p>
                      <p className="text-2xl font-bold text-text-primary">
                        {selectedVariant.stock}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">
                        Color / Size
                      </p>
                      <p className="text-lg font-semibold text-text-primary">
                        {selectedVariant.color} / {selectedVariant.size}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Price</p>
                      <p className="text-lg font-semibold text-text-primary">
                        $ {parseFloat(selectedVariant.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Quantity Change (+ to add, - to remove)
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
                        placeholder="e.g., 10 or -5"
                        className="w-full px-4 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <p className="text-xs text-text-secondary mt-1">
                        Enter positive number to add, negative to remove
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Note (optional)
                      </label>
                      <input
                        type="text"
                        value={updateData.note}
                        onChange={(e) =>
                          setUpdateData({ ...updateData, note: e.target.value })
                        }
                        placeholder="Reason for update..."
                        className="w-full px-4 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleUpdateStock}
                      disabled={updating}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 font-medium"
                    >
                      {updating ? "Updating..." : "Update Stock"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVariant(null);
                        setUpdateData({ addedQuantity: "", note: "" });
                      }}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:opacity-90 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Products List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading inventory...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="bg-card border border-card-border rounded-lg p-12 text-center">
                    <p className="text-text-secondary">No products found</p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product.product_id}
                      className="bg-card border border-card-border rounded-lg overflow-hidden"
                    >
                      <div
                        className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => toggleProductExpand(product.product_id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-text-primary">
                              {product.product_name}
                            </h3>
                            <p className="text-sm text-text-secondary">
                              {product.brand}
                            </p>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-sm text-text-secondary">
                                Total Stock
                              </p>
                              <p
                                className={`text-2xl font-bold ${
                                  product.total_stock === 0
                                    ? "text-red-600"
                                    : product.total_stock < 10
                                    ? "text-yellow-600"
                                    : "text-green-600"
                                }`}
                              >
                                {product.total_stock}
                              </p>
                            </div>
                            <svg
                              className={`w-6 h-6 text-text-secondary transition-transform ${
                                expandedProducts.has(product.product_id)
                                  ? "rotate-180"
                                  : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {expandedProducts.has(product.product_id) && (
                        <div className="border-t border-card-border bg-gray-50 dark:bg-gray-800/50 p-6">
                          <h4 className="font-semibold text-text-primary mb-4">
                            Product Variants
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {product.variants.map((variant) => (
                              <div
                                key={variant.variant_id}
                                className="bg-white dark:bg-gray-800 border border-card-border rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <p className="font-mono text-xs text-text-secondary">
                                      {variant.sku}
                                    </p>
                                    <p className="text-lg font-semibold text-text-primary mt-1">
                                      {variant.color} / {variant.size}
                                    </p>
                                  </div>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      variant.stock === 0
                                        ? "bg-red-100 text-red-800"
                                        : variant.stock < 10
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {variant.stock}
                                  </span>
                                </div>
                                <p className="text-sm text-text-secondary mb-3">
                                  $ {parseFloat(variant.price).toLocaleString()}
                                </p>
                                <button
                                  onClick={() => setSelectedVariant(variant)}
                                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 text-sm font-medium"
                                >
                                  Update Stock
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ADD/REMOVE PRODUCTS SECTION */}
          {activeSection === "manage-products" && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">
                  Manage Products & Variants
                </h1>
                <p className="text-text-secondary mt-1">
                  Add new products with variants or remove existing ones
                </p>
              </div>

              {/* Add Product Form */}
              <div className="bg-card border border-card-border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-text-primary mb-6">
                  Add New Product
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      placeholder="Enter product name"
                      className="w-full px-4 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Brand *
                    </label>
                    <input
                      type="text"
                      value={newProduct.brand}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, brand: e.target.value })
                      }
                      placeholder="Enter brand name"
                      className="w-full px-4 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                      placeholder="Enter category"
                      className="w-full px-4 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <h3 className="font-semibold text-text-primary mb-4">
                  Product Variants
                </h3>
                <div className="space-y-3 mb-4">
                  {newProduct.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
                    >
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">
                          Color *
                        </label>
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) =>
                            updateVariantField(index, "color", e.target.value)
                          }
                          placeholder="e.g., Blue"
                          className="w-full px-3 py-2 border border-card-border rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">
                          Size *
                        </label>
                        <input
                          type="text"
                          value={variant.size}
                          onChange={(e) =>
                            updateVariantField(index, "size", e.target.value)
                          }
                          placeholder="e.g., M"
                          className="w-full px-3 py-2 border border-card-border rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">
                          Price *
                        </label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariantField(index, "price", e.target.value)
                          }
                          placeholder="0.00"
                          step="0.01"
                          className="w-full px-3 py-2 border border-card-border rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">
                          Initial Stock *
                        </label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) =>
                            updateVariantField(
                              index,
                              "stock",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          className="w-full px-3 py-2 border border-card-border rounded-lg text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariantRow(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        disabled={newProduct.variants.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={addNewProductVariantRow}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:opacity-90 text-sm font-medium"
                  >
                    + Add Another Variant
                  </button>
                  <button
                    onClick={handleAddProduct}
                    disabled={updating}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 font-medium"
                  >
                    {updating ? "Adding..." : "Add Product"}
                  </button>
                </div>
              </div>

              {/* Remove Products/Variants Section */}
              <div className="bg-card border border-card-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-2">
                  Remove Products or Variants
                </h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ Warning: Removing products or variants is permanent and
                    cannot be undone.
                  </p>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                    <p className="text-text-secondary text-sm">
                      Loading products...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product.product_id}
                        className="border border-card-border rounded-lg overflow-hidden"
                      >
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-text-primary">
                              {product.product_name}
                            </h3>
                            <p className="text-sm text-text-secondary">
                              {product.brand} • {product.variants.length}{" "}
                              variants
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveProduct(product.product_id)
                            }
                            disabled={updating}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                          >
                            Remove Product
                          </button>
                        </div>
                        <div className="p-4 space-y-2">
                          <p className="text-xs font-medium text-text-secondary uppercase mb-2">
                            Product Variants:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {product.variants.map((variant) => (
                              <div
                                key={variant.variant_id}
                                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-card-border rounded-lg"
                              >
                                <div>
                                  <p className="font-mono text-xs text-text-secondary">
                                    {variant.sku}
                                  </p>
                                  <p className="text-sm font-semibold text-text-primary">
                                    {variant.color} / {variant.size}
                                  </p>
                                  <p className="text-xs text-text-secondary">
                                    ${" "}
                                    {parseFloat(variant.price).toLocaleString()}{" "}
                                    • Stock: {variant.stock}
                                  </p>
                                </div>
                                <button
                                  onClick={() =>
                                    handleRemoveVariant(variant.variant_id)
                                  }
                                  disabled={updating}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                  title="Remove variant"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
