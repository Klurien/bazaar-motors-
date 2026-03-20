import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { BRAND } from '../../brandConfig';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="container footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <BRAND.logo className="logo-icon" size={20} color="#D35400" />
                            <span className="logo-brand">{BRAND.name.split(' ')[0]}</span>
                            <span className="logo-suffix">{BRAND.name.split(' ')[1] || ''}</span>
                        </Link>
                        <p className="footer-tagline">
                            {BRAND.description}
                        </p>
                        <div className="footer-social">
                            <a href="#" aria-label="Instagram" className="social-icon"><Instagram size={18} /></a>
                            <a href="#" aria-label="Twitter" className="social-icon"><Twitter size={18} /></a>
                            <a href="#" aria-label="Facebook" className="social-icon"><Facebook size={18} /></a>
                            <a href="#" aria-label="YouTube" className="social-icon"><Youtube size={18} /></a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="footer-col">
                        <h4>Explore Findings</h4>
                        <ul>
                            <li><Link to="/products">All Findings</Link></li>
                            <li><Link to="/products?category=Cookware">Cookware</Link></li>
                            <li><Link to="/products?category=Gadgets">Kitchen Gadgets</Link></li>
                            <li><Link to="/products?category=Dining">Dining & Bar</Link></li>
                            <li><Link to="/products?category=Storage">Storage Solutions</Link></li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div className="footer-col">
                        <h4>Chef Support</h4>
                        <ul>
                            <li><Link to="/cart">My Cart</Link></li>
                            <li><Link to="#">Track My Findings</Link></li>
                            <li><Link to="#">Culinary Guarantees</Link></li>
                            <li><Link to="#">Care Guides</Link></li>
                            <li><Link to="#">Chef FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-col">
                        <h4>Get In Touch</h4>
                        <ul className="contact-list">
                            <li>
                                <Mail size={15} />
                                <span>{BRAND.email}</span>
                            </li>
                            <li>
                                <Phone size={15} />
                                <span>{BRAND.phone}</span>
                            </li>
                            <li>
                                <MapPin size={15} />
                                <span>{BRAND.address}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <p>© {new Date().getFullYear()} {BRAND.nameRaw}. All rights reserved.</p>
                    <div className="footer-legal-links">
                        <Link to="#">Privacy Policy</Link>
                        <Link to="#">Terms of Service</Link>
                        <Link to="#">Shipping Registry</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
