import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const OurStory = () => {
    return (
        <div className="min-h-screen bg-[#FDFCFB] selection:bg-[#00674F] selection:text-white">
            <SEO 
                title="Our Story - Jahani International" 
                description="The journey of Jahani International. From humble beginnings to a leading B2B marketplace for Fashion, Electronics, and Home Essentials." 
                url="https://jahani-mart.onrender.com/our-story" 
            />

            {/* Premium Hero Header */}
            <div className="bg-[#00674F] pt-40 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[80%] bg-white rounded-full blur-[120px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <nav className="flex justify-center items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
                        <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-amber-400">About Us</span>
                    </nav>
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-8 font-heading tracking-tighter leading-none">
                        Our <span className="text-amber-400">Heritage</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
                        A legacy of excellence in global trade, bridging the gap between quality manufacturing and modern enterprise.
                    </p>
                </div>
            </div>

            {/* Vision & Values Grid */}
            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Global Reach', desc: 'Connecting manufacturers across continents with reliable logistics.', icon: '🌐' },
                        { title: 'Quality First', desc: 'Every product in our catalog undergoes rigorous quality auditing.', icon: '💎' },
                        { title: 'B2B Integrity', desc: 'Building long-term partnerships through transparent trade.', icon: '🤝' },
                    ].map((val, i) => (
                        <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 hover:-translate-y-2 transition-transform duration-500">
                            <span className="text-4xl mb-6 block">{val.icon}</span>
                            <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight uppercase">{val.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Narrative Sections */}
            <div className="max-w-7xl mx-auto px-6 py-32 space-y-32">
                
                {/* Founding Narrative */}
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="absolute inset-0 bg-amber-400 rounded-3xl rotate-3 group-hover:rotate-0 transition-transform duration-700 opacity-20"></div>
                        <img 
                            src="/img3.png" 
                            alt="Jahani Foundations" 
                            className="w-full h-auto object-cover rounded-3xl shadow-2xl relative z-10 grayscale-50 hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                    <div className="w-full lg:w-1/2">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4 block">The Genesis</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tighter uppercase leading-none">
                            Founded on <br /><span className="text-[#00674F]">Principle.</span>
                        </h2>
                        <div className="text-lg text-gray-600 leading-relaxed font-medium space-y-6">
                            <p>
                                Jahani International began with a singular vision: to democratize high-end manufacturing for businesses of all sizes. Founded over a decade ago, our journey started in the heart of global trade centers, identifying the inefficiencies that kept quality goods from the businesses that needed them most.
                            </p>
                            <p className="border-l-4 border-amber-400 pl-6 text-gray-900 font-bold italic bg-amber-50 py-4 rounded-r-2xl">
                                "Trade is not just about transactions; it's about the trust that sustains the global supply chain."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Evolution Section */}
                <div className="flex flex-col lg:flex-row-reverse gap-20 items-center">
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="absolute inset-0 bg-[#00674F] rounded-3xl -rotate-3 group-hover:rotate-0 transition-transform duration-700 opacity-10"></div>
                        <img 
                            src="/img4.png" 
                            alt="Logistics Evolution" 
                            className="w-full h-auto object-cover rounded-3xl shadow-2xl relative z-10"
                        />
                    </div>
                    <div className="w-full lg:w-1/2">
                        <span className="text-[10px] font-black text-[#00674F] uppercase tracking-[0.4em] mb-4 block">The Evolution</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tighter uppercase leading-none">
                            Scaling New <br /><span className="text-amber-500">Frontiers.</span>
                        </h2>
                        <div className="text-lg text-gray-600 leading-relaxed font-medium space-y-6">
                            <p>
                                What started as a focused fashion procurement entity has matured into a multi-vertical powerhouse. Today, Jahani Mart serves as the premier digital gateway for Electronics, Home Essentials, and Premium Fashion, powered by proprietary logistics and a dedicated partner network.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-6">
                                <div>
                                    <p className="text-3xl font-black text-gray-900 leading-none">500+</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Vendors Partnered</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-gray-900 leading-none">12M+</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Products Shipped</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievement Timeline */}
            <div className="bg-[#FAF9F6] py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">The Road to Excellence</h2>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">Key Milestones and Achievements</p>
                    </div>

                    <div className="relative">
                        <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 -translate-y-1/2 hidden md:block"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                            {[
                                { year: '2012', event: 'Founding in New Delhi', desc: 'Established as a fashion procurement firm.' },
                                { year: '2016', event: 'Tech Integration', desc: 'Launched first-gen digital vendor portal.' },
                                { year: '2020', event: 'Global Expansion', desc: 'Opened international logistics hubs.' },
                                { year: '2026', event: 'Market Leader', desc: 'Surpassed 500+ active wholesale partners.' },
                            ].map((step, i) => (
                                <div key={i} className="bg-white p-8 rounded-4xl shadow-xl border border-gray-100 flex flex-col items-center text-center group hover:bg-[#00674F] transition-colors duration-500">
                                    <span className="text-amber-500 font-black text-3xl mb-4 group-hover:text-white transition-colors">{step.year}</span>
                                    <h4 className="font-black text-gray-900 mb-2 uppercase text-sm group-hover:text-white transition-colors">{step.event}</h4>
                                    <p className="text-xs text-gray-400 group-hover:text-white/70 transition-colors leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="py-32 bg-white flex flex-col items-center px-6">
                <div className="w-16 h-px bg-[#00674F] mb-12"></div>
                <h3 className="text-3xl md:text-5xl font-black text-gray-900 text-center tracking-tighter mb-12 uppercase leading-none">
                    Be Part of Our <br /><span className="text-[#00674F]">Next Chapter.</span>
                </h3>
                <Link 
                    to="/wholesale" 
                    className="group flex items-center gap-6 bg-[#00674F] px-12 py-6 rounded-2xl shadow-2xl hover:bg-amber-400 transition-all duration-500 active:scale-95"
                >
                    <span className="text-white group-hover:text-[#00674F] font-black uppercase text-xs tracking-widest">Join the Partnership</span>
                    <span className="text-amber-400 group-hover:text-[#00674F] text-xl group-hover:translate-x-2 transition-transform duration-500">→</span>
                </Link>
            </div>
        </div>
    );
};

export default OurStory;

