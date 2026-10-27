import React from 'react';
import { ShoppingBag, ShoppingCart, Clock, AlertCircle, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Navbar() {
  const { 
    currentView, 
    setCurrentView, 
    navBadgeCount 
  } = useShop();

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div 
          className="brand-logo" 
          onClick={() => setCurrentView('catalog')}
          role="button"
          tabIndex={0}
        >
          <div className="brand-icon-wrapper">
            <ShoppingBag className="brand-icon" size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-name">ShopFault</span>
            <span className="brand-sub">STORE</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="navbar-links">
          <button 
            className={`nav-link-btn ${currentView === 'catalog' ? 'active' : ''}`}
            onClick={() => setCurrentView('catalog')}
          >
            Catalog
          </button>

          <button 
            className={`nav-link-btn ${currentView === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentView('history')}
          >
            <Clock size={16} />
            <span>Order History</span>
          </button>

          <button 
            className={`nav-link-btn submission-nav-btn ${currentView === 'submit-bug' ? 'active' : ''}`}
            onClick={() => setCurrentView('submit-bug')}
          >
            <AlertCircle size={16} />
            <span>Bug Submission Portal</span>
          </button>

          {/* Cart Button with Stale Badge (BUG E03) */}
          <button 
            className={`cart-nav-btn ${currentView === 'cart' ? 'active' : ''}`}
            onClick={() => setCurrentView('cart')}
            aria-label="View Shopping Cart"
          >
            <ShoppingCart size={20} />
            <span className="cart-label">Cart</span>
            {/* BUG E03: navBadgeCount does not immediately update when clicking Add to Cart */}
            <span className="cart-badge-counter" id="cart-badge-count">
              {navBadgeCount}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
