import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';
import SEO from '../components/SEO';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, loading } = useCart();
    const { isAuthenticated } = useAuth();
    const { formatPrice } = useLocale();

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-6">Please login to view your cart and add items.</p>
                    <Link
                        to="/login"
                        className="inline-block bg-[#00674F] hover:bg-[#0A3C30] text-white font-bold py-3 px-8 rounded-lg transition-colors"
                    >
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    const calculateTotals = () => {
        const subtotal = cart.reduce((sum, item) => {
            return sum + (item.discount_price || item.price) * item.quantity;
        }, 0);

        const shipping = subtotal > 999 ? 0 : 50;
        const tax = subtotal * 0.05;
        const total = subtotal + shipping + tax;

        return { subtotal, shipping, tax, total };
    };

    const totals = calculateTotals();

    return (
        <>
            <SEO
                title="Shopping Cart - Jahani Mart"
                description="View your shopping cart and proceed to checkout. Secure payment options available. Free delivery on orders above ₹999."
                keywords="shopping cart, checkout, online shopping, cart items, buy now"
                url="https://jahani-mart.onrender.com/cart"
                type="website"
            />
            
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
                            
                            {cart.length === 0 && (
                                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                    <div className="text-6xl mb-4">🛒</div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Cart is Empty</h3>
                                    <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                                    <Link
                                        to="/products"
                                        className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            )}

                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
                                        <div className="w-24 h-24 relative">
                                            <img
                                                src={getImageUrl(item.all_image_urls?.[0] || item.image_url)}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/img1.png';
                                                }}
                                            />
                                            {item.stock === 0 && (
                                                <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                                                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Out of Stock</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.category}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-6 h-6 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                                                    >
                                                        <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-4 0v2a10 10 0 0011.35 0H12v2a2 2 0 001.531 1.769A7.967 7.967 0 0010 18a7.967 7.967 0 00-3.671-1.108A7.967 7.967 0 004 14h-2z" />
                                                        </svg>
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                                                        className="w-12 text-center border-0 focus:outline-none"
                                                    />
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={item.quantity >= 10}
                                                        className="w-6 h-6 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                                                    >
                                                        <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-4 0v2a10 10 0 0011.35 0H12v2a2 2 0 001.531 1.769A7.967 7.967 0 0010 18a7.967 7.967 0 00-3.671-1.108A7.967 7.967 0 004 14h-2z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <p className="font-bold text-purple-600">
                                                {formatPrice(item.discount_price || item.price)}
                                            </p>
                                            {item.discount_price && (
                                                <p className="text-sm text-gray-400 line-through">
                                                    {formatPrice(item.price)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Subtotal</span>
                                        <span className="text-sm font-medium">{formatPrice(totals.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Shipping</span>
                                        <span className="text-sm font-medium">{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Tax (5%)</span>
                                        <span className="text-sm font-medium">{formatPrice(totals.tax)}</span>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold">Total</span>
                                        <span className="text-2xl font-bold text-purple-600">{formatPrice(totals.total)}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-6">
                                    <Link
                                        to="/checkout"
                                        className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                                    >
                                        Proceed to Checkout
                                    </Link>
                                    <Link
                                        to="/"
                                        className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors mt-3"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;