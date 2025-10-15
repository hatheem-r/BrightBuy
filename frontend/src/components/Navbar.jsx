// src/components/Navbar.jsx
"use client";
import Link from "next/link";
import React from "react";
import { useCart } from "@/contexts/CartContext";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import SearchBar from "@/components/SearchBar";

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <header className="bg-card shadow-sm sticky top-0 z-50 border-b border-card-border">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            BrightBuy
          </Link>

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
            <Link
              href="/login"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
