import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/protectedRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminSetupInfo from './components/auth/AdminSetupInfo';
import UpdatePassword from './components/auth/UpdatePassword';
import UserProfile from './components/user/UserProfile';

// Admin Components
import Dashboard from './components/admin/Dashboard';
import UsersList from './components/admin/UserList';
import StoresList from './components/admin/StoresList';
import CreateUser from './components/admin/CreateUser';

// User Components
import UserStores from './components/user/UserStores';

// Store Owner Components
import StoreRatings from './components/storeOwner/StoreRatings';

// Home Component
const Home = () => {
  const { user, isAdmin, isStoreOwner, isNormalUser } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (isAdmin()) {
    return <Navigate to="/admin/dashboard" />;
  }
  
  if (isStoreOwner()) {
    return <Navigate to="/store-owner/ratings" />;
  }
  
  if (isNormalUser()) {
    return <Navigate to="/stores" />;
  }
  
  return <div>Welcome!</div>;
};

const AppContent = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-setup" element={<AdminSetupInfo />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/update-password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
        
        {/* User Routes */}
        <Route path="/stores" element={
          <ProtectedRoute roles={['user']}>
            <UserStores />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <UsersList />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/users/create" element={
          <ProtectedRoute roles={['admin']}>
            <CreateUser />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/stores" element={
          <ProtectedRoute roles={['admin']}>
            <StoresList />
          </ProtectedRoute>
        } />
        
        {/* Store Owner Routes */}
        <Route path="/store-owner/ratings" element={
          <ProtectedRoute roles={['store_owner']}>
            <StoreRatings />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;