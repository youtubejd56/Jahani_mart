import React, { useEffect, useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
    const { isAuthenticated } = useAuth();
    const { wishlistItems, fetchWishlist, toggleWishlist, loading } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [addingToCart, setAddingToCart] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchWishlist();
    }, [isAuthenticated]);

    const handleAddToCart = async (productId) => {
        setAddingToCart(productId);
        try {
            await addToCart(productId, 1);
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setAddingToCart(null);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        await toggleWishlist(productId);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-[#00674F] text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h1>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
                    <Link to="/products" className="inline-block bg-[#00674F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0A3C30] transition-colors">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <Link to={`/products/${item.product}`} className="block">
                                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                    {item.product_image ? (
                                        <img
                                            src={item.product_image}
                                            alt={item.product_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    {item.product_discount > 0 && (
                                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            {item.product_discount}% OFF
                                        </span>
                                    )}
                                </div>
                            </Link>
                            <div className="p-4">
                                <Link to={`/products/${item.product}`} className="block">
                                    <h3 className="font-semibold text-gray-800 hover:text-violet-600 truncate">
                                        {item.product_name}
                                    </h3>
                                </Link>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-xl font-bold text-gray-900">₹{item.product_price}</span>
                                    {item.product_original_price && (
                                        <Fragment key={`price-${item.id}`}>
                                            <span className="text-sm text-gray-400 line-through">₹{item.product_original_price}</span>
                                            {item.product_discount > 0 && (
                                                <span className="text-sm text-green-600 font-medium">{item.product_discount}% off</span>
                                            )}
                                        </Fragment>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleAddToCart(item.product)}
                                        disabled={addingToCart === item.product}
                                        className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                                    >
                                        {addingToCart === item.product ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                    <button
                                        onClick={() => handleRemoveFromWishlist(item.product)}
                                        className="px-4 py-2 border border-red-500 text-red-500 rounded-lg font-medium text-sm hover:bg-red-50 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
