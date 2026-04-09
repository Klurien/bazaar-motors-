import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, Search, X, ChevronDown, Filter, Grid, List as ListIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/product/ProductCard';
import CardSkeleton from '../components/product/CardSkeleton';
import './Products.css';

const MAKES = ['All', 'Toyota', 'Lexus', 'Nissan', 'Mazda', 'Subaru', 'Honda', 'Mercedes-Benz', 'BMW', 'Volkswagen'];
const CONDITIONS = ['All', 'Foreign Used', 'Local Used', 'Brand New'];
const TRANSMISSIONS = ['All', 'Automatic', 'Manual', 'CVT'];

const SORT_OPTIONS = [
    { value: 'default', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'year-desc', label: 'Latest Year' },
];

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "");

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Pagination/Meta state
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalResults, setTotalResults] = useState(0);

    // Filter state
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedMake, setSelectedMake] = useState(searchParams.get('make') || 'All');
    const [selectedCondition, setSelectedCondition] = useState(searchParams.get('condition') || 'All');
    const [selectedTransmission, setSelectedTransmission] = useState(searchParams.get('transmission') || 'All');
    const [priceRange, setPriceRange] = useState([0, 30000000]);
    const [sort, setSort] = useState('newest');

    const fetchProducts = async (pageNumber, isNewSearch = false) => {
        if (pageNumber > 1) setLoadingMore(true);
        else setLoading(true);

        try {
            const params = new URLSearchParams({
                page: pageNumber,
                limit: 12,
                q: searchQuery,
                make: selectedMake !== 'All' ? selectedMake : '',
                condition: selectedCondition !== 'All' ? selectedCondition : '',
                transmission: selectedTransmission !== 'All' ? selectedTransmission : '',
                category: searchParams.get('category') || '',
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                sort: sort
            });

            const res = await fetch(`${API}/api/products?${params.toString()}`);
            const data = await res.json();

            if (isNewSearch) {
                setProducts(data.products);
            } else {
                setProducts(prev => [...prev, ...data.products]);
            }

            setTotalResults(data.total);
            setHasMore(data.page < data.totalPages);
            setLoading(false);
            setLoadingMore(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Initial fetch and filter change
    useEffect(() => {
        setPage(1);
        fetchProducts(1, true);
    }, [searchQuery, selectedMake, selectedCondition, selectedTransmission, priceRange, sort, searchParams.get('category')]);

    // Load more when page changes
    useEffect(() => {
        if (page > 1) {
            fetchProducts(page, false);
        }
    }, [page]);

    // Intersection Observer for Infinite Scroll
    const observer = React.useRef();
    const lastElementRef = React.useCallback(node => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedMake('All');
        setSelectedCondition('All');
        setSelectedTransmission('All');
        setPriceRange([0, 30000000]);
        setSort('newest');
        setSearchParams({});
    };

    const activeFilterCount = [
        selectedMake !== 'All',
        selectedCondition !== 'All',
        selectedTransmission !== 'All',
        priceRange[0] > 0 || priceRange[1] < 30000000,
    ].filter(Boolean).length;

    return (
        <div className="inventory-page-v3">
            <Helmet>
                <title>Bazaar Motors | Quality Vehicles for Sale in Kenya</title>
                <meta name="description" content="Explore our premium collection of foreign and local used vehicles in Ruiru." />
            </Helmet>

            <div className="inventory-header-v3">
                <div className="container">
                    <div className="v3-sub">CURATED SELECTION</div>
                    <div className="header-flex-v3">
                        <div className="header-text-v3">
                            <h1>THE <span className="highlight">SHOWROOM</span></h1>
                            <p>Discover {totalResults} high-performance vehicles across our elite collection.</p>
                        </div>
                        <div className="header-actions-v3">
                            <button className="h-action-btn-v3 mobile-only" onClick={() => setSidebarOpen(true)}>
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container inventory-grid-layout">
                {/* Advanced Filters Sidebar */}
                <aside className={`inventory-sidebar-v3 ${sidebarOpen ? 'sidebar-v3-open' : ''}`}>
                    <div className="sidebar-v3-header">
                        <h3>FILTERS</h3>
                        <button className="v3-close-sidebar" onClick={() => setSidebarOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="v3-filter-wrapper">
                        <div className="v3-filter-group">
                            <label>SEARCH INVENTORY</label>
                            <div className="v3-search-box glass-panel">
                                <input
                                    type="text"
                                    placeholder="Make, model..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                                <Search size={16} />
                            </div>
                        </div>

                        <div className="v3-filter-group">
                            <label>SELECT MAKE</label>
                            <div className="v3-select-grid">
                                {MAKES.map(make => (
                                    <button
                                        key={make}
                                        className={`v3-select-pill ${selectedMake === make ? 'active' : ''}`}
                                        onClick={() => setSelectedMake(make)}
                                    >
                                        {make}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="v3-filter-group">
                            <label>CONDITION</label>
                            <div className="v3-select-grid">
                                {CONDITIONS.map(cond => (
                                    <button
                                        key={cond}
                                        className={`v3-select-pill ${selectedCondition === cond ? 'active' : ''}`}
                                        onClick={() => setSelectedCondition(cond)}
                                    >
                                        {cond}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="v3-filter-group">
                            <label>TRANSMISSION</label>
                            <div className="v3-select-grid">
                                {TRANSMISSIONS.map(trans => (
                                    <button
                                        key={trans}
                                        className={`v3-select-pill ${selectedTransmission === trans ? 'active' : ''}`}
                                        onClick={() => setSelectedTransmission(trans)}
                                    >
                                        {trans}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="v3-filter-group">
                            <label>PRICE CAP (KSh)</label>
                            <div className="v3-price-inputs">
                                <div className="price-input-v3 glass-panel">
                                    <input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                                    />
                                </div>
                            </div>
                        </div>

                        {activeFilterCount > 0 && (
                            <button className="v3-reset-btn" onClick={clearFilters}>
                                RESET FILTERS
                            </button>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="inventory-main-v3">
                    <div className="v3-toolbar-top">
                        <div className="toolbar-info-v3">
                            <p>Showing <strong>{products.length}</strong> of <strong>{totalResults}</strong> vehicles</p>
                        </div>
                        <div className="toolbar-controls-v3">
                            <div className="v3-sort-control">
                                <span>Sort By</span>
                                <select
                                    value={sort}
                                    onChange={e => setSort(e.target.value)}
                                >
                                    {SORT_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Active Filter Tags */}
                    {activeFilterCount > 0 && (
                        <div className="v3-active-tags">
                            {selectedMake !== 'All' && (
                                <span className="v3-tag">
                                    {selectedMake} <X size={14} onClick={() => setSelectedMake('All')} />
                                </span>
                            )}
                            {selectedCondition !== 'All' && (
                                <span className="v3-tag">
                                    {selectedCondition} <X size={14} onClick={() => setSelectedCondition('All')} />
                                </span>
                            )}
                            {selectedTransmission !== 'All' && (
                                <span className="v3-tag">
                                    {selectedTransmission} <X size={14} onClick={() => setSelectedTransmission('All')} />
                                </span>
                            )}
                        </div>
                    )}

                    {/* Content Grid */}
                    {loading ? (
                        <div className="v3-inventory-grid">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <CardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="v3-inventory-grid">
                                {products.map((vehicle, index) => {
                                    if (products.length === index + 1) {
                                        return (
                                            <div ref={lastElementRef} key={vehicle.id}>
                                                <ProductCard product={vehicle} />
                                            </div>
                                        );
                                    }
                                    return <ProductCard key={vehicle.id} product={vehicle} />;
                                })}
                            </div>
                            
                            {loadingMore && (
                                <div className="v3-loading-more">
                                    <div className="spinner"></div>
                                    <span>Curating more vehicles...</span>
                                </div>
                            )}

                            {!hasMore && products.length > 0 && (
                                <div className="v3-end-of-list">
                                    <p>You've reached the end of our current collection.</p>
                                </div>
                            )}
                        </>
                    )}

                    {!loading && products.length === 0 && (
                        <div className="v3-empty-state">
                            <Search size={48} />
                            <h3>No results found</h3>
                            <p>Try adjusting your filters to find what you're looking for.</p>
                            <button onClick={clearFilters}>Clear All Filters</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Products;

