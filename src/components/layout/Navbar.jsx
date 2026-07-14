import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, LogOut, LayoutDashboard, Menu, X, Phone, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../brandConfig';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setMobileMenuOpen(false);
        }
    };

    const categories = [
        { name: 'Dispensary', path: '/products' },
        { name: 'Indica', path: '/products?category=Indica' },
        { name: 'Sativa', path: '/products?category=Sativa' },
        { name: 'Contact Us', path: '/contact' },
    ];

    return (
        <header className={`navbar-v3 ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-v3-inner">
                <Link to="/" className="navbar-v3-logo">
                    <div className="logo-symbol">
                        <Leaf size={24} strokeWidth={1.5} />
                    </div>
                    <div className="logo-text">
                        <span className="logo-main">ISLAND</span>
                        <span className="logo-accent">LEAF</span>
                    </div>
                </Link>

                <nav className="navbar-v3-links desktop-only">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            to={cat.path}
                            className={`nav-v3-link ${location.pathname === cat.path ? 'active' : ''}`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </nav>

                <div className="navbar-v3-actions">
                    <form className="navbar-v3-search desktop-only" onSubmit={handleSearch}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Find a strain..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <div className="action-group-v3">
                        <a href={`https://wa.me/${BRAND.whatsapp}`} className="primary-btn nav-btn desktop-only">
                            <Phone size={14} />
                            <span>Contact Us</span>
                        </a>

                        {user ? (
                            <div className="user-profile-v3">
                                <User size={20} />
                                <div className="user-menu-v3">
                                    <div className="user-info-v3">
                                        <p>{user.username}</p>
                                        <span>{user.role}</span>
                                    </div>
                                    <div className="user-menu-divider"></div>
                                    <Link to="/products">My Strains</Link>
                                    {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
                                    <button onClick={logout}>Logout</button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="login-v3-link">
                                <User size={20} />
                            </Link>
                        )}

                        <button className="v3-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className={`mobile-nav-v3 ${mobileMenuOpen ? 'active' : ''}`}>
                <div className="mobile-search-v3">
                    <form onSubmit={handleSearch}>
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search strains..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>
                <div className="mobile-links-v3">
                    {categories.map((cat, idx) => (
                        <Link key={idx} to={cat.path} onClick={() => setMobileMenuOpen(false)}>
                            {cat.name}
                        </Link>
                    ))}
                </div>
                <div className="mobile-footer-v3">
                    <a href={`https://wa.me/${BRAND.whatsapp}`} className="mobile-cta-v3">
                        <Phone size={20} /> Contact Grower
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
