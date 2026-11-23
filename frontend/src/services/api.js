const BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('feastify_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },
  register: async (userData) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },
  getProfile: async () => {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Restaurants
  getRestaurants: async ({ search = '', cuisine = '', sort = '', pureVeg = false, fastDelivery = false, hasOffers = false } = {}) => {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (cuisine) query.append('cuisine', cuisine);
    if (sort) query.append('sort', sort);
    if (pureVeg) query.append('pureVeg', 'true');
    if (fastDelivery) query.append('fastDelivery', 'true');
    if (hasOffers) query.append('hasOffers', 'true');
    const res = await fetch(`${BASE_URL}/restaurants?${query.toString()}`);
    return handleResponse(res);
  },
  getRestaurantById: async (id) => {
    const res = await fetch(`${BASE_URL}/restaurants/${id}`);
    return handleResponse(res);
  },
  createRestaurant: async (data) => {
    const res = await fetch(`${BASE_URL}/restaurants`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Dishes
  getDishes: async ({ restaurantId, category, search, isVeg } = {}) => {
    const query = new URLSearchParams();
    if (restaurantId) query.append('restaurantId', restaurantId);
    if (category) query.append('category', category);
    if (search) query.append('search', search);
    if (isVeg !== undefined) query.append('isVeg', isVeg);
    const res = await fetch(`${BASE_URL}/dishes?${query.toString()}`);
    return handleResponse(res);
  },
  createDish: async (data) => {
    const res = await fetch(`${BASE_URL}/dishes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateDish: async (id, data) => {
    const res = await fetch(`${BASE_URL}/dishes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteDish: async (id) => {
    const res = await fetch(`${BASE_URL}/dishes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Orders
  createOrder: async (orderData) => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(res);
  },
  getMyOrders: async () => {
    const res = await fetch(`${BASE_URL}/orders/my-orders`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  getOrderById: async (id) => {
    const res = await fetch(`${BASE_URL}/orders/${id}`);
    return handleResponse(res);
  },
  getAllOrders: async (restaurantId = '') => {
    const url = restaurantId ? `${BASE_URL}/orders?restaurantId=${restaurantId}` : `${BASE_URL}/orders`;
    const res = await fetch(url, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  updateOrderStatus: async (id, status, note = '') => {
    const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, note }),
    });
    return handleResponse(res);
  },
  assignDriver: async (id, driverData) => {
    const res = await fetch(`${BASE_URL}/orders/${id}/assign-driver`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(driverData),
    });
    return handleResponse(res);
  },

  // Admin
  getAdminStats: async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

export default api;

