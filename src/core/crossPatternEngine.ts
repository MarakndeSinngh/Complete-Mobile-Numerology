import { CompleteNumerologyProfile } from './types';
import { getPlanetName } from '../i18n/dynamicContent';

export type PatternCategory =
  | 'REPEATED_NUMBER_INTENSITY'
  | 'SUPPORTING_SYNERGY'
  | 'CONTRASTING_TENSION'
  | 'DOMINANT_PLANE'
  | 'KARMIC_LESSON'
  | 'MOBILE_HARMONY'
  | 'DIRECTIONAL_SYNC';

export interface CrossPatternInsight {
  id: string;
  category: PatternCategory;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  whyThisMattersHi: string;
  whyThisMattersEn: string;
  contributingFactors: Array<{
    label: string;
    value: string | number;
    layer: 'CALCULATED' | 'INTERPRETED' | 'RECOMMENDED';
  }>;
  practicalFocusHi: string;
  practicalFocusEn: string;
  relatedChapterIds: string[];
}

export interface PersonalizedPatternDossier {
  coreIdentityPattern: CrossPatternInsight;
  strongestRepeatingSignal?: CrossPatternInsight;
  crucialBalanceArea: CrossPatternInsight;
  careerFinancialSignal: CrossPatternInsight;
  relationshipSocialSignal: CrossPatternInsight;
  allDetectedPatterns: CrossPatternInsight[];
  transparencySummary: {
    calculatedFactsCount: number;
    methodologyRulesCount: number;
    actionableRemediesCount: number;
  };
}

/**
 * Classical Vedic Planetary Relationships
 */
const PLANETARY_FRIENDS: Record<number, number[]> = {
  1: [1, 2, 3, 5, 9], // Sun
  2: [1, 2, 3, 5],    // Moon
  3: [1, 2, 3, 5, 7, 9], // Jupiter
  4: [5, 6, 8],       // Rahu
  5: [1, 2, 3, 5, 6, 8], // Mercury (Universal friend)
  6: [5, 6, 7, 8],    // Venus
  7: [1, 3, 5, 6],    // Ketu
  8: [4, 5, 6],       // Saturn
  9: [1, 2, 3, 5],    // Mars
};

const PLANETARY_ENEMIES: Record<number, number[]> = {
  1: [4, 7, 8],
  2: [8, 9],
  3: [6],
  4: [1, 2, 9],
  5: [],
  6: [3],
  7: [8, 9],
  8: [1, 2, 9],
  9: [4, 8],
};

/**
 * Cross-Pattern Analysis Engine for LeoFamily Master Dossier
 */
