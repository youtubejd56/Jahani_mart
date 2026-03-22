import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetail = () => {
    const { productId } = useParams();
    const { isAuthenticated } = useAuth();
    const { addToCart, loading: cartLoading } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [suggestedProducts, setSuggestedProducts] = useState([]);

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
    }, [productId]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/products/${productId}/`);
            setProduct(response.data);
            
            try {
                const suggResponse = await api.get(`/products/${productId}/suggested/`);
                setSuggestedProducts(suggResponse.data);
            } catch (err) {
                console.error('Error fetching suggestions:', err);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setAddingToCart(true);
        try {
            await addToCart(productId, quantity);
            alert('Added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setAddingToCart(false);
        }
    };

    const handleToggleWishlist = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        await toggleWishlist(productId);
    };

    const inWishlist = isInWishlist(parseInt(productId));

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-violet-600 text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-gray-500 text-lg mb-4">Product not found</p>
                <Link to="/products" className="bg-violet-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-violet-700">
                    Back to Products
                </Link>
            </div>
        );
    }

    const { name, description, price, original_price, discount, rating, stock, image, image_url, category_name } = product;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-[#00674F]">Home</Link>
                <span>/</span>
                <Link to="/products" className="hover:text-[#00674F]">Products</Link>
                <span>/</span>
                <span className="text-gray-800">{name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        {image_url || image ? (
                            <img
                                src={getImageUrl(image_url || image)}
                                alt={name}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    {category_name && (
                        <span className="inline-block bg-violet-100 text-[#00674F] px-3 py-1 rounded-full text-sm font-medium">
                            {category_name}
                        </span>
                    )}

                    <h1 className="text-3xl font-bold text-gray-900">{name}</h1>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-emerald-500 text-white px-2 py-1 rounded">
                            <span className="font-bold">{rating || 4.5}</span>
                            <span className="ml-1">★</span>
                        </div>
                        <span className="text-gray-500">1,234 reviews</span>
                    </div>

                    <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-gray-900">₹{price}</span>
                        {original_price && (
                            <>
                                <span className="text-xl text-gray-400 line-through">₹{original_price}</span>
                                {discount > 0 && (
                                    <span className="text-lg text-green-600 font-semibold">{discount}% off</span>
                                )}
                            </>
                        )}
                    </div>

                    <div className="text-gray-600">
                        {stock > 0 ? (
                            <span className="text-green-600 font-medium">✓ In Stock ({stock} available)</span>
                        ) : (
                            <span className="text-red-600 font-medium">✗ Out of Stock</span>
                        )}
                    </div>

                    <div className="border-t border-b border-gray-200 py-4">
                        <h3 className="font-semibold text-gray-800 mb-2">Product Description</h3>
                        <div className="text-gray-600">
                            {description ? (
                                <>
                                    <span className="whitespace-pre-line">
                                        {isExpanded || description.length <= 150 
                                            ? description 
                                            : `${description.substring(0, 150)}...`}
                                    </span>
                                    {description.length > 150 && (
                                        <button 
                                            onClick={() => setIsExpanded(!isExpanded)}
                                            className="inline-block text-[#00674F] hover:text-[#0A3C30] font-semibold mt-1 focus:outline-none transition-colors"
                                        >
                                            {isExpanded ? 'Read less' : 'Read more'}
                                        </button>
                                    )}
                                </>
                            ) : (
                                'No description available.'
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-4 py-2 hover:bg-gray-100"
                            >
                                -
                            </button>
                            <span className="px-4 py-2 font-medium">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                                className="px-4 py-2 hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart || stock === 0}
                            className="flex-1 bg-[#00674F] hover:bg-[#0A3C30] text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {addingToCart ? 'Adding...' : 'ADD TO CART'}
                        </button>
                        <button
                            onClick={handleToggleWishlist}
                            className={`px-4 py-3 rounded-lg font-semibold transition-colors ${inWishlist
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={inWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>

                    <Link
                        to={`/products/${productId}/reviews`}
                        className="inline-block text-[#00674F] hover:text-[#0A3C30] font-medium"
                    >
                        View Reviews →
                    </Link>
                </div>
            </div>

            {/* Suggested Products Section */}
            {suggestedProducts && suggestedProducts.length > 0 && (
                <div className="mt-16 border-t border-gray-200 pt-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products You Might Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {suggestedProducts.map(item => (
                            <Link 
                                to={`/products/${item.id}`} 
                                key={item.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="aspect-square bg-gray-50 overflow-hidden relative">
                                    {(item.image_url || item.image) ? (
                                        <img 
                                            src={getImageUrl(item.image_url || item.image)} 
                                            alt={item.name} 
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                    {item.discount > 0 && (
                                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {item.discount}% OFF
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[3rem] group-hover:text-[#00674F] transition-colors">
                                        {item.name}
                                    </h3>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex items-center text-yellow-400 text-sm">
                                            <span>★</span> 
                                            <span className="text-gray-700 font-medium ml-1">{item.rating || 4.5}</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                                        {item.original_price && (
                                            <span className="text-sm text-gray-400 line-through">₹{item.original_price}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
