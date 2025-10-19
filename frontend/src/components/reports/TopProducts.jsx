'use client';

import { useState, useEffect } from 'react';
import reportService from '@/services/reportService';

export default function TopProducts({ days = 30, limit = 10 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [days, limit]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await reportService.getTopProducts(limit, days);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching top products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Top Products (Last {days} Days)</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Brand</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Units Sold</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Revenue</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Orders</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Avg Price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{product.product_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.brand}</td>
                <td className="px-6 py-4 text-center font-semibold">
                  {product.units_sold}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-green-600">
                  ${product.revenue?.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-gray-600">
                  {product.order_count}
                </td>
                <td className="px-6 py-4 text-right text-gray-600">
                  ${product.avg_price?.toFixed(2)}
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
