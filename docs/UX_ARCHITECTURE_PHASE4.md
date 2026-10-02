# LeoFamily Numerology — Phase 4 UX Architecture & Systems Blueprint

## 1. Executive Product Strategy Context
**Product Name:** LeoFamily Numerology / Indian Astro-Numerology & Mobile Analysis Platform  
**Core Positioning:** *"A guided, personalized Indian numerology analysis and expert consultation dossier platform."*  
**Architecture Model:** Two-Layer Progressive Value Engine
- **Layer 1 — Free Value:** Instant Free Analysis (Mulank/Driver, Bhagyank/Destiny, Kua Direction, Personal Year, Mobile Root Vibration) + 100% Free Public Calculators (Mobile Numerology Scanner & 3x3 Lo Shu Grid).
- **Layer 2 — Premium Depth (₹33):** 32-Chapter Master Numerology Consultation Dossier (Career & Finance, Relationships, Mobile 81-Pair Matrix, Numero Vastu, Vedic Mahadasha, Remedies, 90-Day Action Plan & Printable A4 PDF).

---

## 2. User Needs & Personas
| Persona | Primary Goal | Key Challenge | LeoFamily Solution |
| :--- | :--- | :--- | :--- |
| **P1: Daily Seeker** | Understand personality, lucky numbers, and daily/yearly forecast. | Confused by technical astrological jargon and generic automated calculators. | Human-friendly progressive disclosure, clear explanations for every number. |
| **P2: Career & Business Seeker** | Career alignment, business/brand name vibration, promotion timing. | Unsure whether to pursue jobs, business, or partnerships. | 81 Planetary Yogas, Career Blueprint, Business & Firm Name Numerology. |
| **P3: Marriage & Family Seeker** | Matchmaking compatibility, child naming, residential vastu. | Emotional friction, conflicting dates/names. | Synastry compatibility score, child auspicious initials, 8-directional Kua alignment. |
| **P4: Mobile Number Optimizer** | Test mobile number harmony and financial vibrations. | Random numbers causing hidden obstacles or negative pairs. | 81-Pair Deep Matrix analysis across all 9 phone number pairs. |

---

## 3. End-to-End Primary User Journey
```
[VISITOR]
   │
   ▼
[HOME PAGE] ── (Hero: "What can LeoFamily help me understand?")
   │
   ├── Primary CTA: [FREE ANALYSIS शुरू करें] ──▶ Smooth scroll to calculator
   └── Secondary CTA: [FREE TOOLS देखें] ────▶ Jump to 100% Free Tools
   │
   ▼
[GUIDED FREE CALCULATOR]
   ├── Step 1: Full Name (Chaldean & Pythagorean base)
   ├── Step 2: Date of Birth (DD/MM/YYYY)
   ├── Step 3: 10-Digit Mobile Number
   └── Step 4: Gender (For Kua directional calculation)
   │
   ▼
[PERSONALIZED FREE RESULT]
   ├── Level 1: Core Numbers Snapshot (Mulank, Bhagyank, Kua, Personal Year, Mobile Root)
   ├── Level 2: What These Numbers Indicate (Planetary Lords & Core Nature)
   ├── Level 3: Interactive 3x3 Lo Shu Birth Grid Preview
   └── Level 4: Master Report Value Showcase (Pillars 01–32)
   │
   ▼
[PRIMARY ACTION: "See What Your Complete Profile Reveals →"]
   │
   ▼
[REPORT PAYWALL MODAL — ₹33]
   ├── Primary Flow: UPI QR Code (`upi://pay`) + UTR Reference Submission
   ├── Instant Secondary Flow: Razorpay NetBanking/Card Checkout
   └── Authoritative Server Verification: Status set to `PENDING`
   │
   ▼
[MY REPORTS USER DASHBOARD]
   ├── Pending Status ⏳: "Payment submit होने के बाद report verification complete होने तक locked रहेगा"
   ├── Rejected Status ❌: Rejection note + [Resubmit Valid UTR]
   └── Verified Status ✓: [Open Report] + [Download PDF]
   │
   ▼
