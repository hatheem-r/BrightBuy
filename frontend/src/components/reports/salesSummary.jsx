'use client';

import { useState, useEffect } from 'react';
import reportService from '@/services/reportService';

export default function SalesSummary({ startDate, endDate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await reportService.getSalesSummary(startDate, endDate);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching sales summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Sales Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Total Orders</p>
          <p className="text-3xl font-bold text-blue-600">
            {data.total_orders}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600">
            ${data.total_revenue?.toFixed(2) || '0'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Unique Customers</p>
          <p className="text-3xl font-bold text-purple-600">
            {data.unique_customers}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Avg Order Value</p>
          <p className="text-3xl font-bold text-orange-600">
            ${data.avg_order_value?.toFixed(2) || '0'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Completed Orders</p>
          <p className="text-3xl font-bold text-pink-600">
            {data.completed_orders}
          </p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Delivery Fees</p>
          <p className="text-3xl font-bold text-yellow-600">
            ${data.total_delivery_fees?.toFixed(2) || '0'}
          </p>
        </div>
      </div>
    </div>
  );
}