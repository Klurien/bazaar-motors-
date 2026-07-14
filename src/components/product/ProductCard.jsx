import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Star } from 'lucide-react';
import { BRAND } from '../../brandConfig';
import './ProductCard.css';

const ProductCard = ({ product, compact = false }) => {
    const handleWhatsApp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const message = `Hi IslandLeaf, I am interested in ${product.name} (JMD ${parseFloat(product.price).toLocaleString()}). Is it available?`;
        window.open(`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const imageUrl = product.image_url
        ? (product.image_url.startsWith('http') ? product.image_url : `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "")}${product.image_url}`)
        : 'https://images.unsplash.com/photo-1603900055207-07f571524012?q=80&w=400&auto=format&fit=crop';

    return (
        <div className={`vehicle-card-v3 animate-reveal ${compact ? 'v3-compact' : ''}`}>
            <Link to={`/products/${product.id}`} className="v3-card-link">
                <div className="v3-card-media">
                    <img src={imageUrl} alt={product.name} />
                    <div className="v3-overlay-grad"></div>
                    <div className="v3-card-badges">
                        {product.condition && <span className="v3-badge">{product.condition}</span>}
                        {product.year && <span className="v3-badge year">{product.year}</span>}
                    </div>
                </div>

                <div className="v3-card-info">
                    <div className="v3-card-header">
                        <span className="v3-make">{product.make || 'PREMIUM'}</span>
                        <h3 className="v3-title">{product.name}</h3>
                    </div>

                    <div className="v3-specs-grid">
                        <div className="v3-spec">
                            <span className="v3-label">Type</span>
                            <span className="v3-val">{product.transmission || 'Hybrid'}</span>
                        </div>
                        <div className="v3-spec">
                            <span className="v3-label">THC</span>
                            <span className="v3-val">{product.fuel_type || '22%'}</span>
                        </div>
                        <div className="v3-spec">
                            <span className="v3-label">Quantity</span>
                            <span className="v3-val">{product.mileage || '3.5g'}</span>
                        </div>
                    </div>

                    <div className="v3-card-footer">
                        <div className="v3-price-wrap">
                            <span className="v3-price-label">Price</span>
                            <span className="v3-price">JMD {parseFloat(product.price).toLocaleString()}</span>
                        </div>
                        <button className="v3-whatsapp-btn" onClick={handleWhatsApp}>
                            <MessageCircle size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
