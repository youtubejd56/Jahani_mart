import React, { useState } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [openIndex, setOpenIndex] = useState(null);

    const categories = ['All', 'Wholesale', 'Orders', 'Shipping', 'Security'];

    const faqData = [
        {
            category: 'Wholesale',
            question: 'How do I apply for a wholesale account?',
            answer: 'You can apply by visiting our Wholesale Partnership page and filling out the application form. Our team reviews all applications within 48 hours.'
        },
        {
            category: 'Wholesale',
            question: 'What is the Minimum Order Value (MOV)?',
            answer: 'For authorized wholesale partners, the MOV typically starts at ₹25,000 per order to qualify for tiered B2B pricing.'
        },
        {
            category: 'Orders',
            question: 'Can I modify my bulk order after placement?',
            answer: 'Once an order enters the "Processing" stage, modifications are limited. Please contact your dedicated account manager immediately for urgent changes.'
        },
        {
            category: 'Shipping',
            question: 'Do you offer international container shipping?',
            answer: 'Yes, Jahani Mart facilitates global logistics. For international bulk inquiries, we provide FOB and CIF pricing models.'
        },
        {
            category: 'Security',
            question: 'How is my business data protected?',
            answer: 'We utilize enterprise-grade AES-256 encryption for all stored data and SSL/TLS protocols for all transmissions within our portal.'
        },
        {
            category: 'Orders',
            question: 'How do I track my active shipments?',
            answer: 'Navigate to the "Order Tracking" section in your dashboard and enter your Tracking ID for real-time logistics updates.'
        },
        {
            category: 'Wholesale',
            question: 'Are custom blends available for private labeling?',
            answer: 'Absolutely. We offer bespoke formulation services for our premium partners. Documentation and sampling can be requested via the support portal.'
        }
    ];

    const filteredFaqs = faqData.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] selection:bg-[#00674F] selection:text-white">
            <SEO
                title="Help Center & FAQ - Jahani Mart"
                description="Find answers to common questions about wholesale, shipping, and partnership operations."
            />

            {/* Premium Header */}
            <div className="bg-[#00674F] pt-32 pb-48 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                        Knowledge Base
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-8 font-heading tracking-tight">
                        How can we <span className="text-amber-400">help you?</span>
                    </h1>

                    {/* Impressive Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <input
                            type="text"
                            placeholder="Search for topics, keywords, or policies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white px-8 py-6 rounded-4xl text-gray-900 font-bold shadow-2xl focus:ring-4 focus:ring-amber-400/30 outline-none transition-all placeholder:text-gray-400 pl-16"
                        />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Navigation */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeCategory === cat
                                ? 'bg-amber-300 text-[#00674F] shadow-xl shadow-amber-400/20 active:scale-95'
                                : 'bg-amber-400 text-gray-400 hover:text-gray-900 border border-gray-100 hover:shadow-lg'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* FAQ Accordion Section */}
            <div className="max-w-3xl mx-auto px-6 py-24">
                {filteredFaqs.length > 0 ? (
                    <div className="space-y-4">
                        {filteredFaqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-500 ${openIndex === index ? 'shadow-2xl shadow-gray-200/50 ring-1 ring-[#00674F]/10' : 'hover:shadow-md'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-8 text-left group"
                                >
                                    <div className="flex gap-4 items-center">
                                        <span className="shrink-0 w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-[#00674F] group-hover:text-white transition-colors">
                                            {index + 1}
                                        </span>
                                        <h3 className={`font-black text-sm md:text-base tracking-tight transition-colors ${openIndex === index ? 'text-[#00674F]' : 'text-gray-900'
                                            }`}>
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <div className={`shrink-0 transition-transform duration-500 ${openIndex === index ? 'rotate-180 text-[#00674F]' : 'text-gray-300'}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                <div className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                    <div className="px-8 pb-8 pt-0 ml-12">
                                        <div className="prose prose-sm text-gray-500 font-medium leading-relaxed italic">
                                            {faq.answer}
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <span className="px-3 py-1 bg-gray-50 text-[9px] font-black uppercase text-[#00674F] tracking-widest rounded-full">
                                                {faq.category}
                                            </span >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                        <div className="text-4xl mb-4">🔍</div>
                        <h4 className="text-xl font-black text-gray-900 mb-2 tracking-tight">No results found</h4>
                        <p className="text-gray-400 font-medium">Try searching for broader keywords like "Shipping" or "Wholesale".</p>
                    </div>
                )}
            </div>

            {/* Support Banner */}
            <div className="max-w-5xl mx-auto px-6 mb-24">
                <div className="bg-[#033025] rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl shadow-[#00674F]/30">
                    <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white rounded-full"></div>
                        <div className="absolute bottom-[-20%] right-[-5%] w-96 h-96 bg-amber-400 rounded-full"></div>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight relative z-10">Still have questions?</h3>
                    <p className="text-white/60 font-medium mb-10 max-w-lg mx-auto relative z-10">
                        Can't find the answer you're looking for? Please reach out to our dedicated support team or your account manager.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                        <Link to="/support" className="px-10 py-4 bg-amber-400 text-[#00674F] font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-amber-500 transition-all active:scale-95">
                            Contact Support
                        </Link>
                        <Link to="/wholesale" className="px-10 py-4 bg-white/10 text-white border border-white/20 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white/20 transition-all active:scale-95">
                            Wholesale Portal
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
