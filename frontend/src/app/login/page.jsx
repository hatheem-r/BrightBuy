// src/app/login/page.jsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Auth.module.css'; 
import api from './api';
// import { useAuth } from './context/AuthContext';

export default function LoginPage() {
  const [values, setValues] = useState({ email: '', password: '' });
  const router = useRouter();
//   const { refreshUser } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await api.post('/login', values); // sets cookie on success
      if (res.data?.Status) {
        // await refreshUser();
        router.replace('/shop');
      } else {
        alert(res.data?.Error || 'Login failed');
      }
    } catch (err) {
      console.log(err);
      alert('Login error');
    }
  };

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>Sign Into Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={styles.formLabel} htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className={styles.formInput}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              name="email"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className={styles.formLabel} htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className={styles.formInput}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              name="password"
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>Sign In</button>
          <p className={styles.switchLink}>
            Don&apos;t have an account?{' '}
            <Link href="/signup">Create account</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
