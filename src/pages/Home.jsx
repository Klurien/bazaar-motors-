import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChefHat, Sparkles, TrendingUp, ShieldCheck, Play, Award, Zap } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import './Home.css';

const API = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000"))));

const FlashSalesCarousel = ({ promotions }) => {
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);

    // Create an augmented list for infinite loop: [Last, ...Original, First]
    const slides = promotions.length > 1
        ? [promotions[promotions.length - 1], ...promotions, promotions[0]]
        : promotions;

    useEffect(() => {
        if (promotions.length <= 1) return;

        const timer = setInterval(() => {
            handleNext();
        }, 5000);

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
            // Re-enable transition after the jump
            setTimeout(() => setIsTransitioning(true), 50);
        }
    }, [isTransitioning]);

    if (!promotions || promotions.length === 0) return null;

    // The index in the augmented 'slides' array
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
                                        <Zap size={14} /> <span>Limited Time Offer</span>
                                    </div>
                                    <h2>{promo.title}</h2>
                                    <p>{promo.subtitle}</p>
                                    <Link to={promo.link || "/products"} className="btn btn-accent">
                                        Explore Sale <ArrowRight size={18} />
                                    </Link>
                                </div>
                                <div className="flash-visual">
                                    <img src={`${API}${promo.image_url}`} alt={promo.title} />
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
            const h = document.documentElement,
                b = document.body,
                st = 'scrollTop',
                sh = 'scrollHeight';
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
                <title>Premium Kitchen Finds | Culinary Artistry</title>
                <meta name="description" content="A curated luxury collection of professional cookware and rare culinary tools designed for the modern master." />
            </Helmet>
            <div className="scroll-progress" style={{ width: `${scrollDepth}%` }}></div>

            <section className="hero">
                <div className="container hero-grid">
                    <div className="hero-text-side">
                        <div className="hero-badge animate-in-1">
                            <Award size={14} /> <span>Voted #1 Kitchen Finding 2026</span>
                        </div>
                        <h1 className="animate-in-2">
                            Where Culinary <br />
                            <span className="accent-text">Craft Meets</span> <br />
                            Pure Artistry.
                        </h1>
                        <p className="animate-in-3">
                            Escape the departmental. Discover an architectural collection of professional cookware and rare culinary tools designed for the modern master.
                        </p>
                        <div className="hero-actions animate-in-4">
                            <Link to="/products" className="btn btn-accent glow">
                                Shop The Collection
                            </Link>
                            <Link to="/products?category=Cookware" className="btn btn-outline">
                                View Lookbook
                            </Link>
                        </div>

                        <div className="hero-trust animate-in-5">
                            <div className="trust-pill">
                                <Zap size={14} /> 24h Express Delivery
                            </div>
                            <div className="trust-pill">
                                <ShieldCheck size={14} /> Lifetime Artisan Warranty
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual-side animate-in-scale">
                        <div className="hero-main-img-wrapper">
                            <img
                                src="/home/nova/.gemini/antigravity/brain/0586211d-cdf0-4380-8b65-ef9c6e6bf433/premium_kitchen_hero_jpg_1773578871311.png"
                                alt="Culinary Artistry"
                                className="hero-main-img"
                            />
                            <div className="hero-floating-card glass">
                                <span className="card-label">Chef's Choice</span>
                                <h4>Featured Copper Pan</h4>
                                <p>5-Ply Construction</p>
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
                            <TrendingUp size={16} /> BEYOND COOKING
                            <Sparkles size={16} /> CULINARY PRECISION
                            <ChefHat size={16} /> MICHELIN APPROVED
                        </div>
                    ))}
                </div>
            </div>

            <FlashSalesCarousel promotions={promotions} />

            <section className="featured-section container">
                <div className="section-intro">
                    <span className="eyebrow">The 2026 Findings</span>
                    <h2>Selected Masterpieces</h2>
                    <p>Hand-picked tools that bridge the gap between amateur and artisan.</p>
                </div>

                <div className="product-layout-grid">
                    <div className="grid-sidebar-info">
                        <div className="bento-card bento-cta glass">
                            <h3>Ready to Upgrade?</h3>
                            <p>Our concierge can help you build the perfect professional kitchen from scratch.</p>
                            <Link to="/products" className="btn btn-primary btn-sm">Get Started</Link>
                        </div>
                        <div className="bento-card bento-stat">
                            <span className="big-num">12k+</span>
                            <p>Global Chefs Trust Us</p>
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
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="experience-section">
                <div className="container experience-grid">
                    <div className="experience-box glass h-full">
                        <span className="badge">The Experience</span>
                        <h2>Unboxing Excellence</h2>
                        <p>Every finding comes with a personalized care guide and an artisan authenticity certificate.</p>
                        <ul className="premium-list">
                            <li><CheckCircle size={18} /> Vacuum Sealed for Purity</li>
                            <li><CheckCircle size={18} /> FSC Certified Packaging</li>
                            <li><CheckCircle size={18} /> Global Concierge Support</li>
                        </ul>
                    </div>
                    <div className="experience-visual">
                        <div className="floating-elements">
                            <div className="float f1 glass">Gadgets</div>
                            <div className="float f2 glass">Dining</div>
                            <div className="float f3 glass">Copper</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="newsletter-editorial container">
                <div className="editorial-inner glass">
                    <div className="editorial-text">
                        <h2>The Culinary Quarterly</h2>
                        <p>A refined newsletter for those who view the kitchen as a sanctuary. No spam, only rare findings. </p>
                    </div>
                    <form className="newsletter-premium-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Your aesthetic email..." />
                        <button type="submit" className="btn btn-primary">Join Circle</button>
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
