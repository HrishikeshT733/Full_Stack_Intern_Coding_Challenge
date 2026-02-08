import api from './api';

export const authService = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
  
  updatePassword: (newPassword) => 
    api.post('/auth/update-password', { newPassword }),
  
  getProfile: () => 
    api.get('/auth/profile'),
  
  checkToken: () => 
    api.get('/auth/check-token'),
};