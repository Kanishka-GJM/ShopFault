import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CheckoutPage() {
  const {
    cart,
    setCurrentView,
    cartSubtotal,
    discountAmount,
    totalDiscountPercent,
    shippingFee,
    checkoutTax,
    checkoutHandlingFee,
    checkoutTotal,
    placeOrder
  } = useShop();

  // All form fields initialize EMPTY - no default values provided as requested!
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'demo_card'
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const errors = {};

    // Validate Name (required)
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }

    // Validate Phone (required)
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    // Validate Address (required)
    if (!formData.address.trim()) {
      errors.address = 'Delivery address is required';
    }

    // BUG E04: Missing required-email validation!
    // The required check `if (!formData.email.trim())` is omitted!
    // An empty email passes directly without validation errors!
    
    // BUG M04: Invalid email accepted!
    // If an email IS entered (e.g. "student@"), this faulty regex passes it
    // because it only tests if text precedes '@', without verifying domain or TLD!
    if (formData.email.trim() !== '') {
      const faultyEmailRegex = /^[\w.-]+@/; // BUG M04: accepts 'student@', 'alex@', etc.
      if (!faultyEmailRegex.test(formData.email.trim())) {
        errors.email = 'Please provide a valid email format';
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Process demonstration order
    placeOrder(formData);
  };

  if (cart.length === 0 && cartSubtotal === 0) {
    return (
      <div className="empty-cart-page">
        <div className="empty-cart-card">
          <h2>No Items to Checkout</h2>
          <p>Your shopping cart is currently empty. Please select products before proceeding.</p>
          <button 
            className="return-store-btn"
            onClick={() => setCurrentView('catalog')}
          >
            <ArrowLeft size={16} />
            <span>Return to Catalog</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      <div className="checkout-header-row">
        <button 
          className="back-to-cart-btn"
          onClick={() => setCurrentView('cart')}
        >
          <ArrowLeft size={15} />
          <span>Return to Cart</span>
        </button>
        <h1 className="page-heading">Checkout & Finalize Order</h1>
      </div>

      <div className="demo-notice-banner">
        <ShieldCheck size={18} className="demo-shield-icon" />
        <div>
          <strong>Demonstration Environment</strong>
          <p>This is a simulated storefront for competition debugging. Do not enter real financial credentials.</p>
        </div>
      </div>

      <div className="checkout-layout-grid">
        {/* Left Form: Customer Details */}
        <div className="checkout-form-column">
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            {/* Contact Details */}
            <div className="form-section">
              <h2 className="section-title">1. Contact Information</h2>
              
              <div className="form-group">
                <label htmlFor="customer-name" className="form-label">
                  Full Name <span className="req-star">*</span>
                </label>
                <input 
                  type="text"
                  id="customer-name"
                  name="name"
                  className={`form-input ${validationErrors.name ? 'input-error' : ''}`}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
                {validationErrors.name && (
                  <span className="error-message">{validationErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                {/* As requested: removed the "Required" wording, only "*" mark is shown! */}
                <label htmlFor="customer-email" className="form-label">
                  Email Address <span className="req-star">*</span>
                </label>
                {/* BUG E04: Email marked with *, but leaving blank passes validation!
                    BUG M04: Entering "student@" passes validation! */}
                <input 
                  type="text"
                  id="customer-email"
                  name="email"
                  className={`form-input ${validationErrors.email ? 'input-error' : ''}`}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
                {validationErrors.email && (
                  <span className="error-message" id="email-validation-error">
                    {validationErrors.email}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="customer-phone" className="form-label">
                  Phone Number <span className="req-star">*</span>
                </label>
                <input 
                  type="tel"
                  id="customer-phone"
                  name="phone"
                  className={`form-input ${validationErrors.phone ? 'input-error' : ''}`}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. 9876543210"
                />
                {validationErrors.phone && (
                  <span className="error-message">{validationErrors.phone}</span>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="form-section">
              <h2 className="section-title">2. Delivery Address</h2>
              
              <div className="form-group">
                <label htmlFor="customer-address" className="form-label">
                  Street Address <span className="req-star">*</span>
                </label>
                <input 
                  type="text"
                  id="customer-address"
                  name="address"
                  className={`form-input ${validationErrors.address ? 'input-error' : ''}`}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Flat / House No., Building, Street"
                />
                {validationErrors.address && (
                  <span className="error-message">{validationErrors.address}</span>
                )}
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label htmlFor="customer-city" className="form-label">City</label>
                  <input 
                    type="text"
                    id="customer-city"
                    name="city"
                    className="form-input"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Mumbai, Bengaluru"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customer-zip" className="form-label">PIN Code</label>
                  <input 
                    type="text"
                    id="customer-zip"
                    name="zip"
                    className="form-input"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="e.g. 400001"
                  />
                </div>
              </div>
            </div>

            {/* Demo Payment */}
            <div className="form-section">
              <h2 className="section-title">3. Payment Mode (Simulated)</h2>
              <div className="demo-payment-selector">
                <label className="payment-option-card selected">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="demo_card" 
                    checked={formData.paymentMethod === 'demo_card'}
                    onChange={handleInputChange}
                  />
                  <CreditCard size={18} className="pay-icon" />
                  <div>
                    <span className="pay-title">Simulated Card / UPI (Demo Mode)</span>
                    <span className="pay-desc">Immediate approval for competition evaluation</span>
                  </div>
                </label>
              </div>
            </div>

            <button 
              type="submit"
              className="place-order-submit-btn"
              id="place-order-submit-btn"
            >
              <Lock size={16} />
              <span>Place Demonstration Order</span>
            </button>
          </form>
        </div>

        {/* Right Summary Column with BUG H03 */}
        <div className="checkout-summary-column">
          <div className="summary-card">
            <h3 className="summary-title">Order Review</h3>

            {/* Items Mini List */}
            <div className="checkout-items-list">
              {cart.map((item, idx) => (
                <div key={item.cartEntryId || idx} className="checkout-item-compact">
                  <span className="checkout-item-qty">{item.quantity}x</span>
                  <span className="checkout-item-name">{item.name}</span>
                  <span className="checkout-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value" id="checkout-summary-subtotal">
                ₹{cartSubtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {totalDiscountPercent > 0 && (
              <div className="summary-row discount-row">
                <span className="summary-label">Applied Discount ({totalDiscountPercent}%)</span>
                <span className="summary-value discount-val" id="checkout-summary-discount">
                  -₹{discountAmount.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            <div className="summary-row">
              <span className="summary-label">Delivery</span>
              <span className="summary-value">
                {shippingFee === 0 ? <span className="free-shipping-tag">FREE</span> : `₹${shippingFee.toLocaleString('en-IN')}`}
              </span>
            </div>

            <div className="summary-row">
              <span className="summary-label">GST (18%)</span>
              <span className="summary-value" id="checkout-summary-tax">
                ₹{checkoutTax.toLocaleString('en-IN')}
              </span>
            </div>

            {checkoutHandlingFee > 0 && (
              <div className="summary-row">
                <span className="summary-label">Handling Fee</span>
                <span className="summary-value">
                  ₹{checkoutHandlingFee.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            <div className="summary-divider" />

            {/* BUG H03: Cart and Checkout total mismatch */}
            {/* Notice checkoutTotal differs from cartTotal whenever a coupon is used! */}
            <div className="summary-row total-row">
              <span className="total-label">Final Amount</span>
              <span className="total-amount" id="checkout-summary-total">
                ₹{checkoutTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
