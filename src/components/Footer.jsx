import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-bold text-lg mb-2">About</h4>
                    <ul className="flex flex-col gap-2 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                    </ul>
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-bold text-lg mb-2">Help</h4>
                    <ul className="flex flex-col gap-2 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">Payments</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Cancellation & Returns</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                    </ul>
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-bold text-lg mb-2">Social</h4>
                    <ul className="flex flex-col gap-2 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
                    </ul>
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-bold text-lg mb-2">Contact & Office</h4>
                    <div className="text-sm flex flex-col gap-1">
                        <p className="font-semibold text-gray-100">Jahani International Pvt Ltd</p>
                        <p>support@jahmart.com</p>
                        <hr className="my-2 border-gray-800" />
                        <p className="font-semibold text-gray-100">Registered Office</p>
                        <p>Jahani Mart</p>
                        <p>New Delhi, India</p>
                    </div>
                </div>
            </div>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
                <p>© 2026 Jahani International. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
