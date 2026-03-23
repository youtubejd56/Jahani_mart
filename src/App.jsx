import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Checkout from './pages/Checkout';
import MyProfile from './pages/MyProfile';
import OrderTracking from './pages/OrderTracking';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Reviews from './pages/Reviews';
import Wishlist from './pages/Wishlist';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Support from './pages/Support';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import OurStory from './pages/OurStory';
import Blog from './pages/Blog';
import ForgotPassword from './pages/ForgotPassword';
import DownloadApp from './pages/DownloadApp';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

const AppContent = () => {
    const location = useLocation();
    const isAdminDashboard = location.pathname === '/admin/dashboard';

    return (
        <div className="flex flex-col min-h-screen">
            {!isAdminDashboard && <Header />}
            <main className={isAdminDashboard ? '' : 'flex-grow'}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:productId" element={<ProductDetail />} />
                    <Route path="/about" element={<Home />} />
                    <Route path="/contact" element={<Home />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/orders" element={<MyProfile />} />
                    <Route path="/profile" element={<MyProfile />} />
                    <Route path="/order-tracking" element={<OrderTracking />} />
                    <Route path="/products/:productId/reviews" element={<Reviews />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/download-app" element={<DownloadApp />} />
                    <Route path="/help" element={<Support />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/our-story" element={<OurStory />} />
                    <Route path="/about" element={<OurStory />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Routes>
            </main>
            {!isAdminDashboard && <Footer />}
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <WishlistProvider>
                <CartProvider>
                    <Router>
                        <AppContent />
                    </Router>
                </CartProvider>
            </WishlistProvider>
        </AuthProvider>
    );
}

export default App;
