import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, ShoppingBag, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../brandConfig';
import './Checkout.css';

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "");

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [shipping, setShipping] = useState({
        firstName: user?.username || '',
        lastName: '',
        phone: '',
        address: '',
        deliveryNote: '',
    });

    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState(BRAND.whatsapp);

    React.useEffect(() => {
        fetch(`${API}/api/stats/config`)
            .then(res => res.json())
            .then(data => {
                if (data.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
            })
            .catch(err => console.error("Config fetch fail", err));
    }, []);

    const shippingCost = cartTotal > 10000 ? 0 : 500;
    const total = cartTotal + shippingCost;

    const validateShipping = () => {
        const newErrors = {};
        if (!shipping.firstName.trim()) newErrors.firstName = 'Required';
        if (!shipping.phone.trim()) newErrors.phone = 'Phone number required';
        if (!shipping.address.trim()) newErrors.address = 'Delivery address required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleWhatsAppCheckout = async () => {
        if (!validateShipping()) return;
        setIsProcessing(true);

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const orderPayload = {
                items: cart,
                total_amount: total,
                shipping_address: shipping,
                status: 'Processing',
                payment_intent_id: 'whatsapp_checkout'
            };

            await fetch(`${API}/api/orders`, {
                method: 'POST',
                headers,
                body: JSON.stringify(orderPayload)
            });
        } catch (err) {
            console.error('Failed to create order', err);
        }

        const phoneNumber = whatsappNumber;

        let text = `Bless ups! I want to order from IslandLeaf:\n`;
        cart.forEach(item => {
            text += `- ${item.name} (Qty: ${item.quantity})\n`;
        });
        text += `\n*Total:* ${total.toLocaleString()} JMD (incl. delivery).\n`;
        text += `\n*Deliver to:* ${shipping.firstName} ${shipping.lastName}\n`;
        text += `*Address:* ${shipping.address}\n`;
        text += `*Phone:* ${shipping.phone}\n`;
        if (shipping.deliveryNote) text += `*Note:* ${shipping.deliveryNote}\n`;
        text += `\nIs it available? Ready to pay.`;

        const encodedMessage = encodeURIComponent(text);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

        clearCart();
        navigate('/');
    };

    if (cart.length === 0) {
        return (
            <div className="container checkout-empty">
                <ShoppingBag size={64} />
                <h2>Your cart is empty</h2>
                <p>Add some strains before checking out.</p>
                <Link to="/products" className="btn btn-primary">Browse Dispensary</Link>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="checkout-title">Express WhatsApp Checkout</h1>

                <div className="checkout-layout">
                    <div className="checkout-main">
                        <div className="checkout-step">
                            <h2><Truck size={22} /> Delivery Details</h2>
                            <p className="text-sm opacity-70 mb-4" style={{ marginTop: '4px' }}>Fast delivery across Jamaica.</p>
                            <div className="form-grid">
                                <div className={`form-group ${errors.firstName ? 'error' : ''}`}>
                                    <label>First Name</label>
                                    <input type="text" value={shipping.firstName} onChange={e => setShipping({ ...shipping, firstName: e.target.value })} placeholder="Kwame" />
                                    {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" value={shipping.lastName} onChange={e => setShipping({ ...shipping, lastName: e.target.value })} placeholder="Brown" />
                                </div>
                                <div className={`form-group full ${errors.phone ? 'error' : ''}`}>
                                    <label>Phone Number</label>
                                    <input type="tel" value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })} placeholder="+1 876 XXX XXXX" />
                                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                                </div>
                                <div className={`form-group full ${errors.address ? 'error' : ''}`}>
                                    <label>Delivery Address</label>
                                    <input type="text" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} placeholder="e.g. 12 King St, Kingston" />
                                    {errors.address && <span className="field-error">{errors.address}</span>}
                                </div>
                                <div className="form-group full">
                                    <label>Delivery Notes (Optional)</label>
                                    <input type="text" value={shipping.deliveryNote} onChange={e => setShipping({ ...shipping, deliveryNote: e.target.value })} placeholder="e.g. Landmark near the roundabout" />
                                </div>
                            </div>
                        </div>

                        <div className="checkout-step" style={{ border: '1px solid #25D366', background: 'rgba(37, 211, 102, 0.05)' }}>
                            <h2 style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: '8px' }}><Send size={22} /> Order via WhatsApp</h2>
                            <p className="text-sm opacity-90 mb-6" style={{ marginTop: '12px', lineHeight: '1.6' }}>Skip the complex forms. Send your order straight to our team. We'll confirm stock and arrange discreet delivery.</p>
                            <button className="btn btn-primary" onClick={handleWhatsAppCheckout} disabled={isProcessing} style={{ background: '#25D366', color: 'white', borderColor: '#25D366', width: '100%', padding: '16px', fontSize: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                {isProcessing ? 'Connecting...' : `Send Order to WhatsApp (JMD ${total.toLocaleString()})`}
                            </button>
                        </div>
                    </div>

                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-items">
                            {cart.map(item => (
                                <div key={item.id} className="summary-item">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>JMD {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-divider" />
                        <div className="summary-line">
                            <span>Subtotal</span>
                            <span>JMD {cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="summary-line">
                            <span>Delivery</span>
                            <span>{shippingCost === 0 ? <span className="free-shipping">FREE</span> : `JMD ${shippingCost.toLocaleString()}`}</span>
                        </div>
                        <div className="summary-divider" />
                        <div className="summary-total">
                            <span>Total</span>
                            <span>JMD {total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
