// src/components/Navbar.jsx
"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { cartCount } = useCart();
  const { user } = useAuth();

  return (
    <header className="bg-gradient-to-r from-card via-card to-background shadow-lg sticky top-0 z-50 border-b-2 border-primary/20 backdrop-blur-sm">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center gap-6">
          {/* Left Section: Logo & User Info */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="bg-white p-2 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="BrightBuy Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  BrightBuy
                </span>
                <span className="text-xs text-text-secondary font-medium -mt-1">
                  Your Tech Paradise
                </span>
              </div>
            </Link>

            {user && (
              <div className="hidden lg:flex items-center space-x-3 px-4 py-2 bg-background rounded-full border border-card-border shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="text-sm text-text-primary">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-text-secondary">
                    {user.email}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Center Section: Search Bar - Hidden for staff */}
          <div className="flex-1 max-w-2xl">
            {user?.role !== "staff" && <SearchBar />}
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Switcher with premium styling */}
            <div className="p-2 hover:bg-background rounded-full transition-all">
              <ThemeSwitcher />
            </div>

            {/* Cart Icon - Hidden for staff */}
            {user?.role !== "staff" && (
              <Link
                href="/cart"
                className="relative p-3 hover:bg-background rounded-full transition-all group"
              >
                <i className="fas fa-shopping-cart text-xl text-text-secondary group-hover:text-secondary transition-colors"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-secondary to-orange-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse-slow">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Actions */}
            {user ? (
              user.role === "staff" ? (
                <Link
                  href="/staff/dashboard"
                  className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105"
                >
                  <i className="fas fa-user-tie"></i>
                  <span>Staff Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/profile"
                  className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105"
                >
                  <i className="fas fa-user-circle"></i>
                  <span className="hidden md:inline">
                    {user.name || "Profile"}
                  </span>
                </Link>
              )
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-bold hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 hover:scale-105"
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Subtle animated line under navbar */}
      <div className="h-1 bg-gradient-to-r from-transparent via-secondary to-transparent animate-shimmer"></div>
    </header>
  );
};

export default Navbar;
