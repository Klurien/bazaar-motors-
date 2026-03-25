import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Car, Sparkles, TrendingUp, ShieldCheck, Play, Award, Zap, Fuel, Gauge, Settings } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { BRAND } from '../brandConfig';
import './Home.css';

const API = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000"));

const FlashSalesCarousel = ({ promotions }) => {
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);

    const slides = promotions.length > 1
        ? [promotions[promotions.length - 1], ...promotions, promotions[0]]
        : promotions;

    useEffect(() => {
        if (promotions.length <= 1) return;
        const timer = setInterval(() => handleNext(), 5000);
        return () => clearInterval(timer);
    }, [promotions.length, current]);

    const handleNext = () => {
        if (promotions.length <= 1) return;
        setCurrent(prev => prev + 1);
    };

    const handleTransitionEnd = () => {
        if (current >= promotions.length) {
            setIsTransitioning(false);
            setCurrent(0);
        } else if (current < 0) {
            setIsTransitioning(false);
            setCurrent(promotions.length - 1);
        }
    };

    useEffect(() => {
        if (!isTransitioning) {
            setTimeout(() => setIsTransitioning(true), 50);
        }
    }, [isTransitioning]);

    if (!promotions || promotions.length === 0) return null;

    const displayIdx = promotions.length > 1 ? current + 1 : 0;

    return (
        <section className="flash-sales-section container">
            <div className="flash-carousel-outer">
                <div
                    className="flash-carousel-inner"
                    onTransitionEnd={handleTransitionEnd}
                    style={{
                        transform: `translateX(-${displayIdx * 100}%)`,
                        transition: (promotions.length > 1 && isTransitioning) ? 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                        width: `${slides.length * 100}%`
                    }}
                >
                    {slides.map((promo, i) => (
                        <div key={`${promo.id}-${i}`} className="flash-slide" style={{ width: `${100 / slides.length}%` }}>
                            <div className="flash-card-glow"></div>
                            <div className="flash-content glass">
                                <div className="flash-info">
                                    <div className="flash-tag">
                                        <Zap size={14} /> <span>Featured Import</span>
                                    </div>
                                    <h2>{promo.title}</h2>
                                    <p>{promo.subtitle}</p>
                                    <Link to={promo.link || "/products"} className="btn btn-accent">
                                        View Details <ArrowRight size={18} />
                                    </Link>
                                </div>
                                <div className="flash-visual">
                                    <img src={promo.image_url?.startsWith('http') ? promo.image_url : `${API}${promo.image_url}`} alt={promo.title} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {promotions.length > 1 && (
                    <div className="flash-nav">
                        {promotions.map((_, i) => (
                            <button
                                key={i}
                                className={`flash-dot ${i === current ? 'active' : ''}`}
                                onClick={() => setCurrent(i)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

const Home = () => {
    const [products, setProducts] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scrollDepth, setScrollDepth] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const h = document.documentElement, b = document.body, st = 'scrollTop', sh = 'scrollHeight';
            const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
            setScrollDepth(percent);
        };
        window.addEventListener('scroll', handleScroll);

        const fetchData = async () => {
            try {
                const [pRes, promRes] = await Promise.all([
                    fetch(`${API}/api/products`),
                    fetch(`${API}/api/promotions`)
                ]);
                const pData = await pRes.json();
                const promData = await promRes.json();
                setProducts(pData.slice(0, 8));
                setPromotions(promData);
            } catch (err) {
                console.error(err);
                // Placeholder content if API is down
                setPromotions([
                    {
                        id: 1,
                        title: "2018 Toyota Harrier",
                        subtitle: "Pristine condition, Pearl White, Direct Import.",
                        image_url: "https://images.unsplash.com/photo-1621359983222-7517c4690ef1?q=80&w=2070&auto=format&fit=crop"
                    },
                    {
                        id: 2,
                        title: "Lexus NX300h",
                        subtitle: "Hybrid Efficiency meets Luxury.",
                        image_url: "https://images.unsplash.com/photo-1549317661-bd3293003975?q=80&w=2070&auto=format&fit=crop"
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="home-page">
            <Helmet>
                <title>{BRAND.nameRaw} | Premium Japanese Imports</title>
                <meta name="description" content={BRAND.description} />
            </Helmet>
            <div className="scroll-progress" style={{ width: `${scrollDepth}%` }}></div>

            <section className="hero">
                <div className="container hero-grid">
                    <div className="hero-text-side">
                        <div className="hero-badge animate-in-1">
                            <Award size={14} /> <span>{BRAND.hero.badge}</span>
                        </div>
                        <h1 className="animate-in-2">
                            {BRAND.hero.titleMain} <br />
                            <span className="accent-text">{BRAND.hero.titleAccent}</span> <br />
                            {BRAND.hero.titleSuffix}
                        </h1>
                        <p className="animate-in-3">
                            {BRAND.hero.subtitle}
                        </p>
                        <div className="hero-actions animate-in-4">
                            <Link to="/products" className="btn btn-primary glow">
                                Explore Inventory
                            </Link>
                            <Link to="/products?category=SUV" className="btn btn-accent">
                                View SUVs
                            </Link>
                        </div>

                        <div className="hero-trust animate-in-5">
                            <div className="trust-pill">
                                <ShieldCheck size={14} /> Certified Imports
                            </div>
                            <div className="trust-pill">
                                <Zap size={14} /> Financing Available
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual-side animate-in-scale">
                        <div className="hero-main-img-wrapper">
                            <img
                                src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1936&auto=format&fit=crop"
                                alt="Bazaar Motors Luxury Showroom"
                                className="hero-main-img"
                            />
                            <div className="hero-floating-card glass">
                                <span className="card-label">Top Choice</span>
                                <h4>Toyota Prado TX-L</h4>
                                <p>Diesel Turbo 2.8L</p>
                                <Link to="/products" className="card-link">View Details <ArrowRight size={14} /></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="trust-ribbon">
                <div className="ribbon-track">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="ribbon-item">
                            <Car size={16} /> PREMIUM IMPORTS
                            <Gauge size={16} /> VERIFIED MILEAGE
                            <Settings size={16} /> FULL SERVICE HISTORY
                            <ShieldCheck size={16} /> QISJ CERTIFIED
                        </div>
                    ))}
                </div>
            </div>

            <FlashSalesCarousel promotions={promotions} />

            <section className="featured-section container">
                <div className="section-intro">
                    <span className="eyebrow">Our Collections</span>
                    <h2>Featured Vehicles</h2>
                    <p>Hand-picked luxury and utility vehicles that define reliability and style.</p>
                </div>

                <div className="product-layout-grid">
                    <div className="grid-sidebar-info">
                        <div className="bento-card bento-cta glass">
                            <h3>Looking for something specific?</h3>
                            <p>We handle direct imports from Japan to your doorstep. Tell us your dream car.</p>
                            <a href={`https://wa.me/${BRAND.whatsapp}`} className="btn btn-primary btn-sm">Talk to Us</a>
                        </div>
                        <div className="bento-card bento-stat">
                            <span className="big-num">500+</span>
                            <p>Happy Drivers Served</p>
                        </div>
                    </div>

                    <div className="grid-main-content">
                        {loading ? (
                            <div className="product-grid-skeleton">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="skeleton-card pulse"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="product-grid">
                                {products.length > 0 ? products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                )) : (
                                    <div className="no-products glass">
                                        <p>Our inventory is being updated. Check back shortly!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="experience-section">
                <div className="container experience-grid">
                    <div className="experience-box h-full">
                        <span className="badge experience-badge">The Bazaar Way</span>
                        <h2>Buying Made Easy</h2>
                        <p>We ensure a transparent, secure, and delightful car buying experience from start to finish.</p>
                        <ul className="premium-list">
                            <li><CheckCircle size={18} /> Transparent Pricing Policy</li>
                            <li><CheckCircle size={18} /> Verified Logbooks & History</li>
                            <li><CheckCircle size={18} /> Flexible Finance Options</li>
                        </ul>
                    </div>
                    <div className="experience-visual">
                        <div className="floating-elements">
                            <div className="float-img f1">
                                <img src="https://images.unsplash.com/photo-1549317661-bd3293003975?q=80&w=1000&auto=format&fit=crop" alt="Lexus" />
                            </div>
                            <div className="float-img f2">
                                <img src="https://images.unsplash.com/photo-1621359983222-7517c4690ef1?q=80&w=1000&auto=format&fit=crop" alt="Harrier" />
                            </div>
                            <div className="float-img f3">
                                <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop" alt="Prado" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="newsletter-editorial container">
                <div className="editorial-inner glass">
                    <div className="editorial-text">
                        <h2>Join the Inner Circle</h2>
                        <p>Get notified about new arrivals and special import deals before they hit the yard.</p>
                    </div>
                    <form className="newsletter-premium-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Your aesthetic email..." />
                        <button type="submit" className="btn btn-primary">Subscribe</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

const CheckCircle = ({ size }) => (
    <div style={{ color: 'var(--accent-color)', display: 'flex' }}><ShieldCheck size={size} /></div>
);


export default Home;

