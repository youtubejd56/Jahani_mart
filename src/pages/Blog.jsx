import React, { useState } from 'react';
import SEO from '../components/SEO';

const Blog = () => {
    const [expandedPost, setExpandedPost] = useState(null);

    const posts = [
        {
            id: 1,
            title: "2026 B2B Commerce Trends: The Rise of Digital Hubs",
            excerpt: "How centralized marketplaces are redefining the global supply chain for small-to-medium enterprises.",
            content: "As we move further into 2026, the traditional fragmented supply chain is giving way to unified digital ecosystems. Jahani International is at the forefront of this shift, providing a single point of entry for procurement across Fashion, Electronics, and Essentials. This trend is driven by the need for real-time inventory visibility and automated logistics, allowing businesses to scale without the overhead of traditional sourcing. We analyze how API-first infrastructures are enabling faster cross-border trade and reducing lead times by up to 40%.",
            date: "Mar 25, 2026",
            readTime: "6 min read",
            category: "Industry Insights",
            image: "/img1.png"
        },
        {
            id: 2,
            title: "Optimizing Your Inventory for Peak Demand",
            excerpt: "Strategic insights into seasonal planning and warehouse management for wholesale partners.",
            content: "Successful retail starts with predictive inventory management. In this deep dive, we explore how our partner network utilizes data-driven forecasting to stay ahead of market shifts. From fashion seasonality to the sudden surge in electronics demand, understanding the 'velocity of SKU' is critical. We provide actionable strategies for maintaining optimal stock levels, reducing deadstock risk, and leveraging Jahani's 'Just-In-Time' delivery models to maximize warehouse efficiency and capital liquidity.",
            date: "Mar 20, 2026",
            readTime: "5 min read",
            category: "Strategy",
            image: "/img2.png"
        },
        {
            id: 3,
            title: " sustainable Sourcing in the Modern Era",
            excerpt: "Our commitment to ethical manufacturing and transparent supply chains in 2026.",
            content: "Sustainability is no longer a choice—it's a business imperative. Jahani International has implemented a rigorous multi-point audit system for all our manufacturing partners. This ensures not only product quality but social and environmental responsibility. From eco-friendly packaging in Home Essentials to ethically sourced textiles in our Fashion collection, we are building a transparent pipeline that your customers can trust. Learn how 'Green Logistics' is reducing our carbon footprint while simultaneously lowering operational costs for our partners.",
            date: "Mar 12, 2026",
            readTime: "8 min read",
            category: "Sustainability",
            image: "/img3.png"
        }
    ];

    const toggleExpand = (id) => {
        if (expandedPost === id) {
            setExpandedPost(null);
        } else {
            setExpandedPost(id);
            setTimeout(() => {
                const element = document.getElementById(`blog-post-${id}`);
                if (element) {
                    window.scrollTo({
                        top: element.offsetTop - 120,
                        behavior: "smooth"
                    });
                }
            }, 100);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] selection:bg-[#00674F] selection:text-white">
            <SEO 
                title="Intelligence & Insights - Jahani Mart" 
                description="Expert analysis on B2B commerce, global logistics, and market trends." 
                url="https://jahani-mart.onrender.com/blog" 
            />

            {/* Editorial Hero Header */}
            <div className="bg-[#003B2D] pt-40 pb-56 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-full bg-white rounded-full blur-[150px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-1.5 mb-8 text-[10px] font-black uppercase tracking-[0.4em] text-amber-400 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                            Editorial Hub
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-10 font-heading tracking-tighter leading-none">
                            Knowledge <br /><span className="text-amber-400">Powerhouse.</span>
                        </h1>
                        <p className="text-xl text-white/60 font-medium leading-relaxed max-w-xl italic">
                            Redefining commerce through data-driven insights, global trend analysis, and strategic B2B narratives.
                        </p>
                    </div>
                </div>
            </div>

            {/* Featured Post Spotlight */}
            <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row shadow-[#003B2D]/20">
                    <div className="lg:w-1/2 h-80 lg:h-auto overflow-hidden">
                        <img 
                            src="/img1.png" 
                            alt="Featured Insights" 
                            className="w-full h-full object-cover grayscale-50 hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100" 
                        />
                    </div>
                    <div className="lg:w-1/2 p-12 md:p-16 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="px-4 py-1.5 bg-[#00674F]/5 text-[#00674F] text-[10px] font-black uppercase tracking-widest rounded-full">Editor's Choice</span>
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none">Mar 28, 2026</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tighter leading-tight uppercase">
                            The Future of <span className="text-[#00674F]">Autonomous Logistics</span> in 2026.
                        </h2>
                        <p className="text-gray-500 font-medium leading-relaxed mb-10 line-clamp-3">
                            Exploring the intersection of AI-driven warehousing and autonomous last-mile delivery. How Jahani International is paving the way for low-latency global distribution networks.
                        </p>
                        <button className="self-start px-12 py-5 bg-[#00674F] text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-amber-400 hover:text-[#00674F] transition-all active:scale-95 shadow-xl shadow-[#00674F]/20">
                            Full Analysis
                        </button>
                    </div>
                </div>
            </div>

            {/* Standard Post Grid */}
            <div className="max-w-7xl mx-auto px-6 py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {posts.map(post => (
                        <div 
                            key={post.id} 
                            id={`blog-post-${post.id}`}
                            className="group flex flex-col bg-white rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden hover:-translate-y-2 transition-all duration-500"
                        >
                            <div className="h-64 overflow-hidden relative">
                                <span className="absolute top-6 left-6 z-10 px-4 py-2 bg-white/90 backdrop-blur-sm text-[#00674F] text-[9px] font-black uppercase tracking-widest rounded-xl shadow-sm">
                                    {post.category}
                                </span>
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                                />
                            </div>
                            <div className="p-10 grow flex flex-col">
                                <div className="flex items-center gap-4 mb-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-300">
                                    <span>{post.date}</span>
                                    <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                                    <span>{post.readTime}</span>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tighter uppercase leading-tight group-hover:text-[#00674F] transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-sm font-medium text-gray-500 leading-relaxed mb-10 grow italic opacity-80">
                                    "{post.excerpt}"
                                </p>
                                
                                {expandedPost === post.id && (
                                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 mb-8 border-t border-gray-100 pt-8">
                                        <p className="text-gray-800 text-sm leading-relaxed font-bold italic mb-6">
                                            {post.content}
                                        </p>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={() => toggleExpand(post.id)}
                                    className={`w-full py-5 text-[10px] font-black tracking-[0.3em] rounded-2xl uppercase transition-all duration-500 ${
                                        expandedPost === post.id 
                                        ? 'bg-amber-400 text-[#00674F] shadow-lg shadow-amber-400/20' 
                                        : 'bg-gray-50 text-gray-400 hover:bg-[#00674F] hover:text-white'
                                    }`}
                                >
                                    {expandedPost === post.id ? 'Collapse Analysis' : 'Expand Report'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ultra-Premium Newsletter Section */}
            <div className="max-w-7xl mx-auto px-6 mb-32">
                <div className="bg-[#002B21] rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-[#003B2D]/40">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 opacity-5 blur-[120px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00674F] opacity-10 blur-[100px] -ml-24 -mb-24"></div>
                    
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-none uppercase">
                            Join the <span className="text-amber-400">Inner Circle</span>
                        </h2>
                        <p className="text-white/60 mb-12 text-lg font-medium italic">
                            Weekly intelligence briefings, priority trend reports, and exclusive B2B partnership opportunities delivered to your inbox.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 bg-white/5 p-3 rounded-[2.5rem] backdrop-blur-xl border border-white/10 shadow-2xl">
                            <input 
                                type="email" 
                                placeholder="Corporate Email Address" 
                                className="grow bg-transparent px-8 py-5 rounded-3xl outline-none text-white font-bold placeholder:text-white/30"
                            />
                            <button className="bg-amber-400 hover:bg-amber-500 text-[#003B2D] font-black px-12 py-5 rounded-3xl transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-widest text-xs shadow-xl shadow-amber-400/20">
                                Subscribe
                            </button>
                        </div>
                        <p className="mt-8 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Privacy Secured. No Spam. Only Intelligence.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;

