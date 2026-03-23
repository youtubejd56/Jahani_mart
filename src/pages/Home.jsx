import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#00674F] to-[#0A3C30] py-24 md:py-44 sm:py-20 text-center px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 animate-fade-in">
                        Welcome to Jahani International
                    </h1>
                    <p className="text-lg sm:text-xl text-white/90 mb-10">
                        Your one-stop destination for quality products at unbeatable prices
                    </p>
                    <button className="bg-amber-400 hover:bg-amber-500 text-[#00674F] px-6 py-3  md:px-10 md:py-4 rounded-full text-lg font-bold shadow-lg hover:scale-105 transition-all">
                        Shop Now
                    </button>
                </div>
            </section>

            {/* Categories Section */}
            <section className="max-w-[1240px] mx-auto py-12 px-4 sm:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-10 text-center">
                    Shop by Category
                </h2>
                <div className="flex justify-center gap-6 sm:gap-10 flex-wrap">
                    {categories.map(category => (
                        <div key={category.id} className="flex flex-col items-center gap-3 cursor-pointer group transition-transform hover:-translate-y-1">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-shadow bg-gray-100 flex items-center justify-center">
                                {category.image || (category.icon && category.icon.startsWith('http')) ? (
                                    <img src={getImageUrl(category.image || category.icon)} alt={category.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl">{category.icon || category.name[0]}</span>
                                )}
                            </div>
                            <span className="text-sm sm:text-base font-semibold text-gray-700 group-hover:text-violet-600 transition-colors">
                                {category.name}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Products Section */}
            <section className="max-w-[1240px] mx-auto py-12 px-4 sm:px-8 pb-20">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-10 text-center">
                    Featured Products
                </h2>
                {loading ? (
                    <div className="text-center py-20 text-lg text-gray-500 font-medium">
                        <div className="inline-block w-8 h-8 border-4 border-[#00674F] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p>Loading products...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
