import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, ArrowRight, Clock, RefreshCw, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function OrderConfirmationPage() {
  const { 
    currentOrder, 
    setOrders, 
    setCurrentView,
    showToast 
  } = useShop();

  // Local state to display order details, susceptible to BUG H04
  const [displayedOrder, setDisplayedOrder] = useState(() => {
    if (currentOrder) return currentOrder;
    try {
      const saved = sessionStorage.getItem('shopfault_last_placed_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const mountCountRef = useRef(0);

  useEffect(() => {
    mountCountRef.current += 1;

    // Detect if page was reloaded or refreshed
    const isPageReload = performance.getEntriesByType('navigation')[0]?.type === 'reload';

    // BUG H02: Duplicate order after refresh
    // When the confirmation page is refreshed or re-visited,
    // it automatically appends a duplicate copy of this placed order into Order History!
    if (isPageReload || sessionStorage.getItem('shopfault_confirmation_revisited')) {
      const lastPlacedRaw = sessionStorage.getItem('shopfault_last_placed_order');
      if (lastPlacedRaw) {
        try {
          const parsed = JSON.parse(lastPlacedRaw);
          const duplicateOrder = {
            ...parsed,
            orderId: parsed.orderId, // Same order reference ID!
            status: 'Confirmed (Duplicate Refresh)',
            date: new Date().toISOString()
          };
          setOrders(prev => [duplicateOrder, ...prev]);
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      sessionStorage.setItem('shopfault_confirmation_revisited', 'true');
    }

    // Prepare stale draft snapshot for BUG H04
    if (!sessionStorage.getItem('shopfault_stale_draft')) {
      sessionStorage.setItem('shopfault_stale_draft', JSON.stringify({
        orderId: 'SF-ORD-STALE-DRAFT-01',
        date: new Date(Date.now() - 3600000).toISOString(),
        items: [{ id: 99, name: 'Previous Draft Cart Item', price: 999, quantity: 1 }],
        subtotal: 999,
        discountAmount: 0,
        shippingFee: 149,
        tax: 180,
        total: 1328,
        customer: { name: 'Previous Visitor', email: 'old@example.com' },
        status: 'Stale Cached State'
      }));
    }

    // BUG H04: Stale order information after browser navigation
    // When participant navigates Back and Forward using browser history, popstate event fires.
    // Instead of displaying currentOrder, it loads the stale snapshot from sessionStorage!
    const handlePopState = () => {
      try {
        const stale = sessionStorage.getItem('shopfault_stale_draft');
        if (stale) {
          setDisplayedOrder(JSON.parse(stale));
          showToast('Loaded cached browser state', 'info');
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSimulateRefresh = () => {
    // Allows participants to test BUG H02 directly in UI or via browser F5
    const lastPlacedRaw = sessionStorage.getItem('shopfault_last_placed_order');
    if (lastPlacedRaw) {
      const parsed = JSON.parse(lastPlacedRaw);
      setOrders(prev => [parsed, ...prev]);
      showToast('Confirmation re-submitted: Duplicate order created (BUG H02)', 'info');
    }
  };

  const order = displayedOrder;

  if (!order) {
    return (
      <div className="empty-cart-page">
        <div className="empty-cart-card">
          <h2>No Order Found</h2>
          <p>Please return to the store to place a new demonstration order.</p>
          <button 
            className="return-store-btn"
            onClick={() => setCurrentView('catalog')}
          >
            <ShoppingBag size={16} />
            <span>Go to Store</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page-container">
      <div className="confirmation-card">
        <div className="confirmation-badge-icon">
          <CheckCircle2 size={48} className="success-icon" />
        </div>

        <h1 className="confirmation-title">Order Confirmed</h1>
        <p className="confirmation-subtitle">
          Thank you for your order. Your demonstration purchase has been placed.
        </p>

        {/* Order Meta Box */}
        <div className="order-meta-box">
          <div className="meta-col">
            <span className="meta-label">Order Reference</span>
            <strong className="meta-val" id="confirmation-order-id">{order.orderId}</strong>
          </div>
          <div className="meta-col">
            <span className="meta-label">Date & Time</span>
            <span className="meta-val">{new Date(order.date).toLocaleString()}</span>
          </div>
          <div className="meta-col">
            <span className="meta-label">Customer Name</span>
            <span className="meta-val">{order.customer?.name || 'Valued Customer'}</span>
          </div>
          <div className="meta-col">
            <span className="meta-label">Order Status</span>
            <span className="meta-val status-pill">{order.status || 'Confirmed'}</span>
          </div>
        </div>

        {/* Items Summary Table */}
        <div className="confirmation-items-table-wrapper">
          <table className="confirmation-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((it, idx) => (
                <tr key={idx}>
                  <td><strong>{it.name}</strong></td>
                  <td>{it.quantity}</td>
                  <td>₹{it.price?.toLocaleString('en-IN')}</td>
                  <td>₹{((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown in INR */}
        <div className="confirmation-totals-box">
          <div className="conf-row">
            <span>Subtotal:</span>
            <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="conf-row discount">
              <span>Discount Applied:</span>
              <span>-₹{order.discountAmount?.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="conf-row">
            <span>Delivery:</span>
            <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee?.toLocaleString('en-IN')}`}</span>
          </div>
          <div className="conf-row">
            <span>GST (18%):</span>
            <span>₹{order.tax?.toLocaleString('en-IN')}</span>
          </div>
          <div className="conf-row final-total">
            <span>Total Paid:</span>
            <strong id="confirmation-total-amount">₹{order.total?.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions-row">
          <button 
            className="view-history-btn"
            onClick={() => setCurrentView('history')}
            id="btn-goto-order-history"
          >
            <Clock size={16} />
            <span>View in Order History</span>
          </button>

          <button 
            className="continue-browsing-btn"
            onClick={() => setCurrentView('catalog')}
          >
            <ShoppingBag size={16} />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Browser refresh test helper */}
        <div className="refresh-test-helper">
          <button 
            type="button" 
            className="refresh-trigger-btn"
            onClick={handleSimulateRefresh}
            title="Simulate refreshing this confirmation page"
          >
            <RefreshCw size={13} />
            <span>Simulate Page Refresh Request (or press F5)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
