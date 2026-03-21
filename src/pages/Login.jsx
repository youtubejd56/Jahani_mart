import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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

        try {
            await login(mobile, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#00674F]">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Sign in to your account</p>
                </div>

                {/* JWT Explanation */}
                <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-semibold text-violet-700 mb-2">🔐 How JWT Login Works:</h3>
                    <div className="text-xs text-gray-600 space-y-2">
                        <p><span className="font-semibold">1. Submit:</span> You enter mobile & password</p>
                        <p><span className="font-semibold">2. Verify:</span> Server validates your credentials</p>
                        <p><span className="font-semibold">3. Token:</span> Server returns a JWT token (like an ID card)</p>
                        <p><span className="font-semibold">4. Store:</span> Token saved in your browser</p>
                        <p><span className="font-semibold">5. Access:</span> Token sent with every request to verify identity</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                            Mobile Number
                        </label>
                        <input
                            id="mobile"
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            placeholder="Enter your mobile number"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00674F] hover:bg-[#0A3C30] text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '🔄 Verifying & Generating Token...' : '🔐 Login'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-center text-gray-600 text-sm mb-4">
                        Don't have an account?
                    </p>
                    <Link
                        to="/register"
                        className="block w-full text-center bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        📝 Create New Account
                    </Link>
                </div>

                {/* Demo Credentials */}

            </div>
        </div>
    );
};

export default Login;
