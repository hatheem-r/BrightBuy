// frontend/src/app/login/page.jsx
'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth hook
import styles from "./Auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, user, login, loading } = useAuth(); // Use AuthContext
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Redirect if already logged in (handled by AuthContext now)
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.replace('/admin/dashboard');
      } else if (user.role === 'manager') {
        router.replace('/manager/dashboard');
      } else {
        router.replace('/');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields");
      }

      const result = await login(formData.email, formData.password);

      if (!result.success) {
        setError(result.message || "Login failed. Please check your credentials.");
      }
      // Redirection is handled by the useEffect above after successful login
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>Sign Into Your Account</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={styles.formLabel} htmlFor="email">Email Address</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={styles.formInput} disabled={loading} required />
          </div>
          <div>
            <label className={styles.formLabel} htmlFor="password">Password</label>
            <input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className={styles.formInput} disabled={loading} required />
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
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
