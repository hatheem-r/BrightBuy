"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default function StaffManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    phone: "",
    role: "Level02",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Check authentication and authorization
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);

    // Check if user is Level01 staff
    if (parsedUser.role !== "staff" || parsedUser.staff_level !== "Level01") {
      router.push("/staff/dashboard");
      return;
    }

    setUser(parsedUser);
    fetchStaffList();
  }, [router]);

  const fetchStaffList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStaffList(data.staff || []);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/staff/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Staff member added successfully!",
        });
        setFormData({
          userName: "",
          email: "",
          password: "",
          phone: "",
          role: "Level02",
        });
        setShowAddForm(false);
        fetchStaffList();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to add staff member",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Server error. Please try again." });
    }
  };

  const handleDeleteStaff = async (staffId, staffEmail) => {
    if (
      !confirm(`Are you sure you want to delete staff member: ${staffEmail}?`)
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/staff/${staffId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Staff member deleted successfully!",
        });
        fetchStaffList();
      } else {
        const data = await response.json();
        setMessage({
          type: "error",
          text: data.message || "Failed to delete staff member",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Server error. Please try again." });
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Staff Management
            </h1>
            <p className="text-text-secondary mt-2">
              Manage staff members and permissions (Level01 Access)
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
          >
            {showAddForm ? "Cancel" : "+ Add New Staff"}
          </button>
        </div>

        {/* Messages */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Add Staff Form */}
        {showAddForm && (
          <div className="bg-card border border-card-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Add New Staff Member
            </h2>
            <form
              onSubmit={handleAddStaff}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  placeholder="e.g., staff_john"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  placeholder="staff@brightbuy.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  placeholder="1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Staff Level
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                >
                  <option value="Level02">Level02 (Normal Staff)</option>
                  <option value="Level01">Level01 (Senior Staff)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Staff List */}
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-card-border">
            <h2 className="text-xl font-bold text-text-primary">
              All Staff Members
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {staffList.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-text-secondary"
                    >
                      No staff members found
                    </td>
                  </tr>
                ) : (
                  staffList.map((staff) => (
                    <tr
                      key={staff.staff_id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-text-primary">
                          {staff.user_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-primary">
                          {staff.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-primary">
                          {staff.phone || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            staff.role === "Level01"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {staff.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {new Date(staff.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {staff.staff_id !== user.staff_id && (
                          <button
                            onClick={() =>
                              handleDeleteStaff(staff.staff_id, staff.email)
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                        {staff.staff_id === user.staff_id && (
                          <span className="text-gray-400">You</span>
                        )}
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
