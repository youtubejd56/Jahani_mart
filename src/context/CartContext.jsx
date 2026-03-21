import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], total_items: 0, total_price: 0 });
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchCart = async () => {
        if (!isAuthenticated) {
            setCart({ items: [], total_items: 0, total_price: 0 });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await api.get('/cart/');
                setCart(response.data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated]);

    const addToCart = async (productId, quantity = 1) => {
        if (!isAuthenticated) {
            return { error: 'Please login to add items to cart' };
        }

        setLoading(true);
        try {
            const response = await api.post('/cart/', {
                product_id: productId,
                quantity: quantity
            });
            await fetchCart();
            return response.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return { error: error.response?.data?.error || 'Failed to add to cart' };
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (itemId) => {
        setLoading(true);
        try {
            await api.delete(`/cart/${itemId}/`);
            await fetchCart();
            return { success: true };
        } catch (error) {
            console.error('Error removing from cart:', error);
            return { error: error.response?.data?.error || 'Failed to remove from cart' };
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        setLoading(true);
        try {
            await api.put(`/cart/update/${itemId}/`, { quantity });
            await fetchCart();
            return { success: true };
        } catch (error) {
            console.error('Error updating cart:', error);
            return { error: error.response?.data?.error || 'Failed to update cart' };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
