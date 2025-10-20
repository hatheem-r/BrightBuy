"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5001";

export default function StaffSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Change Profile State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    staff_level: "",
  });

  // Change Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete Account State
  const [deleteData, setDeleteData] = useState({
    password: "",
    confirmation: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);

    if (parsedUser.role !== "staff") {
      router.push("/");
      return;
    }

    setUser(parsedUser);
    setProfileData({
      name: parsedUser.name || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || "",
      staff_level: parsedUser.staff_level || "",
    });
    setLoading(false);
  }, [router]);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${BACKEND_URL}/api/staff/${user.staff_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Update local storage
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        showMessage("Profile updated successfully!", "success");
      } else {
        const data = await response.json();
        showMessage(data.message || "Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showMessage("Error updating profile", "error");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("New passwords do not match!", "error");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage("Password must be at least 6 characters", "error");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        showMessage("Password changed successfully!", "success");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const data = await response.json();
        showMessage(data.message || "Failed to change password", "error");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      showMessage("Error changing password", "error");
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (deleteData.confirmation !== "DELETE") {
      showMessage("Please type DELETE to confirm", "error");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${BACKEND_URL}/api/staff/${user.staff_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: deleteData.password }),
        }
      );

      if (response.ok) {
        showMessage("Account deleted successfully. Logging out...", "success");
        setTimeout(() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          router.push("/");
        }, 2000);
      } else {
        const data = await response.json();
        showMessage(data.message || "Failed to delete account", "error");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      showMessage("Error deleting account", "error");
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading settings...</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: "profile", name: "Change Profile", icon: "👤" },
    { id: "password", name: "Change Password", icon: "🔒" },
    { id: "delete", name: "Delete Account", icon: "🗑️" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Staff Account Settings
            </h1>
            <p className="text-text-secondary mt-1">
              Manage your staff account preferences and security
            </p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Section Tabs */}
          <div className="bg-card border border-card-border rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeSection === section.id
                      ? "bg-primary text-white"
                      : "bg-background text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span>{section.icon}</span>
                  {section.name}
                </button>
              ))}
            </div>
          </div>

          {/* Change Profile Section */}
          {activeSection === "profile" && (
            <div className="bg-card border border-card-border rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Update Profile Information
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-card-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-card-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-card-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Staff Level
                  </label>
                  <input
                    type="text"
                    value={profileData.staff_level}
                    className="w-full px-4 py-3 border border-card-border rounded-lg bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Staff level cannot be changed here. Contact admin.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 font-medium"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Change Password Section */}
          {activeSection === "password" && (
            <div className="bg-card border border-card-border rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Change Password
              </h2>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-card-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-card-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Must be at least 6 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-card-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 font-medium"
                >
                  Change Password
                </button>
              </form>
            </div>
          )}

          {/* Delete Account Section */}
          {activeSection === "delete" && (
            <div className="bg-card border border-card-border rounded-lg shadow-sm p-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="text-red-800 font-bold flex items-center mb-2">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Warning: This action cannot be undone
                </h3>
                <p className="text-red-700 text-sm">
                  Deleting your staff account will permanently remove all your
                  data and access to the system. This action requires admin
                  approval in most cases.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Delete Staff Account
              </h2>
              <form onSubmit={handleDeleteAccount} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Confirm Your Password
                  </label>
                  <input
                    type="password"
                    value={deleteData.password}
                    onChange={(e) =>
                      setDeleteData({ ...deleteData, password: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-card-border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Type "DELETE" to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteData.confirmation}
                    onChange={(e) =>
                      setDeleteData({
                        ...deleteData,
                        confirmation: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-card-border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Type DELETE"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
                >
                  Delete My Account Permanently
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
