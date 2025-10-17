// src/app/login/page.jsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./Auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      // Call login API
      const response = await login(formData.email, formData.password);

      if (response.success) {
        // Store token and user info using AuthContext
        authLogin(response.token, response.user);

        // Also store in localStorage for backward compatibility
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        // Store customer_id if available (for customers only)
        if (response.user.customer_id) {
          localStorage.setItem("customer_id", response.user.customer_id);
        }

        // Role-based redirect
        switch (response.user.role) {
          case "customer":
            router.push("/"); // Customer dashboard or home
            break;
          case "admin":
            router.push("/admin/dashboard");
            break;
          case "manager":
            router.push("/manager/dashboard");
            break;
          case "staff":
            router.push("/staff/dashboard");
            break;
          default:
            router.push("/");
        }
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>Sign Into Your Account</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={styles.formLabel} htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={styles.formInput}
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className={styles.formLabel} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={styles.formInput}
              disabled={loading}
              required
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <p className={styles.switchLink}>
            Don't have an account? <Link href="/signup">Create account</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
