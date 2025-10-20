"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default function ProfileDetailsPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    if (user && user.customer_id) {
      fetchCustomerDetails();
    } else if (!loading && user) {
      setLoadingDetails(false);
    }
  }, [user, loading]);

  const fetchCustomerDetails = async () => {
    try {
      setLoadingDetails(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_BASE_URL}/customers/${user.customer_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCustomerDetails(data.customer);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading || loadingDetails) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Profile Details
              </h1>
              <p className="text-text-secondary mt-1">
                View and manage your personal information
              </p>
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

        <div className="bg-card border border-card-border rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center mb-8">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-text-primary">
                {user.name || "User"}
              </h2>
              <p className="text-text-secondary">Customer Account</p>
            </div>
          </div>

          <div className="border-b border-card-border pb-6 mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Account Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Full Name
                </label>
                <div className="bg-background border border-card-border rounded-md p-3 text-text-primary">
                  {user.name || "N/A"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email Address
                </label>
                <div className="bg-background border border-card-border rounded-md p-3 text-text-primary">
                  {user.email || "N/A"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Phone Number
                </label>
                <div className="bg-background border border-card-border rounded-md p-3 text-text-primary">
                  {customerDetails?.phone || user.phone || "Not provided"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Customer ID
                </label>
                <div className="bg-background border border-card-border rounded-md p-3 text-text-primary font-mono text-sm">
                  #{user.customer_id || "N/A"}
                </div>
              </div>

              {user.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Member Since
                  </label>
                  <div className="bg-background border border-card-border rounded-md p-3 text-text-primary">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Delivery Address
            </h3>

            {customerDetails?.address ? (
              <div className="bg-background border border-card-border rounded-md p-4">
                <p className="text-text-primary whitespace-pre-line">
                  {customerDetails.address}
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                <p className="text-yellow-700 dark:text-yellow-300 text-sm flex items-center">
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
                  No delivery address on file. Please add your address in the
                  Settings page.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow-sm p-8 text-white">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-white/80 text-sm mb-1">Account Status</p>
              <p className="text-2xl font-bold">Active</p>
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">Account Type</p>
              <p className="text-2xl font-bold">Customer</p>
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">Loyalty Points</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
