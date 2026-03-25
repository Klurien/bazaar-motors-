import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { BRAND } from '../../brandConfig';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isDesktop = typeof window !== 'undefined' && window.innerWidth > 900;
    if (location.pathname.startsWith('/admin') && isDesktop) {
        return null;
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const categories = [
        { name: 'Inventory', path: '/products' },
        { name: 'SUVs', path: '/products?category=SUV' },
        { name: 'Saloon', path: '/products?category=Saloon' },
        { name: 'Hatchbacks', path: '/products?category=Hatchback' },
    ];

    return (
        <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container glass">
                <Link to="/" className="logo">
                    <BRAND.logo size={28} className="logo-icon" />
                    <div className="logo-text">
                        <span className="logo-brand">{BRAND.name.split(' ')[0]}</span>
                        <span className="logo-suffix">{BRAND.name.split(' ')[1] || ''}</span>
                    </div>
                </Link>

                <nav className="nav-desktop">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            to={cat.path}
                            className={`nav-link ${location.search.includes(cat.name) ? 'active' : ''}`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </nav>

                <div className="nav-actions">
                    <form className="search-minimal" onSubmit={handleSearch}>
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <div className="action-divider"></div>

                    <div className="user-action-group">
                        {user ? (
                            <div className="user-status-item">
                                <User size={20} />
                                <div className="user-dropdown-panel glass">
                                    <p>Welcome, {user.username}</p>
                                    <Link to="/profile"><User size={16} /> My Profile</Link>
                                    <div className="dropdown-divider"></div>
                                    {user.role === 'admin' && (
                                        <Link to="/admin"><LayoutDashboard size={16} /> Admin Panel</Link>
                                    )}
                                    <button onClick={logout}><LogOut size={16} /> Sign Out</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="action-circle-btn">
                                    <User size={20} />
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm desktop-only">
                                    Sign Up
                                </Link>
                            </>
                        )}

                        <Link to="/cart" className="cart-action-btn">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && <span className="cart-dot">{cartCount}</span>}
                        </Link>
                    </div>

                    <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu glass ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-links">
                    {categories.map((cat, idx) => (
                        <Link key={idx} to={cat.path} onClick={() => setMobileMenuOpen(false)}>
                            {cat.name}
                        </Link>
                    ))}
                    <div className="mobile-divider"></div>
                    {user ? (
                        <>
                            <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
                            {user.role === 'admin' && <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>}
                            <button onClick={() => { logout(); setMobileMenuOpen(false); }}>Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;