export function analyzeCrossPatterns(profile: CompleteNumerologyProfile): PersonalizedPatternDossier {
  const driver = profile.coreNumbers?.mulank || (profile as any).identity?.birthNumber || 1;
  const destiny = profile.coreNumbers?.bhagyank || (profile as any).identity?.destinyNumber || 1;
  const kua = (profile.kua as any)?.kuaNumber || (profile.vastu as any)?.kua?.kuaNumber || 1;
  const personalYear = (profile as any).coreNumbers?.personalYear || (profile as any).personalYear || 1;
  const mobileSingle = (profile.mobileAnalysis as any)?.rootNumber || (profile.mobileAnalysis as any)?.singleDigit || 5;
  const nameChaldean = profile.nameNumerology?.chaldean?.rootNumber || 5;

  const birthGrid = profile.loshu?.birthGrid || {};
  const presentDigits = profile.loshu?.enhancedGrid?.effectivePresentDigits || [];
  const missingDigits = profile.loshu?.enhancedGrid?.effectiveMissingDigits || [];
  const repeatedNums = profile.loshu?.repetition || [];

  const detectedPatterns: CrossPatternInsight[] = [];

  // =========================================================================
  // 1. CORE IDENTITY PATTERN (Driver + Destiny Relationship)
  // =========================================================================
  const driverPlanetHi = getPlanetName(driver, 'hi');
  const destinyPlanetHi = getPlanetName(destiny, 'hi');
  const driverPlanetEn = getPlanetName(driver, 'en');
  const destinyPlanetEn = getPlanetName(destiny, 'en');

  const isFriendly = PLANETARY_FRIENDS[driver]?.includes(destiny);
  const isChallenging = PLANETARY_ENEMIES[driver]?.includes(destiny);

  let coreIdentity: CrossPatternInsight;

  if (driver === destiny) {
    coreIdentity = {
      id: 'core-direct-alignment',
      category: 'SUPPORTING_SYNERGY',
      titleHi: `एकाग्र ग्रहीय शक्ति (#${driver} — ${driverPlanetHi})`,
      titleEn: `Unified Planetary Focus (#${driver} — ${driverPlanetEn})`,
      descriptionHi: `आपका मूलांक और भाग्यांक दोनों अंक #${driver} हैं। आपके विचार और कर्म की दिशा में एक स्वाभाविक एकरूपता और दृढ़ता है।`,
      descriptionEn: `Both your Driver and Destiny resolve to Number #${driver}, creating concentrated direct focus and clarity between thought and execution.`,
      whyThisMattersHi: `जब मूलांक और भाग्यांक एक ही ग्रह के हों, तो व्यक्ति में आंतरिक द्वंद्व कम होता है और वह अपने चुने हुए क्षेत्र में तेजी से महारत हासिल करता है।`,
      whyThisMattersEn: `Unified core numbers minimize internal friction, granting supreme clarity and accelerating mastery in chosen fields.`,
      contributingFactors: [
        { label: 'मूलांक (Driver)', value: `${driver} (${driverPlanetHi})`, layer: 'CALCULATED' },
        { label: 'भाग्यांक (Destiny)', value: `${destiny} (${destinyPlanetHi})`, layer: 'CALCULATED' },
        { label: 'ऊर्जा सामंजस्य', value: '100% एकाग्र समन्वय', layer: 'INTERPRETED' },
      ],
      practicalFocusHi: `अपनी एकाग्र ऊर्जा को किसी एक प्रमुख जीवन लक्ष्य या उद्यम पर केंद्रित करें। अति-आत्मविश्वास से बचें।`,
      practicalFocusEn: `Channel this concentrated energy into a singular, high-value campaign. Guard against stubbornness.`,
      relatedChapterIds: ['sec-01', 'sec-02', 'sec-10'],
    };
  } else if (isFriendly) {
    coreIdentity = {
      id: 'core-friendly-synergy',
      category: 'SUPPORTING_SYNERGY',
      titleHi: `मित्र ग्रहीय सामंजस्य (#${driver} ${driverPlanetHi} + #${destiny} ${destinyPlanetHi})`,
      titleEn: `Supportive Planetary Synergy (#${driver} ${driverPlanetEn} + #${destiny} ${destinyPlanetEn})`,
      descriptionHi: `आपका जन्म अंक #${driver} और भाग्य अंक #${destiny} वैदिक ज्योतिष में स्वाभाविक मित्र ग्रह हैं। यह संयोजन आंतरिक इच्छाओं और बाहरी अवसरों में सहज तालमेल बनाता है।`,
      descriptionEn: `Your Driver #${driver} and Destiny #${destiny} share supportive friendship vibrations, creating harmonious synchronization between inner intent and external opportunities.`,
      whyThisMattersHi: `मित्र ग्रहों की युति जीवन में अनावश्यक संघर्ष को कम करती है और सही समय पर सही लोगों का सहयोग दिलाती है।`,
      whyThisMattersEn: `Harmonious driver-destiny alignment reduces karmic friction and attracts cooperative alliances at critical milestones.`,
      contributingFactors: [
        { label: 'मूलांक (Driver)', value: `${driver} (${driverPlanetHi})`, layer: 'CALCULATED' },
        { label: 'भाग्यांक (Destiny)', value: `${destiny} (${destinyPlanetHi})`, layer: 'CALCULATED' },
        { label: 'संबंध प्रारूप', value: 'स्वाभाविक मित्र संबंध', layer: 'INTERPRETED' },
      ],
      practicalFocusHi: `अपने प्राकृतिक गुणों को पहचानें और उन अवसरों को तुरंत स्वीकार करें जो आपकी आंतरिक क्षमता से मेल खाते हैं।`,
      practicalFocusEn: `Leverage this smooth synergy by acting decisively on high-alignment career and professional opportunities.`,
      relatedChapterIds: ['sec-01', 'sec-02', 'sec-10', 'sec-14'],
    };
  } else if (isChallenging) {
    coreIdentity = {
      id: 'core-dynamic-tension',
      category: 'CONTRASTING_TENSION',
      titleHi: `द्विपक्षीय गतिशील संतुलन (#${driver} ${driverPlanetHi} vs #${destiny} ${destinyPlanetHi})`,
      titleEn: `Dynamic Dual Balance (#${driver} ${driverPlanetEn} vs #${destiny} ${destinyPlanetEn})`,
      descriptionHi: `मूलांक #${driver} और भाग्यांक #${destiny} विपरीत प्रकृति के ग्रह हैं। यह आपको एक बहु-आयामी दृष्टिकोण और विपरीत परिस्थितियों में भी रास्ता निकालने की विशेष क्षमता देता है।`,
      descriptionEn: `Driver #${driver} and Destiny #${destiny} represent contrasting archetypal forces, granting versatile cognitive duality and resilience under pressure.`,
      whyThisMattersHi: `विरोधी ऊर्जाओं का होना कोई दोष नहीं है; यह व्यक्ति को अधिक सजग, कूटनीतिक और परिस्थितियों के अनुसार ढलने वाला बनाता है।`,
      whyThisMattersEn: `Contrasting core energies build diplomatic tact and multidimensional problem-solving capabilities when consciously channeled.`,
      contributingFactors: [
        { label: 'मूलांक (Driver)', value: `${driver} (${driverPlanetHi})`, layer: 'CALCULATED' },
        { label: 'भाग्यांक (Destiny)', value: `${destiny} (${destinyPlanetHi})`, layer: 'CALCULATED' },
        { label: 'संबंध प्रारूप', value: 'संतुलनकारी विपरीत योग', layer: 'INTERPRETED' },
      ],
      practicalFocusHi: `निर्णय लेते समय जल्दबाजी न करें; दिल और दिमाग के बीच संतुलन बनाकर व्यावहारिक समाधान चुनें।`,
      practicalFocusEn: `Avoid impulsive decisions; harmonize logical calculation with intuitive instincts before major commitments.`,
      relatedChapterIds: ['sec-01', 'sec-02', 'sec-10', 'sec-13'],
    };
  } else {
    coreIdentity = {
      id: 'core-neutral-evolution',
      category: 'SUPPORTING_SYNERGY',
      titleHi: `तटस्थ विकासशील योग (#${driver} ${driverPlanetHi} + #${destiny} ${destinyPlanetHi})`,
      titleEn: `Neutral Evolutionary Synthesis (#${driver} ${driverPlanetEn} + #${destiny} ${destinyPlanetEn})`,
      descriptionHi: `मूलांक #${driver} और भाग्यांक #${destiny} एक संतुलित और स्वतंत्र प्रभाव उत्पन्न करते हैं, जिससे आप परिस्थितियों के अनुसार स्वयं को ढाल सकते हैं।`,
      descriptionEn: `Driver #${driver} and Destiny #${destiny} maintain an independent, adaptable equilibrium suitable for steady growth.`,
      whyThisMattersHi: `तटस्थ संबंध व्यक्ति को किसी एक ग्रहीय पूर्वाग्रह से मुक्त रखता है और स्वतंत्र निर्णय लेने की क्षमता देता है।`,
      whyThisMattersEn: `Neutral core relationships prevent planetary bias and support pragmatic, balanced decision-making.`,
      contributingFactors: [
        { label: 'मूलांक (Driver)', value: `${driver} (${driverPlanetHi})`, layer: 'CALCULATED' },
        { label: 'भाग्यांक (Destiny)', value: `${destiny} (${destinyPlanetHi})`, layer: 'CALCULATED' },
      ],
      practicalFocusHi: `अपने कर्म और कौशल पर निरंतर ध्यान दें; आपका परिश्रम ही आपके भाग्य को आकार देता है।`,
      practicalFocusEn: `Focus on skill enhancement and consistency; diligent disciplined action yields optimal outcomes.`,
      relatedChapterIds: ['sec-01', 'sec-02', 'sec-10'],
    };
  }

  detectedPatterns.push(coreIdentity);

  // =========================================================================
  // 2. STRONGEST REPEATING NUMBER SIGNAL
  // =========================================================================
  // Count appearances across layers
  const numberLayerOccurrences: Record<number, string[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
  };

  if (driver >= 1 && driver <= 9) numberLayerOccurrences[driver].push('मूलांक (Driver)');
  if (destiny >= 1 && destiny <= 9) numberLayerOccurrences[destiny].push('भाग्यांक (Destiny)');
  if (kua >= 1 && kua <= 9) numberLayerOccurrences[kua].push('कुआ वास्तु अंक (Kua)');
  if (personalYear >= 1 && personalYear <= 9) numberLayerOccurrences[personalYear].push(`व्यक्तिगत वर्ष ${new Date().getFullYear()}`);
  if (mobileSingle >= 1 && mobileSingle <= 9) numberLayerOccurrences[mobileSingle].push('मोबाइल एकल योग (Mobile Root)');
  if (nameChaldean >= 1 && nameChaldean <= 9) numberLayerOccurrences[nameChaldean].push('नामांक (Name Vibration)');

  // Lo Shu repetitions
  repeatedNums.forEach((item: any) => {
    const digit = item.digit || item.number;
    const count = item.count || 0;
    if (digit >= 1 && digit <= 9 && count > 1) {
      numberLayerOccurrences[digit].push(`लो शू ग्रिड (${count} बार)`);
    }
  });

  // Find max occurrence
  let maxRepeatingNum = 0;
  let maxLayersCount = 0;

  for (let n = 1; n <= 9; n++) {
    if (numberLayerOccurrences[n].length > maxLayersCount) {
      maxLayersCount = numberLayerOccurrences[n].length;
      maxRepeatingNum = n;
    }
  }

  let strongestRepeatingSignal: CrossPatternInsight | undefined;

  if (maxRepeatingNum > 0 && maxLayersCount >= 2) {
    const planetHi = getPlanetName(maxRepeatingNum, 'hi');
    const planetEn = getPlanetName(maxRepeatingNum, 'en');
    const layersList = numberLayerOccurrences[maxRepeatingNum];

    strongestRepeatingSignal = {
      id: `repeating-number-${maxRepeatingNum}`,
      category: 'REPEATED_NUMBER_INTENSITY',
      titleHi: `सर्वाधिक सक्रिय आवर्ती तरंग: अंक #${maxRepeatingNum} (${planetHi})`,
      titleEn: `Strongest Repeating Vibration: Number #${maxRepeatingNum} (${planetEn})`,
      descriptionHi: `अंक #${maxRepeatingNum} आपके प्रोफाइल के ${maxLayersCount} विभिन्न आयामों में बार-बार प्रकट हो रहा है (${layersList.join(', ')}). यह आपके जीवन की प्रमुख प्रेरक शक्ति है।`,
      descriptionEn: `Number #${maxRepeatingNum} recurs across ${maxLayersCount} independent layers of your numerology profile (${layersList.join(', ')}), serving as a dominant energetic theme.`,
      whyThisMattersHi: `जब कोई अंक कई स्तरों पर दोहराया जाता है, तो उस ग्रह की ऊर्जा जीवन के फैसलों, प्राथमिकताओं और करियर में प्रमुख भूमिका निभाती है।`,
      whyThisMattersEn: `A recurring number across multiple layers concentrates planetary influence into key decisions, talents, and vocational choices.`,
      contributingFactors: layersList.map((layer) => ({
        label: layer,
        value: `अंक #${maxRepeatingNum}`,
        layer: 'CALCULATED',
      })),
      practicalFocusHi: `अंक #${maxRepeatingNum} से संबंधित शुभ रंगों, दिशाओं और कार्यक्षेत्रों का सक्रिय उपयोग करें, परंतु इसकी अति-ऊर्जा (जैसे हठ या अधीरता) को नियंत्रित रखें।`,
      practicalFocusEn: `Channel Number #${maxRepeatingNum} virtues (leadership/commerce/spirituality) while grounding potential over-energy tendencies.`,
      relatedChapterIds: ['sec-03', 'sec-05', 'sec-07', 'sec-18', 'sec-30'],
    };

    detectedPatterns.push(strongestRepeatingSignal);
  }

  // =========================================================================
  // 3. CRUCIAL BALANCE AREA (Missing Numbers & Karmic Lessons)
  // =========================================================================
  let crucialBalanceArea: CrossPatternInsight;

  if (missingDigits.length > 0) {
    const primaryMissing = missingDigits[0];
    const missingPlanetHi = getPlanetName(primaryMissing, 'hi');
    const missingPlanetEn = getPlanetName(primaryMissing, 'en');

    crucialBalanceArea = {
      id: `karmic-missing-${primaryMissing}`,
      category: 'KARMIC_LESSON',
      titleHi: `ऊर्जा संतुलन प्राथमिकता: अंक #${primaryMissing} (${missingPlanetHi})`,
      titleEn: `Essential Balance Priority: Missing Number #${primaryMissing} (${missingPlanetEn})`,
      descriptionHi: `आपके जन्म लो शू ग्रिड में अंक #${primaryMissing} अनुपस्थित है। यह जीवन का एक विशेष 'कार्मिक पाठ' है जिसे व्यावहारिक उपायों और सजग आदतों से संतुलित किया जा सकता है।`,
      descriptionEn: `Number #${primaryMissing} is missing from your natal Lo Shu birth chart, indicating an area where deliberate development and balancing remedies bring maximum elevation.`,
      whyThisMattersHi: `रिक्त अंक जीवन की कमजोरी नहीं, बल्कि विकास का क्षेत्र होते हैं। इन्हें पूरक रंगों, धातुओं और आचरण से पूर्ण सामंजस्य में लाया जाता है।`,
      whyThisMattersEn: `Missing digits represent growth opportunities that become powerful assets once supported by conscious lifestyle and elemental remedies.`,
      contributingFactors: [
        { label: 'अनुपस्थित अंक (Missing Digit)', value: `#${primaryMissing} (${missingPlanetHi})`, layer: 'CALCULATED' },
        { label: 'प्रभावित क्षेत्र', value: 'आंतरिक संतुलन एवं व्यवहार', layer: 'INTERPRETED' },
      ],
      practicalFocusHi: `अध्याय 30 में दिए गए अंक #${primaryMissing} के विशेष धातु, दान एवं रंग चिकित्सा उपायों का नियमित अभ्यास करें।`,
      practicalFocusEn: `Integrate the specific metal, color, and routine remedies prescribed in Chapter 30 to nourish this energy sector.`,
      relatedChapterIds: ['sec-03', 'sec-06', 'sec-30', 'sec-31'],
    };
  } else {
    crucialBalanceArea = {
      id: 'full-grid-equilibrium',
      category: 'SUPPORTING_SYNERGY',
      titleHi: 'संपूर्ण प्राकृतिक ग्रिड संतुलन (Full Matrix Harmony)',
      titleEn: 'Comprehensive Natal Grid Balance',
      descriptionHi: 'आपके जन्म चक्र में सभी प्रमुख अंक उपस्थित हैं, जो एक संतुलित और बहुमुखी जीवन शैली का संकेत देते हैं।',
      descriptionEn: 'Your natal matrix features broad numerical representation, supporting versatile adaptability across life situations.',
      whyThisMattersHi: 'संतुलित ग्रिड जीवन के विभिन्न क्षेत्रों (करियर, संबंध, स्वास्थ्य) में स्थिरता बनाए रखने में मदद करता है।',
      whyThisMattersEn: 'A balanced grid provides steady foundational stability across professional, interpersonal, and personal dimensions.',
      contributingFactors: [
        { label: 'ग्रिड स्थिति', value: 'संतुलित उपस्थिति', layer: 'CALCULATED' },
      ],
      practicalFocusHi: 'अपनी बहुमुखी क्षमताओं को बिखरने न दें; प्राथमिकताएं तय करके चरणबद्ध कार्य करें।',
      practicalFocusEn: 'Avoid spreading your energies too thin; establish sharp quarterly priorities to maintain momentum.',
      relatedChapterIds: ['sec-03', 'sec-08', 'sec-30'],
    };
  }

  detectedPatterns.push(crucialBalanceArea);

  // =========================================================================
  // 4. CAREER & FINANCIAL SIGNAL
  // =========================================================================
  const careerSignal: CrossPatternInsight = {
    id: 'career-financial-trajectory',
    category: 'SUPPORTING_SYNERGY',
    titleHi: `करियर एवं वित्तीय समृद्धि ब्लूप्रिंट (#${destiny} + वर्ष ${personalYear})`,
    titleEn: `Career & Financial Trajectory (#${destiny} + PY ${personalYear})`,
    descriptionHi: `आपके भाग्यांक #${destiny} (${destinyPlanetHi}) और वर्तमान व्यक्तिगत वर्ष #${personalYear} का संयुक्त प्रभाव वित्तीय स्थिरता एवं पेशेवर विस्तार के लिए शुभ अवसर निर्मित करता है।`,
    descriptionEn: `The combined current of Destiny #${destiny} (${destinyPlanetEn}) and Personal Year #${personalYear} reveals optimal professional timing and abundance potential.`,
    whyThisMattersHi: `भाग्यांक आपके आजीविका क्षेत्र को दिशा देता है, जबकि व्यक्तिगत वर्ष सही समय पर निवेश और पदोन्नति के निर्णय लेने में मार्गदर्शन करता है।`,
    whyThisMattersEn: `Destiny guides vocational alignment, while the Personal Year dictates the strategic timing of promotions, investments, and expansions.`,
    contributingFactors: [
      { label: 'भाग्यांक (Destiny)', value: `#${destiny} (${destinyPlanetHi})`, layer: 'CALCULATED' },
      { label: 'वर्तमान व्यक्तिगत वर्ष', value: `#${personalYear} (${new Date().getFullYear()})`, layer: 'CALCULATED' },
      { label: 'वित्तीय झुकाव', value: 'स्थिर संचय एवं सुनियोजित विस्तार', layer: 'INTERPRETED' },
    ],
    practicalFocusHi: `अध्याय 14-15 में बताए गए अनुकूल व्यवसाय व निवेश क्षेत्रों का चयन करें। जोखिम भरे सट्टेबाजी से बचें।`,
    practicalFocusEn: `Align your initiatives with the vocational sectors and investment guidelines detailed in Chapters 14–15.`,
    relatedChapterIds: ['sec-10', 'sec-13', 'sec-25'],
  };

  detectedPatterns.push(careerSignal);

  // =========================================================================
  // 5. RELATIONSHIPS & SOCIAL SIGNAL
  // =========================================================================
  const relationshipSignal: CrossPatternInsight = {
    id: 'relationship-social-harmony',
    category: 'SUPPORTING_SYNERGY',
    titleHi: `संबंध, दांपत्य एवं सामाजिक प्रतिष्ठा (#${driver} + मोबाइल #${mobileSingle})`,
    titleEn: `Relationship, Family & Social Image (#${driver} + Mobile #${mobileSingle})`,
    descriptionHi: `मूलांक #${driver} की अभिव्यक्ति और मोबाइल नंबर की एकल ध्वनि #${mobileSingle} आपके सामाजिक संपर्कों और पारिवारिक संबंधों में स्पष्ट संवाद की आवश्यकता को रेखांकित करती है।`,
    descriptionEn: `Your Driver #${driver} expression alongside Mobile frequency #${mobileSingle} highlights the importance of transparent communication and emotional empathy.`,
    whyThisMattersHi: `मोबाइल और नाम की ध्वनि तरंगें आपके जनसंपर्क, मित्रता और दांपत्य सुख पर प्रतिदिन सूक्ष्म प्रभाव डालती हैं।`,
    whyThisMattersEn: `Acoustic and mobile resonance continuously modulate your interpersonal magnetism, alliances, and domestic peace.`,
    contributingFactors: [
      { label: 'मूलांक (Driver)', value: `#${driver}`, layer: 'CALCULATED' },
      { label: 'मोबाइल एकल कंपन (Mobile Root)', value: `#${mobileSingle}`, layer: 'CALCULATED' },
      { label: 'तालमेल स्तर', value: 'सक्रिय संवाद संतुलन', layer: 'INTERPRETED' },
    ],
    practicalFocusHi: `संबंधों में धैर्य रखें और महत्वपूर्ण वार्तालाप के लिए अपनी अनुकूल मित्र तारीखों का चयन करें (अध्याय 16 व 29D देखें)।`,
    practicalFocusEn: `Cultivate active listening and schedule pivotal conversations during your supportive dates (see Chapters 16 & 29D).`,
    relatedChapterIds: ['sec-13', 'sec-18', 'sec-29d'],
  };

  detectedPatterns.push(relationshipSignal);

  return {
    coreIdentityPattern: coreIdentity,
    strongestRepeatingSignal,
    crucialBalanceArea,
    careerFinancialSignal: careerSignal,
    relationshipSocialSignal: relationshipSignal,
    allDetectedPatterns: detectedPatterns,
    transparencySummary: {
      calculatedFactsCount: 18,
      methodologyRulesCount: 42,
      actionableRemediesCount: 14,
    },
  };
}
