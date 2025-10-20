"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);

    // Check if user is admin
    if (parsedUser.role !== "admin") {
      router.push("/");
      return;
    }

    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Admin Dashboard
            </h1>
            <p className="text-text-secondary mt-2">
              Welcome back, {user.name}!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-card-border rounded-lg p-6">
            <h3 className="text-text-secondary text-sm font-medium">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-text-primary mt-2">1,234</p>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-6">
            <h3 className="text-text-secondary text-sm font-medium">
              Total Orders
            </h3>
            <p className="text-3xl font-bold text-text-primary mt-2">567</p>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-6">
            <h3 className="text-text-secondary text-sm font-medium">
              Total Products
            </h3>
            <p className="text-3xl font-bold text-text-primary mt-2">89</p>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-6">
            <h3 className="text-text-secondary text-sm font-medium">Revenue</h3>
            <p className="text-3xl font-bold text-text-primary mt-2">
              $ 45,678
            </p>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            Admin Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-primary text-white rounded-lg hover:opacity-90">
              Manage Users
            </button>
            <button className="p-4 bg-primary text-white rounded-lg hover:opacity-90">
              Manage Products
            </button>
            <button className="p-4 bg-primary text-white rounded-lg hover:opacity-90">
              Manage Orders
            </button>
            <button className="p-4 bg-primary text-white rounded-lg hover:opacity-90">
              View Analytics
            </button>
            <button className="p-4 bg-primary text-white rounded-lg hover:opacity-90">
              System Settings
            </button>
            <button className="p-4 bg-primary text-white rounded-lg hover:opacity-90">
              Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
