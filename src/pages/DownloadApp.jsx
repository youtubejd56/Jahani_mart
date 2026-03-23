import React from 'react';

const DownloadApp = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                        Download Our App
                    </h1>
                    <p className="text-lg text-gray-600">
                        Get the best shopping experience on your mobile device
                    </p>
                </div>

                {/* App Features */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Why Download Our App?
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-[#00674F] text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Fast Shopping</h3>
                                <p className="text-gray-600 text-sm">Quick and easy way to browse and purchase products</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-[#00674F] text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Push Notifications</h3>
                                <p className="text-gray-600 text-sm">Stay updated with exclusive deals and offers</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-[#00674F] text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Easy Cart Management</h3>
                                <p className="text-gray-600 text-sm">Manage your shopping cart with ease</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-[#00674F] text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Secure Payments</h3>
                                <p className="text-gray-600 text-sm">Safe and secure payment options</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Download Buttons */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Choose Your Platform
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        {/* Android Button */}
                        <button
                            onClick={() => window.open('#', '_blank')}
                            className="flex items-center justify-center gap-4 bg-[#00674F] hover:bg-[#005440] text-white px-8 py-5 rounded-xl transition-all hover:scale-105 shadow-lg"
                        >
                            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.609-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z" />
                            </svg>
                            <div className="text-left">
                                <p className="text-xs opacity-80">Download for</p>
                                <p className="font-bold text-xl">Android</p>
                                <p className="text-xs opacity-70">Google Play Store</p>
                            </div>
                        </button>
                        {/* iOS Button */}
                        <button
                            onClick={() => window.open('#', '_blank')}
                            className="flex items-center justify-center gap-4 bg-gray-900 hover:bg-gray-800 text-white px-8 py-5 rounded-xl transition-all hover:scale-105 shadow-lg"
                        >
                            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.48 2.83zm-3.13-14.5c.72-.87 1.21-2.08 1.07-3.29-1.04.05-2.29.7-3.04 1.57-.67.78-1.26 2.04-1.1 3.22 1.16.09 2.34-.64 3.07-1.5z" />
                            </svg>
                            <div className="text-left">
                                <p className="text-xs opacity-80">Download for</p>
                                <p className="font-bold text-xl">iOS</p>
                                <p className="text-xs opacity-70">App Store</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Installation Instructions */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        How to Install
                    </h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="bg-amber-400 text-[#00674F] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                                1
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Click the Download Button</h3>
                                <p className="text-gray-600 text-sm">Choose your device platform (Android or iOS) and click the download button above</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-amber-400 text-[#00674F] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                                2
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Visit the App Store</h3>
                                <p className="text-gray-600 text-sm">You will be redirected to Google Play Store (Android) or App Store (iOS)</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-amber-400 text-[#00674F] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                                3
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Install the App</h3>
                                <p className="text-gray-600 text-sm">Click "Install" (Android) or "Get" (iOS) to download and install the app</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-amber-400 text-[#00674F] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                                4
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Open & Enjoy</h3>
                                <p className="text-gray-600 text-sm">Open the app and start shopping with the best experience</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Requirements */}
                <div className="mt-8 text-center text-gray-600">
                    <p className="text-sm">
                        <strong>Requirements:</strong> Android 6.0+ or iOS 12.0+
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DownloadApp;
