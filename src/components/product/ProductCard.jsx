import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star, MessageCircle, Info } from 'lucide-react';
import { BRAND } from '../../brandConfig';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleWhatsApp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const message = `Hi Bazaar Motors, I am interested in the ${product.name} (KES ${product.price.toLocaleString()}). Is it still available?`;
        window.open(`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const imageUrl = product.image_url
        ? (product.image_url.startsWith('http') ? product.image_url : `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000")}${product.image_url}`)
        : 'https://images.unsplash.com/photo-1549317661-bd3293003975?q=80&w=400&auto=format&fit=crop';

    return (
        <div
            className="premium-product-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={`/products/${product.id}`} className="card-inner">
                <div className="card-media">
                    <img src={imageUrl} alt={product.name} />

                    {product.stock > 0 ? (
                        <span className="stock-badge low">Available</span>
                    ) : (
                        <span className="stock-badge out">Sold Out</span>
                    )}

                    <div className="card-overlay">
                        <div className="overlay-actions">
                            <button className="action-btn-p" onClick={handleWhatsApp}>
                                <MessageCircle size={20} />
                                <span>Enquire</span>
                            </button>
                            <div className="action-btn-icon">
                                <Info size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-info">
                    <div className="info-top">
                        <span className="card-category">{product.category}</span>
                        <div className="card-rating">
                            <Star size={12} fill="#FF7A00" color="#FF7A00" />
                            <span>Pristine</span>
                        </div>
                    </div>
                    <h3 className="card-title">{product.name}</h3>
                    <div className="info-bottom">
                        <span className="card-price">KSh {parseFloat(product.price).toLocaleString()}</span>
                    </div>
                    <button className="card-view-btn">View Vehicle</button>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;

