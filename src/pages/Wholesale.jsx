import React, { useState } from 'react';
import SEO from '../components/SEO';

const Wholesale = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        businessName: '',
        phoneNumber: '',
        invoicingAddress: '',
        deliveryAddress: '',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReset = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            businessName: '',
            phoneNumber: '',
            invoicingAddress: '',
            deliveryAddress: '',
            notes: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center px-4 py-24">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,103,79,0.15)] p-10 text-center border border-gray-50 transform hover:scale-[1.02] transition-transform duration-500">
                    <div className="w-24 h-24 bg-green-50 text-[#00674F] rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner animate-bounce">
                        ✓
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-4 font-heading tracking-tight">Application Sent!</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                        Your partnership request has been received. Our wholesale team will review your application and contact you within 48 hours with next steps.
                    </p>
                    <button
                        onClick={() => setIsSubmitted(false)}
                        className="w-full bg-[#033025] text-white py-5 rounded-2xl font-bold hover:bg-[#005440] transition-all shadow-lg hover:shadow-[#00674F]/40 active:scale-95 uppercase tracking-widest text-sm"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-24 selection:bg-[#00674F] selection:text-white">
            <SEO
                title="Wholesale Partnership - Jahani Mart"
                description="Apply for our exclusive wholesale program. Premium benefits for business partners."
            />

            {/* Premium Header */}
            <div className="relative pt-32 pb-48 overflow-hidden bg-[#00674F]">
                {/* Abstract background shapes */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[70%] bg-white/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] right-[-5%] w-[40%] h-[60%] bg-amber-400/20 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                        B2B Excellence
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-8 font-heading tracking-tight drop-shadow-sm">
                        Wholesale <span className="text-amber-400">Sign Up</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-white/80 leading-relaxed text-lg md:text-xl font-medium px-4">
                        Submit your application to gain access to exclusive pricing and bulk inventory.
                        Our team will endeavour to respond within <span className="text-white font-bold border-b-2 border-amber-400 pb-0.5">48hrs</span>.
                    </p>
                </div>

                {/* Modern Wave bottom divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                    <svg className="relative block w-full h-12 md:h-20 fill-[#FDFCFB] leading-0" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.43,147.3,126,211.52,111.59,269.83,98.53,279.19,64.28,321.39,56.44Z"></path>
                    </svg>
                </div>
            </div>

            <div className="max-w-5xl mx-auto -mt-32 px-6 relative z-20">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] p-8 md:p-14 border border-white overflow-hidden"
                >
                    {/* Interior decorative gradient */}
                    <div className="absolute top-0 right-0 w-full h-1 bg-linear-to-r from-transparent via-[#00674F]/20 to-transparent"></div>

                    <div className="mb-12 border-b border-gray-50 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 mb-1">Business Credentials</h2>
                            <p className="text-sm text-gray-400">Please provide your legal business information.</p>
                        </div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold bg-gray-50 h-fit px-3 py-1 rounded-full border border-gray-100">
                            STEP 01/03
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-12">
                        {/* First Name */}
                        <div className="group">
                            <label className="block text-[11px] font-black uppercase tracking-[0.1em] text-black mb-2 transition-colors group-focus-within:text-[#00674F]">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter First Name"
                                className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-100 focus:border-[#00674F] outline-none transition-all duration-300 font-bold text-gray-900 placeholder:text-gray-300"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="group">
                            <label className="block text-[11px] font-black uppercase tracking-[0.1em] text-black mb-2 transition-colors group-focus-within:text-[#00674F]">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter Last Name"
                                className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-100 focus:border-[#00674F] outline-none transition-all duration-300 font-bold text-gray-900 placeholder:text-gray-300"
                            />
                        </div>

                        {/* Email */}
                        <div className="group">
                            <label className="block text-[11px] font-black uppercase tracking-[0.1em] text-black mb-2 transition-colors group-focus-within:text-[#00674F]">
                                Business Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@business.com"
                                className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-100 focus:border-[#00674F] outline-none transition-all duration-300 font-bold text-gray-900 placeholder:text-gray-300"
                            />
                        </div>

                        {/* Business Name */}
                        <div className="group">
                            <label className="block text-[11px] font-black uppercase tracking-[0.1em] text-black mb-2 transition-colors group-focus-within:text-[#00674F]">Company Legal Name</label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                placeholder="e.g. Jahani Mart Pvt Ltd"
                                className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-100 focus:border-[#00674F] outline-none transition-all duration-300 font-bold text-gray-900 placeholder:text-gray-300"
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="group">
                            <label className="block text-[11px] font-black uppercase tracking-[0.1em] text-black mb-2 transition-colors group-focus-within:text-[#00674F]">Direct Phone Line</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter Phone Number"
                                className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-100 focus:border-[#00674F] outline-none transition-all duration-300 font-bold text-gray-900 placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="mb-12 border-b border-gray-50 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 mb-1">Logistics & Support</h2>
                            <p className="text-sm text-gray-400">Specify your preferred addresses for billing and shipments.</p>
                        </div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold bg-gray-50 h-fit px-3 py-1 rounded-full border border-gray-100">
                            STEP 02/03
                        </div>
                    </div>

                    {/* Invoicing Address */}
                    <div className="mb-10 group">
                        <label className="block text-[11px] font-black uppercase tracking-[0.1em] text-black mb-2 transition-colors group-focus-within:text-[#00674F]">
                            Registered Invoicing Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="invoicingAddress"
                            required
                            value={formData.invoicingAddress}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Enter Complete Invoicing Address"
                            className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-100 focus:border-[#00674F] outline-none transition-all duration-300 font-bold text-gray-900 placeholder:text-gray-300 resize-none"
                        ></textarea>
                    </div>

                    {/* Delivery Address */}
                    <div className="mb-12 group">
                        <label className="block text-[11px] font-black uppercase tracking-[0.1em] text-black mb-2 transition-colors group-focus-within:text-[#00674F]">
                            Primary Warehouse/Delivery Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="deliveryAddress"
                            required
                            value={formData.deliveryAddress}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Enter Cargo / Delivery Destination"
                            className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-100 focus:border-[#00674F] outline-none transition-all duration-300 font-bold text-gray-900 placeholder:text-gray-300 resize-none"
                        ></textarea>
                    </div>

                    <div className="mb-12 border-b border-gray-50 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 mb-1">Additional Insight</h2>
                            <p className="text-sm text-gray-400">Anything else we should know about your business model?</p>
                        </div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold bg-gray-50 h-fit px-3 py-1 rounded-full border border-gray-100">
                            STEP 03/03
                        </div>
                    </div>

                    {/* Application Notes */}
                    <div className="mb-14 group">
                        <label className="block text-[11px] font-black uppercase tracking-[0.1em] text-black mb-2 transition-colors group-focus-within:text-[#00674F]">Strategic Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Type any specific requirements here..."
                            className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-100 focus:border-[#00674F] outline-none transition-all duration-300 font-bold text-gray-900 placeholder:text-gray-300 resize-none"
                        ></textarea>
                    </div>

                    {/* Pro Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex-1 py-5 px-8 bg-amber-400 text-[#00674F] rounded-2xl font-black hover:bg-amber-500 transition-all shadow-lg hover:shadow-amber-400/20 uppercase tracking-widest text-xs active:scale-95"
                        >
                            Reset Form
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-2 py-5 px-8 bg-[#00674F] text-white rounded-2xl font-black hover:bg-[#005440] transition-all shadow-2xl shadow-[#00674F]/20 uppercase tracking-[0.2em] text-xs disabled:opacity-50 active:scale-95"
                        >
                            {isSubmitting ? 'Processing...' : 'Submit Partnership Application'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Bottom Trust Section */}
            <div className="max-w-5xl mx-auto mt-20 px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-4xl border border-gray-50 text-center shadow-sm">
                        <div className="text-2xl mb-3">💎</div>
                        <h4 className="font-black text-gray-900 mb-2">Tiered Discounts</h4>
                        <p className="text-xs text-gray-400 leading-relaxed font-medium">The more you buy, the more you save with our transparent volume pricing.</p>
                    </div>
                    <div className="bg-white p-8 rounded-4xl border border-gray-50 text-center shadow-sm">
                        <div className="text-2xl mb-3">⚡</div>
                        <h4 className="font-black text-gray-900 mb-2">Priority Shipping</h4>
                        <p className="text-xs text-gray-400 leading-relaxed font-medium">Wholesale partners get front-of-line fulfillment and dedicated logistics.</p>
                    </div>
                    <div className="bg-white p-8 rounded-4xl border border-gray-50 text-center shadow-sm">
                        <div className="text-2xl mb-3">🤝</div>
                        <h4 className="font-black text-gray-900 mb-2">Personal Manager</h4>
                        <p className="text-xs text-gray-400 leading-relaxed font-medium">Get a dedicated account manager for custom blends and large inquiries.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wholesale;
