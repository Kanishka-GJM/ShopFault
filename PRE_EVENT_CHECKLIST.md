# ShopFault Store — Pre-Event Testing & Operations Checklist
## For Event Organizers and Judges

Complete this checklist **30 to 45 minutes prior** to releasing the competition link to participants.

---

### Phase 1: Infrastructure & Network Readiness

- [ ] **Host Machine Power & Network:** Host laptop/server is connected to reliable power and campus network / Wi-Fi.
- [ ] **Firewall & Inbound Connections:** Port `5173` (or target web port) allows incoming connections on the local network.
- [ ] **Multi-Device Test:** Open the website URL from a separate smartphone or student laptop connected to the same Wi-Fi (`http://<HOST_IP>:5173`).
- [ ] **Load Test Simulation:** Verify that 3–5 simultaneous browser tabs can navigate without slowdown or frozen threads.
- [ ] **Browser Compatibility:** Test website in Google Chrome, Mozilla Firefox, Microsoft Edge, and Safari (desktop & mobile viewports).

---

### Phase 2: Session & State Isolation Verification

- [ ] **Cart State Isolation:**
  - Open Browser A (normal window) and add SoundWave Pro Earbuds to cart.
  - Open Browser B (incognito window or separate computer).
  - Verify Browser B's cart starts completely empty (`0 items`).
- [ ] **Order Isolation:**
  - Place a demonstration order in Browser A.
  - Verify Browser B's Order History does **NOT** contain Browser A's order.
- [ ] **Local Storage Resets:**
  - Test clicking "Clear Cart" and "Clear History" to verify clean session resets.

---

### Phase 3: Security & Answer Key Privacy

- [ ] **Private Key Files Guarded:** Verify `ORGANIZER_ANSWER_KEY.md` and `BUG_VERIFICATION_CHECKLIST.md` are stored in a restricted organizer directory and not accessible over the public web root.
- [ ] **Organizer PIN Protection Active:**
  - Click the **Organizer Portal** lock button in the website footer.
  - Attempt to enter an incorrect passcode (e.g. `1234`) -> verify error message displays.
  - Enter official passcode (`shopfault-admin-76` or `organizer2026`) -> verify Answer Key and Grading Portal unlock.
- [ ] **No Public Answers in DOM:** Inspect participant-facing views in DevTools Elements tab to confirm no bug IDs or hints are visible.

---

### Phase 4: Participant Submission Portal Verification

- [ ] **Form Submission:** Navigate to the **Bug Submission Portal** in the navigation bar.
- [ ] **Test Report Submission:**
  - Enter Team ID: `TestTeam01`.
  - Enter Bug Title: `Test Verification`.
  - Enter Steps to Reproduce: `1. Click button. 2. Observe.`.
  - Click **Submit Bug Report to Competition Judges**.
- [ ] **Confirmation Banner:** Verify success banner displays with generated Report ID (e.g. `BUG-SUB-XXXXX`) and timestamp.
- [ ] **Local Queue Verification:** Confirm report appears in "Your Recorded Submissions" card on the right.
- [ ] **JSON Export Test:** Click **Export Reports (JSON)** and confirm the browser downloads a valid `.json` file containing all submitted data.
- [ ] **Reset Test Submissions:** Clear test submissions before giving the URL to teams.

---

### Phase 5: Event Timeline & Briefing

- [ ] **Competition Countdown:** Ensure visible 40-minute timer or projector display is prepared.
- [ ] **Instructions Handout:** Provide teams with the single URL and emphasize:
  - *"Investigate the store as authentic shoppers would."*
  - *"Record precise reproduction steps for every functional flaw you uncover."*
  - *"Submissions with reproducible steps receive full points."*
- [ ] **URL Release:** Distribute website link at exactly T-00:00.
