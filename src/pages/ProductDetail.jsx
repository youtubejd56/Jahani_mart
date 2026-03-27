import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLocale } from '../context/LocaleContext';
import { ShoppingCart, Heart, Star, Truck, Shield, ChevronLeft, ChevronRight, ZoomIn, Check, Package, Award, RefreshCw } from 'lucide-react';

const ProductDetail = () => {
    const { productId } = useParams();
    const { isAuthenticated } = useAuth();
    const { addToCart, loading: cartLoading } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { formatPrice } = useLocale();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('specifications');
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

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

    const handleMouseMove = (e) => {
        if (!isZoomed) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    const inWishlist = isInWishlist(parseInt(productId));

    // Get rating color based on rating value (Flipkart style)
    const getRatingColor = (rating) => {
        if (rating >= 4) return 'bg-green-600';
        if (rating >= 3) return 'bg-orange-500';
        return 'bg-red-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#00674F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
                <p className="text-gray-500 mb-6 text-center">The product you're looking for doesn't exist or has been removed.</p>
                <Link
                    to="/products"
                    className="bg-gradient-to-r from-[#00674F] to-[#0A3C30] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    const {
        name, description, price, original_price, discount,
        rating, stock, image, image_url, category_name,
        additional_images, specifications, warranty, manufacturer, in_the_box
    } = product;

    // Collect all valid images (main + gallery)
    const allImages = [
        { id: 'main', url: image_url || image },
        ...(additional_images || []).map(img => ({ id: `img_${img.id}`, url: img.image_url || img.image }))
    ].filter(img => img.url);

    const displayImage = allImages[selectedImage] ? allImages[selectedImage].url : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link to="/" className="text-gray-500 hover:text-[#00674F] transition-colors flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                        <Link to="/products" className="text-gray-500 hover:text-[#00674F] transition-colors">Products</Link>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                        <span className="text-gray-800 font-medium truncate max-w-xs">{name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Image Section */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div
                            className="relative bg-white rounded-2xl shadow-lg overflow-hidden group cursor-zoom-in"
                            onMouseEnter={() => setIsZoomed(true)}
                            onMouseLeave={() => setIsZoomed(false)}
                            onMouseMove={handleMouseMove}
                        >
                            {discount > 0 && (
                                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                    {discount}% OFF
                                </div>
                            )}

                            {displayImage ? (
                                <div className="aspect-square relative overflow-hidden">
                                    <img
                                        src={getImageUrl(displayImage)}
                                        alt={name}
                                        className={`w-full h-full object-contain p-8 transition-transform duration-500 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                                        style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
                                    />
                                    {isZoomed && (
                                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5">
                                            <ZoomIn className="w-3.5 h-3.5" />
                                            Hover to zoom
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                    <div className="text-center">
                                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                                            <Package className="w-12 h-12 text-gray-500" />
                                        </div>
                                        <span className="text-gray-500 font-medium">No Image Available</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {allImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${selectedImage === idx
                                                ? 'ring-2 ring-[#00674F] shadow-lg scale-105'
                                                : 'ring-1 ring-gray-200 hover:ring-[#00674F]/50 hover:shadow-md'
                                            }`}
                                    >
                                        <img
                                            src={getImageUrl(img.url)}
                                            alt={`${name} ${idx + 1}`}
                                            className="w-full h-full object-contain p-2"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <Truck className="w-6 h-6 text-[#00674F] mx-auto mb-2" />
                                <p className="text-xs font-medium text-gray-700">Free Delivery</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <Shield className="w-6 h-6 text-[#00674F] mx-auto mb-2" />
                                <p className="text-xs font-medium text-gray-700">Secure Payment</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <RefreshCw className="w-6 h-6 text-[#00674F] mx-auto mb-2" />
                                <p className="text-xs font-medium text-gray-700">Easy Returns</p>
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-6">
                        {/* Category & Title */}
                        <div>
                            {category_name && (
                                <span className="inline-block bg-gradient-to-r from-[#00674F]/10 to-[#0A3C30]/10 text-[#00674F] px-4 py-1.5 rounded-full text-sm font-semibold mb-3 border border-[#00674F]/20">
                                    {category_name}
                                </span>
                            )}
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{name}</h1>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-1.5 ${getRatingColor(rating)} px-3 py-1.5 rounded-lg shadow-sm`}>
                                <Star className="w-4 h-4 text-white fill-current" />
                                <span className="text-white font-bold">{rating || 4.5}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= Math.floor(rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-500 text-sm">(1,234 reviews)</span>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-baseline gap-4 flex-wrap">
                                <span className="text-4xl lg:text-5xl font-bold text-gray-900">{formatPrice(price)}</span>
                                {original_price && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">{formatPrice(original_price)}</span>
                                        {discount > 0 && (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                                Save {formatPrice(original_price - price)}
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="mt-4 flex items-center gap-2">
                                {stock > 0 ? (
                                    <>
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-green-600 font-semibold">In Stock</span>
                                        <span className="text-gray-500">({stock} available)</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                                        <span className="text-red-600 font-semibold">Out of Stock</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* In The Box */}
                        {in_the_box && (
                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                <div className="flex items-start gap-3">
                                    <Package className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-amber-800 mb-1">In The Box</p>
                                        <p className="text-amber-700 text-sm">{in_the_box}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700 font-medium">Quantity:</span>
                            <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-5 py-3 hover:bg-gray-100 transition-colors text-gray-600 font-bold text-lg"
                                >
                                    −
                                </button>
                                <span className="px-6 py-3 font-bold text-gray-900 text-lg bg-gray-50">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                                    className="px-5 py-3 hover:bg-gray-100 transition-colors text-gray-600 font-bold text-lg"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={addingToCart || stock === 0}
                                className="flex-1 bg-gradient-to-r from-[#00674F] to-[#0A3C30] hover:from-[#0A3C30] hover:to-[#062820] text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                            >
                                {addingToCart ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>Add to Cart</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleToggleWishlist}
                                className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${inWishlist
                                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600'
                                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-500 hover:bg-red-50'
                                    }`}
                            >
                                <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        {/* View Reviews Link */}
                        <Link
                            to={`/products/${productId}/reviews`}
                            className="flex items-center justify-center gap-2 py-3 text-[#00674F] hover:text-[#0A3C30] font-semibold transition-colors border-2 border-[#00674F]/20 rounded-xl hover:bg-[#00674F]/5"
                        >
                            <Star className="w-5 h-5" />
                            View Reviews & Ratings
                            <ChevronRight className="w-4 h-4" />
                        </Link>

                        {/* Product Info Tabs */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="flex border-b border-gray-100 bg-gray-50/50">
                                {[
                                    { id: 'specifications', label: 'Specifications', icon: Award },
                                    { id: 'description', label: 'Description', icon: Package },
                                    { id: 'warranty', label: 'Warranty', icon: Shield },
                                    { id: 'manufacturer', label: 'Manufacturer', icon: Check }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 px-4 py-4 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === tab.id
                                                ? 'bg-white text-[#00674F] border-b-2 border-[#00674F] shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="p-6 min-h-[150px]">
                                {activeTab === 'description' && (
                                    <div className="text-gray-600 leading-relaxed">
                                        {description ? (
                                            <p className="whitespace-pre-line">{description}</p>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-400">No description available for this product.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'specifications' && (
                                    <div className="text-gray-700">
                                        {specifications ? (
                                            <div className="whitespace-pre-line leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                {specifications}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-400">No specifications listed for this product.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'warranty' && (
                                    <div className="text-gray-700">
                                        <div className="flex items-start gap-4 bg-green-50 rounded-xl p-4 border border-green-100">
                                            <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-green-800 mb-1">Warranty Information</p>
                                                <p className="text-green-700">{warranty || 'Standard Manufacturer Warranty Applies.'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'manufacturer' && (
                                    <div className="text-gray-700">
                                        <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
                                            <Check className="w-8 h-8 text-blue-600 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-blue-800 mb-1">Manufacturer Details</p>
                                                <p className="text-blue-700">{manufacturer || 'Information not available.'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suggested Products Section */}
                {suggestedProducts && suggestedProducts.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">You May Also Like</h2>
                                <p className="text-gray-500 mt-1">Similar products based on your interest</p>
                            </div>
                            <Link
                                to="/products"
                                className="hidden sm:flex items-center gap-2 text-[#00674F] hover:text-[#0A3C30] font-semibold transition-colors"
                            >
                                View All
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {suggestedProducts.map(item => (
                                <Link
                                    to={`/products/${item.id}`}
                                    key={item.id}
                                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-[#00674F]/30 transform hover:-translate-y-1"
                                >
                                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
                                        {(item.image_url || item.image) ? (
                                            <img
                                                src={getImageUrl(item.image_url || item.image)}
                                                alt={item.name}
                                                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-16 h-16 text-gray-300" />
                                            </div>
                                        )}
                                        {item.discount > 0 && (
                                            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                                {item.discount}% OFF
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[3rem] group-hover:text-[#00674F] transition-colors mb-2">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className={`flex items-center gap-1 ${getRatingColor(item.rating)} px-2 py-0.5 rounded text-xs`}>
                                                <Star className="w-3 h-3 text-white fill-current" />
                                                <span className="text-white font-bold">{item.rating || 4.5}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-bold text-gray-900">{formatPrice(item.price)}</span>
                                            {item.original_price && (
                                                <span className="text-sm text-gray-400 line-through">{formatPrice(item.original_price)}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-6 text-center sm:hidden">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 text-[#00674F] hover:text-[#0A3C30] font-semibold transition-colors"
                            >
                                View All Products
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
