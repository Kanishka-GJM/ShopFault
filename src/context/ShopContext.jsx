import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PRODUCTS, VALID_COUPONS } from '../data/products';

const ShopContext = createContext();

// Official bug patterns for Auto-Evaluation
export const BUG_PATTERNS = [
  {
    id: 'BUG-E01',
    name: 'Search Button Click Failure',
    difficulty: 'Easy',
    points: 2,
    module: 'Search Bar',
    keywords: ['search', 'search button', 'filter', 'keyboard', 'headphones', 'input', 'query', 'not filtering', 'results unchanged', 'does not update']
  },
  {
    id: 'BUG-E02',
    name: 'Broken Product Image for Designated Item',
    difficulty: 'Easy',
    points: 2,
    module: 'Catalog / Products',
    keywords: ['aeroglide', 'mouse', 'broken image', 'image not found', '404', 'failed to load', 'image missing', 'corrupted image', 'product 4']
  },
  {
    id: 'BUG-E03',
    name: 'Stale Cart Badge in Navbar',
    difficulty: 'Easy',
    points: 2,
    module: 'Navigation / Badge',
    keywords: ['cart badge', 'badge', 'cart counter', 'stale badge', 'header count', 'navbar', 'does not update', 'refresh', 'remains 0']
  },
  {
    id: 'BUG-E04',
    name: 'Missing Required Email Validation',
    difficulty: 'Easy',
    points: 2,
    module: 'Checkout Form',
    keywords: ['empty email', 'blank email', 'email required', 'no email', 'missing email', 'checkout without email', 'email validation']
  },
  {
    id: 'BUG-M01',
    name: 'Incorrect Category Filtering (Accessories Omission)',
    difficulty: 'Medium',
    points: 4,
    module: 'Catalog / Products',
    keywords: ['accessories', 'leather sleeve', 'artisan', 'product 8', 'omitted', 'missing product', 'only 3', 'category filter', 'laptop sleeve']
  },
  {
    id: 'BUG-M02',
    name: 'Stale Quantity Line Subtotal',
    difficulty: 'Medium',
    points: 4,
    module: 'Shopping Cart',
    keywords: ['subtotal', 'line subtotal', 'quantity increase', 'plus button', '+', 'stale subtotal', 'lags', 'previous price', 'not updating subtotal']
  },
  {
    id: 'BUG-M03',
    name: 'Incorrect Total After Removing Item',
    difficulty: 'Medium',
    points: 4,
    module: 'Shopping Cart',
    keywords: ['remove', 'delete', 'trash', 'removed item', 'cart total', 'subtotal includes', 'retains price', 'deleted product', 'total not decreasing']
  },
  {
    id: 'BUG-M04',
    name: 'Invalid Email Accepted (Missing Domain & TLD)',
    difficulty: 'Medium',
    points: 4,
    module: 'Checkout Form',
    keywords: ['student@', 'malformed email', 'invalid email', 'domain missing', 'tld', 'regex', 'email format', 'accepted']
  },
  {
    id: 'BUG-M05',
    name: 'Incorrect Price Sorting (Lexicographical String Sort)',
    difficulty: 'Medium',
    points: 4,
    module: 'Catalog / Products',
    keywords: ['sort', 'price low to high', 'string sort', 'alphabetical', '1299 before 799', 'ascending', 'incorrect order', 'sorting']
  },
  {
    id: 'BUG-H01',
    name: 'Duplicate Discount Application (Coupon Stacking)',
    difficulty: 'Hard',
    points: 8,
    module: 'Coupon Discounts',
    keywords: ['coupon', 'save15', 'save10', 'stacking', 'duplicate discount', 'apply coupon', 'multiple times', 'repeatedly', '45%']
  },
  {
    id: 'BUG-H02',
    name: 'Duplicate Order Created on Page Refresh',
    difficulty: 'Hard',
    points: 8,
    module: 'Order Confirmation',
    keywords: ['refresh', 'reload', 'f5', 'duplicate order', 'order confirmation', 'order history', 're-submitting', 'duplicate detected']
  },
  {
    id: 'BUG-H03',
    name: 'Cart and Checkout Total Discrepancy',
    difficulty: 'Hard',
    points: 8,
    module: 'Checkout Form',
    keywords: ['mismatch', 'cart total', 'checkout total', 'differ', 'discrepancy', 'tax difference', 'discount tax', 'handling fee', 'different totals']
  },
  {
    id: 'BUG-H04',
    name: 'Stale Order Information After Browser Navigation',
    difficulty: 'Hard',
    points: 8,
    module: 'Order Confirmation',
    keywords: ['back button', 'forward button', 'browser navigation', 'popstate', 'stale draft', 'previous visitor', 'old order details', 'history traversal']
  },
  {
    id: 'BUG-H05',
    name: 'Duplicate Cart Entry on Rapid Clicks',
    difficulty: 'Hard',
    points: 8,
    module: 'Shopping Cart',
    keywords: ['rapid click', 'double click', 'duplicate entry', 'two rows', 'separate lines', 'fast clicks', 'race condition', 'add to cart twice']
  },
  {
    id: 'BUG-H06',
    name: 'Invalid Negative/Zero Quantity Corrupting Cart Total',
    difficulty: 'Hard',
    points: 8,
    module: 'Shopping Cart',
    keywords: ['negative quantity', 'zero quantity', '-1', '0', 'boundary', 'negative total', 'reduces total', 'quantity input']
  }
];

