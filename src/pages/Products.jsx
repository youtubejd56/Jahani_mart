import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [searchParams] = useSearchParams();

    // Get search query from URL on mount
    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch) {
            setSearchQuery(urlSearch);
        }
    }, [searchParams]);

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

    // Filter products by category
    const filteredByCategory = selectedCategory === 'all'
        ? products
        : products.filter(product => product.category_name === selectedCategory);

    // Filter by search query
    const filteredBySearch = searchQuery
        ? filteredByCategory.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : filteredByCategory;

    // Sort products
    const sortedProducts = [...filteredBySearch].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            default:
                return 0;
        }
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Banner */}
            <section className="bg-gradient-to-r from-[#00674F] to-[#0A3C30] py-40 text-center px-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    All Products
                </h1>
                <p className="text-white/80">
                    Browse our complete collection
                </p>
            </section>

            <div className="max-w-[1240px] mx-auto py-8 px-4 sm:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Categories */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Categories</h3>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${selectedCategory === 'all'
                                        ? 'bg-[#00674F] text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    All Products
                                </button>
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.name)}
                                        className={`text-left px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-3 ${selectedCategory === category.name
                                            ? 'bg-[#00674F] text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {(category.image || (category.icon && category.icon.startsWith('http'))) ? (
                                            <img
                                                src={getImageUrl(category.image || category.icon)}
                                                alt={category.name}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                        ) : category.icon && (
                                            <span className="text-lg leading-none">{category.icon}</span>
                                        )}
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-grow">
                        {/* Search and Sort Bar */}
                        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-grow relative">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    />
                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                                >
                                    <option value="default">Sort by: Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Rating</option>
                                    <option value="name-asc">Name: A to Z</option>
                                    <option value="name-desc">Name: Z to A</option>
                                </select>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mb-4 text-gray-600 font-medium">
                            Showing {sortedProducts.length} products
                            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                            {searchQuery && ` matching "${searchQuery}"`}
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="text-center py-20 text-lg text-gray-500 font-medium">
                                <div className="inline-block w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p>Loading products...</p>
                            </div>
                        ) : sortedProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-500 font-medium">No products found</p>
                                <button
                                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                                    className="mt-4 text-violet-600 hover:text-violet-700 font-medium"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {sortedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
