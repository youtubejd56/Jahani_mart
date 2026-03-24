import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Helper function to get admin axios instance with JWT token
const getAdminAxios = () => {
    const token = localStorage.getItem('admin_access_token');
    return axios.create({
        baseURL: import.meta.env.VITE_API_URL || '/api',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [supportTickets, setSupportTickets] = useState([]);
    const [stories, setStories] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Form states
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryForm, setCategoryForm] = useState({ name: '', icon: '', image_url: '', image: null });
    const [categoryImagePreview, setCategoryImagePreview] = useState(null);

    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '', description: '', price: '', original_price: '',
        discount: '0', stock: '0', category: '', image_url: '', is_active: true,
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [allCategories, setAllCategories] = useState([]);

    // Blog & Story Form States
    const [showBlogForm, setShowBlogForm] = useState(false);
    const [editingBlogPost, setEditingBlogPost] = useState(null);
    const [blogPostForm, setBlogPostForm] = useState({ title: '', excerpt: '', date: '', category: '', image_url: '', content: '' });

    const [showStoryForm, setShowStoryForm] = useState(false);
    const [editingStory, setEditingStory] = useState(null);
    const [storyForm, setStoryForm] = useState({ title: '', description: '', image_url: '', order: 0, is_reversed: false });

    // Check if admin is logged in
    const adminId = localStorage.getItem('admin_token');
    const adminToken = localStorage.getItem('admin_access_token');

    useEffect(() => {
        if (!adminId || !adminToken) {
            navigate('/admin/login');
            return;
        }
        fetchDashboard();
    }, []);

    useEffect(() => {
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'categories') fetchCategories();
        if (activeTab === 'products') {
            fetchCategories();
            fetchProducts();
        }
        if (activeTab === 'reviews') fetchReviews();
        if (activeTab === 'support') fetchSupportTickets();
        if (activeTab === 'stories') fetchStories();
        if (activeTab === 'blog') fetchBlogPosts();
    }, [activeTab]);

    const fetchDashboard = async () => {
        try {
            const response = await getAdminAxios().get('admin/dashboard/');
            setOrders(response.data.orders);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            if (error.response?.status === 403 || error.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await getAdminAxios().get('admin/users/');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getAdminAxios().get('admin/categories/');
            setCategories(response.data);
            setAllCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await getAdminAxios().get('admin/products/');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await getAdminAxios().get('admin/reviews/');
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const fetchSupportTickets = async () => {
        try {
            const response = await getAdminAxios().get('admin/support/tickets/');
            setSupportTickets(response.data);
        } catch (error) {
            console.error('Error fetching support tickets:', error);
        }
    };

    const fetchStories = async () => {
        try {
            const response = await getAdminAxios().get('admin/stories/');
            setStories(response.data);
        } catch (error) {
            console.error('Error fetching stories:', error);
        }
    };

    const fetchBlogPosts = async () => {
        try {
            const response = await getAdminAxios().get('admin/blog/');
            setBlogPosts(response.data);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
        }
    };

    // Story CRUD handlers
    const handleStorySubmit = async () => {
        try {
            if (editingStory) {
                await getAdminAxios().put(`admin/stories/${editingStory}/`, storyForm);
            } else {
                await getAdminAxios().post('admin/stories/', storyForm);
            }
            fetchStories();
            setShowStoryForm(false);
            setEditingStory(null);
            setStoryForm({ title: '', description: '', image_url: '', order: 0, is_reversed: false });
        } catch (error) {
            console.error('Story save error:', error.response?.data);
            alert('Failed to save story section');
        }
    };

    const handleEditStory = (story) => {
        setEditingStory(story.id);
        setStoryForm({
            title: story.title,
            description: story.description || '',
            image_url: story.image_url || '',
            order: story.order,
            is_reversed: story.is_reversed,
        });
        setShowStoryForm(true);
    };

    const handleDeleteStory = async (id) => {
        if (!window.confirm('Delete this story section?')) return;
        try {
            await getAdminAxios().delete(`admin/stories/${id}/`);
            fetchStories();
        } catch (error) {
            alert('Failed to delete story section');
        }
    };

    // Blog CRUD handlers
    const handleBlogSubmit = async () => {
        try {
            if (editingBlogPost) {
                await getAdminAxios().put(`admin/blog/${editingBlogPost}/`, blogPostForm);
            } else {
                await getAdminAxios().post('admin/blog/', blogPostForm);
            }
            fetchBlogPosts();
            setShowBlogForm(false);
            setEditingBlogPost(null);
            setBlogPostForm({ title: '', excerpt: '', date: '', category: '', image_url: '', content: '' });
        } catch (error) {
            console.error('Blog post save error:', error.response?.data);
            alert('Failed to save blog post');
        }
    };

    const handleEditBlogPost = (post) => {
        setEditingBlogPost(post.id);
        setBlogPostForm({
            title: post.title,
            excerpt: post.excerpt || '',
            content: post.content || '',
            category: post.category || '',
            image_url: post.image_url || '',
            date: post.date || '',
        });
        setShowBlogForm(true);
    };

    const handleDeleteBlogPost = async (id) => {
        if (!window.confirm('Delete this blog post?')) return;
        try {
            await getAdminAxios().delete(`admin/blog/${id}/`);
            fetchBlogPosts();
        } catch (error) {
            alert('Failed to delete blog post');
        }
    };

    const handleTicketReply = async (ticketId, message, status) => {
        try {
            await getAdminAxios().post(`admin/support/tickets/${ticketId}/reply/`, { message, status });
            fetchSupportTickets();
            if (selectedTicket && selectedTicket.ticket_id === ticketId) {
                const response = await getAdminAxios().get(`admin/support/tickets/${ticketId}/`);
                setSelectedTicket(response.data);
            }
        } catch (error) {
            console.error('Error replying to ticket:', error);
            alert('Failed to send reply');
        }
    };

    const handleTicketStatusUpdate = async (ticketId, status) => {
        try {
            await getAdminAxios().put(`admin/support/tickets/${ticketId}/status/`, { status });
            fetchSupportTickets();
        } catch (error) {
            console.error('Error updating ticket status:', error);
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await getAdminAxios().delete(`reviews/${id}/`);
            fetchReviews();
        } catch (error) {
            alert('Failed to delete review');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_access_token');
        navigate('/admin/login');
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await getAdminAxios().put(`admin/orders/${orderId}/`, { status: newStatus });
            fetchDashboard();
            setSelectedOrder(null);
        } catch (error) {
            alert('Failed to update order status');
        }
    };

    // Category functions
    const handleCategoryFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCategoryForm({ ...categoryForm, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setCategoryImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', categoryForm.name);
            formData.append('icon', categoryForm.icon);
            formData.append('image_url', categoryForm.image_url);

            if (categoryForm.image) {
                formData.append('image', categoryForm.image);
            }

            const adminAxios = getAdminAxios();
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editingCategory) {
                await adminAxios.put(`admin/categories/${editingCategory}/`, formData, config);
            } else {
                await adminAxios.post('admin/categories/', formData, config);
            }
            fetchCategories();
            setShowCategoryForm(false);
            setEditingCategory(null);
            setCategoryImagePreview(null);
            setCategoryForm({ name: '', icon: '', image_url: '', image: null });
        } catch (error) {
            console.error('Category save error:', error.response?.data);
            alert('Failed to save category');
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category.id);
        setCategoryForm({
            name: category.name,
            icon: category.icon || '',
            image_url: category.image_url || '',
            image: null
        });
        setCategoryImagePreview(null);
        setShowCategoryForm(true);
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await getAdminAxios().delete(`admin/categories/${id}/`);
            fetchCategories();
        } catch (error) {
            alert('Failed to delete category');
        }
    };

    // Product functions
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductForm({ ...productForm, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', productForm.name);
            formData.append('description', productForm.description);
            formData.append('price', productForm.price);
            if (productForm.original_price) formData.append('original_price', productForm.original_price);
            formData.append('discount', productForm.discount);
            formData.append('stock', productForm.stock);
            if (productForm.category) formData.append('category', productForm.category);
            formData.append('is_active', productForm.is_active);
            formData.append('image_url', productForm.image_url);

            if (productForm.image) {
                formData.append('image', productForm.image);
            }

            const adminAxios = getAdminAxios();
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editingProduct) {
                await adminAxios.put(`admin/products/${editingProduct}/`, formData, config);
            } else {
                await adminAxios.post('admin/products/', formData, config);
            }
            fetchProducts();
            setShowProductForm(false);
            setEditingProduct(null);
            setImagePreview(null);
            setProductForm({
                name: '', description: '', price: '', original_price: '',
                discount: '0', stock: '0', category: '', image_url: '', is_active: true,
                image: null
            });
        } catch (error) {
            console.error('Save error:', error.response?.data);
            alert('Failed to save product: ' + (error.response?.data?.name || error.message));
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product.id);
        const currentCategory = allCategories.find(c => c.name === product.category_name);
        setProductForm({
            name: product.name,
            description: product.description || '',
            price: product.price,
            original_price: product.original_price || '',
            discount: product.discount || '0',
            stock: product.stock,
            category: currentCategory ? currentCategory.id : product.category,
            image_url: product.image_url || '',
            is_active: product.is_active,
            image: null
        });
        setImagePreview(null);
        setShowProductForm(true);
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await getAdminAxios().delete(`admin/products/${id}/`);
            fetchProducts();
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Shipped': return 'bg-purple-100 text-purple-700';
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (!adminId || !adminToken) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                {/* Logo */}
                <div className="p-4 border-b border-gray-700">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-yellow-400 px-2 py-1 rounded">
                            <span className="text-lg font-bold text-gray-900">J</span>
                        </div>
                        <span className="font-bold">Admin Panel</span>
                    </Link>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-yellow-400 text-gray-900' : 'hover:bg-gray-800'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Orders
                    </button>

                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-yellow-400 text-gray-900' : 'hover:bg-gray-800'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Customers
                    </button>

                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'categories' ? 'bg-yellow-400 text-gray-900' : 'hover:bg-gray-800'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        Categories
                    </button>

                    <button
                        onClick={() => setActiveTab('products')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-yellow-400 text-gray-900' : 'hover:bg-gray-800'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Products
                    </button>

                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'reviews' ? 'bg-yellow-400 text-gray-900' : 'hover:bg-gray-800'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Reviews
                    </button>

                    <button
                        onClick={() => setActiveTab('support')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'support' ? 'bg-yellow-400 text-gray-900' : 'hover:bg-gray-800'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Support Tickets
                        {supportTickets.filter(t => t.status === 'Open').length > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {supportTickets.filter(t => t.status === 'Open').length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('stories')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'stories' ? 'bg-yellow-400 text-gray-900' : 'hover:bg-gray-800'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Story Management
                    </button>

                    <button
                        onClick={() => setActiveTab('blog')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'blog' ? 'bg-yellow-400 text-gray-900' : 'hover:bg-gray-800'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                        </svg>
                        Blog Posts
                    </button>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-red-400"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">
                        {activeTab === 'orders' && 'Order Management'}
                        {activeTab === 'users' && 'Customer Management'}
                        {activeTab === 'categories' && 'Category Management'}
                        {activeTab === 'products' && 'Product Management'}
                        {activeTab === 'reviews' && 'Review Management'}
                        {activeTab === 'support' && 'Customer Support Requests'}
                        {activeTab === 'stories' && 'Story Management'}
                        {activeTab === 'blog' && 'Blog Post Management'}
                    </h1>
                </header>

                {/* Orders */}
                {activeTab === 'orders' && stats && (
                    <div className="p-6 grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.total_orders}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <p className="text-sm text-gray-500">Processing</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <p className="text-sm text-gray-500">Shipped</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <p className="text-sm text-gray-500">Delivered</p>
                            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <p className="text-sm text-gray-500">Revenue</p>
                            <p className="text-2xl font-bold text-gray-800">₹{stats.total_revenue}</p>
                        </div>
                    </div>
                )}

                {/* Orders Table */}
                {activeTab === 'orders' && (
                    <div className="p-6">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                {order.order_id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-800">{order.customer.name}</div>
                                                <div className="text-xs text-gray-500">{order.customer.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {order.items_count} item(s)
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-800">
                                                ₹{order.total_amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {order.created_at}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                {activeTab === 'users' && (
                    <div className="p-6">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-800">
                                                    {user.first_name} {user.last_name}
                                                </div>
                                                <div className="text-xs text-gray-500">@{user.username}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-blue-600">
                                                {user.order_count} orders
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {user.date_joined}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Categories Management */}
                {activeTab === 'categories' && (
                    <div className="p-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-gray-800">Categories</h2>
                                <button
                                    onClick={() => { setShowCategoryForm(true); setEditingCategory(null); setCategoryImagePreview(null); setCategoryForm({ name: '', icon: '', image_url: '', image: null }); }}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg"
                                >
                                    Add Category
                                </button>
                            </div>

                            {showCategoryForm && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-bold mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Category Name"
                                                value={categoryForm.name}
                                                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Icon (emoji or URL)"
                                                value={categoryForm.icon}
                                                onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category Image URL (External)</label>
                                            <input
                                                type="url"
                                                placeholder="https://example.com/image.jpg"
                                                value={categoryForm.image_url}
                                                onChange={(e) => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Or Upload Image File</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleCategoryFileChange}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                                                />
                                                {categoryImagePreview && (
                                                    <div className="relative group">
                                                        <img src={categoryImagePreview} alt="Preview" className="w-12 h-12 object-cover rounded shadow-sm border border-gray-200" />
                                                        <button
                                                            type="button"
                                                            onClick={() => { setCategoryImagePreview(null); setCategoryForm({ ...categoryForm, image: null }); }}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 text-sm">
                                            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg">
                                                {editingCategory ? 'Update' : 'Add'}
                                            </button>
                                            <button type="button" onClick={() => setShowCategoryForm(false)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {categories.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-600">{cat.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                                        {cat.image || (cat.icon && cat.icon.startsWith('http')) ? (
                                                            <img src={getImageUrl(cat.image || cat.icon)} alt={cat.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xl">{cat.icon || cat.name[0]}</span>
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{cat.icon && !cat.icon.startsWith('http') ? cat.icon : '-'}</td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => handleEditCategory(cat)} className="text-blue-600 hover:text-blue-800 mr-3 text-sm font-medium">Edit</button>
                                                <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Products Management */}
                {activeTab === 'products' && (
                    <div className="p-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-gray-800">Products</h2>
                                <button
                                    onClick={() => { setShowProductForm(true); setEditingProduct(null); setImagePreview(null); setProductForm({ name: '', description: '', price: '', original_price: '', discount: '0', stock: '0', category: '', image_url: '', is_active: true, image: null }); }}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg"
                                >
                                    Add Product
                                </button>
                            </div>



                            {showProductForm && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                    <form onSubmit={handleProductSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Product Name"
                                                value={productForm.name}
                                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                required
                                            />
                                            <select
                                                value={productForm.category}
                                                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {allCategories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <textarea
                                            placeholder="Description"
                                            value={productForm.description}
                                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            rows={3}
                                        />
                                        <div className="grid grid-cols-4 gap-4">
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                value={productForm.price}
                                                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                required
                                            />
                                            <input
                                                type="number"
                                                placeholder="Original Price"
                                                value={productForm.original_price}
                                                onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Discount %"
                                                value={productForm.discount}
                                                onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Stock"
                                                value={productForm.stock}
                                                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Image URL</label>
                                                <input
                                                    type="url"
                                                    placeholder="Paste image URL here"
                                                    value={productForm.image_url}
                                                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Or Upload Image File</label>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        key={editingProduct ? `edit-${editingProduct}` : 'new-product'}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                                                    />
                                                    {imagePreview && (
                                                        <div className="relative group">
                                                            <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded shadow-sm border border-gray-200" />
                                                            <button
                                                                type="button"
                                                                onClick={() => { setImagePreview(null); setProductForm({ ...productForm, image: null }); }}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-gray-400 mt-1 italic">Uploading a file will take priority over the Image URL.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={productForm.is_active}
                                                onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                                                id="is_active"
                                            />
                                            <label htmlFor="is_active">Active</label>
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
                                                {editingProduct ? 'Update' : 'Add'}
                                            </button>
                                            <button type="button" onClick={() => setShowProductForm(false)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-600">{product.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {product.image_url || product.image ? (
                                                        <img src={getImageUrl(product.image_url || product.image)} alt={product.name} className="w-10 h-10 object-cover rounded" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded text-[10px] text-gray-400">No Image</div>
                                                    )}
                                                    <span className="text-sm font-medium text-gray-800">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{product.category_name}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-800">₹{product.price}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {product.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Reviews Management */}
                {activeTab === 'reviews' && (
                    <div className="p-6">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {reviews.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No reviews found</td>
                                        </tr>
                                    ) : (
                                        reviews.map((review) => (
                                            <tr key={review.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {review.product_name || `Product #${review.product}`}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {review.user_name || `User #${review.user}`}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <svg
                                                                key={star}
                                                                className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                        <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                                    {review.title}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {review.is_verified_purchase ? (
                                                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Verified</span>
                                                    ) : (
                                                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Not Verified</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleDeleteReview(review.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Support Tickets Management */}
                {activeTab === 'support' && (
                    <div className="p-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <p className="text-sm text-gray-500">Total Tickets</p>
                                <p className="text-2xl font-bold text-gray-800">{supportTickets.length}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <p className="text-sm text-gray-500">Open</p>
                                <p className="text-2xl font-bold text-red-600">{supportTickets.filter(t => t.status === 'Open').length}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <p className="text-sm text-gray-500">In Progress</p>
                                <p className="text-2xl font-bold text-yellow-600">{supportTickets.filter(t => t.status === 'In Progress').length}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <p className="text-sm text-gray-500">Resolved</p>
                                <p className="text-2xl font-bold text-green-600">{supportTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length}</p>
                            </div>
                        </div>

                        {/* Tickets List */}
                        <div className="bg-white rounded-lg shadow-sm">
                            {supportTickets.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="font-medium">No support tickets yet</p>
                                    <p className="text-sm">Customer support tickets will appear here</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {supportTickets.map(ticket => (
                                        <div key={ticket.id} className="p-4 hover:bg-gray-50">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-mono text-sm text-gray-500">#{ticket.ticket_id}</span>
                                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${ticket.status === 'Open' ? 'bg-red-100 text-red-700' :
                                                            ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                                                ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {ticket.status}
                                                        </span>
                                                        <span className="px-2 py-0.5 text-xs bg-violet-100 text-violet-700 rounded-full">
                                                            {ticket.ticket_type}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-medium text-gray-800">{ticket.subject}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {ticket.description.substring(0, 100)}...
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                        <span>Priority: {ticket.priority}</span>
                                                        <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                const response = await getAdminAxios().get(`admin/support/tickets/${ticket.ticket_id}/`);
                                                                setSelectedTicket(response.data);
                                                            } catch (error) {
                                                                console.error('Error fetching ticket:', error);
                                                            }
                                                        }}
                                                        className="px-3 py-1 text-sm bg-violet-600 text-white rounded hover:bg-violet-700"
                                                    >
                                                        View
                                                    </button>
                                                    <select
                                                        value={ticket.status}
                                                        onChange={(e) => handleTicketStatusUpdate(ticket.ticket_id, e.target.value)}
                                                        className="px-2 py-1 text-sm border rounded"
                                                    >
                                                        <option value="Open">Open</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Resolved">Resolved</option>
                                                        <option value="Closed">Closed</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Story Management */}
                {activeTab === 'stories' && (
                    <div className="p-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">About Us Story Sections</h2>
                                <button
                                    onClick={() => {
                                        setShowStoryForm(true);
                                        setEditingStory(null);
                                        setStoryForm({ title: '', description: '', image_url: '', order: stories.length + 1, is_reversed: false });
                                    }}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg"
                                >
                                    Add Section
                                </button>
                            </div>

                            {showStoryForm && (
                                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-bold text-lg mb-4">{editingStory ? 'Edit Story Section' : 'New Story Section'}</h3>
                                    <form className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                                <input
                                                    type="text"
                                                    value={storyForm.title}
                                                    onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-lg"
                                                    placeholder="e.g., Growing"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                                                <input
                                                    type="number"
                                                    value={storyForm.order}
                                                    onChange={(e) => setStoryForm({ ...storyForm, order: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-lg"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Content / Description</label>
                                            <textarea
                                                value={storyForm.description}
                                                onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                                rows={5}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                                <input
                                                    type="text"
                                                    value={storyForm.image_url}
                                                    onChange={(e) => setStoryForm({ ...storyForm, image_url: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-lg"
                                                />
                                            </div>
                                            <div className="flex items-center mt-6">
                                                <input
                                                    type="checkbox"
                                                    id="reversed"
                                                    checked={storyForm.is_reversed}
                                                    onChange={(e) => setStoryForm({ ...storyForm, is_reversed: e.target.checked })}
                                                    className="w-4 h-4 text-yellow-400 border-gray-300 rounded"
                                                />
                                                <label htmlFor="reversed" className="ml-2 text-sm text-gray-700">Reverse Layout (Image on Right)</label>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <button type="button" onClick={handleStorySubmit} className="bg-[#00674F] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#005040] transition-colors">Save Section</button>
                                            <button type="button" onClick={() => { setShowStoryForm(false); setEditingStory(null); }} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="space-y-4">
                                {stories.map(story => (
                                    <div key={story.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-400 font-bold">#{story.order}</span>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{story.title}</h4>
                                                <span className="text-xs text-gray-500">{story.is_reversed ? 'Right-aligned image' : 'Left-aligned image'}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditStory(story)} className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded font-medium transition-colors">Edit</button>
                                            <button onClick={() => handleDeleteStory(story.id)} className="text-red-600 hover:bg-red-50 px-3 py-1 rounded font-medium transition-colors">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Blog Management */}
                {activeTab === 'blog' && (
                    <div className="p-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Blog Posts</h2>
                                <button
                                    onClick={() => {
                                        setShowBlogForm(true);
                                        setEditingBlogPost(null);
                                        setBlogPostForm({ title: '', excerpt: '', date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), category: '', image_url: '', content: '' });
                                    }}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg"
                                >
                                    Create Post
                                </button>
                            </div>

                            {showBlogForm && (
                                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-bold text-lg mb-4">{editingBlogPost ? 'Edit Post' : 'New Blog Post'}</h3>
                                    <form className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Post Title</label>
                                                <input
                                                    type="text"
                                                    value={blogPostForm.title}
                                                    onChange={(e) => setBlogPostForm({ ...blogPostForm, title: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                                <input
                                                    type="text"
                                                    value={blogPostForm.category}
                                                    onChange={(e) => setBlogPostForm({ ...blogPostForm, category: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-lg"
                                                    placeholder="e.g., Guides"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Summary)</label>
                                            <textarea
                                                value={blogPostForm.excerpt}
                                                onChange={(e) => setBlogPostForm({ ...blogPostForm, excerpt: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                                rows={2}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                            <input
                                                type="text"
                                                value={blogPostForm.image_url}
                                                onChange={(e) => setBlogPostForm({ ...blogPostForm, image_url: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Post Content (HTML/Markdown supported)</label>
                                            <textarea
                                                value={blogPostForm.content}
                                                onChange={(e) => setBlogPostForm({ ...blogPostForm, content: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                                rows={10}
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <button type="button" onClick={handleBlogSubmit} className="bg-[#00674F] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#005040] transition-colors">{editingBlogPost ? 'Update Post' : 'Publish Post'}</button>
                                            <button type="button" onClick={() => { setShowBlogForm(false); setEditingBlogPost(null); }} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="bg-white rounded-lg border overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {blogPosts.map(post => (
                                            <tr key={post.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-800">{post.title}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-bold">{post.category}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{post.date}</td>
                                                <td className="px-6 py-4 text-sm font-medium flex gap-4">
                                                    <button onClick={() => handleEditBlogPost(post)} className="text-blue-600 hover:text-blue-900 font-semibold transition-colors">Edit</button>
                                                    <button onClick={() => handleDeleteBlogPost(post.id)} className="text-red-600 hover:text-red-900 font-semibold transition-colors">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                                    <p className="text-sm text-gray-500">Order #{selectedOrder.order_id}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-bold text-gray-800 mb-2">Customer Information</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="font-medium">{selectedOrder.customer.name}</p>
                                    <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-bold text-gray-800 mb-2">Shipping Address</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="font-medium">{selectedOrder.shipping.name}</p>
                                    <p className="text-sm text-gray-600">{selectedOrder.shipping.phone}</p>
                                    <p className="text-sm text-gray-600">{selectedOrder.shipping.address}</p>
                                    <p className="text-sm text-gray-600">
                                        {selectedOrder.shipping.city}, {selectedOrder.shipping.state} - {selectedOrder.shipping.pincode}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-bold text-gray-800 mb-2">Order Items</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span>{item.product_name} × {item.quantity}</span>
                                            <span className="font-medium">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>₹{selectedOrder.total_amount}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-800 mb-2">Update Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => updateOrderStatus(selectedOrder.order_id, status)}
                                            disabled={selectedOrder.status === status}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedOrder.status === status
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Support Ticket Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Support Ticket</h2>
                                    <p className="text-sm text-gray-500">Ticket #{selectedTicket.ticket_id}</p>
                                </div>
                                <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Ticket Info */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex gap-2 mb-3">
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${selectedTicket.status === 'Open' ? 'bg-red-100 text-red-700' :
                                        selectedTicket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {selectedTicket.status}
                                    </span>
                                    <span className="px-2 py-0.5 text-xs bg-violet-100 text-violet-700 rounded-full">
                                        {selectedTicket.ticket_type}
                                    </span>
                                    <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                                        {selectedTicket.priority} Priority
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">{selectedTicket.subject}</h3>
                                <p className="text-gray-600 whitespace-pre-wrap">{selectedTicket.description}</p>
                                <div className="mt-3 text-xs text-gray-500">
                                    Created: {new Date(selectedTicket.created_at).toLocaleString()}
                                    {selectedTicket.order_id && <span className="ml-4">Order: {selectedTicket.order_id}</span>}
                                </div>
                            </div>

                            {/* Replies */}
                            {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-bold text-gray-800 mb-2">Conversation</h4>
                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {selectedTicket.replies.map((reply, idx) => (
                                            <div key={idx} className={`p-3 rounded-lg ${reply.is_admin_reply ? 'bg-violet-50 ml-8' : 'bg-gray-100 mr-8'}`}>
                                                <p className="text-sm text-gray-700">{reply.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {reply.user_name || 'User'} • {new Date(reply.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reply Form */}
                            <div className="border-t pt-4">
                                <h4 className="font-bold text-gray-800 mb-2">Reply</h4>
                                <textarea
                                    id="ticketReply"
                                    className="w-full p-3 border rounded-lg mb-3"
                                    rows={3}
                                    placeholder="Type your response to the customer..."
                                ></textarea>
                                <div className="flex justify-between items-center">
                                    <select
                                        id="ticketStatus"
                                        className="p-2 border rounded"
                                        defaultValue={selectedTicket.status}
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedTicket(null)}
                                            className="px-4 py-2 border rounded hover:bg-gray-50"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={() => {
                                                const message = document.getElementById('ticketReply').value;
                                                const status = document.getElementById('ticketStatus').value;
                                                if (message.trim()) {
                                                    handleTicketReply(selectedTicket.ticket_id, message, status);
                                                    setSelectedTicket(null);
                                                }
                                            }}
                                            className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
                                        >
                                            Send Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
