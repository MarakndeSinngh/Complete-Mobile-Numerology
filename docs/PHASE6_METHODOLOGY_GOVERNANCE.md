# LeoFamily Numerology — Phase 6 Methodology Governance & Rule Registry

## 1. Executive Summary
Phase 6 establishes the **Methodology Governance Layer** for the LeoFamily Numerology platform. It provides a formal, non-contradictory mathematical and interpretative foundation underpinning the entire 32-chapter Master Dossier, ensuring that:
$$\text{One Calculation} \longrightarrow \text{One Registered Methodology Rule} \longrightarrow \text{Consistent Interpretation} \longrightarrow \text{Valid Cross-Pattern Analysis} \longrightarrow \text{Traceable Recommendation}$$

---

## 2. Source Registry & Hierarchy of Authority
All numerology principles within the platform are classified into strict epistemic levels:

| Level | Authority Category | Description & Source Documents |
| :--- | :--- | :--- |
| **LEVEL A** | **LeoFamily Official Master Standard** | Canonical formulas, deterministic Mulank, Bhagyank, and 3-Layer Enhanced Lo Shu Grid definitions. |
| **LEVEL B** | **LeoFamily / Raajeev Singh Chauhann PDFs** | `Loshu Grdi(1).pdf`, Mobile Numerology Days 1–4, Medical Numerology Days 1–2, Numero Vastu references. |
| **LEVEL C** | **Indian Classical Vedic Astro-Numerology** | Graha rulerships (1–9), Ayurvedic Tridosha (Pitta, Kapha, Vata), Vedic 3x3 Grid, and Birthday Anniversary Mahadasha cycles. |
| **LEVEL D** | **External / Western Systems** | Chaldean sound vibrations & compound symbolism (10–52), Western Pythagorean 1–9 alphabet tables. |

---

## 3. Centralized Methodology Registry Architecture
Located in `src/core/methodology/methodologyRegistry.ts`:
- **Rule Attributes**: `id`, `category`, `ruleName`, `system`, `source`, `description`, `interpretation`, `confidence`, `safetyLevel`, `details`.
- **Domain Modules**:
  - `planetMappings.ts`: 1–9 Graha planetary assignments, friendly/neutral/enemy numbers.
  - `numberMeanings.ts`: Core vibrations, traits, leadership, and emotional dynamics.
  - `loshuDefinitions.ts`: Standard 3x3 Lo Shu sectors, elements, directions.
  - `planeDefinitions.ts`: 8 Planes of Destiny (Mental, Emotional, Practical, Thought, Will, Action, Raj Yoga Golden, Silver).
  - `arrowDefinitions.ts`: 12 Arrows of Strength & Weakness.
  - `combinationDefinitions.ts` & `combinationMatrixData.ts`: 81 Mulank × Bhagyank Driver-Conductor matrix profiles.
  - `mobileDefinitions.ts`: 10-Digit compound sums, Zero replacement rule, 2-digit adjacent pair matrix (81 pairs), special purpose combinations.
  - `vastuDefinitions.ts`: 8 cardinal directions, elemental balance, residential & commercial numerology.
  - `dashaDefinitions.ts`: Mulank-based Vedic Mahadasha progression, Day Lord mapping, Antardasha cycles.
  - `wellnessDefinitions.ts` & `medicalDefinitions.ts`: Ayurvedic Tridosha balance, organ susceptibilities, dietary guidelines.

---

## 4. 32-Chapter Governance Mapping Matrix
Located in `src/core/methodology/chapterRuleMap.ts`, every single chapter (01 to 32) is mapped to:
1. **Primary Pillar**: `CORE`, `CAREER`, `RELATIONSHIPS`, `VASTU`, or `ACTION`.
2. **Calculated Inputs**: Explicit mathematical inputs required from DOB/Name/Mobile/Gender.
3. **Governing Rule IDs**: Traceable IDs registered in the methodology database.
4. **Source Citations**: Formal citations with author, document name, and knowledge level.
5. **Interpretation Level**:
   - `CALCULATED`: Pure deterministic calculations (e.g., Mulank = 7, Bhagyank = 9).
   - `INTERPRETED`: Deep synthesis of multiple interacting numbers.
   - `RECOMMENDED`: Actionable remedies, gemstone suggestions, and behavioral adjustments.
6. **Deterministic Caution Flag**: Protects against fatalistic predictions and ensures positive, empowering counsel.

---

## 5. Provenance & Conflict Resolution
- **Anti-Contradiction Engine**: If an individual possesses strong 1 (Sun) energy with missing 2 (Water/Moon), the report synthesizes this as dynamic executive leadership requiring conscious empathy cultivation, rather than contradictory descriptions in different chapters.
- **Remedy Provenance**: Every recommendation (mantra, color therapy, crystal, charitable giving) is anchored to specific missing grid elements or afflicted planets.
- **Ethical Safeguards**: Medical numerology strictly operates under the Ayurvedic wellness disclaimer; predictions are framed as temporal planetary cycles rather than inevitable destiny.
