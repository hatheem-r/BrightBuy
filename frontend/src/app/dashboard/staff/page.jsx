// src/app/dashboard/staff/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch staff data from the backend
  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: Use the full URL for the Express API endpoint
      const response = await fetch('http://localhost:5001/api/staff');
      const data = await response.json();

      if (response.ok) {
        setStaffList(data.staff);
      } else {
        setError(data.message || 'Failed to load staff list.');
      }
    } catch (err) {
      setError('Network error: Could not connect to the backend server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchStaff();
  }, []); // Empty dependency array means run once on mount

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-600">Staff & User Management</h1>
        <Link 
          href="/dashboard/staff/add" 
          className="bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition-colors"
        >
          + Add New Staff
        </Link>
      </div>
      
      {/* Loading and Error States */}
      {loading && <p className="text-gray-500">Loading staff data...</p>}
      {error && <p className="text-red-500 font-semibold">Error: {error}</p>}

      {/* Staff List Table */}
      {!loading && !error && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffList.length > 0 ? (
                staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{staff.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            staff.role === 'Admin' ? 'bg-red-100 text-red-800' :
                            staff.role === 'Manager' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                            {staff.role}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(staff.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No staff members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}