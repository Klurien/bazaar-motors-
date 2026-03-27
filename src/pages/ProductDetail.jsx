import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Check,
    ChevronLeft,
    ChevronRight,
    Gauge,
    Fuel,
    Settings,
    Dna,
    User,
    Phone,
    Mail,
    MessageSquare,
    Calendar,
    Zap,
    Wind,
    ShieldCheck,
    CarFront
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/product/ProductCard';
import { BRAND } from '../brandConfig';
import './ProductDetail.css';

const API = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000"));

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProductData = async () => {
            try {
                const res = await fetch(`${API}/api/products/${id}`);
                const data = await res.json();
                setProduct(data);

                // Fetch suggested products (by category or make)
                const allRes = await fetch(`${API}/api/products`);
                const allData = await allRes.json();
                const filtered = allData
                    .filter(p => (p.category === data.category || p.make === data.make) && p.id !== data.id)
                    .slice(0, 4);
                setRelatedProducts(filtered);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
                navigate('/products');
            }
        };
        fetchProductData();
    }, [id]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the inquiry to the backend or WhatsApp
        const whatsappMsg = `Inquiry for ${product.year} ${product.name}:\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`;
        window.open(`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
    };

    if (loading) {
        return (
            <div className="product-detail-skeleton-v3 container">
                <div className="skel-grid">
                    <div className="skel-media pulse"></div>
                    <div className="skel-content">
                        <div className="skel-title pulse"></div>
                        <div className="skel-specs pulse"></div>
                        <div className="skel-form pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const images = product.images?.length > 0
        ? product.images.map(img => img.url.startsWith('http') ? img.url : `${API}${img.url}`)
        : [product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `${API}${product.image_url}`) : 'https://placehold.co/800x600?text=Vehicle+Image'];

    const vehicleSpecs = [
        { icon: <Dna size={20} />, label: 'Body Type', value: product.category || 'SUV' },
        { icon: <Gauge size={20} />, label: 'Mileage', value: product.mileage ? `${product.mileage.toLocaleString()} km` : 'TBA' },
        { icon: <Zap size={20} />, label: 'Engine', value: product.engine_capacity || 'N/A' },
        { icon: <Fuel size={20} />, label: 'Fuel', value: product.fuel_type || 'Petrol' },
        { icon: <Settings size={20} />, label: 'Drive', value: product.transmission || 'Automatic' },
        { icon: <ShieldCheck size={20} />, label: 'Grade', value: product.auction_grade || 'Auction 4.5/B' },
    ];

    let featuresArray = ["Air Conditioning", "Airbags", "Alloy Wheels", "Power Steering", "Rear Camera"];
    if (product.features) {
        try {
            // Check if it's JSON
            const parsed = JSON.parse(product.features);
            if (Array.isArray(parsed)) featuresArray = parsed;
        } catch {
            // Otherwise assume comma-separated
            featuresArray = product.features.split(',').map(f => f.trim());
        }
    }

    return (
        <div className="vehicle-detail-page">
            <Helmet>
                <title>{`${product.year} ${product.name} for Sale | Bazaar Motors`}</title>
                <meta name="description" content={`Check out the ${product.year} ${product.name} at Bazaar Motors Ruiru. Performance: ${product.engine_capacity}, Mileage: ${product.mileage}. Contact us today.`} />
            </Helmet>

            <div className="container">
                <div className="detail-hero-v3">
                    <div className="detail-header-v3">
                        <div className="header-top-v3">
                            <span className="v3-sub">{product.make} SHOWROOM</span>
                            <h1>{product.year} {product.name}</h1>
                        </div>
                        <div className="v3-price-impact">
                            <span className="impact-label">List Price</span>
                            <div className="impact-val">KSh {parseFloat(product.price).toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="detail-media-layout-v3">
                        <div className="main-gallery-v3 glass-panel">
                            <img src={images[selectedImageIdx]} alt={product.name} />
                            {images.length > 1 && (
                                <div className="gallery-nav-v3">
                                    <button onClick={() => setSelectedImageIdx(i => (i - 1 + images.length) % images.length)}><ChevronLeft /></button>
                                    <button onClick={() => setSelectedImageIdx(i => (i + 1) % images.length)}><ChevronRight /></button>
                                </div>
                            )}
                            <div className="thumb-track-v3">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        className={selectedImageIdx === idx ? 'active' : ''}
                                        onClick={() => setSelectedImageIdx(idx)}
                                    >
                                        <img src={img} alt="" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="specs-sidebar-v3">
                            <div className="specs-grid-v3">
                                {vehicleSpecs.map((spec, i) => (
                                    <div key={i} className="spec-tile-v3 glass-panel">
                                        <div className="tile-icon-v3">{spec.icon}</div>
                                        <div className="tile-info-v3">
                                            <span className="tile-label-v3">{spec.label}</span>
                                            <span className="tile-val-v3">{spec.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="action-stack-v3">
                                <button
                                    className="primary-btn wide-btn"
                                    onClick={() => window.open(`https://wa.me/${BRAND.whatsapp}?text=I%20am%20interested%20in%20a%20test%20drive%20for%20the%20${product.name}`, '_blank')}
                                >
                                    <Calendar size={18} /> BOOK TEST DRIVE
                                </button>
                                <div className="alt-actions-v3">
                                    <a href={`tel:${BRAND.phone}`} className="glass-btn flex-1 j-center"><Phone size={16} /> CALL</a>
                                    <button onClick={() => window.open(`https://wa.me/${BRAND.whatsapp}`, '_blank')} className="glass-btn flex-1 j-center"><MessageSquare size={16} /> CHAT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="vehicle-secondary-layout">
                    {/* Left: Description & Features */}
                    <div className="info-main-col">
                        <section className="detail-section">
                            <h2 className="section-title-alt">Description</h2>
                            <div className="description-text">
                                <p>{product.description || `This ${product.year} ${product.name} is a prime example of performance and luxury. Direct imports with verified auction sheets and meticulous maintenance history. Perfect for those seeking reliability and style on Kenyan roads.`}</p>
                                <ul className="key-bullet-points">
                                    <li>Meticulously Maintained Foreign Used</li>
                                    <li>High Efficiency {product.engine_capacity} Engine</li>
                                    <li>Fully Loaded with {product.transmission} Transmission</li>
                                    <li>Import Quality Compliance (QISJ/KEBS)</li>
                                </ul>
                            </div>
                        </section>

                        <section className="detail-section">
                            <h2 className="section-title-alt">Top Features</h2>
                            <div className="features-checklist-v3">
                                {featuresArray.map((feat, i) => (
                                    <div key={i} className="feature-check-item">
                                        <div className="check-dot"></div>
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right: Inquiry Form */}
                    <aside className="inquiry-sidebar">
                        <div className="inquiry-card glass-v2">
                            <h3>Send an <span className="highlight">Inquiry</span></h3>
                            <form onSubmit={handleFormSubmit} className="sidebar-form">
                                <div className="form-group-v3">
                                    <label>Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-v3">
                                    <label>Phone *</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+254..."
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-v3">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="you@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-v3">
                                    <label>Message *</label>
                                    <textarea
                                        required
                                        rows="4"
                                        placeholder="I am interested in this vehicle..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>
                                <button type="submit" className="submit-inquiry-btn">Submit Inquiry</button>
                            </form>
                        </div>
                    </aside>
                </div>

                {/* Similar Vehicles */}
                {relatedProducts.length > 0 && (
                    <section className="similar-vehicles-section">
                        <div className="section-header-alt">
                            <h2>SUGGESTED <span className="highlight">FOR YOU</span></h2>
                            <Link to="/products" className="view-more">Browse Showroom</Link>
                        </div>
                        <div className="similar-grid-v3">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;

