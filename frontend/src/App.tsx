import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import { useWishlistStore } from './store/wishlistStore';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AccountPage from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false,
}) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-cream-DEFAULT">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <CartDrawer />
  </div>
);

const App: React.FC = () => {
  const { fetchMe, isAuthenticated } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages (no layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Main layout routes */}
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/products"
          element={
            <Layout>
              <ProductsPage />
            </Layout>
          }
        />
        <Route
          path="/products/:slug"
          element={
            <Layout>
              <ProductDetailPage />
            </Layout>
          }
        />
        <Route
          path="/cart"
          element={
            <Layout>
              <CartPage />
            </Layout>
          }
        />
        <Route
          path="/checkout"
          element={
            <Layout>
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/orders"
          element={
            <Layout>
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <Layout>
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/account"
          element={
            <Layout>
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/wishlist"
          element={
            <Layout>
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <Layout>
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/admin/products"
          element={
            <Layout>
              <ProtectedRoute adminOnly>
                <AdminProducts />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <Layout>
              <ProtectedRoute adminOnly>
                <AdminOrders />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <Layout>
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
