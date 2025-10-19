'use client';

import { useState, useEffect } from 'react';
import reportService from '@/services/reportService';

export default function CategoryPerformance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await reportService.getCategoryPerformance();
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching category performance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Category Performance</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Products</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Units Sold</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Revenue</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Avg Price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((category, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{category.category_name}</td>
                <td className="px-6 py-4 text-center text-gray-600">
                  {category.total_products}
                </td>
                <td className="px-6 py-4 text-center font-semibold">
                  {category.units_sold || 0}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-green-600">
                  ${(category.total_revenue || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-gray-600">
                  ${(category.avg_price || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <p className="text-center text-gray-500 py-8">No data available</p>
      )}
    </div>
  );
}