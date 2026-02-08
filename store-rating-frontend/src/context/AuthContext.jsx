import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token, fetchUserProfile]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password
      });
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      await fetchUserProfile();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      await axios.post('http://localhost:3000/auth/register', userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      await axios.post('http://localhost:3000/auth/update-password', {
        newPassword
      });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Password update failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAdmin = () => user?.role === 'admin';
  const isStoreOwner = () => user?.role === 'store_owner';
  const isNormalUser = () => user?.role === 'user';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      token,
      login,
      register,
      updatePassword,
      logout,
      isAdmin,
      isStoreOwner,
      isNormalUser,
      fetchUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};