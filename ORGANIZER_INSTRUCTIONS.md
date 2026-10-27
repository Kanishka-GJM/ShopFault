# CONFIDENTIAL ORGANIZER OPERATIONS MANUAL — SHOPFAULT STORE
## CSI Inter-College Debugging Championship

> [!IMPORTANT]
> **RESTRICTED DOCUMENT — EVENT ORGANIZERS & JUDGES ONLY**  
> Do not share, distribute, or project this document or its contents to participating teams.

---

## 1. Executive Summary & Event Architecture

- **Event:** CSI Inter-College Debugging Championship
- **Target Application:** ShopFault Store (E-Commerce Platform)
- **Competing Teams:** 45 Teams (4 members per team = 180 concurrent participants)
- **Duration:** Exactly 40 Minutes
- **Planted Flaws:** Exactly 15 reproducible functional bugs
- **Scoring Scale:** 76 Maximum Points
  - 4 Easy Bugs (2 Points each) = 8 Points
  - 5 Medium Bugs (4 Points each) = 20 Points
  - 6 Hard Bugs (8 Points each) = 48 Points
- **Architecture:** Zero-cost client-side React single-page application. All cart states, order histories, and submission logs are isolated in each client's browser storage (`localStorage`), ensuring zero cross-contamination between teams.

---

## 2. Accessing the Organizer Command Center

1. Open the competition website in any browser (e.g. `http://localhost:5173/` or your network IP).
2. Scroll to the bottom of the page to the **Footer**.
3. Under the **Event Operations** section, click the **Organizer Portal** button with the lock icon.
4. Enter either of the authorized organizer passcodes:
   - Passcode A: `shopfault-admin-76`
   - Passcode B: `organizer2026`
5. Click **Verify Passcode**.
6. The full-screen **Event Operations & Scoring Command Center** will open.

> [!NOTE]
> If a participant or unauthorized person attempts to enter an incorrect passcode, the portal strictly displays `"Invalid passcode. Access denied."` and will **never** reveal or hint at the valid passcode.

---

## 3. Controlling the 40-Minute Competition Timer

The Organizer Command Center includes a synchronized competition clock that controls store access across all 45 participant workstations via browser storage events.

| State | Status Chip | What Participants Experience | Organizer Controls Available |
|---|---|---|---|
| **Standby** | `Standby (Access Locked)` | Participants see a briefing screen explaining rules. The store catalog is locked to prevent early inspection. | Click **Start Competition (Unlock Store)** |
| **Live Sprint** | `Live (Store Unlocked)` | Store catalog and features unlock automatically across all screens. Sticky header banner counts down from `40:00`. | Click **Pause Timer** or **Stop / End Event** |
| **Paused** | `Timer Paused` | Sticky banner indicates timer is frozen. Use if an event-wide announcement or emergency pause is required. | Click **Resume Sprint** or **Stop / End Event** |
| **Concluded** | `Concluded (Submissions Closed)` | Timer reaches `00:00` or Stop is clicked. Bug submission portal disables inputs and rejects further entries. | Click **Reset (40m)** to restart |

### Step-by-Step Competition Execution:
1. **T-Minus 15 Minutes:** Have all 45 teams navigate to the shared competition URL. Verify that their screens show the **Standby Waiting Screen** ("Competition Has Not Started Yet").
2. **T-Minus 0 Minutes:** From the Organizer Command Center, click **Start Competition (Unlock Store)**.
   - All participant workstations immediately unlock the store catalog.
   - The synchronized 40-minute countdown clock begins.
3. **During the Sprint:**
   - Keep the **Real-Time Leaderboard** tab open on the organizer screen or projector.
   - Monitor incoming discoveries in the **Participant Reports & Auto-Evaluation** tab.
4. **Conclusion:**
   - When the clock reaches `00:00` (or if you click **Stop / End Event**), the competition concludes.
   - Participant submission forms are automatically locked.
   - Click **Download Results (CSV)** to save the official final standings.

---

## 4. Real-Time Leaderboard Tab

The Leaderboard automatically aggregates and ranks all teams as discoveries are submitted:

- **Ranking Hierarchy:**
  1. Primary: **Total Verified Points** (highest score first)
  2. Secondary: **Number of Unique Bugs Solved** (most bugs first)
- **Top 3 Podium Indicators:**
  - Rank 1: 🥇 Gold Badge
  - Rank 2: 🥈 Silver Badge
  - Rank 3: 🥉 Bronze Badge
- **Anti-Cheat Deduplication:**
  - If a team submits multiple reports for the same bug (e.g. submitting BUG-E01 three times), the system **only awards points once** for that unique bug ID.
- **Solved Bug ID Tags:**
  - Visual badges (e.g. `[BUG-E01]`, `[BUG-M03]`, `[BUG-H01]`) show exactly which bugs each team has successfully unlocked.

---

## 5. Participant Reports & Auto-Evaluation Tab

Every submission made by a team is instantly processed by the built-in **Auto-Evaluation Engine**.

### How Auto-Evaluation Works:
- The engine scans the participant's **Bug Title**, **Module**, **Steps to Reproduce**, and **Observed Behavior** for distinctive technical keywords corresponding to the 15 planted bugs.
- **Evaluation Statuses:**
  - `Verified` (*High Match* / *Moderate Match*): Keyword threshold satisfied. Points (2, 4, or 8 pts) are automatically assigned, and the team's score updates on the leaderboard.
  - `Needs Review`: The submission did not cleanly match any planted bug pattern. Organizers can read the reproduction steps and manually assign points.
  - `Rejected`: Invalid submission or incorrect finding. 0 points credited.

