import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, Star, Minus, Plus, Share2, ChevronLeft, ChevronRight, ShieldCheck, Award, Info, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';
import './ProductDetail.css';

const API = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000"))));

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedFeedback, setAddedFeedback] = useState(false);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProductData = async () => {
            try {
                const res = await fetch(`${API}/api/products/${id}`);
                const data = await res.json();
                setProduct(data);

                // Fetch related products
                const allRes = await fetch(`${API}/api/products`);
                const allData = await allRes.json();
                const filtered = allData
                    .filter(p => p.category === data.category && p.id !== data.id)
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

    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        addToCart(product, quantity);
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 2000);
    };

    const handleBuyNow = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        addToCart(product, quantity);
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="container product-detail-skeleton animate-pulse">
                <div className="skeleton-grid">
                    <div className="skeleton-media glass"></div>
                    <div className="skeleton-info">
                        <div className="skel-line w-1/4 h-4"></div>
                        <div className="skel-line w-3/4 h-12"></div>
                        <div className="skel-line w-full h-32"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const images = product.images?.length > 0
        ? product.images.map(img => `${API}${img.url}`)
        : [product.image_url ? `${API}${product.image_url}` : 'https://placehold.co/800x800?text=Finding+Image'];

    return (
        <div className="product-detail-page">
            <Helmet>
                <title>{product.name} | Kitchen Finds</title>
                <meta name="description" content={product.description?.substring(0, 160) || "Discover artisan kitchen finds."} />
                <meta property="og:title" content={`${product.name} | Premium Kitchen Finds`} />
                <meta property="og:description" content={product.description?.substring(0, 160)} />
                <meta property="og:image" content={images[0]} />
                <meta name="twitter:card" content="summary_large_image" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "name": product.name,
                        "image": images,
                        "description": product.description || "Premium kitchen finding.",
                        "brand": {
                            "@type": "Brand",
                            "name": "Kitchen Finds"
                        },
                        "offers": {
                            "@type": "Offer",
                            "url": typeof window !== "undefined" ? window.location.href : '',
                            "priceCurrency": "USD",
                            "price": parseFloat(product.price),
                            "itemCondition": "https://schema.org/NewCondition",
                            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                            "seller": {
                                "@type": "Organization",
                                "name": "Kitchen Finds"
                            }
                        }
                    })}
                </script>
            </Helmet>
            <div className="container">
                <div className="detail-layout">
                    {/* Media Module - Vertical Thumbs Layout */}
                    <div className="media-module-v2">
                        <div className="v-thumb-list">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    className={`v-thumb-item ${selectedImageIdx === idx ? 'active' : ''}`}
                                    onClick={() => setSelectedImageIdx(idx)}
                                >
                                    <img src={img} alt="" />
                                </button>
                            ))}
                        </div>
                        <div className="v-main-viewer glass">
                            <img src={images[selectedImageIdx]} alt={product.name} />

                            {images.length > 1 && (
                                <div className="v-viewer-nav">
                                    <button className="nav-btn left" onClick={() => setSelectedImageIdx(i => (i - 1 + images.length) % images.length)}>
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button className="nav-btn right" onClick={() => setSelectedImageIdx(i => (i + 1) % images.length)}>
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            )}

                            <button className="zoom-btn" title="Expand Details">
                                <Search size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Information Module */}
                    <div className="info-module-v2">
                        <h1 className="v-product-title">{product.name}</h1>
                        <div className="v-product-price">
                            KSh {parseFloat(product.price).toLocaleString()}
                        </div>

                        <div className="v-purchase-section">
                            <div className="v-qty-control">
                                <span className="qty-label">Quantity</span>
                                <div className="qty-box">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={16} /></button>
                                    <span className="qty-val">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)}><Plus size={16} /></button>
                                </div>
                            </div>

                            <div className="v-action-stack">
                                <button
                                    className={`v-btn-outline ${addedFeedback ? 'success' : ''}`}
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                >
                                    {addedFeedback ? 'Success! Added' : 'Add to Collection'}
                                </button>
                                <button
                                    className="v-btn-solid"
                                    onClick={handleBuyNow}
                                    disabled={product.stock <= 0}
                                >
                                    {product.stock <= 0 ? 'Finding Archived' : 'Instant Acquisition'}
                                </button>
                            </div>
                        </div>

                        <div className="v-product-meta">
                            <p className="v-desc-text">
                                {product.description || "A master-grade culinary finding, precision-engineered for the modern kitchen sanctuary."}
                            </p>
                            <div className="v-features-list">
                                <div className="feature-item">
                                    <ShieldCheck size={18} />
                                    <span>Lifetime Artisan Integrity Warranty</span>
                                </div>
                                <div className="feature-item">
                                    <Award size={18} />
                                    <span>Verified Professional Grade Performance</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* You may also like section */}
                {relatedProducts.length > 0 && (
                    <section className="related-finds-section">
                        <div className="related-header">
                            <h2>Selected Masterpieces</h2>
                            <p>Hand-picked alternatives that share this finding's DNA.</p>
                        </div>
                        <div className="related-grid">
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
