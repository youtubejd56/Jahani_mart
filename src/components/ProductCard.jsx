import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useLocale } from '../context/LocaleContext';
import { useNavigate, Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const ProductCard = ({ product }) => {
    const { addToCart, loading } = useCart();
    const { isAuthenticated } = useAuth();
    const { toggleWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();
    const { formatPrice, getConfig } = useLocale();
    const navigate = useNavigate();
    const [adding, setAdding] = useState(false);

    const {
        id,
        name,
        price,
        original_price,
        discount,
        rating,
        image,
        category_name
    } = product;

    const inWishlist = isInWishlist(id);

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
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
            <Link to={`/products/${id}`} className="relative h-44 sm:h-48 flex items-center justify-center mb-4 bg-gray-50 rounded-lg overflow-hidden">
                <img
                    src={getImageUrl(image) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTk5Ij5Qcm9kdWN0PC90ZXh0Pjwvc3ZnPg=='}
                    alt={name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
                {category_name && (
                    <span className="absolute top-2 left-2 bg-[#00674F] text-white px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm">
                        {category_name}
                    </span>
                )}
            </Link>
            <div className="flex flex-col gap-2">
                <Link to={`/products/${id}`} className="block">
                    <h3 className="text-sm font-semibold text-gray-800 leading-snug h-10 overflow-hidden line-clamp-2 hover:text-violet-600">
                        {name}
                    </h3>
                </Link>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[11px] font-bold">
                        <span>{rating}</span>
                        <span className="ml-0.5 -mt-px">★</span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">(1.2k)</span>
                </div>
                <div className="flex items-baseline flex-wrap gap-2">
                    <span className="text-lg font-extrabold text-gray-900">{formatPrice(price)}</span>
                    {original_price && (
                        <>
                            <span className="text-xs text-gray-400 line-through">{formatPrice(original_price)}</span>
                            <span className="text-xs text-emerald-500 font-bold">{discount}% off</span>
                        </>
                    )}
                </div>
                <div className="text-[11px] text-gray-500 font-medium">
                    <span>Free Delivery</span>
                </div>
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={handleAddToCart}
                        disabled={adding}
                        className="flex-1 py-2.5 bg-[#00674F] hover:bg-[#0A3C30] text-white rounded-lg font-bold text-xs tracking-wide transition-colors shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {adding ? 'ADDING...' : 'ADD TO CART'}
                    </button>
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
                        className={`px-3 py-2.5 rounded-lg font-bold text-xs transition-colors shadow-md active:scale-95 disabled:opacity-50 ${inWishlist ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={inWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/products/${id}/reviews`);
                    }}
                    className="mt-2 w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold text-xs tracking-wide transition-colors"
                >
                    VIEW REVIEWS
                </button>
            </div>
        </div >
    );
};

export default ProductCard;
