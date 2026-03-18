import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, Truck, Check, ShoppingBag, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const STEPS = ['Cart Review', 'Shipping', 'Payment', 'Confirmation'];

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber] = useState(() => Math.floor(Math.random() * 900000) + 100000);

    const [shipping, setShipping] = useState({
        firstName: user?.username || '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'US',
    });

    const [payment, setPayment] = useState({
        method: 'card',
        cardNumber: '',
        expiry: '',
        cvv: '',
        nameOnCard: '',
    });

    const [errors, setErrors] = useState({});

    const shippingCost = cartTotal > 100 ? 0 : 9.99;
    const tax = cartTotal * 0.08;
    const total = cartTotal + shippingCost + tax;

    const validateShipping = () => {
        const newErrors = {};
        if (!shipping.firstName.trim()) newErrors.firstName = 'Required';
        if (!shipping.lastName.trim()) newErrors.lastName = 'Required';
        if (!shipping.email.trim() || !/\S+@\S+\.\S+/.test(shipping.email)) newErrors.email = 'Valid email required';
        if (!shipping.address.trim()) newErrors.address = 'Required';
        if (!shipping.city.trim()) newErrors.city = 'Required';
        if (!shipping.zip.trim()) newErrors.zip = 'Required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePayment = () => {
        const newErrors = {};
        if (payment.method === 'card') {
            if (payment.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Enter 16-digit card number';
            if (!payment.expiry.match(/^\d{2}\/\d{2}$/)) newErrors.expiry = 'Format: MM/YY';
            if (payment.cvv.length < 3) newErrors.cvv = 'Required';
            if (!payment.nameOnCard.trim()) newErrors.nameOnCard = 'Required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (currentStep === 1 && !validateShipping()) return;
        if (currentStep === 2 && !validatePayment()) return;
        if (currentStep === 2) {
            setOrderPlaced(true);
            clearCart();
        }
        setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
    };

    const handleBack = () => setCurrentStep(s => Math.max(s - 1, 0));

    const formatCard = (value) => {
        return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiry = (value) => {
        const clean = value.replace(/\D/g, '').slice(0, 4);
        if (clean.length >= 2) return clean.slice(0, 2) + '/' + clean.slice(2);
        return clean;
    };

    if (cart.length === 0 && !orderPlaced && currentStep < 3) {
        return (
            <div className="container checkout-empty">
                <ShoppingBag size={64} />
                <h2>Your cart is empty</h2>
                <p>Add some products before checking out.</p>
                <Link to="/products" className="btn btn-primary">Browse Products</Link>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="checkout-title">Checkout</h1>

                {/* Step Indicator */}
                <div className="step-indicator">
                    {STEPS.map((step, i) => (
                        <React.Fragment key={step}>
                            <div className={`step-item ${i <= currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}>
                                <div className="step-circle">
                                    {i < currentStep ? <Check size={14} /> : i + 1}
                                </div>
                                <span className="step-label">{step}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`step-line ${i < currentStep ? 'done' : ''}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="checkout-layout">
                    {/* Main Panel */}
                    <div className="checkout-main">

                        {/* Step 0: Cart Review */}
                        {currentStep === 0 && (
                            <div className="checkout-step">
                                <h2><ShoppingBag size={22} /> Order Review</h2>
                                <div className="cart-review-list">
                                    {cart.map(item => (
                                        <div key={item.id} className="cart-review-item">
                                            <img
                                                src={item.image_url ? `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000")}${item.image_url}` : 'https://placehold.co/80x80?text=?'}
                                                alt={item.name}
                                            />
                                            <div className="cart-review-info">
                                                <p className="cart-review-name">{item.name}</p>
                                                <p className="cart-review-qty">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="cart-review-price">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 1: Shipping */}
                        {currentStep === 1 && (
                            <div className="checkout-step">
                                <h2><Truck size={22} /> Shipping Information</h2>
                                <div className="form-grid">
                                    <div className={`form-group ${errors.firstName ? 'error' : ''}`}>
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            value={shipping.firstName}
                                            onChange={e => setShipping({ ...shipping, firstName: e.target.value })}
                                            placeholder="John"
                                        />
                                        {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                                    </div>
                                    <div className={`form-group ${errors.lastName ? 'error' : ''}`}>
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            value={shipping.lastName}
                                            onChange={e => setShipping({ ...shipping, lastName: e.target.value })}
                                            placeholder="Doe"
                                        />
                                        {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                                    </div>
                                    <div className={`form-group full ${errors.email ? 'error' : ''}`}>
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            value={shipping.email}
                                            onChange={e => setShipping({ ...shipping, email: e.target.value })}
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && <span className="field-error">{errors.email}</span>}
                                    </div>
                                    <div className={`form-group full ${errors.address ? 'error' : ''}`}>
                                        <label>Street Address</label>
                                        <input
                                            type="text"
                                            value={shipping.address}
                                            onChange={e => setShipping({ ...shipping, address: e.target.value })}
                                            placeholder="123 Main St"
                                        />
                                        {errors.address && <span className="field-error">{errors.address}</span>}
                                    </div>
                                    <div className={`form-group ${errors.city ? 'error' : ''}`}>
                                        <label>City</label>
                                        <input
                                            type="text"
                                            value={shipping.city}
                                            onChange={e => setShipping({ ...shipping, city: e.target.value })}
                                            placeholder="New York"
                                        />
                                        {errors.city && <span className="field-error">{errors.city}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>State</label>
                                        <input
                                            type="text"
                                            value={shipping.state}
                                            onChange={e => setShipping({ ...shipping, state: e.target.value })}
                                            placeholder="NY"
                                        />
                                    </div>
                                    <div className={`form-group ${errors.zip ? 'error' : ''}`}>
                                        <label>ZIP Code</label>
                                        <input
                                            type="text"
                                            value={shipping.zip}
                                            onChange={e => setShipping({ ...shipping, zip: e.target.value })}
                                            placeholder="10001"
                                        />
                                        {errors.zip && <span className="field-error">{errors.zip}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Country</label>
                                        <select
                                            value={shipping.country}
                                            onChange={e => setShipping({ ...shipping, country: e.target.value })}
                                        >
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {currentStep === 2 && (
                            <div className="checkout-step">
                                <h2><CreditCard size={22} /> Payment</h2>

                                <div className="payment-methods">
                                    {['card', 'paypal'].map(method => (
                                        <label key={method} className={`payment-method-btn ${payment.method === method ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method}
                                                checked={payment.method === method}
                                                onChange={() => setPayment({ ...payment, method })}
                                            />
                                            {method === 'card' ? '💳 Credit / Debit Card' : '🅿️ PayPal (Demo)'}
                                        </label>
                                    ))}
                                </div>

                                {payment.method === 'card' && (
                                    <div className="form-grid">
                                        <div className={`form-group full ${errors.nameOnCard ? 'error' : ''}`}>
                                            <label>Name on Card</label>
                                            <input
                                                type="text"
                                                value={payment.nameOnCard}
                                                onChange={e => setPayment({ ...payment, nameOnCard: e.target.value })}
                                                placeholder="John Doe"
                                            />
                                            {errors.nameOnCard && <span className="field-error">{errors.nameOnCard}</span>}
                                        </div>
                                        <div className={`form-group full ${errors.cardNumber ? 'error' : ''}`}>
                                            <label>Card Number</label>
                                            <input
                                                type="text"
                                                value={payment.cardNumber}
                                                onChange={e => setPayment({ ...payment, cardNumber: formatCard(e.target.value) })}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                            />
                                            {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
                                        </div>
                                        <div className={`form-group ${errors.expiry ? 'error' : ''}`}>
                                            <label>Expiry Date</label>
                                            <input
                                                type="text"
                                                value={payment.expiry}
                                                onChange={e => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                            />
                                            {errors.expiry && <span className="field-error">{errors.expiry}</span>}
                                        </div>
                                        <div className={`form-group ${errors.cvv ? 'error' : ''}`}>
                                            <label>CVV</label>
                                            <input
                                                type="text"
                                                value={payment.cvv}
                                                onChange={e => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                                placeholder="123"
                                                maxLength={4}
                                            />
                                            {errors.cvv && <span className="field-error">{errors.cvv}</span>}
                                        </div>
                                    </div>
                                )}

                                {payment.method === 'paypal' && (
                                    <div className="paypal-demo">
                                        <p>You'll be redirected to PayPal's secure checkout (demo mode — no real charge).</p>
                                    </div>
                                )}

                                <div className="secure-badge">
                                    <Lock size={14} /> Secured by 256-bit SSL encryption
                                </div>
                            </div>
                        )}

                        {/* Step 3: Confirmation */}
                        {currentStep === 3 && (
                            <div className="checkout-step confirmation">
                                <div className="confirm-icon">
                                    <Check size={40} />
                                </div>
                                <h2>Order Confirmed! 🎉</h2>
                                <p className="confirm-message">
                                    Thank you for your purchase! Your order <strong>#{orderNumber}</strong> has been placed successfully.
                                </p>
                                <p className="confirm-sub">
                                    A confirmation email will be sent to <strong>{shipping.email || 'your email'}</strong>.
                                </p>
                                <div className="confirm-delivery">
                                    <Truck size={20} />
                                    <span>Estimated delivery: <strong>3–5 business days</strong></span>
                                </div>
                                <div className="confirm-actions">
                                    <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        {currentStep < 3 && (
                            <div className="checkout-nav">
                                {currentStep > 0 && (
                                    <button className="btn btn-outline" onClick={handleBack}>Back</button>
                                )}
                                <button className="btn btn-primary btn-next" onClick={handleNext}>
                                    {currentStep === 2 ? 'Place Order' : 'Continue'}
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    {currentStep < 3 && (
                        <div className="order-summary">
                            <h3>Order Summary</h3>
                            <div className="summary-items">
                                {(orderPlaced ? [] : cart).map(item => (
                                    <div key={item.id} className="summary-item">
                                        <span>{item.name} × {item.quantity}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-divider" />
                            <div className="summary-line">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-line">
                                <span>Shipping</span>
                                <span>{shippingCost === 0 ? <span className="free-shipping">FREE</span> : `$${shippingCost.toFixed(2)}`}</span>
                            </div>
                            {shippingCost > 0 && (
                                <p className="free-shipping-note">Free shipping on orders over $100</p>
                            )}
                            <div className="summary-line">
                                <span>Tax (8%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="summary-divider" />
                            <div className="summary-total">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkout;
