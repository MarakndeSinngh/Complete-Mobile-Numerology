/**
 * LEOFAMILY BUSINESS & CORPORATE NUMEROLOGY PRO ENGINE
 * Phase 9: Authoritative Business, Corporate Branding & Firm Numerology Engine
 * 
 * Analyzes:
 * 1. Business / Corporate / Firm Name Chaldean Vibrations
 * 2. Brand Identity & Public Communication Style
 * 3. Owner (Founder) Mulank, Bhagyank & Personal Name Synergy
 * 4. Optional Co-founder / Partner Compatibility Matrix
 * 5. Business Purpose & Industry Resonance (Traditional Interpretation)
 * 6. Business Mobile Number Integration
 * 7. Office / Shop / Commercial Address & Vastu Kua Alignment
 * 8. Website / Domain Name Alphanumeric Resonance
 * 9. Business + Lo Shu Overlay & Personal Year Business Cycle
 * 10. Wealth Mindset, Financial Flow & Risk Profile
 * 11. Business Name Correction & Alternative Harmonizer
 * 12. Traditional Business Remedies & Practical Action Plan
 * 13. Hindi-First Explanations & Ethical Non-Guarantee Disclaimers
 */

import { CHALDEAN_LETTER_VALUES } from './chaldeanEngine';
import {
  reduceToSingleDigit,
  reduceToDigit,
  calculateMulank,
  calculateBhagyank,
  sumDigits
} from './numerologyEngine';
import { parseIndianDate, formatDateForDisplay } from '../utils/dateUtils';
import { getCompoundDetails } from '../services/compoundDatabase';
import { calculateKuaNumber, KuaProfile } from './kuaEngine';
import { GRAHA_MAPPING } from './methodologyConfig';
import { NUMBER_PROFILES } from './numberMeaningEngine';
import { analyzeMobileNumber } from './mobileNumerologyEngine';

export type BusinessIndustryType =
  | 'Retail'
  | 'Manufacturing'
  | 'Service'
  | 'Consulting'
  | 'Education'
  | 'Technology'
  | 'Finance / Accounting'
  | 'Real Estate'
  | 'Healthcare'
  | 'Beauty / Lifestyle'
  | 'Media / Entertainment'
  | 'Digital / Marketing'
  | 'Travel'
  | 'Construction'
  | 'Other';

export type BusinessCompatibilityStatus = 'SUPPORTIVE' | 'NEUTRAL' | 'NEEDS_ATTENTION';

export interface BusinessAnalysisInput {
  businessName: string;
  brandName?: string;
  companyLegalName?: string;
  industry: BusinessIndustryType;
  ownerName: string;
  ownerDob: string; // DD/MM/YYYY or YYYY-MM-DD
  ownerGender?: 'MALE' | 'FEMALE' | 'OTHER';
  partnerName?: string;
  partnerDob?: string;
  businessMobile?: string;
  officeAddress?: string;
  domainName?: string;
  suggestedName?: string;
}

export interface BusinessChaldeanBreakdown {
  letter: string;
  value: number;
}

export interface BusinessPartnerAnalysis {
  name: string;
  dob: string;
  mulank: number;
  bhagyank: number;
  chaldeanNameCompound: number;
  chaldeanNameRoot: number;
  ownerVsPartnerStatus: BusinessCompatibilityStatus;
  ownerVsPartnerScore: number;
  ownerVsPartnerNotesHi: string;
  partnerVsBusinessStatus: BusinessCompatibilityStatus;
  partnerVsBusinessScore: number;
  partnerVsBusinessNotesHi: string;
  overallSynergyStatus: BusinessCompatibilityStatus;
  communicationStyleHi: string;
  decisionMakingHi: string;
  responsibilityDistributionHi: string;
  financialWorkThemesHi: string;
  potentialFrictionAreasHi: string;
}

export interface BusinessMobileAnalysis {
  provided: boolean;
  originalNumber: string;
  compound: number;
  root: number;
  planetaryRuler: string;
  planetaryRulerHi: string;
  businessSuitabilityHi: string;
  repeatedDigits: { digit: number; count: number }[];
  keyPairs: string[];
}

export interface BusinessAddressAnalysis {
  provided: boolean;
  rawAddress: string;
  extractedNumberString: string;
  compound: number;
  root: number;
  planetaryRuler: string;
  planetaryRulerHi: string;
  ownerCompatibility: BusinessCompatibilityStatus;
  vastuSignificanceHi: string;
  businessSpaceGuidanceHi: string;
}

export interface BusinessDomainAnalysis {
  provided: boolean;
  rawDomain: string;
  cleanedNamePortion: string;
  compound: number;
  root: number;
  planetaryRuler: string;
  planetaryRulerHi: string;
  brandResonanceHi: string;
  disclaimer: string;
}

export interface BusinessNameCorrectionComparison {
  tested: boolean;
  currentName: string;
  currentCompound: number;
  currentRoot: number;
  currentStatus: BusinessCompatibilityStatus;
  suggestedName: string;
  suggestedCompound: number;
  suggestedRoot: number;
  suggestedStatus: BusinessCompatibilityStatus;
  comparisonNotesHi: string;
}

export interface BusinessNumerologyReport {
  // 1. Core Entity Information
  entity: {
    businessName: string;
    brandName: string;
    industry: BusinessIndustryType;
    ownerName: string;
    ownerDob: string;
    ownerGender: string;
  };

  // 2. Business Name Chaldean Vibration
  chaldean: {
    letterBreakdown: BusinessChaldeanBreakdown[];
    totalCompound: number;
    totalRoot: number;
    firstLetter: string;
    firstLetterValue: number;
    planetaryRuler: string;
    planetaryRulerHi: string;
    compoundTitle: string;
    compoundMeaning: string;
    compoundPrediction: string;
    traditionalThemeHi: string;
  };

  // 3. Corporate Branding & Public Expression
  branding: {
    brandNameUsed: string;
    brandCompound: number;
    brandRoot: number;
    firstLetterVibrationHi: string;
    brandPersonalityHi: string;
    communicationStyleHi: string;
    publicImageHi: string;
    leadershipToneHi: string;
    clientRelationshipStyleHi: string;
    businessEnvironmentHi: string;
    growthStyleHi: string;
    traditionalMoneyVibrationHi: string;
  };

  // 4. Owner + Business Synastry & Compatibility
  ownerProfile: {
    name: string;
    dob: string;
    mulank: number;
    bhagyank: number;
    personalNameCompound: number;
    personalNameRoot: number;
    mulankLord: string;
    bhagyankLord: string;
  };

  ownerCompatibility: {
    overallStatus: BusinessCompatibilityStatus;
    overallScore: number;
    mulankCompatibility: BusinessCompatibilityStatus;
    mulankScore: number;
    mulankExplanationHi: string;
    bhagyankCompatibility: BusinessCompatibilityStatus;
    bhagyankScore: number;
    bhagyankExplanationHi: string;
    personalNameCompatibility: BusinessCompatibilityStatus;
    personalNameExplanationHi: string;
    synergySummaryHi: string;
  };

  // 5. Industry / Purpose Resonance
  industryAnalysis: {
    selectedIndustry: BusinessIndustryType;
    favorablePlanetsHi: string;
    alignmentLevel: 'HIGH' | 'BALANCED' | 'NEEDS_REMEDY';
    traditionalInterpretationHi: string;
    industryTipsHi: string;
  };

  // 6. Optional Partner Compatibility
  partnerAnalysis?: BusinessPartnerAnalysis;

  // 7. Optional Business Mobile Analysis
  mobileAnalysis?: BusinessMobileAnalysis;

  // 8. Optional Business Address / Office Vastu
  addressAnalysis?: BusinessAddressAnalysis;

  // 9. Optional Domain / Handle Analysis
  domainAnalysis?: BusinessDomainAnalysis;

  // 10. Business Name Correction Sandbox
  nameCorrection?: BusinessNameCorrectionComparison;

  // 11. Lo Shu Birth Grid Business Overlay
  loshuOverlay: {
    birthGrid: Record<number, number>;
    businessSupportiveNumbers: { digit: number; name: string; present: boolean; significanceHi: string }[];
    dominantNumbers: number[];
    missingNumbers: number[];
    businessThemeHi: string;
  };

  // 12. Personal Year Business Cycle
  personalYear: {
    currentPersonalYear: number;
    cycleThemeHi: string;
    businessOpportunityHi: string;
    businessCautionHi: string;
  };

  // 13. Business Wealth & Mindset Profile
  wealthProfile: {
    moneyMindsetHi: string;
    spendingPatternHi: string;
    savingDisciplineHi: string;
    businessThinkingHi: string;
    riskStyleHi: string;
    wealthCreationStyleHi: string;
    traditionalBusinessCautionsHi: string;
  };

