// src/components/Navbar.jsx
"use client";
import Link from "next/link";
import React from "react";
import { useCart } from "@/contexts/CartContext";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { cartCount } = useCart();
  const { user } = useAuth();

  return (
    <header className="bg-card shadow-sm sticky top-0 z-50 border-b border-card-border">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-sm text-text-primary text-left">
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-text-secondary">{user.email}</div>
              </div>
            )}

            <Link href="/" className="text-2xl font-bold text-primary">
              BrightBuy
            </Link>
          </div>

          {/* Search Bar */}
          <SearchBar />

          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <Link
              href="/cart"
              className="text-text-secondary hover:text-secondary relative"
            >
              <i className="fas fa-shopping-cart text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <Link
                href="/profile"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors flex items-center space-x-2"
              >
                <i className="fas fa-user-circle"></i>
                <span>{user.name || "User"}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
