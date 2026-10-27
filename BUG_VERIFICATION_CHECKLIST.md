# ShopFault Store — Bug Verification Checklist (15 Bugs)
## Official Pre-Competition Bug Certification (INR Currency)

Every bug listed below must be verified individually by the organizer before the start of the competition.

---

### EASY BUGS (4 Bugs — 2 Points Each)

#### [x] [BUG-E01] Search Button Failure
- **Feature:** Store Catalog Search Bar
- **Verification Procedure:**
  1. Go to Catalog (`/`).
  2. Type `Keyboard` in the search box.
  3. Click the **Search** button.
- **Expected:** Catalog filters down to matching items.
- **Actual:** Catalog remains unchanged (14 products still visible).
- **Status:** **PASS / VERIFIED**

---

#### [x] [BUG-E02] Broken Product Image
- **Feature:** Product Catalog Grid
- **Verification Procedure:**
  1. Scroll to Product Card #4 (**AeroGlide Precision Ergonomic Mouse**).
  2. Inspect image container.
- **Expected:** Valid product illustration / photo.
- **Actual:** Displays broken image placeholder: `Image Not Found (404)`.
- **Status:** **PASS / VERIFIED**

---

#### [x] [BUG-E03] Stale Cart Badge
- **Feature:** Navigation Bar Cart Counter
- **Verification Procedure:**
  1. Note navbar cart badge is `0`.
  2. Click **Add to Cart** on any product.
  3. Check navbar badge immediately.
- **Expected:** Badge increments to `1` immediately.
- **Actual:** Badge stays at `0` until page is reloaded or Cart page is opened.
- **Status:** **PASS / VERIFIED**

---

#### [x] [BUG-E04] Missing Required-Email Validation
- **Feature:** Checkout Form Validation
- **Verification Procedure:**
  1. Add item to cart and proceed to Checkout (`/checkout`).
  2. Fill Name, Phone, and Address. Leave **Email Address** completely empty (only `*` mark is present).
  3. Click **Place Demonstration Order**.
- **Expected:** Validation blocks submission and highlights email as required.
- **Actual:** Form accepts empty email and completes order without error.
- **Status:** **PASS / VERIFIED**

---

### MEDIUM BUGS (5 Bugs — 4 Points Each)

#### [x] [BUG-M01] Incorrect Category Filtering (Accessories Omission)
- **Feature:** Category Filter Tabs
- **Verification Procedure:**
  1. Observe Product #8 (**Artisan Genuine Leather Laptop Sleeve**) has category `Accessories`.
  2. Click the **Accessories** tab.
- **Expected:** All accessories are shown.
- **Actual:** Only 3 products appear. Product #8 is omitted.
- **Status:** **PASS / VERIFIED**

---

#### [x] [BUG-M02] Stale Quantity Subtotal
- **Feature:** Shopping Cart Line Item
- **Verification Procedure:**
  1. Add 1 SoundWave Pro (₹2,499) to cart and open Cart page.
  2. Click the `+` button to increase quantity to 2.
- **Expected:** Subtotal displays `₹4,998`.
- **Actual:** Subtotal continues displaying `₹2,499` (previous stale value).
- **Status:** **PASS / VERIFIED**

---

#### [x] [BUG-M03] Incorrect Total After Removing an Item
- **Feature:** Cart Total Recalculation
- **Verification Procedure:**
  1. Add Earbuds (₹2,499) and Keyboard (₹6,499) to cart. Subtotal = `₹8,998`.
  2. Click the trash icon to delete Earbuds (₹2,499).
- **Expected:** Subtotal decreases to `₹6,499`.
- **Actual:** Item disappears from table, but Subtotal remains `₹8,998`.
- **Status:** **PASS / VERIFIED**

---

#### [x] [BUG-M04] Invalid Email Accepted
- **Feature:** Checkout Email Format Validation
- **Verification Procedure:**
  1. In Checkout, enter `student@` in the Email Address field.
  2. Fill remaining required fields and click **Place Demonstration Order**.
