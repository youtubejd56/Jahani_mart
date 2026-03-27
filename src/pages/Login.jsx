import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Login = () => {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!mobile || !password) {
            setError('All fields are required, please fill all the fields.');
            setLoading(false);
            return;
        }

        if (mobile.length !== 10) {
            setError('Mobile number must be 10 digits, please enter a valid mobile number.');
            setLoading(false);
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            setLoading(false);
            return;
        }

        try {
            await login(mobile, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <>
            <SEO
                title="Login - Jahani Mart"
                description="Login to your Jahani Mart account for a personalized shopping experience. Access your orders, wishlist, and exclusive offers."
                keywords="login, sign in, account, jahani mart, online shopping india"
                url="https://jahani-mart.onrender.com/login"
                type="website"
            />
            
            <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome Back!</h2>
                    <p className="text-gray-500 mb-6">Login to your Jahani Mart account</p>
                    
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="Mobile Number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                maxLength={10}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-sm text-gray-600">
                        <p className="mb-2">
                            New to Jahani Mart?{' '}
                            <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                                Create an account
                            </Link>
                        </p>
                        <p>
                            <Link to="/forgot-password" className="text-purple-600 hover:text-purple-700 font-medium">
                                Forgot Password?
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            By continuing, you agree to our{' '}
                            <Link to="/terms" className="text-purple-600 hover:text-purple-700">Terms of Service</Link> and{' '}
                            <Link to="/privacy" className="text-purple-600 hover:text-purple-700">Privacy Policy</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;