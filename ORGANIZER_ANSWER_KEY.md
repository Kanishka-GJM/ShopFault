# CONFIDENTIAL ORGANIZER ANSWER KEY — SHOPFAULT STORE
## Inter-College Debugging Championship
**Target Application:** ShopFault Store  
**Total Planted Bugs:** 15 (4 Easy, 5 Medium, 6 Hard)  
**Maximum Competition Score:** 76 Points  
**Currency:** Indian Rupee (₹ INR)  
**Scoring Rubric:**
- **Easy (E01 – E04):** 2 Points each (8 points total)
- **Medium (M01 – M05):** 4 Points each (20 points total)
- **Hard (H01 – H06):** 8 Points each (48 points total)

---

## SECTION 1: EASY BUGS (4 Bugs — 8 Points Total)

### [BUG-E01] Search Button Click Failure
- **Difficulty:** Easy (2 Points)
- **Module:** Catalog / Search Feature
- **Exact Steps to Reproduce:**
  1. Open the Store Catalog (`/`).
  2. In the top search bar, type `Keyboard` (or any valid product title like `Headphones`).
  3. Click the **Search** button to the right of the input field.
  4. Observe the displayed product list.
- **Expected Behaviour:** The product grid should update immediately to show only products matching "Keyboard" (e.g. Apex Ultra Mechanical Keyboard).
- **Actual Behaviour:** The displayed product list remains unchanged (all 14 products remain visible). The search button click does not commit or dispatch the filter.
- **Evidence / Verification:** Search input displays `Keyboard`, but results count still reads "Showing 14 products".
- **Technical Explanation:** In `src/pages/CatalogPage.jsx`, `handleSearchButtonClick` executes `e.preventDefault()`, but mistakenly omits calling `setActiveSearchQuery(searchInput)`. Because `activeSearchQuery` remains empty, the filtering predicate is never applied.
- **Post-Competition Fix:**
  ```javascript
  // In src/pages/CatalogPage.jsx:
  const handleSearchButtonClick = (e) => {
    e.preventDefault();
    setActiveSearchQuery(searchInput); // Add this line
  };
  ```

---

### [BUG-E02] Broken Product Image for Designated Item
- **Difficulty:** Easy (2 Points)
- **Module:** Catalog / Product Card Grid
- **Exact Steps to Reproduce:**
  1. Open the Store Catalog (`/`).
  2. Locate Product Card #4: **AeroGlide Precision Ergonomic Mouse**.
  3. Observe the card's media display area.
- **Expected Behaviour:** Every product card must render a valid photographic image.
- **Actual Behaviour:** Product #4 renders a broken image placeholder stating `Image Not Found (404)` with a failed asset icon.
- **Evidence / Verification:** Product #4 displays a broken image placeholder with `Image Not Found (404)` while all other 13 products display high-resolution studio photographs.
- **Technical Explanation:** In `src/data/products.js`, Product ID 4 has its `image` attribute pointing to a broken non-existent URL, and `ProductCard.jsx` explicitly displays the broken image state for Product ID 4.
- **Post-Competition Fix:**
  Assign a valid product photo URL to Product ID 4 in `src/data/products.js`.

---

### [BUG-E03] Stale Cart Badge in Navigation Bar
- **Difficulty:** Easy (2 Points)
- **Module:** Header / Cart Counter Badge
- **Exact Steps to Reproduce:**
  1. Open the store with an empty cart (Cart badge displays `0`).
  2. On any product card (e.g. SoundWave Pro Earbuds), click **Add to Cart**.
  3. Look at the Cart counter badge in the top-right navbar immediately after clicking.
  4. Note that it stays at `0`.
  5. Refresh the browser page or click into the **Cart** tab.
- **Expected Behaviour:** The badge count in the header should increment immediately (0 -> 1) upon clicking "Add to Cart".
- **Actual Behaviour:** The badge remains at `0` until a full browser reload occurs or until the participant navigates to the Cart page.
- **Evidence / Verification:** Toast notification confirms "Added SoundWave Pro to cart", but the header badge continues displaying `0`.
- **Technical Explanation:** In `src/context/ShopContext.jsx`, `addToCart` updates the `cart` state array in React, but fails to dispatch `setNavBadgeCount`. `navBadgeCount` is only refreshed on initial mount or when `refreshBadgeCount()` is triggered inside `CartPage.jsx`.
- **Post-Competition Fix:**
  ```javascript
  // In src/context/ShopContext.jsx inside addToCart:
  setNavBadgeCount(prev => prev + quantityToAdd);
  ```

