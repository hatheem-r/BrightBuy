"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StaffDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    pendingOrders: 0,
    lowStockItems: 0,
    todaysSales: 0,
    totalCustomers: 0,
    productsNeedingUpdate: 0,
    recentActivity: [],
  });

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

    // TODO: Fetch actual stats from API
    // For now using mock data
    setStats({
      pendingOrders: 15,
      lowStockItems: 5,
      todaysSales: 8750,
      totalCustomers: 234,
      productsNeedingUpdate: 3,
      recentActivity: [
        { id: 1, action: "Order #1234 shipped", time: "2 hours ago" },
        {
          id: 2,
          action: "Stock updated for Product #456",
          time: "4 hours ago",
        },
        { id: 3, action: "New customer registered", time: "5 hours ago" },
      ],
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Staff Dashboard
              </h1>
              <p className="text-text-secondary mt-2">
                Welcome back, {user.name}!
              </p>
              <p className="text-sm text-text-secondary">
                Staff ID: {user.staff_id || "N/A"} | Level:{" "}
                {user.staff_level || "N/A"}
              </p>
              {user.staff_level === "Level01" && (
                <p className="text-xs text-primary font-semibold mt-1">
                  ⭐ Senior Staff - Staff Management Access
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2 shadow-lg"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-card-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-secondary text-sm font-medium">
                  Pending Orders
                </h3>
                <p className="text-3xl font-bold text-text-primary mt-2">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-300"
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
              </div>
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-secondary text-sm font-medium">
                  Low Stock Items
                </h3>
                <p className="text-3xl font-bold text-text-primary mt-2">
                  {stats.lowStockItems}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-orange-600 dark:text-orange-300"
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
              </div>
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-secondary text-sm font-medium">
                  Today's Sales
                </h3>
                <p className="text-3xl font-bold text-text-primary mt-2">
                  $ {stats.todaysSales.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-secondary text-sm font-medium">
                  Total Customers
                </h3>
                <p className="text-3xl font-bold text-text-primary mt-2">
                  {stats.totalCustomers}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Overview - Now uses full width with Recent Activity */}
          <div className="lg:col-span-2 bg-card border border-card-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Quick Overview
            </h2>
            <div className="space-y-4">
              <p className="text-text-secondary">
                Use the sidebar to navigate between different sections of the
                staff portal. All your tools are available in the left panel.
              </p>
              {stats.productsNeedingUpdate > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-yellow-800 dark:text-yellow-300">
                    📦 {stats.productsNeedingUpdate} products need attention
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-card-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Recent Activity
            </h2>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="border-l-4 border-primary pl-4 py-2"
                >
                  <p className="text-text-primary font-medium">
                    {activity.action}
                  </p>
                  <p className="text-sm text-text-secondary">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Alert */}
        {stats.lowStockItems > 0 && (
          <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3 flex-shrink-0"
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
              <div>
                <h3 className="text-orange-800 dark:text-orange-300 font-semibold">
                  Action Required
                </h3>
                <p className="text-orange-700 dark:text-orange-400 mt-1">
                  There are {stats.lowStockItems} products with low stock
                  levels. Please update inventory.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
