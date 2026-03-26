import React, { createContext, useContext, useState, useEffect } from 'react';

// Country configuration with currency and locale settings
const countryConfig = {
    IN: {
        countryName: 'India',
        currency: 'INR',
        currencySymbol: '₹',
        locale: 'en-IN',
        flag: '🇮🇳'
    },
    US: {
        countryName: 'United States',
        currency: 'USD',
        currencySymbol: '$',
        locale: 'en-US',
        flag: '🇺🇸'
    },
    GB: {
        countryName: 'United Kingdom',
        currency: 'GBP',
        currencySymbol: '£',
        locale: 'en-GB',
        flag: '🇬🇧'
    },
    AE: {
        countryName: 'UAE',
        currency: 'AED',
        currencySymbol: 'د.إ',
        locale: 'ar-AE',
        flag: '🇦🇪'
    },
    SA: {
        countryName: 'Saudi Arabia',
        currency: 'SAR',
        currencySymbol: 'ر.س',
        locale: 'ar-SA',
        flag: '🇸🇦'
    },
    CA: {
        countryName: 'Canada',
        currency: 'CAD',
        currencySymbol: 'C$',
        locale: 'en-CA',
        flag: '🇨🇦'
    },
    AU: {
        countryName: 'Australia',
        currency: 'AUD',
        currencySymbol: 'A$',
        locale: 'en-AU',
        flag: '🇦🇺'
    },
    DE: {
        countryName: 'Germany',
        currency: 'EUR',
        currencySymbol: '€',
        locale: 'de-DE',
        flag: '🇩🇪'
    },
    FR: {
        countryName: 'France',
        currency: 'EUR',
        currencySymbol: '€',
        locale: 'fr-FR',
        flag: '🇫🇷'
    },
    default: {
        countryName: 'India',
        currency: 'INR',
        currencySymbol: '₹',
        locale: 'en-IN',
        flag: '🇮🇳'
    }
};

// Exchange rates (base: INR)
const exchangeRates = {
    INR: 1,
    USD: 0.012,
    GBP: 0.0095,
    AED: 0.044,
    SAR: 0.045,
    CAD: 0.016,
    AUD: 0.019,
    EUR: 0.011
};

// IP-based geolocation API (free, no key required)
const IP_API_URL = 'http://ip-api.com/json/?fields=status,countryCode,country,city';

// Fallback timezone mapping
const timezoneToCountry = {
    'Asia/Kolkata': 'IN',
    'America/New_York': 'US',
    'America/Los_Angeles': 'US',
    'America/Chicago': 'US',
    'America/Toronto': 'CA',
    'America/Vancouver': 'CA',
    'Europe/London': 'GB',
    'Europe/Paris': 'FR',
    'Europe/Berlin': 'DE',
    'Asia/Dubai': 'AE',
    'Asia/Riyadh': 'SA',
    'Australia/Sydney': 'AU',
    'Australia/Melbourne': 'AU'
};

const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
    const [country, setCountry] = useState('IN');
    const [currency, setCurrency] = useState('INR');
    const [isAutoDetected, setIsAutoDetected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [detectionMethod, setDetectionMethod] = useState('');

    // Primary: IP-based detection using ip-api.com
    const detectCountryByIP = async () => {
        try {
            const response = await fetch(IP_API_URL, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success' && data.countryCode && countryConfig[data.countryCode]) {
                    console.log('[Locale] IP Detection successful:', data.countryCode);
                    setCountry(data.countryCode);
                    setCurrency(countryConfig[data.countryCode].currency);
                    setDetectionMethod('IP Detection');
                    setIsAutoDetected(true);
                    localStorage.setItem('jahani_country', data.countryCode);
                    setIsLoading(false);
                    return true;
                }
            }
        } catch (error) {
            console.log('[Locale] IP detection failed:', error.message);
        }
        return false;
    };

    // Secondary: Timezone-based detection
    const detectCountryByTimezone = () => {
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log('[Locale] User timezone:', timezone);

            const detectedCountry = timezoneToCountry[timezone] || 'IN';
            setCountry(detectedCountry);
            setCurrency(countryConfig[detectedCountry].currency);
            setDetectionMethod('Timezone');
            setIsAutoDetected(true);
            localStorage.setItem('jahani_country', detectedCountry);
            setIsLoading(false);
            return true;
        } catch (error) {
            console.log('[Locale] Timezone detection failed:', error.message);
            setCountry('IN');
            setCurrency('INR');
            setIsLoading(false);
            return false;
        }
    };

    // Initialize detection on mount
    useEffect(() => {
        const initCountryDetection = async () => {
            // Check for saved preference first
            const savedCountry = localStorage.getItem('jahani_country');
            if (savedCountry && countryConfig[savedCountry]) {
                console.log('[Locale] Using saved country:', savedCountry);
                setCountry(savedCountry);
                setCurrency(countryConfig[savedCountry].currency);
                setDetectionMethod('Saved Preference');
                setIsAutoDetected(false);
                setIsLoading(false);
                return;
            }

            // Try IP detection first (most accurate with VPN)
            const ipSuccess = await detectCountryByIP();

            // Fallback to timezone if IP fails
            if (!ipSuccess) {
                console.log('[Locale] Falling back to timezone detection');
                detectCountryByTimezone();
            }
        };

        initCountryDetection();
    }, []);

    // Manual country change (if user wants to override)
    const changeCountry = (newCountry) => {
        if (countryConfig[newCountry]) {
            setCountry(newCountry);
            setCurrency(countryConfig[newCountry].currency);
            localStorage.setItem('jahani_country', newCountry);
            setIsAutoDetected(false);
            setDetectionMethod('Manual');
        }
    };

    // Re-detect country (for refresh)
    const refreshDetection = async () => {
        setIsLoading(true);
        localStorage.removeItem('jahani_country');

        // Try IP first
        const ipSuccess = await detectCountryByIP();

        // Fallback to timezone
        if (!ipSuccess) {
            detectCountryByTimezone();
        }
    };

    // Convert price from INR to selected currency
    const convertPrice = (priceInINR) => {
        if (!priceInINR) return 0;
        const rate = exchangeRates[currency] || 1;
        return (priceInINR * rate);
    };

    // Format price with currency symbol
    const formatPrice = (priceInINR) => {
        const converted = convertPrice(priceInINR);
        const symbol = countryConfig[country]?.currencySymbol || '₹';

        if (currency === 'INR') {
            return `${symbol}${Math.round(priceInINR).toLocaleString('en-IN')}`;
        }

        // Format with proper decimal places
        return `${symbol}${converted.toLocaleString(countryConfig[country]?.locale || 'en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    // Get current country config
    const getConfig = () => countryConfig[country] || countryConfig.default;

    const value = {
        country,
        currency,
        isAutoDetected,
        isLoading,
        detectionMethod,
        changeCountry,
        refreshDetection,
        convertPrice,
        formatPrice,
        getConfig,
        countryConfig
    };

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    );
};

export const useLocale = () => {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};

export default LocaleContext;