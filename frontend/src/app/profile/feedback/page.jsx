"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function FeedbackPage() {
  const { user } = useAuth();
  const [feedbackType, setFeedbackType] = useState("general");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement backend API for feedback
    console.log("Feedback submitted:", { feedbackType, rating, message });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage("");
      setRating(0);
    }, 3000);
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary flex items-center">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Feedback & Suggestions
          </h1>
          <p className="text-text-secondary mt-1">
            We'd love to hear from you! Share your experience and help us improve.
          </p>
        </div>

        {submitted ? (
          <div className="bg-card border border-card-border rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Thank You for Your Feedback!
            </h2>
            <p className="text-text-secondary">
              We appreciate your input and will use it to improve BrightBuy.
            </p>
          </div>
        ) : (
          <div className="bg-card border border-card-border rounded-lg shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Feedback Type */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  What would you like to share?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: "general", label: "General", icon: "💬" },
                    { id: "product", label: "Product", icon: "📦" },
                    { id: "delivery", label: "Delivery", icon: "🚚" },
                    { id: "bug", label: "Report Bug", icon: "🐛" },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFeedbackType(type.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        feedbackType === type.id
                          ? "border-primary bg-primary/10"
                          : "border-card-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-sm font-medium text-text-primary">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  How would you rate your experience?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-3xl transition-all hover:scale-110"
                    >
                      {star <= rating ? "⭐" : "☆"}
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-3 text-text-secondary self-center">
                      {rating} out of 5
                    </span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-card-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={6}
                  placeholder="Tell us about your experience, suggestions for improvement, or any issues you've encountered..."
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 font-medium"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