---

### [BUG-E04] Missing Required-Email Validation at Checkout
- **Difficulty:** Easy (2 Points)
- **Module:** Checkout Form Validation
- **Exact Steps to Reproduce:**
  1. Add any product to the cart and proceed to Checkout (`/checkout`).
  2. Fill in Full Name, Phone Number, and Street Address.
  3. Leave the **Email Address** field completely blank (labeled with `*`).
  4. Click **Place Demonstration Order**.
- **Expected Behaviour:** The form should block submission and display an error message such as "Email is required".
- **Actual Behaviour:** The order is accepted without error, routing the participant directly to the Order Confirmation page without an email.
- **Evidence / Verification:** The Order Confirmation screen displays "Customer: (No email provided)" without any validation blocker.
- **Technical Explanation:** In `src/pages/CheckoutPage.jsx`, `handlePlaceOrder` explicitly tests `!formData.name.trim()`, `!formData.phone.trim()`, and `!formData.address.trim()`, but completely omits checking `!formData.email.trim()`.
- **Post-Competition Fix:**
  ```javascript
  // In src/pages/CheckoutPage.jsx inside handlePlaceOrder:
  if (!formData.email.trim()) {
    errors.email = 'Email address is required';
  }
  ```

---

## SECTION 2: MEDIUM BUGS (5 Bugs — 20 Points Total)

### [BUG-M01] Incorrect Category Filtering (Accessories Omission)
- **Difficulty:** Medium (4 Points)
- **Module:** Catalog / Category Navigation
- **Exact Steps to Reproduce:**
  1. Open the Store Catalog and view under "All" category.
  2. Observe Product #8: **Artisan Genuine Leather Laptop Sleeve** has category `Accessories`.
  3. Click on the **Accessories** tab.
  4. Count the displayed products.
- **Expected Behaviour:** 4 products should appear: Artisan Leather Sleeve, Lumina Desk Lamp, NanoPod Power Bank, and FlexiArm Stand.
- **Actual Behaviour:** Only 3 products appear. Product #8 is missing from the list.
- **Evidence / Verification:** Grid shows 3 products. Product #8 vanishes upon selecting Accessories.
- **Technical Explanation:** In `src/pages/CatalogPage.jsx`, the category filter logic has an intentional exclusionary clause:
  `if (selectedCategory === 'Accessories') return p.category === 'Accessories' && p.id !== 8;`
- **Post-Competition Fix:**
  ```javascript
  // In src/pages/CatalogPage.jsx:
  return p.category === selectedCategory;
  ```

---

### [BUG-M02] Stale Quantity Line Subtotal in Cart
- **Difficulty:** Medium (4 Points)
- **Module:** Shopping Cart Table
- **Exact Steps to Reproduce:**
  1. Add 1 unit of **SoundWave Pro Wireless Earbuds** (₹2,499) to the cart.
  2. Open the Cart page. Note line Subtotal displays `₹2,499`.
  3. Click the `+` button once to increase quantity from `1` to `2`.
  4. Observe the displayed line Subtotal for that product.
- **Expected Behaviour:** The Subtotal column for SoundWave Pro should immediately update to `₹4,998` (2 x ₹2,499).
- **Actual Behaviour:** The Subtotal column remains `₹2,499`, lagging behind by 1 click.
- **Evidence / Verification:** Quantity column displays `2`, unit price is `₹2,499`, but line Subtotal column displays `₹2,499`.
- **Technical Explanation:** In `src/context/ShopContext.jsx` inside `updateQuantity()`, when `targetQty > item.quantity`, `staleSubtotals` caches `item.quantity * item.price` before the increment. The table row renders `staleSubtotals[id]` if present, creating a 1-step rendering lag.
- **Post-Competition Fix:**
  Remove `staleSubtotals` state and compute the cell subtotal dynamically as `item.quantity * item.price`.

---

### [BUG-M03] Incorrect Total After Removing an Item from Cart
- **Difficulty:** Medium (4 Points)
- **Module:** Shopping Cart / Total Calculation
- **Exact Steps to Reproduce:**
  1. Add **SoundWave Pro Earbuds** (₹2,499) and **Apex Ultra Keyboard** (₹6,499) to the cart.
  2. Go to the Cart page. Notice Subtotal is `₹8,998`.
  3. Click the trash can icon next to the SoundWave Pro Earbuds to remove it.
  4. Inspect the Order Summary card on the right.
