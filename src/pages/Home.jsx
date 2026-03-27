import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useLocale } from '../context/LocaleContext';
import SEO from '../components/SEO';

const Home = () => {
    const navigate = useNavigate();
    const { formatPrice, getConfig } = useLocale();
    const currencySymbol = getConfig().currencySymbol;
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [counters, setCounters] = useState({
        products: 0,
        customers: 0,
        rating: 0
    });
    const statsRef = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('/products/'),
                    api.get('/categories/')
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Counter animation
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    // Animate Products (10K+)
                    let productCount = 0;
                    const productInterval = setInterval(() => {
                        productCount += 8;
                        if (productCount >= 10000) {
                            productCount = 10000;
                            clearInterval(productInterval);
                        }
                        setCounters(prev => ({ ...prev, products: productCount }));
                    }, 12);

                    // Animate Customers (50K+)
                    let customerCount = 0;
                    const customerInterval = setInterval(() => {
                        customerCount += 40;
                        if (customerCount >= 50000) {
                            customerCount = 50000;
                            clearInterval(customerInterval);
                        }
                        setCounters(prev => ({ ...prev, customers: customerCount }));
                    }, 12);

                    // Animate Rating (4.8)
                    let ratingCount = 0;
                    const ratingInterval = setInterval(() => {
                        ratingCount += 0.003;
                        if (ratingCount >= 4.8) {
                            ratingCount = 4.8;
                            clearInterval(ratingInterval);
                        }
                        setCounters(prev => ({ ...prev, rating: ratingCount }));
                    }, 20);
                }
            });
        }, { threshold: 0.02 });

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const [currentAd, setCurrentAd] = useState(0);

    const advertisements = [
        {
            id: 1,
            title: "Summer Sale",
            subtitle: "Up to 50% Off",
            description: "Discover amazing deals on premium products",
            bgGradient: "from-orange-500 via-red-500 to-pink-500",
            icon: (
                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
            )
        },
        {
            id: 2,
            title: "Free Delivery",
            subtitle: `On Orders Above ${currencySymbol}500`,
            description: "Fast and reliable shipping across India",
            bgGradient: "from-emerald-500 via-teal-600 to-cyan-500",
            icon: (
                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: 3,
            title: "New Arrivals",
            subtitle: "Trending Now",
            description: "Check out the latest collection",
            bgGradient: "from-violet-500 via-purple-600 to-indigo-500",
            icon: (
                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            )
        }
    ];

    // Auto-rotate ads every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAd((prev) => (prev + 1) % advertisements.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const nextAd = () => setCurrentAd((prev) => (prev + 1) % advertisements.length);
    const prevAd = () => setCurrentAd((prev) => (prev - 1 + advertisements.length) % advertisements.length);

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO
                title="Premium Products at Best Prices"
                description="Jahani Mart - Shop 10,000+ premium products at unbeatable prices. Free delivery across India. Summer sale up to 50% off."
                keywords="jahani mart, online shopping, best prices, free delivery india, summer sale, premium products"
                url="https://jahani-mart.onrender.com"
            />
            {/* Hero Section - Redesigned */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#00674F] via-[#0A3C30] to-[#062820]">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto py-20 md:py-32 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-amber-300 bg-amber-400/10 rounded-full border border-amber-400/20">
                            🛒 Welcome to Jahani International
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-heading">
                            Quality Products at
                            <span className="block text-amber-400">Unbeatable Prices</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
                            Discover a curated collection of premium products designed to elevate your everyday experience
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="group bg-amber-400 hover:bg-amber-500 text-[#00674F] px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                                <span>Shop Now</span>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                            <button className="text-white/90 hover:text-white px-8 py-4 rounded-full text-lg font-medium border border-white/20 hover:border-white/40 transition-all flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Watch Video</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div ref={statsRef} className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                                {counters.products >= 10000 ? '10K+' : `${Math.floor(counters.products / 1000)}K+`}
                            </div>
                            <div className="text-white/60 text-sm">Products</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                                {counters.customers >= 1000 ? `${Math.floor(counters.customers / 1000)}0K+` : `${counters.customers}+`}
                            </div>
                            <div className="text-white/60 text-sm">Happy Customers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-1">{counters.rating.toFixed(1)}</div>
                            <div className="text-white/60 text-sm">Rating</div>
                        </div>
                    </div>
                </div>

                {/* Wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-12 md:h-16 text-gray-50" viewBox="0 0 1440 100" preserveAspectRatio="none">
                        <path fill="currentColor" d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,50 1440,50 L1440,100 L0,100 Z"></path>
                    </svg>
                </div>
            </section>

            {/* Advertisement Banners Section - Carousel */}
            <section className="max-w-7xl mx-auto px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 md:py-6 lg:py-8 xl:py-12">
                <div className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl">
                    {/* Banner Slides */}
                    <div className="relative h-48 sm:h-48 md:h-56 lg:h-64 xl:h-72 2xl:h-80 3xl:h-96">
                        {advertisements.map((ad, index) => (
                            <div
                                key={ad.id}
                                className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${index === currentAd
                                    ? 'opacity-100 translate-x-0 scale-100'
                                    : 'opacity-0 translate-x-full scale-95'
                                    } bg-gradient-to-br ${ad.bgGradient}`}
                            >
                                {/* Decorative circles */}
                                <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 xl:w-64 xl:h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-36 lg:h-36 xl:w-48 xl:h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                                <div className="absolute top-1/2 left-1/2 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-72 lg:h-72 xl:w-96 xl:h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>

                                {/* Content */}
                                <div className="relative z-10 h-full flex items-center justify-center px-1 sm:px-2 md:px-4 lg:px-8 xl:px-12 2xl:px-16">
                                    <div className="text-center text-white max-w-[240px] sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-2xl">
                                        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl mb-1 sm:mb-2 md:mb-4 animate-bounce text-white/80">{ad.icon}</div>
                                        <h3 className="text-lg sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-0.5 sm:mb-1 md:mb-2 drop-shadow-lg">{ad.title}</h3>
                                        <p className="text-xl sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-extrabold mb-1 sm:mb-2 md:mb-3 drop-shadow-lg">{ad.subtitle}</p>
                                        <p className="text-white/90 mb-2 sm:mb-3 md:mb-4 lg:mb-6 text-[12px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl">{ad.description}</p>
                                        <button
                                            onClick={() => {
                                                if (ad.id === 1) navigate('/products?sale=true');
                                                else if (ad.id === 2) navigate('/products');
                                                else if (ad.id === 3) navigate('/products?new=true');
                                            }}
                                            className="bg-white/25 hover:bg-white/35 backdrop-blur-md px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-1 sm:py-1.5 md:py-2 lg:py-3 rounded-full text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg border border-white/20"
                                        >
                                            {ad.id === 1 ? 'Shop Now' : ad.id === 2 ? 'Explore' : 'View All'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevAd}
                        className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-20"
                    >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextAd}
                        className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-20"
                    >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-1 sm:bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 md:gap-2 z-20">
                        {advertisements.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentAd(index)}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${index === currentAd
                                    ? 'bg-white w-4 sm:w-5 md:w-6 lg:w-8'
                                    : 'bg-white/40 hover:bg-white/60'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section - Enhanced */}
            <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 font-heading">
                            Shop by Category
                        </h2>
                        <p className="text-gray-500 mt-2">Browse our wide range of products</p>
                    </div>
                    <button className="text-[#00674F] font-semibold hover:text-[#005440] transition-colors flex items-center gap-1">
                        View All
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex flex-col items-center gap-3 cursor-pointer group transition-all hover:-translate-y-2"
                        >
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-transparent group-hover:border-[#00674F]">
                                {category.image || (category.icon && category.icon.startsWith('http')) ? (
                                    <img src={getImageUrl(category.image || category.icon)} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                ) : (
                                    <span className="text-3xl sm:text-4xl">{category.icon || category.name[0]}</span>
                                )}
                            </div>
                            <span className="text-sm sm:text-base font-semibold text-gray-700 group-hover:text-[#00674F] transition-colors text-center">
                                {category.name}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Small Promo Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00674F] to-[#0A3C30] p-8 sm:p-12 text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
                            Join Our Loyalty Program
                        </h2>
                        <p className="text-white/80 max-w-2xl mx-auto mb-8">
                            Earn points on every purchase and unlock exclusive deals and discounts
                        </p>
                        <button
                            onClick={() => navigate('/profile?section=wallet')}
                            className="bg-amber-400 hover:bg-amber-500 text-[#00674F] px-8 py-3 rounded-full font-bold transition-all hover:scale-105"
                        >
                            Join Now - It's Free!
                        </button>
                    </div>
                </div>
            </section>

            {/* Products Section - Enhanced */}
            <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 pb-20">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 font-heading">
                            Featured Products
                        </h2>
                        <p className="text-gray-500 mt-2">Handpicked just for you</p>
                    </div>
                    <button className="text-[#00674F] font-semibold hover:text-[#005440] transition-colors flex items-center gap-1">
                        View All
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                {loading ? (
                    <div className="text-center py-20 text-lg text-gray-500 font-medium">
                        <div className="inline-block w-8 h-8 border-4 border-[#00674F] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p>Loading products...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* Customer Reviews Section */}
            <section className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10 font-heading">
                        What Our Customers Say
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">"Great products and amazing customer service. Fast delivery too!"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#00674F] text-white flex items-center justify-center font-bold">R</div>
                                <div>
                                    <p className="font-semibold text-gray-800">Rahul Sharma</p>
                                    <p className="text-sm text-gray-500">Verified Buyer</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">"Best online shopping experience. Products are exactly as described."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#00674F] text-white flex items-center justify-center font-bold">P</div>
                                <div>
                                    <p className="font-semibold text-gray-800">Priya Patel</p>
                                    <p className="text-sm text-gray-500">Verified Buyer</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">"Very satisfied with my purchase. Will definitely shop again!"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#00674F] text-white flex items-center justify-center font-bold">A</div>
                                <div>
                                    <p className="font-semibold text-gray-800">Amit Kumar</p>
                                    <p className="text-sm text-gray-500">Verified Buyer</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">"Outstanding product quality! Exceeded all my expectations. Worth every rupee."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#00674F] text-white flex items-center justify-center font-bold">S</div>
                                <div>
                                    <p className="font-semibold text-gray-800">Sneha Reddy</p>
                                    <p className="text-sm text-gray-500">Verified Buyer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
