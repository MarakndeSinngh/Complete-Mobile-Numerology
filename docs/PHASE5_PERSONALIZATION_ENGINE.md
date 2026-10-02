# LeoFamily Phase 5 — Intelligent Master Dossier & Personalization Engine

## 1. Executive Overview
Phase 5 elevates the **LeoFamily 32-Chapter Master Consultation Dossier** from a multi-chapter report to a personalized, cross-analyzed consultation dossier.

### Central Principle
> *"The report is strictly computed and synthesized for THIS SPECIFIC INDIVIDUAL using their actual calculated numbers, cross-layer correlations, and methodology transparency."*

---

## 2. 3-Tier Content & Methodology Transparency Architecture

| Tier | Category | Label Badge | Definition & Standard |
| :--- | :--- | :--- | :--- |
| **Tier 1** | **CALCULATED** | `[CALCULATED] प्रत्यक्ष गणितीय तथ्य` | Mathematical fact derived directly from Birth Date, Name, and Mobile number. (e.g. Mulank 5, Bhagyank 7, Kua 2, Personal Year 9). |
| **Tier 2** | **INTERPRETED** | `[INTERPRETED] वैदिक व चाल्डियन पद्धति` | Astrological & numerological synthesis based on classical Vedic and Chaldean rules. |
| **Tier 3** | **RECOMMENDED** | `[RECOMMENDED] व्यवहारिक मार्गदर्शन` | Actionable, safe, and methodology-based lifestyle, gemstone, direction, and routine suggestions. |

---

## 3. Cross-Pattern Analysis Engine (`src/core/crossPatternEngine.ts`)

The system evaluates the relationships among all 8 independent analytical dimensions:
1. **Core Identity Pattern**: Evaluates the classical friendship/enmity between Mulank (Driver) and Bhagyank (Destiny) (e.g. Friendly synergy, concentrated focus, dynamic tension, or neutral growth).
2. **Strongest Repeating Frequency**: Scans Driver, Destiny, Kua, Personal Year, Mobile Root, Chaldean Name Root, and Lo Shu grid repetitions to highlight the user's primary planetary driver.
3. **Crucial Balance Area**: Identifies missing Lo Shu digits and karmic lessons that require conscious habit/elemental remediation.
4. **Career & Financial Trajectory**: Synthesizes Destiny number with the active Personal Year cycle to provide precise professional timing.
5. **Relationships & Social Resonance**: Evaluates the Driver expression alongside Mobile root vibration for interpersonal magnetism.

---

## 4. Chapter Structure & Anti-Repetition Standards
To prevent generic repetitive content:
- **No Verbatim Duplication**: If Chapter 2 explains Driver #5 in depth, subsequent chapters (such as Chapter 11 on Career or Chapter 16 on Relationships) reference Chapter 2 via clickable jump links (`onClick={() => scrollToSection('sec-02')}`) rather than repeating the definition.
- **Why This Matters**: Each core cross-pattern finding features a dedicated `💡 Why This Matters` contextual card.
- **Non-Deterministic Consultative Language**: Avoids hyperbolic promises (*"You will become rich"* or *"Marriage will fail"*); employs respectful, consultative phrasing (*"Within this numerology framework, this pattern is supportive of..."*).

---

## 5. Verification Matrix
- [x] All classical numerology calculation engines preserved as the source of truth.
- [x] Dedicated Cross-Pattern Engine (`src/core/crossPatternEngine.ts`) operational.
- [x] Executive Summary updated with the 5 Key Patterns and Methodology Transparency Bar.
- [x] Cross-chapter navigation links active.
- [x] TypeScript validation (`npx tsc --noEmit`) passes with 0 errors.
- [x] Vite production build (`npm run build`) passes cleanly.
