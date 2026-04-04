import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import { Link, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import SEO from '../components/SEO';

const Checkout = () => {
    const { cart, fetchCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const { formatPrice } = useLocale();
    const navigate = useNavigate();
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState('');
    const [processing, setProcessing] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user?.username || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        payment_method: 'COD'
    });

    // Payment details state
    const [cardDetails, setCardDetails] = useState({
        card_number: '',
        card_holder: user?.username ? user.username.toUpperCase() : '',
        expiry_month: '',
        expiry_year: '',
        cvv: '',
        bank: ''
    });
    const [upiId, setUpiId] = useState('');
    const [cardErrors, setCardErrors] = useState({});
    const [upiError, setUpiError] = useState('');
    const [codCaptchaVal, setCodCaptchaVal] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaError, setCaptchaError] = useState('');

    const generateCaptcha = () => {
        const val = Math.floor(100 + Math.random() * 900).toString();
        setCodCaptchaVal(val);
        setCaptchaInput('');
        setCaptchaError('');
    };

    useEffect(() => {
        if (formData.payment_method === 'COD') {
            generateCaptcha();
        }
    }, [formData.payment_method]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchAddresses();
        }
    }, [isAuthenticated]);

    const fetchAddresses = async () => {
        try {
            const response = await api.get('/addresses/');
            setAddresses(response.data);
            // Select default address if exists
            const defaultAddr = response.data.find(a => a.is_default);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
            } else if (response.data.length > 0) {
                setSelectedAddressId(response.data[0].id);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoadingAddresses(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center pt-24 px-4 font-sans">
                <style>{`
                    @keyframes popIn {
                        0% { transform: scale(0.5); opacity: 0; }
                        70% { transform: scale(1.05); opacity: 1; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes popTop { 0% { top: 50%; left: 50%; opacity:0; } 40% { opacity: 1; } 100% { top: -15%; left: 50%; opacity: 0; } }
                    @keyframes popRight { 0% { top: 50%; left: 50%; opacity:0;} 40% { opacity: 1; } 100% { top: 50%; left: 115%; opacity: 0; } }
                    @keyframes popBottom { 0% { top: 50%; left: 50%; opacity:0;} 40% { opacity: 1; } 100% { top: 115%; left: 50%; opacity: 0; } }
                    @keyframes popLeft { 0% { top: 50%; left: 50%; opacity:0;} 40% { opacity: 1; } 100% { top: 50%; left: -15%; opacity: 0; } }
                    @keyframes popTopRight { 0% { top: 50%; left: 50%; opacity:0;} 40% { opacity: 1; } 100% { top: 5%; left: 95%; opacity: 0; } }
                    @keyframes popTopLeft { 0% { top: 50%; left: 50%; opacity:0;} 40% { opacity: 1; } 100% { top: 5%; left: 5%; opacity: 0; } }
                    @keyframes popBottomRight { 0% { top: 50%; left: 50%; opacity:0;} 40% { opacity: 1; } 100% { top: 95%; left: 95%; opacity: 0; } }
                    @keyframes popBottomLeft { 0% { top: 50%; left: 50%; opacity:0;} 40% { opacity: 1; } 100% { top: 95%; left: 5%; opacity: 0; } }
                    
                    .success-icon { animation: popIn 0.5s ease-out forwards; }
                    .dot { position: absolute; width: 10px; height: 10px; border-radius: 50%; transform: translate(-50%, -50%); opacity: 0; z-index: 10; }
                    .dot-1 { background: #34A853; animation: popTop 0.8s ease-out 0.2s forwards; }
                    .dot-2 { background: #EA4335; animation: popTopRight 0.8s ease-out 0.2s forwards; }
                    .dot-3 { background: #FBBC05; animation: popRight 0.8s ease-out 0.2s forwards; }
                    .dot-4 { background: #4285F4; animation: popBottomRight 0.8s ease-out 0.2s forwards; }
                    .dot-5 { background: #34A853; animation: popBottom 0.8s ease-out 0.2s forwards; }
                    .dot-6 { background: #EA4335; animation: popBottomLeft 0.8s ease-out 0.2s forwards; }
                    .dot-7 { background: #FBBC05; animation: popLeft 0.8s ease-out 0.2s forwards; }
                    .dot-8 { background: #4285F4; animation: popTopLeft 0.8s ease-out 0.2s forwards; }
                `}</style>
                <div className="relative w-32 h-32 mb-6">
                    <div className="dot dot-1"></div>
                    <div className="dot dot-2"></div>
                    <div className="dot dot-3"></div>
                    <div className="dot dot-4"></div>
                    <div className="dot dot-5"></div>
                    <div className="dot dot-6"></div>
                    <div className="dot dot-7"></div>
                    <div className="dot dot-8"></div>
                    
                    <div className="absolute inset-0 bg-green-50 rounded-full flex items-center justify-center success-icon z-20">
                        <div className="w-24 h-24 bg-[#1fbc21] rounded-full flex items-center justify-center shadow-xs text-white">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1fbc21] mb-3 text-center tracking-tight">Order Placed Successfully</h2>
                <p className="text-gray-500 text-center max-w-md mb-10 leading-relaxed">
                    Your order <span className="font-medium text-gray-700">#{placedOrderId}</span> has been confirmed. You will receive an update shortly.
                </p>
                
                <div className="w-full max-w-md flex flex-col space-y-4">
                    <Link to="/orders?section=orders" className="w-full bg-[#24b2a3] text-white text-center py-3.5 rounded font-medium shadow-sm hover:bg-[#1e9a8d] transition-colors">
                        View Orders
                    </Link>
                    <Link to="/" className="w-full bg-white text-[#24b2a3] text-center border-2 border-[#24b2a3] py-3.5 rounded font-medium hover:bg-teal-50 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Sign in to checkout</h2>
                    <p className="text-gray-500 mb-6">Please sign in to complete your purchase</p>
                    <Link to="/login" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
                    <Link to="/" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Card number formatting (XXXX XXXX XXXX XXXX)
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : v;
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'card_number') {
            formattedValue = formatCardNumber(value);
            if (formattedValue.length > 19) return;
        } else if (name === 'expiry_month' || name === 'expiry_year') {
            if (value.length > 2) return;
            if (!/^\d*$/.test(value)) return;
        } else if (name === 'cvv') {
            if (value.length > 4) return;
            if (!/^\d*$/.test(value)) return;
        }

        setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
        setCardErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleUpiChange = (e) => {
        const value = e.target.value;
        // Allow only valid UPI format: username@upi
        const upiRegex = /^[a-zA-Z0-9.@_-]*$/;
        if (value === '' || upiRegex.test(value)) {
            setUpiId(value);
            setUpiError('');
        }
    };

    const validateCard = () => {
        const errors = {};
        const cleanCardNumber = cardDetails.card_number.replace(/\s/g, '');

        if (!cardDetails.bank) {
            errors.bank = 'Please select a bank';
        }

        if (!cleanCardNumber) {
            errors.card_number = 'Card number is required';
        } else if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
            errors.card_number = 'Invalid card number';
        } else if (!/^\d+$/.test(cleanCardNumber)) {
            errors.card_number = 'Card number must contain only digits';
        }

        if (!cardDetails.card_holder) {
            errors.card_holder = 'Card holder name is required';
        }

        if (!cardDetails.expiry_month || !cardDetails.expiry_year) {
            errors.expiry = 'Expiry date is required';
        } else {
            const month = parseInt(cardDetails.expiry_month);
            const year = parseInt(cardDetails.expiry_year);
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;

            if (month < 1 || month > 12) {
                errors.expiry = 'Invalid month';
            } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                errors.expiry = 'Card expired';
            }
        }

        if (!cardDetails.cvv) {
            errors.cvv = 'CVV is required';
        } else if (cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) {
            errors.cvv = 'Invalid CVV';
        }

        setCardErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateUpi = () => {
        if (!upiId) {
            setUpiError('UPI ID is required');
            return false;
        }
        // Basic UPI format validation
        const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
        if (!upiRegex.test(upiId)) {
            setUpiError('Invalid UPI ID format (e.g., name@upi)');
            return false;
        }
        return true;
    };

    const handleAddAddressAndContinue = async () => {
        if (!formData.full_name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await api.post('/addresses/', {
                name: formData.full_name,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                address_type: 'Home',
                is_default: addresses.length === 0
            });
            setAddresses([...addresses, response.data]);
            setSelectedAddressId(response.data.id);
            setShowAddAddress(false);
        } catch (error) {
            console.error('Error adding address:', error);
            alert('Failed to add address');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedAddressId) {
            alert('Please select or add a delivery address');
            return;
        }

        // Validate payment details
        if (formData.payment_method === 'Card') {
            const isValidCard = validateCard();
            if (!isValidCard) {
                return;
            }
        }

        if (formData.payment_method === 'UPI') {
            const isValidUpi = validateUpi();
            if (!isValidUpi) {
                return;
            }
        }

        if (formData.payment_method === 'COD') {
            if (captchaInput !== codCaptchaVal) {
                setCaptchaError('Text does not match. Please try again.');
                return;
            }
        }

        setProcessing(true);
        try {
            const orderData = {
                address_id: selectedAddressId,
                payment_method: formData.payment_method
            };

            // Include payment details (for demo purposes - in production, use payment gateway)
            if (formData.payment_method === 'Card') {
                orderData.card_last_four = cardDetails.card_number.replace(/\s/g, '').slice(-4);
            } else if (formData.payment_method === 'UPI') {
                orderData.upi_id = upiId;
            }

            const response = await api.post('/orders/create/', orderData);

            await fetchCart();
            setPlacedOrderId(response.data.order_id);
            setOrderSuccess(true);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setProcessing(false);
        }
    };



    return (
        <div className="min-h-screen bg-gray-100 py-4">
            <SEO noindex title="Checkout" />
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-3 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-yellow-400 px-2 py-1 rounded">
                            <span className="text-xl font-bold text-gray-900">J</span>
                        </div>
                        <span className="text-lg font-medium text-gray-700">International</span>
                    </Link>
                    <div className="text-sm text-gray-600">
                        Secure Checkout
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Login Info */}
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-gray-700 uppercase">1. Login</h2>
                                    <span className="text-green-600 text-sm">✓</span>
                                </div>
                                <div className="mt-2 pl-6">
                                    <p className="text-sm text-gray-600">{user?.email || user?.username}</p>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-bold text-gray-700 uppercase">2. Delivery Address</h2>
                                </div>

                                {loadingAddresses ? (
                                    <div className="text-center py-4">
                                        <div className="inline-block w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : showAddAddress ? (
                                    <div className="pl-6 space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <input
                                                    type="text"
                                                    name="full_name"
                                                    value={formData.full_name}
                                                    onChange={handleChange}
                                                    placeholder="Full Name *"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="Mobile Number *"
                                                    maxLength={10}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    placeholder="Address (Area, Street, etc.) *"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    placeholder="City *"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    placeholder="State *"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    value={formData.pincode}
                                                    onChange={handleChange}
                                                    placeholder="Pincode *"
                                                    maxLength={6}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Email *"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleAddAddressAndContinue}
                                                className="px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-medium rounded-lg hover:bg-yellow-500"
                                            >
                                                Save & Continue
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddAddress(false)}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="pl-6">
                                        {addresses.length > 0 ? (
                                            <div className="space-y-3 mb-4">
                                                {addresses.map(address => (
                                                    <label
                                                        key={address.id}
                                                        className={`flex items-start p-3 border rounded-lg cursor-pointer ${selectedAddressId === address.id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="address"
                                                            checked={selectedAddressId === address.id}
                                                            onChange={() => setSelectedAddressId(address.id)}
                                                            className="mt-1"
                                                        />
                                                        <div className="ml-3">
                                                            <p className="text-sm font-medium text-gray-800">
                                                                {address.name} • {address.phone}
                                                                {address.is_default && <span className="ml-2 text-xs text-green-600">(Default)</span>}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                {address.address}, {address.city}, {address.state} - {address.pincode}
                                                            </p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 mb-4">No saved addresses</p>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => setShowAddAddress(true)}
                                            className="text-sm text-blue-600 font-medium hover:underline"
                                        >
                                            + Add new address
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <h2 className="text-sm font-bold text-gray-700 uppercase mb-3">3. Payment Method</h2>
                                <div className="space-y-2 pl-6">
                                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${formData.payment_method === 'COD' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="COD"
                                            checked={formData.payment_method === 'COD'}
                                            onChange={handleChange}
                                            className="text-yellow-500"
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-800">Cash on Delivery (COD)</span>
                                    </label>
                                    
                                    {/* COD Captcha Form */}
                                    {formData.payment_method === 'COD' && (
                                        <div className="ml-6 mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="space-y-3">
                                                <p className="text-xs text-gray-600">Please enter the characters below to confirm your order</p>
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <div className="bg-white border border-gray-300 rounded px-4 py-2 font-mono text-lg tracking-widest select-none relative overflow-hidden flex items-center justify-center min-w-[80px]">
                                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-gray-200 to-transparent opacity-50 transform -skew-x-12"></div>
                                                        <span className="relative z-10 font-bold italic line-through decoration-gray-400 opacity-80 text-gray-800">{codCaptchaVal}</span>
                                                    </div>
                                                    <button type="button" onClick={generateCaptcha} className="text-blue-600 text-xs hover:underline bg-transparent border-none">
                                                        ⟳ Refresh
                                                    </button>
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={captchaInput}
                                                        onChange={(e) => {
                                                            setCaptchaInput(e.target.value);
                                                            setCaptchaError('');
                                                        }}
                                                        placeholder="Enter characters"
                                                        className={`w-full max-w-[150px] px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${captchaError ? 'border-red-400' : 'border-gray-300'}`}
                                                    />
                                                    {captchaError && (
                                                        <p className="text-xs text-red-500 mt-1">{captchaError}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${formData.payment_method === 'UPI' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="UPI"
                                            checked={formData.payment_method === 'UPI'}
                                            onChange={handleChange}
                                            className="text-yellow-500"
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-800">UPI / Google Pay / PhonePe</span>
                                    </label>
                                    {/* UPI Payment Form */}
                                    {formData.payment_method === 'UPI' && (
                                        <div className="ml-6 mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Enter your UPI ID
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={upiId}
                                                        onChange={handleUpiChange}
                                                        placeholder="e.g., mobilenumber@upi"
                                                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${upiError ? 'border-red-400' : 'border-gray-300'}`}
                                                    />
                                                    {upiError && (
                                                        <p className="text-xs text-red-500 mt-1">{upiError}</p>
                                                    )}
                                                    <p className="text-xs text-gray-500 mt-1">Example: john@oksbi, john@okhdfcbank</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-green-600">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Secure UPI Payment
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${formData.payment_method === 'Card' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="Card"
                                            checked={formData.payment_method === 'Card'}
                                            onChange={handleChange}
                                            className="text-yellow-500"
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-800">Debit / Credit Card</span>
                                    </label>
                                    {/* Card Payment Form */}
                                    {formData.payment_method === 'Card' && (
                                        <div className="ml-6 mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="space-y-3">
                                                {/* Bank Selection */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Select Bank
                                                    </label>
                                                    <select
                                                        name="bank"
                                                        value={cardDetails.bank || ''}
                                                        onChange={handleCardChange}
                                                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${cardErrors.bank ? 'border-red-400' : 'border-gray-300'}`}
                                                    >
                                                        <option value="">-- Select Bank --</option>
                                                        <option value="SBI">State Bank of India (SBI)</option>
                                                        <option value="HDFC">HDFC Bank</option>
                                                        <option value="ICICI">ICICI Bank</option>
                                                        <option value="Axis">Axis Bank</option>
                                                        <option value="Kotak">Kotak Mahindra Bank</option>
                                                        <option value="Yes Bank">Yes Bank</option>
                                                        <option value="Punjab National">Punjab National Bank</option>
                                                        <option value="Canara">Canara Bank</option>
                                                        <option value="Bank of Baroda">Bank of Baroda</option>
                                                        <option value="IDBI">IDBI Bank</option>
                                                        <option value="Other">Other Banks</option>
                                                    </select>
                                                    {cardErrors.bank && (
                                                        <p className="text-xs text-red-500 mt-1">{cardErrors.bank}</p>
                                                    )}
                                                </div>
                                                {/* Card Number */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Card Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="card_number"
                                                        value={cardDetails.card_number}
                                                        onChange={handleCardChange}
                                                        placeholder="Enter card number"
                                                        maxLength={19}
                                                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${cardErrors.card_number ? 'border-red-400' : 'border-gray-300'}`}
                                                    />
                                                    {cardErrors.card_number && (
                                                        <p className="text-xs text-red-500 mt-1">{cardErrors.card_number}</p>
                                                    )}
                                                </div>
                                                {/* Card Holder Name */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Card Holder Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="card_holder"
                                                        value={cardDetails.card_holder}
                                                        onChange={handleCardChange}
                                                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 uppercase ${cardErrors.card_holder ? 'border-red-400' : 'border-gray-300'}`}
                                                    />
                                                    {cardErrors.card_holder && (
                                                        <p className="text-xs text-red-500 mt-1">{cardErrors.card_holder}</p>
                                                    )}
                                                </div>
                                                {/* Expiry and CVV */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                                            Expiry (MM/YY)
                                                        </label>
                                                        <div className="flex gap-1">
                                                            <input
                                                                type="text"
                                                                name="expiry_month"
                                                                value={cardDetails.expiry_month}
                                                                onChange={handleCardChange}
                                                                placeholder="MM"
                                                                maxLength={2}
                                                                className={`w-full px-2 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${cardErrors.expiry ? 'border-red-400' : 'border-gray-300'}`}
                                                            />
                                                            <span className="text-gray-400 self-center">/</span>
                                                            <input
                                                                type="text"
                                                                name="expiry_year"
                                                                value={cardDetails.expiry_year}
                                                                onChange={handleCardChange}
                                                                placeholder="YY"
                                                                maxLength={2}
                                                                className={`w-full px-2 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${cardErrors.expiry ? 'border-red-400' : 'border-gray-300'}`}
                                                            />
                                                        </div>
                                                        {cardErrors.expiry && (
                                                            <p className="text-xs text-red-500 mt-1">{cardErrors.expiry}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                                            CVV
                                                        </label>
                                                        <input
                                                            type="password"
                                                            name="cvv"
                                                            value={cardDetails.cvv}
                                                            onChange={handleCardChange}
                                                            maxLength={4}
                                                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${cardErrors.cvv ? 'border-red-400' : 'border-gray-300'}`}
                                                        />
                                                        {cardErrors.cvv && (
                                                            <p className="text-xs text-red-500 mt-1">{cardErrors.cvv}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-green-600">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Secure Card Payment
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                                <h2 className="text-sm font-bold text-gray-700 uppercase mb-4">Order Summary</h2>

                                {/* Price Details */}
                                <div className="border-b pb-3 mb-3">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Price ({cart.total_items} items)</span>
                                        <span>{formatPrice(cart.total_price)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Delivery</span>
                                        <span className="text-green-600">FREE</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-base font-bold mb-4">
                                    <span>Total Amount</span>
                                    <span>{formatPrice(cart.total_price)}</span>
                                </div>

                                {/* Cart Items Preview */}
                                <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                                    {cart.items.map((item) => (
                                        <div key={item.id} className="flex gap-2">
                                            <div className="w-14 h-14 shrink-0 bg-gray-50 rounded flex items-center justify-center">
                                                <img
                                                    src={getImageUrl(item.product_image) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTIiBmaWxsPSIjOTk5Ij5JbWFnZTwvdGV4dD48L3N2Zz4='}
                                                    alt={item.product_name}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-800 line-clamp-2">{item.product_name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                <p className="text-sm font-bold text-gray-900">{formatPrice(item.quantity * parseFloat(item.product_price))}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !selectedAddressId}
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Place Order
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-2">
                                    Safe and Secure Payments. Easy returns.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
