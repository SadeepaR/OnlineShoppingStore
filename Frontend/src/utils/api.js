// API configuration with JWT token interceptor
const API_BASE_URL = 'http://localhost:8080';

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Get token from session storage
  getToken() {
    return sessionStorage.getItem('token');
  }

  // Create request headers with JWT token
  getHeaders() {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle unauthorized responses
      if (response.status === 401) {
        // Clear token and redirect to login
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      // Handle other HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Return response data
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Export individual service endpoints
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  validateToken: () => apiClient.get('/auth/validate'),
};

export const productAPI = {
  getAll: () => apiClient.get('/products'),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (product) => apiClient.post('/products', product),
  update: (id, product) => apiClient.put(`/products/${id}`, product),
  delete: (id) => apiClient.delete(`/products/${id}`),
};

export const cartAPI = {
  getCart: () => apiClient.get('/cart'),
  addToCart: (productId, quantity) => apiClient.post('/cart/add', { productId, quantity }),
  updateCartItem: (productId, quantity) => apiClient.put('/cart/update', { productId, quantity }),
  removeFromCart: (productId) => apiClient.delete(`/cart/remove/${productId}`),
  clearCart: () => apiClient.delete('/cart/clear'),
};

export const orderAPI = {
  getOrders: () => apiClient.get('/orders'),
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
  createOrder: (orderData) => apiClient.post('/orders', orderData),
  updateOrderStatus: (id, status) => apiClient.put(`/orders/${id}/status`, { status }),
  getAllOrders: () => apiClient.get('/orders/all'), // Admin only
};

export const emailAPI = {
  sendOrderConfirmation: (orderData) => apiClient.post('/email/order-confirmation', orderData),
  sendWelcomeEmail: (userData) => apiClient.post('/email/welcome', userData),
};

export default apiClient;
