import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
    // Smooth scroll logic
    useEffect(() => {
        const handleAnchorClick = (e) => {
            const href = e.target.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const element = document.getElementById(targetId);
                if (element) {
                    window.scrollTo({
                        top: element.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        };

        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => anchor.addEventListener('click', handleAnchorClick));
        return () => anchors.forEach(anchor => anchor.removeEventListener('click', handleAnchorClick));
    }, []);

    const sections = [
        { id: 'agreement', title: '1. Agreement to Terms' },
        { id: 'eligibility', title: '2. Eligibility & Accounts' },
        { id: 'wholesale', title: '3. Wholesale Operations' },
        { id: 'intellectual-property', title: '4. Intellectual Property' },
        { id: 'prohibited', title: '5. Prohibited Activities' },
        { id: 'liability', title: '6. Limitation of Liability' },
        { id: 'governing-law', title: '7. Governing Law' },
        { id: 'modifications', title: '8. Modifications' },
    ];

    return (
        <div className="min-h-screen bg-[#FDFCFB] selection:bg-[#00674F] selection:text-white pb-24">
            <SEO 
                title="Terms of Service - Jahani Mart" 
                description="The legal framework for our partnership. Professional terms for business excellence." 
                url="https://jahani-mart.onrender.com/terms" 
            />

            {/* Premium Hero Header */}
            <div className="bg-[#00674F] pt-32 pb-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[80%] bg-white rounded-full blur-[120px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <nav className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                        <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-amber-400">Legal</span>
                    </nav>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-heading tracking-tight">
                        Terms of <span className="text-amber-400">Service</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-white/70 uppercase tracking-widest font-mono">
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                            Version: <span className="text-white">v2.4.0</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                            Jurisdiction: <span className="text-white">Delhi, India</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sticky Sidebar */}
                    <aside className="lg:w-64 shrink-0 hidden lg:block">
                        <div className="sticky top-32 space-y-1">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 pl-4 border-l-2 border-gray-100">Legal Navigation</h3>
                            {sections.map((section) => (
                                <a 
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="block px-4 py-3 text-[13px] font-black text-gray-500 hover:text-[#00674F] hover:bg-[#00674F]/5 rounded-xl transition-all border-l-4 border-transparent hover:border-[#00674F] uppercase tracking-wider"
                                >
                                    {section.title}
                                </a>
                            ))}
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 max-w-3xl">
                        <div className="prose prose-lg prose-gray max-w-none text-gray-600 leading-relaxed space-y-20">
                            
                            <section id="agreement" className="scroll-mt-32">
                                <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-4">
                                    <span className="text-[#00674F] text-sm bg-[#00674F]/5 px-3 py-1 rounded-lg">01</span>
                                    Agreement To Terms
                                </h2>
                                <p className="text-lg font-medium text-gray-800 mb-6">
                                    These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Jahani Mart ("we," "us," or "our").
                                </p>
                                <p>
                                    Access to and use of our wholesale platform is conditioned on your acceptance of and compliance with these Terms. By accessing our services, you confirm that you have read, understood, and agreed to be bound by all of these Terms of Service. If you do not agree, you are expressly prohibited from using the site.
                                </p>
                            </section>

                            <section id="eligibility" className="scroll-mt-32">
                                <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-4">
                                    <span className="text-[#00674F] text-sm bg-[#00674F]/5 px-3 py-1 rounded-lg">02</span>
                                    Eligibility & Accounts
                                </h2>
                                <p>
                                    Our platform is primarily a B2B (Business-to-Business) marketplace. To use certain features, you must register for an account. You agree to provide accurate, current, and complete information during the registration process.
                                </p>
                                <div className="mt-8 p-6 bg-[#00674F]/5 rounded-3xl border border-[#00674F]/10">
                                    <h4 className="text-sm font-black text-[#00674F] uppercase tracking-widest mb-4">Account Responsibilities:</h4>
                                    <ul className="space-y-4">
                                        {['Confidentiality of credentials', 'All activities under your account', 'Immediate notification of breaches', 'Legal age of 18 or valid business entity'].map((text, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-bold text-gray-700">
                                                <span className="mt-1 text-xs">◆</span> {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            <section id="wholesale" className="scroll-mt-32">
                                <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-4">
                                    <span className="text-[#00674F] text-sm bg-[#00674F]/5 px-3 py-1 rounded-lg">03</span>
                                    Wholesale Operations
                                </h2>
                                <p>
                                    Wholesale partnership applications are subject to approval by our internal compliance team. We reserve the right to deny service or revoke wholesale status at our sole discretion.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h5 className="font-black text-gray-900 text-sm mb-2 uppercase">Minimum Order</h5>
                                        <p className="text-xs text-gray-500">Bulk orders may be subject to Minimum Order Value (MOV) requirements as specified in the vendor portal.</p>
                                    </div>
                                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h5 className="font-black text-gray-900 text-sm mb-2 uppercase">Pricing</h5>
                                        <p className="text-xs text-gray-500">All prices are subject to change based on market dynamics and raw material costs without prior notice.</p>
                                    </div>
                                </div>
                            </section>

                            <section id="intellectual-property" className="scroll-mt-32">
                                <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-4">
                                    <span className="text-[#00674F] text-sm bg-[#00674F]/5 px-3 py-1 rounded-lg">04</span>
                                    Intellectual Property
                                </h2>
                                <p>
                                    All source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site (collectively, the "Content") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                                </p>
                            </section>

                            <section id="liability" className="scroll-mt-32">
                                <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-4">
                                    <span className="text-[#00674F] text-sm bg-[#00674F]/5 px-3 py-1 rounded-lg">06</span>
                                    Limitation of Liability
                                </h2>
                                <div className="bg-red-50 p-8 rounded-4xl border-2 border-dashed border-red-100">
                                    <p className="uppercase text-[10px] font-black text-red-600 tracking-[0.2em] mb-4">Legal Notice</p>
                                    <p className="text-sm font-bold text-red-800 leading-relaxed italic">
                                        In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, or loss of data.
                                    </p>
                                </div>
                            </section>

                            <section id="governing-law" className="scroll-mt-32">
                                <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-4">
                                    <span className="text-[#00674F] text-sm bg-[#00674F]/5 px-3 py-1 rounded-lg">07</span>
                                    Governing Law
                                </h2>
                                <p>
                                    These Terms shall be governed by and defined following the laws of India. Jahani Mart and yourself irrevocably consent that the courts of New Delhi shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                                </p>
                            </section>

                            {/* Final Compliance Banner */}
                            <div className="mt-32 p-12 bg-[#00674F] rounded-[3rem] text-center relative overflow-hidden shadow-2xl shadow-[#00674F]/30">
                                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                                    <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[140%] border-40 border-white rounded-full"></div>
                                </div>
                                <h3 className="text-2xl font-black text-amber-400 mb-6 relative z-10">Legal Acknowledgement</h3>
                                <p className="text-white/80 font-bold mb-10 max-w-xl mx-auto relative z-10 leading-relaxed">
                                    By clicking 'I Agree' during registration or by continuing to use our B2B portal, you acknowledge full compliance with these terms.
                                </p>
                                <Link 
                                    to="/register" 
                                    className="inline-block px-12 py-5 bg-amber-400 text-[#00674F] font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-amber-500 transition-all active:scale-95 relative z-10"
                                >
                                    Proceed to Governance
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