- **Expected Behaviour:** The Subtotal should drop to `₹6,499`, and the total should adjust accordingly.
- **Actual Behaviour:** The Earbuds disappear from the table, but the Order Summary Subtotal remains `₹8,998`, still including the removed product's cost.
- **Evidence / Verification:** Table displays only 1 item (₹6,499 Keyboard), but Order Summary Subtotal shows `₹8,998`.
- **Technical Explanation:** In `src/context/ShopContext.jsx`, `removeFromCart` adds the removed item's price into `orphanedAmount`. When `cartSubtotal` is computed, it evaluates `rawCartSubtotal + orphanedAmount`.
- **Post-Competition Fix:**
  Eliminate `orphanedAmount` and calculate `cartSubtotal` purely from the active `cart` array items.

---

### [BUG-M04] Invalid Email Accepted at Checkout
- **Difficulty:** Medium (4 Points)
- **Module:** Checkout Form Validation
- **Exact Steps to Reproduce:**
  1. Add items to cart and proceed to Checkout (`/checkout`).
  2. In the Email Address field, type `student@` (or `test@`).
  3. Fill out the other required fields.
  4. Click **Place Demonstration Order**.
- **Expected Behaviour:** Submission should be blocked with an error: "Please provide a valid email format".
- **Actual Behaviour:** The order succeeds and confirms with `student@` as the email address.
- **Evidence / Verification:** Confirmation page displays `Recipient: (student@)` with no error thrown.
- **Technical Explanation:** In `src/pages/CheckoutPage.jsx`, the email validation regex is `const faultyEmailRegex = /^[\w.-]+@/;`. This regex only checks that an `@` character exists following word characters, completely ignoring domain name and TLD requirements.
- **Post-Competition Fix:**
  ```javascript
  // In src/pages/CheckoutPage.jsx:
  const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!validEmailRegex.test(formData.email.trim())) {
    errors.email = 'Please provide a valid email address';
  }
  ```

---

### [BUG-M05] Incorrect Price Sorting (Lexicographical String Sort)
- **Difficulty:** Medium (4 Points)
- **Module:** Catalog / Price Sorting
- **Exact Steps to Reproduce:**
  1. Open the Store Catalog (`/`).
  2. Locate the sort dropdown (defaults to "Featured Collection").
  3. Change the sort selection to **Price: Low to High**.
  4. Inspect the sequence of products.
- **Expected Behaviour:** Products should be ordered numerically: ₹799 -> ₹1,299 -> ₹1,499 -> ... -> ₹9,999.
- **Actual Behaviour:** Products are sorted alphabetically by string: `₹1,299` (NanoPod Power Bank) appears BEFORE `₹799` (PureSound Filter).
- **Evidence / Verification:** The first product in "Low to High" is priced at ₹1,299, while the ₹799 product is pushed far down the list.
- **Technical Explanation:** In `src/pages/CatalogPage.jsx`, the sorting comparator runs `list.sort((a, b) => a.price.toString().localeCompare(b.price.toString()))`. This performs alphabetical ASCII comparison rather than numeric subtraction `a.price - b.price`.
- **Post-Competition Fix:**
  ```javascript
  // In src/pages/CatalogPage.jsx:
  if (sortBy === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  }
  ```

---

## SECTION 3: HARD BUGS (6 Bugs — 48 Points Total)

### [BUG-H01] Duplicate Discount Application (Coupon Stacking)
- **Difficulty:** Hard (8 Points)
- **Module:** Shopping Cart / Coupon Engine
- **Exact Steps to Reproduce:**
  1. Add items to the cart and navigate to the Cart page.
  2. In the promotional coupon box, enter coupon code `SAVE15`.
  3. Click **Apply Coupon**. Notice 15% discount applied.
  4. Click **Apply Coupon** a second time, and then a third time.
  5. Observe the discount percentage and the total price.
- **Expected Behaviour:** The coupon should only be applied once. Subsequent clicks should display "Coupon already applied" without altering the total.
- **Actual Behaviour:** Each click stacks the coupon again: 15% -> 30% -> 45%, repeatedly lowering the total.
- **Evidence / Verification:** Active discounts lists `SAVE15` multiple times, and the discount row reads `Discount (45%) -₹...`.
- **Technical Explanation:** In `src/context/ShopContext.jsx`, `applyCoupon()` appends the coupon to `appliedCoupons` and increments `totalDiscountPercent` by `coupon.discountPercent` without verifying if `appliedCoupons.some(c => c.code === cleanCode)`.
- **Post-Competition Fix:**
  ```javascript
  // In src/context/ShopContext.jsx inside applyCoupon:
  if (appliedCoupons.some(c => c.code === cleanCode)) {
    return { success: false, message: 'Coupon has already been applied.' };
  }
  ```

