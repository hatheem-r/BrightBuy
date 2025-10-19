// src/app/dashboard/layout.jsx

import Link from 'next/link';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-gray-800 p-6 text-white">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        
        {/* Navigation Links using Next.js Link */}
        <ul className="space-y-4">
          <li>
            {/* Base Dashboard Route */}
            <Link href="/dashboard" className="hover:text-yellow-400 transition-colors">
              Dashboard Overview
            </Link>
          </li>
          <li>
            {/* Customer Tab Route */}
            <Link href="/dashboard/customer" className="hover:text-yellow-400 transition-colors">
              Customers
            </Link>
          </li>
          <li>
            {/* Order Tab Route */}
            <Link href="/dashboard/order" className="hover:text-yellow-400 transition-colors">
              Orders
            </Link>
          </li>
          <li>
            {/* Staff Tab Route */}
            <Link href="/dashboard/staff" className="hover:text-yellow-400 transition-colors">
              Staff
            </Link>
          </li>
          {/* ⭐ NEW LINK FOR PRODUCTS ⭐ */}
          <li>
            <Link href="/dashboard/products" className="hover:text-yellow-400 transition-colors font-bold">
              Products
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* Main Content Area */}
      <main className="flex-1 p-8 bg-gray-50">
        {children} 
      </main>
    </div>
  );
}