import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Clock, MapPin, Search, Car, Globe, ArrowRight, Instagram } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProductCard from '../components/product/ProductCard';
import CardSkeleton from '../components/product/CardSkeleton';
import { BRAND } from '../brandConfig';
import './Home.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Quick search state
    const [searchMake, setSearchMake] = useState('All');

    // Scroll parallax
    const { scrollY } = useScroll();
    const yHeroBg = useTransform(scrollY, [0, 1000], [0, 400]);
    const opacityHeroContent = useTransform(scrollY, [0, 600], [1, 0]);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "");
        fetch(`${API_URL}/api/products?limit=6&sort=newest`)
            .then(res => res.json())
            .then(data => {
                if (data.products) {
                    setFeaturedProducts(data.products.slice(0, 6));
                } else if (Array.isArray(data)) {
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
                <link rel="canonical" href="https://bazaar-motors.vercel.app/" />
            </Helmet>

            {/* ── Hero ── */}
            <section className="hero-v3">
                <div className="container hero-v3-inner">
                    <motion.div
                        className="hero-v3-content"
                        style={{ opacity: opacityHeroContent }}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                    >
                        <div className="hero-v3-badge">
                            <span className="badge-dot"></span>
                            Est. in Ruiru · Driven by Excellence
                        </div>
                        <h1 className="gradient-text">
                            Uncompromising<br />
                            <span className="accent">Performance.</span>
                        </h1>
                        <p className="hero-v3-desc">
                            Specializing in pristine Japanese imports and luxury vehicles. Elevate your journey with hand-picked units, direct-import butler services, and verified quality.
                        </p>
                        <div className="hero-v3-actions">
                            <Link to="/products" className="primary-btn hero-btn">
                                Explore Collection <ArrowRight size={17} />
                            </Link>
                            <a href={`https://wa.me/${BRAND.whatsapp}`} className="glass-btn secondary-hero-btn">
                                Custom Import <Globe size={15} />
                            </a>
                        </div>
                    </motion.div>
                </div>

                <motion.div className="hero-v3-image" style={{ y: yHeroBg }}>
                    <img 
                        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2864&auto=format&fit=crop" 
                        alt="Premium Vehicle" 
                    />
                    <div className="hero-v3-overlay"></div>
                </motion.div>

                <div className="hero-scroll">
                    <div className="hero-scroll-line"></div>
                    <span>Scroll</span>
                </div>
            </section>

            {/* ── Trust Bar ── */}
            <section className="trust-bar-v3">
                <div className="container trust-flex-v3">
                    {[
                        { num: '500+', desc: 'Vehicles Delivered' },
                        { num: '100%', desc: 'Verified History' },
                        { num: '4.9/5', desc: 'Customer Rating' },
                        { num: '6+', desc: 'Years Experience' }
                    ].map((item, idx) => (
                        <motion.div 
                            className="trust-item-v3" key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                            viewport={{ once: true, margin: '-50px' }}
                        >
                            <strong>{item.num}</strong>
                            <span>{item.desc}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Category Strip ── */}
            <section className="category-strip">
                <div className="container">
                    <div className="category-strip-inner">
                        <Link to="/products" className="cat-pill active">All Vehicles</Link>
                        <Link to="/products?category=SUV" className="cat-pill">SUVs</Link>
                        <Link to="/products?category=Sedan" className="cat-pill">Sedans</Link>
                        <Link to="/products?category=Hatchback" className="cat-pill">Hatchbacks</Link>
                        <Link to="/products?category=Pickup" className="cat-pill">Pickups</Link>
                        <Link to="/products?condition=Foreign+Used" className="cat-pill">Foreign Imports</Link>
                    </div>
                </div>
            </section>

            {/* ── Brand Grid ── */}
            <section className="brand-grid-v3">
                <div className="container">
                    <div className="section-header-v3 centered">
                        <span className="v3-sub">Prestige Marques</span>
                        <h2>TRUSTED <span className="accent">PARTNERS</span></h2>
                    </div>
                    <div className="brands-flex-v3">
                        <div className="brand-logo-v3" title="Toyota">Toyota</div>
                        <div className="brand-logo-v3" title="Subaru">Subaru</div>
                        <div className="brand-logo-v3" title="Mercedes-Benz">Mercedes</div>
                        <div className="brand-logo-v3" title="BMW">BMW</div>
                        <div className="brand-logo-v3" title="Nissan">Nissan</div>
                        <div className="brand-logo-v3" title="Honda">Honda</div>
                        <div className="brand-logo-v3" title="Land Rover">Range Rover</div>
                    </div>
                </div>
            </section>

            {/* ── Featured Showroom ── */}
            <section className="showroom-v3 container">
                <div className="v3-section-header">
                    <div className="v3-header-text">
                        <span className="v3-sub">Curated Selections</span>
                        <h2>LATEST <span className="accent">ARRIVALS</span></h2>
                    </div>
                    <Link to="/products" className="v3-link-more glass-panel">
                        Live Inventory <ChevronRight size={17} />
                    </Link>
                </div>
                <div className="v3-showroom-grid">
                    {loading ? (
                        [1, 2, 3].map(i => <CardSkeleton key={i} />)
                    ) : (
                        featuredProducts.map((car, idx) => (
                            <motion.div
                                key={car.id}
                                initial={{ opacity: 0, y: 36 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
                                viewport={{ once: true }}
                            >
                                <ProductCard product={car} />
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            {/* ── Featured Collections ── */}
            <section className="collections-promo-v3">
                <div className="container">
                    <div className="collections-grid-v3">
                        <Link to="/products?condition=Foreign+Used" className="col-card-v3 glass-panel">
                            <div className="col-card-bg japanese-bg"></div>
                            <div className="col-card-content">
                                <h3>Japanese Elite</h3>
                                <p>Pristine grade-4.5 direct imports.</p>
                                <span className="col-link">View Collection <ChevronRight size={14} /></span>
                            </div>
                        </Link>
                        <Link to="/products?category=SUV" className="col-card-v3 glass-panel">
                            <div className="col-card-bg luxury-bg"></div>
                            <div className="col-card-content">
                                <h3>Luxury & Prestige</h3>
                                <p>Premium SUVs and high-end sedans.</p>
                                <span className="col-link">Explore More <ChevronRight size={14} /></span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Elite Testimonials ── */}
            <section className="testimonials-v3">
                <div className="container">
                    <div className="section-header-v3 centered">
                        <span className="v3-sub">Client Stories</span>
                        <h2>VOICES OF <span className="accent">EXCELLENCE</span></h2>
                    </div>
                    <div className="testimonials-grid-v3">
                        <div className="testimonial-card-v3 glass-panel">
                            <p className="testo-quote">"The direct import process was transparent and flawless. My Land Cruiser arrived in even better condition than expected."</p>
                            <div className="testo-author">
                                <strong>David M.</strong>
                                <span>Business Owner, Nairobi</span>
                            </div>
                        </div>
                        <div className="testimonial-card-v3 glass-panel">
                            <p className="testo-quote">"Bazaar Motors sets a new standard for car dealerships in Kenya. The attention to detail and service is unparalleled."</p>
                            <div className="testo-author">
                                <strong>Sarah K.</strong>
                                <span>Verified Customer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Why Bazaar Motors ── */}
            <section className="features-v3">
                <div className="container">
                    <div className="v3-features-grid">
                        {[
                            { num: '01', icon: <Globe />, title: 'Direct Imports', desc: 'Seamlessly importing high-grade vehicles from Japan and UK auction houses directly to Ruiru.' },
                            { num: '02', icon: <ShieldCheck />, title: 'Rigorous Inspection', desc: 'Every vehicle undergoes a detailed 100-point mechanical and body inspection for your peace of mind.' },
                            { num: '03', icon: <Clock />, title: 'Ownership Support', desc: 'We handle all documentation, registration, and post-purchase maintenance support for you.' }
                        ].map((feat, idx) => (
                            <motion.div 
                                className="v3-feature-card" key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.15, duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
                                viewport={{ once: true, margin: '-50px' }}
                            >
                                <div className="v3-feat-num">{feat.num}</div>
                                <div className="v3-feature-icon">{feat.icon}</div>
                                <h3>{feat.title}</h3>
                                <p>{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Import Promo ── */}
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

            {/* ── Social ── */}
            <section className="social-v3 container">
                <div className="social-v3-card">
                    <div className="social-v3-content">
                        <Instagram size={30} />
                        <h3>Follow Our Journey</h3>
                        <p>Check out our latest deliveries and new stock arrivals on Instagram.</p>
                        <a href={BRAND.social?.instagram || '#'} target="_blank" rel="noreferrer" className="btn-v3-social">
                            @bazaar_motors
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
