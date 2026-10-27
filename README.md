# ShopFault Store — CSI Inter-College Debugging Championship

Welcome to the **ShopFault Store** official competition repository!

This platform is a functional online shopping store built specifically for the **CSI Inter-College Debugging Championship**. Your mission as a team is to test the application, analyze its behavior, discover hidden functional defects, and submit detailed reproduction reports before time runs out.

---

## 🏆 Championship Overview

- **Competition Format:** Team-based functional QA & software debugging
- **Team Size:** Up to 4 participants per team
- **Duration:** Exactly 40 Minutes
- **Total Seeded Bugs:** Exactly 15 hidden functional anomalies
- **Maximum Possible Score:** 76 Points

### Scoring Rubric

| Difficulty Tier | Number of Bugs | Points per Bug | Total Possible Points |
|---|---|---|---|
| **Easy** | 4 Bugs | 2 Points each | 8 Points |
| **Medium** | 5 Bugs | 4 Points each | 20 Points |
| **Hard** | 6 Bugs | 8 Points each | 48 Points |
| **Total** | **15 Bugs** | — | **76 Points** |

---

## 🚀 How to Run & Access the Store

### Running Locally on Your Workstation

If your team is running the repository locally:

```bash
# 1. Install project dependencies
npm install

# 2. Launch the local development server
npm run dev
```

Open your web browser and navigate to:
```
http://localhost:5173/
```

### Accessing via Campus Network / Lab Wi-Fi

If the event organizers are hosting the competition over the college LAN or a cloud URL, simply open the URL provided by the event coordinators in your browser (e.g. `http://<HOST_IP>:5173/`).

---

## ⏱️ Competition Flow & Timer Rules

1. **Standby Screen:**
   - Before the event begins, the website displays an **Event Standby Screen**. Store browsing is locked while all teams take their seats and prepare.
2. **Synchronized Timer Start:**
   - When the event organizers officially start the 40-minute sprint, the store catalog will automatically unlock across all participant workstations simultaneously.
   - A sticky **Live Competition Banner** will appear at the top of your screen displaying the exact time remaining (`MM:SS`).
3. **Automated Submission Cutoff:**
   - When the timer reaches `00:00`, the competition concludes automatically.
   - The Bug Submission Portal will close and will not accept further submissions. Be sure to submit each bug report as soon as you discover and verify it!

---

## 🔍 Investigation Scope & Store Features

Bugs are planted across realistic user flows. Your team should thoroughly test each module:

1. **Store Catalog (`/`)**:
   - Product grid presentation and visual assets
   - Category filter pills (*All*, *Electronics*, *Audio*, *Accessories*, *Wearables*)
   - Keyword search bar functionality
   - Product sorting options (by Price and Featured order)
2. **Product Details View**:
   - Quick-view modals, product specifications, customer ratings, and quantity selectors
   - Adding single and multiple items to the cart
3. **Shopping Cart (`/cart`)**:
   - Line-item quantity modifications and unit pricing
   - Line subtotal updates and total calculation accuracy
   - Item removal from cart and resulting order totals
   - Promotional coupon code application and discount logic
4. **Checkout Form (`/checkout`)**:
   - Customer shipping details and field validation
   - Tax (GST), shipping fees, and handling charges
   - Total amount consistency between the cart and checkout pages
5. **Order Confirmation & Order History (`/history`)**:
   - Order placement workflow, reference ID generation, and invoice display
   - Browser navigation (Back / Forward / Reload) behavior
   - Order history records and purchase persistence

---

## 📝 Bug Submission Guidelines

When your team discovers an anomaly, submit your finding immediately through the built-in **Participant Bug Submission Portal**:

1. Click the **Submit Bug** button in the top navigation bar (or visit `/submit-bug`).
2. Complete all required fields with accurate information:
   - **Team Name / ID:** Your assigned team name or workstation number (e.g. `Team ByteKnights - Desk #12`).
   - **Page / Feature Affected:** Select the relevant module from the dropdown list.
   - **Bug Summary / Title:** A clear, concise title summarizing the unexpected behavior.
   - **Exact Steps to Reproduce:** Numbered, step-by-step instructions allowing judges to reproduce the defect exactly as you found it.
   - **Expected Behaviour:** What the system should normally do according to standard e-commerce conventions.
   - **Actual Behaviour:** What incorrect, anomalous, or faulty behavior actually occurred.
   - **Evidence Attachment (Optional):** Attach a screenshot or visual proof if applicable.
3. Click **Submit Bug Report to Judges**.
4. Your submission will appear under **Your Recorded Submissions** on the right side of the portal.
5. You can click **Export Submissions (JSON)** at any time to download a local backup of all reports logged by your team.

---

## ⚖️ Competition Rules & Fair Play

- **Black-Box & Functional Investigation:** Discover flaws by interacting with the website, experimenting with edge cases, boundary values, unexpected inputs, and browser interactions.
- **Clear Reproduction Steps:** Points are awarded based on the accuracy and reproducibility of your reported steps. Vague or incomplete reports may receive partial or zero credit.
- **Unique Bug Submissions:** Each unique bug is only scored once per team. Submitting duplicate reports for the same issue will not grant additional points.
- **Fair Play:** Do not tamper with or disable competitor workstations. Keep your workstation focused on discovering and reporting flaws.

---

**Best of luck to all competing teams! May the best debuggers win! 🏆**