- **Expected:** Rejection with message "Please provide a valid email format".
- **Actual:** Passes validation and order is confirmed.
- **Status:** **PASS / VERIFIED**

---

#### [x] [BUG-M05] Incorrect Price Sorting (String Sort)
- **Feature:** Catalog Sorting Dropdown
- **Verification Procedure:**
  1. Select **Price: Low to High** from the sort dropdown.
  2. Inspect product order.
- **Expected:** Ascending numeric order (₹799 -> ₹1,299 -> ...).
- **Actual:** Lexicographical string sort: `₹1,299` appears before `₹799`.
- **Status:** **PASS / VERIFIED**

---

### HARD BUGS (6 Bugs — 8 Points Each)

#### [x] [BUG-H01] Duplicate Discount Application (Coupon Stacking)
- **Feature:** Shopping Cart Coupon Box
- **Verification Procedure:**
  1. In Cart, enter coupon `SAVE15`.
  2. Click **Apply Coupon** 3 times consecutively.
- **Expected:** Coupon applied once (15% discount).
- **Actual:** Discount stacks repeatedly (15% -> 30% -> 45%).
- **Status:** **PASS / VERIFIED**

---

#### [x] [BUG-H02] Duplicate Order Created on Page Refresh
- **Feature:** Order Confirmation & History
- **Verification Procedure:**
  1. Place an order and arrive at Order Confirmation.
  2. Refresh the browser page (press `F5`).
  3. Go to **Order History** in navbar.
- **Expected:** Exactly 1 order entry.
- **Actual:** Duplicate identical order appears with `Duplicate Detected` badge.
- **Status:** **PASS / VERIFIED**

---

#### [x] [BUG-H03] Cart and Checkout Total Mismatch
- **Feature:** Cart vs Checkout Tax & Fee Calculation
- **Verification Procedure:**
  1. Add Apex Ultra Keyboard (₹6,499) to cart.
  2. Apply coupon `SAVE15`. Note Cart Total = `₹6,518`.
  3. Click **Proceed to Checkout**.
- **Expected:** Checkout Final Amount = `₹6,518`.
- **Actual:** Checkout Final Amount = `₹6,793` (Discrepancy of +₹275).
- **Status:** **PASS / VERIFIED**

---

#### [x] [BUG-H04] Stale Order Details on Browser Navigation
- **Feature:** Browser History Traversal (Popstate)
- **Verification Procedure:**
  1. Place an order and view Confirmation.
  2. Click browser **Back** button, then browser **Forward** button.
- **Expected:** Original order details remain visible.
- **Actual:** Replaces order with stale snapshot `SF-ORD-STALE-DRAFT-01`.
- **Status:** **PASS / VERIFIED**

---

#### [x] [BUG-H05] Duplicate Cart Entry on Rapid Clicks
- **Feature:** Catalog Add to Cart
- **Verification Procedure:**
  1. In Catalog, double-click **Add to Cart** on any item within 400ms.
  2. Open the Cart page.
- **Expected:** Single line item with quantity = 2.
- **Actual:** Two separate rows for the exact same product.
- **Status:** **PASS / VERIFIED**

---

#### [x] [BUG-H06] Invalid Quantity Boundary Handling
- **Feature:** Cart Direct Quantity Input
- **Verification Procedure:**
  1. In Cart table, type `-1` into the quantity input field.
  2. Press Tab or click away.
- **Expected:** Rejection or automatic clamping to minimum of 1.
- **Actual:** Line subtotal turns negative (`-₹2,499`), reducing the total.
- **Status:** **PASS / VERIFIED**

---

### SUMMARY OF CERTIFICATION

- **Total Bugs Tested:** 15 / 15
- **Easy Bugs Certified:** 4 / 4 (8 pts)
- **Medium Bugs Certified:** 5 / 5 (20 pts)
- **Hard Bugs Certified:** 6 / 6 (48 pts)
- **Total Certified Competition Points:** **76 Points**
- **Readiness:** **APPROVED FOR COMPETITION**
