import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Clock, MapPin, Search, Leaf, Globe, ArrowRight, Instagram } from 'lucide-react';
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

    const [searchMake, setSearchMake] = useState('All');

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
                <title>IslandLeaf | Premium Jamaican Cannabis & Herbal Wellness</title>
                <meta name="description" content="Discover Jamaica's finest curated selection of premium strains, edibles, and wellness products at IslandLeaf. Lab tested, locally grown." />
                <link rel="canonical" href="https://islandleaf.vercel.app/" />
            </Helmet>

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
                            Est. in Kingston · Rooted in Nature
                        </div>
                        <h1 className="gradient-text">
                            Rooted in<br />
                            <span className="accent">Nature.</span>
                        </h1>
                        <p className="hero-v3-desc">
                            Jamaica's premier marketplace for premium cannabis strains and herbal wellness. 
                            Every product lab-tested, locally grown, and delivered with island care.
                        </p>
                        <div className="hero-v3-actions">
                            <Link to="/products" className="primary-btn hero-btn">
                                Explore Dispensary <ArrowRight size={17} />
                            </Link>
                            <a href={`https://wa.me/${BRAND.whatsapp}`} className="glass-btn secondary-hero-btn">
                                Grower Consult <Globe size={15} />
                            </a>
                        </div>
                    </motion.div>
                </div>

                <motion.div className="hero-v3-image" style={{ y: yHeroBg }}>
                    <img 
                        src="https://images.unsplash.com/photo-1603900055207-07f571524012?q=80&w=2970&auto=format&fit=crop" 
                        alt="Premium Cannabis" 
                    />
                    <div className="hero-v3-overlay"></div>
                </motion.div>

                <div className="hero-scroll">
                    <div className="hero-scroll-line"></div>
                    <span>Scroll</span>
                </div>
            </section>

            <section className="trust-bar-v3">
                <div className="container trust-flex-v3">
                    {[
                        { num: '100+', desc: 'Premium Strains' },
                        { num: '100%', desc: 'Lab Tested' },
                        { num: '4.9/5', desc: 'Customer Rating' },
                        { num: '10+', desc: 'Years Experience' }
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

            <section className="category-strip">
                <div className="container">
                    <div className="category-strip-inner">
                        <Link to="/products" className="cat-pill active">All Strains</Link>
                        <Link to="/products?category=Indica" className="cat-pill">Indica</Link>
                        <Link to="/products?category=Sativa" className="cat-pill">Sativa</Link>
                        <Link to="/products?category=Hybrid" className="cat-pill">Hybrid</Link>
                        <Link to="/products?category=Edibles" className="cat-pill">Edibles</Link>
                        <Link to="/products?category=CBD" className="cat-pill">CBD</Link>
                    </div>
                </div>
            </section>

            <section className="brand-grid-v3">
                <div className="container">
                    <div className="section-header-v3 centered">
                        <span className="v3-sub">Heritage Strains</span>
                        <h2>ISLAND <span className="accent">CLASSICS</span></h2>
                    </div>
                    <div className="brands-flex-v3">
                        <div className="brand-logo-v3" title="Blue Mountain">Blue Mountain</div>
                        <div className="brand-logo-v3" title="Kingston Kush">Kingston Kush</div>
                        <div className="brand-logo-v3" title="Jamaican Pearl">Jamaican Pearl</div>
                        <div className="brand-logo-v3" title="Rasta Gold">Rasta Gold</div>
                        <div className="brand-logo-v3" title="Island Haze">Island Haze</div>
                        <div className="brand-logo-v3" title="Tropical Dream">Tropical Dream</div>
                        <div className="brand-logo-v3" title="Montego Blue">Montego Blue</div>
                    </div>
                </div>
            </section>

            <section className="showroom-v3 container">
                <div className="v3-section-header">
                    <div className="v3-header-text">
                        <span className="v3-sub">Curated Selections</span>
                        <h2>FRESH <span className="accent">CATCH</span></h2>
                    </div>
                    <Link to="/products" className="v3-link-more glass-panel">
                        Full Dispensary <ChevronRight size={17} />
                    </Link>
                </div>
                <div className="v3-showroom-grid">
                    {loading ? (
                        [1, 2, 3].map(i => <CardSkeleton key={i} />)
                    ) : (
                        featuredProducts.map((strain, idx) => (
                            <motion.div
                                key={strain.id}
                                initial={{ opacity: 0, y: 36 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
                                viewport={{ once: true }}
                            >
                                <ProductCard product={strain} />
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            <section className="collections-promo-v3">
                <div className="container">
                    <div className="collections-grid-v3">
                        <Link to="/products?category=Indica" className="col-card-v3 glass-panel">
                            <div className="col-card-bg japanese-bg"></div>
                            <div className="col-card-content">
                                <h3>Island Indica</h3>
                                <p>Deep relaxation from the Blue Mountains.</p>
                                <span className="col-link">View Collection <ChevronRight size={14} /></span>
                            </div>
                        </Link>
                        <Link to="/products?category=Sativa" className="col-card-v3 glass-panel">
                            <div className="col-card-bg luxury-bg"></div>
                            <div className="col-card-content">
                                <h3>Golden Sativa</h3>
                                <p>Uplifting energy from tropical sun.</p>
                                <span className="col-link">Explore More <ChevronRight size={14} /></span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="testimonials-v3">
                <div className="container">
                    <div className="section-header-v3 centered">
                        <span className="v3-sub">Customer Voices</span>
                        <h2>ISLAND <span className="accent">REVIEWS</span></h2>
                    </div>
                    <div className="testimonials-grid-v3">
                        <div className="testimonial-card-v3 glass-panel">
                            <p className="testo-quote">"The Blue Mountain Kush is incredible — truly authentic Jamaican quality. Fast discreet delivery right to my door in Montego Bay."</p>
                            <div className="testo-author">
                                <strong>David M.</strong>
                                <span>Verified Customer, Montego Bay</span>
                            </div>
                        </div>
                        <div className="testimonial-card-v3 glass-panel">
                            <p className="testo-quote">"IslandLeaf sets the standard for cannabis delivery in Jamaica. The lab testing results give me full confidence in every purchase."</p>
                            <div className="testo-author">
                                <strong>Sarah K.</strong>
                                <span>Verified Customer, Kingston</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-v3">
                <div className="container">
                    <div className="v3-features-grid">
                        {[
                            { num: '01', icon: <Globe />, title: 'Island Grown', desc: 'Premium strains cultivated in Jamaica\'s fertile Blue Mountain region with generations of botanical expertise.' },
                            { num: '02', icon: <ShieldCheck />, title: 'Lab Tested', desc: 'Every batch undergoes rigorous third-party lab testing for potency, purity, and safety — results transparently shared.' },
                            { num: '03', icon: <Clock />, title: 'Discreet Delivery', desc: 'Island-wide discreet delivery with trackable shipping. Your privacy and satisfaction guaranteed.' }
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

            <section className="import-promo-v3">
                <div className="container import-flex-v3">
                    <div className="import-text-v3">
                        <span className="v3-sub">Special Service</span>
                        <h2>Grower <span className="accent">Direct Program</span></h2>
                        <p>Looking for something specific? Connect directly with our network of trusted Jamaican growers for custom orders, bulk pricing, and exclusive drops.</p>
                        <button className="btn-v3-dark" onClick={() => window.open(`https://wa.me/${BRAND.whatsapp}`, '_blank')}>
                            Talk to a Grower
                        </button>
                    </div>
                    <div className="import-visual-v3">
                        <div className="import-image-wrap">
                            <img src="https://images.unsplash.com/photo-1610751399547-46ccca892232?q=80&w=2070&auto=format&fit=crop" alt="Jamaican cannabis farm" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="social-v3 container">
                <div className="social-v3-card">
                    <div className="social-v3-content">
                        <Instagram size={30} />
                        <h3>Follow the Vibe</h3>
                        <p>Check out our latest drops and Jamaican cannabis culture on Instagram.</p>
                        <a href={BRAND.social?.instagram || '#'} target="_blank" rel="noreferrer" className="btn-v3-social">
                            @islandleaf
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