export function ShopProvider({ children }) {
  const [products] = useState(PRODUCTS);

  // Active view: 'catalog' | 'cart' | 'checkout' | 'confirmation' | 'history' | 'submit-bug'
  const [currentView, setCurrentView] = useState('catalog');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('shopfault_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // BUG E03: Stale cart badge in navbar
  const [navBadgeCount, setNavBadgeCount] = useState(() => {
    try {
      const saved = localStorage.getItem('shopfault_cart');
      if (!saved) return 0;
      const parsed = JSON.parse(saved);
      return parsed.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    } catch {
      return 0;
    }
  });

  const [staleSubtotals, setStaleSubtotals] = useState({});
  const [orphanedAmount, setOrphanedAmount] = useState(0);
  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [totalDiscountPercent, setTotalDiscountPercent] = useState(0);

  // Order history - ONLY contains orders actually placed by the user
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('shopfault_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentOrder, setCurrentOrder] = useState(null);

  // Participant bug submissions
  const [submissions, setSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem('shopfault_submissions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // =========================================================================
  // COMPETITION TIMER & CONTROL ENGINE (40 Mins)
  // =========================================================================
  // Status: 'not_started' | 'running' | 'paused' | 'ended'
  const [competition, setCompetition] = useState(() => {
    try {
      const saved = localStorage.getItem('shopfault_competition');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      status: 'not_started',
      timeRemaining: 2400, // 40 minutes = 2400 seconds
      totalDuration: 2400,
      startTime: null
    };
  });

  // Save competition state
  useEffect(() => {
    try {
      localStorage.setItem('shopfault_competition', JSON.stringify(competition));
    } catch (e) {
      console.error(e);
    }
  }, [competition]);

  // Sync competition state across browser tabs via storage event
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'shopfault_competition' && e.newValue) {
        try {
          setCompetition(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === 'shopfault_submissions' && e.newValue) {
        try {
          setSubmissions(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 1-second interval timer when competition is running
  useEffect(() => {
    let interval = null;
    if (competition.status === 'running') {
      interval = setInterval(() => {
        setCompetition(prev => {
          if (prev.status !== 'running') return prev;
          if (prev.timeRemaining <= 1) {
            return {
              ...prev,
              timeRemaining: 0,
              status: 'ended'
            };
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [competition.status]);

  // Organizer controls for the timer
  const startCompetition = () => {
    setCompetition(prev => ({
      ...prev,
      status: 'running',
      startTime: prev.startTime || new Date().toISOString()
    }));
  };

  const pauseCompetition = () => {
    setCompetition(prev => ({
      ...prev,
      status: 'paused'
    }));
  };

  const stopCompetition = () => {
    setCompetition(prev => ({
      ...prev,
      status: 'ended'
    }));
  };

  const resetCompetition = (newMinutes = 40) => {
    const seconds = newMinutes * 60;
    setCompetition({
      status: 'not_started',
      timeRemaining: seconds,
      totalDuration: seconds,
      startTime: null
    });
  };

  // Toast notification
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Save cart, orders, submissions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shopfault_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('shopfault_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('shopfault_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.error(e);
    }
  }, [submissions]);

  // Rapid click detection for BUG H05
  const lastAddClickRef = useRef({ id: null, time: 0 });

  const addToCart = (product, quantityToAdd = 1) => {
    const now = Date.now();
    const isRapidClick = 
      lastAddClickRef.current.id === product.id && 
      (now - lastAddClickRef.current.time) < 450;
    
    lastAddClickRef.current = { id: product.id, time: now };

    setCart(prevCart => {
      // BUG H05: If rapid clicks detected (<450ms gap), bypass existing item check and create duplicate row!
      if (!isRapidClick) {
        const existingIndex = prevCart.findIndex(item => item.id === product.id);
        if (existingIndex > -1) {
          const updated = [...prevCart];
          const currentQty = Number(updated[existingIndex].quantity) || 1;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: currentQty + quantityToAdd
          };
          return updated;
        }
      }

      // Either not in cart or rapid click triggered duplicate row creation (BUG H05)
      const newItem = {
        ...product,
        cartEntryId: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        quantity: quantityToAdd
      };
      return [...prevCart, newItem];
    });

    // BUG E03: navBadgeCount is NOT updated immediately
    showToast(`Added "${product.name}" to cart`, 'success');
  };

  const refreshBadgeCount = () => {
    const totalQty = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    setNavBadgeCount(totalQty);
  };

  // Update item quantity
  const updateQuantity = (cartEntryId, newQuantity) => {
    const targetQty = Number(newQuantity);

    setCart(prevCart => {
      return prevCart.map(item => {
        const itemKey = item.cartEntryId || String(item.id);
        if (item.cartEntryId === cartEntryId || String(item.id) === String(cartEntryId)) {
          // BUG M02: Stale quantity subtotal
          if (targetQty > item.quantity) {
            setStaleSubtotals(prev => ({
              ...prev,
              [itemKey]: item.quantity * item.price
            }));
          } else {
            setStaleSubtotals(prev => {
              const copy = { ...prev };
              delete copy[itemKey];
              return copy;
            });
          }

          // BUG H06: Allows 0 or negative numbers
          return {
            ...item,
            quantity: targetQty
          };
        }
        return item;
      });
    });
  };

  // Remove from cart
  const removeFromCart = (cartEntryId, itemId, itemPrice, itemQty) => {
    // BUG M03: Preserves removed item value in orphanedAmount
    const removedValue = (Number(itemPrice) || 0) * (Number(itemQty) || 1);
    setOrphanedAmount(prev => prev + removedValue);

    setCart(prevCart => prevCart.filter(item => {
      if (item.cartEntryId) return item.cartEntryId !== cartEntryId;
      return item.id !== itemId;
    }));

    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setOrphanedAmount(0);
    setStaleSubtotals({});
    setAppliedCoupons([]);
    setTotalDiscountPercent(0);
    try {
      localStorage.removeItem('shopfault_cart');
    } catch (e) {
      console.error(e);
    }
  };

  // Apply Coupon
  const applyCoupon = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    const coupon = VALID_COUPONS[cleanCode];

    if (!coupon) {
      return { success: false, message: `Invalid coupon code "${cleanCode}". Try SAVE10 or SAVE15.` };
    }

    // BUG H01: Duplicate discount application
    setAppliedCoupons(prev => [...prev, coupon]);
    setTotalDiscountPercent(prev => prev + coupon.discountPercent);

    return { 
      success: true, 
      message: `Coupon "${cleanCode}" applied! +${coupon.discountPercent}% discount activated.` 
    };
  };

  // Calculations
  const rawCartSubtotal = cart.reduce((sum, item) => {
    const q = Number(item.quantity);
    return sum + (item.price * (isNaN(q) ? 0 : q));
  }, 0);

  const cartSubtotal = Math.max(0, rawCartSubtotal + orphanedAmount);
  const discountAmount = Math.round(cartSubtotal * (totalDiscountPercent / 100));
  const shippingFee = (cartSubtotal > 1999 || cartSubtotal === 0) ? 0 : 149;
  const cartTax = Math.round(Math.max(0, cartSubtotal - discountAmount) * 0.18);
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + cartTax);

  // Checkout with BUG H03
  const checkoutTax = Math.round(cartSubtotal * 0.18);
  const checkoutHandlingFee = totalDiscountPercent > 0 ? 99 : 0;
  const checkoutTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + checkoutTax + checkoutHandlingFee);

  // Place Order
  const placeOrder = (customerDetails) => {
    const orderId = `SF-ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      orderId,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      discountAmount,
      totalDiscountPercent,
      shippingFee,
      tax: checkoutTax,
      total: checkoutTotal,
      customer: customerDetails,
      status: 'Confirmed'
    };

    setCurrentOrder(newOrder);
    setOrders(prev => [newOrder, ...prev]);
    sessionStorage.setItem('shopfault_last_placed_order', JSON.stringify(newOrder));
    clearCart();
    setCurrentView('confirmation');
    return orderId;
  };

  // =========================================================================
  // AUTO-EVALUATION FUNCTION FOR BUG SUBMISSIONS
  // =========================================================================
  const autoEvaluateSubmission = (report) => {
    const textCorpus = `${report.bugTitle} ${report.module} ${report.stepsToReproduce} ${report.expectedBehavior} ${report.actualBehavior}`.toLowerCase();
    
    let bestMatch = null;
    let highestScore = 0;

    for (const pattern of BUG_PATTERNS) {
      let matches = 0;
      for (const kw of pattern.keywords) {
        if (textCorpus.includes(kw.toLowerCase())) {
          matches += 1;
        }
      }
      if (matches > highestScore && matches >= 1) {
        highestScore = matches;
        bestMatch = pattern;
      }
    }

    if (bestMatch) {
      return {
        matchedBugId: bestMatch.id,
        matchedBugName: bestMatch.name,
        matchedDifficulty: bestMatch.difficulty,
        awardedPoints: bestMatch.points,
        evaluationStatus: 'Verified', // Verified by auto-evaluator
        evaluationConfidence: highestScore >= 2 ? 'High' : 'Moderate'
      };
    }

    return {
      matchedBugId: 'Unmatched',
      matchedBugName: 'Pending Manual Review',
      matchedDifficulty: 'Manual',
      awardedPoints: 0,
      evaluationStatus: 'Needs Review',
      evaluationConfidence: 'Low'
    };
  };

  // Submit participant bug report with Auto-Evaluation
  const submitBugReport = (report) => {
    // If competition has ended, block submission
    if (competition.status === 'ended') {
      showToast('Competition has ended. Submissions are closed.', 'error');
      return null;
    }

    const evaluation = autoEvaluateSubmission(report);

    const reportWithMeta = {
      id: `SUB-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toLocaleString(),
      ...report,
      ...evaluation
    };

    setSubmissions(prev => [reportWithMeta, ...prev]);
    showToast('Bug report submitted successfully.', 'success');
    return reportWithMeta;
  };

  // Organizer manual review action (approve, reject, or adjust points)
  const updateSubmissionEvaluation = (submissionId, newStatus, points) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          evaluationStatus: newStatus,
          awardedPoints: points !== undefined ? Number(points) : s.awardedPoints
        };
      }
      return s;
    }));
    showToast(`Submission ${submissionId} updated: ${newStatus}`, 'info');
  };

  // =========================================================================
  // REAL-TIME LEADERBOARD CALCULATION
  // =========================================================================
  const getLeaderboard = () => {
    const teamsMap = {};

    submissions.forEach(sub => {
      const team = (sub.teamId || 'Unknown Team').trim();
      if (!teamsMap[team]) {
        teamsMap[team] = {
          teamId: team,
          totalPoints: 0,
          verifiedBugs: new Set(),
          totalSubmissions: 0,
          lastSubmissionTime: sub.timestamp
        };
      }

      teamsMap[team].totalSubmissions += 1;

      // If status is Verified and bug is valid
      if (sub.evaluationStatus === 'Verified' && sub.matchedBugId && sub.matchedBugId !== 'Unmatched') {
        // Points awarded once per unique bug per team
        if (!teamsMap[team].verifiedBugs.has(sub.matchedBugId)) {
          teamsMap[team].verifiedBugs.add(sub.matchedBugId);
          teamsMap[team].totalPoints += (Number(sub.awardedPoints) || 0);
        }
      }
    });

    // Convert to sorted array
    const sorted = Object.values(teamsMap).map(t => ({
      teamId: t.teamId,
      totalPoints: t.totalPoints,
      bugsCount: t.verifiedBugs.size,
      bugsList: Array.from(t.verifiedBugs),
      totalSubmissions: t.totalSubmissions,
      lastSubmissionTime: t.lastSubmissionTime
    })).sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      return b.bugsCount - a.bugsCount;
    });

    return sorted.map((item, idx) => ({
      rank: idx + 1,
      ...item
    }));
  };

  return (
    <ShopContext.Provider value={{
      products,
      cart,
      currentView,
      setCurrentView,
      selectedProduct,
      setSelectedProduct,
      navBadgeCount,
      refreshBadgeCount,
      staleSubtotals,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      appliedCoupons,
      totalDiscountPercent,
      rawCartSubtotal,
      cartSubtotal,
      discountAmount,
      shippingFee,
      cartTax,
      cartTotal,
      checkoutTax,
      checkoutHandlingFee,
      checkoutTotal,
      placeOrder,
      currentOrder,
      setCurrentOrder,
      orders,
      setOrders,
      submissions,
      submitBugReport,
      updateSubmissionEvaluation,
      getLeaderboard,
      // Competition controls
      competition,
      startCompetition,
      pauseCompetition,
      stopCompetition,
      resetCompetition,
      toast,
      showToast
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
