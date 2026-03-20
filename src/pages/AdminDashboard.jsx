import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Plus, Edit2, Trash2, Package, Upload, X, ChevronLeft, ChevronRight,
    Save, BarChart2, ShoppingBag, Users, Star, Search, Check, AlertCircle,
    Image as ImageIcon, GripVertical, Eye, Zap, TrendingUp, Calendar, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const API = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000"))));
const CATEGORIES = ['Cookware', 'Gadgets', 'Dining', 'Storage', 'Baking', 'Appliances', 'Other'];

// ─── Image Carousel (for Product Preview) ───────────────────────────────────
const ImageCarousel = ({ images, baseUrl = API }) => {
    const [idx, setIdx] = useState(0);
    const urls = images?.length > 0
        ? images.map(img => `${baseUrl}${img.url}`)
        : ['https://placehold.co/600x400?text=No+Image'];

    useEffect(() => { setIdx(0); }, [images?.length]);

    return (
        <div className="carousel-wrap">
            <div className="carousel-main">
                <img src={urls[idx]} alt={`Product image ${idx + 1}`} className="carousel-img" />
                {urls.length > 1 && (
                    <>
                        <button className="carousel-btn prev" onClick={() => setIdx(i => (i - 1 + urls.length) % urls.length)}>
                            <ChevronLeft size={20} />
                        </button>
                        <button className="carousel-btn next" onClick={() => setIdx(i => (i + 1) % urls.length)}>
                            <ChevronRight size={20} />
                        </button>
                        <div className="carousel-dots">
                            {urls.map((_, i) => (
                                <button key={i} className={`dot ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)} />
                            ))}
                        </div>
                    </>
                )}
            </div>
            {urls.length > 1 && (
                <div className="carousel-thumbs">
                    {urls.map((u, i) => (
                        <div key={i} className={`thumb-wrap ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)}>
                            <img src={u} alt={`Thumb ${i + 1}`} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Image Upload Zone ────────────────────────────────────────────────────────
const ImageUploadZone = ({ existingImages, onNewFiles, onDeleteExisting, onReorder }) => {
    const [newPreviews, setNewPreviews] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [dragOverIdx, setDragOverIdx] = useState(null);
    const fileInputRef = useRef();

    const processFiles = (files) => {
        const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
        const previews = valid.map(f => ({ file: f, url: URL.createObjectURL(f) }));
        setNewPreviews(prev => [...prev, ...previews]);
        onNewFiles(prev => [...prev, ...valid]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        processFiles(e.dataTransfer.files);
    };

    const removeNew = (i) => {
        URL.revokeObjectURL(newPreviews[i].url);
        setNewPreviews(prev => prev.filter((_, j) => j !== i));
        onNewFiles(prev => prev.filter((_, j) => j !== i));
    };

    return (
        <div className="image-upload-zone">
            {existingImages?.length > 0 && (
                <div className="existing-images">
                    <p className="img-section-label">Uploaded Images <span>(drag to reorder)</span></p>
                    <div className="img-grid">
                        {existingImages.map((img, i) => (
                            <div
                                key={img.id}
                                className={`img-tile existing ${dragOverIdx === i ? 'drag-over' : ''}`}
                                draggable
                                onDragStart={e => { e.dataTransfer.setData('existingIdx', i); }}
                                onDragOver={e => { e.preventDefault(); setDragOverIdx(i); }}
                                onDragLeave={() => setDragOverIdx(null)}
                                onDrop={e => {
                                    e.preventDefault();
                                    setDragOverIdx(null);
                                    const from = parseInt(e.dataTransfer.getData('existingIdx'));
                                    if (isNaN(from) || from === i) return;
                                    const reordered = [...existingImages];
                                    const [moved] = reordered.splice(from, 1);
                                    reordered.splice(i, 0, moved);
                                    onReorder(reordered);
                                }}
                            >
                                <img src={`${API}${img.url}`} alt="" />
                                {i === 0 && <span className="primary-badge">Primary</span>}
                                <div className="img-handle"><GripVertical size={14} /></div>
                                <button className="img-delete-btn" type="button" onClick={() => onDeleteExisting(img.id)}>
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div
                className={`drop-zone ${dragging ? 'dragging' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
            >
                <Upload size={28} />
                <p><strong>Drop images here</strong> or click to browse</p>
                <p className="drop-hint">Supports JPG, PNG, WebP — up to 10MB each</p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={e => processFiles(e.target.files)}
                />
            </div>

            {newPreviews.length > 0 && (
                <div className="new-previews">
                    <p className="img-section-label">New images to upload</p>
                    <div className="img-grid">
                        {newPreviews.map((p, i) => (
                            <div key={i} className="img-tile new">
                                <img src={p.url} alt="" />
                                <button className="img-delete-btn" type="button" onClick={() => removeNew(i)}>
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Product Form Modal ───────────────────────────────────────────────────────
const ProductModal = ({ product, onClose, onSaved, token }) => {
    const isEdit = !!product;
    const [form, setForm] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        category: product?.category || '',
        stock: product?.stock || 0,
    });
    const [existingImages, setExistingImages] = useState(product?.images || []);
    const [newFiles, setNewFiles] = useState([]);
    const [deletedIds, setDeletedIds] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [tab, setTab] = useState('details');

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleDeleteExisting = (imgId) => {
        setDeletedIds(prev => [...prev, imgId]);
        setExistingImages(prev => prev.filter(img => img.id !== imgId));
    };

    const handleReorder = (reordered) => {
        setExistingImages(reordered);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.price) { setError('Name and price are required.'); return; }
        setSaving(true);
        setError('');

        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        newFiles.forEach(f => fd.append('images', f));
        if (deletedIds.length > 0) fd.append('deleted_image_ids', JSON.stringify(deletedIds));
        if (existingImages.length > 0) fd.append('image_order', JSON.stringify(existingImages.map(i => i.id)));

        try {
            const res = await fetch(isEdit ? `${API}/api/products/${product.id}` : `${API}/api/products`, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Save failed');
            onSaved(data);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-panel">
                <div className="modal-head">
                    <h2>{isEdit ? '✏️ Edit Product' : '➕ New Product'}</h2>
                    <button className="modal-close-btn" onClick={onClose}><X size={22} /></button>
                </div>

                <div className="modal-tabs">
                    {['details', 'images'].map(t => (
                        <button key={t} className={`modal-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                            {t === 'details' ? <Package size={16} /> : <ImageIcon size={16} />}
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {error && <div className="form-error"><AlertCircle size={16} /> {error}</div>}
                    {tab === 'details' ? (
                        <div className="tab-content-panel">
                            <div className="form-group-full">
                                <label>Product Name *</label>
                                <input name="name" value={form.name} onChange={handleChange} required />
                            </div>
                            <div className="form-row-3">
                                <div className="form-group">
                                    <label>Price (USD) *</label>
                                    <input type="number" name="price" value={form.price} onChange={handleChange} step="0.01" required />
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input type="number" name="stock" value={form.stock} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="category" value={form.category} onChange={handleChange}>
                                        <option value="">— Select —</option>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group-full">
                                <label>Description</label>
                                <textarea name="description" value={form.description} onChange={handleChange} rows={5} />
                            </div>
                        </div>
                    ) : (
                        <div className="tab-content-panel">
                            <ImageUploadZone
                                existingImages={existingImages}
                                onNewFiles={setNewFiles}
                                onDeleteExisting={handleDeleteExisting}
                                onReorder={handleReorder}
                            />
                        </div>
                    )}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-save" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Promotion Modal ─────────────────────────────────────────────────────────
const PromotionModal = ({ promotion, onClose, onSaved, token }) => {
    const isEdit = !!promotion;
    const [form, setForm] = useState({
        title: promotion?.title || '',
        subtitle: promotion?.subtitle || '',
        link: promotion?.link || '',
    });
    const [newFile, setNewFile] = useState(null);
    const [preview, setPreview] = useState(promotion?.image_url ? `${API}${promotion.image_url}` : null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (newFile) fd.append('image', newFile);

        try {
            const res = await fetch(isEdit ? `${API}/api/promotions/${promotion.id}` : `${API}/api/promotions`, {
                method: isEdit ? 'PATCH' : 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Save failed');
            onSaved(data);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-panel">
                <div className="modal-head">
                    <h2>{isEdit ? '✏️ Edit Flash Sale' : '⚡ New Flash Sale'}</h2>
                    <button className="modal-close-btn" onClick={onClose}><X size={22} /></button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    {error && <div className="form-error"><AlertCircle size={16} /> {error}</div>}
                    <div className="tab-content-panel">
                        <div className="form-group-full">
                            <label>Title</label>
                            <input name="title" value={form.title} onChange={handleChange} required />
                        </div>
                        <div className="form-group-full">
                            <label>Subtitle</label>
                            <input name="subtitle" value={form.subtitle} onChange={handleChange} />
                        </div>
                        <div className="form-group-full">
                            <label>Link Destination</label>
                            <input name="link" value={form.link} onChange={handleChange} />
                        </div>
                        <div className="form-group-full">
                            <label>Promotion Banner</label>
                            <div className="promo-preview-wrap" onClick={() => document.getElementById('promo-input').click()}>
                                {preview ? <img src={preview} alt="Preview" /> : <div className="promo-placeholder"><Upload size={32} /><span>Upload Image</span></div>}
                            </div>
                            <input id="promo-input" type="file" hidden onChange={handleFile} accept="image/*" />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-save" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Promotion'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
const AdminDashboard = () => {
    const { user } = useAuth();
    const token = user?.token;

    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showPromoModal, setShowPromoModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingPromo, setEditingPromo] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const tokenOverride = localStorage.getItem('token') || token;
            const headers = tokenOverride ? { Authorization: `Bearer ${tokenOverride}` } : {};

            const [pRes, promRes, ordRes] = await Promise.all([
                fetch(`${API}/api/products`),
                fetch(`${API}/api/promotions`),
                fetch(`${API}/api/orders/all`, { headers })
            ]);

            const pData = await pRes.json();
            const promData = await promRes.json();

            let ordData = [];
            if (ordRes.ok) {
                ordData = await ordRes.json();
            }

            setProducts(Array.isArray(pData) ? pData : []);
            setPromotions(Array.isArray(promData) ? promData : []);
            setOrders(Array.isArray(ordData) ? ordData : []);
        } catch (err) {
            console.error('Failed dashboard data load:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleProductSaved = (saved) => {
        setProducts(prev => {
            const exists = prev.find(p => p.id === saved.id);
            if (exists) return prev.map(p => p.id === saved.id ? saved : p);
            return [saved, ...prev];
        });
        showToast('Product saved!');
    };

    const handlePromoSaved = (saved) => {
        setPromotions(prev => {
            const exists = prev.find(p => p.id === saved.id);
            if (exists) return prev.map(p => p.id === saved.id ? saved : p);
            return [...prev, saved];
        });
        showToast('Promotion saved!');
    };

    const handleDeleteProduct = async (product) => {
        try {
            await fetch(`${API}/api/products/${product.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(prev => prev.filter(p => p.id !== product.id));
            setDeleteConfirm(null);
            showToast('Product deleted.', 'error');
        } catch {
            showToast('Delete failed.', 'error');
        }
    };

    const handleDeletePromo = async (id) => {
        try {
            await fetch(`${API}/api/promotions/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            setPromotions(prev => prev.filter(p => p.id !== id));
            showToast('Promotion deleted.', 'error');
        } catch {
            showToast('Delete failed.', 'error');
        }
    };

    const handleResetCatalog = async () => {
        if (!window.confirm("ARE YOU SURE? This will permanently wipe ALL products and promotions to give you a clean slate for actual data!")) return;

        try {
            await fetch(`${API}/api/products/reset`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast('Catalog completely wiped.');
            fetchData();
        } catch {
            showToast('Failed to wipe catalog.', 'error');
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const tokenOverride = localStorage.getItem('token') || token;
            const res = await fetch(`${API}/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokenOverride}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                showToast(`Order #${orderId} marked as ${newStatus}`);
            }
        } catch {
            showToast('Failed to update status', 'error');
        }
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="admin-access-denied container">
                <AlertCircle size={64} />
                <h2>Access Denied</h2>
                <Link to="/login" className="btn btn-primary">Sign In</Link>
            </div>
        );
    }

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="admin-page">
            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <Zap size={22} className="text-accent" />
                    <span>KitchenAdmin</span>
                </div>
                <nav className="sidebar-nav">
                    <button className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <TrendingUp size={18} /> Overview
                    </button>
                    <button className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                        <Package size={18} /> Orders
                    </button>
                    <button className={`sidebar-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                        <ShoppingBag size={18} /> Inventory
                    </button>
                    <button className={`sidebar-item ${activeTab === 'promotions' ? 'active' : ''}`} onClick={() => setActiveTab('promotions')}>
                        <Zap size={18} /> Campaigns
                    </button>
                    <button className={`sidebar-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
                        <Users size={18} /> Customers
                    </button>
                </nav>
            </aside>

            <div className="admin-main">
                <header className="admin-topbar">
                    <div className="topbar-welcome">
                        <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                        <p>Welcome back, Administrator. Here's what's happening today.</p>
                    </div>
                    <div className="topbar-actions">
                        {activeTab === 'products' && (
                            <button className="btn btn-ghost" style={{ color: '#ef4444' }} onClick={handleResetCatalog}>
                                <Trash2 size={20} /> Wipe Demo Data
                            </button>
                        )}
                        {activeTab === 'promotions' && (
                            <button className="btn btn-accent" onClick={() => { setEditingPromo(null); setShowPromoModal(true); }}>
                                <Plus size={20} /> New Campaign
                            </button>
                        )}
                        <div className="admin-user-pill">
                            <div className="user-avatar">AD</div>
                            <span>System Admin</span>
                        </div>
                    </div>
                </header>

                <div className="stats-ribbon">
                    <div className="stat-box">
                        <span className="stat-label">Total Revenue</span>
                        <span className="stat-value">KES 1,284,050</span>
                        <span className="stat-trend positive">+12.5%</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">Active Orders</span>
                        <span className="stat-value">24</span>
                        <span className="stat-trend">Standard</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">Site Visitors</span>
                        <span className="stat-value">1.2k</span>
                        <span className="stat-trend positive">+5%</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">Inventory Items</span>
                        <span className="stat-value">{products.length}</span>
                        <span className="stat-trend">Live</span>
                    </div>
                </div>

                {activeTab === 'products' && (
                    <div className="admin-content-grid">
                        <div className="product-list-panel">
                            <div className="list-search">
                                <Search size={16} />
                                <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                            <div className="product-rows">
                                <div className="add-product-row" onClick={() => { setEditingProduct(null); setShowModal(true); }}>
                                    <div className="add-icon-circle">
                                        <Plus size={20} />
                                    </div>
                                    <div className="add-row-info">
                                        <p className="add-title">Add New Product</p>
                                        <p className="add-subtitle">Create a new masterpiece in your catalog</p>
                                    </div>
                                    <ArrowRight size={18} className="add-arrow" />
                                </div>
                                {filteredProducts.map(p => (
                                    <div key={p.id} className={`product-row ${selectedProduct?.id === p.id ? 'selected' : ''}`} onClick={() => setSelectedProduct(p)}>
                                        <div className="row-img-wrap"><img src={`${API}${p.image_url}`} alt="" /></div>
                                        <div className="row-info"><p className="row-name">{p.name}</p></div>
                                        <div className="row-price">KES {parseFloat(p.price).toLocaleString()}</div>
                                        <div className="row-actions">
                                            <button className="action-btn edit" onClick={(e) => { e.stopPropagation(); setEditingProduct(p); setShowModal(true); }}><Edit2 size={16} /></button>
                                            <button className="action-btn del" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(p); }}><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="product-detail-panel">
                            {selectedProduct ? (
                                <>
                                    <ImageCarousel images={selectedProduct.images} />
                                    <div className="detail-body">
                                        <h3>{selectedProduct.name}</h3>
                                        <p className="detail-price">KES {parseFloat(selectedProduct.price).toLocaleString()}</p>
                                        <p className="detail-desc">{selectedProduct.description}</p>
                                    </div>
                                </>
                            ) : <div className="detail-empty"><Package size={48} /><p>Select a product to preview</p></div>}
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="admin-items-grid" style={{ gridTemplateColumns: '1fr' }}>
                        {orders.length === 0 ? (
                            <div className="admin-empty-state glass">
                                <Package size={48} />
                                <h3>No Orders Yet</h3>
                                <p>When customers complete a transaction, it will appear here.</p>
                            </div>
                        ) : (
                            <div className="admin-table-container glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                <table className="admin-table w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="p-4 rounded-tl-xl text-sm font-semibold uppercase tracking-wider">Order ID</th>
                                            <th className="p-4 text-sm font-semibold uppercase tracking-wider">Customer</th>
                                            <th className="p-4 text-sm font-semibold uppercase tracking-wider">Date</th>
                                            <th className="p-4 text-sm font-semibold uppercase tracking-wider">Total</th>
                                            <th className="p-4 text-sm font-semibold uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <React.Fragment key={order.id}>
                                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-4 font-bold">#000{order.id}</td>
                                                    <td className="p-4">
                                                        {order.username ? order.username : 'Guest User'}
                                                    </td>
                                                    <td className="p-4 text-sm opacity-80">{new Date(order.created_at).toLocaleDateString()}</td>
                                                    <td className="p-4 font-bold text-[var(--accent-color)]">KES {parseFloat(order.total_amount).toLocaleString()}</td>
                                                    <td className="p-4">
                                                        <select
                                                            className="status-dropdown bg-black/50 border border-white/20 rounded p-1 text-sm outline-none cursor-pointer focus:border-[var(--accent-color)]"
                                                            value={order.status}
                                                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                        >
                                                            <option value="Processing">Processing</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-white/20 bg-black/20">
                                                    <td colSpan="5" className="p-4 text-sm">
                                                        <div className="flex flex-col gap-2">
                                                            <strong>Line Items:</strong>
                                                            {order.items?.map(item => (
                                                                <div key={item.id} className="flex gap-4 items-center pl-4 border-l-2 border-white/10">
                                                                    <div className="w-8 h-8 rounded bg-white/10 overflow-hidden flex-shrink-0">
                                                                        <img src={item.image_url ? `${API}${item.image_url}` : 'https://placehold.co/40'} className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <span>{item.name} <span className="opacity-60">x{item.quantity}</span></span>
                                                                    <span className="ml-auto opacity-80">KES {parseFloat(item.price_at_purchase).toLocaleString()}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'promotions' && (
                    <div className="promotions-grid">
                        {promotions.map(promo => (
                            <div key={promo.id} className="promo-manage-card">
                                <img src={`${API}${promo.image_url}`} alt="" />
                                <div className="promo-manage-info">
                                    <h4>{promo.title}</h4>
                                    <p>{promo.subtitle}</p>
                                    <div className="promo-manage-actions">
                                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditingPromo(promo); setShowPromoModal(true); }}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeletePromo(promo.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="promo-add-card" onClick={() => { setEditingPromo(null); setShowPromoModal(true); }}>
                            <Plus size={32} />
                            <span>Add Flash Sale</span>
                        </div>
                    </div>
                )}

                {activeTab === 'dashboard' && (
                    <div className="dashboard-overview-grid">
                        <div className="overview-main">
                            <div className="chart-placeholder glass">
                                <div className="chart-header">
                                    <h3>Sales Performance</h3>
                                    <div className="chart-legend">
                                        <span className="legend-item"><span className="dot revenue"></span> Revenue</span>
                                        <span className="legend-item"><span className="dot target"></span> Target</span>
                                    </div>
                                </div>
                                <div className="mock-chart">
                                    {/* Visual representation of a chart */}
                                    {[40, 60, 45, 90, 65, 80, 70, 95].map((h, i) => (
                                        <div key={i} className="chart-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}></div>
                                    ))}
                                </div>
                            </div>
                            <div className="dashboard-grid-2">
                                <div className="overview-card glass">
                                    <h4>Top Categories</h4>
                                    <div className="mini-list">
                                        <div className="mini-item"><span>Cookware</span> <span>45%</span></div>
                                        <div className="mini-item"><span>Appliances</span> <span>30%</span></div>
                                        <div className="mini-item"><span>Gadgets</span> <span>25%</span></div>
                                    </div>
                                </div>
                                <div className="overview-card glass">
                                    <h4>Stock Alerts</h4>
                                    <div className="mini-list">
                                        {products.filter(p => p.stock < 5).slice(0, 3).map(p => (
                                            <div key={p.id} className="mini-item warning">
                                                <span>{p.name}</span> <span>{p.stock} left</span>
                                            </div>
                                        ))}
                                        {products.filter(p => p.stock < 5).length === 0 && <p className="all-good">All stock levels healthy</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="overview-sidebar">
                            <div className="activity-panel glass">
                                <h3>Recent Activity</h3>
                                <div className="activity-list">
                                    <div className="activity-item">
                                        <div className="activity-icon blue"><ShoppingBag size={14} /></div>
                                        <div className="activity-info">
                                            <p>New order #1204</p>
                                            <span>2 minutes ago</span>
                                        </div>
                                    </div>
                                    <div className="activity-item">
                                        <div className="activity-icon green"><Check size={14} /></div>
                                        <div className="activity-info">
                                            <p>Product "Copper Pan" restocked</p>
                                            <span>45 minutes ago</span>
                                        </div>
                                    </div>
                                    <div className="activity-item">
                                        <div className="activity-icon orange"><Zap size={14} /></div>
                                        <div className="activity-info">
                                            <p>Flash Sale "Spring Prep" started</p>
                                            <span>2 hours ago</span>
                                        </div>
                                    </div>
                                    <div className="activity-item">
                                        <div className="activity-icon"><Users size={14} /></div>
                                        <div className="activity-info">
                                            <p>New customer registered</p>
                                            <span>3 hours ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'customers' && (
                    <div className="placeholder-screen glass">
                        <Users size={48} className="text-accent" />
                        <h2>Customer Registry</h2>
                        <p>Database of 2,450 registered culinary enthusiasts.</p>
                        <button className="btn btn-primary" style={{ marginTop: '20px' }}>View Full Directory</button>
                    </div>
                )}
            </div>

            {showModal && <ProductModal product={editingProduct} onClose={() => setShowModal(false)} onSaved={handleProductSaved} token={token} />}
            {showPromoModal && <PromotionModal promotion={editingPromo} onClose={() => setShowPromoModal(false)} onSaved={handlePromoSaved} token={token} />}
        </div>
    );
};

export default AdminDashboard;
