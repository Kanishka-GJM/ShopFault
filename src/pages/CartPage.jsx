import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, Tag, Check, AlertCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CartPage() {
  const {
    cart,
    setCurrentView,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    appliedCoupons,
    totalDiscountPercent,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTax,
    cartTotal,
    staleSubtotals,
    refreshBadgeCount
  } = useShop();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);

  // When participant visits Cart page, refresh the badge counter (resolving stale count from BUG E03)
  useEffect(() => {
    refreshBadgeCount();
  }, []);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    // BUG H01: Duplicate discount application
    // Repeatedly applying the coupon increases the discount percentage each time!
    const result = applyCoupon(couponCodeInput);
    setCouponFeedback(result);
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart-page">
        <div className="empty-cart-card">
          <div className="empty-cart-icon-wrap">
            <ShoppingBag size={48} />
          </div>
          <h2>Your Cart is Empty</h2>
          <p>You haven't added any items to your shopping cart yet.</p>
          <button 
            className="return-store-btn"
            onClick={() => setCurrentView('catalog')}
          >
            <ArrowLeft size={16} />
            <span>Browse Products</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-header-row">
        <div>
          <h1 className="page-heading">Shopping Cart</h1>
          <p className="page-subheading">Review items, adjust quantities, and apply discount vouchers.</p>
        </div>
        <button 
          className="clear-cart-text-btn"
          onClick={clearCart}
          title="Clear all cart contents"
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-layout-grid">
        {/* Left Column: Cart Items Table */}
        <div className="cart-table-wrapper">
          <table className="cart-items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => {
                const itemKey = item.cartEntryId || String(item.id);
                
                // BUG M02: Stale quantity subtotal
                // If quantity was increased, staleSubtotals holds the old previous subtotal!
                const lineSubtotal = staleSubtotals[itemKey] !== undefined
                  ? staleSubtotals[itemKey]
                  : (item.quantity * item.price);

                return (
                  <tr key={itemKey} className="cart-item-row" id={`cart-row-${item.id}`}>
                    {/* Product Cell */}
                    <td className="item-details-cell">
                      <div className="table-product-info">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="table-item-thumb" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div>
                          <div className="table-item-name">{item.name}</div>
                          <span className="table-item-category">{item.category}</span>
                        </div>
                      </div>
                    </td>

                    {/* Unit Price in INR */}
                    <td className="unit-price-cell">
                      ₹{item.price.toLocaleString('en-IN')}
                    </td>

                    {/* Quantity Cell */}
                    <td className="quantity-cell">
                      <div className="cart-qty-control">
                        <button 
                          type="button"
                          className="qty-btn-minus"
                          onClick={() => updateQuantity(itemKey, Number(item.quantity) - 1)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>

                        {/* BUG H06: Invalid quantity boundary handling.
                            Direct numeric input allows typing 0 or negative values like -1 */}
                        <input 
                          type="number"
                          className="qty-direct-input"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(itemKey, e.target.value)}
                          aria-label={`Quantity for ${item.name}`}
                          id={`qty-input-${item.id}`}
                        />

                        {/* BUG M02: Clicking plus increments quantity, but line subtotal lags by 1 step */}
                        <button 
                          type="button"
                          className="qty-btn-plus"
                          onClick={() => updateQuantity(itemKey, Number(item.quantity) + 1)}
                          aria-label="Increase quantity"
                          id={`qty-plus-${item.id}`}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Subtotal Cell with BUG M02 Stale value */}
                    <td className="line-subtotal-cell" id={`line-subtotal-${item.id}`}>
                      ₹{Number(lineSubtotal).toLocaleString('en-IN')}
                    </td>

                    {/* Action Cell */}
                    <td className="action-cell">
                      {/* BUG M03: Removing item fails to subtract its price from the cart total! */}
                      <button 
                        className="item-remove-btn"
                        onClick={() => removeFromCart(item.cartEntryId, item.id, item.price, item.quantity)}
                        aria-label={`Remove ${item.name} from cart`}
                        id={`remove-btn-${item.id}`}
                        title="Remove product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Coupon Code Section */}
          <div className="cart-coupon-box">
            <div className="coupon-title-row">
              <Tag size={15} className="coupon-icon" />
              <span>Apply Discount Coupon</span>
              <span className="coupon-hint">(Try "SAVE15" or "SAVE10")</span>
            </div>

            <form className="coupon-form" onSubmit={handleApplyCoupon}>
              <input 
                type="text"
                placeholder="Enter coupon code..."
                className="coupon-input"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value)}
                id="cart-coupon-input"
              />
              {/* BUG H01: Clicking this button repeatedly stacks the coupon discount multiple times */}
              <button 
                type="submit" 
                className="apply-coupon-btn"
                id="cart-apply-coupon-btn"
              >
                Apply Coupon
              </button>
            </form>

            {couponFeedback && (
              <div className={`coupon-feedback-msg ${couponFeedback.success ? 'success' : 'error'}`}>
                {couponFeedback.success ? <Check size={14} /> : <AlertCircle size={14} />}
                <span>{couponFeedback.message}</span>
              </div>
            )}

            {appliedCoupons.length > 0 && (
              <div className="applied-coupons-chips">
                <span className="chips-label">Applied Vouchers:</span>
                {appliedCoupons.map((c, i) => (
                  <span key={i} className="coupon-chip">
                    {c.code} (-{c.discountPercent}%)
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="order-summary-sidebar">
          <div className="summary-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              {/* NOTE: BUG M03 causes this to still include removed item prices */}
              <span className="summary-value" id="cart-summary-subtotal">
                ₹{cartSubtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {totalDiscountPercent > 0 && (
              <div className="summary-row discount-row">
                <span className="summary-label">
                  Discount ({totalDiscountPercent}%)
                </span>
                <span className="summary-value discount-val" id="cart-summary-discount">
                  -₹{discountAmount.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            <div className="summary-row">
              <span className="summary-label">Standard Delivery</span>
              <span className="summary-value">
                {shippingFee === 0 ? <span className="free-shipping-tag">FREE</span> : `₹${shippingFee.toLocaleString('en-IN')}`}
              </span>
            </div>

            <div className="summary-row">
              <span className="summary-label">GST (18%)</span>
              <span className="summary-value">
                ₹{cartTax.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total-row">
              <span className="total-label">Total Amount</span>
              <span className="total-amount" id="cart-summary-total">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button 
              className="proceed-checkout-btn"
              onClick={() => {
                window.scrollTo(0, 0);
                setCurrentView('checkout');
              }}
              id="proceed-to-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={17} />
            </button>

            <button 
              className="continue-shopping-btn"
              onClick={() => setCurrentView('catalog')}
            >
              <ArrowLeft size={15} />
              <span>Continue Shopping</span>
            </button>

            <div className="checkout-security-note">
              <ShieldCheck size={15} />
              <span>ShopFault Demo Store • No Real Payment Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
