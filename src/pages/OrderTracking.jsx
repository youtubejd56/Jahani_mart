import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RotateCcw, XCircle, AlertCircle } from 'lucide-react';

const OrderTracking = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [returnReason, setReturnReason] = useState('');
    const [returnDescription, setReturnDescription] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [cancelDescription, setCancelDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId, isAuthenticated]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/orders/${orderId}/`);
            setOrder(response.data);
        } catch (err) {
            setError('Order not found');
            console.error('Error fetching order:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReturnRequest = async () => {
        if (!returnReason) {
            alert('Please select a reason for return');
            return;
        }

        // Verify order status before attempting to return
        if (order.status !== 'Delivered') {
            alert('Returns can only be requested for delivered orders. Current status: ' + order.status);
            setShowReturnModal(false);
            fetchOrderDetails();
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/returns/', {
                order_item: selectedItem.id,
                reason: returnReason,
                description: returnDescription
            });
            alert('Return request submitted successfully!');
            setShowReturnModal(false);
            setReturnReason('');
            setReturnDescription('');
            setSelectedItem(null);
            fetchOrderDetails();
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to submit return request';
            alert(errorMessage);
            // If the error is about order status, refresh the order details
            if (errorMessage.includes('delivered') || errorMessage.includes('Delivered')) {
                fetchOrderDetails();
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelRequest = async () => {
        if (!cancelReason) {
            alert('Please select a reason for cancellation');
            return;
        }

        // Verify order status before attempting to cancel
        if (!['Pending', 'Processing'].includes(order.status)) {
            alert('This order cannot be cancelled. Current status: ' + order.status);
            setShowCancelModal(false);
            fetchOrderDetails();
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/cancellations/', {
                order_item: selectedItem.id,
                reason: cancelReason,
                description: cancelDescription
            });
            alert('Cancellation request submitted successfully!');
            setShowCancelModal(false);
            setCancelReason('');
            setCancelDescription('');
            setSelectedItem(null);
            fetchOrderDetails();
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to submit cancellation request';
            alert(errorMessage);
            // If the error is about order status, refresh the order details
            if (errorMessage.includes('cannot be cancelled') || errorMessage.includes('Delivered') || errorMessage.includes('Cancelled')) {
                fetchOrderDetails();
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-sm">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
                    <p className="text-gray-500 mb-4">{error || 'Unable to find this order'}</p>
                    <Link to="/orders" className="text-blue-600 font-medium hover:underline">Go to My Orders</Link>
                </div>
            </div>
        );
    }

    const statusFlow = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentStatusIndex = statusFlow.indexOf(order.status);

    const getStatusColor = (status, index) => {
        if (index < currentStatusIndex) return 'text-green-600';
        if (index === currentStatusIndex) return 'text-blue-600';
        return 'text-gray-400';
    };

    const getStatusBg = (status, index) => {
        if (index < currentStatusIndex) return 'bg-green-600';
        if (index === currentStatusIndex) return 'bg-blue-600';
        return 'bg-gray-300';
    };

    return (
        <div className="min-h-screen bg-gray-100 py-4">
            <div className="max-w-4xl mx-auto px-4">
                {/* Back Link */}
                <Link to="/orders" className="inline-flex items-center gap-2 text-blue-600 font-medium mb-4 hover:underline">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to My Orders
                </Link>

                {/* Order Header */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="text-lg font-bold text-gray-800">#{order.order_id}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p className="text-gray-800">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>

                {order.status === 'Cancelled' ? (
                    /* Cancelled Order Banner */
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-red-700">Order Cancelled</h2>
                                <p className="text-gray-600 mt-1">Your order has been cancelled. If any payment was made, the refund will be processed shortly.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                    {/* Order Status Timeline */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-6">Order Status</h2>

                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                            <div
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{ width: `${(currentStatusIndex / (statusFlow.length - 1)) * 100}%` }}
                            ></div>
                        </div>

                        {/* Status Steps */}
                        <div className="relative flex justify-between">
                            {statusFlow.map((status, index) => (
                                <div key={status} className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${getStatusBg(status, index)} transition-all`}>
                                        {index < currentStatusIndex ? (
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : index === currentStatusIndex ? (
                                            <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <span className="text-white font-bold text-sm">{index + 1}</span>
                                        )}
                                    </div>
                                    <p className={`mt-2 text-sm font-medium ${getStatusColor(status, index)}`}>{status}</p>
                                    {index === currentStatusIndex && (
                                        <p className="text-xs text-gray-500 mt-1">In Progress</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Message */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-blue-800 font-medium">
                            {order.status === 'Pending' && 'Your order has been placed and is waiting for confirmation.'}
                            {order.status === 'Processing' && 'Your order is being processed and will be shipped soon.'}
                            {order.status === 'Shipped' && 'Your order has been shipped and is on its way.'}
                            {order.status === 'Delivered' && 'Your order has been delivered successfully!'}
                            {order.status === 'Cancelled' && 'This order has been cancelled.'}
                        </p>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Delivery Address</h2>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">{order.shipping_name}</p>
                            <p className="text-gray-600">{order.shipping_address}</p>
                            <p className="text-gray-600">{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
                            <p className="text-gray-600 mt-1">Phone: {order.shipping_phone}</p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Order Items ({order.items?.length || 0})</h2>
                    <div className="space-y-4">
                        {order.items?.map((item, index) => (
                            <div key={index} className="flex gap-4 p-3 border border-gray-100 rounded-lg">
                                <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <img
                                        src={getImageUrl(item.product_image) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTIiBmaWxsPSIjOTk5Ij5JbWFnZTwvdGV4dD48L3N2Zz4='}
                                        alt={item.product_name}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{item.product_name}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    <p className="font-bold text-gray-800 mt-1">₹{item.price}</p>

                                    {/* Return/Cancel Buttons */}
                                    {order.status === 'Delivered' && (
                                        <button
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setShowReturnModal(true);
                                            }}
                                            className="mt-2 flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Return Item
                                        </button>
                                    )}
                                    {['Pending', 'Processing'].includes(order.status) && (
                                        <button
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setShowCancelModal(true);
                                            }}
                                            className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Cancel Item
                                        </button>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Price Summary */}
                    <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Item Total</span>
                            <span>₹{order.total_amount}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Delivery</span>
                            <span className="text-green-600">FREE</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                            <span>Total</span>
                            <span>₹{order.total_amount}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Details</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600">Payment Method</p>
                            <p className="font-medium text-gray-800">
                                {order.payment_method === 'COD' && 'Cash on Delivery'}
                                {order.payment_method === 'UPI' && 'UPI'}
                                {order.payment_method === 'Card' && 'Card'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-600">Amount Paid</p>
                            <p className="font-bold text-xl text-green-600">₹{order.total_amount}</p>
                        </div>
                    </div>
                </div>
                    </>
                )}
            </div>

            {/* Return Modal */}
            {showReturnModal && selectedItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Request Return</h3>
                            <button onClick={() => setShowReturnModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium text-gray-800">{selectedItem.product_name}</p>
                            <p className="text-sm text-gray-500">Qty: {selectedItem.quantity} | ₹{selectedItem.price * selectedItem.quantity}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Return *</label>
                            <select
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="">Select a reason</option>
                                <option value="Defective">Defective/Damaged Product</option>
                                <option value="Wrong Item">Wrong Item Received</option>
                                <option value="Not As Described">Not As Described</option>
                                <option value="Size Issue">Size/Fit Issue</option>
                                <option value="Changed Mind">Changed Mind</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details (Optional)</label>
                            <textarea
                                value={returnDescription}
                                onChange={(e) => setReturnDescription(e.target.value)}
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Please provide more details about your return..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowReturnModal(false)}
                                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReturnRequest}
                                disabled={submitting}
                                className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting...' : 'Submit Return Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {showCancelModal && selectedItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Request Cancellation</h3>
                            <button onClick={() => setShowCancelModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium text-gray-800">{selectedItem.product_name}</p>
                            <p className="text-sm text-gray-500">Qty: {selectedItem.quantity} | ₹{selectedItem.price * selectedItem.quantity}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Cancellation *</label>
                            <select
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="">Select a reason</option>
                                <option value="Changed Mind">Changed Mind</option>
                                <option value="Found Better Price">Found Better Price Elsewhere</option>
                                <option value="Delivery Delay">Delivery Taking Too Long</option>
                                <option value="Ordered By Mistake">Ordered By Mistake</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details (Optional)</label>
                            <textarea
                                value={cancelDescription}
                                onChange={(e) => setCancelDescription(e.target.value)}
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="Please provide more details about your cancellation..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCancelRequest}
                                disabled={submitting}
                                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting...' : 'Submit Cancellation Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
