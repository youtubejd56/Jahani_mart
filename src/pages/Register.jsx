import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        countryCode: '+91',
        mobile: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const countryCodes = [
        { code: '+91', flag: '🇮🇳', label: 'India (+91)' },
        { code: '+971', flag: '🇦🇪', label: 'UAE (+971)' },
        { code: '+966', flag: '🇸🇦', label: 'Saudi Arabia (+966)' },
        { code: '+974', flag: '🇶🇦', label: 'Qatar (+974)' },
        { code: '+968', flag: '🇴🇲', label: 'Oman (+968)' },
        { code: '+965', flag: '🇰🇼', label: 'Kuwait (+965)' },
        { code: '+973', flag: '🇧🇭', label: 'Bahrain (+973)' },
        { code: '+1', flag: '🇺🇸', label: 'USA/Canada (+1)' },
        { code: '+44', flag: '🇬🇧', label: 'UK (+44)' },
        { code: '+61', flag: '🇦🇺', label: 'Australia (+61)' },
        { code: '+49', flag: '🇩🇪', label: 'Germany (+49)' },
        { code: '+33', flag: '🇫🇷', label: 'France (+33)' },
        { code: '+65', flag: '🇸🇬', label: 'Singapore (+65)' },
        { code: '+60', flag: '🇲🇾', label: 'Malaysia (+60)' },
        { code: '+81', flag: '🇯🇵', label: 'Japan (+81)' },
        { code: '+86', flag: '🇨🇳', label: 'China (+86)' },
        { code: '+27', flag: '🇿🇦', label: 'South Africa (+27)' },
        { code: '+92', flag: '🇵🇰', label: 'Pakistan (+92)' },
        { code: '+880', flag: '🇧🇩', label: 'Bangladesh (+880)' },
        { code: '+94', flag: '🇱🇰', label: 'Sri Lanka (+94)' },
        { code: '+62', flag: '🇮🇩', label: 'Indonesia (+62)' },
        { code: '+7', flag: '🇷🇺', label: 'Russia (+7)' },
        { code: '+39', flag: '🇮🇹', label: 'Italy (+39)' },
        { code: '+34', flag: '🇪🇸', label: 'Spain (+34)' },
        { code: '+55', flag: '🇧🇷', label: 'Brazil (+55)' },
        { code: '+90', flag: '🇹🇷', label: 'Turkey (+90)' },
        { code: '+20', flag: '🇪🇬', label: 'Egypt (+20)' },
        { code: '+66', flag: '🇹🇭', label: 'Thailand (+66)' },
        { code: '+84', flag: '🇻🇳', label: 'Vietnam (+84)' },
        { code: '+63', flag: '🇵🇭', label: 'Philippines (+63)' },
        { code: '+234', flag: '🇳🇬', label: 'Nigeria (+234)' },
        { code: '+254', flag: '🇰🇪', label: 'Kenya (+254)' },
        { code: '+251', flag: '🇪🇹', label: 'Ethiopia (+251)' },
        { code: '+212', flag: '🇲🇦', label: 'Morocco (+212)' },
        { code: '+213', flag: '🇩🇿', label: 'Algeria (+213)' },
        { code: '+233', flag: '🇬🇭', label: 'Ghana (+233)' },
        { code: '+255', flag: '🇹🇿', label: 'Tanzania (+255)' },
        { code: '+256', flag: '🇺🇬', label: 'Uganda (+256)' },
        { code: '+52', flag: '🇲🇽', label: 'Mexico (+52)' },
        { code: '+54', flag: '🇦🇷', label: 'Argentina (+54)' },
        { code: '+57', flag: '🇨🇴', label: 'Colombia (+57)' },
        { code: '+51', flag: '🇵🇪', label: 'Peru (+51)' },
        { code: '+56', flag: '🇨🇱', label: 'Chile (+56)' },
        { code: '+64', flag: '🇳🇿', label: 'New Zealand (+64)' },
        { code: '+41', flag: '🇨🇭', label: 'Switzerland (+41)' },
        { code: '+31', flag: '🇳🇱', label: 'Netherlands (+31)' },
        { code: '+46', flag: '🇸🇪', label: 'Sweden (+46)' },
        { code: '+47', flag: '🇳🇴', label: 'Norway (+47)' },
        { code: '+45', flag: '🇩🇰', label: 'Denmark (+45)' },
        { code: '+358', flag: '🇫🇮', label: 'Finland (+358)' },
        { code: '+48', flag: '🇵🇱', label: 'Poland (+48)' },
        { code: '+351', flag: '🇵🇹', label: 'Portugal (+351)' },
        { code: '+30', flag: '🇬🇷', label: 'Greece (+30)' },
        { code: '+353', flag: '🇮🇪', label: 'Ireland (+353)' },
        { code: '+32', flag: '🇧🇪', label: 'Belgium (+32)' },
        { code: '+43', flag: '🇦🇹', label: 'Austria (+43)' },
        { code: '+972', flag: '🇮🇱', label: 'Israel (+972)' },
        { code: '+98', flag: '🇮🇷', label: 'Iran (+98)' },
        { code: '+964', flag: '🇮🇶', label: 'Iraq (+964)' },
        { code: '+963', flag: '🇸🇾', label: 'Syria (+963)' },
        { code: '+961', flag: '🇱🇧', label: 'Lebanon (+961)' },
        { code: '+962', flag: '🇯🇴', label: 'Jordan (+962)' },
        { code: '+967', flag: '🇾🇪', label: 'Yemen (+967)' },
        { code: '+970', flag: '🇵🇸', label: 'Palestine (+970)' },
        { code: '+355', flag: '🇦🇱', label: 'Albania (+355)' },
        { code: '+376', flag: '🇦🇩', label: 'Andorra (+376)' },
        { code: '+244', flag: '🇦🇴', label: 'Angola (+244)' },
        { code: '+374', flag: '🇦🇲', label: 'Armenia (+374)' },
        { code: '+994', flag: '🇦🇿', label: 'Azerbaijan (+994)' },
        { code: '+375', flag: '🇧🇾', label: 'Belarus (+375)' },
        { code: '+501', flag: '🇧🇿', label: 'Belize (+501)' },
        { code: '+229', flag: '🇧🇯', label: 'Benin (+229)' },
        { code: '+975', flag: '🇧🇹', label: 'Bhutan (+975)' },
        { code: '+591', flag: '🇧🇴', label: 'Bolivia (+591)' },
        { code: '+387', flag: '🇧🇦', label: 'Bosnia and Herzegovina (+387)' },
        { code: '+267', flag: '🇧🇼', label: 'Botswana (+267)' },
        { code: '+673', flag: '🇧🇳', label: 'Brunei (+673)' },
        { code: '+359', flag: '🇧🇬', label: 'Bulgaria (+359)' },
        { code: '+226', flag: '🇧🇫', label: 'Burkina Faso (+226)' },
        { code: '+257', flag: '🇧🇮', label: 'Burundi (+257)' },
        { code: '+855', flag: '🇰🇭', label: 'Cambodia (+855)' },
        { code: '+237', flag: '🇨🇲', label: 'Cameroon (+237)' },
        { code: '+238', flag: '🇨🇻', label: 'Cape Verde (+238)' },
        { code: '+236', flag: '🇨🇫', label: 'Central African Republic (+236)' },
        { code: '+235', flag: '🇹🇩', label: 'Chad (+235)' },
        { code: '+506', flag: '🇨🇷', label: 'Costa Rica (+506)' },
        { code: '+385', flag: '🇭🇷', label: 'Croatia (+385)' },
        { code: '+53', flag: '🇨🇺', label: 'Cuba (+53)' },
        { code: '+357', flag: '🇨🇾', label: 'Cyprus (+357)' },
        { code: '+420', flag: '🇨🇿', label: 'Czech Republic (+420)' },
        { code: '+253', flag: '🇩🇯', label: 'Djibouti (+253)' },
        { code: '+593', flag: '🇪🇨', label: 'Ecuador (+593)' },
        { code: '+503', flag: '🇸🇻', label: 'El Salvador (+503)' },
        { code: '+372', flag: '🇪🇪', label: 'Estonia (+372)' },
        { code: '+679', flag: '🇫🇯', label: 'Fiji (+679)' },
        { code: '+241', flag: '🇬🇦', label: 'Gabon (+241)' },
        { code: '+220', flag: '🇬🇲', label: 'Gambia (+220)' },
        { code: '+995', flag: '🇬🇪', label: 'Georgia (+995)' },
        { code: '+502', flag: '🇬🇹', label: 'Guatemala (+502)' },
        { code: '+224', flag: '🇬🇳', label: 'Guinea (+224)' },
        { code: '+592', flag: '🇬🇾', label: 'Guyana (+592)' },
        { code: '+509', flag: '🇭🇹', label: 'Haiti (+509)' },
        { code: '+504', flag: '🇭🇳', label: 'Honduras (+504)' },
        { code: '+36', flag: '🇭🇺', label: 'Hungary (+36)' },
        { code: '+354', flag: '🇮🇸', label: 'Iceland (+354)' },
        { code: '+225', flag: '🇨🇮', label: 'Ivory Coast (+225)' },
        { code: '+1876', flag: '🇯🇲', label: 'Jamaica (+1876)' },
        { code: '+77', flag: '🇰🇿', label: 'Kazakhstan (+77)' },
        { code: '+850', flag: '🇰🇵', label: 'North Korea (+850)' },
        { code: '+82', flag: '🇰🇷', label: 'South Korea (+82)' },
        { code: '+996', flag: '🇰🇬', label: 'Kyrgyzstan (+996)' },
        { code: '+856', flag: '🇱🇦', label: 'Laos (+856)' },
        { code: '+371', flag: '🇱🇻', label: 'Latvia (+371)' },
        { code: '+231', flag: '🇱🇷', label: 'Liberia (+231)' },
        { code: '+218', flag: '🇱🇾', label: 'Libya (+218)' },
        { code: '+370', flag: '🇱🇹', label: 'Lithuania (+370)' },
        { code: '+352', flag: '🇱🇺', label: 'Luxembourg (+352)' },
        { code: '+389', flag: '🇲🇰', label: 'Macedonia (+389)' },
        { code: '+261', flag: '🇲🇬', label: 'Madagascar (+261)' },
        { code: '+265', flag: '🇲🇼', label: 'Malawi (+265)' },
        { code: '+960', flag: '🇲🇻', label: 'Maldives (+960)' },
        { code: '+223', flag: '🇲🇱', label: 'Mali (+223)' },
        { code: '+356', flag: '🇲🇹', label: 'Malta (+356)' },
        { code: '+222', flag: '🇲🇷', label: 'Mauritania (+222)' },
        { code: '+230', flag: '🇲🇺', label: 'Mauritius (+230)' },
        { code: '+373', flag: '🇲🇩', label: 'Moldova (+373)' },
        { code: '+976', flag: '🇲🇳', label: 'Mongolia (+976)' },
        { code: '+382', flag: '🇲🇪', label: 'Montenegro (+382)' },
        { code: '+264', flag: '🇳🇦', label: 'Namibia (+264)' },
        { code: '+977', flag: '🇳🇵', label: 'Nepal (+977)' },
        { code: '+505', flag: '🇳🇮', label: 'Nicaragua (+505)' },
        { code: '+227', flag: '🇳🇪', label: 'Niger (+227)' },
        { code: '+507', flag: '🇵🇦', label: 'Panama (+507)' },
        { code: '+675', flag: '🇵🇬', label: 'Papua New Guinea (+675)' },
        { code: '+595', flag: '🇵🇾', label: 'Paraguay (+595)' },
        { code: '+40', flag: '🇷🇴', label: 'Romania (+40)' },
        { code: '+250', flag: '🇷🇼', label: 'Rwanda (+250)' },

        { code: '+685', flag: '🇼🇸', label: 'Samoa (+685)' },
        { code: '+378', flag: '🇸🇲', label: 'San Marino (+378)' },
        { code: '+221', flag: '🇸🇳', label: 'Senegal (+221)' },
        { code: '+381', flag: '🇷🇸', label: 'Serbia (+381)' },
        { code: '+248', flag: '🇸🇨', label: 'Seychelles (+248)' },
        { code: '+232', flag: '🇸🇱', label: 'Sierra Leone (+232)' },
        { code: '+421', flag: '🇸🇰', label: 'Slovakia (+421)' },
        { code: '+386', flag: '🇸🇮', label: 'Slovenia (+386)' },
        { code: '+677', flag: '🇸🇧', label: 'Solomon Islands (+677)' },
        { code: '+252', flag: '🇸🇴', label: 'Somalia (+252)' },
        { code: '+249', flag: '🇸🇩', label: 'Sudan (+249)' },
        { code: '+597', flag: '🇸🇷', label: 'Suriname (+597)' },
        { code: '+268', flag: '🇸🇿', label: 'Swaziland (+268)' },
        { code: '+992', flag: '🇹🇯', label: 'Tajikistan (+992)' },
        { code: '+228', flag: '🇹🇬', label: 'Togo (+228)' },
        { code: '+676', flag: '🇹🇴', label: 'Tonga (+676)' },
        { code: '+216', flag: '🇹🇳', label: 'Tunisia (+216)' },
        { code: '+993', flag: '🇹🇲', label: 'Turkmenistan (+993)' },
        { code: '+688', flag: '🇹🇻', label: 'Tuvalu (+688)' },
        { code: '+380', flag: '🇺🇦', label: 'Ukraine (+380)' },
        { code: '+598', flag: '🇺🇾', label: 'Uruguay (+598)' },
        { code: '+998', flag: '🇺🇿', label: 'Uzbekistan (+998)' },
        { code: '+678', flag: '🇻🇺', label: 'Vanuatu (+678)' },
        { code: '+58', flag: '🇻🇪', label: 'Venezuela (+58)' },
        { code: '+260', flag: '🇿🇲', label: 'Zambia (+260)' },
        { code: '+263', flag: '🇿🇼', label: 'Zimbabwe (+263)' },
    ];

    const filteredCountries = countryCodes.filter(c => 
        c.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.code.includes(searchTerm)
    );

    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode) || countryCodes[0];

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.country-selector')) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const trimmedMobile = formData.mobile.replace(/\s+/g, '');

        if (formData.email === '' || formData.first_name === '' || formData.last_name === '' || formData.password === '' || formData.confirmPassword === '') {
            setError('Please fill the required fields, all fields are required.');
            return;
        }
        if (!EMAIL_REGEX.test(formData.email)) {
            setError('Invalid email format, please enter a valid email address.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match, please enter the same password.');
            return;
        }
        if (!trimmedMobile) {
            setError('Mobile number is required, please enter your mobile number.');
            return;
        }
        if (trimmedMobile.length !== 10) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters, please enter a valid password.');
            return;
        }

        setLoading(true);

        try {
            await register({
                email: formData.email,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
                mobile: `${formData.countryCode}${trimmedMobile}`
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 font-sans">
            <SEO noindex title="Register" />
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#00674F]">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join Jahani International</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <div className="relative country-selector w-32">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00674F] focus:border-transparent bg-white text-gray-700 text-sm font-medium flex items-center justify-between"
                                >
                                    <span className="truncate">{selectedCountry.flag} {selectedCountry.code}</span>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                                        <div className="p-2 border-b border-gray-100 bg-gray-50">
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Search country..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[#00674F] focus:outline-none"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {filteredCountries.length > 0 ? (
                                                filteredCountries.map((c, idx) => (
                                                    <div
                                                        key={`${c.code}-${c.flag}-${idx}`}
                                                        onClick={() => {
                                                            setFormData({ ...formData, countryCode: c.code });
                                                            setIsOpen(false);
                                                            setSearchTerm('');
                                                        }}
                                                        className={`px-4 py-3 text-sm cursor-pointer flex items-center gap-3 transition-colors ${formData.countryCode === c.code ? 'bg-green-50 text-[#00674F]' : 'hover:bg-gray-50'}`}
                                                    >
                                                        <span className="text-lg">{c.flag}</span>
                                                        <span className="font-semibold">{c.code}</span>
                                                        <span className="text-gray-500 text-xs truncate flex-1">{c.label.split('(')[0]}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-gray-500 text-sm">No results</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <input
                                id="mobile"
                                name="mobile"
                                type="tel"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00674F] focus:border-transparent"
                                placeholder="Enter mobile number"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00674F] focus:border-transparent"
                                placeholder="First name"
                            />
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00674F] focus:border-transparent"
                                placeholder="Last name"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00674F] focus:border-transparent"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00674F] focus:border-transparent"
                            placeholder="Create a password"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00674F] focus:border-transparent"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00674F] hover:bg-[#005040] text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#00674F] font-semibold hover:text-[#005040]">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
