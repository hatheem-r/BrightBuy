"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import BackButton from "@/components/BackButton";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5001";

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    shipped: 0,
    delivered: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchAllOrders();
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchAllOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BACKEND_URL}/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      const allOrders = data.orders || [];
      setOrders(allOrders);

      // Calculate statistics
      const stats = {
        total: allOrders.length,
        pending: allOrders.filter(
          (o) => o.status === "pending" || o.status === "paid"
        ).length,
        shipped: allOrders.filter((o) => o.status === "shipped").length,
        delivered: allOrders.filter((o) => o.status === "delivered").length,
        totalRevenue: allOrders
          .filter((o) => o.payment_status === "paid")
          .reduce((sum, o) => sum + parseFloat(o.total || 0), 0),
      };
      setOrderStats(stats);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${BACKEND_URL}/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Refresh orders after update
      fetchAllOrders();
      alert(`Order #${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  const handleShipmentUpdate = async (orderId, shipmentData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${BACKEND_URL}/api/orders/${orderId}/shipment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(shipmentData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update shipment information");
      }

      // Refresh orders after update
      fetchAllOrders();
      alert(`Shipment information updated for Order #${orderId}`);
    } catch (error) {
      console.error("Error updating shipment:", error);
      alert("Failed to update shipment information. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      paid: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      shipped:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      delivered:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentBadge = (status) => {
    const badges = {
      pending:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  // Filter and search orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      order.order_id.toString().includes(searchTerm) ||
      order.customer_id.toString().includes(searchTerm) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton variant="outline" label="Back to Dashboard" />
        </div>

        <div className="mb-8">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Process Orders
          </h1>
          <p className="text-text-secondary mt-1">
            Manage and process customer orders • Auto-refreshes every 30 seconds
          </p>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
              Total Orders
            </p>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              {orderStats.total}
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">
              Pending
            </p>
            <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
              {orderStats.pending}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">
              Shipped
            </p>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
              {orderStats.shipped}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <p className="text-sm text-green-600 dark:text-green-400 mb-1">
              Delivered
            </p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-300">
              {orderStats.delivered}
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
            <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-1">
              Revenue
            </p>
            <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
              $ {orderStats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-card border border-card-border rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer ID, Email or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-card-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "paid", "shipped", "delivered"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? "bg-primary text-white"
                        : "bg-background text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchAllOrders}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-card border border-card-border rounded-lg shadow-sm p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {filterStatus === "all"
                ? "No Orders Found"
                : `No ${filterStatus} Orders`}
            </h3>
            <p className="text-text-secondary mb-6">
              {searchTerm
                ? "No orders match your search criteria."
                : filterStatus === "all"
                ? "No orders have been placed yet."
                : `There are no ${filterStatus} orders at this time.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.order_id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
                onShipmentUpdate={handleShipmentUpdate}
                getStatusBadge={getStatusBadge}
                getPaymentBadge={getPaymentBadge}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Separate Order Card Component for better organization
function OrderCard({
  order,
  onStatusUpdate,
  onShipmentUpdate,
  getStatusBadge,
  getPaymentBadge,
}) {
  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [shipmentData, setShipmentData] = useState({
    shipment_provider: order.shipment_provider || "",
    tracking_number: order.tracking_number || "",
    notes: order.shipment_notes || "",
  });

  const handleShipmentSubmit = (e) => {
    e.preventDefault();
    onShipmentUpdate(order.order_id, shipmentData);
    setShowShipmentForm(false);
  };

  const isStorePickup = order.delivery_mode === "Store Pickup";

  return (
    <div className="bg-card border border-card-border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h3 className="font-bold text-text-primary text-lg">
              Order #{order.order_id}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                order.status
              )}`}
            >
              {order.status.toUpperCase()}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(
                order.payment_status
              )}`}
            >
              {order.payment_status === "paid" ? "PAID" : "PAYMENT PENDING"}
            </span>
            {isStorePickup && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                STORE PICKUP
              </span>
            )}
          </div>

          <div className="text-sm text-text-secondary space-y-1">
            <p>👤 Customer ID: {order.customer_id}</p>
            <p>
              📅 Placed on {new Date(order.created_at).toLocaleDateString()} at{" "}
              {new Date(order.created_at).toLocaleTimeString()}
            </p>
            <p>
              📦 {order.item_count} {order.item_count === 1 ? "item" : "items"}{" "}
              in order • $ {parseFloat(order.total).toLocaleString()}
            </p>
            <p>
              🚚 Delivery: {order.delivery_mode}{" "}
              {order.delivery_zip &&
                !isStorePickup &&
                `• ZIP: ${order.delivery_zip}`}
            </p>
            {order.estimated_delivery_days && (
              <p>⏱️ Est. Delivery: {order.estimated_delivery_days} days</p>
            )}
          </div>

          {/* Store Pickup Notice */}
          {isStorePickup && (
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <div>
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                    Store Pickup Order
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    Customer will collect this order from the store. No courier
                    service required.
                    {order.status === "paid" && " Prepare items for pickup."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {/* Status Update Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-text-primary whitespace-nowrap">
              Update Status:
            </label>
            <select
              value={order.status}
              onChange={(e) => onStatusUpdate(order.order_id, e.target.value)}
              className="px-3 py-2 border border-card-border rounded-lg bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* View Details Button */}
          <Link
            href={`/order-tracking/${order.order_id}`}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 text-sm font-medium text-center"
          >
            Track Order
          </Link>
        </div>
      </div>

      {order.payment_status === "pending" && (
        <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 flex items-center text-sm text-orange-800 dark:text-orange-300">
          <svg
            className="w-5 h-5 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>⚠️ Payment not completed - Order processing on hold</span>
        </div>
      )}
    </div>
  );
}
