import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, Search, X, ChevronDown, Filter, Grid, List as ListIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/product/ProductCard';
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

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Filter state
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedMake, setSelectedMake] = useState(searchParams.get('make') || 'All');
    const [selectedCondition, setSelectedCondition] = useState(searchParams.get('condition') || 'All');
    const [selectedTransmission, setSelectedTransmission] = useState(searchParams.get('transmission') || 'All');
    const [priceRange, setPriceRange] = useState([0, 15000000]);
    const [maxPrice, setMaxPrice] = useState(15000000);
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
        const make = searchParams.get('make') || 'All';
        const cond = searchParams.get('condition') || 'All';
        setSearchQuery(q);
        setSelectedMake(make);
        setSelectedCondition(cond);
    }, [searchParams]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.make && p.make.toLowerCase().includes(q)) ||
                (p.description && p.description.toLowerCase().includes(q))
            );
        }

        // Make
        if (selectedMake !== 'All') {
            result = result.filter(p =>
                (p.make || '').toLowerCase() === selectedMake.toLowerCase()
            );
        }

        // Condition
        if (selectedCondition !== 'All') {
            result = result.filter(p =>
                (p.condition || '').toLowerCase() === selectedCondition.toLowerCase()
            );
        }

        // Transmission
        if (selectedTransmission !== 'All') {
            result = result.filter(p =>
                (p.transmission || '').toLowerCase() === selectedTransmission.toLowerCase()
            );
        }

        // Price
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Sort
        switch (sort) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'year-desc': result.sort((a, b) => b.year - a.year); break;
            case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
            default: break;
        }

        return result;
    }, [products, searchQuery, selectedMake, selectedCondition, selectedTransmission, priceRange, sort]);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (searchQuery) params.q = searchQuery;
        if (selectedMake !== 'All') params.make = selectedMake;
        if (selectedCondition !== 'All') params.condition = selectedCondition;
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedMake('All');
        setSelectedCondition('All');
        setSelectedTransmission('All');
        setPriceRange([0, maxPrice]);
        setSort('default');
        setSearchParams({});
    };

    const activeFilterCount = [
        selectedMake !== 'All',
        selectedCondition !== 'All',
        selectedTransmission !== 'All',
        priceRange[0] > 0 || priceRange[1] < maxPrice,
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
                            <p>Discover {filteredProducts.length} high-performance vehicles across our elite collection.</p>
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
                            <p>Showing <strong>{filteredProducts.length}</strong> vehicles</p>
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
                        </div>
                    )}

                    {/* Content Grid */}
                    {loading ? (
                        <div className="v3-inventory-grid">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="v3-card-skeleton pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="v3-inventory-grid">
                            {filteredProducts.map(vehicle => (
                                <ProductCard key={vehicle.id} product={vehicle} />
                            ))}
                        </div>
                    )}

                    {!loading && filteredProducts.length === 0 && (
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

