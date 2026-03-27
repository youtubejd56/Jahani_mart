import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SEO from '../components/SEO';

const Support = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('help');
    const [tickets, setTickets] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewTicket, setShowNewTicket] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [userOrders, setUserOrders] = useState([]);

    const [newTicket, setNewTicket] = useState({
        ticket_type: 'Order',
        subject: '',
        description: '',
        order_id: '',
        priority: 'Medium'
    });

    const ticketTypes = [
        { value: 'Order', label: 'Order Related' },
        { value: 'Product', label: 'Product Inquiry' },
        { value: 'Payment', label: 'Payment Issue' },
        { value: 'Return', label: 'Return & Refund' },
        { value: 'Account', label: 'Account Issue' },
        { value: 'Other', label: 'Other' }
    ];

    const priorities = [
        { value: 'Low', label: 'Low' },
        { value: 'Medium', label: 'Medium' },
        { value: 'High', label: 'High' }
    ];

    useEffect(() => {
        fetchFaqs();
        if (isAuthenticated) {
            fetchTickets();
            fetchUserOrders();
        }
    }, [isAuthenticated]);

    const fetchFaqs = async () => {
        try {
            const response = await api.get('/faqs/');
            setFaqs(response.data);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            // Use default FAQs if none exist
            setFaqs([
                { id: 1, question: 'How do I track my order?', answer: 'Go to My Orders section in your profile to track your order status.', category: 'Orders' },
                { id: 2, question: 'What is the return policy?', answer: 'We offer 30-day returns for most products. Check the product page for specific details.', category: 'Returns' },
                { id: 3, question: 'How do I cancel an order?', answer: 'You can cancel your order before it is shipped. Go to My Orders and select Cancel.', category: 'Orders' },
                { id: 4, question: 'How do I contact customer support?', answer: 'You can use this support page to create a ticket or call us at 1800-XXX-XXXX.', category: 'General' },
                { id: 5, question: 'What payment methods are accepted?', answer: 'We accept UPI, Credit/Debit Cards, Wallets, and Cash on Delivery.', category: 'Payment' },
                { id: 6, question: 'How do I update my profile?', answer: 'Go to My Profile and click on Edit Profile to update your details.', category: 'Account' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTickets = async () => {
        try {
            const response = await api.get('/support/tickets/');
            setTickets(response.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const fetchUserOrders = async () => {
        try {
            const response = await api.get('/orders/');
            setUserOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            await api.post('/support/create/', newTicket);
            setShowNewTicket(false);
            setNewTicket({
                ticket_type: 'Order',
                subject: '',
                description: '',
                order_id: '',
                priority: 'Medium'
            });
            fetchTickets();
            setActiveTab('support');
            alert('Ticket created successfully! We will respond within 24 hours.');
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('Failed to create ticket. Please try again.');
        }
    };

    const handleReply = async (ticketId) => {
        if (!replyMessage.trim()) return;
        try {
            await api.post(`/support/tickets/${ticketId}/reply/`, { message: replyMessage });
            setReplyMessage('');
            fetchTickets();
            // Refresh selected ticket
            const response = await api.get(`/support/tickets/${ticketId}/`);
            setSelectedTicket(response.data);
        } catch (error) {
            console.error('Error sending reply:', error);
            alert('Failed to send reply. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-red-100 text-red-700';
            case 'In Progress': return 'bg-yellow-100 text-yellow-700';
            case 'Resolved': return 'bg-green-100 text-green-700';
            case 'Closed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const groupedFaqs = faqs.reduce((acc, faq) => {
        const category = faq.category || 'General';
        if (!acc[category]) acc[category] = [];
        acc[category].push(faq);
        return acc;
    }, {});

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
                    <p className="text-gray-600 mb-4">You need to login to access customer support.</p>
                    <Link to="/login" className="bg-violet-600 text-white px-6 py-2 rounded-full font-bold hover:bg-violet-700">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <SEO title="Help & Support" description="Need help? Contact Jahani Mart support. Find answers to FAQs, submit tickets, and get assistance with your orders." url="https://jahani-mart.onrender.com/support" />
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Customer Support</h1>
                    <p className="text-gray-600">We're here to help! Choose an option below.</p>
                </div>

                {/* Quick Contact Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('help')}>
                        <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-[#00674F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1">Help Center</h3>
                        <p className="text-sm text-gray-500">Browse FAQs</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setActiveTab('support'); setShowNewTicket(true); }}>
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1">Create Ticket</h3>
                        <p className="text-sm text-gray-500">Submit a request</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('support')}>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1">Call Us</h3>
                        <p className="text-sm text-gray-500">1800-XXX-XXXX</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="flex border-b">
                        <button
                            className={`flex-1 py-4 px-6 font-medium ${activeTab === 'help' ? 'bg-violet-50 text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('help')}
                        >
                            Help Center (FAQs)
                        </button>
                        <button
                            className={`flex-1 py-4 px-6 font-medium ${activeTab === 'support' ? 'bg-violet-50 text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('support')}
                        >
                            My Tickets
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Help Center Tab */}
                        {activeTab === 'help' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Frequently Asked Questions</h2>
                                    <button
                                        onClick={() => { setActiveTab('support'); setShowNewTicket(true); }}
                                        className="bg-[#ffb343] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#ffce1b]"
                                    >
                                        Need More Help?
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {Object.entries(groupedFaqs).map(([category, faqs]) => (
                                            <div key={category}>
                                                <h3 className="font-bold text-gray-700 mb-3">{category}</h3>
                                                <div className="space-y-3">
                                                    {faqs.map((faq) => (
                                                        <details key={faq.id} className="bg-gray-50 rounded-lg">
                                                            <summary className="cursor-pointer p-4 font-medium text-gray-800 hover:bg-gray-100">
                                                                {faq.question}
                                                            </summary>
                                                            <div className="px-4 pb-4 text-gray-600">
                                                                {faq.answer}
                                                            </div>
                                                        </details>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Support Tickets Tab */}
                        {activeTab === 'support' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">My Support Tickets</h2>
                                    <button
                                        onClick={() => setShowNewTicket(true)}
                                        className="bg-[#ffb343] text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-[#ffce1b]"
                                    >
                                        New Ticket
                                    </button>
                                </div>

                                {/* New Ticket Form */}
                                {showNewTicket && (
                                    <div className="bg-violet-50 rounded-xl p-6 mb-6">
                                        <h3 className="font-bold text-gray-800 mb-4">Create New Ticket</h3>
                                        <form onSubmit={handleCreateTicket} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                                                    <select
                                                        value={newTicket.ticket_type}
                                                        onChange={(e) => setNewTicket({ ...newTicket, ticket_type: e.target.value })}
                                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                                        required
                                                    >
                                                        {ticketTypes.map(type => (
                                                            <option key={type.value} value={type.value}>{type.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                                    <select
                                                        value={newTicket.priority}
                                                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                                    >
                                                        {priorities.map(prio => (
                                                            <option key={prio.value} value={prio.value}>{prio.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                                <input
                                                    type="text"
                                                    value={newTicket.subject}
                                                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                                    placeholder="Brief description of your issue"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Order (Optional)</label>
                                                <select
                                                    value={newTicket.order_id}
                                                    onChange={(e) => setNewTicket({ ...newTicket, order_id: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="">Select an order (if related to a specific order)</option>
                                                    {userOrders.map(order => (
                                                        <option key={order.order_id} value={order.order_id}>
                                                            {order.order_id} - {order.items?.map(item => item.product_name).join(', ') || 'Products'} - ₹{order.total_amount}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                <textarea
                                                    value={newTicket.description}
                                                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-lg h-32"
                                                    placeholder="Please describe your issue in detail..."
                                                    required
                                                />
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    type="submit"
                                                    className="bg-[#ffb343] text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-[#ffce1b]"
                                                >
                                                    Submit Ticket
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewTicket(false)}
                                                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Tickets List */}
                                {tickets.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-gray-800 mb-2">No Tickets Yet</h3>
                                        <p className="text-gray-500 mb-4">You haven't created any support tickets.</p>
                                        <button
                                            onClick={() => setShowNewTicket(true)}
                                            className="text-violet-600 font-medium hover:underline"
                                        >
                                            Create your first ticket
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {tickets.map(ticket => (
                                            <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-mono text-sm text-gray-500">#{ticket.ticket_id}</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                                {ticket.status}
                                                            </span>
                                                        </div>
                                                        <h4 className="font-medium text-gray-800">{ticket.subject}</h4>
                                                        <p className="text-sm text-gray-500">{ticket.ticket_type} • {ticket.priority} Priority</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedTicket(selectedTicket?.ticket_id === ticket.ticket_id ? null : ticket)}
                                                        className="text-violet-600 font-medium text-sm hover:underline"
                                                    >
                                                        {selectedTicket?.ticket_id === ticket.ticket_id ? 'Hide' : 'View'}
                                                    </button>
                                                </div>

                                                {/* Ticket Details & Replies */}
                                                {selectedTicket?.ticket_id === ticket.ticket_id && (
                                                    <div className="mt-4 pt-4 border-t">
                                                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                                                            <p className="text-xs text-gray-500 mt-2">
                                                                Created: {new Date(ticket.created_at).toLocaleString()}
                                                            </p>
                                                        </div>

                                                        {/* Replies */}
                                                        {ticket.replies && ticket.replies.length > 0 && (
                                                            <div className="space-y-3 mb-4">
                                                                {ticket.replies.map((reply, idx) => (
                                                                    <div key={idx} className={`p-3 rounded-lg ${reply.is_admin_reply ? 'bg-violet-50 ml-8' : 'bg-gray-100 mr-8'}`}>
                                                                        <p className="text-sm text-gray-700">{reply.message}</p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {reply.user_name || 'Support'} • {new Date(reply.created_at).toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Reply Form */}
                                                        {ticket.status !== 'Closed' && (
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={replyMessage}
                                                                    onChange={(e) => setReplyMessage(e.target.value)}
                                                                    placeholder="Type your reply..."
                                                                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                                                                />
                                                                <button
                                                                    onClick={() => handleReply(ticket.ticket_id)}
                                                                    className="bg-[#ffb343] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#ffce1b]"
                                                                >
                                                                    Send
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Info */}
                <div className="mt-8 bg-gradient-to-r from-[#00674F] to-[#0A3C30] rounded-xl p-6 text-white text-center">
                    <h3 className="font-bold text-xl mb-2">Still Need Help?</h3>
                    <p className="mb-4">Our customer support team is available 24/7</p>
                    <div className="flex justify-center gap-6">
                        <div>
                            <p className="font-bold">Call</p>
                            <p className="text-violet-200">+91 7356777557</p>
                        </div>
                        <div>
                            <p className="font-bold">Email</p>
                            <p className="text-violet-200">jahaniinternational@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
