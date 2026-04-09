import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Pages
import { HomePage } from '../features/home';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import { ProductPage, ProductDetailPage } from '../features/products';
import CartPage from '../features/cart/pages/CartPage';
import OrderPage from '../features/order/pages/OrderPage';
import ProfilePage from '../features/auth/pages/ProfilePage';
import AdminDashboard from '../features/admin/pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  if (requireAdmin && user?.role !== 1) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }
  
  return children;
};

const Router = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="collections" element={<div>B? S?u T?p Page - Coming Soon</div>} />
        <Route path="collections/:id" element={<div>Collection Detail Page - Coming Soon</div>} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="contact" element={<div>Liên h? Page - Coming Soon</div>} />
        <Route path="wishlist" element={<div>Wishlist Page - Coming Soon</div>} />
        
        {/* Protected Routes */}
        <Route path="cart" element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } />
        <Route path="orders" element={
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default Router;