[MASTER REPORT CONSULTATION DOSSIER (32 Chapters)]
   ├── Cover Page & Executive Summary
   ├── 01–09: Core Foundation & Lo Shu Matrices
   ├── 10–15: Career & Financial Blueprint
   ├── 16–21: Relationships, Personal & Mobile 81-Pair Matrix
   ├── 22–28: Numero Vastu, Kua & Mahadasha Cycles
   ├── 29–32: Remedies, 90-Day Action Plan & Final Synthesis
   └── High-Resolution Printable A4 PDF
```

---

## 4. Complete 12-State Payment & Entitlement Matrix
| State ID | User State | Interface Display | Permitted Actions |
| :--- | :--- | :--- | :--- |
| **S1** | Payment Not Started | Master Report preview with ₹33 unlock button. | Click Unlock, open Paywall modal. |
| **S2** | Payment Instructions Shown | Dynamic UPI QR Code, Copy UPI ID, Copy ₹33. | Scan QR, copy details, pay via UPI app. |
| **S3** | UTR Entered | Live 12-digit format validation with green check. | Edit or submit UTR. |
| **S4** | UTR Submitted | Loading spinner with server submission in progress. | None (awaiting server response). |
| **S5** | Verification Pending ⏳ | "Payment Verification Pending" banner with UTR & timestamp. | [Check Status], view pending queue. |
| **S6** | Payment Verified ✓ | "Report Unlocked" badge, full 32 chapters accessible. | [Open Report], [Download PDF]. |
| **S7** | Payment Rejected ❌ | "Verification Required" banner with admin note. | [Resubmit Valid UTR]. |
| **S8** | Resubmission | Pre-filled modal allowing user to re-enter valid UTR. | Enter corrected 12-digit UTR. |
| **S9** | Already Purchased | Instant redirection to unlocked Master Report. | Access report immediately. |
| **S10** | Network/API Failure | Human-friendly retry prompt with offline recovery. | [Retry Connection]. |
| **S11** | Duplicate UTR | Alert: "This UTR is already under review or processed." | Contact support / enter unique UTR. |
| **S12** | Logged-Out User | Contextual prompt: "Sign in with Google/WhatsApp to save." | 1-Click login or continue as guest. |

---

## 5. Master Report 32-Chapter Information Architecture
The 32 chapters are grouped into **5 Cohesive Pillars**:

### Pillar 1: Core Foundation & Lo Shu (Chapters 01–09)
- `01`: Executive Summary & Profile Snapshot
- `02`: Mulank & Bhagyank Synthesis (Driver & Conductor Dynamics)
- `03`: 3x3 Natal Lo Shu Birth Grid
- `04`: Enhanced 3-Layer Lo Shu Matrix
- `05`: Active Number Frequencies & Talents
- `06`: Missing Numbers & Karmic Lessons
- `07`: Number Repetition & Over-Energy Diagnosis
- `08`: 8 Success & Balance Planes (Mental, Emotional, Practical, Will, Action, Prosperity)
- `09`: Arrows of Pythagoras & Strength Analysis

### Pillar 2: Career & Financial Blueprint (Chapters 10–15)
- `10`: 81 Vedic Planetary Yogas
- `11`: Primary Archetype & Karmic Blueprint
- `12`: Life Destiny & Soul Urge Coordinates
- `13`: Psychological & Decision-Making Dynamics
- `14`: Career Aptitude, Business & Professional Alignment
- `15`: Wealth, Financial Abundance & Risk Management

### Pillar 3: Relationships & Personal Vibrations (Chapters 16–21)
- `16`: Love, Marriage & Relationship Compatibility
- `17`: Social Image, Magnetism & Leadership Style
- `18`: Mobile 10-Digit 81-Pair Deep Matrix Analysis
- `19`: Chaldean Compound Name Frequency & Balance
- `20`: Pythagorean Expression & Heart's Desire
- `21`: Name Spell Correction & Acoustic Harmony

### Pillar 4: Occult, Vastu & Time Cycles (Chapters 22–28)
- `22`: Numero Vastu & 8-Directional Energy Alignment
- `23`: Kua Number & 8 Mansions Compass Harmony (Sheng Chi, Tian Yi, Yan Nian, Fu Wei)
- `24`: Residential & Workplace Spatial Energy Guidelines
- `25`: Personal Year Vibration & 3-Year Cyclic Forecast
- `26`: Vedic Mahadasha & Antardasha Time Periods
- `27`: Planetary Transits & Auspicious Timing (Muhurta)
- `28`: Traditional Ayurvedic Wellness & Tridosha Harmony

### Pillar 5: Action Plan, Remedies & Synthesis (Chapters 29–32)
- `29`: LeoFamily Signature Energy Audit Pro
- `30`: Multi-Vehicle, Property, Business & Synastry Extensions
- `31`: Consolidated Traditional Vedic, Yantra, Mantra & Gemstone Remedies
- `32`: 90-Day Step-by-Step Strategic Roadmap & Final Executive Synthesis

---

## 6. 90-Day Strategic Roadmap Execution Structure
| Timeframe | Phase Name | Focus Areas | Actionable Numerological Guidance |
| :--- | :--- | :--- | :--- |
| **Days 1–7** | *Immediate Priorities* | Quick Wins | Adjust signature 15° upward, position desk facing Sheng Chi direction, set sunrise wallpaper. |
| **Days 1–30** | *Phase 1: Foundation* | Space & Self | Purify North-East corner with water vessel, wear primary lucky color 60% of the time, daily 108 mantra repetition. |
| **Days 31–60** | *Phase 2: Remediation* | Relationships & Career | Align partnership dates with friendly numbers, install copper/brass yantra in workplace, Wednesday/Thursday charity. |
| **Days 61–90** | *Phase 3: Manifestation* | Review & Velocity | Audit financial and career improvements, finalize long-term investments in Personal Year cycle, consolidate 1-year goals. |

---

## 7. Accessibility (WCAG 2.1 AA) & Design System Standards
1. **Color Contrast:** All text meets or exceeds 4.5:1 for normal text and 3:1 for large text.
2. **Semantic Landmarks:** `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` tags with `aria-label` where applicable.
3. **Keyboard Navigation:** Full tab stops across inputs, buttons, modal triggers, and chapter jump links with visible focus rings (`ring-2 ring-amber-500`).
4. **Touch Targets:** Minimum 44px x 44px tap targets on all mobile interactive elements.
5. **No Color-Only Signaling:** Statuses use Icon + Label + Badge (e.g. `⏳ Pending Verification`, `✓ Verified`, `❌ Verification Required`).
6. **Screen Reader Support:** Accessible labels (`aria-label`, `sr-only` helpers) for icon buttons, dropdowns, and modal dialogs.
7. **Reduced Motion:** Respects `prefers-reduced-motion: reduce` for all animated transitions.

---

## 8. Mobile Viewport Quality Assurance Matrix
- **360px Viewport:** Zero horizontal scroll. 1-column responsive cards, wrapped pill navigation, touch-friendly QR copy buttons.
- **390px / 412px Viewports:** Optimized font scaling (`text-xs` to `text-sm`), full-width CTA buttons with minimum 48px height.
- **768px (Tablet):** 2-column grid for Lo Shu planes and 32-chapter preview cards.
- **1024px+ (Desktop):** 3-4 column grid, sticky floating navigation, full multi-page PDF export.

---

## 9. QA Checklist & Verification Matrix
- [x] Mulank & Bhagyank calculations 100% verified against classical Vedic texts.
- [x] Kua number calculation accurately computed for male, female, and other profiles.
- [x] 3x3 Lo Shu birth grid, missing numbers, and active repetition frequencies preserved.
- [x] UPI QR code generates valid `upi://pay` URI with ₹33 presetDakshina.
- [x] UTR 12-digit validation and real-time feedback functional.
- [x] Authoritative server DB table `upi_submissions` active with Admin review endpoints.
- [x] Admin Panel UPI Console verifies payments with 1-click Approve or Reject (with note).
- [x] My Reports Hub displays real-time Pending, Rejected, and Verified status cards.
- [x] Master Report 32 chapters categorized into 5 accessible pillars.
- [x] 90-Day Action Plan broken into 4 clear chronological roadmap phases.
- [x] Print dialog and high-resolution multi-page PDF generation verified.
- [x] TypeScript compiler (`npx tsc --noEmit`) passes with 0 errors.
- [x] Vite production build (`npm run build`) succeeds cleanly.
