import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

const reportService = {
  getSalesSummary: (startDate, endDate) =>
    axios.get(`${API_BASE}/reports/sales/summary`, {
      params: { startDate, endDate },
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    }),

  getDailySalesReport: (startDate, endDate, format = 'json') =>
    axios.get(`${API_BASE}/reports/sales/daily`, {
      params: { startDate, endDate, format },
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      responseType: format === 'csv' ? 'blob' : 'json'
    }),

  getTopProducts: (limit = 10, days = 30, format = 'json') =>
    axios.get(`${API_BASE}/reports/products/top`, {
      params: { limit, days, format },
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      responseType: format === 'csv' ? 'blob' : 'json'
    }),

  getLowStockAlert: (threshold = 10, format = 'json') =>
    axios.get(`${API_BASE}/reports/inventory/low-stock`, {
      params: { threshold, format },
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      responseType: format === 'csv' ? 'blob' : 'json'
    }),

  getInventorySummary: (format = 'json') =>
    axios.get(`${API_BASE}/reports/inventory/summary`, {
      params: { format },
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      responseType: format === 'csv' ? 'blob' : 'json'
    }),

  getCategoryPerformance: (format = 'json') =>
    axios.get(`${API_BASE}/reports/categories/performance`, {
      params: { format },
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      responseType: format === 'csv' ? 'blob' : 'json'
    }),

  getCustomerAnalysis: (limit = 100, format = 'json') =>
    axios.get(`${API_BASE}/reports/customers/analysis`, {
      params: { limit, format },
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      responseType: format === 'csv' ? 'blob' : 'json'
    })
};

export default reportService;