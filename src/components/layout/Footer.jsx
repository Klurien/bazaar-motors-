import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { BRAND } from '../../brandConfig';
import './Footer.css';

const Footer = () => {
    const [whatsappNumber, setWhatsappNumber] = React.useState(BRAND.phone);

    React.useEffect(() => {
        const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");
        fetch(`${API}/api/stats/config`)
            .then(res => res.json())
            .then(data => {
                if (data.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
            })
            .catch(err => console.error("Config fetch fail", err));
    }, []);

    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="container footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <BRAND.logo className="logo-icon" size={20} color="#FF7A00" />
                            <span className="logo-brand">{BRAND.name.split(' ')[0]}</span>
                            <span className="logo-suffix">{BRAND.name.split(' ')[1] || ''}</span>
                        </Link>
                        <p className="footer-tagline">
                            {BRAND.description}
                        </p>
                        <div className="footer-social">
                            <a href={BRAND.social.instagram} aria-label="Instagram" className="social-icon" target="_blank" rel="noopener noreferrer"><Instagram size={18} /></a>
                            <a href={BRAND.social.twitter} aria-label="Twitter" className="social-icon" target="_blank" rel="noopener noreferrer"><Twitter size={18} /></a>
                            <a href={BRAND.social.facebook} aria-label="Facebook" className="social-icon" target="_blank" rel="noopener noreferrer"><Facebook size={18} /></a>
                            <a href={BRAND.social.youtube} aria-label="YouTube" className="social-icon" target="_blank" rel="noopener noreferrer"><Youtube size={18} /></a>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="footer-col">
                        <h4>Inventory</h4>
                        <ul>
                            <li><Link to="/products">All Inventory</Link></li>
                            <li><Link to="/products?category=SUV">SUVs</Link></li>
                            <li><Link to="/products?category=Saloon">Saloon Cars</Link></li>
                            <li><Link to="/products?category=Hatchback">Hatchbacks</Link></li>
                            <li><Link to="/products?category=Commercial">Commercial</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="footer-col">
                        <h4>Customer Support</h4>
                        <ul>
                            <li><Link to="/products">Book Test Drive</Link></li>
                            <li><Link to="#">Financing Options</Link></li>
                            <li><Link to="#">Import Services</Link></li>
                            <li><Link to="#">Valuation</Link></li>
                            <li><Link to="#">FAQs</Link></li>
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
                                <span>{whatsappNumber}</span>
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
                        <Link to="#">Import Registry</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

