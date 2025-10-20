"use client";
import React from "react";

export default function PaymentsPage() {
  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary flex items-center">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Payment Methods
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your payment methods and transaction history
          </p>
        </div>

        <div className="bg-card border border-card-border rounded-lg shadow-sm p-12 text-center">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Payment Methods Coming Soon
          </h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            We're working on adding payment method management. You'll be able to save cards, view transaction history, and manage payment preferences.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              💳 Currently, we process payments securely at checkout using Cash on Delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
