import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useLocale } from '../context/LocaleContext';
import { useNavigate, Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';
import { ShoppingCart, Heart, Star, Truck, Shield, ArrowRight } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart, loading } = useCart();
    const { isAuthenticated } = useAuth();
    const { toggleWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();
    const { formatPrice, getConfig } = useLocale();
    const navigate = useNavigate();
    const [adding, setAdding] = useState(false);
    const [imageError, setImageError] = useState(false);

    const {
        id,
        name,
        price,
        original_price,
        discount,
        rating,
        image,
        category_name,
        in_stock
    } = product;

    const inWishlist = isInWishlist(id);
    const currencySymbol = getConfig().currencySymbol;

    // Get rating color based on rating value (Flipkart style)
    const getRatingColor = (rating) => {
        if (rating >= 4) return 'bg-green-600';
        if (rating >= 3) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setAdding(true);
        const result = await addToCart(id, 1);
        setAdding(false);

        if (result.error) {
            alert(result.error);
        }
    };

    return (
        <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden border border-gray-100 hover:border-amber-200">
            {/* Premium Badge */}
            {discount > 0 && (
                <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {discount}% OFF
                </div>
            )}

            {/* Wishlist Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isAuthenticated) {
                        navigate('/login');
                        return;
                    }
                    toggleWishlist(id);
                }}
                disabled={wishlistLoading}
                className={`absolute top-3 right-3 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${inWishlist
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
            </button>

            {/* Product Image Section */}
            <Link to={`/products/${id}`} className="relative block">
                <div className="relative h-56 sm:h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <img
                        src={!imageError ? getImageUrl(image) : null}
                        alt={name}
                        onError={() => setImageError(true)}
                        className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Placeholder when image fails */}
                    {imageError && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                                    <ShoppingCart className="w-10 h-10 text-gray-400" />
                                </div>
                                <span className="text-sm text-gray-400">No Image</span>
                            </div>
                        </div>
                    )}

                    {/* Category Badge */}
                    {category_name && (
                        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                            {category_name}
                        </span>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            </Link>

            {/* Content Section */}
            <div className="p-4 sm:p-5">
                {/* Product Name */}
                <Link to={`/products/${id}`} className="block">
                    <h3 className="text-sm font-semibold text-gray-800 leading-snug h-10 overflow-hidden line-clamp-2 hover:text-[#00674F] transition-colors mb-2">
                        {name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className={`flex items-center gap-0.5 ${getRatingColor(rating)} px-2 py-0.5 rounded-md`}>
                        <Star className="w-3 h-3 text-white fill-current" />
                        <span className="text-white text-xs font-bold">{rating}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">(1.2k Reviews)</span>
                </div>

                {/* Price Section */}
                <div className="flex items-baseline flex-wrap gap-2 mb-3">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                        {formatPrice(price)}
                    </span>
                    {original_price && (
                        <>
                            <span className="text-sm text-gray-400 line-through">
                                {formatPrice(original_price)}
                            </span>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                Save {formatPrice(original_price - price)}
                            </span>
                        </>
                    )}
                </div>

                {/* Features Icons */}
                <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <Truck className="w-4 h-4 text-[#00674F]" />
                        <span>Free Delivery</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-[#00674F]" />
                        <span>Secure</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleAddToCart}
                        disabled={adding}
                        className="flex-1 py-3 bg-gradient-to-r from-[#00674F] to-[#0A3C30] hover:from-[#0A3C30] hover:to-[#062820] text-white rounded-xl font-bold text-sm tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {adding ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Adding...</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-4 h-4" />
                                <span>Add to Cart</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/products/${id}`);
                        }}
                        className="px-4 py-3 bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-[#00674F] rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95"
                        title="View Details"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick View Link */}
                <Link
                    to={`/products/${id}/reviews`}
                    className="block text-center mt-3 py-2 text-xs text-gray-500 hover:text-[#00674F] font-medium transition-colors border-t border-gray-100"
                >
                    View Reviews & Ratings →
                </Link>
            </div>

            {/* Stock Status Indicator */}
            <div className={`absolute bottom-20 right-3 px-2 py-1 rounded text-xs font-medium ${in_stock !== false
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
                }`}>
                {in_stock !== false ? 'In Stock' : 'Out of Stock'}
            </div>
        </div>
    );
};

export default ProductCard;
