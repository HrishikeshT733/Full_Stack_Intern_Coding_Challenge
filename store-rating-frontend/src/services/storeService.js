import api from './api';

export const storeService = {
  // Admin creates stores (deprecated for store owner)
  createStore: (storeData) => 
    api.post('/stores', storeData),
  
  // Store owner creates their own store
  createMyStore: (storeData) => 
    api.post('/stores/my-store', storeData),
  
  getStores: (filters = {}) => 
    api.get('/stores', { params: filters }),
  
  getStore: (id) => 
    api.get(`/stores/${id}`),
  
  // User only
  submitRating: (storeId, rating, comments = '') => 
    api.post('/ratings', { storeId, rating, comments }),
  
  getUserRating: (storeId) => 
    api.get(`/ratings/store/${storeId}`),
  
  // Admin dashboard
  getDashboardStats: () => 
    api.get('/users/dashboard'),
  
  // Store owner - get their store ratings
  getStoreRatings: async () => {
    try {
      return await api.get('/users/store-ratings');
    } catch (error) {
      // Handle 404 or other errors gracefully
      if (error.response?.status === 404) {
        // Store owner doesn't have a store assigned
        return { data: { store: null, ratings: [], averageRating: 0 } };
      }
      throw error;
    }
  },
  
  // Admin user management
  createAdminUser: (userData) => 
    api.post('/users', userData),
  
  getUsers: (filters = {}) => 
    api.get('/users', { params: filters }),
  
  getUser: (id) => 
    api.get(`/users/${id}`),
};