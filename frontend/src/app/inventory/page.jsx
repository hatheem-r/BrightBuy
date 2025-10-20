"use client";

import React, { useMemo, useState, useEffect } from "react";
import { getInventoryData } from "@/lib/api";

export default function InventoryPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, products, orders
  const [statusFilter, setStatusFilter] = useState("all"); // all, in-stock, low-stock, out-of-stock
  const [orderStatusFilter, setOrderStatusFilter] = useState("all"); // all, pending, processing, shipped, delivered, cancelled
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch inventory data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getInventoryData();
        setInventoryData(data);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter products based on search and status
  const filteredProducts = useMemo(() => {
    if (!inventoryData?.products) return [];

    const q = query.trim().toLowerCase();
    let filtered = inventoryData.products;

    // Search filter
    if (q) {
      filtered = filtered.filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q))
        );
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.stockStatus === statusFilter);
    }

    return filtered;
  }, [query, statusFilter, inventoryData]);

  // Filter orders based on status
  const filteredOrders = useMemo(() => {
    if (!inventoryData?.orders) return [];

    if (orderStatusFilter === "all") return inventoryData.orders;
    return inventoryData.orders.filter(
      (o) => o.order_status.toLowerCase() === orderStatusFilter
    );
  }, [orderStatusFilter, inventoryData]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!inventoryData?.products) return null;

    const totalProducts = inventoryData.products.length;
    const inStock = inventoryData.products.filter(
      (p) => p.stockStatus === "in-stock"
    ).length;
    const lowStock = inventoryData.products.filter(
      (p) => p.stockStatus === "low-stock"
    ).length;
    const outOfStock = inventoryData.products.filter(
      (p) => p.stockStatus === "out-of-stock"
    ).length;
    const totalStock = inventoryData.products.reduce(
      (sum, p) => sum + p.totalStock,
      0
    );
    const totalValue = inventoryData.products.reduce(
      (sum, p) => sum + p.totalStock * p.avgPrice,
      0
    );

    return {
      totalProducts,
      inStock,
      lowStock,
      outOfStock,
      totalStock,
      totalValue,
      totalSold: inventoryData.summary?.totalSold || 0,
      totalRevenue: inventoryData.summary?.totalRevenue || 0,
      pendingOrders:
        inventoryData.orders?.filter((o) => o.order_status === "Pending")
          .length || 0,
      processingOrders:
        inventoryData.orders?.filter((o) => o.order_status === "Processing")
          .length || 0,
      shippedOrders:
        inventoryData.orders?.filter((o) => o.order_status === "Shipped")
          .length || 0,
      deliveredOrders:
        inventoryData.orders?.filter((o) => o.order_status === "Delivered")
          .length || 0,
    };
  }, [inventoryData]);

  const getStockStatusColor = (status) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800 border-green-200";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "out-of-stock":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary">
            Inventory Dashboard
          </h1>
          <p className="text-text-secondary mt-1">
            Staff dashboard for product inventory, sales, and order management
          </p>
        </div>

        {/* Statistics Cards - Overview */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Products */}
            <div className="bg-card border border-card-border rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary font-medium">
                    Total Products
                  </p>
                  <p className="text-3xl font-bold text-text-primary mt-1">
                    {stats.totalProducts}
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    {stats.totalStock.toLocaleString()} units in stock
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
              </div>
            </div>

            {/* Inventory Value */}
            <div className="bg-card border border-card-border rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary font-medium">
                    Inventory Value
                  </p>
                  <p className="text-3xl font-bold text-text-primary mt-1">
                    $ {(stats.totalValue / 1000).toFixed(1)}K
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {stats.inStock} in stock
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </div>

            {/* Total Sold */}
            <div className="bg-card border border-card-border rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary font-medium">
                    Total Sold
                  </p>
                  <p className="text-3xl font-bold text-text-primary mt-1">
                    {stats.totalSold}
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    $ {(stats.totalRevenue / 1000).toFixed(1)}K revenue
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </div>

            {/* Active Orders */}
            <div className="bg-card border border-card-border rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary font-medium">
                    Active Orders
                  </p>
                  <p className="text-3xl font-bold text-text-primary mt-1">
                    {stats.pendingOrders +
                      stats.processingOrders +
                      stats.shippedOrders}
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    {stats.deliveredOrders} delivered
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚚</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stock Status Summary */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">In Stock</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {stats.inStock}
                  </p>
                </div>
                <span className="text-3xl">✅</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Low Stock
                  </p>
                  <p className="text-2xl font-bold text-yellow-900 mt-1">
                    {stats.lowStock}
                  </p>
                </div>
                <span className="text-3xl">⚠️</span>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Out of Stock
                  </p>
                  <p className="text-2xl font-bold text-red-900 mt-1">
                    {stats.outOfStock}
                  </p>
                </div>
                <span className="text-3xl">❌</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-card-border mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "overview"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "products"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Products ({filteredProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "orders"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Orders ({filteredOrders.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="space-y-6">
            {/* Order Status Breakdown */}
            <div className="bg-card border border-card-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Order Status Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-800">
                    {stats.pendingOrders}
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">Pending</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-800">
                    {stats.processingOrders}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">Processing</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-800">
                    {stats.shippedOrders}
                  </p>
                  <p className="text-sm text-purple-600 mt-1">Shipped</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-800">
                    {stats.deliveredOrders}
                  </p>
                  <p className="text-sm text-green-600 mt-1">Delivered</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-card-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-card-border">
                  <span className="text-text-secondary">Total Products</span>
                  <span className="font-semibold text-text-primary">
                    {stats.totalProducts}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-card-border">
                  <span className="text-text-secondary">
                    Total Units in Stock
                  </span>
                  <span className="font-semibold text-text-primary">
                    {stats.totalStock.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-card-border">
                  <span className="text-text-secondary">
                    Total Inventory Value
                  </span>
                  <span className="font-semibold text-text-primary">
                    $ {stats.totalValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-card-border">
                  <span className="text-text-secondary">Total Units Sold</span>
                  <span className="font-semibold text-green-600">
                    {stats.totalSold.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-text-secondary">Total Revenue</span>
                  <span className="font-semibold text-green-600">
                    $ {stats.totalRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center w-full sm:w-1/2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, SKU, category, or brand..."
                  className="w-full px-4 py-2 rounded-md border border-card-border bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-md border border-card-border bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
                <span className="text-sm text-text-secondary whitespace-nowrap">
                  {filteredProducts.length} products
                </span>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-card border border-card-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-card-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Total Stock
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Sold
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Avg Price
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-card-border">
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.product_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                              <span className="text-xs">📦</span>
                            </div>
                            <div>
                              <p className="font-medium text-text-primary">
                                {product.name}
                              </p>
                              <p className="text-xs text-text-secondary">
                                {product.variants} variant(s)
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-text-secondary font-mono">
                          {product.sku}
                        </td>
                        <td className="px-4 py-4 text-sm text-text-secondary">
                          {product.category || "—"}
                        </td>
                        <td className="px-4 py-4 text-sm text-text-secondary">
                          {product.brand || "—"}
                        </td>
                        <td className="px-4 py-4 text-sm text-text-primary text-right font-semibold">
                          {product.totalStock.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-green-600 text-right font-semibold">
                          {product.totalSold.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-text-primary text-right">
                          $ {product.avgPrice.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStockStatusColor(
                              product.stockStatus
                            )}`}
                          >
                            {product.stockStatus === "in-stock" && "In Stock"}
                            {product.stockStatus === "low-stock" && "Low Stock"}
                            {product.stockStatus === "out-of-stock" &&
                              "Out of Stock"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            {/* Order Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-md border border-card-border bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <span className="text-sm text-text-secondary whitespace-nowrap">
                  {filteredOrders.length} orders
                </span>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-card border border-card-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-card-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Order #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Tracking
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-card-border">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.order_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-semibold text-primary">
                              {order.order_number}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {order.courier_service || "—"}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              {order.shipping_first_name}{" "}
                              {order.shipping_last_name}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {order.shipping_city}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-text-secondary">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-text-primary text-right font-semibold">
                          {order.total_items}
                        </td>
                        <td className="px-4 py-4 text-sm text-text-primary text-right font-semibold">
                          $ {parseFloat(order.total_amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.payment_status === "Paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getOrderStatusColor(
                              order.order_status
                            )}`}
                          >
                            {order.order_status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs text-text-secondary font-mono">
                            {order.tracking_number || "—"}
                          </p>
                          {order.estimated_delivery_date && (
                            <p className="text-xs text-text-secondary mt-1">
                              ETA:{" "}
                              {new Date(
                                order.estimated_delivery_date
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
