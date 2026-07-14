import React from 'react';
import { Link } from 'react-router-dom';
import {
    Mail,
    Phone,
    MapPin,
    Instagram,
    Twitter,
    Facebook,
    Youtube,
    Music,
    Search,
    Shield,
    CheckCircle
} from 'lucide-react';
import { BRAND } from '../../brandConfig';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-v3">
            <div className="container footer-v3-top">
                <div className="f-v3-col brand-col">
                    <Link to="/" className="v3-logo">
                        <div className="v3-logo-symbol"></div>
                        <span className="v3-logo-text">ISLAND<span className="highlight">LEAF</span></span>
                    </Link>
                    <p className="f-v3-description">
                        Jamaica's premier destination for premium cannabis strains and herbal wellness products. 
                        Rooted in tradition, elevated by nature — every product is lab-tested, locally grown, 
                        and delivered with the aloha spirit of the island.
                    </p>
                    <div className="f-v3-social">
                        <a href={BRAND.social.facebook} className="social-link-v3 fb"><Facebook size={18} /></a>
                        <a href={BRAND.social.twitter} className="social-link-v3 tw"><Twitter size={18} /></a>
                        <a href={BRAND.social.instagram} className="social-link-v3 ig"><Instagram size={18} /></a>
                        <a href={BRAND.social.tiktok || "#"} className="social-link-v3 tk"><Music size={18} /></a>
                    </div>
                </div>

                <div className="f-v3-col">
                    <h4 className="f-v3-heading">Quick Links</h4>
                    <ul className="f-v3-links">
                        <li><Link to="/products">Browse Dispensary</Link></li>
                        <li><Link to="/products?category=Indica">Indica Strains</Link></li>
                        <li><Link to="/products?category=Sativa">Sativa Strains</Link></li>
                        <li><Link to="/products?category=Hybrid">Hybrid Selections</Link></li>
                        <li><Link to="/products">CBD Wellness</Link></li>
                    </ul>
                </div>

                <div className="f-v3-col">
                    <h4 className="f-v3-heading">Company</h4>
                    <ul className="f-v3-links">
                        <li><Link to="/">About IslandLeaf</Link></li>
                        <li><Link to="/">Meet the Growers</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/">Lab Reports</Link></li>
                        <li><Link to="/">Visit Kingston</Link></li>
                    </ul>
                </div>

                <div className="f-v3-col contact-col">
                    <h4 className="f-v3-heading">Contact Us</h4>
                    <div className="f-v3-contact">
                        <div className="contact-item-v3">
                            <Phone size={18} className="icon-orange" />
                            <div className="contact-text">
                                <span>Phone & WhatsApp</span>
                                <p>{BRAND.phone}</p>
                            </div>
                        </div>
                        <div className="contact-item-v3">
                            <Mail size={18} className="icon-orange" />
                            <div className="contact-text">
                                <span>Email Address</span>
                                <p>{BRAND.email}</p>
                            </div>
                        </div>
                        <div className="contact-item-v3">
                            <MapPin size={18} className="icon-orange" />
                            <div className="contact-text">
                                <span>Kingston HQ</span>
                                <p>{BRAND.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-v3-bottom">
                <div className="container footer-v3-inner">
                    <p>© {new Date().getFullYear()} IslandLeaf Ltd. All rights reserved.</p>
                    <div className="f-v3-legal">
                        <Link to="#">Privacy Policy</Link>
                        <span className="f-v3-dot"></span>
                        <Link to="#">Terms of Sale</Link>
                        <span className="f-v3-dot"></span>
                        <Link to="#">Lab Transparency</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
