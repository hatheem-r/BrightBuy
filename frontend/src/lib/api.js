// Centralized API helpers for the frontend.
// For now we export mock functions; later these can be replaced with real HTTP calls.

// Base API URL - adjust this based on your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// Authentication APIs
export async function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function getCurrentUser() {
  return apiRequest('/auth/me', {
    method: 'GET',
  });
}

export async function getProductById(id) {
  // Mock product — replace with an API call when backend is available.
  const mockProduct = {
    id: id?.toString() || '1',
    name: 'Samsung 1TB NVME SSD',
    sku: 'SS-NVME-1TB-BLK',
    description: [
      'High Speed 8,000MB/s',
      'PCIe 5.0, NVME SSD',
      'Type-C Connectivity',
      'Original Branded'
    ],
    rating: 4.5,
    variants: [
      { id: 'v1', name: 'Samsung 1TB NVME SSD - Black', color: 'Black', memory: '1TB', price: 2999.00, oldPrice: 3499.00, stock: 15, default: true },
      { id: 'v2', name: 'Samsung 1TB NVME SSD - White', color: 'White', memory: '1TB', price: 3099.00, oldPrice: 3599.00, stock: 8 },
      { id: 'v3', name: 'Samsung 2TB NVME SSD - Black', color: 'Black', memory: '2TB', price: 4999.00, oldPrice: 5999.00, stock: 5 },
    ],
    images: ['/placeholder-ssd.jpg', '/placeholder-ssd-2.jpg', '/placeholder-ssd-3.jpg', '/placeholder-ssd-4.jpg']
  };

  return mockProduct;
}

// Future helpers
export async function listProducts() {
  // Return a small sample list
  return [
    { id: 1, name: 'USB-C Cable 1m', category: 'Cables' },
    { id: 2, name: 'Wireless Mouse', category: 'Peripherals' },
    { id: 3, name: 'Mechanical Keyboard', category: 'Peripherals' },
  ];
}

const api = {
  login,
  register,
  getCurrentUser,
  getProductById,
  listProducts,
};

export default api;
