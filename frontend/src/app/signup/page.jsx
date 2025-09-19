// src/app/signup/page.jsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../login/Auth.module.css';
import api from './api'; // <-- make sure you have this axios instance file

export default function SignupPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
import styles from '../login/Auth.module.css'; 

export default function SignupPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/signup', formData);
            if (res.data?.Status) {
                router.push('/login'); // ✅ use router.push instead of navigate
            } else {
                setError(res.data?.Error || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            setError('Registration error');
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { /* ... same as before ... */ };

    return (
        <main className={styles.pageWrapper}>
            <div className={styles.formCard}>
                <h2 className={styles.title}>Create Your Account</h2>
                {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={styles.formLabel} htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={styles.formInput} />
                    </div>
                    <div>
                        <label className={styles.formLabel} htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={styles.formInput} />
                    </div>
                    <div>
                        <label className={styles.formLabel} htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className={styles.formInput} />
                    </div>
                    <div>
                        <label className={styles.formLabel} htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className={styles.formInput} />
                    </div>
                    <button type="submit" disabled={loading} className={styles.submitButton}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                    <p className={styles.switchLink}>
                        Already have an account?{' '}
                        <Link href="/login">Sign In</Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
}
