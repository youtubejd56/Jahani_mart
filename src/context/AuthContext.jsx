import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, [token]);

    const checkAuth = async () => {
        try {
            const response = await api.get('/me/');
            setUser(response.data.user);
        } catch (error) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const response = await api.post('/token/', { username, password });
        const accessToken = response.data.access;
        localStorage.setItem('token', accessToken);
        setToken(accessToken);

        // Get user info
        const userResponse = await api.get('/me/');
        setUser(userResponse.data.user);
        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/register/', userData);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
