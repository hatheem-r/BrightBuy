// Centralized API helpers for the frontend.
// For now we export mock functions; later these can be replaced with real HTTP calls.

// Base API URL - adjust this based on your environment
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

// Authentication APIs
export async function login(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function getCurrentUser() {
  return apiRequest("/auth/me", {
    method: "GET",
  });
}

export async function getProductById(id) {
  // Mock product — replace with an API call when backend is available.
  // Different products based on ID for demonstration
  const mockProducts = {
    1: {
      id: "1",
      name: "Samsung 1TB NVME SSD",
      sku: "SS-NVME-1TB",
      description: [
        "High Speed 8,000MB/s",
        "PCIe 5.0, NVME SSD",
        "Type-C Connectivity",
        "Original Branded",
      ],
      rating: 4.5,
      variants: [
        {
          id: "v1",
          sku: "SS-NVME-1TB-BLK",
          name: "Samsung 1TB NVME SSD - Black",
          color: "Black",
          memory: "1TB",
          price: 2999.0,
          oldPrice: 3499.0,
          old_price: 3499.0,
          stock_quantity: 15,
          is_default: true,
          default: true,
        },
        {
          id: "v2",
          sku: "SS-NVME-1TB-WHT",
          name: "Samsung 1TB NVME SSD - White",
          color: "White",
          memory: "1TB",
          price: 3099.0,
          oldPrice: 3599.0,
          old_price: 3599.0,
          stock_quantity: 8,
          is_default: false,
          default: false,
        },
        {
          id: "v3",
          sku: "SS-NVME-2TB-BLK",
          name: "Samsung 2TB NVME SSD - Black",
          color: "Black",
          memory: "2TB",
          price: 4999.0,
          oldPrice: 5999.0,
          old_price: 5999.0,
          stock_quantity: 5,
          is_default: false,
          default: false,
        },
        {
          id: "v4",
          sku: "SS-NVME-2TB-WHT",
          name: "Samsung 2TB NVME SSD - White",
          color: "White",
          memory: "2TB",
          price: 5099.0,
          oldPrice: 6099.0,
          old_price: 6099.0,
          stock_quantity: 0,
          is_default: false,
          default: false,
        },
      ],
      images: [
        "/placeholder-ssd.jpg",
        "/placeholder-ssd-2.jpg",
        "/placeholder-ssd-3.jpg",
        "/placeholder-ssd-4.jpg",
      ],
    },
    2: {
      id: "2",
      name: "Logitech MX Master 3S",
      sku: "LG-MX3S",
      description: [
        "Ergonomic Design",
        "8K DPI Sensor",
        "Bluetooth & USB-C",
        "Multi-Device Support",
      ],
      rating: 4.8,
      variants: [
        {
          id: "v1",
          sku: "LG-MX3S-BLK",
          name: "Logitech MX Master 3S - Black",
          color: "Black",
          price: 8499.0,
          oldPrice: 9999.0,
          old_price: 9999.0,
          stock_quantity: 25,
          is_default: true,
          default: true,
        },
        {
          id: "v2",
          sku: "LG-MX3S-GRY",
          name: "Logitech MX Master 3S - Gray",
          color: "Gray",
          price: 8499.0,
          oldPrice: 9999.0,
          old_price: 9999.0,
          stock_quantity: 12,
          is_default: false,
          default: false,
        },
      ],
      images: ["/placeholder-mouse.jpg", "/placeholder-mouse-2.jpg"],
    },
    3: {
      id: "3",
      name: "Sony WH-1000XM5 Headphones",
      sku: "SNY-WH1000XM5",
      description: [
        "Industry-leading Noise Cancellation",
        "30-hour Battery Life",
        "Multipoint Connection",
        "Premium Sound Quality",
      ],
      rating: 4.7,
      variants: [
        {
          id: "v1",
          sku: "SNY-WH1000XM5-BLK",
          name: "Sony WH-1000XM5 - Black",
          color: "Black",
          price: 29990.0,
          oldPrice: 34990.0,
          old_price: 34990.0,
          stock_quantity: 18,
          is_default: true,
          default: true,
        },
        {
          id: "v2",
          sku: "SNY-WH1000XM5-SLV",
          name: "Sony WH-1000XM5 - Silver",
          color: "Silver",
          price: 29990.0,
          oldPrice: 34990.0,
          old_price: 34990.0,
          stock_quantity: 10,
          is_default: false,
          default: false,
        },
      ],
      images: ["/placeholder-headphones.jpg", "/placeholder-headphones-2.jpg"],
    },
  };

  // Return the product or default to product 1
  return mockProducts[id?.toString()] || mockProducts["1"];
}

// Future helpers
export async function listProducts() {
  // Return a small sample list
  return [
    { id: 1, name: "USB-C Cable 1m", category: "Cables" },
    { id: 2, name: "Wireless Mouse", category: "Peripherals" },
    { id: 3, name: "Mechanical Keyboard", category: "Peripherals" },
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
