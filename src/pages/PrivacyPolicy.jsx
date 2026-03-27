import React from 'react';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
            <SEO title="Privacy Policy" description="Jahani Mart Privacy Policy - Learn how we collect, use, and protect your personal information." url="https://jahani-mart.onrender.com/privacy" />
            <h1 className="text-4xl font-serif font-bold mb-8 text-[#00674F]">Privacy Policy</h1>
            <section className="space-y-6">
                <p>At Jahani Mart, your privacy is our top priority. This policy outlines how we collect, use, and protect your personal information.</p>
                
                <h2 className="text-2xl font-bold mt-8">1. Information We Collect</h2>
                <p>We may collect personal details such as your name, email address, and shipping address when you make a purchase or sign up for our newsletter.</p>
                
                <h2 className="text-2xl font-bold mt-8">2. How We Use Information</h2>
                <p>We use your information to process orders, provide customer support, and improve your shopping experience.</p>
                
                <h2 className="text-2xl font-bold mt-8">3. Data Protection</h2>
                <p>We employ advanced security measures to ensure your data is safe and secure. We do not sell or share your personal information with third parties.</p>
                
                <h2 className="text-2xl font-bold mt-8">4. Cookies</h2>
                <p>Our website uses cookies to enhance user experience and analyze traffic.</p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
