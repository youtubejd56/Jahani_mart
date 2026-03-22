import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
            setWishlistCount(0);
        }
    }, [isAuthenticated]);

    const fetchWishlist = async () => {
        try {
            const response = await api.get('/wishlist/');
            setWishlistItems(response.data);
            setWishlistCount(response.data.length);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const toggleWishlist = async (productId) => {
        if (!isAuthenticated) {
            alert('Please login to add items to wishlist');
            return false;
        }

        setLoading(true);
        try {
            const response = await api.post(`/wishlist/${productId}/`);

            if (response.data.in_wishlist) {
                setWishlistItems(prev => [...prev, { product: productId }]);
                setWishlistCount(prev => prev + 1);
            } else {
                setWishlistItems(prev => prev.filter(item => item.product !== productId));
                setWishlistCount(prev => prev - 1);
            }

            return response.data.in_wishlist;
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.product === productId);
    };

    const value = {
        wishlistItems,
        wishlistCount,
        loading,
        fetchWishlist,
        toggleWishlist,
        isInWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
