// API service for frontend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// Products API
export const productsAPI = {
  // Get all products
  getAllProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    const response = await fetch(
      `${API_BASE_URL}/products/category/${categoryId}`
    );
    if (!response.ok) throw new Error("Failed to fetch products by category");
    return response.json();
  },

  // Search products
  searchProducts: async (searchTerm) => {
    const response = await fetch(
      `${API_BASE_URL}/products/search?q=${encodeURIComponent(searchTerm)}`
    );
    if (!response.ok) throw new Error("Failed to search products");
    return response.json();
  },

  // Get product names for autocomplete
  getProductNames: async () => {
    const response = await fetch(`${API_BASE_URL}/products/names`);
    if (!response.ok) throw new Error("Failed to fetch product names");
    return response.json();
  },
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  getAllCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    if (!response.ok) throw new Error("Failed to fetch category");
    return response.json();
  },

  // Get main categories
  getMainCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories/main`);
    if (!response.ok) throw new Error("Failed to fetch main categories");
    return response.json();
  },

  // Get subcategories
  getSubcategories: async (parentId) => {
    const response = await fetch(
      `${API_BASE_URL}/categories/${parentId}/subcategories`
    );
    if (!response.ok) throw new Error("Failed to fetch subcategories");
    return response.json();
  },

  // Get category hierarchy
  getCategoryHierarchy: async () => {
    const response = await fetch(`${API_BASE_URL}/categories/hierarchy`);
    if (!response.ok) throw new Error("Failed to fetch category hierarchy");
    return response.json();
  },
};

// Variants API
export const variantsAPI = {
  // Get all variants
  getAllVariants: async () => {
    const response = await fetch(`${API_BASE_URL}/variants`);
    if (!response.ok) throw new Error("Failed to fetch variants");
    return response.json();
  },

  // Get variant by ID
  getVariantById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/variants/${id}`);
    if (!response.ok) throw new Error("Failed to fetch variant");
    return response.json();
  },

  // Get variants by product ID
  getVariantsByProductId: async (productId) => {
    const response = await fetch(
      `${API_BASE_URL}/variants/product/${productId}`
    );
    if (!response.ok) throw new Error("Failed to fetch variants");
    return response.json();
  },

  // Check variant availability
  checkAvailability: async (variantId, quantity) => {
    const response = await fetch(
      `${API_BASE_URL}/variants/${variantId}/check-availability`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      }
    );
    if (!response.ok) throw new Error("Failed to check availability");
    return response.json();
  },
};

// Authentication API
export const authAPI = {
  // Login user
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },

  // Register new user
  signup: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    return response.json();
  },

  // Get current user profile
  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch profile");
    }

    return response.json();
  },
};

// Legacy export for backward compatibility with login page
export const login = authAPI.login;
export const signup = authAPI.signup;

// Cart API
export const cartAPI = {
  // Get cart details for customer
  getCartDetails: async (customerId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${customerId}`);
    if (!response.ok) throw new Error("Failed to fetch cart details");
    return response.json();
  },

  // Get cart summary for customer
  getCartSummary: async (customerId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${customerId}/summary`);
    if (!response.ok) throw new Error("Failed to fetch cart summary");
    return response.json();
  },

  // Get cart item count for customer
  getCartItemCount: async (customerId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${customerId}/count`);
    if (!response.ok) throw new Error("Failed to fetch cart count");
    return response.json();
  },

  // Add item to cart
  addToCart: async (customerId, variantId, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/cart/${customerId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ variant_id: variantId, quantity }),
    });
    if (!response.ok) throw new Error("Failed to add item to cart");
    return response.json();
  },

  // Update cart item quantity
  updateCartItem: async (customerId, variantId, quantity) => {
    const response = await fetch(
      `${API_BASE_URL}/cart/${customerId}/items/${variantId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      }
    );
    if (!response.ok) throw new Error("Failed to update cart item");
    return response.json();
  },

  // Remove item from cart
  removeCartItem: async (customerId, variantId) => {
    const response = await fetch(
      `${API_BASE_URL}/cart/${customerId}/items/${variantId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Failed to remove item from cart");
    return response.json();
  },

  // Clear cart
  clearCart: async (customerId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${customerId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to clear cart");
    return response.json();
  },
};

// Customer API
export const customerAPI = {
  // Get customer profile with addresses
  getProfile: async (customerId) => {
    const response = await fetch(
      `${API_BASE_URL}/customers/${customerId}/profile`
    );
    if (!response.ok) throw new Error("Failed to fetch customer profile");
    return response.json();
  },

  // Update customer basic info
  updateInfo: async (customerId, data) => {
    const response = await fetch(
      `${API_BASE_URL}/customers/${customerId}/info`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) throw new Error("Failed to update customer info");
    return response.json();
  },

  // Get default address
  getDefaultAddress: async (customerId) => {
    const response = await fetch(
      `${API_BASE_URL}/customers/${customerId}/address/default`
    );
    if (!response.ok) throw new Error("Failed to fetch default address");
    return response.json();
  },

  // Save address (create or update)
  saveAddress: async (customerId, addressData) => {
    const response = await fetch(
      `${API_BASE_URL}/customers/${customerId}/address`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      }
    );
    if (!response.ok) throw new Error("Failed to save address");
    return response.json();
  },

  // Delete address
  deleteAddress: async (customerId, addressId) => {
    const response = await fetch(
      `${API_BASE_URL}/customers/${customerId}/address/${addressId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Failed to delete address");
    return response.json();
  },
};

// Orders API
export const ordersAPI = {
  // Create a new order
  createOrder: async (orderData, token) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || "Failed to create order");
    }
    return response.json();
  },

  // Get order by ID
  getOrderById: async (orderId, token) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch order");
    return response.json();
  },

  // Get orders by customer ID
  getOrdersByCustomer: async (customerId, token) => {
    const response = await fetch(
      `${API_BASE_URL}/orders/customer/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch customer orders");
    return response.json();
  },

  // Update order status
  updateOrderStatus: async (orderId, status, token) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update order status");
    return response.json();
  },
};