---

### [BUG-H02] Duplicate Order Created on Page Refresh
- **Difficulty:** Hard (8 Points)
- **Module:** Order Confirmation / Order History
- **Exact Steps to Reproduce:**
  1. Place an order and arrive on the Order Confirmation page.
  2. Note the Order Reference ID (e.g. `SF-ORD-829104-3921`).
  3. Refresh the browser page (press `F5` or `Ctrl+R`), or click the "Simulate Page Refresh Request" button.
  4. Click **View in Order History** in the navbar.
- **Expected Behaviour:** Order History should contain exactly one order record for that purchase.
- **Actual Behaviour:** Two identical order entries with the exact same Order Reference ID and amount are created in Order History.
- **Evidence / Verification:** Order History page displays two identical cards tagged with `Duplicate Detected (BUG H02)` and identical Order Reference IDs.
- **Technical Explanation:** In `src/pages/OrderConfirmationPage.jsx`, the mount `useEffect` detects a page reload and automatically re-reads `sessionStorage.getItem('shopfault_last_placed_order')` and inserts it into `orders` state without checking if `parsed.orderId` is already present.
- **Post-Competition Fix:**
  Check `orders.some(o => o.orderId === parsed.orderId)` before adding to order history, or record confirmed order IDs in a Set.

---

### [BUG-H03] Cart and Checkout Total Mismatch
- **Difficulty:** Hard (8 Points)
- **Module:** Pricing Engine / Tax & Fee Calculation
- **Exact Steps to Reproduce:**
  1. Add **Apex Ultra Mechanical Keyboard** (₹6,499) to the cart.
  2. On the Cart page, apply coupon `SAVE15` (15% discount = -₹975).
  3. Note the Cart Total: `₹6,518` (Subtotal ₹6,499 - Discount ₹975 + GST 18% ₹994 + Free Delivery).
  4. Click **Proceed to Checkout**.
  5. Inspect the **Final Amount** on the Checkout page.
- **Expected Behaviour:** Both Cart and Checkout must display identical amounts (`₹6,518`).
- **Actual Behaviour:** Checkout displays a Final Amount of `₹6,793` (₹275 higher than Cart).
- **Evidence / Verification:** Cart Summary displays Total `₹6,518`, while Checkout Summary displays Final Amount `₹6,793`.
- **Technical Explanation:** In `src/context/ShopContext.jsx`, `cartTax` is calculated on the discounted subtotal: `(cartSubtotal - discountAmount) * 0.18 = ₹994`, whereas `checkoutTax` is calculated on the full, undiscounted subtotal: `cartSubtotal * 0.18 = ₹1,170`, plus an unlisted demo handling fee of ₹99. This produces a deterministic mathematical discrepancy whenever a discount is active.
- **Post-Competition Fix:**
  Standardize the tax calculation across both views to use `(cartSubtotal - discountAmount) * 0.18` and remove the handling fee.

---

### [BUG-H04] Stale Order Information After Browser Navigation
- **Difficulty:** Hard (8 Points)
- **Module:** Order Confirmation / History Traversal
- **Exact Steps to Reproduce:**
  1. Place an order containing your selected products (e.g. Apex Ultra Keyboard).
  2. On the Order Confirmation page, click the browser's native **Back** button.
  3. Click the browser's native **Forward** button to return to the Confirmation page.
  4. Observe the displayed order details.
- **Expected Behaviour:** The Confirmation page should retain the details of the order that was just placed.
- **Actual Behaviour:** The Confirmation page replaces your order with stale cached draft data (`SF-ORD-STALE-DRAFT-01` with `Previous Draft Cart Item` for `₹1,328`).
- **Evidence / Verification:** Order Reference changes to `SF-ORD-STALE-DRAFT-01` and customer name changes to `Previous Visitor`.
- **Technical Explanation:** `src/pages/OrderConfirmationPage.jsx` binds a `popstate` event listener that overwrites `displayedOrder` with an outdated snapshot stored in `sessionStorage.getItem('shopfault_stale_draft')` upon browser history traversal.
- **Post-Competition Fix:**
  Remove the `popstate` override and rely on `currentOrder` or verified session storage.

---

