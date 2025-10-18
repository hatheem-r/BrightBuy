// src/app/profile/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ordersAPI } from "@/services/api";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push("/login");
    }

    // Fetch orders if user is a customer
    if (user && user.role === "customer" && user.customer_id) {
      fetchCustomerOrders();
    }
  }, [user, loading, router]);

  const fetchCustomerOrders = async () => {
    try {
      setLoadingOrders(true);
      const token = localStorage.getItem("authToken");
      console.log("Fetching orders for customer:", user.customer_id);
      const response = await ordersAPI.getOrdersByCustomer(user.customer_id, token);
      console.log("Orders response:", response);
      const customerOrders = response.orders || [];
      setOrders(customerOrders);

      // Calculate stats
      const stats = {
        total: customerOrders.length,
        pending: customerOrders.filter(
          (o) => o.status === "pending" || o.status === "paid"
        ).length,
        delivered: customerOrders.filter((o) => o.status === "delivered")
          .length,
        totalSpent: customerOrders.reduce(
          (sum, o) => sum + parseFloat(o.total || 0),
          0
        ),
      };
      setOrderStats(stats);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentBadge = (status) => {
    const badges = {
      pending: "bg-orange-100 text-orange-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">My Profile</h1>
          <p className="text-text-secondary mt-1">
            View and manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-card-border rounded-lg shadow-sm p-8">
            {/* User Avatar/Icon */}
            <div className="flex items-center mb-8">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-text-primary">
                  {user.name || "User"}
                </h2>
                <p className="text-text-secondary">
                  {user.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : "Member"}
                </p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <div className="border-b border-card-border pb-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Account Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Full Name
                    </label>
                    <div className="bg-background border border-card-border rounded-md p-3 text-text-primary">
                      {user.name || "N/A"}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Email Address
                    </label>
                    <div className="bg-background border border-card-border rounded-md p-3 text-text-primary">
                      {user.email || "N/A"}
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Account Type
                    </label>
                    <div className="bg-background border border-card-border rounded-md p-3 text-text-primary">
                      {user.role
                        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                        : "N/A"}
                    </div>
                  </div>

                  {/* Phone */}
                  {user.phone && (
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Phone Number
                      </label>
                      <div className="bg-background border border-card-border rounded-md p-3 text-text-primary">
                        {user.phone}
                      </div>
                    </div>
                  )}

                  {/* User ID */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      User ID
                    </label>
                    <div className="bg-background border border-card-border rounded-md p-3 text-text-primary font-mono text-sm">
                      {user.id || "N/A"}
                    </div>
                  </div>

                  {/* Created At */}
                  {user.createdAt && (
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Member Since
                      </label>
                      <div className="bg-background border border-card-border rounded-md p-3 text-text-primary">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </button>

                {user.role === "admin" && (
                  <button
                    onClick={() => router.push("/admin/dashboard")}
                    className="bg-primary text-white px-6 py-3 rounded-md hover:bg-secondary transition-colors font-medium"
                  >
                    <i className="fas fa-tachometer-alt mr-2"></i>
                    Admin Dashboard
                  </button>
                )}

                {user.role === "manager" && (
                  <button
                    onClick={() => router.push("/manager/dashboard")}
                    className="bg-primary text-white px-6 py-3 rounded-md hover:bg-secondary transition-colors font-medium"
                  >
                    <i className="fas fa-tachometer-alt mr-2"></i>
                    Manager Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order History Section - Only for customers */}
          {user.role === "customer" && (
            <div className="mt-8">
              <div className="bg-card border border-card-border rounded-lg shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary flex items-center">
                      <svg
                        className="w-7 h-7 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      My Orders
                    </h3>
                    <p className="text-text-secondary mt-1">
                      Your recent purchases and order history
                    </p>
                  </div>
                  <Link
                    href="/orders"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                  >
                    View All Orders
                  </Link>
                </div>

                {/* Order Statistics */}
                {!loadingOrders && orders.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                        Total Orders
                      </p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {orderStats.total}
                      </p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">
                        In Progress
                      </p>
                      <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                        {orderStats.pending}
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-sm text-green-600 dark:text-green-400 mb-1">
                        Delivered
                      </p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {orderStats.delivered}
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                      <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">
                        Total Spent
                      </p>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        Rs. {orderStats.totalSpent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Orders List */}
                {loadingOrders ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                    <p className="text-text-secondary">Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
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
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">
                      No Orders Yet
                    </h4>
                    <p className="text-text-secondary mb-6">
                      You haven't placed any orders. Start shopping now!
                    </p>
                    <Link
                      href="/"
                      className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 font-medium"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                      Recent Orders (Last 5)
                    </h4>
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.order_id}
                        className="border border-card-border rounded-lg p-4 hover:shadow-md transition-shadow bg-background"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h5 className="font-semibold text-text-primary">
                                Order #{order.order_id}
                              </h5>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                                  order.status
                                )}`}
                              >
                                {order.status.toUpperCase()}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(
                                  order.payment_status
                                )}`}
                              >
                                {order.payment_status === "paid"
                                  ? "PAID"
                                  : "PAYMENT PENDING"}
                              </span>
                            </div>
                            <div className="text-sm text-text-secondary space-y-1">
                              <p>
                                📅 Placed on{" "}
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                              <p>
                                📦 {order.item_count}{" "}
                                {order.item_count === 1 ? "item" : "items"} • Rs.{" "}
                                {parseFloat(order.total).toLocaleString()}
                              </p>
                              <p>🚚 {order.delivery_mode}</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Link
                              href={`/order-tracking/${order.order_id}`}
                              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 text-sm font-medium"
                            >
                              Track Order
                            </Link>
                            <Link
                              href={`/orders/${order.order_id}`}
                              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium"
                            >
                              Details
                            </Link>
                          </div>
                        </div>

                        {/* Payment Warning */}
                        {order.payment_status === "pending" && (
                          <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-2 flex items-center text-sm text-orange-800">
                            <svg
                              className="w-4 h-4 mr-2 flex-shrink-0"
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
                            <span>Payment pending - Please complete payment</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {orders.length > 5 && (
                      <div className="text-center pt-4">
                        <Link
                          href="/orders"
                          className="text-primary hover:underline font-medium"
                        >
                          View all {orders.length} orders →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Debug Information (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-6 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Debug: User Object
              </h4>
              <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
