import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import api from '../services/api';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../services/firebase';

const ForgotPassword = () => {
    // Steps: 1 = mobile, 2 = otp, 3 = new password, 4 = success
    const [step, setStep] = useState(1); 
    const [countryCode, setCountryCode] = useState('+91');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState(''); // Will store Firebase Token
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    
    // Custom Dropdown State for Country Codes
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Cleanup recaptcha on unmount
        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
            }
        };
    }, []);
    
    // Country codes truncated for brevity in instruction, use the original big array
    const countryCodes = [
        { code: '+91', country: 'India', flag: '🇮🇳' },
        { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
        { code: '+44', country: 'UK', flag: '🇬🇧' },
        { code: '+971', country: 'UAE', flag: '🇦🇪' },
        { code: '+61', country: 'Australia', flag: '🇦🇺' },
        { code: '+49', country: 'Germany', flag: '🇩🇪' },
        { code: '+33', country: 'France', flag: '🇫🇷' },
        { code: '+81', country: 'Japan', flag: '🇯🇵' },
        { code: '+86', country: 'China', flag: '🇨🇳' },
        { code: '+55', country: 'Brazil', flag: '🇧🇷' },
        { code: '+7', country: 'Russia', flag: '🇷🇺' },
        { code: '+27', country: 'South Africa', flag: '🇿🇦' },
        { code: '+82', country: 'South Korea', flag: '🇰🇷' },
        { code: '+39', country: 'Italy', flag: '🇮🇹' },
        { code: '+34', country: 'Spain', flag: '🇪🇸' },
        { code: '+65', country: 'Singapore', flag: '🇸🇬' },
        { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
        { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
        { code: '+52', country: 'Mexico', flag: '🇲🇽' },
        { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
        { code: '+46', country: 'Sweden', flag: '🇸🇪' },
        { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
        { code: '+43', country: 'Austria', flag: '🇦🇹' },
        { code: '+32', country: 'Belgium', flag: '🇧🇪' },
        { code: '+45', country: 'Denmark', flag: '🇩🇰' },
        { code: '+358', country: 'Finland', flag: '🇫🇮' },
        { code: '+47', country: 'Norway', flag: '🇳🇴' },
        { code: '+48', country: 'Poland', flag: '🇵🇱' },
        { code: '+351', country: 'Portugal', flag: '🇵🇹' },
        { code: '+353', country: 'Ireland', flag: '🇮🇪' },
        { code: '+420', country: 'Czech', flag: '🇨🇿' },
        { code: '+30', country: 'Greece', flag: '🇬🇷' },
        { code: '+36', country: 'Hungary', flag: '🇭🇺' },
        { code: '+40', country: 'Romania', flag: '🇷🇴' },
        { code: '+380', country: 'Ukraine', flag: '🇺🇦' },
        { code: '+90', country: 'Turkey', flag: '🇹🇷' },
        { code: '+98', country: 'Iran', flag: '🇮🇷' },
        { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
        { code: '+972', country: 'Israel', flag: '🇮🇱' },
        { code: '+20', country: 'Egypt', flag: '🇪🇬' },
        { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
        { code: '+254', country: 'Kenya', flag: '🇰🇪' },
        { code: '+212', country: 'Morocco', flag: '🇲🇦' },
        { code: '+213', country: 'Algeria', flag: '🇩🇿' },
        { code: '+54', country: 'Argentina', flag: '🇦🇷' },
        { code: '+56', country: 'Chile', flag: '🇨🇱' },
        { code: '+57', country: 'Colombia', flag: '🇨🇴' },
        { code: '+51', country: 'Peru', flag: '🇵🇪' },
        { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
        { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
        { code: '+63', country: 'Philippines', flag: '🇵🇭' },
        { code: '+66', country: 'Thailand', flag: '🇹🇭' },
        { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
        { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
        { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
        { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
        { code: '+977', country: 'Nepal', flag: '🇳🇵' },
        { code: '+95', country: 'Myanmar', flag: '🇲🇲' },
        { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
        { code: '+886', country: 'Taiwan', flag: '🇹🇼' }
    ].sort((a, b) => a.country.localeCompare(b.country));

    const filteredCodes = countryCodes.filter(c => 
        c.country.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.code.includes(searchTerm)
    );

    const getFullMobile = () => `${countryCode}${mobile.replace(/\s+/g, '')}`;

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved
                }
            });
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!mobile.trim() || mobile.length < 8) {
            setError('Please enter a valid registered mobile number.');
            return;
        }

        setLoading(true);
        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            const fullPhone = getFullMobile();
            const result = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
            setConfirmationResult(result);
            setStep(2);
        } catch (err) {
            console.error(err);
            setError('Failed to send OTP via Firebase. Ensure your number is valid and try again.');
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!otp.trim()) {
            setError('Please enter the OTP code.');
            return;
        }

        setLoading(true);
        try {
            // Verify with Firebase
            const result = await confirmationResult.confirm(otp);
            const user = result.user;
            
            // Extract the Firebase ID token
            const idToken = await user.getIdToken();
            setResetToken(idToken); // Pass this token to backend instead of our custom token!
            
            setStep(3);
        } catch (err) {
            console.error(err);
            setError('Invalid OTP code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/reset-password/', {
                mobile: getFullMobile(),
                new_password: newPassword,
                reset_token: resetToken
            });
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <SEO noindex title="Forgot Password" />
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm flex items-start gap-2">
                        <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <>
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-[#00674F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-[#00674F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-[#00674F]">Forgot Password?</h1>
                            <p className="text-gray-500 mt-2 text-sm">Enter your mobile number to receive an OTP</p>
                        </div>

                        <form onSubmit={handleSendOTP} className="space-y-5">
                            {/* Mobile Number with Country Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Registered Mobile Number</label>
                                <div className="flex gap-2">
                                    {/* Custom Dropdown */}
                                    <div className="relative w-32 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="w-full h-full min-h-[48px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00674F]/40 focus:border-[#00674F] bg-white flex items-center justify-between transition-all"
                                        >
                                            <span className="truncate flex items-center gap-1 text-sm">
                                                {countryCodes.find(c => c.code === countryCode)?.flag || '🌐'} {countryCode}
                                            </span>
                                            <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {isDropdownOpen && (
                                            <>
                                                <div 
                                                    className="fixed inset-0 z-10" 
                                                    onClick={() => setIsDropdownOpen(false)}
                                                ></div>
                                                <div className="absolute z-20 w-64 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                                                    <div className="p-2 border-b border-gray-100 bg-gray-50">
                                                        <input 
                                                            type="text" 
                                                            autoFocus
                                                            placeholder="Search country or code..." 
                                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#00674F]"
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto w-full">
                                                        {filteredCodes.map((c, idx) => (
                                                            <button
                                                                key={`${c.code}-${c.country}-${idx}`}
                                                                type="button"
                                                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 ${countryCode === c.code ? 'bg-[#00674F]/5 text-[#00674F] font-medium' : 'text-gray-700'}`}
                                                                onClick={() => {
                                                                    setCountryCode(c.code);
                                                                    setIsDropdownOpen(false);
                                                                    setSearchTerm('');
                                                                }}
                                                            >
                                                                <span>{c.flag}</span>
                                                                <span className="w-12 shrink-0">{c.code}</span>
                                                                <span className="truncate">{c.country}</span>
                                                            </button>
                                                        ))}
                                                        {filteredCodes.length === 0 && (
                                                            <div className="px-4 py-3 text-sm text-gray-500 text-center">No countries found</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00674F]/40 focus:border-[#00674F] outline-none transition-all"
                                        placeholder="Mobile Number"
                                    />
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#00674F] hover:bg-[#005040] text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 flex justify-center"
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                        <div id="recaptcha-container"></div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-[#00674F]">Verify OTP</h1>
                            <p className="text-gray-500 mt-2 text-sm">Enter the code sent to {getFullMobile()}</p>
                        </div>
                        <form onSubmit={handleVerifyOTP} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">OTP Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full text-center tracking-[0.5em] text-xl font-bold px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00674F]/40 focus:border-[#00674F] outline-none"
                                    placeholder="------"
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || otp.length < 6}
                                className="w-full bg-[#00674F] hover:bg-[#005040] text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 flex justify-center"
                            >
                                {loading ? 'Verifying...' : 'Verify & Continue'}
                            </button>
                            <div className="text-center">
                                <button type="button" onClick={() => setStep(1)} className="text-sm text-[#00674F] hover:underline">
                                    Change Mobile Number
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {step === 3 && (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-[#00674F]">Set New Password</h1>
                            <p className="text-gray-500 mt-2 text-sm">Create a secure new password</p>
                        </div>
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPass ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00674F]/40 focus:border-[#00674F] outline-none transition-all pr-12"
                                        placeholder="Create new password (min 6 chars)"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showNewPass ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                {/* Password strength indicator */}
                                {newPassword && (
                                    <div className="mt-2">
                                        <div className="flex gap-1">
                                            {[1,2,3,4].map(i => (
                                                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                                                    newPassword.length >= i * 3
                                                        ? i <= 2 ? 'bg-red-400' : i === 3 ? 'bg-amber-400' : 'bg-green-500'
                                                        : 'bg-gray-200'
                                                }`} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPass ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00674F]/40 focus:border-[#00674F] outline-none transition-all pr-12"
                                        placeholder="Repeat your new password"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showConfirmPass ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#00674F] hover:bg-[#005040] text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}

                {step === 4 && (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset!</h2>
                        <p className="text-gray-500 mb-8 text-sm">
                            Your password has been updated successfully.<br />You can now log in with your new password.
                        </p>
                        <Link to="/login" className="inline-block bg-[#00674F] hover:bg-[#005040] text-white font-bold py-3 px-8 rounded-lg transition-colors">
                            Go to Login
                        </Link>
                    </div>
                )}

                {step < 4 && (
                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-[#00674F] text-sm font-semibold hover:text-[#005040] flex items-center justify-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
