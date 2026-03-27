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
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserAddresses = async () => {
            try {
                const response = await api.get('/addresses/');
                setAddresses(response.data);
                if (response.data.length > 0) {
                    setSelectedAddressId(response.data[0].id);
                }
            } catch (error) {
                console.error('Error fetching addresses:', error);
            } finally {
                setLoadingAddresses(false);
            }
        };

        if (isAuthenticated) {
            fetchUserAddresses();
        }
    }, [isAuthenticated]);

    const handleAddressSelect = (addressId) => {
        setSelectedAddressId(addressId);
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            setError('Please login to add address');
            return;
        }

        try {
            const response = await api.post('/addresses/', formData);
            setAddresses([...addresses, response.data]);
            setSelectedAddressId(response.data.id);
            setShowAddAddress(false);
            setError('');
        } catch (error) {
            console.error('Error adding address:', error);
            setError('Failed to add address. Please try again.');
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            setError('Please login to place order');
            return;
        }

        if (!selectedAddressId) {
            setError('Please select a delivery address');
            return;
        }

        if (cart.length === 0) {
            setError('Your cart is empty');
            return;
        }

        setPaymentProcessing(true);
        setError('');

        try {
            const orderData = {
                address_id: selectedAddressId,
                payment_method: paymentMethod,
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity
                }))
            };

            const response = await api.post('/orders/', orderData);
            setOrderId(response.data.id);
            setOrderSuccess(true);
            fetchCart();
            
            // Clear cart after successful order
            setTimeout(() => {
                navigate('/orders');
            }, 2000);
        } catch (error) {
            console.error('Error placing order:', error);
            setError('Failed to place order. Please try again.');
        } finally {
            setPaymentProcessing(false);
        }
    };

    const calculateTotals = () => {
        const subtotal = cart.reduce((sum, item) => {
            return sum + (item.discount_price || item.price) * item.quantity;
        }, 0);

        const shipping = subtotal > 999 ? 0 : 50; // Free shipping over 999
        const tax = subtotal * 0.05; // 5% tax
        const total = subtotal + shipping + tax;

        return { subtotal, shipping, tax, total };
    };

    const totals = calculateTotals();

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-6">
                        Your order has been placed successfully. We've sent a confirmation email to {user?.email}
                    </p>
                    <p className="text-lg font-medium text-gray-800 mb-4">
                        Order ID: #{orderId}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="text-lg font-bold">{formatPrice(totals.total)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">Payment Method</p>
                            <p className="text-lg font-bold">{paymentMethod}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Link
                            to="/orders"
                            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                        >
                            View Order Details
                        </Link>
                        <Link
                            to="/"
                            className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Checkout - Jahani Mart"
                description="Secure checkout process for your online shopping. Multiple payment options available. Fast and reliable delivery across India."
                keywords="online shopping checkout, secure payment, COD, online payment, shopping cart"
                url="https://jahani-mart.onrender.com/checkout"
                type="website"
            />
            
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
                            
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handlePaymentSubmit} className="space-y-6">
                                {/* Shipping Address */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                                    
                                    {addresses.length > 0 && !showAddAddress && (
                                        <div className="space-y-3 mb-4">
                                            {addresses.map((address) => (
                                                <label key={address.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="address"
                                                        value={address.id}
                                                        checked={selectedAddressId === address.id}
                                                        onChange={() => handleAddressSelect(address.id)}
                                                        className="w-4 h-4 text-purple-600"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium">{address.full_name}</p>
                                                        <p className="text-sm text-gray-600">{address.address}, {address.city}, {address.state} - {address.pincode}</p>
                                                        <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    <div className="text-center mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddAddress(!showAddAddress)}
                                            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                        >
                                            {showAddAddress ? 'Cancel' : 'Add New Address'}
                                        </button>
                                    </div>

                                    {showAddAddress && (
                                        <div className="border-t pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Full Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.full_name}
                                                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Phone *
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        PIN Code *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.pincode}
                                                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Address *
                                                    </label>
                                                    <textarea
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        rows={3}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        City *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        State *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.state}
                                                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <button
                                                    type="button"
                                                    onClick={handleAddressSubmit}
                                                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                                                >
                                                    Add Address
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="COD"
                                                checked={paymentMethod === 'COD'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-4 h-4 text-purple-600"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">Cash on Delivery (COD)</p>
                                                <p className="text-sm text-gray-600">Pay cash when you receive your order</p>
                                            </div>
                                        </label>
                                        
                                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="UPI"
                                                checked={paymentMethod === 'UPI'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-4 h-4 text-purple-600"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">UPI Payment</p>
                                                <p className="text-sm text-gray-600">Pay using UPI apps like PhonePe, Google Pay, Paytm</p>
                                            </div>
                                        </label>
                                        
                                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="Card"
                                                checked={paymentMethod === 'Card'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-4 h-4 text-purple-600"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">Credit/Debit Card</p>
                                                <p className="text-sm text-gray-600">Pay securely with your card</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Place Order */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <button
                                        type="submit"
                                        disabled={paymentProcessing || !selectedAddressId}
                                        className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {paymentProcessing ? 'Processing...' : 'Place Order'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                                <div className="space-y-2 mb-4">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={getImageUrl(item.all_image_urls?.[0] || item.image_url)}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium">{item.name}</p>
                                                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium">{formatPrice(item.discount_price || item.price)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Subtotal</span>
                                        <span className="text-sm font-medium">{formatPrice(totals.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Shipping</span>
                                        <span className="text-sm font-medium">{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Tax (5%)</span>
                                        <span className="text-sm font-medium">{formatPrice(totals.tax)}</span>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold">Total</span>
                                        <span className="text-2xl font-bold text-purple-600">{formatPrice(totals.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;