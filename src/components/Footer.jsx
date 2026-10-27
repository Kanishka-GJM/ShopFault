import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Footer({ onUnlockOrganizer }) {
  const { setCurrentView } = useShop();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleVerifyPin = (e) => {
    e.preventDefault();
    // Default competition organizer PIN
    if (pinInput.trim() === 'shopfault-admin-76' || pinInput.trim() === 'organizer2026') {
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
      onUnlockOrganizer();
    } else {
      setPinError(true);
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-col">
            <div className="footer-brand">
              <ShoppingBag size={20} className="footer-logo-icon" />
              <span className="footer-brand-name">ShopFault Store</span>
            </div>
            <p className="footer-desc">
              Curated precision hardware, custom keyboards, and premium audio tools for engineers and digital creators.
            </p>
            <div className="footer-comp-badge">
              <ShieldCheck size={14} />
              <span>Official Inter-College Competition Target Environment</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links-list">
              <li><button onClick={() => setCurrentView('catalog')}>Store Catalog</button></li>
              <li><button onClick={() => setCurrentView('cart')}>Shopping Cart</button></li>
              <li><button onClick={() => setCurrentView('history')}>Order History</button></li>
              <li><button onClick={() => setCurrentView('submit-bug')}>Participant Bug Portal</button></li>
            </ul>
          </div>

          {/* Customer Care / Demo Info */}
          <div className="footer-col">
            <h4 className="footer-title">Demonstration Environment</h4>
            <p className="footer-text-muted">
              This simulated shopping site runs entirely locally in your browser. All cart items, orders, 
              and discount calculations are simulated for competition debugging.
            </p>
            <p className="footer-text-muted">
              45 Teams • 40 Minutes • 15 Seeded Flaws
            </p>
          </div>

          {/* Organizer Lock */}
          <div className="footer-col">
            <h4 className="footer-title">Event Operations</h4>
            <p className="footer-text-muted">
              Private scoring key and administrator verification tools are restricted to competition organizers.
            </p>
            <button 
              className="organizer-auth-btn"
              onClick={() => setShowPinModal(true)}
              aria-label="Organizer Verification Access"
            >
              <Lock size={14} />
              <span>Organizer Portal</span>
            </button>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} ShopFault Store — CSI Inter-College Debugging Championship. All Rights Reserved.</p>
        </div>
      </div>

      {/* Organizer PIN Modal */}
      {showPinModal && (
        <div className="modal-overlay" onClick={() => setShowPinModal(false)}>
          <div className="pin-auth-modal" onClick={e => e.stopPropagation()}>
            <div className="pin-modal-header">
              <Lock size={28} className="lock-icon-modal" />
              <h3>Organizer Access Authentication</h3>
              <p>Enter the private organizer security passcode to review the answer key.</p>
            </div>

            <form onSubmit={handleVerifyPin}>
              <div className="form-group">
                <input 
                  type="password"
                  className={`pin-password-input ${pinError ? 'input-error' : ''}`}
                  placeholder="Enter Organizer PIN..."
                  value={pinInput}
                  onChange={e => {
                    setPinInput(e.target.value);
                    if (pinError) setPinError(false);
                  }}
                  autoFocus
                />
                {pinError && (
                  <span className="error-message">
                    Invalid passcode. Access denied.
                  </span>
                )}
              </div>

              <div className="pin-modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowPinModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="unlock-btn">
                  Verify Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
