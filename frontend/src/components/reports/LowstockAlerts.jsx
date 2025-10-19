'use client';

import { useState, useEffect } from 'react';
import reportService from '@/services/reportService';

export default function LowStockAlert({ threshold = 10 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [threshold]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await reportService.getLowStockAlert(threshold);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching low stock alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (stock) => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock < 5) return 'bg-red-50 text-red-600';
    return 'bg-yellow-50 text-yellow-600';
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Low Stock Alert</h2>
        <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold">
          {data.length} Items
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, idx) => (
          <div key={idx} className="border rounded-lg p-4 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-sm">{item.product_name}</p>
                <p className="text-xs text-gray-500">{item.sku}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.current_stock)}`}>
                {item.current_stock} units
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-3">{item.brand} - {item.color}</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Price: ${item.price}</span>
              <span className="font-semibold text-gray-800">Value: ${item.total_value?.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <p className="text-center text-gray-500 py-8">No low stock items</p>
      )}
    </div>
  );
}