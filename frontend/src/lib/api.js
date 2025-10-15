// Centralized API helpers for the frontend.
// For now we export mock functions where backend is not ready; auth uses real API calls via axios.

import axios from 'axios';

// Base API URL - adjust this based on your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add the auth token to every request if it exists
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- AUTHENTICATION API FUNCTIONS ---

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data; // { success, message, token, user }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};

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

// Inventory Dashboard API - Mock data for staff dashboard
export async function getInventoryData() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock comprehensive inventory data
  return {
    summary: {
      totalSold: 1247,
      totalRevenue: 4567890,
    },
    products: [
      {
        product_id: 1,
        name: "Samsung NVME SSD",
        sku: "SS-NVME-SSD",
        category: "Storage",
        brand: "Samsung",
        variants: 4,
        totalStock: 28, // Sum of all variants: 15 + 8 + 5 + 0
        totalSold: 156,
        avgPrice: 3774, // Average of variant prices
        stockStatus: "in-stock", // in-stock, low-stock, out-of-stock
      },
      {
        product_id: 2,
        name: "Logitech Wireless Mouse",
        sku: "LG-MOUSE-PRO",
        category: "Peripherals",
        brand: "Logitech",
        variants: 2,
        totalStock: 37,
        totalSold: 243,
        avgPrice: 8499,
        stockStatus: "in-stock",
      },
      {
        product_id: 3,
        name: "Sony WH-1000XM5 Headphones",
        sku: "SONY-WH1000XM5",
        category: "Audio",
        brand: "Sony",
        variants: 2,
        totalStock: 18,
        totalSold: 89,
        avgPrice: 79999,
        stockStatus: "in-stock",
      },
      {
        product_id: 4,
        name: "Dell 27\" 4K Monitor",
        sku: "DELL-U2723DE",
        category: "Displays",
        brand: "Dell",
        variants: 1,
        totalStock: 12,
        totalSold: 67,
        avgPrice: 125999,
        stockStatus: "in-stock",
      },
      {
        product_id: 5,
        name: "Razer Mechanical Keyboard",
        sku: "RAZER-KB-RGB",
        category: "Peripherals",
        brand: "Razer",
        variants: 3,
        totalStock: 8,
        totalSold: 134,
        avgPrice: 18499,
        stockStatus: "low-stock",
      },
      {
        product_id: 6,
        name: "USB-C Hub 7-in-1",
        sku: "USBHUB-7IN1",
        category: "Accessories",
        brand: "Anker",
        variants: 1,
        totalStock: 45,
        totalSold: 289,
        avgPrice: 6999,
        stockStatus: "in-stock",
      },
      {
        product_id: 7,
        name: "Seagate External HDD 2TB",
        sku: "SG-HDD-2TB",
        category: "Storage",
        brand: "Seagate",
        variants: 2,
        totalStock: 3,
        totalSold: 178,
        avgPrice: 12499,
        stockStatus: "low-stock",
      },
      {
        product_id: 8,
        name: "TP-Link WiFi Router AX3000",
        sku: "TPL-AX3000",
        category: "Networking",
        brand: "TP-Link",
        variants: 1,
        totalStock: 22,
        totalSold: 156,
        avgPrice: 15999,
        stockStatus: "in-stock",
      },
      {
        product_id: 9,
        name: "Anker PowerBank 20000mAh",
        sku: "ANK-PB20K",
        category: "Power",
        brand: "Anker",
        variants: 2,
        totalStock: 0,
        totalSold: 412,
        avgPrice: 8999,
        stockStatus: "out-of-stock",
      },
      {
        product_id: 10,
        name: "Apple Magic Mouse",
        sku: "APL-MGCMOUSE",
        category: "Peripherals",
        brand: "Apple",
        variants: 1,
        totalStock: 15,
        totalSold: 87,
        avgPrice: 21999,
        stockStatus: "in-stock",
      },
      {
        product_id: 11,
        name: "Canon EOS R6 Camera",
        sku: "CANON-EOSR6",
        category: "Cameras",
        brand: "Canon",
        variants: 2,
        totalStock: 4,
        totalSold: 23,
        avgPrice: 549999,
        stockStatus: "low-stock",
      },
      {
        product_id: 12,
        name: "Western Digital SSD 1TB",
        sku: "WD-SSD-1TB",
        category: "Storage",
        brand: "Western Digital",
        variants: 3,
        totalStock: 0,
        totalSold: 267,
        avgPrice: 18999,
        stockStatus: "out-of-stock",
      },
      {
        product_id: 13,
        name: "Corsair RGB Gaming Mousepad",
        sku: "CORS-MP-RGB",
        category: "Accessories",
        brand: "Corsair",
        variants: 2,
        totalStock: 56,
        totalSold: 198,
        avgPrice: 4999,
        stockStatus: "in-stock",
      },
      {
        product_id: 14,
        name: "JBL Bluetooth Speaker",
        sku: "JBL-FLIP6",
        category: "Audio",
        brand: "JBL",
        variants: 4,
        totalStock: 32,
        totalSold: 345,
        avgPrice: 16999,
        stockStatus: "in-stock",
      },
      {
        product_id: 15,
        name: "Logitech C920 Webcam",
        sku: "LG-C920-HD",
        category: "Peripherals",
        brand: "Logitech",
        variants: 1,
        totalStock: 19,
        totalSold: 234,
        avgPrice: 12999,
        stockStatus: "in-stock",
      },
    ],
    orders: [
      {
        order_id: 1,
        order_number: "ORD-2025-001234",
        user_id: 5,
        shipping_first_name: "John",
        shipping_last_name: "Doe",
        shipping_address: "123 Main St",
        shipping_city: "Colombo",
        shipping_postal_code: "00100",
        shipping_phone: "+94771234567",
        subtotal: 85999.0,
        shipping_cost: 500.0,
        total_amount: 86499.0,
        total_items: 2,
        payment_method: "Card Payment",
        payment_status: "Paid",
        order_status: "Processing",
        courier_service: "DHL Express",
        courier_contact: "+94112345678",
        tracking_number: "DHL1234567890",
        estimated_delivery_date: "2025-10-16",
        created_at: "2025-10-12T10:30:00Z",
      },
      {
        order_id: 2,
        order_number: "ORD-2025-001235",
        user_id: 6,
        shipping_first_name: "Jane",
        shipping_last_name: "Smith",
        shipping_address: "456 Park Ave",
        shipping_city: "Kandy",
        shipping_postal_code: "20000",
        shipping_phone: "+94777654321",
        subtotal: 125999.0,
        shipping_cost: 800.0,
        total_amount: 126799.0,
        total_items: 1,
        payment_method: "Cash on Delivery",
        payment_status: "Pending",
        order_status: "Pending",
        courier_service: "Pronto Courier",
        courier_contact: "+94812345678",
        tracking_number: null,
        estimated_delivery_date: "2025-10-18",
        created_at: "2025-10-13T09:15:00Z",
      },
      {
        order_id: 3,
        order_number: "ORD-2025-001236",
        user_id: 7,
        shipping_first_name: "Robert",
        shipping_last_name: "Johnson",
        shipping_address: "789 Beach Rd",
        shipping_city: "Galle",
        shipping_postal_code: "80000",
        shipping_phone: "+94712223334",
        subtotal: 18499.0,
        shipping_cost: 600.0,
        total_amount: 19099.0,
        total_items: 3,
        payment_method: "Card Payment",
        payment_status: "Paid",
        order_status: "Shipped",
        courier_service: "Aramex",
        courier_contact: "+94912345678",
        tracking_number: "ARX9876543210",
        estimated_delivery_date: "2025-10-15",
        created_at: "2025-10-10T14:20:00Z",
      },
      {
        order_id: 4,
        order_number: "ORD-2025-001237",
        user_id: 8,
        shipping_first_name: "Emily",
        shipping_last_name: "Brown",
        shipping_address: "321 Lake View",
        shipping_city: "Negombo",
        shipping_postal_code: "11500",
        shipping_phone: "+94765554443",
        subtotal: 549999.0,
        shipping_cost: 0.0,
        total_amount: 549999.0,
        total_items: 1,
        payment_method: "Card Payment",
        payment_status: "Paid",
        order_status: "Delivered",
        courier_service: "FedEx",
        courier_contact: "+94112223344",
        tracking_number: "FDX5432109876",
        estimated_delivery_date: "2025-10-12",
        created_at: "2025-10-08T11:45:00Z",
      },
      {
        order_id: 5,
        order_number: "ORD-2025-001238",
        user_id: 9,
        shipping_first_name: "Michael",
        shipping_last_name: "Davis",
        shipping_address: "654 Hill Top",
        shipping_city: "Nuwara Eliya",
        shipping_postal_code: "22200",
        shipping_phone: "+94723334445",
        subtotal: 45997.0,
        shipping_cost: 1200.0,
        total_amount: 47197.0,
        total_items: 4,
        payment_method: "Cash on Delivery",
        payment_status: "Pending",
        order_status: "Processing",
        courier_service: "Pronto Courier",
        courier_contact: "+94812345678",
        tracking_number: "PRO2468135790",
        estimated_delivery_date: "2025-10-17",
        created_at: "2025-10-12T16:00:00Z",
      },
      {
        order_id: 6,
        order_number: "ORD-2025-001239",
        user_id: 10,
        shipping_first_name: "Sarah",
        shipping_last_name: "Wilson",
        shipping_address: "987 Ocean Drive",
        shipping_city: "Matara",
        shipping_postal_code: "81000",
        shipping_phone: "+94717778889",
        subtotal: 16999.0,
        shipping_cost: 700.0,
        total_amount: 17699.0,
        total_items: 1,
        payment_method: "Card Payment",
        payment_status: "Paid",
        order_status: "Delivered",
        courier_service: "DHL Express",
        courier_contact: "+94112345678",
        tracking_number: "DHL0987654321",
        estimated_delivery_date: "2025-10-11",
        created_at: "2025-10-09T08:30:00Z",
      },
      {
        order_id: 7,
        order_number: "ORD-2025-001240",
        user_id: 11,
        shipping_first_name: "David",
        shipping_last_name: "Martinez",
        shipping_address: "147 Mountain View",
        shipping_city: "Badulla",
        shipping_postal_code: "90000",
        shipping_phone: "+94726667778",
        subtotal: 12999.0,
        shipping_cost: 900.0,
        total_amount: 13899.0,
        total_items: 2,
        payment_method: "Cash on Delivery",
        payment_status: "Pending",
        order_status: "Shipped",
        courier_service: "Aramex",
        courier_contact: "+94912345678",
        tracking_number: "ARX1357924680",
        estimated_delivery_date: "2025-10-16",
        created_at: "2025-10-11T13:20:00Z",
      },
      {
        order_id: 8,
        order_number: "ORD-2025-001241",
        user_id: 5,
        shipping_first_name: "John",
        shipping_last_name: "Doe",
        shipping_address: "123 Main St",
        shipping_city: "Colombo",
        shipping_postal_code: "00100",
        shipping_phone: "+94771234567",
        subtotal: 21999.0,
        shipping_cost: 500.0,
        total_amount: 22499.0,
        total_items: 1,
        payment_method: "Card Payment",
        payment_status: "Paid",
        order_status: "Delivered",
        courier_service: "DHL Express",
        courier_contact: "+94112345678",
        tracking_number: "DHL5678901234",
        estimated_delivery_date: "2025-10-10",
        created_at: "2025-10-07T15:45:00Z",
      },
      {
        order_id: 9,
        order_number: "ORD-2025-001242",
        user_id: 12,
        shipping_first_name: "Lisa",
        shipping_last_name: "Anderson",
        shipping_address: "258 Garden Road",
        shipping_city: "Jaffna",
        shipping_postal_code: "40000",
        shipping_phone: "+94773334445",
        subtotal: 8999.0,
        shipping_cost: 1500.0,
        total_amount: 10499.0,
        total_items: 1,
        payment_method: "Card Payment",
        payment_status: "Failed",
        order_status: "Cancelled",
        courier_service: null,
        courier_contact: null,
        tracking_number: null,
        estimated_delivery_date: null,
        created_at: "2025-10-13T10:00:00Z",
      },
      {
        order_id: 10,
        order_number: "ORD-2025-001243",
        user_id: 13,
        shipping_first_name: "Chris",
        shipping_last_name: "Taylor",
        shipping_address: "369 River Side",
        shipping_city: "Anuradhapura",
        shipping_postal_code: "50000",
        shipping_phone: "+94719998887",
        subtotal: 34497.0,
        shipping_cost: 800.0,
        total_amount: 35297.0,
        total_items: 5,
        payment_method: "Cash on Delivery",
        payment_status: "Pending",
        order_status: "Processing",
        courier_service: "Pronto Courier",
        courier_contact: "+94812345678",
        tracking_number: "PRO7890123456",
        estimated_delivery_date: "2025-10-18",
        created_at: "2025-10-13T12:30:00Z",
      },
    ],
  };
};

const api = {
  login,
  register,
  getCurrentUser,
  getProductById,
  listProducts,
  getInventoryData,
};

export default api;