  // 14. Traditional Business Remedies
  remedies: {
    nameSpellingGuidanceHi: string;
    officeDirectionVastuHi: string;
    workspaceArrangementHi: string;
    auspiciousBrandColorsHi: string[];
    contractSigningDaysHi: string[];
    traditionalCharityRemedyHi: string;
    numberBalancingRemedyHi: string;
  };

  // 15. Final Executive Summary
  summary: {
    primaryStrengthHi: string;
    primaryCautionHi: string;
    communicationToneHi: string;
    ownerHarmonyHi: string;
    keyVastuGuidelineHi: string;
    practicalActionPointHi: string;
  };

  // 16. Disclaimers
  disclaimer: string;
}

// Planetary resonance matrix (1-9)
// 10 = Extremely Friendly, 8 = Friendly, 6 = Neutral, 4 = Enemy, 2 = Bitter Enemy
const PLANETARY_SYNASTRY: Record<number, Record<number, number>> = {
  1: { 1: 9, 2: 8, 3: 10, 4: 7, 5: 8, 6: 6, 7: 7, 8: 3, 9: 10 },
  2: { 1: 8, 2: 9, 3: 8, 4: 5, 5: 7, 6: 6, 7: 10, 8: 4, 9: 7 },
  3: { 1: 10, 2: 8, 3: 9, 4: 6, 5: 7, 6: 4, 7: 8, 8: 5, 9: 10 },
  4: { 1: 7, 2: 5, 3: 6, 4: 9, 5: 8, 6: 8, 7: 8, 8: 8, 9: 5 },
  5: { 1: 8, 2: 7, 3: 7, 4: 8, 5: 10, 6: 9, 7: 7, 8: 7, 9: 6 },
  6: { 1: 6, 2: 6, 3: 4, 4: 8, 5: 9, 6: 10, 7: 8, 8: 7, 9: 7 },
  7: { 1: 7, 2: 10, 3: 8, 4: 8, 5: 7, 6: 8, 7: 9, 8: 5, 9: 6 },
  8: { 1: 3, 2: 4, 3: 5, 4: 8, 5: 7, 6: 7, 7: 5, 8: 9, 9: 4 },
  9: { 1: 10, 2: 7, 3: 10, 4: 5, 5: 6, 6: 7, 7: 6, 8: 4, 9: 9 }
};

function getCompatibilityTier(score: number): BusinessCompatibilityStatus {
  if (score >= 7.5) return 'SUPPORTIVE';
  if (score >= 5.5) return 'NEUTRAL';
  return 'NEEDS_ATTENTION';
}

function calculateChaldeanSum(text: string): { compound: number; root: number; breakdown: BusinessChaldeanBreakdown[] } {
  if (!text) return { compound: 0, root: 0, breakdown: [] };
  const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
  let compound = 0;
  const breakdown: BusinessChaldeanBreakdown[] = [];

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const val = CHALDEAN_LETTER_VALUES[char] || 0;
    compound += val;
    breakdown.push({ letter: char, value: val });
  }

  const root = reduceToDigit(compound);
  return { compound, root, breakdown };
}

