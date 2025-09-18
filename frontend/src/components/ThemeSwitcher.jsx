// src/components/ThemeSwitcher.jsx
'use client';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>;
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-card border border-card-border hover:bg-background transition-colors"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <i className="fas fa-sun text-yellow-400"></i>
      ) : (
        <i className="fas fa-moon text-primary"></i>
      )}
    </button>
  );
};