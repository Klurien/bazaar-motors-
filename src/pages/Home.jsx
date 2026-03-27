import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Clock, MapPin, Search, Car, Globe, ArrowRight, Instagram } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ProductCard from '../components/product/ProductCard';
import { BRAND } from '../brandConfig';
import './Home.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Quick search state
    const [searchMake, setSearchMake] = useState('All');

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");
        fetch(`${API_URL}/api/products`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setFeaturedProducts(data.slice(0, 6));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="home-v3">
            <Helmet>
                <title>Bazaar Motors | Your Trusted Partner for Quality Vehicles in Ruiru</title>
                <meta name="description" content="Discover premium foreign and local used vehicles at Bazaar Motors, Ruiru. Direct imports, verified quality, and seamless ownership." />
            </Helmet>

            {/* Hero V3 - High Impact */}
            <section className="hero-v3">
                <div className="container hero-v3-inner">
                    <motion.div
                        className="hero-v3-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="hero-v3-badge">
                            <span className="badge-dot"></span>
                            Est. in Ruiru, Driven by Excellence
                        </div>
                        <h1 className="gradient-text">Uncompromising <br /> <span className="accent">Performance.</span></h1>
                        <p className="hero-v3-desc">Specializing in pristine Japanese imports and luxury vehicles. Elevate your journey with hand-picked units, direct-import butler services, and verified quality in the heart of Ruiru.</p>

                        <div className="hero-v3-actions">
                            <Link to="/products" className="primary-btn hero-btn">
                                Explore Collection <ArrowRight size={18} />
                            </Link>
                            <a href={`https://wa.me/${BRAND.whatsapp}`} className="glass-btn secondary-hero-btn">
                                Custom Import <Globe size={16} />
                            </a>
                        </div>
                    </motion.div>
                </div>
                <div className="hero-v3-image">
                    <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop" alt="Luxury Sports Car" />
                    <div className="hero-v3-overlay"></div>
                </div>
            </section>

            {/* Stats / Trust Bar */}
            <section className="trust-bar-v3">
                <div className="container trust-flex-v3">
                    <div className="trust-item-v3">
                        <strong>500+</strong>
                        <span>Vehicles Delivered</span>
                    </div>
                    <div className="trust-divider-v3"></div>
                    <div className="trust-item-v3">
                        <strong>100%</strong>
                        <span>Verified History</span>
                    </div>
                    <div className="trust-divider-v3"></div>
                    <div className="trust-item-v3">
                        <strong>4.9/5</strong>
                        <span>Customer Rating</span>
                    </div>
                </div>
            </section>

            {/* Featured Showroom */}
            <section className="showroom-v3 container">
                <div className="v3-section-header">
                    <div className="v3-header-text">
                        <span className="v3-sub">Curated Selections</span>
                        <h2>LATEST <span className="accent">ARRIVALS</span></h2>
                    </div>
                    <Link to="/products" className="v3-link-more glass-panel">
                        Live Inventory <ChevronRight size={18} />
                    </Link>
                </div>

                <div className="v3-showroom-grid">
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="v3-skeleton pulse"></div>)
                    ) : (
                        featuredProducts.map((car, idx) => (
                            <motion.div
                                key={car.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <ProductCard product={car} />
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            {/* Why Bazaar Motors */}
            <section className="features-v3">
                <div className="container">
                    <div className="v3-features-grid">
                        <div className="v3-feature-card">
                            <div className="v3-feature-icon"><Globe /></div>
                            <h3>Direct Imports</h3>
                            <p>Seamlessly importing high-grade vehicles from Japan and UK auction houses directly to Ruiru.</p>
                        </div>
                        <div className="v3-feature-card">
                            <div className="v3-feature-icon"><ShieldCheck /></div>
                            <h3>Rigorous Inspection</h3>
                            <p>Every vehicle undergoes a detailed 100-point mechanical and body inspection for your peace of mind.</p>
                        </div>
                        <div className="v3-feature-card">
                            <div className="v3-feature-icon"><Clock /></div>
                            <h3>Ownership Support</h3>
                            <p>We handle all documentation, registration, and post-purchase maintenance support for you.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Japanese Imports Promo */}
            <section className="import-promo-v3">
                <div className="container import-flex-v3">
                    <div className="import-text-v3">
                        <span className="v3-sub">Special Services</span>
                        <h2>Direct Japanese <span className="accent">Import Butler</span></h2>
                        <p>Have a specific car in mind? Let us bid, clear, and deliver your dream vehicle straight from Japan to your doorstep with full transparency.</p>
                        <button className="btn-v3-dark" onClick={() => window.open(`https://wa.me/${BRAND.whatsapp}`, '_blank')}>
                            Start Import Process
                        </button>
                    </div>
                    <div className="import-visual-v3">
                        <div className="import-image-wrap">
                            <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c3d9?q=80&w=2070&auto=format&fit=crop" alt="Japan car auction" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Connection */}
            <section className="social-v3 container">
                <div className="social-v3-card">
                    <div className="social-v3-content">
                        <Instagram size={32} />
                        <h3>Follow Our Journey</h3>
                        <p>Check out our latest deliveries and new stock arrivals on Instagram.</p>
                        <a href={BRAND.social.instagram} target="_blank" rel="noreferrer" className="btn-v3-social">
                            @bazaar_motors
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
