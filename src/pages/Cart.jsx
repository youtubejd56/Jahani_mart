import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, loading } = useCart();
    const { isAuthenticated } = useAuth();

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

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-6">Add some products to get started!</p>
                    <Link
                        to="/"
                        className="inline-block bg-[#00674F] hover:bg-[#0A3C30] text-white font-bold py-3 px-8 rounded-lg transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
                                <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center">
                                    <img
                                        src={item.product_image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5Ij5JbWFnZTwvdGV4dD48L3N2Zz4='}
                                        alt={item.product_name}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800">{item.product_name}</h3>
                                    <p className="text-lg font-bold text-gray-900 mt-1">₹{item.product_price}</p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={loading || item.quantity <= 1}
                                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                -
                                            </button>
                                            <span className="px-3 py-1 font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={loading}
                                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            disabled={loading}
                                            className="text-red-500 hover:text-red-700 font-medium text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">₹{(item.quantity * parseFloat(item.product_price)).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Items ({cart.total_items})</span>
                                    <span className="font-medium">₹{cart.total_price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery</span>
                                    <span className="text-emerald-500 font-medium">FREE</span>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between text-lg">
                                        <span className="font-bold">Total</span>
                                        <span className="font-bold text-gray-900">₹{cart.total_price.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <Link to="/checkout" className="w-full mt-6 bg-amber-400 hover:bg-amber-500 text-[#00674F] font-bold py-3 px-4 rounded-lg transition-colors text-center block">
                                PROCEED TO CHECKOUT
                            </Link>
                            <Link
                                to="/"
                                className="block text-center mt-3 text-[#00674F] font-medium hover:text-[#0A3C30]   "
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
