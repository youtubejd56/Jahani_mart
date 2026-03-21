import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Reviews = () => {
    const { productId } = useParams();
    const { isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ rating: 5, title: '', comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProductAndReviews();
    }, [productId]);

    const fetchProductAndReviews = async () => {
        try {
            const productRes = await axios.get(`/api/products/${productId}/`);
            setProduct(productRes.data);

            const reviewsRes = await axios.get(`/api/products/${productId}/reviews/`);
            setReviews(reviewsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/reviews/', {
                product: productId,
                rating: formData.rating,
                title: formData.title,
                comment: formData.comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowForm(false);
            setFormData({ rating: 5, title: '', comment: '' });
            fetchProductAndReviews();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating, interactive = false, onChange = () => { }) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && onChange(star)}
                        className={`text-2xl ${interactive ? 'cursor-pointer' : 'cursor-default'} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'bg-green-600';
        if (rating >= 3) return 'bg-yellow-500';
        if (rating >= 2) return 'bg-orange-500';
        return 'bg-red-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="inline-block w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Product Summary */}
                {product && (
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex gap-4">
                        {product.image_url && (
                            <img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover rounded" />
                        )}
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">{product.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded text-white text-sm font-bold ${getRatingColor(product.rating)}`}>
                                    {product.rating} ★
                                </span>
                                <span className="text-gray-500">{reviews.length} ratings & reviews</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mt-2">₹{product.price}</p>
                        </div>
                    </div>
                )}

                {/* Write Review Button */}
                {isAuthenticated && (
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-lg"
                        >
                            {showForm ? '✕ Cancel' : 'Write a Review'}
                        </button>

                        {showForm && (
                            <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg">
                                {error && (
                                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Rating
                                    </label>
                                    {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Review Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        placeholder="Summarize your review"
                                        required
                                        maxLength={100}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Review
                                    </label>
                                    <textarea
                                        value={formData.comment}
                                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        placeholder="Share your experience with this product"
                                        required
                                        rows={4}
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{formData.comment.length}/500 characters</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* Reviews List */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Customer Reviews ({reviews.length})</h2>

                    {reviews.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                                    <div className="flex items-start gap-3">
                                        {/* User Avatar */}
                                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold">
                                            {review.user_username?.[0]?.toUpperCase() || 'U'}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-800">
                                                    {review.user_name || review.user_username}
                                                </span>
                                                {review.is_verified_purchase && (
                                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                                        ✓ Verified Purchase
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex">{renderStars(review.rating)}</div>
                                                <span className="text-gray-500 text-sm">
                                                    {new Date(review.created_at).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <h3 className="font-medium text-gray-800 mt-2">{review.title}</h3>
                                            <p className="text-gray-600 mt-1 text-sm leading-relaxed">{review.comment}</p>

                                            {review.helpful_count > 0 && (
                                                <p className="text-gray-500 text-sm mt-2">
                                                    {review.helpful_count} people found this helpful
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reviews;
