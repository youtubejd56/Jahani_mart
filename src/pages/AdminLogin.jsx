import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SEO from '../components/SEO';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/admin/login/', formData);
            console.log('Login response:', response.data);

            // Store admin info and JWT token
            localStorage.setItem('admin_token', response.data.user.id);
            localStorage.setItem('admin_user', JSON.stringify(response.data.user));
            localStorage.setItem('admin_access_token', response.data.token.access);
            console.log('Token stored:', response.data.token.access);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
            <SEO noindex title="Admin Login" />
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center">
                        <div className="bg-yellow-400 px-3 py-2 rounded">
                            <span className="text-2xl font-bold text-gray-900">J</span>
                        </div>
                        <span className="ml-2 text-2xl font-bold text-gray-800">Admin</span>
                    </div>
                    <p className="text-gray-600 mt-2">Jahani International Admin Panel</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Admin Login</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Enter admin username"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Enter admin password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/" className="text-sm text-blue-600 hover:underline">
                            Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
