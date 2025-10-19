'use client';

import { useState, useEffect } from 'react';
import reportService from '@/services/reportService';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('sales');
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch Sales Summary
  const fetchSalesSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportService.getSalesSummary(startDate, endDate);
      setData(response.data.data);
    } catch (err) {
      setError('Failed to load sales data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Top Products
  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportService.getTopProducts(10, 30);
      setData(response.data.data);
    } catch (err) {
      setError('Failed to load top products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Low Stock
  const fetchLowStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportService.getLowStockAlert(10);
      setData(response.data.data);
    } catch (err) {
      setError('Failed to load low stock items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Inventory Summary
  const fetchInventorySummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportService.getInventorySummary();
      setData(response.data.data);
    } catch (err) {
      setError('Failed to load inventory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Category Performance
  const fetchCategoryPerformance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportService.getCategoryPerformance();
      setData(response.data.data);
    } catch (err) {
      setError('Failed to load category data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setData(null);
    setError(null);
  };

  // Export to CSV
  const exportToCSV = async (reportType) => {
    try {
      setLoading(true);
      let response;
      
      switch (reportType) {
        case 'sales':
          response = await reportService.getDailySalesReport(startDate, endDate, 'csv');
          break;
        case 'products':
          response = await reportService.getTopProducts(10, 30, 'csv');
          break;
        case 'low-stock':
          response = await reportService.getLowStockAlert(10, 'csv');
          break;
        case 'inventory':
          response = await reportService.getInventorySummary('csv');
          break;
        case 'categories':
          response = await reportService.getCategoryPerformance('csv');
          break;
        default:
          return;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Failed to export report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">View and analyze your business metrics</p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchSalesSummary}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
              >
                {loading ? 'Loading...' : 'Apply Filter'}
              </button>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => exportToCSV('sales')}
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium"
              >
                {loading ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6 border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: 'sales', label: 'Sales', icon: '📊' },
              { id: 'products', label: 'Top Products', icon: '🏆' },
              { id: 'inventory', label: 'Inventory', icon: '📦' },
              { id: 'low-stock', label: 'Low Stock', icon: '⚠️' },
              { id: 'categories', label: 'Categories', icon: '📂' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  handleTabChange(tab.id);
                  if (tab.id === 'sales') fetchSalesSummary();
                  if (tab.id === 'products') fetchTopProducts();
                  if (tab.id === 'inventory') fetchInventorySummary();
                  if (tab.id === 'low-stock') fetchLowStock();
                  if (tab.id === 'categories') fetchCategoryPerformance();
                }}
                className={`px-6 py-4 font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6 min-h-96">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : data ? (
            <div>
              {activeTab === 'sales' && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-blue-600">{data.total_orders}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">${(data.total_revenue || 0).toFixed(2)}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Unique Customers</p>
                    <p className="text-3xl font-bold text-purple-600">{data.unique_customers}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Avg Order Value</p>
                    <p className="text-3xl font-bold text-orange-600">${(data.avg_order_value || 0).toFixed(2)}</p>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Completed Orders</p>
                    <p className="text-3xl font-bold text-pink-600">{data.completed_orders}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Delivery Fees</p>
                    <p className="text-3xl font-bold text-yellow-600">${(data.total_delivery_fees || 0).toFixed(2)}</p>
                  </div>
                </div>
              )}

              {(activeTab === 'products' || activeTab === 'inventory' || activeTab === 'categories') && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {activeTab === 'products' && (
                          <>
                            <th className="px-4 py-3 text-left">Product</th>
                            <th className="px-4 py-3 text-left">Brand</th>
                            <th className="px-4 py-3 text-center">Units Sold</th>
                            <th className="px-4 py-3 text-right">Revenue</th>
                            <th className="px-4 py-3 text-right">Orders</th>
                          </>
                        )}
                        {activeTab === 'inventory' && (
                          <>
                            <th className="px-4 py-3 text-left">Product</th>
                            <th className="px-4 py-3 text-left">SKU</th>
                            <th className="px-4 py-3 text-center">Stock</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-right">Value</th>
                          </>
                        )}
                        {activeTab === 'categories' && (
                          <>
                            <th className="px-4 py-3 text-left">Category</th>
                            <th className="px-4 py-3 text-center">Products</th>
                            <th className="px-4 py-3 text-center">Units Sold</th>
                            <th className="px-4 py-3 text-right">Revenue</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                          {activeTab === 'products' && (
                            <>
                              <td className="px-4 py-3">{row.product_name}</td>
                              <td className="px-4 py-3 text-gray-600">{row.brand}</td>
                              <td className="px-4 py-3 text-center font-semibold">{row.units_sold}</td>
                              <td className="px-4 py-3 text-right text-green-600 font-semibold">${(row.revenue || 0).toFixed(2)}</td>
                              <td className="px-4 py-3 text-right">{row.order_count}</td>
                            </>
                          )}
                          {activeTab === 'inventory' && (
                            <>
                              <td className="px-4 py-3">{row.product_name}</td>
                              <td className="px-4 py-3 text-gray-600">{row.sku}</td>
                              <td className="px-4 py-3 text-center font-semibold">{row.current_stock}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  row.stock_status === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                                  row.stock_status === 'Critical' ? 'bg-orange-100 text-orange-800' :
                                  row.stock_status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {row.stock_status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">${(row.total_value || 0).toFixed(2)}</td>
                            </>
                          )}
                          {activeTab === 'categories' && (
                            <>
                              <td className="px-4 py-3 font-semibold">{row.category_name}</td>
                              <td className="px-4 py-3 text-center">{row.total_products}</td>
                              <td className="px-4 py-3 text-center font-semibold">{row.units_sold || 0}</td>
                              <td className="px-4 py-3 text-right text-green-600 font-semibold">${(row.total_revenue || 0).toFixed(2)}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'low-stock' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.map((item, idx) => (
                    <div key={idx} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-sm">{item.product_name}</p>
                          <p className="text-xs text-gray-600">{item.sku}</p>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                          {item.current_stock} units
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{item.brand} - {item.color}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price: ${item.price}</span>
                        <span className="font-semibold">Value: ${(item.total_value || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-96">
              <p className="text-gray-500">Click a tab to view report data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}