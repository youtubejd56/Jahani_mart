import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useLocale } from '../context/LocaleContext';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const { cart } = useCart();
    const { wishlistCount } = useWishlist();
    const { getConfig, isAutoDetected, detectionMethod, refreshDetection } = useLocale();
    const navigate = useNavigate();

    const localeConfig = getConfig();

    // Inline Country Display Component
    const CountryDisplay = () => (
        <button
            onClick={() => refreshDetection()}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
            title="Click to detect your country (for VPN users)"
        >
            <span className="text-xl">{localeConfig.flag}</span>
            <div className="flex flex-col">
                <span className="text-white text-sm font-medium">
                    {localeConfig.currencySymbol} {localeConfig.currency}
                </span>
                <span className="text-white/60 text-[10px]">
                    {detectionMethod}
                </span>
            </div>
        </button>
    );

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const handleMobileLinkClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="bg-[#074637] text-white py-4 sticky top-0 z-[9999] shadow-lg overflow-x-hidden">
            <div className="max-w-full mx-auto px-4 flex items-center md:justify-evenly justify-between gap-2 sm:gap-8">
                {/* Logo - Prime Style */}
                <div className="flex items-center">
                    <Link to="/" className="no-underline text-white flex items-center gap-1">
                        {/* Prime-style logo */}
                        <div className="flex items-center">
                            <img src="/manu ettn logo .png" alt="Jahani Mart" className="h-10 sm:h-12 w-auto object-contain" />
                            <div className="flex items-center ml-1 sm:ml-2">
                                <span className="text-lg sm:text-xl font-bold tracking-wide">Jahani</span>
                                <span className="text-lg sm:text-xl font-bold text-blue-200 italic">Mart</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Site Logo in Middle */}
                {/* <div className="hidden md:flex items-center justify-center">
                    <img src="/manu ettn logo .png" alt="Jahani Logo" className="h-12 w-auto object-contain" />
                </div> */}


                {/* Navigation - Hidden on mobile, shown on lg */}
                <nav className="hidden lg:flex items-center gap-8">
                    <Link to="/" className="text-white no-underline font-medium hover:opacity-80 transition-opacity">Home</Link>
                    <Link to="/products" className="text-white no-underline font-medium hover:opacity-80 transition-opacity">Products</Link>
                    <Link to="/support" className="text-white no-underline font-medium hover:opacity-80 transition-opacity">Support</Link>
                    <Link to="/download-app" className="text-white no-underline font-medium hover:opacity-80 transition-opacity flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download App
                    </Link>
                </nav>

                {/* Search Bar - Responsive width - Hidden on mobile when menu is open */}
                <div className="hidden md:block flex-1 min-w-0 max-w-[400px]">
                    <form onSubmit={handleSearch} className="flex">
                        <input
                            type="text"
                            placeholder="Product search"
                            className="grow py-2 px-4 rounded-l-full text-gray-800 outline-none text-sm placeholder:text-gray-400 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="bg-amber-400 hover:bg-amber-500 py-2 px-6 rounded-r-full font-bold text-[#00674F] transition-colors whitespace-nowrap">
                            Search
                        </button>
                    </form>
                </div>

                {/* Mobile Menu Button - Visible on small screens */}
                <button
                    className="lg:hidden text-white p-2 focus:outline-none"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                {/* Auth & Cart - Hidden on mobile when menu is open */}
                <div className={`hidden lg:flex items-center gap-4`}>
                    {/* Country Display - Auto Detected */}
                    <CountryDisplay />
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="text-white no-underline font-medium flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="hidden sm:inline">Profile</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-white text-[#00674F] px-5 py-2 rounded-full no-underline font-bold text-sm hover:bg-gray-100 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="bg-white text-[#00674F] px-5 py-2 rounded-full no-underline font-bold text-sm hover:bg-gray-100 transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="bg-amber-400 text-[#00674F] px-5 py-2 rounded-full no-underline font-bold text-sm hover:bg-amber-500 transition-colors hidden sm:inline-block">
                                Register
                            </Link>
                        </>
                    )}
                    <Link to="/admin/dashboard" className="text-white no-underline text-sm font-medium hover:opacity-80 transition-opacity">
                        Admin
                    </Link>
                    <Link to="/wishlist" className="text-white no-underline font-medium flex items-center gap-2 hover:opacity-80 transition-opacity relative">
                        <span>Wishlist</span>
                        <Heart />
                        <span className="bg-amber-400 text-[#00674F] px-2 py-0.5 rounded-full text-xs font-bold leading-none absolute -top-2 -right-4">{wishlistCount}</span>
                    </Link>
                    <Link to="/cart" className="text-white no-underline font-medium flex items-center gap-2 hover:opacity-80 transition-opacity relative">
                        <span>Cart</span>
                        <ShoppingCart />
                        <span className="bg-amber-400 text-[#00674F] px-2 py-0.5 rounded-full text-xs font-bold leading-none absolute -top-2 -right-4">{cart.total_items}</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-[#005543] border-t border-white/10 mt-4 px-4 sm:px-8 py-4">
                    {/* Mobile Search */}
                    <div className="mb-4 mx-2">
                        <form onSubmit={handleSearch} className="flex">
                            <input
                                type="text"
                                placeholder="Product search"
                                className="flex-1 py-2.5 px-4 rounded-l-lg text-gray-800 outline-none text-sm placeholder:text-gray-400 bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="bg-amber-400 hover:bg-amber-500 py-2.5 px-5 rounded-r-lg font-bold text-[#00674F] transition-colors whitespace-nowrap text-sm">
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Mobile Navigation Links */}
                    <nav className="flex flex-col gap-2 mb-4">
                        <Link
                            to="/"
                            className="text-white no-underline font-medium py-2 px-5 rounded-lg hover:bg-white/10 transition-colors"
                            onClick={handleMobileLinkClick}
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className="text-white no-underline font-medium py-2 px-5 rounded-lg hover:bg-white/10 transition-colors"
                            onClick={handleMobileLinkClick}
                        >
                            Products
                        </Link>
                        <Link
                            to="/support"
                            className="text-white no-underline font-medium py-2 px-5 rounded-lg hover:bg-white/10 transition-colors"
                            onClick={handleMobileLinkClick}
                        >
                            Support
                        </Link>
                        <Link
                            to="/download-app"
                            className="text-white no-underline font-medium py-2 px-5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                            onClick={handleMobileLinkClick}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download App
                        </Link>
                    </nav>

                    {/* Mobile Auth & Cart Links */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                        {/* Cart and Wishlist - First Row */}
                        <div className="flex gap-4 justify-center">
                            <Link
                                to="/wishlist"
                                className="text-white no-underline font-medium flex items-center gap-2 hover:opacity-80 transition-opacity bg-amber-400/20 px-4 py-2 rounded-full"
                                onClick={handleMobileLinkClick}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>Wishlist</span>
                                <span className="bg-amber-400 text-[#00674F] px-2 py-0.5 rounded-full text-xs font-bold leading-none">{wishlistCount}</span>
                            </Link>
                            <Link
                                to="/cart"
                                className="text-white no-underline font-medium flex items-center gap-2 hover:opacity-80 transition-opacity bg-amber-400/20 px-4 py-2 rounded-full"
                                onClick={handleMobileLinkClick}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>Cart</span>
                                <span className="bg-amber-400 text-[#00674F] px-2 py-0.5 rounded-full text-xs font-bold leading-none">{cart.total_items}</span>
                            </Link>
                        </div>

                        {/* Auth Section */}
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="text-white no-underline font-medium py-2 px-5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                                    onClick={handleMobileLinkClick}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-white text-[#00674F] px-5 py-1.5 rounded-full no-underline font-bold text-sm hover:bg-gray-100 transition-colors text-left"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="bg-white text-[#00674F] px-4 py-1.5 rounded-full no-underline font-bold text-sm hover:bg-gray-100 transition-colors text-center mx-2"
                                    onClick={handleMobileLinkClick}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-amber-400 text-[#00674F] px-4 py-1.5 rounded-full no-underline font-bold text-sm hover:bg-amber-500 transition-colors text-center mx-2"
                                    onClick={handleMobileLinkClick}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

