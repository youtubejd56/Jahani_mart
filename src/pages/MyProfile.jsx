import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const MyProfile = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [activeSection, setActiveSection] = useState('profile');
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        address_type: 'Home',
        is_default: false
    });
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [editAddressForm, setEditAddressForm] = useState({});
    const [profileForm, setProfileForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        mobile: ''
    });
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [notificationSettings, setNotificationSettings] = useState({
        order_updates: true,
        promotions: true,
        sms: true,
        email: true
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [walletData, setWalletData] = useState(null);
    const [walletLoading, setWalletLoading] = useState(false);
    const [showAddMoney, setShowAddMoney] = useState(false);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [addMoneyAmount, setAddMoneyAmount] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfileData();
            fetchOrders();
            fetchAddresses();

            const section = searchParams.get('section');
            if (section === 'orders') {
                setActiveSection('orders');
            }
        }
    }, [isAuthenticated, searchParams]);

    const fetchProfileData = async () => {
        try {
            const response = await api.get('/profile/');
            setProfileData(response.data);
            setProfileForm({
                first_name: response.data.user.first_name || '',
                last_name: response.data.user.last_name || '',
                email: response.data.user.email || '',
                mobile: response.data.user.mobile || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await api.get('/addresses/');
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            await api.post('/addresses/', newAddress);
            fetchAddresses();
            fetchProfileData();
            setShowAddAddress(false);
            setNewAddress({
                name: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                pincode: '',
                address_type: 'Home',
                is_default: false
            });
            showMessage('success', 'Address added successfully');
        } catch (error) {
            console.error('Error adding address:', error);
            showMessage('error', 'Failed to add address');
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            await api.delete(`/addresses/${addressId}/`);
            fetchAddresses();
            fetchProfileData();
            showMessage('success', 'Address deleted successfully');
        } catch (error) {
            console.error('Error deleting address:', error);
            showMessage('error', 'Failed to delete address');
        }
    };

    const handleEditAddress = (address) => {
        setEditingAddressId(address.id);
        setEditAddressForm({
            name: address.name,
            phone: address.phone,
            address: address.address,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            address_type: address.address_type,
            is_default: address.is_default
        });
    };

    const handleUpdateAddress = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/addresses/${editingAddressId}/`, editAddressForm);
            fetchAddresses();
            fetchProfileData();
            setEditingAddressId(null);
            setEditAddressForm({});
            showMessage('success', 'Address updated successfully');
        } catch (error) {
            console.error('Error updating address:', error);
            showMessage('error', 'Failed to update address');
        }
    };

    const handleCancelEdit = () => {
        setEditingAddressId(null);
        setEditAddressForm({});
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/profile/update/', profileForm);
            setProfileData({
                ...profileData,
                user: response.data.user
            });
            setEditingProfile(false);
            showMessage('success', 'Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            showMessage('error', 'Failed to update profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await api.post('/profile/change-password/', passwordForm);
            setChangingPassword(false);
            setPasswordForm({
                current_password: '',
                new_password: '',
                confirm_password: ''
            });
            showMessage('success', 'Password changed successfully');
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to change password';
            showMessage('error', errorMsg);
        }
    };

    const handleNotificationChange = async (key) => {
        const newSettings = { ...notificationSettings, [key]: !notificationSettings[key] };
        setNotificationSettings(newSettings);
        showMessage('success', 'Notification settings updated');
    };

    const fetchWallet = async () => {
        setWalletLoading(true);
        try {
            const response = await api.get('/wallet/');
            setWalletData(response.data);
        } catch (error) {
            console.error('Error fetching wallet:', error);
        } finally {
            setWalletLoading(false);
        }
    };

    const fetchWishlist = async () => {
        setWishlistLoading(true);
        try {
            const response = await api.get('/wishlist/');
            setWishlistItems(response.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await api.post(`/wishlist/${productId}/`, {});
            fetchWishlist();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            await api.post('/cart/', { product: productId, quantity: 1 });
            alert('Added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleAddMoney = async (e) => {
        e.preventDefault();
        const amount = parseFloat(addMoneyAmount);

        if (!amount || amount <= 0) {
            showMessage('error', 'Please enter a valid amount');
            return;
        }

        try {
            const response = await api.post('/wallet/add-money/', { amount });
            setWalletData({
                ...walletData,
                balance: response.data.balance
            });
            fetchWallet();
            setShowAddMoney(false);
            setAddMoneyAmount('');
            showMessage('success', `₹${amount} added to wallet successfully!`);
        } catch (error) {
            showMessage('error', 'Failed to add money');
        }
    };

    // Handle navigation to support page - fixed to avoid setState during render
    useEffect(() => {
        if (activeSection === 'support') {
            navigate('/support');
        }
    }, [activeSection, navigate]);

    useEffect(() => {
        if (activeSection === 'wallet') {
            fetchWallet();
        }
        if (activeSection === 'wishlist') {
            fetchWishlist();
        }
    }, [activeSection]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Please login to view your profile</h2>
                    <p className="text-gray-500 mb-6">Login to access your account</p>
                    <Link to="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    const menuItems = [
        { id: 'profile', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { id: 'orders', label: 'My Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
        { id: 'addresses', label: 'My Addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
        { id: 'wishlist', label: 'My Wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
        { id: 'wallet', label: 'My Wallet', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
        { id: 'support', label: 'Customer Support', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'settings', label: 'Account Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-gray-800">Personal Information</h2>
                                <button
                                    onClick={() => setEditingProfile(!editingProfile)}
                                    className="text-blue-600 text-sm font-medium hover:underline"
                                >
                                    {editingProfile ? 'Cancel' : 'Edit'}
                                </button>
                            </div>

                            {message.text && (
                                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {message.text}
                                </div>
                            )}

                            {editingProfile ? (
                                <form onSubmit={handleUpdateProfile}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">First Name</label>
                                            <input
                                                type="text"
                                                value={profileForm.first_name}
                                                onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                                            <input
                                                type="text"
                                                value={profileForm.last_name}
                                                onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={profileForm.email}
                                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Mobile Number</label>
                                            <input
                                                type="tel"
                                                value={profileForm.mobile}
                                                onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                                        Save Changes
                                    </button>
                                </form>
                            ) : (
                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-2xl font-bold text-blue-600">
                                            {(profileData?.user?.first_name || user?.username || 'U').charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {profileData?.user?.first_name || user?.username || 'User'} {profileData?.user?.last_name}
                                        </h3>
                                        <p className="text-gray-500">{profileData?.user?.email || user?.email || 'user@example.com'}</p>
                                        <p className="text-gray-500">+91 {profileData?.user?.mobile || 'XXXXXXXXXX'}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Account Statistics</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">{profileData?.stats?.orders || 0}</p>
                                    <p className="text-sm text-gray-600">Orders</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{profileData?.stats?.addresses || 0}</p>
                                    <p className="text-sm text-gray-600">Addresses</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-purple-600">{profileData?.stats?.wishlist || 0}</p>
                                    <p className="text-sm text-gray-600">Wishlist</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-orange-600">₹{profileData?.stats?.wallet || 0}</p>
                                    <p className="text-sm text-gray-600">Wallet</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'orders':
                return (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">My Orders</h2>
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <p className="text-gray-500">You haven't placed any orders yet</p>
                                <Link to="/" className="inline-block mt-4 text-blue-600 font-medium">Shop Now</Link>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className="bg-white rounded-lg shadow-sm p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Order #{order.order_id}</p>
                                            <p className="text-xs text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${order.status === 'Delivered'
                                            ? 'bg-green-100 text-green-700'
                                            : order.status === 'Cancelled'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-gray-600">{item.product_name} × {item.quantity}</span>
                                                <span className="font-medium">₹{item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 pt-3 border-t flex justify-between items-center">
                                        <span className="font-bold text-gray-800">Total: ₹{order.total_amount}</span>
                                        <Link to={`/order-tracking?order_id=${order.order_id}`} className="text-blue-600 text-sm font-medium hover:underline">
                                            Track Order
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                );

            case 'addresses':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">My Addresses</h2>
                            <button
                                onClick={() => setShowAddAddress(!showAddAddress)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Address
                            </button>
                        </div>

                        {showAddAddress && (
                            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                                <h3 className="font-bold text-gray-800 mb-4">Add New Address</h3>
                                <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={newAddress.name}
                                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Phone *</label>
                                        <input
                                            type="tel"
                                            required
                                            maxLength={10}
                                            value={newAddress.phone}
                                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs text-gray-600 mb-1">Address *</label>
                                        <textarea
                                            required
                                            value={newAddress.address}
                                            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={2}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">City *</label>
                                        <input
                                            type="text"
                                            required
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">State *</label>
                                        <input
                                            type="text"
                                            required
                                            value={newAddress.state}
                                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Pincode *</label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            value={newAddress.pincode}
                                            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Address Type</label>
                                        <select
                                            value={newAddress.address_type}
                                            onChange={(e) => setNewAddress({ ...newAddress, address_type: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Home">Home</option>
                                            <option value="Work">Work</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="flex items-center gap-2 text-sm text-gray-600">
                                            <input
                                                type="checkbox"
                                                checked={newAddress.is_default}
                                                onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                                                className="rounded"
                                            />
                                            Set as default address
                                        </label>
                                    </div>
                                    <div className="sm:col-span-2 flex gap-2">
                                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                                            Save Address
                                        </button>
                                        <button type="button" onClick={() => setShowAddAddress(false)} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : addresses.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                <p className="text-gray-500">No addresses saved yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {addresses.map(address => (
                                    <div key={address.id} className={`bg-white rounded-lg shadow-sm p-4 border-2 ${address.is_default ? 'border-blue-500' : 'border-transparent'} hover:border-blue-500 transition-colors`}>
                                        {editingAddressId === address.id ? (
                                            <form onSubmit={handleUpdateAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Full Name *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={editAddressForm.name || ''}
                                                        onChange={(e) => setEditAddressForm({ ...editAddressForm, name: e.target.value })}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Phone *</label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        maxLength={10}
                                                        value={editAddressForm.phone || ''}
                                                        onChange={(e) => setEditAddressForm({ ...editAddressForm, phone: e.target.value })}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="block text-xs text-gray-600 mb-1">Address *</label>
                                                    <textarea
                                                        required
                                                        value={editAddressForm.address || ''}
                                                        onChange={(e) => setEditAddressForm({ ...editAddressForm, address: e.target.value })}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        rows={2}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">City *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={editAddressForm.city || ''}
                                                        onChange={(e) => setEditAddressForm({ ...editAddressForm, city: e.target.value })}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">State *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={editAddressForm.state || ''}
                                                        onChange={(e) => setEditAddressForm({ ...editAddressForm, state: e.target.value })}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Pincode *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        maxLength={6}
                                                        value={editAddressForm.pincode || ''}
                                                        onChange={(e) => setEditAddressForm({ ...editAddressForm, pincode: e.target.value })}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Address Type</label>
                                                    <select
                                                        value={editAddressForm.address_type || 'Home'}
                                                        onChange={(e) => setEditAddressForm({ ...editAddressForm, address_type: e.target.value })}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="Home">Home</option>
                                                        <option value="Work">Work</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="flex items-center gap-2 text-sm text-gray-600">
                                                        <input
                                                            type="checkbox"
                                                            checked={editAddressForm.is_default || false}
                                                            onChange={(e) => setEditAddressForm({ ...editAddressForm, is_default: e.target.checked })}
                                                            className="rounded"
                                                        />
                                                        Set as default address
                                                    </label>
                                                </div>
                                                <div className="sm:col-span-2 flex gap-2">
                                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                                                        Save Changes
                                                    </button>
                                                    <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">{address.address_type}</span>
                                                    {address.is_default && <span className="text-xs text-green-600 font-medium">Default</span>}
                                                </div>
                                                <p className="font-medium text-gray-800">{address.name}</p>
                                                <p className="text-sm text-gray-600">+91 {address.phone}</p>
                                                <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                                                <p className="text-sm text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                                                <div className="flex gap-2 mt-3 pt-3 border-t">
                                                    <button onClick={() => handleEditAddress(address)} className="text-blue-600 text-sm hover:underline">Edit</button>
                                                    <button onClick={() => handleDeleteAddress(address.id)} className="text-red-500 text-sm hover:underline">Delete</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'wishlist':
                if (wishlistLoading) {
                    return <div className="text-center py-8">Loading...</div>;
                }

                if (wishlistItems.length === 0) {
                    return (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500">Your wishlist is empty</p>
                            <Link to="/products" className="inline-block mt-4 text-blue-600 font-medium">Explore Products</Link>
                        </div>
                    );
                }

                return (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">My Wishlist ({wishlistItems.length})</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {wishlistItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                    <Link to={`/products/${item.product}`} className="block">
                                        <div className="aspect-square bg-gray-100 relative">
                                            {item.product_image ? (
                                                <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="p-3">
                                        <Link to={`/products/${item.product}`} className="block">
                                            <h3 className="font-medium text-gray-800 text-sm truncate hover:text-blue-600">
                                                {item.product_name}
                                            </h3>
                                        </Link>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="font-bold text-gray-900">₹{item.product_price}</span>
                                            {item.product_original_price && (
                                                <span className="text-xs text-gray-400 line-through">₹{item.product_original_price}</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleAddToCart(item.product)}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded text-sm font-medium"
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={() => handleRemoveFromWishlist(item.product)}
                                                className="px-3 py-1.5 border border-red-500 text-red-500 rounded text-sm hover:bg-red-50"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'wallet':
                return (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">My Wallet</h2>

                        {message.text && activeSection === 'wallet' && (
                            <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-sm p-6 text-white">
                            <p className="text-sm opacity-80">Available Balance</p>
                            <p className="text-3xl font-bold mt-1">₹{walletData?.balance || '0.00'}</p>
                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={() => setShowAddMoney(!showAddMoney)}
                                    className="px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-lg hover:bg-gray-100"
                                >
                                    Add Money
                                </button>
                            </div>
                        </div>

                        {showAddMoney && (
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <h3 className="font-bold text-gray-800 mb-4">Add Money to Wallet</h3>
                                <form onSubmit={handleAddMoney}>
                                    <div className="mb-4">
                                        <label className="block text-sm text-gray-600 mb-1">Enter Amount (₹)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={addMoneyAmount}
                                            onChange={(e) => setAddMoneyAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-2 mb-4">
                                        {[100, 500, 1000, 2000].map(amount => (
                                            <button
                                                key={amount}
                                                type="button"
                                                onClick={() => setAddMoneyAmount(amount.toString())}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                                            >
                                                ₹{amount}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                                    >
                                        Add ₹{addMoneyAmount || '0'} to Wallet
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h3 className="font-bold text-gray-800 mb-4">Recent Transactions</h3>
                            {walletLoading ? (
                                <div className="text-center py-4">
                                    <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : walletData?.transactions?.length > 0 ? (
                                <div className="space-y-3">
                                    {walletData.transactions.map(tx => (
                                        <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.transaction_type === 'Credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                                                    <span className={`text-lg ${tx.transaction_type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {tx.transaction_type === 'Credit' ? '+' : '-'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                                                    <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <span className={`font-bold ${tx.transaction_type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.transaction_type === 'Credit' ? '+' : '-'}₹{tx.amount}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm text-center py-4">No transactions yet</p>
                            )}
                        </div>
                    </div>
                );

            case 'settings':
                return (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Account Settings</h2>

                        {/* Edit Profile Card */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Edit Profile</p>
                                        <p className="text-sm text-gray-500">Update your personal information</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveSection('profile')}
                                    className="text-blue-600 text-sm font-medium hover:underline"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>

                        {/* Change Password Card */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Change Password</p>
                                        <p className="text-sm text-gray-500">Update your password</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setChangingPassword(!changingPassword)}
                                    className="text-blue-600 text-sm font-medium hover:underline"
                                >
                                    {changingPassword ? 'Cancel' : 'Change'}
                                </button>
                            </div>

                            {changingPassword && (
                                <div className="mt-4 pt-4 border-t">
                                    {message.text && (
                                        <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {message.text}
                                        </div>
                                    )}
                                    <form onSubmit={handleChangePassword} className="space-y-3">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={passwordForm.current_password}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                value={passwordForm.new_password}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={passwordForm.confirm_password}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                                            Update Password
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Notifications Card */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#00674F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Notifications</p>
                                    <p className="text-sm text-gray-500">Manage notification preferences</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-gray-700">Order Updates</span>
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.order_updates}
                                        onChange={() => handleNotificationChange('order_updates')}
                                        className="w-5 h-5 text-blue-600 rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-gray-700">Promotional Emails</span>
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.promotions}
                                        onChange={() => handleNotificationChange('promotions')}
                                        className="w-5 h-5 text-blue-600 rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-gray-700">SMS Notifications</span>
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.sms}
                                        onChange={() => handleNotificationChange('sms')}
                                        className="w-5 h-5 text-blue-600 rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-gray-700">Email Notifications</span>
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.email}
                                        onChange={() => handleNotificationChange('email')}
                                        className="w-5 h-5 text-blue-600 rounded"
                                    />
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full p-4 bg-white rounded-lg shadow-sm text-left flex items-center gap-3 text-red-600 hover:bg-red-50"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-4">
            <div className="max-w-7xl mx-auto px-2 sm:px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                            {/* User Info */}
                            <div className="flex items-center gap-3 pb-4 mb-4 border-b">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-lg font-bold text-blue-600">
                                        {(profileData?.user?.first_name || user?.username || 'U').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate">{profileData?.user?.first_name || user?.username || 'User'}</p>
                                    <p className="text-sm text-gray-500 truncate">{profileData?.user?.email || user?.email || ''}</p>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <nav className="space-y-1">
                                {menuItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${activeSection === item.id
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
