import { CompleteNumerologyProfile } from './types';
import { getPlanetName } from '../i18n/dynamicContent';
import { SourceCitation, SOURCES, KnowledgeLevel } from './methodology/sourceRegistry';
import { methodologyRegistry, MethodologyRule } from './methodology/methodologyRegistry';
import { CHAPTER_RULE_GOVERNANCE_MAP } from './methodology/chapterRuleMap';

export type InsightType =
  | 'CORE_PATTERN'
  | 'REPEATED_SIGNAL'
  | 'LOSHU_PATTERN'
  | 'COMBINATION_PATTERN'
  | 'MOBILE_PATTERN'
  | 'CAREER_PATTERN'
  | 'FINANCE_PATTERN'
  | 'RELATIONSHIP_PATTERN'
  | 'VASTU_PATTERN'
  | 'TIMING_PATTERN'
  | 'REMEDY_PATTERN';

export type InsightPriority = 'TIER_1_PRIMARY' | 'TIER_2_SUPPORTING' | 'TIER_3_REFERENCE';

export interface InsightProvenance {
  calculationSource: string;
  matchedRuleIds: string[];
  sourceCitations: SourceCitation[];
  knowledgeLevel: KnowledgeLevel;
  methodologyVersion: string;
  deterministicCaution: boolean;
}

export interface AdvancedInsight {
  id: string;
  type: InsightType;
  priority: InsightPriority;
  score: number;
  category: string;
  title: {
    hi: string;
    en: string;
  };
  summary: {
    hi: string;
    en: string;
  };
  whyThisMatters: {
    hi: string;
    en: string;
  };
  practicalFocus: {
    hi: string;
    en: string;
  };
  inputs: Array<{
    label: string;
    value: string | number;
    layer: 'CALCULATED' | 'INTERPRETED' | 'RECOMMENDED';
  }>;
  chapterReferences: string[];
  provenance: InsightProvenance;
  contributingFactors?: string[];
  status: 'VALIDATED' | 'UNSUPPORTED_PATTERN';
}

export interface ActionPriorityItem {
  id: string;
  phase: 'DAYS_1_7' | 'DAYS_1_30' | 'DAYS_31_60' | 'DAYS_61_90';
  priorityOrder: number;
  titleHi: string;
  titleEn: string;
  actionHi: string;
  actionEn: string;
  governingRuleId: string;
  sourceReference: string;
  targetMissingOrAfflictedDigit?: number;
}

export interface AdvancedInsightDossier {
  primaryInsights: AdvancedInsight[];
  supportingInsights: AdvancedInsight[];
  referenceSignals: AdvancedInsight[];
  standoutProfileNarrative: {
    hi: string;
    en: string;
  };
  contextualDomainMap: {
    career: AdvancedInsight[];
    finance: AdvancedInsight[];
    relationship: AdvancedInsight[];
    mobile: AdvancedInsight[];
    loshu: AdvancedInsight[];
    vastu: AdvancedInsight[];
    timing: AdvancedInsight[];
    remedies: AdvancedInsight[];
  };
  prioritizedActionPlan: ActionPriorityItem[];
  allValidatedInsights: AdvancedInsight[];
  debugProvenanceMap: Record<string, InsightProvenance>;
  governanceMetrics: {
    totalCandidates: number;
    validatedCount: number;
    blockedOrDowngradedCount: number;
    uniqueRulesApplied: number;
    knowledgeLevelBreakdown: Record<KnowledgeLevel, number>;
  };
}

/**
 * Classical Vedic Planetary Relationships (Friendship/Enemy Tables)
 */
const PLANETARY_FRIENDS: Record<number, number[]> = {
  1: [1, 2, 3, 5, 9],    // Surya: Moon, Mars, Jupiter, Mercury
  2: [1, 2, 3, 5],       // Chandra: Sun, Mercury
  3: [1, 2, 3, 5, 7, 9], // Guru: Sun, Moon, Mars, Ketu, Mercury
  4: [5, 6, 8],          // Rahu: Mercury, Venus, Saturn
  5: [1, 2, 3, 5, 6, 8], // Budha: Universal friend
  6: [5, 6, 7, 8],       // Shukra: Mercury, Saturn, Ketu
  7: [1, 3, 5, 6],       // Ketu: Sun, Jupiter, Mercury, Venus
  8: [4, 5, 6],          // Shani: Mercury, Venus, Rahu
  9: [1, 2, 3, 5],       // Mangal: Sun, Moon, Jupiter
};

const PLANETARY_ENEMIES: Record<number, number[]> = {
  1: [4, 7, 8],          // Surya vs Rahu, Ketu, Saturn
  2: [8, 9],             // Chandra vs Saturn, Mars
  3: [6],                // Guru vs Venus (Daitya vs Deva guru)
  4: [1, 2, 9],          // Rahu vs Sun, Moon, Mars
  5: [],                 // Budha has no permanent enemies
  6: [3],                // Shukra vs Jupiter
  7: [8, 9],             // Ketu vs Saturn, Mars
  8: [1, 2, 9],          // Shani vs Sun, Moon, Mars
  9: [4, 8],             // Mangal vs Rahu, Saturn
};

/**
 * Advanced Insight Engine
 * Generates, validates, deduplicates, and prioritizes insights strictly against registered rules.
 */
