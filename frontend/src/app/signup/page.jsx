// src/app/signup/page.jsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../login/Auth.module.css'; 

export default function SignupPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('\n=== FRONTEND SIGNUP FORM SUBMISSION ===');
        console.log('Form data:', {
            name: formData.name,
            email: formData.email,
            password: '***' + formData.password.slice(-3),
            confirmPassword: '***' + formData.confirmPassword.slice(-3)
        });
        
        setError('');
        
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            console.log('❌ Passwords do not match');
            setError('Passwords do not match');
            return;
        }
        
        console.log('✓ Password validation passed');
        setLoading(true);
        
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };
            
            console.log('Sending POST request to /api/auth/signup');
            console.log('Payload:', {
                ...payload,
                password: '***' + payload.password.slice(-3)
            });
            
            const response = await fetch('http://localhost:5001/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            const data = await response.json();
            console.log('Response data:', {
                ...data,
                token: data.token ? 'JWT_TOKEN_' + data.token.slice(-10) : 'no token'
            });
            
            if (response.ok && data.success) {
                console.log('✅ Signup successful!');
                console.log('Storing token and user data in localStorage');
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                console.log('Redirecting to home page...');
                console.log('=== END FRONTEND SIGNUP ===\n');
                router.push('/');
            } else {
                console.log('❌ Signup failed:', data.message);
                console.log('=== END FRONTEND SIGNUP (ERROR) ===\n');
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            console.error('❌ Network error during signup:', err);
            console.log('Error details:', {
                message: err.message,
                stack: err.stack
            });
            console.log('=== END FRONTEND SIGNUP (ERROR) ===\n');
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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