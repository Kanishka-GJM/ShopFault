export const ORGANIZER_BUGS_DATA = [
  {
    id: 'BUG-E01',
    name: 'Search Button Click Failure',
    difficulty: 'Easy',
    points: 2,
    module: 'Search Bar',
    stepsToReproduce: [
      'Navigate to the Store Catalog (/)',
      'Type "Keyboard" or "Headphones" in the top search input',
      'Click the "Search" button with the mouse',
      'Observe the product listing'
    ],
    evidence: 'Search input contains text, but results still show "Showing 14 products" and filter is not applied.',
    expected: 'Product list updates immediately upon clicking the Search button to display matching products.',
    actual: 'Product list remains completely unchanged; clicking Search does nothing.',
    technicalExplanation: 'In CatalogPage.jsx, handleSearchButtonClick calls e.preventDefault() but forgets to call setActiveSearchQuery(searchInput).',
    fix: 'setActiveSearchQuery(searchInput);'
  },
  {
    id: 'BUG-E02',
    name: 'Broken Product Image for Designated Item',
    difficulty: 'Easy',
    points: 2,
    module: 'Catalog / Products',
    stepsToReproduce: [
      'Open the Store Catalog (/)',
      'Locate product card #4: "AeroGlide Precision Ergonomic Mouse"',
      'Inspect the image card display area'
    ],
    evidence: 'Product #4 displays a broken image placeholder stating "Image Not Found (404)" while all other products show real photos.',
    expected: 'Product #4 displays a valid photographic product image.',
    actual: 'Image fails to load and fallback 404 broken asset badge is displayed.',
    technicalExplanation: 'In products.js, Product ID 4 has an invalid image URL and ProductCard renders an intentional 404 placeholder.',
    fix: 'Update image URL in products.js to a valid Unsplash photo URL.'
  },
  {
    id: 'BUG-E03',
    name: 'Stale Cart Badge in Navbar',
    difficulty: 'Easy',
    points: 2,
    module: 'Navigation / Badge',
    stepsToReproduce: [
      'Start with an empty cart (Badge shows "0")',
      'Click "Add to Cart" on any product (e.g. SoundWave Pro Earbuds)',
      'Check the Cart badge in the top navbar immediately',
      'Observe that it remains "0"',
      'Navigate to Cart or refresh browser to see it update'
    ],
    evidence: 'Toast popup confirms item added, but header badge stays at 0 until page change or reload.',
    expected: 'Cart badge count increments immediately from 0 to 1 upon clicking Add to Cart.',
    actual: 'Cart badge count stays stale at 0 until CartPage mounts or page reloads.',
    technicalExplanation: 'addToCart in ShopContext updates cart state array but does not call setNavBadgeCount.',
    fix: 'setNavBadgeCount(prev => prev + quantityToAdd);'
  },
  {
    id: 'BUG-E04',
    name: 'Missing Required Email Validation',
    difficulty: 'Easy',
    points: 2,
    module: 'Checkout Form',
    stepsToReproduce: [
      'Add any item to cart and proceed to Checkout (/checkout)',
      'Fill in Full Name, Phone Number, and Street Address',
      'Leave the Email Address field completely blank (marked with *)',
      'Click "Place Demonstration Order"'
    ],
    evidence: 'Checkout completes successfully without any validation error; confirmation screen displays order.',
    expected: 'Form submission blocked with "Email address is required" validation alert.',
    actual: 'Order is placed without an email address; confirmation shows empty email.',
    technicalExplanation: 'CheckoutPage.jsx validates name, phone, and address, but omits checking !formData.email.trim().',
    fix: 'if (!formData.email.trim()) errors.email = "Email address is required";'
  },
  {
    id: 'BUG-M01',
    name: 'Incorrect Category Filtering (Accessories Omission)',
    difficulty: 'Medium',
    points: 4,
    module: 'Catalog / Products',
    stepsToReproduce: [
      'Open the Store Catalog (/)',
      'Click on the "Accessories" category pill filter',
      'Examine the filtered product list'
    ],
    evidence: 'Only 3 items appear (Sleeve, Backpack, Stand). Product #8 (Artisan Leather Laptop Sleeve) is omitted despite being in Accessories.',
    expected: 'All 4 accessories should be displayed when clicking Accessories category.',
    actual: 'Product #8 is excluded from the view because filter condition checks product.id !== 8.',
    technicalExplanation: 'In CatalogPage.jsx, category filter predicate contains an intentional exclusion: (selectedCategory === "Accessories" ? p.id !== 8 : true).',
    fix: 'Remove p.id !== 8 condition from filter predicate.'
  },
  {
    id: 'BUG-M02',
    name: 'Stale Quantity Line Subtotal',
    difficulty: 'Medium',
    points: 4,
    module: 'Shopping Cart',
    stepsToReproduce: [
      'Add an item to Cart (e.g. Aura Smart Watch at ₹4,999)',
      'Open the Cart page (/cart)',
      'Click the "+" button to increase quantity from 1 to 2',
      'Look at the item row "Total" column'
    ],
    evidence: 'Quantity input shows "2", but the item subtotal still reads "₹4,999" (the price of 1 item) instead of ₹9,998.',
    expected: 'Line subtotal updates to ₹9,998 (quantity × price).',
    actual: 'Line subtotal displays the previous quantity price (lagging by 1 step).',
    technicalExplanation: 'updateQuantity in ShopContext caches old subtotal in staleSubtotals state when quantity increases.',
    fix: 'Compute subtotal directly as item.price * item.quantity in CartPage without staleSubtotals override.'
  },
  {
    id: 'BUG-M03',
    name: 'Incorrect Total After Removing Item',
    difficulty: 'Medium',
    points: 4,
    module: 'Shopping Cart',
    stepsToReproduce: [
      'Add 2 different items to Cart (e.g. ₹4,999 watch and ₹2,499 earbuds = ₹7,498)',
      'Open Cart page and verify subtotal is ₹7,498',
      'Click the Trash/Remove button next to the ₹2,499 earbuds',
      'Earbuds row disappears from cart table',
      'Check Order Summary Subtotal'
    ],
    evidence: 'Cart table has only 1 item (₹4,999), but Order Summary subtotal remains ₹7,498, retaining the deleted item amount.',
    expected: 'Cart subtotal drops to ₹4,999 immediately upon removing the earbuds.',
    actual: 'Order summary still includes ₹2,499 from the deleted item in the total.',
    technicalExplanation: 'removeFromCart adds removedValue to orphanedAmount in ShopContext, which is added to cartSubtotal.',
    fix: 'Remove orphanedAmount accumulator and compute subtotal strictly from cart items array.'
  },
  {
    id: 'BUG-M04',
    name: 'Invalid Email Accepted (Missing Domain & TLD)',
    difficulty: 'Medium',
    points: 4,
    module: 'Checkout Form',
    stepsToReproduce: [
      'Proceed to Checkout (/checkout) with any cart item',
      'Fill in Name, Phone, and Address',
      'In Email Address, type "student@"',
      'Click "Place Demonstration Order"'
    ],
    evidence: 'Order succeeds with "student@" stored as the valid customer email address.',
    expected: 'Validation error: "Please enter a complete email address (e.g. name@domain.com)".',
    actual: 'Malformed email "student@" is accepted without error.',
    technicalExplanation: 'Checkout email validation regex checks only /^[^@]+@/ instead of requiring domain and TLD.',
    fix: 'Use comprehensive email regex: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/'
  },
  {
    id: 'BUG-M05',
    name: 'Incorrect Price Sorting (Lexicographical String Sort)',
    difficulty: 'Medium',
    points: 4,
    module: 'Catalog / Products',
    stepsToReproduce: [
      'Open Store Catalog (/)',
      'Change Sort dropdown to "Price: Low to High"',
      'Observe the first four products in the grid'
    ],
    evidence: '₹1,299 and ₹1,499 items appear BEFORE ₹499 item because "1299" < "499" lexicographically in string sort.',
    expected: '₹499 (Ultra-Slim Sleeve) must appear first, followed by ₹1,299, ₹1,499, etc.',
    actual: 'Products are sorted alphabetically as strings, placing ₹1,299 before ₹499.',
    technicalExplanation: 'In CatalogPage.jsx, sort comparator does String(a.price).localeCompare(String(b.price)) instead of a.price - b.price.',
    fix: 'filtered.sort((a, b) => a.price - b.price);'
  },
  {
    id: 'BUG-H01',
    name: 'Duplicate Discount Application (Coupon Stacking)',
    difficulty: 'Hard',
    points: 8,
    module: 'Coupon Discounts',
    stepsToReproduce: [
      'Add items to Cart (e.g. ₹4,999 total)',
      'In the coupon input, enter "SAVE15" and click "Apply"',
      'Observe 15% discount applied (₹750 off)',
      'Without reloading, click "Apply" button again 2 more times'
    ],
    evidence: 'Each click stacks an extra 15%, resulting in 30%, 45% discount and multiple identical coupon badges.',
    expected: 'Applying an already active coupon code should show "Coupon SAVE15 is already applied".',
    actual: 'Coupon discount percentage stacks cumulatively without deduplication check.',
    technicalExplanation: 'applyCoupon in ShopContext pushes directly into appliedCoupons and adds discountPercent without checking if code already exists.',
    fix: 'Check if appliedCoupons.some(c => c.code === coupon.code) before applying.'
  },
  {
    id: 'BUG-H02',
    name: 'Duplicate Order Created on Page Refresh',
    difficulty: 'Hard',
    points: 8,
    module: 'Order Confirmation',
    stepsToReproduce: [
      'Place any order through Checkout and arrive at Order Confirmation (/confirmation)',
      'Note the generated Order ID (e.g. SF-ORD-...)',
      'Press F5 or Browser Reload button',
      'Navigate to Order History (/history)'
    ],
    evidence: 'Order History shows two identical orders placed back-to-back with a "[Duplicate Order Detected on Reload]" badge.',
    expected: 'Page reload on confirmation screen re-displays the current order without creating a new order.',
    actual: 'useEffect on mount in OrderConfirmationPage re-submits a duplicate order into the orders array.',
    technicalExplanation: 'OrderConfirmationPage has an unconditional order duplication effect running on initial render.',
    fix: 'Remove the duplicate order insertion effect from OrderConfirmationPage.jsx.'
  },
  {
    id: 'BUG-H03',
    name: 'Cart and Checkout Total Discrepancy',
    difficulty: 'Hard',
    points: 8,
    module: 'Checkout Form',
    stepsToReproduce: [
      'Add ₹4,999 item to cart and apply coupon "SAVE15" in Cart page',
      'Note Cart Total Amount: Subtotal ₹4,999 - Discount ₹750 + Tax ₹765 (18% of ₹4,249) = ₹5,014',
      'Click "Proceed to Checkout"',
      'Examine the Order Summary box on Checkout page'
    ],
    evidence: 'Checkout Total shows ₹5,252 (₹238 higher!) because Tax is computed on pre-discount subtotal (₹900) plus an unannounced ₹99 fee.',
    expected: 'Checkout Total must strictly match Cart Total Amount (₹5,014).',
    actual: 'Checkout recalculates tax before discount and injects an unannounced handling fee, causing total mismatch.',
    technicalExplanation: 'ShopContext checkoutTax computes 18% of cartSubtotal instead of (cartSubtotal - discountAmount), and adds checkoutHandlingFee.',
    fix: 'Align checkoutTax and fees with cartTax logic.'
  },
  {
    id: 'BUG-H04',
    name: 'Stale Order Information After Browser Navigation',
    difficulty: 'Hard',
    points: 8,
    module: 'Order Confirmation',
    stepsToReproduce: [
      'Place an order and arrive at Order Confirmation',
      'Click "Back to Store" or use the browser Back button to go to catalog',
      'Click browser Forward button to return to confirmation screen'
    ],
    evidence: 'Confirmation page renders hardcoded stale mock draft data (Order #SF-DRAFT-PREV) instead of the user actual order.',
    expected: 'Returning to confirmation displays the latest valid order details from current session.',
    actual: 'window.onpopstate handler overrides currentOrder with a mock stale draft.',
    technicalExplanation: 'In OrderConfirmationPage.jsx, popstate listener forcibly overrides currentOrder with stale draft data.',
    fix: 'Remove popstate listener that mutates order state with mock draft data.'
  },
  {
    id: 'BUG-H05',
    name: 'Duplicate Cart Entry on Rapid Clicks',
    difficulty: 'Hard',
    points: 8,
    module: 'Shopping Cart',
    stepsToReproduce: [
      'On any product card, double-click or rapidly click "Add to Cart" twice within 400ms',
      'Open the Cart page (/cart)',
      'Inspect the cart item list'
    ],
    evidence: 'Cart displays two separate rows for the exact same product instead of 1 row with quantity 2.',
    expected: 'Multiple clicks on the same product increment its single quantity field.',
    actual: 'Rapid clicks bypass existing item deduplication and spawn duplicate cart line items.',
    technicalExplanation: 'In ShopContext addToCart, if click interval < 450ms, isRapidClick bypasses existingIndex check.',
    fix: 'Always check existingIndex regardless of click speed; debounce or disable button during dispatch.'
  },
  {
    id: 'BUG-H06',
    name: 'Invalid Negative/Zero Quantity Corrupting Cart Total',
    difficulty: 'Hard',
    points: 8,
    module: 'Shopping Cart',
    stepsToReproduce: [
      'Add an item to Cart (e.g. ₹4,999 item)',
      'In the quantity input field, manually type "-1" or "0"',
      'Click away or press Tab',
      'Observe Cart Subtotal and Total Amount'
    ],
    evidence: 'Cart Subtotal drops to ₹0 or negative balance; user can place order for ₹0 or negative charge.',
    expected: 'Quantity input rejects numbers < 1, automatically resetting to minimum value 1.',
    actual: 'System accepts -1 or 0, corrupting mathematical totals.',
    technicalExplanation: 'CartPage quantity input permits negative values and updateQuantity in ShopContext does not clamp Math.max(1, qty).',
    fix: 'Enforce Math.max(1, Math.floor(newQuantity)) in updateQuantity.'
  }
];
