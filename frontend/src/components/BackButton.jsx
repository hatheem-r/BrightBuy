"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ className = "", label = "Back", variant = "default" }) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  // Different variants for different contexts
  const variants = {
    default: "px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg font-medium flex items-center gap-2 transition-colors",
    red: "px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md",
    primary: "px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md",
    outline: "px-4 py-2 border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 rounded-lg font-medium flex items-center gap-2 transition-colors",
    ghost: "px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium flex items-center gap-2 transition-colors",
  };

  const buttonClass = className || variants[variant] || variants.default;

  return (
    <button onClick={handleBack} className={buttonClass} aria-label="Go back to previous page">
      {/* Back Arrow Icon */}
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
}
