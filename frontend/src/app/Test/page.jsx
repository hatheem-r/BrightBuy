'use client';
import { useState } from 'react';

export default function TestPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="text-4xl mb-4">Counter: {count}</div>
        <button
          onClick={() => setCount(prev => prev + 1)}
          className="bg-primary hover:bg-secondary text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          <span>+</span>
        </button>
      </div>
    </div>
  );
}