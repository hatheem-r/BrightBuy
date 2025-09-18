// src/app/login/page.jsx
'use client';
import React from 'react';
import Link from 'next/link';
import styles from './Auth.module.css'; 

export default function LoginPage() {
    return (
        <main className={styles.pageWrapper}>
            <div className={styles.formCard}>
                <h2 className={styles.title}>Sign Into Your Account</h2>
                <form className="space-y-6">
                    <div>
                        <label className={styles.formLabel} htmlFor="email">Email Address</label>
                        <input type="email" id="email" placeholder="you@example.com" className={styles.formInput} />
                    </div>
                    <div>
                         <label className={styles.formLabel} htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="••••••••" className={styles.formInput} />
                    </div>
                    <button type="submit" className={styles.submitButton}>Sign In</button>
                    <p className={styles.switchLink}>
                        Don't have an account?{' '}
                        <Link href="/signup">Create account</Link>
                    </p>
                </form>
            </div>
        </main>
    );
}