### [BUG-H05] Duplicate Cart Entry After Rapid Clicks
- **Difficulty:** Hard (8 Points)
- **Module:** Product Card / Add-to-Cart Race Condition
- **Exact Steps to Reproduce:**
  1. On any product card in the Catalog (e.g. **Apex Ultra Mechanical Keyboard**), double-click or click **Add to Cart** twice in rapid succession (within 400 milliseconds).
  2. Click into the **Cart** tab in the navigation bar.
  3. Inspect the Cart table.
- **Expected Behaviour:** The product should occupy a single table row with its quantity set to `2`.
- **Actual Behaviour:** Two separate rows for the exact same product appear in the Cart table.
- **Evidence / Verification:** The Cart table displays two distinct rows for Apex Ultra Mechanical Keyboard, each with quantity 1.
- **Technical Explanation:** In `src/context/ShopContext.jsx`, `addToCart()` records timestamps. If `now - lastAddClickRef.current.time < 450`, it skips the `findIndex` consolidation check and forces the creation of a new item with a distinct `cartEntryId`.
- **Post-Competition Fix:**
  Remove the rapid-click branch and always consolidate matching product IDs using functional state update `setCart(prev => ...)`.

---

### [BUG-H06] Invalid Quantity Boundary Handling (Negative / Zero Quantities)
- **Difficulty:** Hard (8 Points)
- **Module:** Cart Quantity Input Validation
- **Exact Steps to Reproduce:**
  1. Add **SoundWave Pro Wireless Earbuds** (₹2,499) and **NeoCharge Fast Charger** (₹1,499) to the cart.
  2. Open the Cart page.
  3. In the numeric quantity input field for the Earbuds, directly type `-1` (or `0`).
  4. Press Tab or click away to blur the input.
  5. Observe the line subtotal and the Cart Summary Total.
- **Expected Behaviour:** Quantities must be restricted to positive integers >= 1. Entering 0 or negative numbers should either remove the item (with confirmation) or clamp to 1.
- **Actual Behaviour:** The line subtotal turns negative (`-₹2,499`), which subtracts from the overall cart subtotal and reduces the total amount.
- **Evidence / Verification:** Earbuds subtotal displays `-₹2,499`, and the Cart Total drops artificially.
- **Technical Explanation:** In `src/context/ShopContext.jsx`, `updateQuantity()` parses `Number(newQuantity)` and assigns it directly to `item.quantity` without validation or clamping against `Math.max(1, qty)`.
- **Post-Competition Fix:**
  ```javascript
  // In src/context/ShopContext.jsx:
  const targetQty = Math.max(1, parseInt(newQuantity, 10) || 1);
  ```

---

## SECTION 4: SCORING MATRIX FOR JUDGES

| Bug ID | Difficulty | Suggested Points | Feature / Page | Quick Check |
|---|---|---|---|---|
| **BUG-E01** | Easy | 2 | Catalog / Search | Type query -> click Search -> list unchanged |
| **BUG-E02** | Easy | 2 | Product Card | Product #4 displays 404 broken image |
| **BUG-E03** | Easy | 2 | Navbar Badge | Badge stays at 0 after adding item until reload |
| **BUG-E04** | Easy | 2 | Checkout | Empty email field proceeds through checkout |
| **BUG-M01** | Medium | 4 | Category Filter | Selecting "Accessories" hides Product #8 |
| **BUG-M02** | Medium | 4 | Cart Quantity | Clicking `+` keeps previous stale line subtotal |
| **BUG-M03** | Medium | 4 | Cart Deletion | Deleting item retains its price in total |
| **BUG-M04** | Medium | 4 | Email Validation | Malformed email `student@` accepted |
| **BUG-M05** | Medium | 4 | Price Sort | Low-to-High places ₹1,299 before ₹799 |
| **BUG-H01** | Hard | 8 | Coupon Stacking | Clicking Apply Coupon multiple times stacks discount |
| **BUG-H02** | Hard | 8 | Confirmation | Reloading confirmation page creates duplicate order |
| **BUG-H03** | Hard | 8 | Total Discrepancy | Cart total and Checkout total differ with coupon |
| **BUG-H04** | Hard | 8 | History Traversal | Back/forward navigation restores stale draft order |
| **BUG-H05** | Hard | 8 | Rapid Add to Cart | Double-clicking Add to Cart creates 2 cart lines |
| **BUG-H06** | Hard | 8 | Quantity Boundary | Negative quantity accepted, reducing total |

**TOTAL POINTS POSSIBLE: 76 POINTS**
