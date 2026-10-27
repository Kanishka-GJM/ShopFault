import React, { useState, useEffect } from 'react';
import { useShop } from './context/ShopContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductDetailModal from './components/ProductDetailModal';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import SubmissionPortalPage from './pages/SubmissionPortalPage';
import OrganizerPortalPage from './pages/OrganizerPortalPage';
import { CheckCircle2, AlertCircle, Info, Clock, Lock, Play, ShieldAlert } from 'lucide-react';

export default function App() {
  const { currentView, toast, competition } = useShop();
  const [isOrganizerUnlocked, setIsOrganizerUnlocked] = useState(false);

  // Automatically scroll to top on view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, isOrganizerUnlocked]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-root">
      {/* Toast Notification Container */}
      {toast && (
        <div className={`app-toast toast-${toast.type}`} role="alert">
          {toast.type === 'success' && <CheckCircle2 size={16} />}
          {toast.type === 'error' && <AlertCircle size={16} />}
          {toast.type === 'info' && <Info size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Real-time Participant Competition Status Bar */}
      {!isOrganizerUnlocked && (
        <div className={`competition-live-banner status-${competition.status}`}>
          <div className="banner-inner">
            {competition.status === 'not_started' && (
              <>
                <Clock size={16} className="pulse-icon" />
                <span>
                  <strong>Event Standby:</strong> The 40-minute debugging sprint will begin when initiated by organizers.
                </span>
                <span className="banner-clock-badge">Timer: 40:00</span>
              </>
            )}

            {competition.status === 'running' && (
              <>
                <Clock size={16} className="active-pulse-icon" />
                <span>
                  <strong>Competition Live:</strong> 40-Minute Debugging Sprint is active!
                </span>
                <span className="banner-clock-badge live-badge">
                  Time Remaining: <strong>{formatTime(competition.timeRemaining)}</strong>
                </span>
              </>
            )}

            {competition.status === 'paused' && (
              <>
                <AlertCircle size={16} />
                <span>
                  <strong>Competition Paused:</strong> Timer temporarily frozen by event organizers.
                </span>
                <span className="banner-clock-badge">Paused at {formatTime(competition.timeRemaining)}</span>
              </>
            )}

            {competition.status === 'ended' && (
              <>
                <ShieldAlert size={16} />
                <span>
                  <strong>Competition Concluded:</strong> Time has expired. Participant submissions are closed.
                </span>
                <span className="banner-clock-badge ended-badge">Time: 00:00</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="main-content-wrapper">
        {isOrganizerUnlocked ? (
          <OrganizerPortalPage onExit={() => setIsOrganizerUnlocked(false)} />
        ) : (
          <>
            {/* If competition has NOT started, show the professional standby waiting screen */}
            {competition.status === 'not_started' ? (
              <div className="standby-waiting-container">
                <div className="standby-card">
                  <div className="standby-icon-wrap">
                    <Clock size={52} />
                  </div>
                  <span className="standby-badge">CSI Inter-College Debugging Championship</span>
                  <h1 className="standby-title">Competition Has Not Started Yet</h1>
                  <p className="standby-desc">
                    Welcome, teams! The <strong>ShopFault Store</strong> debugging environment will automatically 
                    unlock the moment the event organizers start the official 40-minute competition timer.
                  </p>
                  
                  <div className="standby-rules-box">
                    <h3>Sprint Briefing & Ground Rules</h3>
                    <ul>
                      <li>⏱️ <strong>Duration:</strong> Exactly 40 Minutes from timer start.</li>
                      <li>🎯 <strong>Objective:</strong> Locate all 15 intentionally seeded functional flaws.</li>
                      <li>📋 <strong>Scoring:</strong> 4 Easy (2 pts), 5 Medium (4 pts), 6 Hard (8 pts) = 76 Max Points.</li>
                      <li>💡 <strong>Submissions:</strong> Submit reproduction steps via the Bug Submission Portal before time expires.</li>
                    </ul>
                  </div>

                  <p className="standby-note">
                    Please stand by at your workstations. This page will unlock automatically across all 45 teams.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {currentView === 'catalog' && <CatalogPage />}
                {currentView === 'cart' && <CartPage />}
                {currentView === 'checkout' && <CheckoutPage />}
                {currentView === 'confirmation' && <OrderConfirmationPage />}
                {currentView === 'history' && <OrderHistoryPage />}
                {currentView === 'submit-bug' && <SubmissionPortalPage />}
              </>
            )}
          </>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal />

      {/* Footer with PIN-protected Organizer gateway */}
      <Footer onUnlockOrganizer={() => setIsOrganizerUnlocked(true)} />
    </div>
  );
}
