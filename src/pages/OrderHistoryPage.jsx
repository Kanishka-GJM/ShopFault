import React from 'react';
import { Clock, ArrowLeft, Package, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function OrderHistoryPage() {
  const { orders, setOrders, setCurrentView, showToast } = useShop();

  const handleClearHistory = () => {
    if (window.confirm('Clear all stored order history for this session?')) {
      setOrders([]);
      try {
        localStorage.removeItem('shopfault_orders');
        sessionStorage.removeItem('shopfault_last_placed_order');
        sessionStorage.removeItem('shopfault_confirmation_revisited');
      } catch (e) {
        console.error(e);
      }
      showToast('Order history cleared', 'info');
    }
  };

  return (
    <div className="order-history-page-container">
      <div className="history-header-row">
        <div>
          <button 
            className="back-to-store-btn"
            onClick={() => setCurrentView('catalog')}
          >
            <ArrowLeft size={15} />
            <span>Back to Catalog</span>
          </button>
          <h1 className="page-heading">Order History</h1>
          <p className="page-subheading">
            Track and view previously placed demonstration orders for your team.
          </p>
        </div>

        {orders.length > 0 && (
          <button 
            className="clear-history-btn"
            onClick={handleClearHistory}
            title="Clear demo orders"
          >
            <Trash2 size={15} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="empty-cart-page">
          <div className="empty-cart-card">
            <div className="empty-cart-icon-wrap">
              <Package size={44} />
            </div>
            <h2>No Orders Placed Yet</h2>
            <p>You have not completed any demonstration orders in this browser session.</p>
            <button 
              className="return-store-btn"
              onClick={() => setCurrentView('catalog')}
            >
              <ShoppingBag size={16} />
              <span>Explore Products</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="orders-stack">
          {orders.map((ord, idx) => {
            const isDuplicate = orders.filter(o => o.orderId === ord.orderId).length > 1;

            return (
              <div 
                key={`${ord.orderId}-${idx}`} 
                className={`order-card ${isDuplicate ? 'duplicate-order-card' : ''}`}
                id={`order-card-${ord.orderId}`}
              >
                <div className="order-card-header">
                  <div className="order-header-left">
                    <span className="order-tag-label">Order Ref:</span>
                    <strong className="order-id-val">{ord.orderId}</strong>
                    {isDuplicate && (
                      <span className="duplicate-badge" title="This order appears multiple times due to BUG H02">
                        Duplicate Detected (BUG H02)
                      </span>
                    )}
                  </div>

                  <div className="order-header-right">
                    <span className="order-date-text">
                      {new Date(ord.date).toLocaleString()}
                    </span>
                    <span className="order-status-pill">
                      {ord.status || 'Confirmed'}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="order-items-compact-grid">
                  {ord.items?.map((item, itemIdx) => (
                    <div key={itemIdx} className="order-item-pill">
                      <span className="item-qty-badge">{item.quantity}x</span>
                      <span className="item-name-text">{item.name}</span>
                      <span className="item-sub-text">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <div className="customer-info-snippet">
                    <strong>Recipient:</strong> {ord.customer?.name || 'Customer'} ({ord.customer?.email || 'No email provided'})
                  </div>
                  <div className="order-total-snippet">
                    <span>Total Amount:</span>
                    <strong className="total-price-large">₹{ord.total?.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
