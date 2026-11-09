import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import CartDrawer from './components/cart/CartDrawer';
import ToastNotification from './components/common/ToastNotification';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Archive from './pages/Archive';
import ChapterDetail from './pages/ChapterDetail';
import Shop from './pages/Shop';
import About from './pages/About';
import NotFound from './pages/NotFound';

// Lazy or placeholders for Phase 2 & 3 (We will build ProductDetail & Cart next)
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import SeriesManager from './pages/admin/SeriesManager';
import ChapterManager from './pages/admin/ChapterManager';
import ProductManager from './pages/admin/ProductManager';
import MediaLibrary from './pages/admin/MediaLibrary';

function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] flex flex-col font-sans selection:bg-white selection:text-black">
      <ScrollToTop />
      {!isAdminPath && <Navbar />}
      <CartDrawer />
      <ToastNotification />
      <main className="flex-1">{children}</main>
      {!isAdminPath && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <LayoutWrapper>
          <Routes>
            {/* Public Brand Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/chapters/:slug" element={<ChapterDetail />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />

            {/* Admin CMS Pages */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/series" element={<SeriesManager />} />
            <Route path="/admin/chapters" element={<ChapterManager />} />
            <Route path="/admin/products" element={<ProductManager />} />
            <Route path="/admin/media" element={<MediaLibrary />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LayoutWrapper>
      </CartProvider>
    </AuthProvider>
  );
}

