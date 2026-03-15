import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    const imageUrl = product.image_url
        ? `http://localhost:5000${product.image_url}`
        : 'https://placehold.co/400x400?text=Kitchen+Find';

    return (
        <div
            className="premium-product-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={`/products/${product.id}`} className="card-inner">
                <div className="card-media">
                    <img src={imageUrl} alt={product.name} />

                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="stock-badge low">Limited Finding</span>
                    )}
                    {product.stock === 0 && (
                        <span className="stock-badge out">Finding Archived</span>
                    )}

                    <div className="card-overlay">
                        <div className="overlay-actions">
                            <button className="action-btn-p" onClick={handleAddToCart} disabled={product.stock === 0}>
                                <Plus size={20} />
                                <span>Add to Set</span>
                            </button>
                            <div className="action-btn-icon">
                                <Eye size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-info">
                    <div className="info-top">
                        <span className="card-category">{product.category}</span>
                        <div className="card-rating">
                            <Star size={12} fill="#D35400" color="#D35400" />
                            <span>4.9</span>
                        </div>
                    </div>
                    <h3 className="card-title">{product.name}</h3>
                    <div className="info-bottom">
                        <span className="card-price">KSh {parseFloat(product.price).toLocaleString()}</span>
                    </div>
                    <button className="card-view-btn">Acquire Piece</button>
                </div>
            </Link>
        </div>
    );
};

const ArrowRight = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
);

export default ProductCard;
