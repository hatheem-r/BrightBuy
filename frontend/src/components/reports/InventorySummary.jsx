'use client';

import { useState, useEffect } from 'react';
import reportService from '@/services/reportService';

export default function InventorySummary() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await reportService.getInventorySummary();
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching inventory summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => {
    if (filter === 'all') return true;
    return item.stock_status === filter;
  });

  const stats = {
    total: data.length,
    outOfStock: data.filter(d => d.stock_status === 'Out of Stock').length,
    critical: data.filter(d => d.stock_status === 'Critical').length,
    low: data.filter(d => d.stock_status === 'Low').length,
    inStock: data.filter(d => d.stock_status === 'In Stock').length,
    totalValue: data.reduce((sum, item) => sum + (item.total_value || 0), 0)
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Inventory Summary</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-xs text-gray-600">Total Items</p>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-xs text-gray-600">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-xs text-gray-600">Critical</p>
          <p className="text-2xl font-bold text-orange-600">{stats.critical}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-xs text-gray-600">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.low}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-xs text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-green-600">${stats.totalValue?.toFixed(0)}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {['all', 'In Stock', 'Low', 'Critical', 'Out of Stock'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-center">Stock</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{item.product_name}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{item.sku}</td>
                <td className="px-4 py-3 text-center font-semibold">
                  {item.current_stock}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.stock_status === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                    item.stock_status === 'Critical' ? 'bg-orange-100 text-orange-800' :
                    item.stock_status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.stock_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">${item.total_value?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}