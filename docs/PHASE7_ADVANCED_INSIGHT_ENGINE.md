# LeoFamily Numerology — Phase 7 Advanced Insight Engine

## 1. Objective & Strategic Vision
Phase 7 establishes the **Advanced Insight & Reasoning Engine** built on the Phase 6 Methodology Governance Layer. It turns isolated mathematical calculations into an explainable, personalized consultation dossier:

$$\text{User Data} \longrightarrow \text{Calculated Facts} \longrightarrow \text{Methodology Rules} \longrightarrow \text{Insight Validation} \longrightarrow \text{Scoring \& Ranking} \longrightarrow \text{Contextual Dossier \& 90-Day Action Plan}$$

---

## 2. Architecture & Insight Pipeline
```
USER MASTER PROFILE
       ↓
CALCULATION ENGINE (Mulank, Bhagyank, Kua, Lo Shu, Mobile, Name, Personal Year)
       ↓
CANDIDATE GENERATION ENGINE (Core, Repeating, Karmic, Career, Mobile, Vastu, Timing)
       ↓
METHODOLOGY RULE VALIDATION (Methodology Registry & Source Registry)
       ↓
ANTI-HALLUCINATION & DETERMINISM FILTER (Blocks fatalistic or unsubstantiated claims)
       ↓
INSIGHT DEDUPLICATION & CLUSTERING (Primary Signal + Contributing Factors)
       ↓
PRIORITIZATION & SCORING (Tier 1 Primary, Tier 2 Supporting, Tier 3 Reference)
       ↓
EXECUTIVE SUMMARY NARRATIVE & CONTEXTUAL CHAPTER INTELLIGENCE
       ↓
90-DAY PRIORITIZED ACTION PLAN (Days 1–7, 1–30, 31–60, 61–90)
```

---

## 3. Normalized Insight Object Schema
Defined in `src/core/advancedInsightEngine.ts`:
- **ID & Classification**: `id`, `type` (`CORE_PATTERN`, `REPEATED_SIGNAL`, `LOSHU_PATTERN`, `MOBILE_PATTERN`, `CAREER_PATTERN`, `VASTU_PATTERN`, `RELATIONSHIP_PATTERN`, etc.), `priority` (`TIER_1_PRIMARY`, `TIER_2_SUPPORTING`, `TIER_3_REFERENCE`).
- **Internal Scoring**: `score` (computed from cross-layer recurrence, foundational impact, and data completeness).
- **Bilingual Content**: `title`, `summary`, `whyThisMatters`, `practicalFocus` (Hindi & English).
- **Calculated Inputs**: Explicit layers tagged with `[CALCULATED]`, `[INTERPRETED]`, and `[RECOMMENDED]`.
- **Complete Provenance**:
  - `calculationSource` (e.g., *Mulank & Bhagyank Planetary Friendship Matrix*)
  - `matchedRuleIds` (e.g., `RULE_MULANK_CALCULATION`, `RULE_COMBINATION_MATRIX_81`)
  - `sourceCitations` (e.g., `SOURCES.LEOFAMILY_CORE`, `SOURCES.LEOFAMILY_LOSHU_PDF`)
  - `knowledgeLevel` (`LEVEL_A`, `LEVEL_B`, `LEVEL_C`, `LEVEL_D`)
  - `methodologyVersion` (`v3.5`)
  - `deterministicCaution` (Boolean safety flag)

---

## 4. Candidate Generation & Rule Validation
Every candidate must strictly pass all 10 governance criteria:
1. Matched rule exists in `MethodologyRegistry`.
2. All required calculated inputs (DOB digits, Driver, Conductor, Mobile root, etc.) are present.
3. Rule is marked active.
4. Source document and authority level are cataloged.
5. Interpretation is aligned with LeoFamily canon.
6. Contextual application (Career, Vastu, Relationship) is approved.
7. Remedial actions are derived exclusively from registered missing numbers or planetary remedies.
8. No duplication with higher-priority signals.
9. Zero deterministic/fatalistic phrasing (e.g., no guarantees of sudden wealth or disease).
10. High consultation utility for the user.

---

## 5. Insight Prioritization & Tiering
- **Tier 1: Primary Insights (3 to 5)**: Displayed prominently in the Executive Summary and Consultant Snapshot.
  - Core Driver × Destiny Archetype Alignment
  - Dominant Repeating Vibrations across multiple analytical layers
  - Missing Number Karmic Balancing Lessons
  - Vocational Trajectory & Current Personal Year Timing
- **Tier 2: Supporting Insights**: Displayed inside relevant domain chapters (Mobile, Vastu/Kua, Interpersonal dynamics).
- **Tier 3: Reference Signals**: Preserved for reference without cluttering executive view.

---

## 6. Contextual Domain Intelligence
- **Career Intelligence**: Combines Bhagyank vocational rulership with active personal year cycles and action planes.
- **Finance Intelligence**: Distinguishes between numerological planetary indicators and speculative financial advice.
- **Relationship Intelligence**: Explores interpersonal dynamics, communication frequencies, and auspicious partnership dates without deterministic relationship predictions.
- **Mobile Intelligence**: 10-digit compound vibrations and 81-Pair adjacent combinations analyzed under zero-replacement rules.
- **Lo Shu & Numero Vastu Intelligence**: 3-layer enhanced natal grid, present/missing frequencies, and Kua directional alignments.
- **90-Day Action Prioritization**: Categorized into 4 actionable phases:
  - **Immediate (Days 1–7)**: Primary missing element & initial color/metal harmony.
  - **Month 1 (Days 1–30)**: Desk orientation (Kua) and daily habit integration.
  - **Month 2 (Days 31–60)**: Career milestones and investment review based on Personal Year.
  - **Month 3 (Days 61–90)**: Long-term harmonic stabilization.

---

## 7. Explainability & Provenance Modal
Users and consultants can click **"🔬 नियम विवरण"** on any key pattern to open the **LeoFamily Provenance & Rule Inspector**, revealing:
- Exact mathematical input variables.
- Matched governing rule IDs.
- Formal knowledge source citations with authority level (`LEVEL_A`, `LEVEL_B`, etc.).
- Methodological safety and anti-fatalistic disclaimers.

---

## 8. Test Profiles & Comparison Verification
Tested against diverse profiles:
- **Profile A (Unified Driver/Destiny 1/1)**: Correctly generates `INSIGHT_CORE_UNIFIED_FOCUS` and highlights singular leadership focus.
- **Profile B (Friendly Synergy 1/5)**: Correctly highlights `INSIGHT_CORE_FRIENDLY_SYNERGY` and multi-layer Mercury repetitions.
- **Profile C (Dynamic Tension 1/8)**: Correctly triggers `INSIGHT_CORE_DYNAMIC_TENSION` with diplomatic balance guidance.
- **Profile D (Missing 5, 6)**: Correctly prioritizes missing digit remedies in the 90-day action plan.

All calculations remain 100% deterministic and reproducible.