function cleanDomainName(domain: string): string {
  if (!domain) return '';
  let cleaned = domain.toLowerCase().trim();
  cleaned = cleaned.replace(/^https?:\/\//, '');
  cleaned = cleaned.replace(/^www\./, '');
  cleaned = cleaned.replace(/\/(.*)$/, ''); // remove trailing path
  // Strip common TLDs
  cleaned = cleaned.replace(/\.(com|in|co\.in|org|net|io|ai|biz|store|online|co|info|tech|me|app)$/i, '');
  cleaned = cleaned.replace(/[^a-z0-9]/g, '');
  return cleaned;
}

function calculatePersonalYear(dob: string): number {
  const parts = parseIndianDate(dob);
  if (!parts) return 1;
  const currentYear = new Date().getFullYear();
  const sum = parts.day + parts.month + sumDigits(currentYear);
  return reduceToDigit(sum);
}

// Brand Personality descriptions per root
const ROOT_BRAND_PERSONALITY: Record<number, {
  brandPersonalityHi: string;
  communicationStyleHi: string;
  publicImageHi: string;
  leadershipToneHi: string;
  clientRelationshipStyleHi: string;
  businessEnvironmentHi: string;
  growthStyleHi: string;
  traditionalMoneyVibrationHi: string;
  traditionalThemeHi: string;
}> = {
  1: {
    brandPersonalityHi: 'अग्रणी, प्रतिष्ठित और विजनरी ब्रांड पहचान जो बाजार में खुद को उद्योग के लीडर और ट्रेंड-सेटर के रूप में स्थापित करती है।',
    communicationStyleHi: 'स्पष्ट, प्रामाणिक, संक्षिप्त और वजनदार संवाद; ग्राहक को सीधा भरोसा और निश्चितता देने वाला संदेश।',
    publicImageHi: 'उच्च प्रतिष्ठा, स्वाभिमान, सरकारी व कॉर्पोरेट स्तर पर मान्यता प्राप्त विश्वसनीय ब्रांड छवि।',
    leadershipToneHi: 'मजबूत केंद्रीय नेतृत्व, दृढ़ निर्णय क्षमता और स्वायत्त संचालन की कार्यशैली।',
    clientRelationshipStyleHi: 'सम्मानजनक, पेशेवर और दीर्घकालिक प्रतिष्ठा पर आधारित ग्राहक संबंध।',
    businessEnvironmentHi: 'अनुशासित, व्यवस्थित और उच्च ऊर्जा वाला संगठनात्मक परिवेश जहां नीतियों का स्पष्ट पालन होता है।',
    growthStyleHi: 'पायनियरिंग इनोवेशन और बाजार में पहला कदम उठाने की साहसिक रणनीति से विस्तार।',
    traditionalMoneyVibrationHi: 'प्रीमियम प्राइसिंग, उच्च मूल्य सौदे और साख के बल पर स्थायी संपत्ति निर्माण।',
    traditionalThemeHi: 'नेतृत्व, ब्रांड प्रतिष्ठा, स्वतंत्रता और नवीन उपक्रम (Sun / Surya Energy)'
  },
  2: {
    brandPersonalityHi: 'सौम्य, संवेदनशील, ग्राहक-केंद्रित और सहयोगात्मक ब्रांड पहचान जो विश्वास और भावनात्मक जुड़ाव पर पनपती है।',
    communicationStyleHi: 'सहानुभूतिपूर्ण, प्रेरक, मधुर और संबंध-प्रगाढ़ संवाद शैली जो ग्राहक के दिल को छूती है।',
    publicImageHi: 'केयरिंग, सहयोगी, सेवा-भावी और लोक-कल्याणकारी संस्था के रूप में जनप्रिय प्रतिष्ठा।',
    leadershipToneHi: 'सहयोगात्मक, टीम को साथ लेकर चलने वाला और शांतिपूर्ण मध्यस्थता वाला नेतृत्व।',
    clientRelationshipStyleHi: 'गहरा व्यक्तिगत जुड़ाव, नियमित फॉलो-अप और ग्राहकों की समस्याओं के प्रति गहरी संवेदनशीलता।',
    businessEnvironmentHi: 'तनावमुक्त, सामंजस्यपूर्ण और रचनात्मक माहौल जहां कर्मचारियों की भावनाओं का सम्मान होता है।',
    growthStyleHi: 'नेटवर्किंग, मजबूत रेफरल्स, पब्लिक रिलेशंस और साझेदारियों के माध्यम से क्रमिक विकास।',
    traditionalMoneyVibrationHi: 'निरंतर नकदी प्रवाह, सेवा-आधारित राजस्व और विश्वसनीय पार्टनरशिप से आर्थिक संतुलन।',
    traditionalThemeHi: 'सहयोग, जन-संपर्क, सेवा और भावनात्मक जुड़ाव (Moon / Chandra Energy)'
  },
  3: {
    brandPersonalityHi: 'ज्ञानवान, परामर्शदाता, विस्तारवादी और बौद्धिक ब्रांड पहचान जो विशेषज्ञता और प्रमाणिकता के लिए जानी जाती है।',
    communicationStyleHi: 'शिक्षणात्मक, प्रेरक, ज्ञानवर्धक और विस्तृत संवाद जो ग्राहक को सही मार्गदर्शन प्रदान करता है।',
    publicImageHi: 'उद्योग विशेषज्ञ, आदरणीय मेंटर और बौद्धिक नेतृत्व वाली शीर्ष संस्था की छवि।',
    leadershipToneHi: 'मार्गदर्शक, दूरदर्शी, नीति-निर्माता और ज्ञान-आधारित सम्मान पर टिका नेतृत्व।',
    clientRelationshipStyleHi: 'विश्वासपात्र सलाहकार और मार्गदर्शक का संबंध जहां ग्राहक आपकी राय का सर्वोच्च सम्मान करते हैं।',
    businessEnvironmentHi: 'सीखने-सिखाने वाला, नैतिक, विशाल दृष्टिकोण और रचनात्मक स्वतंत्रता से परिपूर्ण माहौल।',
    growthStyleHi: 'ज्ञान के प्रचार, नए पाठ्यक्रमों/सेवाओं के विस्तार और व्यापक भौगोलिक पहुंच से वृद्धि।',
    traditionalMoneyVibrationHi: 'परामर्श शुल्क, ज्ञान संपदा, बौद्धिक कॉपीराइट और बड़ी परियोजनाओं से प्रचुर आय।',
    traditionalThemeHi: 'ज्ञान, विस्तार, परामर्श, शिक्षा और सत्यनिष्ठा (Jupiter / Guru Energy)'
  },
  4: {
    brandPersonalityHi: 'रणनीतिक, तकनीकी, लीक से हटकर सोचने वाली और आधुनिक प्रणालियों पर आधारित परिवर्तनकारी ब्रांड पहचान।',
    communicationStyleHi: 'डेटा-संचालित, व्यावहारिक, तार्किक और भविष्योन्मुखी संचार जो जटिल समस्याओं के आसान हल प्रस्तुत करता है।',
    publicImageHi: 'समस्या-निवारक, आधुनिक, डिजिटल-फर्स्ट और क्रांतिकारी समाधान प्रदाता कंपनी।',
    leadershipToneHi: 'दृढ़, विश्लेषणात्मक, सिस्टम-उन्मुख और बारीकियों पर पूर्ण नियंत्रण रखने वाला नेतृत्व।',
    clientRelationshipStyleHi: 'व्यावहारिक अनुबंध, स्पष्ट SLA और परिणाम-उन्मुख पेशेवर सहभागिता।',
    businessEnvironmentHi: 'तीव्र गति, ऑटोमेशन, तकनीकी टूल्स और लगातार नई प्रणालियों को अपनाने वाला परिवेश।',
    growthStyleHi: 'अचानक बड़े विस्तार, डिजिटल स्केल, अंतरराष्ट्रीय सहयोग और आधुनिक टेक्नोलॉजी के सहारे उछाल।',
    traditionalMoneyVibrationHi: 'तकनीकी निवेश, ऑनलाइन सिस्टम और बड़े अनुबंधों से धन अर्जन; अनियोजित विस्तार में वित्तीय सावधानी आवश्यक।',
    traditionalThemeHi: 'तकनीक, रणनीति, अपरंपरागत विकास और आधुनिक सिस्टम (Rahu Energy)'
  },
  5: {
    brandPersonalityHi: 'गतिशील, अनुकूलनशील, वाणिज्यिक रूप से चतुर और उत्कृष्ट नेटवर्किंग वाली बहुआयामी ब्रांड पहचान।',
    communicationStyleHi: 'त्वरित, आकर्षक, हाजिरजवाब, बहुभाषी और डिजिटल चैनलों पर अत्यधिक प्रभावी संवाद।',
    publicImageHi: 'तेजतर्रार, आधुनिक, ग्राहक-सुलभ और हर परिस्थिति में तुरंत समाधान देने वाला लोकप्रिय ब्रांड।',
    leadershipToneHi: 'लचीला, व्यावहारिक, सौदेबाजी में कुशल और नए अवसरों को तुरंत भुनाने वाला नेतृत्व।',
    clientRelationshipStyleHi: 'सक्रिय संचार, त्वरित सेवा, डिजिटल फीडबैक लूप और निरंतर संवाद पर आधारित संबंध।',
    businessEnvironmentHi: 'उत्साही, तेज, बहु-कार्यीय (multi-tasking) और वाणिज्यिक गतिविधियों से भरपूर जीवंत माहौल।',
    growthStyleHi: 'तेजी से बदलते बाजार रुझानों को अपनाना, ई-कॉमर्स, ट्रेडिंग और नए वितरण चैनलों से विस्तार।',
    traditionalMoneyVibrationHi: 'व्यापारिक लेन-देन, कमीशन, वाणिज्यिक सौदों और दैनिक धन प्रवाह के लिए अत्यंत शुभ मानी जाने वाली ऊर्जा।',
    traditionalThemeHi: 'व्यापार, वाणिज्य, त्वरित संवाद, नेटवर्किंग और अनुकूलन (Mercury / Budh Energy)'
  },
  6: {
    brandPersonalityHi: 'आकर्षक, विलासितापूर्ण, कलात्मक, सौन्दर्यपरक और उच्च जीवनशैली प्रदान करने वाली प्रीमियम ब्रांड पहचान।',
    communicationStyleHi: 'सुरुचिपूर्ण, आतिथ्यपूर्ण, सौंदर्य से परिपूर्ण और ग्राहक को वीआईपी अनुभव कराने वाला संवाद।',
    publicImageHi: 'प्रीमियम, विश्वसनीय, आरामदायक और उच्च गुणवत्ता वाले उत्पादों/सेवाओं का प्रतीक।',
    leadershipToneHi: 'अनुग्रहकारी, कला-प्रेमी, संबंध-निर्माता और कार्यस्थल पर सुख-सुविधाओं को प्राथमिकता देने वाला नेतृत्व।',
    clientRelationshipStyleHi: 'आत्मीय आदर, उत्कृष्ट ग्राहक संतुष्टि, दीर्घकालिक वफादारी और प्रीमियम सेवा मानक।',
    businessEnvironmentHi: 'सुंदर रूप से सजाया गया, आरामदायक, कलात्मक और सकारात्मक सौंदर्य बोध से युक्त कार्यस्थल।',
    growthStyleHi: 'ब्रांड एस्थेटिक्स, लक्ज़री पैकेजिंग, लाइफस्टाइल मार्केटिंग और उच्च-स्तरीय संतुष्ट ग्राहकों द्वारा सिफारिश।',
    traditionalMoneyVibrationHi: 'विलासिता, कला, फैशन, खान-पान, आभूषण व मनोरंजन के क्षेत्रों में धन और समृद्धि को आकर्षित करने वाली ऊर्जा।',
    traditionalThemeHi: 'विलासिता, सौंदर्य, आतिथ्य, कला और समृद्धि (Venus / Shukra Energy)'
  },
  7: {
    brandPersonalityHi: 'शोध-उन्मुख, गहन विश्लेषणात्मक, आध्यात्मिक और अनूठी गुणवत्ता वाली विशेषज्ञ ब्रांड पहचान।',
    communicationStyleHi: 'गंभीर, तथ्यपरक, गहन अंतर्दृष्टि से युक्त और सतही प्रचार से दूर रहने वाला सच्चा संवाद।',
    publicImageHi: 'गहन शोधकर्ता, स्वतंत्र विचारक, अनूठे आविष्कारों और आध्यात्मिक/दार्शनिक गहराई की प्रतीक संस्था।',
    leadershipToneHi: 'शांत, विचारशील, अंतर्मुखी और काम की गुणवत्ता व सत्यता को सर्वोपरि रखने वाला नेतृत्व।',
    clientRelationshipStyleHi: 'चुनिंदा ग्राहकों के साथ गहरा बौद्धिक/आध्यात्मिक विश्वास और निष्कलंक प्रतिष्ठा।',
    businessEnvironmentHi: 'शांत, एकाग्रता-युक्त, बिना किसी अनावश्यक शोर-शराबे वाला शोध और नवाचार का केंद्र।',
    growthStyleHi: 'विशिष्ट (Niche) बाजार में महारत, पेटेंट, मौलिक शोध और ऑर्गेनिक प्रतिष्ठा के बल पर प्रगति।',
    traditionalMoneyVibrationHi: 'विशेषज्ञ सलाह, गोपनीय शोध और अनूठी सेवाओं से लाभ; सतही वित्तीय दिखावे से दूरी।',
    traditionalThemeHi: 'शोध, अंतर्ज्ञान, विशिष्ट गुणवत्ता, आध्यात्मिकता और गहराई (Ketu Energy)'
  },
  8: {
    brandPersonalityHi: 'ठोस, संगठित, दीर्घकालिक, अनुशासित और बड़े पैमाने पर बुनियादी ढांचा खड़ा करने वाली महाकाय ब्रांड पहचान।',
    communicationStyleHi: 'गंभीर, औपचारिक, नियमबद्ध और कम शब्दों में ठोस प्रतिबद्धता व्यक्त करने वाली शैली।',
    publicImageHi: 'स्थायी, चट्टान जैसी मजबूत, कठिन परिस्थितियों में भी टिके रहने वाली विश्वसनीय संस्था।',
    leadershipToneHi: 'कड़ा अनुशासन, प्रक्रिया-उन्मुख, परिश्रम-प्रेमी और दीर्घकालिक विजन पर केंद्रित नेतृत्व।',
    clientRelationshipStyleHi: 'औपचारिक अनुबंध, समयबद्ध प्रतिबद्धताएं और ठोस डिलीवरी पर आधारित दीर्घकालिक निष्ठा।',
    businessEnvironmentHi: 'पदानुक्रमित (hierarchical), कठोर मानकों वाला, समयबद्ध और परिणाम-केंद्रित कॉर्पोरेट परिवेश।',
    growthStyleHi: 'धीमी लेकिन बेहद मजबूत नींव, बड़े पैमाने पर संचालन (scale) और संकटों को झेलकर बड़ा साम्राज्य बनाना।',
    traditionalMoneyVibrationHi: 'अचल संपत्ति, भारी उद्योग, निर्माण, मशीनरी और दीर्घकालिक धैर्यपूर्ण निवेश से महा-धन निर्माण।',
    traditionalThemeHi: 'संगठन, न्याय, धैर्य, कठोर परिश्रम और स्थायित्व (Saturn / Shani Energy)'
  },
  9: {
    brandPersonalityHi: 'ऊर्जावान, साहसी, मिशन-संचालित, रक्षात्मक और बड़े लक्ष्य को हासिल करने के लिए समर्पित गतिशील ब्रांड पहचान।',
    communicationStyleHi: 'जोशीला, प्रेरक, एक्शन-ओरिएंटेड और ग्राहक को तुरंत निर्णय लेने के लिए प्रेरित करने वाला संवाद।',
    publicImageHi: 'साहसी, जनहितैषी, संकटमोचक और किसी भी चुनौती का डटकर मुकाबला करने वाली जुझारू संस्था।',
    leadershipToneHi: 'सेनापति जैसा, आगे रहकर नेतृत्व करने वाला, त्वरित एक्शन लेने वाला और ऊर्जा से भरपूर नेतृत्व।',
    clientRelationshipStyleHi: 'सच्चा, सीधा, निष्कपट और संकट के समय ग्राहक के साथ मजबूती से खड़े रहने का संबंध।',
    businessEnvironmentHi: 'उच्च एड्रेनालाईन, लक्ष्य-उन्मुख, खेल भावना और चुनौतियों को उत्साह से स्वीकार करने वाला माहौल।',
    growthStyleHi: 'साहसिक अभियान, आक्रामक मार्केटिंग, नए क्षेत्रों पर विजय और बिना रुके लगातार विस्तार।',
    traditionalMoneyVibrationHi: 'ऊर्जा, खेल, सुरक्षा, रक्षा, रियल एस्टेट और बड़े साहसिक उपक्रमों से धन लाभ।',
    traditionalThemeHi: 'साहस, ऊर्जा, मानवता, त्वरित निर्णय और विजय (Mars / Mangal Energy)'
  }
};

// Industry suitability mapping
const INDUSTRY_PLANETARY_RESONANCE: Record<BusinessIndustryType, { planets: number[]; planetsHi: string; adviceHi: string }> = {
  'Retail': {
    planets: [5, 6, 3],
    planetsHi: 'बुध (5), शुक्र (6), गुरु (3)',
    adviceHi: 'खुदरा व्यापार में ग्राहकों के आकर्षण और निरंतर नकदी प्रवाह हेतु 5 या 6 की ऊर्जा सर्वोत्तम मानी जाती है।'
  },
  'Manufacturing': {
    planets: [8, 4, 1],
    planetsHi: 'शनि (8), राहू (4), सूर्य (1)',
    adviceHi: 'उत्पादन व फैक्ट्रियों में भारी मशीनरी और संगठन के लिए 8 व 4 की ऊर्जा स्थिरता प्रदान करती है।'
  },
  'Service': {
    planets: [2, 5, 6],
    planetsHi: 'चन्द्र (2), बुध (5), शुक्र (6)',
    adviceHi: 'सेवा उद्योग में ग्राहकों की संतुष्टि और त्वरित समाधान के लिए संवाद और सौम्यता आवश्यक है।'
  },
  'Consulting': {
    planets: [3, 5, 1],
    planetsHi: 'गुरु (3), बुध (5), सूर्य (1)',
    adviceHi: 'परामर्श में बौद्धिक स्पष्टता और अधिकार के लिए गुरु (3) और बुध (5) की ऊर्जा अत्यंत फलदायी है।'
  },
  'Education': {
    planets: [3, 1, 2],
    planetsHi: 'गुरु (3), सूर्य (1), चन्द्र (2)',
    adviceHi: 'शिक्षा व प्रशिक्षण क्षेत्र में ज्ञान के विस्तार और नीतिगत प्रतिष्ठा हेतु 3 और 1 का प्रभाव श्रेष्ठ है।'
  },
  'Technology': {
    planets: [4, 5, 1],
    planetsHi: 'राहू (4), बुध (5), सूर्य (1)',
    adviceHi: 'आईटी, सॉफ्टवेयर और नवाचार में राहू (4) की मॉडर्न सोच और बुध (5) की लॉजिकल ताकत अद्भुत परिणाम देती है।'
  },
  'Finance / Accounting': {
    planets: [5, 6, 8],
    planetsHi: 'बुध (5), शुक्र (6), शनि (8)',
    adviceHi: 'वित्तीय प्रबंधन में बुध की गणना, शुक्र का धन आकर्षण और शनि की ऑडिटिंग ईमानदारी अनुकूल है।'
  },
  'Real Estate': {
    planets: [8, 9, 6],
    planetsHi: 'शनि (8), मंगल (9), शुक्र (6)',
    adviceHi: 'भूमि व भवनों के कारोबार में मंगल (भूमिपुत्र), शनि (स्थायित्व) और शुक्र (आलीशान निर्माण) का समन्वय उत्तम है।'
  },
  'Healthcare': {
    planets: [1, 2, 7],
    planetsHi: 'सूर्य (1), चन्द्र (2), केतु (7)',
    adviceHi: 'चिकित्सा व आरोग्य में सूर्य का जीवनदान, चन्द्र की सेवा और केतु की औषधीय गहराई फलदायी है।'
  },
  'Beauty / Lifestyle': {
    planets: [6, 2, 5],
    planetsHi: 'शुक्र (6), चन्द्र (2), बुध (5)',
    adviceHi: 'फैशन, सौन्दर्य और लग्जरी में शुक्र (6) की आकर्षण ऊर्जा निर्विवाद रूप से सबसे शक्तिशाली है।'
  },
  'Media / Entertainment': {
    planets: [5, 6, 9],
    planetsHi: 'बुध (5), शुक्र (6), मंगल (9)',
    adviceHi: 'मीडिया और रचनात्मकता में बुध का कंटेंट, शुक्र का ग्लैमर और मंगल का साहस ब्रांड को चमकाता है।'
  },
  'Digital / Marketing': {
    planets: [5, 4, 3],
    planetsHi: 'बुध (5), राहू (4), गुरु (3)',
    adviceHi: 'डिजिटल मार्केटिंग में राहू की वायरल क्षमता और बुध का सम्मोहन ग्राहकों को आकर्षित करता है।'
  },
  'Travel': {
    planets: [5, 6, 7],
    planetsHi: 'बुध (5), शुक्र (6), केतु (7)',
    adviceHi: 'यात्रा व पर्यटन में बुध की गतिशीलता और शुक्र का आतिथ्य सुखद अनुभव निर्मित करता है।'
  },
  'Construction': {
    planets: [8, 9, 4],
    planetsHi: 'शनि (8), मंगल (9), राहू (4)',
    adviceHi: 'निर्माण कार्यों में मंगल का शारीरिक बल, शनि की नींव और राहू की वास्तुकला योजनाएं सहायक हैं।'
  },
  'Other': {
    planets: [1, 3, 5, 6],
    planetsHi: 'सूर्य (1), गुरु (3), बुध (5), शुक्र (6)',
    adviceHi: 'सामान्य व्यापार में बुध (5) का व्यापारिक कौशल और सूर्य (1) की प्रतिष्ठा संतुलन बनाती है।'
  }
};

/**
 * Main Authoritative Function for Business & Corporate Numerology Pro
 */
export function analyzeBusinessNumerologyPro(input: BusinessAnalysisInput): BusinessNumerologyReport {
  const bName = input.businessName.trim();
  const brandNameToUse = (input.brandName && input.brandName.trim()) ? input.brandName.trim() : bName;
  const ownerName = input.ownerName ? input.ownerName.trim() : 'Founder';
  const ownerDob = input.ownerDob;
  const ownerGender = input.ownerGender || 'MALE';

  // 1. Chaldean Business Name Calculation
  const chaldean = calculateChaldeanSum(bName);
  const compound = chaldean.compound;
  const root = chaldean.root || 1;
  const compoundDetails = getCompoundDetails(compound);

  const firstLetter = chaldean.breakdown[0]?.letter || 'A';
  const firstLetterValue = chaldean.breakdown[0]?.value || 1;

  const grahaInfo = GRAHA_MAPPING[root] || GRAHA_MAPPING[1];
  const brandPersonalityData = ROOT_BRAND_PERSONALITY[root] || ROOT_BRAND_PERSONALITY[1];

  // 2. Owner Profile Extraction
  const ownerMulank = calculateMulank(ownerDob);
  const ownerBhagyank = calculateBhagyank(ownerDob);
  const ownerPersonalNameChaldean = calculateChaldeanSum(ownerName);

  const ownerMulankLord = GRAHA_MAPPING[ownerMulank]?.nameHi || 'सूर्य';
  const ownerBhagyankLord = GRAHA_MAPPING[ownerBhagyank]?.nameHi || 'गुरु';

  // 3. Compatibility Calculation (Owner vs Business Name)
  const mulankScore = PLANETARY_SYNASTRY[ownerMulank]?.[root] || 7;
  const bhagyankScore = PLANETARY_SYNASTRY[ownerBhagyank]?.[root] || 7;
  const personalNameScore = PLANETARY_SYNASTRY[ownerPersonalNameChaldean.root]?.[root] || 7;

  const mulankStatus = getCompatibilityTier(mulankScore);
  const bhagyankStatus = getCompatibilityTier(bhagyankScore);
  const personalNameStatus = getCompatibilityTier(personalNameScore);

  const overallScoreNum = Math.round(((mulankScore * 0.4) + (bhagyankScore * 0.4) + (personalNameScore * 0.2)) * 10);
  const overallStatus: BusinessCompatibilityStatus =
    overallScoreNum >= 75 ? 'SUPPORTIVE' : overallScoreNum >= 55 ? 'NEUTRAL' : 'NEEDS_ATTENTION';

  const mulankExplanationHi =
    mulankStatus === 'SUPPORTIVE'
      ? `आपके मूल स्वभाव व निर्णय क्षमता (मूलांक #${ownerMulank} - ${ownerMulankLord}) और इस व्यवसाय नाम के रूट अंक #${root} (${grahaInfo.nameHi}) के बीच पारंपरिक मित्रता है, जो दैनिक कार्यशैली में सहज तालमेल को दर्शाती है।`
      : mulankStatus === 'NEUTRAL'
      ? `मूलांक #${ownerMulank} और व्यवसाय के रूट अंक #${root} के बीच तटस्थ (Neutral) संबंध है। नियमित अनुशासन और स्पष्ट प्रक्रियाओं से यह सामंजस्य मजबूत बना रहेगा।`
      : `मूलांक #${ownerMulank} और रूट #${root} के बीच ऊर्जा का विरोधाभास देखा जाता है। इसके लिए नीचे दिए गए पारंपरिक संतुलन उपायों और दिशा संरेखण का ध्यान रखना हितकारी है।`;

  const bhagyankExplanationHi =
    bhagyankStatus === 'SUPPORTIVE'
      ? `आपके जीवन पथ व भाग्यीय दिशा (भाग्यांक #${ownerBhagyank} - ${ownerBhagyankLord}) के साथ इस ब्रांड नाम की ऊर्जा अत्यधिक अनुकूल है, जो दीर्घकालिक अवसरों के विस्तार में सहायक मानी जा सकती है।`
      : bhagyankStatus === 'NEUTRAL'
      ? `भाग्यांक #${ownerBhagyank} के साथ यह नाम व्यावहारिक संतुलन रखता है, जो निरंतर प्रयासों के साथ सामान्य प्रगति का संकेत देता है।`
      : `भाग्यांक #${ownerBhagyank} और व्यवसाय नाम के बीच ऊर्जा खिंचाव है। उचित रंग व कार्यस्थल वास्तु से इस सामंजस्य को सुदृढ़ किया जा सकता है।`;

  const personalNameExplanationHi =
    personalNameStatus === 'SUPPORTIVE'
      ? `आपके व्यक्तिगत नाम वाइब्रेशन (रूट #${ownerPersonalNameChaldean.root}) और कंपनी नाम (रूट #${root}) के बीच सुंदर गूंज है, जो व्यक्तिगत साख को सीधे ब्रांड मूल्य में बदलने में पारंपरिक रूप से सहायक है।`
      : `व्यक्तिगत नाम और कंपनी नाम स्वतंत्र ऊर्जाएं रखते हैं, जिससे पेशेवर और व्यक्तिगत पहचान स्पष्ट रूप से अलग-अलग बनी रहती है।`;

  const synergySummaryHi =
    overallStatus === 'SUPPORTIVE'
      ? `पारंपरिक अंकशास्त्र के अनुसार, यह व्यवसाय नाम संस्थापक (${ownerName}) के मूलांक #${ownerMulank} व भाग्यांक #${ownerBhagyank} के साथ उच्च सामंजस्य (Supportive) में है। यह ऊर्जा आपकी निर्णय क्षमता को ब्रांड की पहचान के साथ जोड़ती है।`
      : overallStatus === 'NEUTRAL'
      ? `पारंपरिक दृष्टिकोण से यह नाम आपके प्रोफाइल के साथ संतुलित (Neutral) स्थिति में है। यह किसी बड़े टकराव के बिना स्थिर प्रगति का आधार बनता है।`
      : `इस नाम में कुछ ऊर्जा विरोधाभास (Needs Attention) हैं। यदि संभव हो तो नीचे दिए गए 'Name Correction Harmonizer' की सहायता से एक अक्षर का संतुलन जोड़कर इसे अधिक मित्रवत कंपाउंड पर लाया जा सकता है।`;

  // 4. Industry Analysis
  const industryMeta = INDUSTRY_PLANETARY_RESONANCE[input.industry] || INDUSTRY_PLANETARY_RESONANCE['Other'];
  const isIndustryAligned = industryMeta.planets.includes(root);
  const industryAlignmentLevel = isIndustryAligned ? 'HIGH' : (root === 5 || root === 1 || root === 6) ? 'BALANCED' : 'NEEDS_REMEDY';
  const industryTraditionalInterpretationHi =
    `चयनित उद्योग '${input.industry}' के लिए पारंपरिक रूप से ${industryMeta.planetsHi} की ऊर्जा अनुकूल मानी जाती है। आपके व्यवसाय का रूट अंक #${root} (${grahaInfo.nameHi}) ${
      isIndustryAligned
        ? 'इस क्षेत्र की मूल आवश्यकताओं के साथ पूर्णतः संरेखित है।'
        : 'इस क्षेत्र में एक विशिष्ट (Niche) व अनूठा दृष्टिकोण प्रदान कर सकता है।'
    }`;

  // 5. Optional Partner Analysis
  let partnerAnalysisResult: BusinessPartnerAnalysis | undefined;
  if (input.partnerName && input.partnerDob) {
    const pName = input.partnerName.trim();
    const pMulank = calculateMulank(input.partnerDob);
    const pBhagyank = calculateBhagyank(input.partnerDob);
    const pChaldean = calculateChaldeanSum(pName);

    const ownerVsPartnerMulankScore = PLANETARY_SYNASTRY[ownerMulank]?.[pMulank] || 7;
    const ownerVsPartnerBhagyankScore = PLANETARY_SYNASTRY[ownerBhagyank]?.[pBhagyank] || 7;
    const partnerVsBusScore = PLANETARY_SYNASTRY[pMulank]?.[root] || 7;

    const opScore = Math.round(((ownerVsPartnerMulankScore * 0.5) + (ownerVsPartnerBhagyankScore * 0.5)) * 10);
    const pbScore = Math.round(partnerVsBusScore * 10);

    const opStatus = getCompatibilityTier(ownerVsPartnerMulankScore);
    const pbStatus = getCompatibilityTier(partnerVsBusScore);
    const overallPartnerSynergy = (opScore >= 70 && pbScore >= 70) ? 'SUPPORTIVE' : (opScore >= 50 && pbScore >= 50) ? 'NEUTRAL' : 'NEEDS_ATTENTION';

    partnerAnalysisResult = {
      name: pName,
      dob: input.partnerDob,
      mulank: pMulank,
      bhagyank: pBhagyank,
      chaldeanNameCompound: pChaldean.compound,
      chaldeanNameRoot: pChaldean.root,
      ownerVsPartnerStatus: opStatus,
      ownerVsPartnerScore: opScore,
      ownerVsPartnerNotesHi:
        opStatus === 'SUPPORTIVE'
          ? `संस्थापक (${ownerName} - मूलांक ${ownerMulank}) और साझेदार (${pName} - मूलांक ${pMulank}) के बीच ऊर्जा का नैसर्गिक तालमेल है, जो आपसी समझ और विश्वास को मजबूत करता है।`
          : `संस्थापक और साझेदार के बीच विचारों की विविधता है; लिखित अनुबंध और स्पष्ट कार्य-विभाजन से यह साझेदारी दीर्घकालिक रूप से सफल रह सकती है।`,
      partnerVsBusinessStatus: pbStatus,
      partnerVsBusinessScore: pbScore,
      partnerVsBusinessNotesHi:
        pbStatus === 'SUPPORTIVE'
          ? `साझेदार का मूलांक #${pMulank} व्यवसाय के रूट #${root} के अनुकूल है, जिससे वे कंपनी के प्रचार और विकास में सक्रिय भूमिका निभा सकते हैं।`
          : `साझेदार की ऊर्जा कंपनी के रूट के साथ तटस्थ है, जो संतुलित योगदान की संभावना दर्शाती है।`,
      overallSynergyStatus: overallPartnerSynergy,
      communicationStyleHi: `संस्थापक की सीधी सोच और साझेदार के दृष्टिकोण के बीच विचारों का खुला आदान-प्रदान और नियमित समीक्षा आवश्यक है।`,
      decisionMakingHi: `रणनीतिक निर्णय संस्थापक द्वारा तथा दैनिक संचालन व क्रियान्वयन में साझेदार की सहभागिता संतुलन बनाए रखेगी।`,
      responsibilityDistributionHi: `वित्तीय व नीतिगत नियंत्रण स्पष्ट रूप से परिभाषित करें; एक पक्ष ग्राहक/विपणन संभाले तथा दूसरा पक्ष संचालन संभाले।`,
      financialWorkThemesHi: `साझेदारी में किसी भी प्रकार की मौखिक सहमति के स्थान पर स्पष्ट बैंक अधिकार व पारदर्शी हिसाब-किताब की व्यवस्था रखें।`,
      potentialFrictionAreasHi: `अहंकार टकराव या अनिश्चित जिम्मेदारी से बचें। माह में कम से कम एक बार अनौपचारिक बैठक करके मतभेदों को सुलझाएं।`
    };
  }

  // 6. Optional Business Mobile Analysis
  let mobileAnalysisResult: BusinessMobileAnalysis | undefined;
  if (input.businessMobile && input.businessMobile.trim()) {
    const rawMob = input.businessMobile.trim();
    const cleanDigits = rawMob.replace(/[^0-9]/g, '');
    let mobCompound = 0;
    const digitCounts: Record<number, number> = {};

    for (let i = 0; i < cleanDigits.length; i++) {
      const d = parseInt(cleanDigits[i], 10);
      mobCompound += d;
      digitCounts[d] = (digitCounts[d] || 0) + 1;
    }
    const mobRoot = reduceToDigit(mobCompound);
    const mobGraha = GRAHA_MAPPING[mobRoot] || GRAHA_MAPPING[5];

    const repeated = Object.entries(digitCounts)
      .map(([k, v]) => ({ digit: parseInt(k, 10), count: v }))
      .filter(item => item.count > 1);

    const keyPairs: string[] = [];
    for (let i = 0; i < cleanDigits.length - 1; i++) {
      keyPairs.push(cleanDigits.slice(i, i + 2));
    }

    mobileAnalysisResult = {
      provided: true,
      originalNumber: rawMob,
      compound: mobCompound,
      root: mobRoot,
      planetaryRuler: mobGraha.nameEn,
      planetaryRulerHi: mobGraha.nameHi,
      businessSuitabilityHi: `व्यवसायिक मोबाइल नंबर का कुल योग ${mobCompound} और रूट #${mobRoot} (${mobGraha.nameHi}) है। पारम्परिक रूप से, नंबर 5 या 6 वाले मोबाइल व्यापारिक कॉल, ग्राहक पूछताछ और नेटवर्किंग के लिए विशेष रूप से अनुकूल माने जाते हैं।`,
      repeatedDigits: repeated,
      keyPairs: keyPairs.slice(0, 5)
    };
  }

  // 7. Optional Business Address Analysis
  let addressAnalysisResult: BusinessAddressAnalysis | undefined;
  if (input.officeAddress && input.officeAddress.trim()) {
    const rawAddr = input.officeAddress.trim();
    const cleanNumbers = rawAddr.replace(/[^0-9]/g, '');
    const cleanAlpha = rawAddr.toUpperCase().replace(/[^A-Z]/g, '');

    let addrCompound = 0;
    for (let i = 0; i < cleanNumbers.length; i++) {
      addrCompound += parseInt(cleanNumbers[i], 10);
    }
    for (let i = 0; i < cleanAlpha.length; i++) {
      addrCompound += CHALDEAN_LETTER_VALUES[cleanAlpha[i]] || 0;
    }
    if (addrCompound === 0) addrCompound = 1;
    const addrRoot = reduceToDigit(addrCompound);
    const addrGraha = GRAHA_MAPPING[addrRoot] || GRAHA_MAPPING[1];

    const addrScore = PLANETARY_SYNASTRY[ownerMulank]?.[addrRoot] || 7;
    const addrStatus = getCompatibilityTier(addrScore);

    addressAnalysisResult = {
      provided: true,
      rawAddress: rawAddr,
      extractedNumberString: cleanNumbers || 'Address Alpha-Numeric',
      compound: addrCompound,
      root: addrRoot,
      planetaryRuler: addrGraha.nameEn,
      planetaryRulerHi: addrGraha.nameHi,
      ownerCompatibility: addrStatus,
      vastuSignificanceHi: `दुकान / कार्यालय का कुल कम्पाउंड योग ${addrCompound} और रूट अंक #${addrRoot} (${addrGraha.nameHi}) है। यह कार्यक्षेत्र में ${addrGraha.element} तत्व की ऊर्जा को सक्रिय करता है।`,
      businessSpaceGuidanceHi: `मालिक के बैठने की व्यवस्था दक्षिण-पश्चिम (South-West) में उत्तर या पूर्व की ओर मुख करके होना सर्वोत्तम है। मुख्य प्रवेश द्वार पर अव्यवस्था न रहने दें।`
    };
  }

  // 8. Optional Domain / Handle Analysis
  let domainAnalysisResult: BusinessDomainAnalysis | undefined;
  if (input.domainName && input.domainName.trim()) {
    const rawDom = input.domainName.trim();
    const namePortion = cleanDomainName(rawDom);
    const domChaldean = calculateChaldeanSum(namePortion);
    const domGraha = GRAHA_MAPPING[domChaldean.root] || GRAHA_MAPPING[5];

    domainAnalysisResult = {
      provided: true,
      rawDomain: rawDom,
      cleanedNamePortion: namePortion,
      compound: domChaldean.compound,
      root: domChaldean.root,
      planetaryRuler: domGraha.nameEn,
      planetaryRulerHi: domGraha.nameHi,
      brandResonanceHi: `डोमेन के मुख्य भाग '${namePortion}' का कम्पाउंड ${domChaldean.compound} और रूट #${domChaldean.root} (${domGraha.nameHi}) है, जो डिजिटल संचार में ${domGraha.nameHi} के गुणों को दर्शाता है।`,
      disclaimer: `पारंपरिक अंकशास्त्रीय व्याख्या; इसका सर्च इंजन रैंकिंग (SEO) या वेबसाइट ट्रैफ़िक से कोई तकनीकी संबंध नहीं है।`
    };
  }

  // 9. Name Correction Harmonizer
  let nameCorrectionResult: BusinessNameCorrectionComparison | undefined;
  if (input.suggestedName && input.suggestedName.trim()) {
    const sName = input.suggestedName.trim();
    const sChaldean = calculateChaldeanSum(sName);
    const sScore = PLANETARY_SYNASTRY[ownerMulank]?.[sChaldean.root] || 7;
    const sStatus = getCompatibilityTier(sScore);

    nameCorrectionResult = {
      tested: true,
      currentName: bName,
      currentCompound: compound,
      currentRoot: root,
      currentStatus: overallStatus,
      suggestedName: sName,
      suggestedCompound: sChaldean.compound,
      suggestedRoot: sChaldean.root,
      suggestedStatus: sStatus,
      comparisonNotesHi:
        sStatus === 'SUPPORTIVE' && overallStatus !== 'SUPPORTIVE'
          ? `सुझाई गई वर्तनी (Spelling) '${sName}' का कम्पाउंड ${sChaldean.compound} (रूट #${sChaldean.root}) बनता है, जो संस्थापक के मूलांक #${ownerMulank} के साथ अधिक अनुकूल (Supportive) माना जा सकता है।`
          : `सुझाई गई वर्तनी '${sName}' का कम्पाउंड ${sChaldean.compound} और रूट #${sChaldean.root} है। वर्तमान नाम की तुलना में यह एक वैकल्पिक संतुलन प्रस्तुत करता है।`
    };
  }

  // 10. Lo Shu Birth Grid Overlay
  const dateParts = parseIndianDate(ownerDob);
  const birthGrid: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  if (dateParts) {
    const dobString = `${dateParts.day}${dateParts.month}${dateParts.year}`;
    for (let i = 0; i < dobString.length; i++) {
      const d = parseInt(dobString[i], 10);
      if (d >= 1 && d <= 9) {
        birthGrid[d] = (birthGrid[d] || 0) + 1;
      }
    }
    birthGrid[ownerMulank] = (birthGrid[ownerMulank] || 0) + 1;
    birthGrid[ownerBhagyank] = (birthGrid[ownerBhagyank] || 0) + 1;
  }

  const dominantNumbers = Object.entries(birthGrid)
    .filter(([_, count]) => count >= 2)
    .map(([digit]) => parseInt(digit, 10));

  const missingNumbers = Object.entries(birthGrid)
    .filter(([_, count]) => count === 0)
    .map(([digit]) => parseInt(digit, 10));

  const businessSupportiveNumbers = [
    {
      digit: 4,
      name: 'राहू (Rahu) - Wealth & Assets (South-East)',
      present: birthGrid[4] > 0,
      significanceHi: 'वित्तीय योजना, व्यापारिक अनुशासन और परिसंपत्ति निर्माण के लिए सहायक।'
    },
    {
      digit: 9,
      name: 'मंगल (Mars) - Fame & Reputation (South)',
      present: birthGrid[9] > 0,
      significanceHi: 'ब्रांड की प्रतिष्ठा, बाजार में प्रसिद्धि और जन-सम्मान को ऊर्जा प्रदान करता है।'
    },
    {
      digit: 5,
      name: 'बुध (Mercury) - Business & Stability (Center)',
      present: birthGrid[5] > 0,
      significanceHi: 'व्यवसायिक सौदेबाजी, संतुलन, बातचीत और वाणिज्यिक सफलता का केंद्रीय आधार।'
    },
    {
      digit: 1,
      name: 'सूर्य (Sun) - Career & Leadership (North)',
      present: birthGrid[1] > 0,
      significanceHi: 'संस्थापक का नेतृत्व बल, विजन और स्वतंत्र निर्णय क्षमता।'
    },
    {
      digit: 6,
      name: 'शुक्र (Venus) - Client Support & Luxury (North-West)',
      present: birthGrid[6] > 0,
      significanceHi: 'सहयोगी मित्रों, मददगार ग्राहकों और लक्ज़री आकर्षण का कारक।'
    }
  ];

  // 11. Personal Year Cycle
  const personalYearNum = calculatePersonalYear(ownerDob);
  const personalYearThemes: Record<number, { themeHi: string; oppHi: string; cautionHi: string }> = {
    1: {
      themeHi: 'नई शुरुआत, नए व्यवसाय की नींव, री-ब्रांडिंग और स्वतंत्र पहल का वर्ष।',
      oppHi: 'नए उत्पाद लॉन्च करना, नए बाजारों में प्रवेश और बड़े विजन पर काम शुरू करने का आदर्श समय।',
      cautionHi: 'अहंकार और अत्यधिक जल्दबाजी से बचें; दीर्घकालिक अनुबंधों की शर्तों को ध्यान से पढ़ें।'
    },
    2: {
      themeHi: 'साझेदारी, सहयोग, नेटवर्किंग और आंतरिक प्रणालियों के सुदृढ़ीकरण का वर्ष।',
      oppHi: 'रणनीतिक गठजोड़, नए क्लाइंट रिलेशंस और टीम में सामंजस्य स्थापित करने के अवसर।',
      cautionHi: 'संवेदनशील होकर भावनात्मक निर्णय न लें; सभी वित्तीय लेन-देन लिखित में रखें।'
    },
    3: {
      themeHi: 'विस्तार, रचनात्मकता, प्रचार, ज्ञान संवर्धन और सामाजिक प्रतिष्ठा का वर्ष।',
      oppHi: 'विपणन, पीआर अभियानों, नई शाखाओं के विस्तार और बौद्धिक संपदा से लाभ।',
      cautionHi: 'अत्यधिक आशावादी होकर बजट से बाहर खर्च करने से बचें; प्राथमिकताओं पर ध्यान केंद्रित रखें।'
    },
    4: {
      themeHi: 'कठोर परिश्रम, संरचनात्मक नींव, कानूनी अनुपालन और सिस्टम निर्माण का वर्ष।',
      oppHi: 'सॉफ्टवेयर अपग्रेड, अकाउंटिंग सिस्टम सुधार, एसओपी निर्माण और टीम का अनुशासन।',
      cautionHi: 'थकावट और मानसिक तनाव से बचें; शॉर्टकट अपनाने से कानूनी उलझन हो सकती है।'
    },
    5: {
      themeHi: 'तीव्र गति, परिवर्तन, विविधता, स्वतंत्रता और अप्रत्याशित विकास का वर्ष।',
      oppHi: 'नया मार्केटिंग अभियान, ई-कॉमर्स विस्तार, यात्राएं और व्यापारिक विविधीकरण।',
      cautionHi: 'अस्थिरता और ध्यान भटकने से बचें; एक समय में कई अप्रमाणित प्रोजेक्ट शुरू न करें।'
    },
    6: {
      themeHi: 'जिम्मेदारी, सेवा, ब्रांड सौंदर्य, ग्राहक निष्ठा और पारिवारिक/व्यापारिक संतुलन का वर्ष।',
      oppHi: 'प्रीमियम पैकेजिंग, ग्राहक सेवा में सुधार, ब्रांड की विलासिता बढ़ाना और लाभ का स्थिरीकरण।',
      cautionHi: 'अत्यधिक आरामपरस्त होने या केवल दिखावे पर खर्च करने से बचें।'
    },
    7: {
      themeHi: 'गहन विश्लेषण, गुणवत्ता परीक्षण, शोध, आंतरिक समीक्षा और रणनीतिक पुनर्गठन का वर्ष।',
      oppHi: 'उत्पाद की गुणवत्ता में सुधार, पेटेंट/कॉपीराइट, डेटा विश्लेषण और बैकएंड की मजबूती।',
      cautionHi: 'बड़ा वित्तीय सट्टा या अंधाधुंध नया निवेश करने से बचें; मौजूदा काम को परिपक्व बनाएं।'
    },
    8: {
      themeHi: 'कर्मफल, वित्तीय फसल, बड़े सौदे, अधिकार और व्यावसायिक विस्तार का वर्ष।',
      oppHi: 'पुराने प्रयासों का बड़ा आर्थिक लाभ, बड़े कॉर्पोरेट क्लाइंट्स और व्यावसायिक साम्राज्य का विस्तार।',
      cautionHi: 'अहंकार, लालच या नियमों की अनदेखी से बचें; न्यायसंगत और पारदर्शी कार्यप्रणाली रखें।'
    },
    9: {
      themeHi: 'पूर्णता, पुराने प्रोजेक्ट्स का समापन, गैर-लाभकारी गतिविधियों की छंटाई और नवीनीकरण का वर्ष।',
      oppHi: 'रुके हुए काम पूरे करना, इन्वेंट्री क्लीयरेंस और अगले 9-वर्षीय चक्र के लिए तैयारी।',
      cautionHi: 'इस वर्ष के अंत में बिना सोचे-समझे भारी जोखिम भरा नया उद्यम शुरू करने से बचें।'
    }
  };

  const pyData = personalYearThemes[personalYearNum] || personalYearThemes[1];

  // 12. Wealth Profile
  const wealthProfileData = {
    moneyMindsetHi: `संस्थापक के मूलांक #${ownerMulank} और ब्रांड के रूट #${root} का समन्वय व्यावहारिक दृष्टि से धन सृजन और प्रतिष्ठा पर केंद्रित है।`,
    spendingPatternHi: `व्यावसायिक विस्तार और साख निर्माण में निवेश को प्राथमिकता दी जाती है; अनावश्यक दिखावे वाले खर्चों पर नियंत्रण रखें।`,
    savingDisciplineHi: `आपातकालीन फंड और नकद प्रवाह का कम से कम 6 माह का बैकअप रखना व्यापारिक स्थिरता के लिए हितकर है।`,
    businessThinkingHi: `दीर्घकालिक मूल्य निर्माण, ग्राहकों का भरोसा और बाजार में मजबूत स्थिति कायम रखने की रणनीतिक सोच।`,
    riskStyleHi: root === 1 || root === 5 || root === 9 ? 'साहसिक व प्रगतिशील जोखिम क्षमता' : 'संतुलित, परिकलित और सुरक्षित जोखिम क्षमता',
    wealthCreationStyleHi: `उत्कृष्ट सेवा मानकों, व्यवस्थित ब्रांडिंग और बौद्धिक साख के माध्यम से स्थायी संपदा निर्माण।`,
    traditionalBusinessCautionsHi: `किसी भी वित्तीय सौदे में मौखिक भरोसे के बजाय स्पष्ट एग्रीमेंट और पारदर्शी ऑडिटिंग का पालन करें।`
  };

  // 13. Traditional Business Remedies
  const remediesData = {
    nameSpellingGuidanceHi:
      overallStatus === 'SUPPORTIVE'
        ? `वर्तमान व्यवसाय नाम '${bName}' का कम्पाउंड ${compound} पारंपरिक रूप से बहुत संतुलित है। इसमें किसी वर्तनी परिवर्तन की आवश्यकता नहीं है।`
        : `यदि आप वर्तनी में सूक्ष्म परिवर्तन करना चाहें, तो नाम को 23, 24, 32, 33, 37 या 42 जैसे शुभ कम्पाउंड पर लाने का प्रयास करें।`,
    officeDirectionVastuHi: `संस्थापक का केबिन दक्षिण-पश्चिम (South-West) में होना चाहिए और बैठते समय मुख उत्तर (North) या पूर्व (East) दिशा में रखें।`,
    workspaceArrangementHi: `कार्यालय की उत्तर दिशा (कुबेर स्थान) को साफ, हल्का और जल तत्व (जैसे छोटा पानी का फव्वारा या हरा पौधा) से सुसज्जित रखें।`,
    auspiciousBrandColorsHi: [
      grahaInfo.color,
      root === 5 ? 'Emerald Green / Light Blue' : root === 6 ? 'Diamond White / Soft Gold' : root === 1 ? 'Ruby Red / Royal Gold' : 'White / Navy Blue'
    ],
    contractSigningDaysHi: [
      grahaInfo.day,
      'बुधवार (Wednesday - Business Deals)',
      'गुरुवार (Thursday - Knowledge & Expansion)'
    ],
    traditionalCharityRemedyHi: `बुधवार को हरी मूंग की दाल या गाय को हरा चारा देना, तथा गुरुवार को विद्यार्थियों को पाठ्य सामग्री का दान करना व्यवसायिक समृद्धि के लिए शुभ माना जाता है।`,
    numberBalancingRemedyHi: `अपने विजिटिंग कार्ड और लेटरहेड के ऊपरी दाहिने कोने पर एक सकारात्मक ऊर्जावान लोगो या ॐ/स्वास्तिक/शुभ चिन्ह का प्रयोग करें।`
  };

  // 14. Executive Summary
  const summaryData = {
    primaryStrengthHi: `मजबूत ब्रांड पहचान, स्पष्ट विजन और ${grahaInfo.nameHi} द्वारा संचालित ऊर्जावान नेतृत्व।`,
    primaryCautionHi: `त्वरित विस्तार में गुणवत्ता मानकों और दैनिक नकद प्रवाह (Cash Flow) की अनदेखी से बचें।`,
    communicationToneHi: brandPersonalityData.communicationStyleHi,
    ownerHarmonyHi: synergySummaryHi,
    keyVastuGuidelineHi: `कार्यालय में स्वामी की सीट दक्षिण-पश्चिम में रखें तथा उत्तर दिशा को खुला व जल तत्व से समृद्ध रखें।`,
    practicalActionPointHi: `महत्वपूर्ण व्यावसायिक अनुबंधों व बड़े समझौतों पर हस्ताक्षर हेतु शुभ वार (${grahaInfo.day}) का चयन करें।`
  };

  return {
    entity: {
      businessName: bName,
      brandName: brandNameToUse,
      industry: input.industry,
      ownerName,
      ownerDob,
      ownerGender
    },
    chaldean: {
      letterBreakdown: chaldean.breakdown,
      totalCompound: compound,
      totalRoot: root,
      firstLetter,
      firstLetterValue,
      planetaryRuler: grahaInfo.nameEn,
      planetaryRulerHi: grahaInfo.nameHi,
      compoundTitle: compoundDetails?.title || `Compound Vibration ${compound}`,
      compoundMeaning: compoundDetails?.meaning || `Compound ${compound} reduces to single root ${root}.`,
      compoundPrediction: compoundDetails?.prediction || `Favorable energy for commerce.`,
      traditionalThemeHi: brandPersonalityData.traditionalThemeHi
    },
    branding: {
      brandNameUsed: brandNameToUse,
      brandCompound: compound,
      brandRoot: root,
      firstLetterVibrationHi: `प्रथम अक्षर '${firstLetter}' का चालडीन मान ${firstLetterValue} है, जो ब्रांड की शुरुआत में दृढ़ संकल्प और स्पष्ट दिशा को दर्शाता है।`,
      brandPersonalityHi: brandPersonalityData.brandPersonalityHi,
      communicationStyleHi: brandPersonalityData.communicationStyleHi,
      publicImageHi: brandPersonalityData.publicImageHi,
      leadershipToneHi: brandPersonalityData.leadershipToneHi,
      clientRelationshipStyleHi: brandPersonalityData.clientRelationshipStyleHi,
      businessEnvironmentHi: brandPersonalityData.businessEnvironmentHi,
      growthStyleHi: brandPersonalityData.growthStyleHi,
      traditionalMoneyVibrationHi: brandPersonalityData.traditionalMoneyVibrationHi
    },
    ownerProfile: {
      name: ownerName,
      dob: ownerDob,
      mulank: ownerMulank,
      bhagyank: ownerBhagyank,
      personalNameCompound: ownerPersonalNameChaldean.compound,
      personalNameRoot: ownerPersonalNameChaldean.root,
      mulankLord: ownerMulankLord,
      bhagyankLord: ownerBhagyankLord
    },
    ownerCompatibility: {
      overallStatus,
      overallScore: overallScoreNum,
      mulankCompatibility: mulankStatus,
      mulankScore: Math.round(mulankScore * 10),
      mulankExplanationHi,
      bhagyankCompatibility: bhagyankStatus,
      bhagyankScore: Math.round(bhagyankScore * 10),
      bhagyankExplanationHi,
      personalNameCompatibility: personalNameStatus,
      personalNameExplanationHi,
      synergySummaryHi
    },
    industryAnalysis: {
      selectedIndustry: input.industry,
      favorablePlanetsHi: industryMeta.planetsHi,
      alignmentLevel: industryAlignmentLevel,
      traditionalInterpretationHi: industryTraditionalInterpretationHi,
      industryTipsHi: industryMeta.adviceHi
    },
    partnerAnalysis: partnerAnalysisResult,
    mobileAnalysis: mobileAnalysisResult,
    addressAnalysis: addressAnalysisResult,
    domainAnalysis: domainAnalysisResult,
    nameCorrection: nameCorrectionResult,
    loshuOverlay: {
      birthGrid,
      businessSupportiveNumbers,
      dominantNumbers,
      missingNumbers,
      businessThemeHi: `लो शू ग्रिड के अनुसार, आपके जन्म चार्ट में व्यावसायिक स्थिरता (${birthGrid[5] > 0 ? '5 विद्यमान' : '5 अनुपस्थित'}), नेतृत्व (${birthGrid[1] > 0 ? '1 विद्यमान' : '1 अनुपस्थित'}) और संपत्ति निर्माण (${birthGrid[4] > 0 ? '4 विद्यमान' : '4 अनुपस्थित'}) की ऊर्जा परिलक्षित होती है।`
    },
    personalYear: {
      currentPersonalYear: personalYearNum,
      cycleThemeHi: pyData.themeHi,
      businessOpportunityHi: pyData.oppHi,
      businessCautionHi: pyData.cautionHi
    },
    wealthProfile: wealthProfileData,
    remedies: remediesData,
    summary: summaryData,
    disclaimer: `पारंपरिक अंकशास्त्रीय व्याख्या केवल आत्म-चिंतन, ऊर्जा संतुलन और सांस्कृतिक मान्यताओं पर आधारित मार्गदर्शन है। यह किसी भी व्यावसायिक लाभ, वित्तीय सफलता, बिक्री अथवा कानूनी अनुपालन की गारंटी नहीं देता है। सभी व्यावसायिक निर्णय अपने विवेक और पेशेवर सलाहकारों के मार्गदर्शन में लें।`
  };
}
