import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Blog = () => {
    const [expandedPost, setExpandedPost] = useState(null);

    const posts = [
        {
            id: 1,
            title: "The Ultimate Guide to Masala Dabbas",
            excerpt: "Discover the history and essentials of the traditional Indian spice box, and why every kitchen needs one.",
            content: "The Masala Dabba is more than just a kitchen accessory; it's a piece of Indian heritage. Traditionally passed down through generations, this circular stainless steel or brass container holds seven essential spices, often including turmeric, cumin seeds, mustard seeds, and chili powder. In this guide, we'll explore how to organize your dabba, how to choose the right materials, and how to maintain the freshness of your spices for months. Whether you're a seasoned chef or a home cook starting your Indian culinary journey, the Masala Dabba is the heart of your kitchen.",
            date: "Mar 15, 2024",
            category: "Guides",
            image: "/img1.png"
        },
        {
            id: 2,
            title: "5 Spices to Boost Your Immunity",
            excerpt: "From Turmeric to Ginger, learn about the powerful health benefits hidden in your spice rack.",
            content: "Ancient wisdom meets modern science in the world of spices. Turmeric, rich in curcumin, is a potent anti-inflammatory. Ginger has been used for centuries to aid digestion and fight respiratory infections. Cinnamon helps regulate blood sugar, while Cloves are packed with antioxidants. Finally, Black Pepper enhances the absorption of all these nutrients. Discover how to incorporate these 'golden' ingredients into your daily tea, smoothies, and dishes to keep your immune system strong year-round.",
            date: "Mar 10, 2024",
            category: "Health",
            image: "/img2.png"
        },
        {
            id: 3,
            title: "Our Trip to the Spice Markets of Kerala",
            excerpt: "A photo journey through the vibrant and aromatic world of India's spice heartland.",
            content: "Join us on a sensorial journey through the winding lanes of Kochi and the lush plantations of Munnar. Kerala, known as the 'Land of Spices', is where the world's finest cardamom, pepper, and nutmeg come from. We met with local farmers, witnessed the traditional drying processes, and breathed in the intoxicating scents of the world-famous spice auctions. This journey reminded us of the deep connection between people, land, and the flavors that bring us all together at the table.",
            date: "Mar 05, 2024",
            category: "Travel",
            image: "/img3.png"
        }
    ];

    const toggleExpand = (id) => {
        if (expandedPost === id) {
            setExpandedPost(null);
        } else {
            setExpandedPost(id);
            // Smoothly scroll to the post so it's not hidden under header
            setTimeout(() => {
                const element = document.getElementById(`blog-post-${id}`);
                if (element) {
                    const headerOffset = 100;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }, 100);
        }
    };

    return (
        <div className="bg-[#fdf9f0] min-h-screen text-[#2c1d12] font-sans pb-20">
            <SEO title="Blog - Tips, Guides & Product Reviews" description="Read our latest blog posts about product guides, tips, reviews, and shopping advice from Jahani Mart." url="https://jahani-mart.onrender.com/blog" />
            {/* Hero Section */}
            <div className="relative h-[400px] overflow-hidden flex items-center justify-center">
                <img 
                    src="/img3.png" 
                    alt="Spices Hero" 
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.55]" 
                />
                <div className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4 tracking-tight drop-shadow-lg uppercase">Our Blog</h1>
                    <p className="text-white text-xl font-light italic">Stories of flavour, tradition, and inspiration</p>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-6 mt-16 pt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
                    {posts.map(post => (
                        <div 
                            key={post.id} 
                            id={`blog-post-${post.id}`}
                            className={`group flex flex-col bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ${expandedPost === post.id ? 'transform scale-[102%] z-40 ring-2 ring-[#00674F]/20' : ''}`}
                        >
                            <div className="rounded-t-lg h-64 overflow-hidden">
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-8 flex-grow flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#00674F] font-bold">
                                        <span>{post.category}</span>
                                        <span className="w-4 h-px bg-amber-200"></span>
                                        <span className="text-gray-400">{post.date}</span>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-serif font-bold group-hover:text-[#00674F] transition-colors mb-4 leading-tight">{post.title}</h2>
                                <p className="text-gray-600 leading-relaxed font-light mb-6 flex-grow italic">"{post.excerpt}"</p>
                                
                                {expandedPost === post.id && (
                                    <div className="animate-fadeIn mt-4 border-t pt-6 border-amber-100">
                                        <p className="text-[#2c1d12] text-md leading-loose font-medium mb-6 whitespace-pre-line">
                                            {post.content}
                                        </p>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand(post.id);
                                    }}
                                    className={`mt-auto w-full py-4 text-sm font-bold tracking-[0.2em] rounded-md transition-all duration-300 border-2 ${
                                        expandedPost === post.id 
                                        ? 'bg-[#00674F] text-white border-[#00674F]' 
                                        : 'bg-transparent text-[#00674F] border-[#00674F] hover:bg-[#00674F] hover:text-white'
                                    }`}
                                >
                                    {expandedPost === post.id ? 'READ LESS' : 'READ MORE'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Newsletter Subscription inside Blog */}
            <div className="max-w-[1280px] mx-auto px-6 mt-24">
                <div className="bg-[#00674F] p-16 text-center rounded-2xl shadow-2xl relative grow overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/10 rounded-full -ml-24 -mb-24"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-serif font-bold text-white mb-6">Join our spice community</h2>
                        <p className="text-amber-100 mb-10 max-w-2xl mx-auto text-lg">Get daily spice tips, exclusive recipes, and 10% off your first order when you join our mailing list.</p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-white p-2 rounded-xl shadow-lg">
                            <input 
                                type="email" 
                                placeholder="Email address" 
                                className="grow px-6 py-4 rounded-lg focus:outline-none text-[#2c1d12] text-lg font-light"
                            />
                            <button className="bg-amber-400 hover:bg-amber-500 text-[#00674F] font-bold px-10 py-4 rounded-lg transition-all transform hover:scale-105 uppercase tracking-widest text-sm shadow-md">Join</button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Blog;

