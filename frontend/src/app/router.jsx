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
import CollectionsPage from '../features/collections/pages/CollectionsPage';
import CollectionDetailPage from '../features/collections/pages/CollectionDetailPage';
import CartPage from '../features/cart/pages/CartPage';
import CheckoutPage from '../features/order/pages/CheckoutPage';
import OrderPage from '../features/order/pages/OrderPage';
import ProfilePage from '../features/auth/pages/ProfilePage';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import ProductManagement from '../features/admin/pages/ProductManagement';
import CategoryManagement from '../features/admin/pages/CategoryManagement';
import BrandManagement from '../features/admin/pages/BrandManagement';
import CollectionsManagement from '../features/admin/pages/CollectionsManagement';
import OrderManagement from '../features/admin/pages/OrderManagement';
import UserManagement from '../features/admin/pages/UserManagement';
import ReviewManagement from '../features/admin/pages/ReviewManagement';
import WishlistManagement from '../features/admin/pages/WishlistManagement';
import Settings from '../features/admin/pages/Settings';

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
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="collections/:id" element={<CollectionDetailPage />} />
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
        <Route path="checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
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
        <Route path="products" element={<ProductManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="brands" element={<BrandManagement />} />
        <Route path="collections" element={<CollectionsManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="reviews" element={<ReviewManagement />} />
        <Route path="wishlist" element={<WishlistManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default Router;
