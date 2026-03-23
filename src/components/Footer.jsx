import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-gray-300 flex flex-col font-sans mt-auto">
            {/* Main content container */}
            <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-12 py-12 lg:py-16 flex flex-col lg:flex-row gap-12 lg:gap-8 justify-between">

                {/* Logo & Socials Left Column */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/4 mb-4 lg:mb-0">
                    <div className="flex flex-col items-center lg:items-start mb-2 lg:mb-6">
                        {/* We use the logo path from Header but slightly larger for footer */}
                        <div className="bg-white w-24 h-auto rounded-t-full rounded-b-xl px-4 pt-6 pb-2 flex items-center justify-center border-4 border-slate-950 shadow-sm mb-4 relative z-10 -mt-10 lg:mt-0">
                            <img
                                src="/manu ettn logo .png"
                                alt="Jahani Mart Logo"
                                className="w-full object-contain mx-auto"
                            />
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-white leading-tight flex flex-col items-center lg:items-start">
                            <span>Jahani</span>
                            <span className="text-amber-400">Mart</span>
                        </h2>
                    </div>

                    {/* Mobile divider line as requested in the design */}
                    <div className="w-16 h-px bg-slate-700 mx-auto my-6 lg:hidden"></div>

                    <div className="flex gap-4 justify-center lg:justify-start w-full">
                        <a href="#" className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-[#00674F] hover:text-white transition-colors" aria-label="Facebook">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-[#00674F] hover:text-white transition-colors" aria-label="Twitter">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-[#00674F] hover:text-white transition-colors" aria-label="Instagram">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-[#00674F] hover:text-white transition-colors" aria-label="TikTok">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.61-5.46-.24-3.32 2.22-6.57 5.56-6.68.21-.01.42 0 .63.02v4.06c-.85-.1-1.74.24-2.27.9-.54.67-.65 1.63-.37 2.45.28.84 1.14 1.45 2.05 1.49 1.15.06 2.19-.71 2.48-1.83.18-.7.21-1.42.2-2.14V.02h2.6z" /></svg>
                        </a>
                    </div>
                </div>

                {/* Links Area - 2 columns on mobile, 3 on large */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 lg:w-3/4">
                    {/* Shop Links */}
                    <div>
                    <h3 className="text-white text-2xl font-bold mb-5 font-serif">Shop</h3>
                    <ul className="flex flex-col gap-2.5">
                        <li><Link to="/products?category=fashion" className="hover:text-amber-400 transition-colors">Fashion Collection</Link></li>
                        <li><Link to="/products?category=electronics" className="hover:text-amber-400 transition-colors">Electronics Hub</Link></li>
                        <li><Link to="/products?category=home" className="hover:text-amber-400 transition-colors">Home & Kitchen</Link></li>
                        <li><Link to="/products" className="hover:text-amber-400 transition-colors">All Products</Link></li>
                        <li><Link to="#" className="hover:text-amber-400 transition-colors">Special Offers</Link></li>
                    </ul>
                </div>

                {/* Combines Company and Information in one column on large screens to mimic 4 columns, or we can use 3 link columns */}
                <div className="flex flex-col gap-8">
                    <div>
                        <h3 className="text-white text-2xl font-bold mb-5 font-serif">Company</h3>
                        <ul className="flex flex-col gap-2.5">
                            <li><Link to="/our-story" className="hover:text-amber-400 transition-colors">Our Story</Link></li>
                            <li><Link to="/blog" className="hover:text-amber-400 transition-colors">Blog</Link></li>
                            <li><Link to="#" className="hover:text-amber-400 transition-colors">FAQ</Link></li>
                            <li><Link to="/support" className="hover:text-amber-400 transition-colors">Contact Form</Link></li>
                        </ul>
                    </div>

                        <div>
                            <h3 className="text-white text-2xl font-bold mb-5 font-serif">Information</h3>
                            <ul className="flex flex-col gap-2.5">
                                <li><Link to="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
                                <li><Link to="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                                <li><Link to="#" className="hover:text-amber-400 transition-colors">Wholesale Application</Link></li>
                            </ul>
                        </div>
                </div>

                {/* Contact Column - spans full width below on mobile, single col on desktop */}
                <div className="col-span-2 lg:col-span-1 border-t border-slate-800 pt-8 lg:border-0 lg:pt-0">
                    <h3 className="text-white text-2xl font-bold mb-5 font-serif">Contact</h3>
                    <div className="flex flex-col gap-1.5 text-base">
                        <p className="hover:text-amber-400 transition-colors cursor-pointer">support@jahmart.com</p>
                        <p className="hover:text-amber-400 transition-colors cursor-pointer">+91 98765 43210 (Monday to</p>
                        <p className="mb-4">Friday 9.00am - 5.00pm)</p>

                        <p className="font-semibold text-white mt-2">Jahani Mart Pvt Ltd,</p>
                        <p>Connaught Place,</p>
                        <p>New Delhi, 110001,</p>
                        <p>India</p>
                    </div>
                </div>
            </div>
            
        </div>

        {/* Trust Badges Section - Mimicking the circular/square awards below */}
            <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-12 py-8 flex flex-wrap justify-center gap-4 border-b border-slate-800">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-slate-700 flex flex-col items-center justify-center bg-black text-center p-1">
                    <span className="text-[10px] sm:text-xs text-white leading-tight">great<br /><strong className="text-xl">taste</strong><br />★ ★<br />2024</span>
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-slate-700 flex flex-col items-center justify-center bg-black text-center p-1">
                    <span className="text-[10px] sm:text-xs text-white leading-tight">great<br /><strong className="text-xl">taste</strong><br />★<br />2025</span>
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white text-slate-900 flex flex-col items-center justify-center text-center p-2 rounded-sm font-serif shadow-sm">
                    <span className="text-[8px] uppercase tracking-wider mb-1 font-bold">Winner</span>
                    <strong className="text-base sm:text-lg leading-none">GIFT</strong>
                    <span className="text-[10px] font-bold">OF THE YEAR</span>
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-slate-900 flex flex-col items-center justify-center text-center p-2 font-serif shadow-sm">
                    <span className="text-[8px] uppercase tracking-wider font-bold">Nominee</span>
                    <strong className="text-sm sm:text-base leading-none my-1">BEST</strong>
                    <span className="text-[10px] font-bold">SELLER</span>
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white text-slate-900 flex flex-col items-center justify-center text-center p-2 border-2 border-[#00674F]">
                    <span className="text-[10px] text-gray-500 mb-1 font-bold">Quality</span>
                    <strong className="text-sm sm:text-md text-[#00674F] uppercase">Assured</strong>
                    <span className="text-[10px] mt-1 font-bold">100% Secure</span>
                </div>
            </div>

            {/* Bottom Bar: Copyright and Payment methods */}
            <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-800">
                <p className="text-xs sm:text-sm text-gray-500">
                    © {new Date().getFullYear()} Jahani Mart™ - Fashion, Electronics, Home & Essentials
                </p>
                <div className="flex flex-wrap gap-2 items-center">
                    {/* Minimalistic text-based payment logos (to match generic ecomm if no SVGs) */}
                    <div className="px-2 py-1 bg-white text-blue-800 text-[10px] font-bold rounded">AMEX</div>
                    <div className="px-2 py-1 bg-white text-black text-[10px] font-bold rounded flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.111 6.556c-1.393-.119-2.001.378-2.678 1.155-.06-.555-.034-1.121-.034-1.155H9.733c.033.466 0 9.177 0 9.177h2.666s-.032-4.144 0-5.833c.355-.733 1.09-1.522 2.055-1.522.045 0 .09 0 .134.011l.523-2.833z" /></svg>
                        Pay
                    </div>
                    <div className="px-2 py-1 bg-white text-blue-600 text-[10px] font-bold rounded italic">Diners</div>
                    <div className="px-2 py-1 bg-white text-red-500 flex items-center h-5 w-8 rounded relative overflow-hidden">
                        <div className="absolute w-4 h-4 bg-red-500 rounded-full left-1 opacity-80" />
                        <div className="absolute w-4 h-4 bg-yellow-500 rounded-full right-1 opacity-80" />
                    </div>
                    <div className="px-2 py-1 bg-white text-[#152e5d] text-[10px] font-bold rounded italic font-serif">PayPal</div>
                    <div className="px-2 py-1 bg-white text-[#5a31f4] text-[10px] font-bold rounded">Shop</div>
                    <div className="px-2 py-1 bg-white text-blue-800 text-[10px] font-bold rounded italic">VISA</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
