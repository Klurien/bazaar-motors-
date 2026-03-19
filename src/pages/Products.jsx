import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, Search, X, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/product/ProductCard';
import './Products.css';

const CATEGORIES = ['All', 'Cookware', 'Gadgets', 'Dining', 'Storage', 'Baking', 'Appliances'];
const SORT_OPTIONS = [
    { value: 'default', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A–Z' },
    { value: 'name-desc', label: 'Name: Z–A' },
];

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Filter state
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [maxPrice, setMaxPrice] = useState(500);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sort, setSort] = useState('default');

    useEffect(() => {
        setLoading(true);
        fetch(`${API}/api/products`)
            .then(res => res.json())
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error("Products API didn't return an array:", data);
                    data = [];
                }
                setProducts(data);
                if (data.length > 0) {
                    const max = Math.ceil(Math.max(...data.map(p => p.price)));
                    setMaxPrice(max);
                    setPriceRange([0, max]);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Sync search params
    useEffect(() => {
        const q = searchParams.get('q') || '';
        const cat = searchParams.get('category') || 'All';
        setSearchQuery(q);
        setSelectedCategory(cat);
    }, [searchParams]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.description && p.description.toLowerCase().includes(q)) ||
                (p.category && p.category.toLowerCase().includes(q))
            );
        }

        // Category
        if (selectedCategory !== 'All') {
            result = result.filter(p =>
                (p.category || '').toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // Price
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Stock
        if (inStockOnly) {
            result = result.filter(p => p.stock > 0);
        }

        // Sort
        switch (sort) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'name-desc': result.sort((a, b) => b.name.localeCompare(a.name)); break;
            default: break;
        }

        return result;
    }, [products, searchQuery, selectedCategory, priceRange, inStockOnly, sort]);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (searchQuery) params.q = searchQuery;
        if (selectedCategory !== 'All') params.category = selectedCategory;
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All');
        setPriceRange([0, maxPrice]);
        setInStockOnly(false);
        setSort('default');
        setSearchParams({});
    };

    const activeFilterCount = [
        selectedCategory !== 'All',
        inStockOnly,
        priceRange[0] > 0 || priceRange[1] < maxPrice,
    ].filter(Boolean).length;

    return (
        <div className="products-page">
            <Helmet>
                <title>Culinary Finds | Shop Masterpieces</title>
                <meta name="description" content="Explore our complete collection of luxury cookware and gadgets." />
            </Helmet>
            {/* Page Header */}
            <div className="products-header">
                <div className="container">
                    <nav className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>All Products</span>
                    </nav>
                    <h1>Explore Culinary Finds</h1>
                    <p className="products-subtitle">
                        {loading ? 'Loading...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
                    </p>
                </div>
            </div>

            <div className="container products-layout">
                {/* Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Filter Sidebar */}
                <aside className={`filter-sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <h3>Filters</h3>
                        <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="filter-section">
                        <h4>Search</h4>
                        <form onSubmit={handleSearch} className="sidebar-search">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <button type="submit"><Search size={16} /></button>
                        </form>
                    </div>

                    {/* Category */}
                    <div className="filter-section">
                        <h4>Category</h4>
                        <div className="category-list">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="filter-section">
                        <h4>Price Range</h4>
                        <div className="price-display">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={maxPrice}
                            value={priceRange[1]}
                            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="price-slider"
                        />
                    </div>

                    {/* Availability */}
                    <div className="filter-section">
                        <h4>Availability</h4>
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={e => setInStockOnly(e.target.checked)}
                            />
                            <span className="toggle-track"></span>
                            In Stock Only
                        </label>
                    </div>

                    {activeFilterCount > 0 && (
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            <X size={16} /> Clear All Filters ({activeFilterCount})
                        </button>
                    )}
                </aside>

                {/* Main Content */}
                <div className="products-main">
                    {/* Toolbar */}
                    <div className="products-toolbar">
                        <button
                            className="filter-toggle-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <SlidersHorizontal size={18} />
                            Filters {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
                        </button>

                        <div className="sort-select-wrapper">
                            <select
                                value={sort}
                                onChange={e => setSort(e.target.value)}
                                className="sort-select"
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="sort-chevron" />
                        </div>
                    </div>

                    {/* Active filter tags */}
                    {(searchQuery || selectedCategory !== 'All') && (
                        <div className="active-filters">
                            {searchQuery && (
                                <span className="filter-tag">
                                    "{searchQuery}"
                                    <button onClick={() => { setSearchQuery(''); }}>
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                            {selectedCategory !== 'All' && (
                                <span className="filter-tag">
                                    {selectedCategory}
                                    <button onClick={() => setSelectedCategory('All')}>
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Product Grid */}
                    {loading ? (
                        <div className="product-grid">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="product-skeleton">
                                    <div className="skeleton-img pulse"></div>
                                    <div className="skeleton-info">
                                        <div className="skeleton-text pulse"></div>
                                        <div className="skeleton-price pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="product-grid">
                            {filteredProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="product-card-animate"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">🔍</div>
                            <h3>No products found</h3>
                            <p>Try adjusting your filters or search terms.</p>
                            <button className="btn btn-primary" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
