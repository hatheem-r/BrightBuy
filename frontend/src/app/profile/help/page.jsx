"use client";
import React, { useState } from "react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const faqs = [
    {
      category: "orders",
      question: "How can I track my order?",
      answer:
        "You can track your order by going to 'My Orders' in the sidebar and clicking on 'Track Order' for any active order. You'll see real-time updates on your order status and delivery progress.",
    },
    {
      category: "orders",
      question: "Can I cancel my order?",
      answer:
        "Yes, you can cancel your order within 24 hours of placing it, as long as it hasn't been shipped. Contact our support team or visit the order details page.",
    },
    {
      category: "payment",
      question: "What payment methods do you accept?",
      answer:
        "Currently, we accept Cash on Delivery (COD). We're working on adding more payment methods including credit/debit cards and digital wallets.",
    },
    {
      category: "delivery",
      question: "What are your delivery charges?",
      answer:
        "Delivery charges vary based on your location and order value. Standard delivery is $100, and it's FREE for orders above $2,000.",
    },
    {
      category: "delivery",
      question: "How long does delivery take?",
      answer:
        "Standard delivery typically takes 3-5 business days. Express delivery (1-2 days) is available for select areas at an additional cost.",
    },
    {
      category: "account",
      question: "How do I change my password?",
      answer:
        "Go to Settings in the sidebar, select 'Change Password', enter your current password and new password, then click 'Change Password'.",
    },
    {
      category: "account",
      question: "How do I update my delivery address?",
      answer:
        "You can update your delivery address in Settings > Change Profile. Enter your new address in the 'Delivery Address' field and click 'Save Changes'.",
    },
    {
      category: "returns",
      question: "What is your return policy?",
      answer:
        "We accept returns within 7 days of delivery for most products. Items must be unused and in original packaging. Contact support to initiate a return.",
    },
  ];

  const categories = [
    { id: "all", name: "All Topics", icon: "📚" },
    { id: "orders", name: "Orders", icon: "📦" },
    { id: "payment", name: "Payment", icon: "💳" },
    { id: "delivery", name: "Delivery", icon: "🚚" },
    { id: "account", name: "Account", icon: "👤" },
    { id: "returns", name: "Returns", icon: "↩️" },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary flex items-center">
            <svg
              className="w-8 h-8 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Help & Support
          </h1>
          <p className="text-text-secondary mt-1">
            Find answers to common questions and get help
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-card border border-card-border rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-10 pr-4 py-3 border border-card-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-card border border-card-border rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeCategory === category.id
                    ? "bg-primary text-white"
                    : "bg-background text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-card border border-card-border rounded-lg shadow-sm p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No results found
              </h3>
              <p className="text-text-secondary">
                Try different keywords or browse all categories
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <details
                key={index}
                className="bg-card border border-card-border rounded-lg shadow-sm group"
              >
                <summary className="cursor-pointer p-6 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary pr-4">
                      {faq.question}
                    </h3>
                    <svg
                      className="w-5 h-5 text-text-secondary group-open:rotate-180 transition-transform flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </summary>
                <div className="px-6 pb-6 pt-2">
                  <p className="text-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-8 bg-gradient-to-r from-primary to-secondary rounded-lg shadow-sm p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
            <p className="text-white/80 mb-6">
              Our support team is here to assist you
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:support@brightbuy.com"
                className="px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 font-medium inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email Support
              </a>
              <button className="px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 font-medium inline-flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