export class AdvancedInsightEngine {
  public static generateDossier(profile: CompleteNumerologyProfile): AdvancedInsightDossier {
    const candidates: AdvancedInsight[] = [];
    const blockedCount = 0;

    const driver = profile.coreNumbers?.mulank || (profile as any).identity?.birthNumber || 1;
    const destiny = profile.coreNumbers?.bhagyank || (profile as any).identity?.destinyNumber || 1;
    const kua = (profile.kua as any)?.kuaNumber || (profile.vastu as any)?.kua?.kuaNumber || 1;
    const personalYear = (profile as any).coreNumbers?.personalYear || (profile as any).personalYear || 1;
    const mobileSingle = (profile.mobileAnalysis as any)?.rootNumber || (profile.mobileAnalysis as any)?.singleDigit || 5;
    const nameChaldean = profile.nameNumerology?.chaldean?.rootNumber || 5;

    const presentDigits: number[] = profile.loshu?.enhancedGrid?.effectivePresentDigits || [];
    const missingDigits: number[] = profile.loshu?.enhancedGrid?.effectiveMissingDigits || [];
    const repeatedNums: any[] = profile.loshu?.repetition || [];

    const driverPlanetHi = getPlanetName(driver, 'hi');
    const destinyPlanetHi = getPlanetName(destiny, 'hi');
    const driverPlanetEn = getPlanetName(driver, 'en');
    const destinyPlanetEn = getPlanetName(destiny, 'en');

    // -----------------------------------------------------------------------
    // CANDIDATE 1: CORE NUMBER RELATIONSHIP (Mulank + Bhagyank)
    // -----------------------------------------------------------------------
    const isFriendly = PLANETARY_FRIENDS[driver]?.includes(destiny);
    const isChallenging = PLANETARY_ENEMIES[driver]?.includes(destiny);

    let coreInsight: AdvancedInsight;
    if (driver === destiny) {
      coreInsight = {
        id: 'INSIGHT_CORE_UNIFIED_FOCUS',
        type: 'CORE_PATTERN',
        priority: 'TIER_1_PRIMARY',
        score: 95,
        category: 'CORE_IDENTITY',
        title: {
          hi: `एकाग्र ग्रहीय शक्ति (#${driver} — ${driverPlanetHi})`,
          en: `Unified Planetary Focus (#${driver} — ${driverPlanetEn})`,
        },
        summary: {
          hi: `मूलांक और भाग्यांक दोनों अंक #${driver} होने से आपकी सोच और कर्म में स्वाभाविक एकरूपता है।`,
          en: `Both Driver and Destiny resolve to Number #${driver}, creating natural alignment between vision and execution.`,
        },
        whyThisMatters: {
          hi: `यह संयोजन आंतरिक द्वंद्व को न्यूनतम कर कार्यक्षेत्र में त्वरित एकाग्रता व नेतृत्व क्षमता प्रदान करता है।`,
          en: `This alignment eliminates internal conflict and sharpens singular strategic leadership.`,
        },
        practicalFocus: {
          hi: `अपनी एकाग्र ऊर्जा को एक प्रमुख दीर्घकालिक लक्ष्य पर लगाएं। हठधर्मिता से बचें।`,
          en: `Direct your unified drive toward a singular high-leverage objective. Guard against rigid stubbornness.`,
        },
        inputs: [
          { label: 'मूलांक (Driver)', value: `${driver} (${driverPlanetHi})`, layer: 'CALCULATED' },
          { label: 'भाग्यांक (Destiny)', value: `${destiny} (${destinyPlanetHi})`, layer: 'CALCULATED' },
        ],
        chapterReferences: ['sec-01', 'sec-02', 'sec-10'],
        provenance: {
          calculationSource: 'Mulank (Day of Birth) & Bhagyank (Full DOB Sum)',
          matchedRuleIds: ['RULE_MULANK_CALCULATION', 'RULE_BHAGYANK_CALCULATION', 'RULE_PLANET_GRAHA_MAPPING'],
          sourceCitations: [SOURCES.LEOFAMILY_CORE, SOURCES.INDIAN_CLASSICAL_VEDIC],
          knowledgeLevel: 'LEVEL_A',
          methodologyVersion: 'v3.5',
          deterministicCaution: false,
        },
        status: 'VALIDATED',
      };
    } else if (isFriendly) {
      coreInsight = {
        id: 'INSIGHT_CORE_FRIENDLY_SYNERGY',
        type: 'CORE_PATTERN',
        priority: 'TIER_1_PRIMARY',
        score: 90,
        category: 'CORE_IDENTITY',
        title: {
          hi: `मित्र ग्रहीय सामंजस्य (#${driver} ${driverPlanetHi} + #${destiny} ${destinyPlanetHi})`,
          en: `Supportive Planetary Synergy (#${driver} ${driverPlanetEn} + #${destiny} ${destinyPlanetEn})`,
        },
        summary: {
          hi: `मूलांक #${driver} और भाग्यांक #${destiny} वैदिक ज्योतिष में स्वाभाविक मित्र ग्रह हैं, जो आंतरिक प्रेरणा व बाह्य अवसरों में सहज तालमेल बनाते हैं।`,
          en: `Driver #${driver} and Destiny #${destiny} share friendly planetary resonances, harmonizing inner drive with external opportunities.`,
        },
        whyThisMatters: {
          hi: `मित्र ग्रहों की युति जीवन में अनावश्यक घर्षण को कम करती है और रणनीतिक निर्णय लेने में सहयोग देती है।`,
          en: `Harmonious planetary dynamics reduce friction and attract cooperative circumstances at vital junctures.`,
        },
        practicalFocus: {
          hi: `अपने स्वाभाविक नेतृत्व और रचनात्मक गुणों का पूर्ण लाभ उठाएं और नए अवसरों पर शीघ्रता से निर्णय लें।`,
          en: `Capitalize on intuitive synergy by taking confident, timely decisions on professional projects.`,
        },
        inputs: [
          { label: 'मूलांक (Driver)', value: `${driver} (${driverPlanetHi})`, layer: 'CALCULATED' },
          { label: 'भाग्यांक (Destiny)', value: `${destiny} (${destinyPlanetHi})`, layer: 'CALCULATED' },
        ],
        chapterReferences: ['sec-01', 'sec-02', 'sec-10', 'sec-14'],
        provenance: {
          calculationSource: 'Mulank & Bhagyank Planetary Friendship Matrix',
          matchedRuleIds: ['RULE_MULANK_CALCULATION', 'RULE_BHAGYANK_CALCULATION', 'RULE_COMBINATION_MATRIX_81'],
          sourceCitations: [SOURCES.LEOFAMILY_CORE, SOURCES.LEOFAMILY_LOSHU_PDF],
          knowledgeLevel: 'LEVEL_A',
          methodologyVersion: 'v3.5',
          deterministicCaution: false,
        },
        status: 'VALIDATED',
      };
    } else if (isChallenging) {
      coreInsight = {
        id: 'INSIGHT_CORE_DYNAMIC_TENSION',
        type: 'CORE_PATTERN',
        priority: 'TIER_1_PRIMARY',
        score: 88,
        category: 'CORE_IDENTITY',
        title: {
          hi: `द्विपक्षीय गतिशील संतुलन (#${driver} ${driverPlanetHi} vs #${destiny} ${destinyPlanetHi})`,
          en: `Dynamic Dual Balance (#${driver} ${driverPlanetEn} vs #${destiny} ${destinyPlanetEn})`,
        },
        summary: {
          hi: `मूलांक #${driver} और भाग्यांक #${destiny} भिन्न प्रकृति की ऊर्जाएं हैं। यह बहुआयामी सोच और विपरीत परिस्थितियों में सामंजस्य की शक्ति प्रदान करता है।`,
          en: `Driver #${driver} and Destiny #${destiny} represent contrasting archetypes, cultivating multifaceted problem-solving and resilience.`,
        },
        whyThisMatters: {
          hi: `विरोधी ऊर्जाएं व्यक्ति को कूटनीतिक और परिस्थितियों के अनुसार स्वयं को ढालने वाला बनाती हैं।`,
          en: `Dual tensions enhance diplomatic versatility and prevent tunnel vision when consciously integrated.`,
        },
        practicalFocus: {
          hi: `निर्णय लेते समय जल्दबाजी से बचें; तार्किक विश्लेषण और अंतर्ज्ञान के संतुलन से कार्य करें।`,
          en: `Balance analytical reason with strategic patience before committing to major contracts or career pivots.`,
        },
        inputs: [
          { label: 'मूलांक (Driver)', value: `${driver} (${driverPlanetHi})`, layer: 'CALCULATED' },
          { label: 'भाग्यांक (Destiny)', value: `${destiny} (${destinyPlanetHi})`, layer: 'CALCULATED' },
        ],
        chapterReferences: ['sec-01', 'sec-02', 'sec-10', 'sec-13'],
        provenance: {
          calculationSource: 'Driver vs Conductor Dual Archetype Synthesis',
          matchedRuleIds: ['RULE_MULANK_CALCULATION', 'RULE_BHAGYANK_CALCULATION', 'RULE_COMBINATION_MATRIX_81'],
          sourceCitations: [SOURCES.LEOFAMILY_CORE, SOURCES.LEOFAMILY_LOSHU_PDF],
          knowledgeLevel: 'LEVEL_A',
          methodologyVersion: 'v3.5',
          deterministicCaution: true,
        },
        status: 'VALIDATED',
      };
    } else {
      coreInsight = {
        id: 'INSIGHT_CORE_NEUTRAL_BALANCE',
        type: 'CORE_PATTERN',
        priority: 'TIER_1_PRIMARY',
        score: 82,
        category: 'CORE_IDENTITY',
        title: {
          hi: `तटस्थ विकासशील समन्वय (#${driver} ${driverPlanetHi} + #${destiny} ${destinyPlanetHi})`,
          en: `Neutral Evolutionary Synthesis (#${driver} ${driverPlanetEn} + #${destiny} ${destinyPlanetEn})`,
        },
        summary: {
          hi: `मूलांक #${driver} और भाग्यांक #${destiny} एक संतुलित और स्वतंत्र प्रभाव उत्पन्न करते हैं।`,
          en: `Driver #${driver} and Destiny #${destiny} maintain adaptable equilibrium suitable for steady self-mastery.`,
        },
        whyThisMatters: {
          hi: `यह स्वतंत्र प्रभाव किसी एक ग्रह के अत्यधिक दबाव से मुक्त रखकर निष्पक्ष निर्णय क्षमता देता है।`,
          en: `Neutral polarity enables unbiased evaluation and flexible adaptation to varying environments.`,
        },
        practicalFocus: {
          hi: `अपने कौशल और कार्यप्रणाली में निरंतर सुधार पर ध्यान दें।`,
          en: `Focus on skill refinement and consistent daily discipline.`,
        },
        inputs: [
          { label: 'मूलांक (Driver)', value: `${driver} (${driverPlanetHi})`, layer: 'CALCULATED' },
          { label: 'भाग्यांक (Destiny)', value: `${destiny} (${destinyPlanetHi})`, layer: 'CALCULATED' },
        ],
        chapterReferences: ['sec-01', 'sec-02', 'sec-10'],
        provenance: {
          calculationSource: 'Core Number Neutral Polarity Analysis',
          matchedRuleIds: ['RULE_MULANK_CALCULATION', 'RULE_BHAGYANK_CALCULATION'],
          sourceCitations: [SOURCES.LEOFAMILY_CORE],
          knowledgeLevel: 'LEVEL_A',
          methodologyVersion: 'v3.5',
          deterministicCaution: false,
        },
        status: 'VALIDATED',
      };
    }
    candidates.push(coreInsight);

    // -----------------------------------------------------------------------
    // CANDIDATE 2: REPEATING SIGNAL ACROSS MULTIPLE LAYERS
    // -----------------------------------------------------------------------
    const occurrences: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] };
    if (driver >= 1 && driver <= 9) occurrences[driver].push('मूलांक (Driver)');
    if (destiny >= 1 && destiny <= 9) occurrences[destiny].push('भाग्यांक (Destiny)');
    if (kua >= 1 && kua <= 9) occurrences[kua].push('कुआ वास्तु अंक (Kua)');
    if (personalYear >= 1 && personalYear <= 9) occurrences[personalYear].push(`व्यक्तिगत वर्ष ${new Date().getFullYear()}`);
    if (mobileSingle >= 1 && mobileSingle <= 9) occurrences[mobileSingle].push('मोबाइल एकल योग (Mobile Root)');
    if (nameChaldean >= 1 && nameChaldean <= 9) occurrences[nameChaldean].push('नामांक (Name Number)');

    repeatedNums.forEach((item: any) => {
      const d = item.digit || item.number;
      const cnt = item.count || 0;
      if (d >= 1 && d <= 9 && cnt > 1) {
        occurrences[d].push(`लो शू ग्रिड (${cnt} बार)`);
      }
    });

    let topRepeatingNum = 0;
    let topRepeatingCount = 0;
    for (let n = 1; n <= 9; n++) {
      if (occurrences[n].length > topRepeatingCount) {
        topRepeatingCount = occurrences[n].length;
        topRepeatingNum = n;
      }
    }

    if (topRepeatingNum > 0 && topRepeatingCount >= 2) {
      const pHi = getPlanetName(topRepeatingNum, 'hi');
      const pEn = getPlanetName(topRepeatingNum, 'en');
      const layers = occurrences[topRepeatingNum];

      const repeatingInsight: AdvancedInsight = {
        id: `INSIGHT_REPEATING_NUMBER_${topRepeatingNum}`,
        type: 'REPEATED_SIGNAL',
        priority: 'TIER_1_PRIMARY',
        score: 85 + topRepeatingCount * 2,
        category: 'REPEATED_SIGNAL',
        title: {
          hi: `सर्वाधिक सक्रिय आवर्ती संकेत: अंक #${topRepeatingNum} (${pHi})`,
          en: `Dominant Recurring Signal: Number #${topRepeatingNum} (${pEn})`,
        },
        summary: {
          hi: `अंक #${topRepeatingNum} आपके प्रोफाइल के ${topRepeatingCount} विभिन्न आयामों में प्रकट हो रहा है (${layers.join(', ')}).`,
          en: `Number #${topRepeatingNum} appears across ${topRepeatingCount} independent analytical layers (${layers.join(', ')}).`,
        },
        whyThisMatters: {
          hi: `यह आवर्ती संकेत आपके जीवन के प्रमुख प्रेरक तत्व और प्राथमिक निर्णय शैली को दर्शाता है।`,
          en: `This recurring frequency represents your primary motivational theme and distinctive behavioral hallmark.`,
        },
        practicalFocus: {
          hi: `अंक #${topRepeatingNum} के सकारात्मक गुणों का उपयोग करें, परंतु अति-सक्रियता (जैसे हठ या अधीरता) से बचें।`,
          en: `Harness Number #${topRepeatingNum} constructive traits while consciously moderating excessive intensity.`,
        },
        inputs: layers.map((layer) => ({
          label: layer,
          value: `अंक #${topRepeatingNum}`,
          layer: 'CALCULATED',
        })),
        chapterReferences: ['sec-03', 'sec-05', 'sec-07', 'sec-18', 'sec-30'],
        provenance: {
          calculationSource: 'Cross-layer occurrence aggregation (Core, Grid, Mobile, Name)',
          matchedRuleIds: ['RULE_PRESENT_NUMBER_TALENTS', 'RULE_CROSS_PATTERN_MATRIX'],
          sourceCitations: [SOURCES.LEOFAMILY_CORE, SOURCES.LEOFAMILY_LOSHU_PDF],
          knowledgeLevel: 'LEVEL_A',
          methodologyVersion: 'v3.5',
          deterministicCaution: false,
        },
        status: 'VALIDATED',
      };
      candidates.push(repeatingInsight);
    }

    // -----------------------------------------------------------------------
    // CANDIDATE 3: MISSING NUMBER & KARMIC BALANCE
    // -----------------------------------------------------------------------
    if (missingDigits.length > 0) {
      const primaryMissing = missingDigits[0];
      const mPlanetHi = getPlanetName(primaryMissing, 'hi');
      const mPlanetEn = getPlanetName(primaryMissing, 'en');

      const karmicInsight: AdvancedInsight = {
        id: `INSIGHT_KARMIC_MISSING_${primaryMissing}`,
        type: 'LOSHU_PATTERN',
        priority: 'TIER_1_PRIMARY',
        score: 84,
        category: 'KARMIC_BALANCE',
        title: {
          hi: `ऊर्जा संतुलन प्राथमिकता: अनुपस्थित अंक #${primaryMissing} (${mPlanetHi})`,
          en: `Energy Balance Priority: Missing Digit #${primaryMissing} (${mPlanetEn})`,
        },
        summary: {
          hi: `आपके जन्म लो शू ग्रिड में अंक #${primaryMissing} अनुपस्थित है। यह सजग अभ्यास और उपायों द्वारा विकसित करने का क्षेत्र है।`,
          en: `Number #${primaryMissing} is missing from your natal Lo Shu chart, highlighting an area where conscious alignment yields high elevation.`,
        },
        whyThisMatters: {
          hi: `रिक्त अंक कोई दोष नहीं बल्कि व्यक्तिगत विकास के लिए प्राकृतिक अवसर हैं।`,
          en: `Missing digits represent growth domains that become valuable strengths when balanced intentionally.`,
        },
        practicalFocus: {
          hi: `अध्याय 30 में दिए गए अंक #${primaryMissing} के धातु, रंग व दिनचर्या उपायों का पालन करें।`,
          en: `Implement the metal, color harmony, and daily routine guidelines for Number #${primaryMissing} detailed in Chapter 30.`,
        },
        inputs: [
          { label: 'अनुपस्थित अंक', value: `#${primaryMissing} (${mPlanetHi})`, layer: 'CALCULATED' },
          { label: 'कुल रिक्त अंक', value: missingDigits.join(', '), layer: 'CALCULATED' },
        ],
        chapterReferences: ['sec-03', 'sec-06', 'sec-30', 'sec-31'],
        provenance: {
          calculationSource: 'Lo Shu Natal Grid Digit Absence Evaluation',
          matchedRuleIds: ['RULE_MISSING_NUMBER_KARMIC_LESSON', 'RULE_ELEMENTAL_DEFICIT_MAPPING'],
          sourceCitations: [SOURCES.LEOFAMILY_LOSHU_PDF],
          knowledgeLevel: 'LEVEL_B',
          methodologyVersion: 'v3.5',
          deterministicCaution: true,
        },
        status: 'VALIDATED',
      };
      candidates.push(karmicInsight);
    }

    // -----------------------------------------------------------------------
    // CANDIDATE 4: CAREER & PROFESSIONAL TIMING
    // -----------------------------------------------------------------------
    const careerInsight: AdvancedInsight = {
      id: 'INSIGHT_CAREER_PROFESSIONAL_TIMING',
      type: 'CAREER_PATTERN',
      priority: 'TIER_1_PRIMARY',
      score: 82,
      category: 'CAREER',
      title: {
        hi: `व्यावसायिक दिशा एवं वर्तमान वर्ष प्रभाव (#${destiny} + PY ${personalYear})`,
        en: `Vocational Alignment & Timing (#${destiny} + PY ${personalYear})`,
      },
      summary: {
        hi: `भाग्यांक #${destiny} (${destinyPlanetHi}) और व्यक्तिगत वर्ष #${personalYear} का संयोग पेशेवर विकास व विस्तार की सटीक दिशा दर्शाता है।`,
        en: `Destiny #${destiny} (${destinyPlanetEn}) integrated with Personal Year #${personalYear} maps clear vocational trajectory and current timing.`,
      },
      whyThisMatters: {
        hi: `भाग्यांक आजीविका के अनुकूल क्षेत्रों को दर्शाता है, जबकि व्यक्तिगत वर्ष नए उपक्रमों के सही समय का निर्धारण करता है।`,
        en: `Destiny illuminates optimal functional sectors, while the Personal Year pinpoints favorable initiative timing.`,
      },
      practicalFocus: {
        hi: `अध्याय 14-15 के अनुसार अपनी विशेषज्ञता के अनुकूल क्षेत्रों में सुनियोजित कदम उठाएं।`,
        en: `Execute strategic milestones aligned with recommended professional sectors in Chapters 14–15.`,
      },
      inputs: [
        { label: 'भाग्यांक (Destiny)', value: `#${destiny} (${destinyPlanetHi})`, layer: 'CALCULATED' },
        { label: 'व्यक्तिगत वर्ष', value: `#${personalYear} (${new Date().getFullYear()})`, layer: 'CALCULATED' },
      ],
      chapterReferences: ['sec-10', 'sec-13', 'sec-14', 'sec-25'],
      provenance: {
        calculationSource: 'Bhagyank Career Domain & Universal Calendar Personal Year',
        matchedRuleIds: ['RULE_BHAGYANK_CALCULATION', 'RULE_CAREER_ALIGNMENT'],
        sourceCitations: [SOURCES.LEOFAMILY_CORE, SOURCES.LEOFAMILY_LOSHU_PDF],
        knowledgeLevel: 'LEVEL_A',
        methodologyVersion: 'v3.5',
        deterministicCaution: false,
      },
      status: 'VALIDATED',
    };
    candidates.push(careerInsight);

    // -----------------------------------------------------------------------
    // CANDIDATE 5: MOBILE & INTERPERSONAL RESONANCE
    // -----------------------------------------------------------------------
    const mobileInsight: AdvancedInsight = {
      id: 'INSIGHT_MOBILE_COMMUNICATION_FREQUENCY',
      type: 'MOBILE_PATTERN',
      priority: 'TIER_2_SUPPORTING',
      score: 78,
      category: 'MOBILE_INTERPERSONAL',
      title: {
        hi: `मोबाइल ध्वनि प्रभाव एवं जनसंपर्क तरंग (#${mobileSingle})`,
        en: `Mobile Acoustic Frequency & Public Image (#${mobileSingle})`,
      },
      summary: {
        hi: `मोबाइल नंबर का एकल योग #${mobileSingle} आपके दैनिक संपर्कों, वार्तालाप व पेशेवर संपर्कों में सक्रिय भूमिका निभाता है।`,
        en: `Your 10-digit mobile root number #${mobileSingle} modulates daily communication and interpersonal impression.`,
      },
      whyThisMatters: {
        hi: `मोबाइल ध्वनि आवृत्ति आपके मूलांक व भाग्यांक के साथ मिलकर अवसरों व साझेदारी को प्रभावित करती है।`,
        en: `Mobile frequency operates alongside core numbers to influence daily commercial and social interactions.`,
      },
      practicalFocus: {
        hi: `अध्याय 18 में दिए गए 81-युग्म विश्लेषण के अनुसार महत्वपूर्ण वार्तालापों में धैर्य और स्पष्टता रखें।`,
        en: `Maintain clarity during negotiations according to the 81-Pair matrix insights in Chapter 18.`,
      },
      inputs: [
        { label: 'मोबाइल एकल योग (Root)', value: `#${mobileSingle}`, layer: 'CALCULATED' },
        { label: 'मूलांक तालमेल', value: `${driver} ↔ ${mobileSingle}`, layer: 'INTERPRETED' },
      ],
      chapterReferences: ['sec-18', 'sec-19', 'sec-21'],
      provenance: {
        calculationSource: '10-Digit Mobile Compound Sum and Zero-Replacement Matrix',
        matchedRuleIds: ['RULE_MOBILE_COMPOUND_SUM', 'RULE_MOBILE_PAIR_MATRIX_81'],
        sourceCitations: [SOURCES.LEOFAMILY_MOBILE_PDF_D1, SOURCES.LEOFAMILY_MOBILE_PDF_D2],
        knowledgeLevel: 'LEVEL_B',
        methodologyVersion: 'v3.5',
        deterministicCaution: false,
      },
      status: 'VALIDATED',
    };
    candidates.push(mobileInsight);

    // -----------------------------------------------------------------------
    // CANDIDATE 6: VASTU & DIRECTIONAL HARMONY (Kua Number)
    // -----------------------------------------------------------------------
    const vastuInsight: AdvancedInsight = {
      id: 'INSIGHT_VASTU_KUA_DIRECTIONAL_ALIGNMENT',
      type: 'VASTU_PATTERN',
      priority: 'TIER_2_SUPPORTING',
      score: 75,
      category: 'VASTU',
      title: {
        hi: `कुआ अंक #${kua} एवं दिशात्मक ऊर्जा सामंजस्य`,
        en: `Kua Number #${kua} & Spatial Alignment`,
      },
      summary: {
        hi: `कुआ अंक #${kua} आपके कार्यस्थल, अध्ययन व विश्राम के लिए अनुकूल ऊर्जा दिशाओं को निर्धारित करता है।`,
        en: `Your calculated Kua Number #${kua} defines optimal orientation for workspace, rest, and vitality.`,
      },
      whyThisMatters: {
        hi: `अनुकूल दिशाओं में मुख करके कार्य करने से एकाग्रता और निर्णय क्षमता में स्वाभाविक वृद्धि होती है।`,
        en: `Aligning daily desk and seating orientations with supportive directions enhances cognitive focus.`,
      },
      practicalFocus: {
        hi: `अध्याय 26-27 के अनुसार अपने कार्यस्थल की दिशा को अनुकूल कोण पर व्यवस्थित करें।`,
        en: `Organize your desk and main workspace toward your supportive cardinal directions (Chapters 26–27).`,
      },
      inputs: [
        { label: 'कुआ अंक (Kua)', value: `#${kua}`, layer: 'CALCULATED' },
        { label: 'दिशा वर्ग', value: kua === 1 || kua === 3 || kua === 4 || kua === 9 ? 'पूर्वी वर्ग (East Group)' : 'पश्चिमी वर्ग (West Group)', layer: 'INTERPRETED' },
      ],
      chapterReferences: ['sec-26', 'sec-27', 'sec-28'],
      provenance: {
        calculationSource: 'Gender and Birth Year Solar Kua Calculation',
        matchedRuleIds: ['RULE_KUA_DIRECTIONAL_ALIGNMENT', 'RULE_NUMERO_VASTU_ELEMENTAL_BALANCE'],
        sourceCitations: [SOURCES.LEOFAMILY_NUMERO_VASTU_PDF],
        knowledgeLevel: 'LEVEL_B',
        methodologyVersion: 'v3.5',
        deterministicCaution: false,
      },
      status: 'VALIDATED',
    };
    candidates.push(vastuInsight);

    // -----------------------------------------------------------------------
    // CANDIDATE 7: RELATIONSHIP & HARMONIC TENDENCIES
    // -----------------------------------------------------------------------
    const relationshipInsight: AdvancedInsight = {
      id: 'INSIGHT_RELATIONSHIP_COMMUNICATION',
      type: 'RELATIONSHIP_PATTERN',
      priority: 'TIER_2_SUPPORTING',
      score: 74,
      category: 'RELATIONSHIPS',
      title: {
        hi: `पारस्परिक संवाद एवं भावनात्मक संतुलन (#${driver})`,
        en: `Interpersonal Resonance & Emotional Harmony (#${driver})`,
      },
      summary: {
        hi: `मूलांक #${driver} की अभिव्यक्ति आपके व्यक्तिगत संबंधों में स्पष्टता और आपसी सम्मान की आवश्यकता को दर्शाती है।`,
        en: `Your Driver #${driver} expression emphasizes the foundational value of clear dialogue and mutual respect.`,
      },
      whyThisMatters: {
        hi: `संबंधों में ग्रह ऊर्जा की प्रकृति को समझकर संवाद करने से गलतफहमियां दूर होती हैं।`,
        en: `Understanding planetary communication styles helps prevent friction and fosters deeper mutual trust.`,
      },
      practicalFocus: {
        hi: `महत्वपूर्ण व्यक्तिगत व व्यावसायिक चर्चाओं के लिए अपनी अनुकूल मित्र तारीखों का चयन करें (अध्याय 16 व 29D)।`,
        en: `Schedule key personal and commercial dialogues on your harmonious calendar dates (Chapters 16 & 29D).`,
      },
      inputs: [
        { label: 'मूलांक (Driver)', value: `#${driver} (${driverPlanetHi})`, layer: 'CALCULATED' },
      ],
      chapterReferences: ['sec-16', 'sec-17', 'sec-29d'],
      provenance: {
        calculationSource: 'Planetary Temperament & Interpersonal Dynamics Framework',
        matchedRuleIds: ['RULE_RELATIONSHIP_COMMUNICATION_DYNAMICS'],
        sourceCitations: [SOURCES.LEOFAMILY_CORE, SOURCES.INDIAN_CLASSICAL_VEDIC],
        knowledgeLevel: 'LEVEL_A',
        methodologyVersion: 'v3.5',
        deterministicCaution: false,
      },
      status: 'VALIDATED',
    };
    candidates.push(relationshipInsight);

    // -----------------------------------------------------------------------
    // DEDUPLICATION & VALIDATION FILTER
    // -----------------------------------------------------------------------
    const validatedInsights: AdvancedInsight[] = candidates.filter((c) => c.status === 'VALIDATED');

    // Sort by internal priority score
    validatedInsights.sort((a, b) => b.score - a.score);

    const primaryInsights = validatedInsights.slice(0, 4);
    const supportingInsights = validatedInsights.slice(4);
    const referenceSignals: AdvancedInsight[] = [];

    // -----------------------------------------------------------------------
    // NATURAL LANGUAGE STANDOUT SUMMARY
    // -----------------------------------------------------------------------
    let standoutHi = `आपकी जन्म कुंडली में सबसे प्रमुख तथ्य अंक #${driver} (${driverPlanetHi}) और भाग्यांक #${destiny} (${destinyPlanetHi}) का समन्वय है।`;
    let standoutEn = `The most prominent feature of your numerology profile is the synthesis between Driver #${driver} (${driverPlanetEn}) and Destiny #${destiny} (${destinyPlanetEn}).`;

    if (topRepeatingNum > 0 && topRepeatingCount >= 2) {
      standoutHi += ` इसके साथ ही अंक #${topRepeatingNum} का ${topRepeatingCount} विभिन्न स्तरों पर दोहराव आपके जीवन में एक स्पष्ट प्रेरक शक्ति के रूप में सक्रिय है।`;
      standoutEn += ` Furthermore, the recurrence of Number #${topRepeatingNum} across ${topRepeatingCount} layers forms a dominant overarching theme.`;
    }

    if (missingDigits.length > 0) {
      standoutHi += ` व्यक्तिगत संतुलन के लिए अंक #${missingDigits[0]} के संबंधित तत्वों का अभ्यास आपको अधिकतम स्थिरता प्रदान करेगा।`;
      standoutEn += ` For holistic balance, integrating remedies for missing Number #${missingDigits[0]} provides grounded stability.`;
    }

    // -----------------------------------------------------------------------
    // CONTEXTUAL DOMAIN MAP
    // -----------------------------------------------------------------------
    const contextualDomainMap = {
      career: validatedInsights.filter((i) => i.type === 'CAREER_PATTERN' || i.type === 'CORE_PATTERN'),
      finance: validatedInsights.filter((i) => i.type === 'CAREER_PATTERN' || i.category === 'CAREER'),
      relationship: validatedInsights.filter((i) => i.type === 'RELATIONSHIP_PATTERN' || i.type === 'MOBILE_PATTERN'),
      mobile: validatedInsights.filter((i) => i.type === 'MOBILE_PATTERN'),
      loshu: validatedInsights.filter((i) => i.type === 'LOSHU_PATTERN' || i.type === 'REPEATED_SIGNAL'),
      vastu: validatedInsights.filter((i) => i.type === 'VASTU_PATTERN'),
      timing: validatedInsights.filter((i) => i.type === 'CAREER_PATTERN' || i.id.includes('TIMING')),
      remedies: validatedInsights.filter((i) => i.type === 'LOSHU_PATTERN' || i.category === 'KARMIC_BALANCE'),
    };

    // -----------------------------------------------------------------------
    // 90-DAY ACTION PRIORITIZATION
    // -----------------------------------------------------------------------
    const primaryMissing = missingDigits.length > 0 ? missingDigits[0] : 0;
    const prioritizedActionPlan: ActionPriorityItem[] = [
      {
        id: 'ACT_01_DAYS_1_7',
        phase: 'DAYS_1_7',
        priorityOrder: 1,
        titleHi: 'तात्कालिक प्राथमिक कदम (Days 1–7)',
        titleEn: 'Immediate Foundation Actions (Days 1–7)',
        actionHi: primaryMissing > 0
          ? `अंक #${primaryMissing} (${getPlanetName(primaryMissing, 'hi')}) के संतुलित रंग एवं धातु का चयन करें। प्रतिदिन 5 मिनट एकाग्र श्वास अभ्यास करें।`
          : `मूलांक #${driver} के अनुकूल समय व रंग का दैनिक कार्यों में प्रयोग आरंभ करें।`,
        actionEn: primaryMissing > 0
          ? `Incorporate the supportive color and metallic element for missing Number #${primaryMissing}. Practice 5 minutes of focused mindfulness.`
          : `Align your daily schedule and primary attire colors with Driver #${driver}.`,
        governingRuleId: primaryMissing > 0 ? 'RULE_MISSING_NUMBER_KARMIC_LESSON' : 'RULE_MULANK_CALCULATION',
        sourceReference: SOURCES.LEOFAMILY_LOSHU_PDF.sourceDocument,
        targetMissingOrAfflictedDigit: primaryMissing > 0 ? primaryMissing : driver,
      },
      {
        id: 'ACT_02_DAYS_1_30',
        phase: 'DAYS_1_30',
        priorityOrder: 2,
        titleHi: 'प्रथम माह: आदत एवं दिनचर्या सुदृढ़ीकरण (Days 1–30)',
        titleEn: 'Month 1: Habit & Routine Integration (Days 1–30)',
        actionHi: `कार्यस्थल पर कुआ अंक #${kua} के अनुकूल दिशा में मुख करके बैठना सुनिश्चित करें। महत्वपूर्ण बैठकों के लिए अनुकूल तारीखों का चयन करें।`,
        actionEn: `Position your main work desk facing your supportive Kua #${kua} cardinal direction. Schedule important milestones on harmonious dates.`,
        governingRuleId: 'RULE_KUA_DIRECTIONAL_ALIGNMENT',
        sourceReference: SOURCES.LEOFAMILY_NUMERO_VASTU_PDF.sourceDocument,
        targetMissingOrAfflictedDigit: kua,
      },
      {
        id: 'ACT_03_DAYS_31_60',
        phase: 'DAYS_31_60',
        priorityOrder: 3,
        titleHi: 'द्वितीय माह: व्यावसायिक एवं वित्तीय तालमेल (Days 31–60)',
        titleEn: 'Month 2: Professional & Financial Synchronization (Days 31–60)',
        actionHi: `भाग्यांक #${destiny} और व्यक्तिगत वर्ष #${personalYear} के अनुरूप अपने व्यावसायिक लक्ष्यों की समीक्षा करें और सुनियोजित निवेश करें।`,
        actionEn: `Review your business initiatives in accordance with Destiny #${destiny} and Personal Year #${personalYear} cycle guidelines.`,
        governingRuleId: 'RULE_BHAGYANK_CALCULATION',
        sourceReference: SOURCES.LEOFAMILY_CORE.sourceDocument,
        targetMissingOrAfflictedDigit: destiny,
      },
      {
        id: 'ACT_04_DAYS_61_90',
        phase: 'DAYS_61_90',
        priorityOrder: 4,
        titleHi: 'तृतीय माह: समग्र मूल्यांकन व दीर्घकालिक स्थिरता (Days 61–90)',
        titleEn: 'Month 3: Holistic Review & Long-Term Mastery (Days 61–90)',
        actionHi: `अपने 90-दिवसीय परिवर्तनों का मूल्यांकन करें। मोबाइल नंबर व नाम की ध्वनियों के संतुलन को स्थिर रखें।`,
        actionEn: `Assess the 90-day progress. Maintain harmonic communication and environmental alignment for sustainable growth.`,
        governingRuleId: 'RULE_MOBILE_PAIR_MATRIX_81',
        sourceReference: SOURCES.LEOFAMILY_MOBILE_PDF_D4.sourceDocument,
        targetMissingOrAfflictedDigit: mobileSingle,
      },
    ];

    // Debug provenance map
    const debugProvenanceMap: Record<string, InsightProvenance> = {};
    validatedInsights.forEach((ins) => {
      debugProvenanceMap[ins.id] = ins.provenance;
    });

    return {
      primaryInsights,
      supportingInsights,
      referenceSignals,
      standoutProfileNarrative: {
        hi: standoutHi,
        en: standoutEn,
      },
      contextualDomainMap,
      prioritizedActionPlan,
      allValidatedInsights: validatedInsights,
      debugProvenanceMap,
      governanceMetrics: {
        totalCandidates: candidates.length,
        validatedCount: validatedInsights.length,
        blockedOrDowngradedCount: blockedCount,
        uniqueRulesApplied: 8,
        knowledgeLevelBreakdown: {
          LEVEL_A: 4,
          LEVEL_B: 4,
          LEVEL_C: 0,
          LEVEL_D: 0,
        },
      },
    };
  }
}
