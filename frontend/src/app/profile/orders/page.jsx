"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ordersAPI } from "@/services/api";

export default function MyOrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    if (user && user.customer_id) {
      fetchCustomerOrders();
    }
  }, [user]);

  const fetchCustomerOrders = async () => {
    try {
      setLoadingOrders(true);
      const token = localStorage.getItem("authToken");
      const response = await ordersAPI.getOrdersByCustomer(
        user.customer_id,
        token
      );
      const customerOrders = response.orders || [];
      setOrders(customerOrders);

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
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      paid: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      shipped:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      delivered:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
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

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  if (loading || loadingOrders) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto">
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            My Orders
          </h1>
          <p className="text-text-secondary mt-1">
            View and track all your orders
          </p>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
              In Progress
            </p>
            <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
              {orderStats.pending}
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
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">
              Total Spent
            </p>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
              $ {orderStats.totalSpent.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-card border border-card-border rounded-lg p-4 mb-6">
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {filterStatus === "all"
                ? "No Orders Yet"
                : `No ${filterStatus} Orders`}
            </h3>
            <p className="text-text-secondary mb-6">
              {filterStatus === "all"
                ? "You haven't placed any orders. Start shopping now!"
                : `You don't have any ${filterStatus} orders.`}
            </p>
            {filterStatus === "all" && (
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 font-medium"
              >
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.order_id}
                className="bg-card border border-card-border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
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
                        {order.item_count === 1 ? "item" : "items"} • ${" "}
                        {parseFloat(order.total).toLocaleString()}
                      </p>
                      <p>🚚 {order.delivery_mode}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/order-tracking/${order.order_id}`}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 text-sm font-medium"
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
                    <span>
                      Payment pending - Please complete payment to process your
                      order
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
