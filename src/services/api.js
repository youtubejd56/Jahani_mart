import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    // Remove /api from the end of VITE_API_URL to get the root backend URL
    const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || '';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default api;
