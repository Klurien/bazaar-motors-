import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Search,
    SlidersHorizontal,
    X,
    ChevronDown,
    Grid,
    List,
    Leaf
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/product/ProductCard';
import { BRAND } from '../brandConfig';
import './Products.css';

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "");

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A-Z' },
    { value: 'name_desc', label: 'Name: Z-A' },
];

const STRAIN_CATEGORIES = [
    { value: '', label: 'All Strains' },
    { value: 'Indica', label: 'Indica' },
    { value: 'Sativa', label: 'Sativa' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'CBD', label: 'CBD' },
    { value: 'Edibles', label: 'Edibles' },
    { value: 'Concentrates', label: 'Concentrates' },
];

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [viewMode, setViewMode] = useState('grid');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
    });
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
    const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
    const limit = 30;

    const dropdownRef = useRef(null);
    const [sortOpen, setSortOpen] = useState(false);

    const buildQuery = useCallback(() => {
        const params = new URLSearchParams();
        params.set('limit', String(limit));
        params.set('offset', String((page - 1) * limit));

        const q = searchTerm || searchParams.get('q');
        if (q) params.set('q', q);
        if (filters.category) params.set('category', filters.category);
        if (filters.minPrice) params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        if (sort) params.set('sort', sort);

        return params.toString();
    }, [page, searchTerm, filters, sort, searchParams]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const qs = buildQuery();
        const url = `${API}/api/products?${qs}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            setProducts(data.products || data || []);
            setTotalCount(data.totalCount || data.total || data.products?.length || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [buildQuery]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const newParams = new URLSearchParams();
        if (searchTerm) newParams.set('q', searchTerm);
        if (filters.category) newParams.set('category', filters.category);
        if (filters.minPrice) newParams.set('minPrice', filters.minPrice);
        if (filters.maxPrice) newParams.set('maxPrice', filters.maxPrice);
        if (sort && sort !== 'newest') newParams.set('sort', sort);
        if (page > 1) newParams.set('page', String(page));
        setSearchParams(newParams, { replace: true });
    }, [searchTerm, filters, sort, page, setSearchParams]);

    const totalPages = Math.ceil(totalCount / limit);

    const clearFilters = () => {
        setFilters({ category: '', minPrice: '', maxPrice: '' });
        setSearchTerm('');
        setSort('newest');
        setPage(1);
        setSearchParams({});
    };

    const isFiltered = searchTerm || filters.category || filters.minPrice || filters.maxPrice;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
    };

    return (
        <div className="inventory-page-v3">
            <Helmet>
                <title>Dispensary – {BRAND.name} Jamaica</title>
                <meta name="description" content={`Browse our curated selection of premium Jamaican cannabis strains. Indica, Sativa, Hybrid, CBD, Edibles & more at ${BRAND.name}.`} />
            </Helmet>

            <section className="inventory-hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="stock-count" data-count={totalCount || '—'}>
                            <Leaf size={24} />
                            <span>{totalCount || '—'} strains available</span>
                        </div>
                        <h1>Our <span className="highlight">Dispensary</span></h1>
                        <p>Curated Jamaican cannabis, lab-tested and island-grown.</p>
                    </div>
                </div>
            </section>

            <div className="inventory-toolbar container">
                <form className="search-bar-v3" onSubmit={handleSearchSubmit}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search strains..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button type="button" className="clear-search" onClick={() => { setSearchTerm(''); setPage(1); }}>
                            <X size={16} />
                        </button>
                    )}
                </form>

                <div className="toolbar-right">
                    <button className="mobile-filter-btn glass-btn" onClick={() => setMobileFiltersOpen(true)}>
                        <SlidersHorizontal size={16} />
                        <span>Filters</span>
                        {isFiltered && <span className="filter-badge-dot"></span>}
                    </button>

                    <div className="sort-dropdown" ref={dropdownRef}>
                        <button className="sort-trigger glass-btn" onClick={() => setSortOpen(o => !o)}>
                            <span>{SORT_OPTIONS.find(o => o.value === sort)?.label || 'Sort'}</span>
                            <ChevronDown size={14} className={`sort-arrow ${sortOpen ? 'open' : ''}`} />
                        </button>
                        {sortOpen && (
                            <div className="sort-menu">
                                {SORT_OPTIONS.map(opt => (
                                    <button key={opt.value} className={sort === opt.value ? 'active' : ''} onClick={() => { setSort(opt.value); setPage(1); setSortOpen(false); }}>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="view-toggle">
                        <button className={`glass-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                            <Grid size={16} />
                        </button>
                        <button className={`glass-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="inventory-layout container">
                <aside className={`filter-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
                    <div className="sidebar-header">
                        <h3>Filters</h3>
                        <button className="close-sidebar" onClick={() => setMobileFiltersOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="filter-group">
                        <h4>Category</h4>
                        <div className="filter-chips">
                            {STRAIN_CATEGORIES.map(cat => (
                                <button
                                    key={cat.value}
                                    className={`chip ${filters.category === cat.value ? 'active' : ''}`}
                                    onClick={() => { setFilters(f => ({ ...f, category: cat.value })); setPage(1); }}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h4>Price Range (JMD)</h4>
                        <div className="price-range-inputs">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.minPrice}
                                onChange={(e) => { setFilters(f => ({ ...f, minPrice: e.target.value })); setPage(1); }}
                            />
                            <span>—</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.maxPrice}
                                onChange={(e) => { setFilters(f => ({ ...f, maxPrice: e.target.value })); setPage(1); }}
                            />
                        </div>
                    </div>

                    {isFiltered && (
                        <button className="clear-filters-btn" onClick={clearFilters}>Clear All Filters</button>
                    )}
                </aside>

                <main className="inventory-main">
                    {loading ? (
                        <div className="loading-grid">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="skel-card pulse shimmer-bg"></div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="no-results">
                            <Leaf size={48} />
                            <h3>No strains found</h3>
                            <p>Try adjusting your filters or search term.</p>
                            {isFiltered && <button className="primary-btn" onClick={clearFilters}>Clear Filters</button>}
                        </div>
                    ) : (
                        <>
                            <div className={`product-grid-v3 ${viewMode}`}>
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} compact={viewMode === 'list'} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination-v3">
                                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
                                    <div className="page-numbers">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                                            .map((p, idx, arr) => (
                                                <React.Fragment key={p}>
                                                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="page-ellipsis">...</span>}
                                                    <button className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
                                                </React.Fragment>
                                            ))}
                                    </div>
                                    <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {mobileFiltersOpen && <div className="sidebar-overlay" onClick={() => setMobileFiltersOpen(false)}></div>}
        </div>
    );
};

export default Products;
