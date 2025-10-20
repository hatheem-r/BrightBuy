"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default function CustomerManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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
    fetchCustomers();
  }, [router]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/customers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (customerId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/staff/customers/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedCustomer(data.customer);
        setShowDetails(true);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const fullName = `${c.first_name || ""} ${c.last_name || ""}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm))
    );
  });

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading customers...</p>
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Customer Management
            </h1>
            <p className="text-text-secondary mt-2">
              View customer information and order history
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Customer Details Modal */}
        {showDetails && selectedCustomer && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-text-primary">
                Customer Details
              </h2>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedCustomer(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-text-primary mb-3">
                  Personal Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedCustomer.first_name} {selectedCustomer.last_name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedCustomer.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedCustomer.phone || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Username:</span>{" "}
                    {selectedCustomer.user_name}
                  </p>
                  <p>
                    <span className="font-medium">Member Since:</span>{" "}
                    {new Date(selectedCustomer.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary mb-3">
                  Order Statistics
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Total Orders:</span>{" "}
                    {selectedCustomer.totalOrders}
                  </p>
                  <p>
                    <span className="font-medium">Total Spent:</span> ${" "}
                    {parseFloat(
                      selectedCustomer.totalSpent || 0
                    ).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Average Order Value:</span> ${" "}
                    {parseFloat(
                      selectedCustomer.avgOrderValue || 0
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedCustomer.addresses &&
                selectedCustomer.addresses.length > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-text-primary mb-3">
                      Addresses
                    </h3>
                    <div className="space-y-2">
                      {selectedCustomer.addresses.map((addr, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white dark:bg-gray-800 rounded border"
                        >
                          <p className="text-sm">
                            {addr.line1}
                            {addr.line2 && `, ${addr.line2}`}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {addr.city}, {addr.state} {addr.zip_code}
                          </p>
                          {addr.is_default && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-1 inline-block">
                              Default
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Customers Table */}
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-card-border">
            <h2 className="text-xl font-bold text-text-primary">
              All Customers
            </h2>
            <p className="text-sm text-text-secondary">
              Total: {filteredCustomers.length} customers
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Total Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-text-secondary"
                    >
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.customer_id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-text-primary">
                          {customer.first_name} {customer.last_name}
                        </div>
                        <div className="text-xs text-text-secondary">
                          ID: {customer.customer_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-primary">
                          {customer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-primary">
                          {customer.phone || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                          {customer.total_orders}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                        ${" "}
                        {parseFloat(customer.total_spent || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            fetchCustomerDetails(customer.customer_id)
                          }
                          className="px-4 py-2 bg-primary text-white text-sm rounded hover:opacity-90"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
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
