// src/app/profile/page.jsx
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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
