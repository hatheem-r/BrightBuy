// src/app/dashboard/staff/add/page.jsx
'use client';

import React, { useState } from 'react';

export default function AddStaffPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Staff', // Default role
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ... (in src/app/dashboard/staff/add/page.jsx)

const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting staff data...');

    try {
        // --- TARGETING THE NEW EXPRESS ROUTE: /api/staff/add ---
        const response = await fetch('http://localhost:5001/api/staff/add', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        // ----------------------------------------------------
        
        const data = await response.json();

        if (response.ok) {
            setMessage(`✅ Staff member added successfully! ID: ${data.staffId}`);
            setFormData({ name: '', email: '', password: '', role: 'Staff' });
        } else {
            setMessage(`❌ Error: ${data.message || 'Failed to add staff member.'}`);
        }
    } catch (error) {
        setMessage('❌ Network Error: Could not connect to the Express server.');
        console.error('Submission Error:', error);
    }
};

// ...

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-red-600">Add New Staff Member</h1>
      
      {message && (
        <div className={`p-3 mb-4 rounded ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
            <option value="Intern">Intern</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-700 transition-colors"
        >
          Add Staff
        </button>
      </form>
    </div>
  );
}