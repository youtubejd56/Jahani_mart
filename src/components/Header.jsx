import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { user, logout, isAuthenticated } = useAuth();
    const { cart } = useCart();
    const { wishlistCount } = useWishlist();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <header className="bg-[#00674F] text-white py-4 sticky top-0 z-50 shadow-lg">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-between gap-4 sm:gap-8">
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

                {/* Navigation - Hidden on mobile, shown on lg */}
                <nav className="hidden lg:flex items-center gap-8">
                    <Link to="/" className="text-white no-underline font-medium hover:opacity-80 transition-opacity">Home</Link>
                    <Link to="/products" className="text-white no-underline font-medium hover:opacity-80 transition-opacity">Products</Link>
                    <Link to="/support" className="text-white no-underline font-medium hover:opacity-80 transition-opacity">Support</Link>
                    <Link to="/about" className="text-white no-underline font-medium hover:opacity-80 transition-opacity">About</Link>
                    <Link to="/contact" className="text-white no-underline font-medium hover:opacity-80 transition-opacity">Contact</Link>
                </nav>

                {/* Search Bar - Responsive width */}
                <div className="flex-1 max-w-[500px] order-last sm:order-none w-full sm:w-auto">
                    <form onSubmit={handleSearch} className="flex">
                        <input
                            type="text"
                            placeholder="Search for products, brands and more"
                            className="flex-1 py-2 px-4 rounded-l-full text-gray-800 outline-none text-sm placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="bg-amber-400 hover:bg-amber-500 py-2 px-6 rounded-r-full font-bold text-[#00674F] transition-colors whitespace-nowrap">
                            Search
                        </button>
                    </form>
                </div>

                {/* Auth & Cart */}
                <div className="flex items-center gap-4">
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
                    <Link to="/wishlist" className="text-white no-underline font-medium flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span>Wishlist</span>
                        <span className="bg-amber-400 text-[#00674F] px-2 py-0.5 rounded-full text-xs font-bold leading-none">{wishlistCount}</span>
                    </Link>
                    <Link to="/cart" className="text-white no-underline font-medium flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span>Cart</span>
                        <span className="bg-amber-400 text-[#00674F] px-2 py-0.5 rounded-full text-xs font-bold leading-none">{cart.total_items}</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
