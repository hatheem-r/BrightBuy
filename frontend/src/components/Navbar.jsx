// src/components/Navbar.jsx
'use client';
import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const Navbar = () => {
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth(); // Use AuthContext

  const getDashboardLink = () => {
    if (!user) return '/login'; // Fallback, though should be authenticated if this is called
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'manager':
        return '/manager/dashboard';
      default:
        return '/'; // Customer dashboard or home
    }
  };

  return (
    <header className="bg-card shadow-sm sticky top-0 z-50 border-b border-card-border">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          BrightBuy
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
          <Link href="/cart" className="text-text-secondary hover:text-secondary relative">
            <i className="fas fa-shopping-cart text-xl"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <Link href={getDashboardLink()} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors">
                {user.role === 'admin' || user.role === 'manager' ? 'Dashboard' : 'Profile'}
              </Link>
              <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
