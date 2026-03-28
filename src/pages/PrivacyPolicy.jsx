import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    // Smoothe scroll for anchor links
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
        { id: 'introduction', title: '1. Introduction' },
        { id: 'data-collection', title: '2. Data We Collect' },
        { id: 'usage', title: '3. Use of Information' },
        { id: 'sharing', title: '4. Third-Party Sharing' },
        { id: 'security', title: '5. Data Security' },
        { id: 'cookies', title: '6. Cookie Policy' },
        { id: 'rights', title: '7. Your Legal Rights' },
        { id: 'contact', title: '8. Contact Us' },
    ];

    return (
        <div className="min-h-screen bg-[#FDFCFB] selection:bg-[#00674F] selection:text-white">
            <SEO 
                title="Privacy Policy - Jahani Mart" 
                description="Our commitment to your privacy. Learn how we handle your data with transparency and security." 
                url="https://jahani-mart.onrender.com/privacy" 
            />

            {/* Premium Hero Header */}
            <div className="bg-[#00674F] pt-32 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[80%] bg-white rounded-full blur-[120px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <nav className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                        <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-amber-400">Legal</span>
                    </nav>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-heading tracking-tight">
                        Privacy <span className="text-amber-400">Policy</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-white/70 uppercase tracking-widest">
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                            Effective: <span className="text-white">Jan 01, 2024</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                            Last Updated: <span className="text-white">Mar 28, 2026</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sticky Side Navigation */}
                    <aside className="lg:w-64 shrink-0 hidden lg:block">
                        <div className="sticky top-32 space-y-1">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 pl-4">On This Page</h3>
                            {sections.map((section) => (
                                <a 
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="block px-4 py-3 text-sm font-bold text-gray-500 hover:text-[#00674F] hover:bg-[#00674F]/5 rounded-xl transition-all border-l-2 border-transparent hover:border-[#00674F]"
                                >
                                    {section.title}
                                </a>
                            ))}
                        </div>
                    </aside>

                    {/* Main Legal Content */}
                    <div className="flex-1 max-w-3xl">
                        <div className="prose prose-lg prose-gray max-w-none text-gray-600 leading-relaxed">
                            <section id="introduction" className="mb-16 scroll-mt-32">
                                <p className="text-lg font-medium text-gray-900 leading-relaxed mb-6">
                                    At Jahani Mart, the privacy of our partners and customers is paramount. We are committed to transparency in our data processing practices and providing the highest level of security for your personal and business information.
                                </p>
                                <p>
                                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or interact with our services. Please read this document carefully to understand our views and practices regarding your data and how we will treat it.
                                </p>
                            </section>

                            <section id="data-collection" className="mb-16 scroll-mt-32">
                                <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">2. Information We Collect</h2>
                                <p className="mb-4">We collect information that identifies, relates to, describes, or could reasonably be linked with you or your business. This include:</p>
                                <ul className="space-y-4 list-disc pl-5 font-medium">
                                    <li><strong className="text-gray-900">Personal Identifiers:</strong> Name, business email, phone number, and account credentials.</li>
                                    <li><strong className="text-gray-900">Commercial Information:</strong> Purchase history, wholesale applications, and payment records.</li>
                                    <li><strong className="text-gray-900">Logistics Data:</strong> Delivery addresses, warehouse contact details, and invoicing preferences.</li>
                                    <li><strong className="text-gray-900">Digital Footprint:</strong> IP address, browser type, and interaction patterns on our platform.</li>
                                </ul>
                            </section>

                            <section id="usage" className="mb-16 scroll-mt-32">
                                <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">3. How We Use Information</h2>
                                <p className="mb-6">Our use of your data is strictly confined to providing and perfecting our B2B ecosystem. We utilize collected information to:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        'Process and fulfill wholesale orders',
                                        'Evaluate B2B partnership applications',
                                        'Enhance platform security and fraud prevention',
                                        'Communicate legal and operational updates',
                                        'Analyze market trends for bulk inventory',
                                        'Provide personalized enterprise support'
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold text-gray-700">
                                            <span className="text-[#00674F]">✓</span> {item}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section id="sharing" className="mb-16 scroll-mt-32">
                                <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">4. Third-Party Sharing</h2>
                                <p>
                                    Jahani Mart does not sell your data to third parties. We only share information with authorized service providers (such as logistics partners and payment processors) who assist in our operations, and always under strict confidentiality agreements.
                                </p>
                            </section>

                            <section id="security" className="mb-16 scroll-mt-32">
                                <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">5. Data Security</h2>
                                <div className="bg-[#00674F]/5 p-8 rounded-3xl border-2 border-dashed border-[#00674F]/20 relative">
                                    <p className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <span className="text-xl">🛡️</span> Enterprise-Grade Protection
                                    </p>
                                    <p className="text-sm">
                                        We employ top-tier encryption (SSL/TLS) for data in transit and at rest. Our systems are routinely audited for vulnerabilities to ensure the absolute integrity of our partner database.
                                    </p>
                                </div>
                            </section>

                            <section id="cookies" className="mb-16 scroll-mt-32">
                                <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">6. Cookie Policy</h2>
                                <p>
                                    Our platform uses essential and analytical cookies to remember your preferences and understand how you interact with our catalog. You can manage your cookie preferences through your browser settings at any time.
                                </p>
                            </section>

                            <section id="rights" className="mb-16 scroll-mt-32">
                                <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">7. Your Legal Rights</h2>
                                <p>
                                    Depending on your jurisdiction, you have the right to access, correct, or delete your personal data. You may also object to processing or request data portability. To exercise these rights, please contact our Legal Data Officer.
                                </p>
                            </section>

                            <section id="contact" className="mb-16 scroll-mt-32">
                                <div className="bg-amber-400 p-10 rounded-[2.5rem] shadow-xl shadow-amber-400/20 text-[#003B2D]">
                                    <h3 className="text-2xl font-black mb-4 tracking-tight">Privacy Inquiries</h3>
                                    <p className="font-bold mb-6 opacity-80 leading-relaxed">
                                        If you have any questions or concerns about this policy or or our privacy practices, our legal team is ready to assist.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                                            <span className="text-2xl">📧</span>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Legal Team</p>
                                                <p className="font-black">privacy@jahanimart.com</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Gradient for Page End */}
            <div className="h-24 bg-linear-to-b from-transparent to-gray-50"></div>
        </div>
    );
};

export default PrivacyPolicy;