### Organizer Actions:
- **Search Bar:** Type any Team ID (e.g. `Team 12`), bug name, or keyword to instantly filter reports.
- **Module Dropdown:** Filter submissions by specific application areas (*Catalog*, *Search*, *Cart*, *Coupons*, *Checkout*, *Order Confirmation*, *Order History*, *Navbar*).
- **Evaluation Status Filter:** Filter by *Verified*, *Needs Review*, or *Rejected*.
- **Points Override:** Adjust the points awarded in the inline number box (0 to 8 pts).
- **One-Click Action Buttons:**
  - Click **Verify** (Green Checkmark) to accept a submission and add its score to the team.
  - Click **Reject** (Red Cross) to decline an inaccurate submission.

---

## 6. Downloading Results & Audit Logs

At the top-right of the Organizer Command Center, two export options are available:

1. **Download Results (CSV)**:
   - Downloads `ShopFault_Final_Leaderboard_<timestamp>.csv`.
   - Columns: `Rank`, `Team ID`, `Total Points`, `Bugs Solved Count`, `Solved Bug IDs`, `Total Submissions`, `Last Activity`.
   - Ready for instant import into Microsoft Excel, Google Sheets, or stage presentation graphics.
2. **Export Audit Log (JSON)**:
   - Downloads `ShopFault_Competition_Audit_<timestamp>.json`.
   - Contains a complete chronological audit trail including raw participant reproduction steps, timestamps, auto-evaluator confidence levels, and judge actions for dispute resolution.

---

## 7. Master Bug Reference & Scoring Matrix

| Bug ID | Difficulty | Points | Target Feature | Quick Summary |
|---|---|---|---|---|
| **BUG-E01** | Easy | 2 pts | Search Bar | Clicking "Search" button with mouse fails to filter catalog |
| **BUG-E02** | Easy | 2 pts | Product Catalog | Product #4 (AeroGlide Mouse) displays broken 404 image placeholder |
| **BUG-E03** | Easy | 2 pts | Navbar Badge | Cart badge remains "0" after adding item until page reload |
| **BUG-E04** | Easy | 2 pts | Checkout Form | Blank email address is accepted during checkout without validation |
| **BUG-M01** | Medium | 4 pts | Category Filter | Selecting "Accessories" category omits Product #8 (Leather Sleeve) |
| **BUG-M02** | Medium | 4 pts | Shopping Cart | Increasing quantity with "+" displays old stale line subtotal |
| **BUG-M03** | Medium | 4 pts | Shopping Cart | Removing an item from cart retains its price in the Order Summary total |
| **BUG-M04** | Medium | 4 pts | Checkout Form | Incomplete email like `student@` passes checkout validation |
| **BUG-M05** | Medium | 4 pts | Catalog Sorting | "Price: Low to High" sorts lexicographically (₹1,299 before ₹499) |
| **BUG-H01** | Hard | 8 pts | Coupon Discounts | Repeatedly clicking "Apply" on coupon `SAVE15` stacks discount (30%, 45%) |
| **BUG-H02** | Hard | 8 pts | Order Confirmation | Refreshing confirmation screen generates a duplicate order in history |
| **BUG-H03** | Hard | 8 pts | Checkout Form | Cart total and Checkout total differ due to pre-discount tax calculation |
| **BUG-H04** | Hard | 8 pts | Order Confirmation | Browser Back/Forward navigation loads stale mock draft data |
| **BUG-H05** | Hard | 8 pts | Shopping Cart | Rapid double-clicking "Add to Cart" creates duplicate line items |
| **BUG-H06** | Hard | 8 pts | Shopping Cart | Entering `0` or `-1` quantity corrupts calculations and reduces total |

> [!TIP]
> For the complete technical breakdown, line-by-line source code locations, and exact post-competition fixes, consult [ORGANIZER_ANSWER_KEY.md](file:///c:/Users/Kanishka%20J/OneDrive/Desktop/The%20veritas%20Society/CSI/intercollege%20event/shopfault/ORGANIZER_ANSWER_KEY.md).

---

## 8. Deployment Quick Reference for Organizers

### Option A: Campus Wi-Fi / College Computer Lab (LAN - $0 Cost)
1. Run on host laptop connected to the lab Wi-Fi/switch:
   ```bash
   cd shopfault
   npm run dev -- --host 0.0.0.0 --port 5173
   ```
2. Find the host machine's Local IPv4 address:
   - Windows: `ipconfig` (e.g. `10.94.148.120` or `192.168.1.50`)
3. Share the URL with all 45 teams:
   ```
   http://<HOST_IP>:5173/
   ```

### Option B: Cloud Hosting (Vercel / Netlify)
1. Build production bundle: `npm run build`
2. Deploy `dist/` folder to Vercel or Netlify.
3. Share the generated HTTPS URL with participants.

---

## 9. Pre-Event Sanity Checklist

Complete these checks 30 minutes before the competition begins:
- [ ] Website loads cleanly without JavaScript errors in developer console.
- [ ] Footer PIN modal opens and accepts `shopfault-admin-76`.
- [ ] Participant view shows the Standby screen before timer is initiated.
- [ ] Clicking "Start Competition" unlocks the catalog and starts the 40:00 countdown.
- [ ] Test submission from participant portal appears in organizer reports tab.
- [ ] Auto-evaluator correctly matches keyword findings and assigns score to leaderboard.
- [ ] "Download Results (CSV)" exports a valid `.csv` file.
