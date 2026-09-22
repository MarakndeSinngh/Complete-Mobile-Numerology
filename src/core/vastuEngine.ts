import { reduceToDigit, calculateMulank, calculateBhagyank } from './numerologyEngine';
import { calculateChaldeanEntitySum } from './chaldeanEngine';
import { calculateKuaNumber, KuaProfile, KuaDirectionItem } from './kuaEngine';
import { VASTU_ZONES, VastuDirectionZone } from './methodology/vastuDefinitions';
import { SOURCES } from './methodology/sourceRegistry';
import { parseIndianDate } from './dateUtils';
import { generateNumeroVaastuReport, NumeroVaastuReport } from '../services/numeroVaastuEngine';

export interface VastuInputs {
  dob: string;
  mulank?: number;
  bhagyank?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  houseNumber?: string;
  flatNumber?: string;
  floor?: string | number;
  buildingNumber?: string;
  entranceNumber?: string;
  facingDirection?: string;
  mobileNumber?: string;
  vehicleNumber?: string;
  missingNumbers?: number[];
}

export type PropertyCompatibilityStatus = 'SUPPORTIVE' | 'NEUTRAL' | 'NEEDS_ATTENTION';

export interface PropertyNumberAnalysis {
  label: string;
  rawInput: string;
  compound: number;
  root: number;
  rulingPlanet: string;
  element: string;
  compatibilityStatus: PropertyCompatibilityStatus;
  compatibilityLabel: string;
  explanationHindi: string;
  traditionalRemedy: string;
}

export interface DirectionAnalysisItem {
  direction: string;
  directionKey: string;
  hindiName: string;
  rulingPlanet: string;
  element: string;
  loShuDigit: number;
  lifeDomain: string;
  status: 'SUPPORTIVE' | 'NEUTRAL' | 'CAUTION';
  statusLabelHindi: string;
  kuaCategory?: string;
  kuaInfluence?: string;
  explanation: string;
  traditionalRemedy: string;
  favorableActivities: string[];
  unfavorableElements: string[];
}

export interface LoShuVastuFusionItem {
  digit: number;
  status: 'MISSING' | 'PRESENT';
  planetName: string;
  loShuTheme: string;
  associatedZone: string;
  associatedDirection: string;
  explanationHindi: string;
  balancingSuggestionHindi: string;
}

export interface WorkspaceVastuAnalysis {
  recommendedSittingDirection: string;
  sittingDirectionReasonHindi: string;
  careerZoneNorthGuidance: string;
  wealthZoneSouthEastGuidance: string;
  workEnvironmentBalancing: string[];
  traditionalWorkspaceRemedies: string[];
}

export interface HomeEnergyAssessment {
  overallHomeVibration: string;
  houseVibrationSummary?: string;
  flatVibrationSummary?: string;
  entranceVibrationSummary?: string;
  facingDirectionHarmonics?: string;
  kuaDirectionLayerSummary: string;
  careerAreaNorth: string;
  wealthAreaSouthEast: string;
  wellnessAreaEastNorthEast: string;
  relationshipAreaSouthWest: string;
  fameAreaSouth: string;
  traditionalBalancingSuggestions: string[];
}

export interface LayeredNumeroVastuReport {
  layer1_dobCore: {
    mulank: number;
    bhagyank: number;
    compoundDOBSum: number;
    dobHindiSummary: string;
  };
  layer2_loShuGrid: {
    missingDigits: number[];
    gridFusionNotes: LoShuVastuFusionItem[];
    fusionExplanationHindi: string;
  };
  layer3_kuaDirections: {
    kuaNumber: number;
    group: 'EAST_GROUP' | 'WEST_GROUP';
    groupLabelHindi: string;
    element: string;
    favorableDirections: KuaDirectionItem[];
    unfavorableDirections: KuaDirectionItem[];
    all8DirectionsDetailed: DirectionAnalysisItem[];
  };
  layer4_propertyNumbers: {
    houseNumber?: PropertyNumberAnalysis;
    flatNumber?: PropertyNumberAnalysis;
    buildingNumber?: PropertyNumberAnalysis;
    floorNumber?: PropertyNumberAnalysis;
    mainEntrance?: PropertyNumberAnalysis;
    facingDirection?: {
      direction: string;
      isFavorableWithKua: boolean;
      statusLabelHindi: string;
      explanationHindi: string;
      remedyHindi: string;
    };
  };
  layer5_traditionalRemedies: {
    homeRemedies: string[];
    officeRemedies: string[];
    directionalRemedies: string[];
    colourHarmonization: {
      luckyColours: string[];
      balanceColours: string[];
      avoidColours: string[];
      roomGuidance: string;
    };
    environmentalAdjustments: string[];
    traditionalObjects: string[];
    botanicalAndPlants: string[];
    charityAndLifestyle: string[];
    disclaimer: string;
  };
}

export interface UnifiedVastuAnalysis {
  methodology: string;
  sourceCitation: {
    document: string;
    author: string;
    topic: string;
  };
  kuaNumber: number;
  groupType: 'EAST_GROUP' | 'WEST_GROUP';
  groupDescription: string;
  
  // Directions summary
  compatibleDirections: { direction: string; element: string; influence: string; score: number }[];
  supportiveDirections: { direction: string; element: string; influence: string; score: number }[];
  neutralDirections: { direction: string; element: string; influence: string; score: number }[];
  cautionDirections: { direction: string; element: string; influence: string; score: number }[];
  
  // Detailed 8 Directions + Center
  directionsAnalysis: DirectionAnalysisItem[];
  
  // Core Functional Vastu Zones
  zonesSummary: {
    careerZone: { zone: string; direction: string; element: string; status: string; hindiGuidance: string; remedy: string };
    wealthZone: { zone: string; direction: string; element: string; status: string; hindiGuidance: string; remedy: string };
    healthZone: { zone: string; direction: string; element: string; status: string; hindiGuidance: string; remedy: string };
    relationshipZone: { zone: string; direction: string; element: string; status: string; hindiGuidance: string; remedy: string };
    fameZone: { zone: string; direction: string; element: string; status: string; hindiGuidance: string; remedy: string };
    successZone: { zone: string; direction: string; element: string; status: string; hindiGuidance: string; remedy: string };
  };

  // Property Analysis
  propertyAnalysis: {
    house?: PropertyNumberAnalysis;
    flat?: PropertyNumberAnalysis;
    building?: PropertyNumberAnalysis;
    floor?: PropertyNumberAnalysis;
    entrance?: PropertyNumberAnalysis;
    facing?: {
      direction: string;
      isFavorable: boolean;
      statusLabelHindi: string;
      explanationHindi: string;
      remedyHindi: string;
    };
  };

  // Dedicated Workspace Analysis
  workspaceVastu: WorkspaceVastuAnalysis;

  // Dedicated Home Energy Assessment
  homeEnergyAssessment: HomeEnergyAssessment;

  // Lo Shu + Vastu Fusion
  loShuVastuFusion: LoShuVastuFusionItem[];

  // 5-Layered Master Structure
  layeredReport: LayeredNumeroVastuReport;

  // Legacy/Compatibility fields
  houseNumberVibration?: {
    raw: string;
    compound: number;
    root: number;
    harmony: string;
    description: string;
  };
  entranceVibration?: {
    raw: string;
    root: number;
    description: string;
  };
  facingDirectionAnalysis?: {
    facing: string;
    isAuspicious: boolean;
    recommendation: string;
  };
  balanceRecommendations: string[];
  traditionalRemedySuggestions: string[];
  zonesReport: NumeroVaastuReport['zonesReport'];
  colourCorrection: NumeroVaastuReport['colourCorrection'];
}

// PLANETARY MAPPINGS FOR PROPERTY NUMBERS (1-9)
const PROPERTY_PLANET_MAP: Record<number, { planet: string; element: string; hindiTraits: string; defaultRemedy: string }> = {
  1: {
    planet: 'Sun (सूर्य)',
    element: 'Fire / Light',
    hindiTraits: 'नेतृत्व, आत्मविश्वास, प्रशासनिक प्रतिष्ठा और नई शुरुआत के लिए शुभ ऊर्जा।',
    defaultRemedy: 'मुख्य द्वार पर पीतल का सूर्य या हल्का पीला बल्ब लगाएं; पूर्व दिशा को स्वच्छ रखें।'
  },
  2: {
    planet: 'Moon (चंद्रमा)',
    element: 'Water',
    hindiTraits: 'मानसिक शांति, भावनात्मक सौहार्द, पारिवारिक अपनापन और कलात्मक संवेदना।',
    defaultRemedy: 'उत्तर दिशा में चांदी के बर्तन में गंगाजल रखें; परिवार के बुजुर्गों का सम्मान करें।'
  },
  3: {
    planet: 'Jupiter (गुरु)',
    element: 'Wood / Ether',
    hindiTraits: 'ज्ञान, समृद्धि, आध्यात्मिक विस्तार, कानूनी सुरक्षा और शिक्षण/परामर्श में उन्नति।',
    defaultRemedy: 'ईशान कोण में लकड़ी का ॐ या स्वास्तिक स्थापित करें और पीले फूलों से सजावट करें।'
  },
  4: {
    planet: 'Rahu (राहु)',
    element: 'Wood / Sudden Energy',
    hindiTraits: 'तकनीकी दक्षता, लीक से हटकर सोच और तीव्र गति, परंतु अप्रत्याशित खर्चे या भ्रम का जोखिम।',
    defaultRemedy: 'मुख्य द्वार पर तांबे का पिरामिड लगाएं और घर में बिजली के तारों/उपकरणों को व्यवस्थित रखें।'
  },
  5: {
    planet: 'Mercury (बुध)',
    element: 'Earth / Commercial Chi',
    hindiTraits: 'व्यापारिक गति, उत्तम संचार, नेटवर्किंग, त्वरित आर्थिक लेन-देन और बहुमुखी प्रतिभा।',
    defaultRemedy: 'उत्तर दिशा में हरा मनी प्लांट लगाएं और बुधवार को पक्षियों को दाना या गाय को हरी घास दें।'
  },
  6: {
    planet: 'Venus (शुक्र)',
    element: 'Metal / Luxury',
    hindiTraits: 'वैवाहिक सुख, विलासिता, ऐश्वर्य, सौंदर्य और मांगलिक पारिवारिक उत्सव।',
    defaultRemedy: 'मुख्य द्वार को हमेशा सुगंधित रखें; उत्तर-पश्चिम या दक्षिण-पूर्व में हल्के पेस्टल रंग लगाएं।'
  },
  7: {
    planet: 'Ketu (केतु)',
    element: 'Metal / Mystical',
    hindiTraits: 'गहन शोध, एकाग्रता, आंतरिक चिंतन और आध्यात्मिक साधना, पर सामाजिक अलगाव की संभावना।',
    defaultRemedy: 'अध्ययन कक्ष में एमेथिस्ट क्रिस्टल रखें और पूजा स्थल में नियमित कपूर की आरती करें।'
  },
  8: {
    planet: 'Saturn (शनि)',
    element: 'Earth / Iron',
    hindiTraits: 'दीर्घकालिक संपत्ति निर्माण, कठिन परिश्रम, संगठन शक्ति और अनुशासित विकास।',
    defaultRemedy: 'पश्चिम दिशा में शनिवार की शाम तिल के तेल का दीपक जलाएं और मुख्य दहलीज साफ रखें।'
  },
  9: {
    planet: 'Mars (मंगल)',
    element: 'Fire',
    hindiTraits: 'पराक्रम, शारीरिक स्फूर्ति, दृढ़ संकल्प और बड़े लक्ष्यों की प्राप्ति, पर उत्तेजना में सावधानी।',
    defaultRemedy: 'दक्षिण दिशा में तांबे का स्वास्तिक लगाएं; रसोई के आग्नेय कोण को साफ व सूखा रखें।'
  }
};

// COMPATIBILITY BETWEEN PROPERTY ROOT AND MULANK/BHAGYANK
function evaluatePropertyCompatibility(
  propRoot: number,
  mulank: number,
  bhagyank: number
): { status: PropertyCompatibilityStatus; labelHindi: string; explanation: string; remedy: string } {
  // Friends and Friendly associations in traditional Indian numerology
  const friendlyMap: Record<number, number[]> = {
    1: [1, 2, 3, 5, 9],
    2: [1, 2, 3, 5],
    3: [1, 2, 3, 5, 7, 9],
    4: [1, 4, 5, 6, 7, 8],
    5: [1, 2, 3, 5, 6],
    6: [4, 5, 6, 7, 8],
    7: [1, 3, 5, 6, 7],
    8: [3, 5, 6, 7, 8],
    9: [1, 2, 3, 5, 9]
  };

  const hostileMap: Record<number, number[]> = {
    1: [6, 8],
    2: [4, 8, 9],
    3: [6],
    4: [2, 9],
    5: [], // Mercury is generally neutral/friendly
    6: [1, 3],
    7: [9],
    8: [1, 2, 4, 9],
    9: [2, 4, 6, 8]
  };

  const isFriendlyWithMulank = friendlyMap[mulank]?.includes(propRoot);
  const isFriendlyWithBhagyank = friendlyMap[bhagyank]?.includes(propRoot);
  const isHostileWithMulank = hostileMap[mulank]?.includes(propRoot);
  const isHostileWithBhagyank = hostileMap[bhagyank]?.includes(propRoot);

  if (isFriendlyWithMulank && isFriendlyWithBhagyank) {
    return {
      status: 'SUPPORTIVE',
      labelHindi: 'अनुकूल (Supportive)',
      explanation: `प्रॉपर्टी का रूट अंक #${propRoot} आपके मूलांक #${mulank} और भाग्यांक #${bhagyank} दोनों के साथ सकारात्मक सामंजस्य रखता है। यह निवास स्थान आपके करियर और पारिवारिक जीवन में प्रगतिशील ऊर्जा प्रदान करेगा।`,
      remedy: 'दिशा की सकारात्मक ऊर्जा को बनाए रखने के लिए मुख्य प्रवेश द्वार को स्वच्छ और प्रकाशित रखें।'
    };
  } else if (isHostileWithMulank || isHostileWithBhagyank) {
    return {
      status: 'NEEDS_ATTENTION',
      labelHindi: 'सावधानी / ध्यान देने योग्य (Needs Attention)',
      explanation: `प्रॉपर्टी का रूट अंक #${propRoot} आपके चार्ट (${isHostileWithMulank ? `मूलांक #${mulank}` : `भाग्यांक #${bhagyank}`}) के साथ विरोधी कंपन (Opposing Vibration) बनाता है। इसके कारण कभी-कभी मानसिक तनाव या अप्रत्याशित कार्यों में देरी हो सकती है।`,
      remedy: 'मुख्य द्वार की चौखट पर पीतल या तांबे का स्वास्तिक/पिरामिड लगाएं और नेमप्लेट पर अपने शुभ ग्रह का रंग इस्तेमाल करें।'
    };
  } else {
    return {
      status: 'NEUTRAL',
      labelHindi: 'तटस्थ (Neutral)',
      explanation: `प्रॉपर्टी का रूट अंक #${propRoot} आपके मूलांक #${mulank} और भाग्यांक #${bhagyank} के साथ सामान्य संतुलन बनाए रखता है। नियमित सकारात्मक दिनचर्या और उचित प्रकाश व्यवस्था से ऊर्जा बेहतर बनी रहेगी।`,
      remedy: 'प्रवेश द्वार पर हल्के पीले या सफेद बल्ब की रोशनी रखें और गुरुवार/शुक्रवार को गूगल या लोबान की धूप दें।'
    };
  }
}

// ANALYZE PROPERTY STRING
export function analyzePropertyEntity(
  label: string,
  rawStr: string,
  mulank: number,
  bhagyank: number
): PropertyNumberAnalysis {
  if (!rawStr || !rawStr.trim()) {
    return {
      label,
      rawInput: 'N/A',
      compound: 0,
      root: 0,
      rulingPlanet: 'N/A',
      element: 'N/A',
      compatibilityStatus: 'NEUTRAL',
      compatibilityLabel: 'तटस्थ (Not Specified)',
      explanationHindi: `${label} दर्ज नहीं किया गया है।`,
      traditionalRemedy: 'निवास स्थान के मुख्य द्वार पर शुभ स्वास्तिक चिन्ह लगाएं।'
    };
  }

  const { compound, root } = calculateChaldeanEntitySum(rawStr);
  const effectiveRoot = root || 1;
  const planetInfo = PROPERTY_PLANET_MAP[effectiveRoot] || PROPERTY_PLANET_MAP[1];
  const compat = evaluatePropertyCompatibility(effectiveRoot, mulank, bhagyank);

  return {
    label,
    rawInput: rawStr,
    compound,
    root: effectiveRoot,
    rulingPlanet: planetInfo.planet,
    element: planetInfo.element,
    compatibilityStatus: compat.status,
    compatibilityLabel: compat.labelHindi,
    explanationHindi: `${label} "${rawStr}" का Chaldean संयुक्त योग ${compound} है, जो एकल अंक #${effectiveRoot} (${planetInfo.planet}) पर आता है। ${planetInfo.hindiTraits} ${compat.explanation}`,
    traditionalRemedy: compat.remedy || planetInfo.defaultRemedy
  };
}

// LO SHU + NUMERO VASTU FUSION BUILDER
export function buildLoShuVastuFusion(
  missingNumbers: number[],
  birthGrid: Record<number, number>
): LoShuVastuFusionItem[] {
  const DIGIT_VASTU_FUSION: Record<number, {
    planet: string;
    theme: string;
    zone: string;
    direction: string;
    remedy: string;
  }> = {
    1: {
      planet: 'Sun (सूर्य) / Water Chi',
      theme: 'करियर के नए अवसर, संचार और स्वतंत्र निर्णय क्षमता',
      zone: 'Career & Opportunities Zone',
      direction: 'उत्तर (North)',
      remedy: 'उत्तर दिशा में कांच के बाउल में स्वच्छ जल रखें; बहते पानी या फव्वारे का चित्र लगाएं; नीले या हरे रंग का उपयोग करें।'
    },
    2: {
      planet: 'Moon (चंद्रमा) / Earth Chi',
      theme: 'पारिवारिक सौहार्द, भावनात्मक संतुलन और साझेदारी',
      zone: 'Relationship & Stability Zone',
      direction: 'दक्षिण-पश्चिम (South-West)',
      remedy: 'नैऋत्य (South-West) कोण में भारी पीली वस्तुएं या क्रिस्टल बॉल्स रखें; इस कोने को भारी व ऊंचा रखें; भूमिगत जल न रखें।'
    },
    3: {
      planet: 'Jupiter (गुरु) / Wood Chi',
      theme: 'पारिवारिक सुख, ज्ञान, सामाजिक मान-सम्मान और स्वास्थ्य',
      zone: 'Family & Health Zone',
      direction: 'पूर्व (East)',
      remedy: 'पूर्व की दीवार पर तांबे का सूर्य यंत्र लगाएं; हरे इनडोर पौधे (जैसे तुलसी या मनी प्लांट) रखें; लकड़ी का फर्नीचर रखें।'
    },
    4: {
      planet: 'Rahu (राहु) / Wood Chi',
      theme: 'नकद तरलता (Cash Flow), व्यावहारिक अनुशासन और संगठनात्मक दक्षता',
      zone: 'Wealth & Prosperity Zone',
      direction: 'दक्षिण-पूर्व (South-East)',
      remedy: 'आग्नेय (South-East) कोण में हरा मनी प्लांट या कपूर डिफ्यूज़र रखें; इस दिशा में लाल या गुलाबी नाइट लैंप का उपयोग करें।'
    },
    5: {
      planet: 'Mercury (बुध) / Earth Chi',
      theme: 'जीवन का समग्र संतुलन, स्थिरता और आंतरिक ऊर्जा',
      zone: 'Brahmasthan (ब्रह्मस्थान)',
      direction: 'मध्य केंद्र (Center)',
      remedy: 'घर के बिल्कुल केंद्र (नाभि स्थान) को हमेशा खाली, हल्का, स्वच्छ और खुला रखें; यहाँ भारी वजन या सीढ़ियां न बनाएं।'
    },
    6: {
      planet: 'Venus (शुक्र) / Metal Chi',
      theme: 'मददगार मित्र, बैंकिंग सहायता, विदेश यात्रा और विलासिता',
      zone: 'Helpful People & Travel Zone',
      direction: 'उत्तर-पश्चिम (North-West)',
      remedy: 'वायव्य (North-West) कोण में धातु की विंड चाइम (Metallic Wind Chime) लगाएं; सफेद, क्रीम या सिल्वर रंग का उपयोग करें।'
    },
    7: {
      planet: 'Ketu (केतु) / Metal Chi',
      theme: 'संतान सुख, रचनात्मक क्षमता और आत्म-चिंतन',
      zone: 'Creativity & Children Zone',
      direction: 'पश्चिम (West)',
      remedy: 'पश्चिम दिशा में 6 रॉड वाली धातु की विंड चाइम लगाएं; सफेद या स्लेटी सजावटी सामान रखें; धातु के गोल फ्रेम की पेंटिंग लगाएं।'
    },
    8: {
      planet: 'Saturn (शनि) / Earth Chi',
      theme: 'बौद्धिक स्पष्टता, शिक्षा, अंतर्ज्ञान और आध्यात्मिक साधना',
      zone: 'Wisdom & Knowledge Zone',
      direction: 'उत्तर-पूर्व (North-East)',
      remedy: 'ईशान कोण में क्रिस्टल पिरामिड या तांबे के पात्र में गंगाजल रखें; पूजा घर या शांत अध्ययन कक्ष इस दिशा में स्थापित करें।'
    },
    9: {
      planet: 'Mars (मंगल) / Fire Chi',
      theme: 'प्रसिद्धि, सामाजिक प्रतिष्ठा, यश और आत्मविश्वास',
      zone: 'Fame & Reputation Zone',
      direction: 'दक्षिण (South)',
      remedy: 'दक्षिण दीवार पर अपने पुरस्कार, प्रशस्ति पत्र या लाल फ्रेम वाली तस्वीर लगाएं; सिंदूरी या लाल रंग की कलाकृतियों का उपयोग करें।'
    }
  };

  const results: LoShuVastuFusionItem[] = [];

  for (let digit = 1; digit <= 9; digit++) {
    const isMissing = missingNumbers.includes(digit) || !(birthGrid[digit] > 0);
    const info = DIGIT_VASTU_FUSION[digit];

    if (isMissing) {
      results.push({
        digit,
        status: 'MISSING',
        planetName: info.planet,
        loShuTheme: info.theme,
        associatedZone: info.zone,
        associatedDirection: info.direction,
        explanationHindi: `आपकी Birth Grid में अंक #${digit} अनुपस्थित (Missing) है। Traditional numerology में अंक #${digit} को ${info.theme} से जोड़ा जाता है। Numero Vastu layer में इससे संबंधित दिशा ${info.direction} (${info.zone}) को संतुलित करके इस ऊर्जा को सुधारा जा सकता है।`,
        balancingSuggestionHindi: info.remedy
      });
    } else {
      results.push({
        digit,
        status: 'PRESENT',
        planetName: info.planet,
        loShuTheme: info.theme,
        associatedZone: info.zone,
        associatedDirection: info.direction,
        explanationHindi: `आपकी Birth Grid में अंक #${digit} उपस्थित है। यह दिशा ${info.direction} (${info.zone}) प्राकृतिक रूप से सकारात्मक कंपन प्रदान कर रही है।`,
        balancingSuggestionHindi: `इस दिशा (${info.direction}) में स्वच्छता और नियमित प्रकाश व्यवस्था बनाए रखें ताकि ऊर्जा का प्रवाह निर्बाध रहे।`
      });
    }
  }

  return results;
}

// MAIN ENTRY FUNCTION: analyzeNumeroVastu
export function analyzeNumeroVastu(inputs: VastuInputs): UnifiedVastuAnalysis {
  const {
    dob,
    gender = 'MALE',
    houseNumber = '',
    flatNumber = '',
    floor = '',
    buildingNumber = '',
    entranceNumber = '',
    facingDirection = 'North',
    mobileNumber = '',
    vehicleNumber = '',
    missingNumbers = []
  } = inputs;

  const parsedDate = parseIndianDate(dob);
  const birthYear = parsedDate.isValid ? parsedDate.year : 1990;
  const mulank = inputs.mulank || calculateMulank(dob);
  const bhagyank = inputs.bhagyank || calculateBhagyank(dob);
  const compoundDOBSum = parsedDate.isValid ? parsedDate.digits.reduce((acc, d) => acc + d, 0) : 10;

  // 1. KUA CALCULATION (Strictly called "Kua Number")
  const kuaProfile: KuaProfile = calculateKuaNumber(birthYear, gender);
  const isEastGroup = kuaProfile.group === 'EAST_GROUP';
  const groupType = isEastGroup ? 'EAST_GROUP' : 'WEST_GROUP';
  const groupDescription = isEastGroup
    ? `ईस्ट ग्रुप (East Group): आपकी ऊर्जा पूर्व (East), आग्नेय (South-East), उत्तर (North) और दक्षिण (South) दिशाओं के साथ गहरा सामंजस्य रखती है। अपने वर्कस्पेस और मुख्य गतिविधियों को इन दिशाओं के अनुकूल रखने से कार्य में गति और समृद्धि मिलती है।`
    : `वेस्ट ग्रुप (West Group): आपकी ऊर्जा पश्चिम (West), वायव्य (North-West), नैऋत्य (South-West) और ईशान (North-East) दिशाओं के साथ अनुकूल है। रुकावटों से बचने और स्थिरता पाने के लिए अपने बैठने और कार्य करने का स्थान इन्हीं दिशाओं में रखें।`;

  // 2. DIRECTIONAL DETAILED MAPPINGS (8 Directions + Center Brahmasthan)
  const eastDirs = ['North', 'East', 'South-East', 'South'];
  const westDirs = ['North-East', 'North-West', 'South-West', 'West'];
  const favorableDirs = isEastGroup ? eastDirs : westDirs;

  const all8DirectionsDetailed: DirectionAnalysisItem[] = [
    {
      direction: 'North',
      directionKey: 'NORTH',
      hindiName: VASTU_ZONES.NORTH.hindiName,
      rulingPlanet: VASTU_ZONES.NORTH.rulingPlanet,
      element: VASTU_ZONES.NORTH.element,
      loShuDigit: VASTU_ZONES.NORTH.loShuDigit,
      lifeDomain: VASTU_ZONES.NORTH.lifeDomain,
      status: favorableDirs.includes('North') ? 'SUPPORTIVE' : 'NEUTRAL',
      statusLabelHindi: favorableDirs.includes('North') ? 'अत्यंत शुभ (Supportive)' : 'तटस्थ (Neutral Balance)',
      kuaCategory: isEastGroup ? 'Sheng Chi / Fu Wei (Auspicious)' : 'Caution Flow',
      kuaInfluence: isEastGroup ? 'करियर, पदोन्नति और नकद प्रवाह में तीव्र वृद्धि।' : 'सामान्य वित्तीय स्थिति, उपाय द्वारा ऊर्जा संवर्धन संभव।',
      explanation: 'उत्तर दिशा धन के देवता कुबेर और बुध/सूर्य की जल ऊर्जा का केंद्र है। यह करियर में नए अवसरों और वित्तीय तरलता को नियंत्रित करती है।',
      traditionalRemedy: VASTU_ZONES.NORTH.remedy,
      favorableActivities: VASTU_ZONES.NORTH.favorableActivities,
      unfavorableElements: VASTU_ZONES.NORTH.unfavorableElements
    },
    {
      direction: 'North-East',
      directionKey: 'NORTH_EAST',
      hindiName: VASTU_ZONES.NORTH_EAST.hindiName,
      rulingPlanet: VASTU_ZONES.NORTH_EAST.rulingPlanet,
      element: VASTU_ZONES.NORTH_EAST.element,
      loShuDigit: VASTU_ZONES.NORTH_EAST.loShuDigit,
      lifeDomain: VASTU_ZONES.NORTH_EAST.lifeDomain,
      status: favorableDirs.includes('North-East') ? 'SUPPORTIVE' : 'NEUTRAL',
      statusLabelHindi: favorableDirs.includes('North-East') ? 'अत्यंत शुभ (Supportive)' : 'तटस्थ (Neutral Balance)',
      kuaCategory: !isEastGroup ? 'Sheng Chi (Wealth & Intellect)' : 'Spiritual Axis',
      kuaInfluence: !isEastGroup ? 'सर्वोच्च सफलता, गहन बौद्धिक क्षमता और निर्णय शुद्धि।' : 'आध्यात्मिक शांति और मानसिक स्पष्टता का केंद्र।',
      explanation: 'ईशान कोण देव स्थान है। यह मानसिक स्पष्टता, अंतर्ज्ञान, ईश्वरीय कृपा और शिक्षा के लिए सर्वोत्तम दिशा मानी गई है।',
      traditionalRemedy: VASTU_ZONES.NORTH_EAST.remedy,
      favorableActivities: VASTU_ZONES.NORTH_EAST.favorableActivities,
      unfavorableElements: VASTU_ZONES.NORTH_EAST.unfavorableElements
    },
    {
      direction: 'East',
      directionKey: 'EAST',
      hindiName: VASTU_ZONES.EAST.hindiName,
      rulingPlanet: VASTU_ZONES.EAST.rulingPlanet,
      element: VASTU_ZONES.EAST.element,
      loShuDigit: VASTU_ZONES.EAST.loShuDigit,
      lifeDomain: VASTU_ZONES.EAST.lifeDomain,
      status: favorableDirs.includes('East') ? 'SUPPORTIVE' : 'NEUTRAL',
      statusLabelHindi: favorableDirs.includes('East') ? 'अत्यंत शुभ (Supportive)' : 'तटस्थ (Neutral Balance)',
      kuaCategory: isEastGroup ? 'Tian Yi / Fu Wei (Health & Harmony)' : 'Secondary Axis',
      kuaInfluence: isEastGroup ? 'दीर्घायु, शारीरिक स्वास्थ्य और सामाजिक प्रतिष्ठा में वृद्धि।' : 'सामान्य सामाजिक संपर्क, स्वच्छता आवश्यक।',
      explanation: 'पूर्व दिशा सूर्य और इंद्र देव का स्थान है। यह सामाजिक संपर्कों, शारीरिक जीवन शक्ति और मान-सम्मान का विस्तार करती है।',
      traditionalRemedy: VASTU_ZONES.EAST.remedy,
      favorableActivities: VASTU_ZONES.EAST.favorableActivities,
      unfavorableElements: VASTU_ZONES.EAST.unfavorableElements
    },
    {
      direction: 'South-East',
      directionKey: 'SOUTH_EAST',
      hindiName: VASTU_ZONES.SOUTH_EAST.hindiName,
      rulingPlanet: VASTU_ZONES.SOUTH_EAST.rulingPlanet,
      element: VASTU_ZONES.SOUTH_EAST.element,
      loShuDigit: VASTU_ZONES.SOUTH_EAST.loShuDigit,
      lifeDomain: VASTU_ZONES.SOUTH_EAST.lifeDomain,
      status: favorableDirs.includes('South-East') ? 'SUPPORTIVE' : 'NEUTRAL',
      statusLabelHindi: favorableDirs.includes('South-East') ? 'अत्यंत शुभ (Supportive)' : 'तटस्थ (Neutral Balance)',
      kuaCategory: isEastGroup ? 'Sheng Chi / Yan Nian (Prosperity)' : 'Energy Balance',
      kuaInfluence: isEastGroup ? 'अखंड धन आगमन, व्यापारिक विस्तार और पारिवारिक खुशहाली।' : 'अग्नि तत्व संतुलन, रसोई व्यवस्था उत्तम रखें।',
      explanation: 'आग्नेय कोण शुक्र और अग्नि देव का स्थान है। यह घर में नकद तरलता, महिलाओं के स्वास्थ्य और भौतिक समृद्धि को नियंत्रित करता है।',
      traditionalRemedy: VASTU_ZONES.SOUTH_EAST.remedy,
      favorableActivities: VASTU_ZONES.SOUTH_EAST.favorableActivities,
      unfavorableElements: VASTU_ZONES.SOUTH_EAST.unfavorableElements
    },
    {
      direction: 'South',
      directionKey: 'SOUTH',
      hindiName: VASTU_ZONES.SOUTH.hindiName,
      rulingPlanet: VASTU_ZONES.SOUTH.rulingPlanet,
      element: VASTU_ZONES.SOUTH.element,
      loShuDigit: VASTU_ZONES.SOUTH.loShuDigit,
      lifeDomain: VASTU_ZONES.SOUTH.lifeDomain,
      status: favorableDirs.includes('South') ? 'SUPPORTIVE' : 'NEUTRAL',
      statusLabelHindi: favorableDirs.includes('South') ? 'अत्यंत शुभ (Supportive)' : 'तटस्थ (Neutral Balance)',
      kuaCategory: isEastGroup ? 'Yan Nian / Sheng Chi (Fame)' : 'Stability Axis',
      kuaInfluence: isEastGroup ? 'ब्रांड पहचान, सार्वजनिक यश और कानूनी विजय।' : 'ठोस दीवार व विश्राम हेतु भारी व्यवस्था रखें।',
      explanation: 'दक्षिण दिशा मंगल ग्रह की अग्नि ऊर्जा का स्थान है। यह समाज में प्रसिद्धि, यश, प्रतिष्ठा और आत्मविश्वास प्रदान करती है।',
      traditionalRemedy: VASTU_ZONES.SOUTH.remedy,
      favorableActivities: VASTU_ZONES.SOUTH.favorableActivities,
      unfavorableElements: VASTU_ZONES.SOUTH.unfavorableElements
    },
    {
      direction: 'South-West',
      directionKey: 'SOUTH_WEST',
      hindiName: VASTU_ZONES.SOUTH_WEST.hindiName,
      rulingPlanet: VASTU_ZONES.SOUTH_WEST.rulingPlanet,
      element: VASTU_ZONES.SOUTH_WEST.element,
      loShuDigit: VASTU_ZONES.SOUTH_WEST.loShuDigit,
      lifeDomain: VASTU_ZONES.SOUTH_WEST.lifeDomain,
      status: favorableDirs.includes('South-West') ? 'SUPPORTIVE' : 'NEUTRAL',
      statusLabelHindi: favorableDirs.includes('South-West') ? 'अत्यंत शुभ (Supportive)' : 'तटस्थ (Neutral Balance)',
      kuaCategory: !isEastGroup ? 'Fu Wei / Yan Nian (Harmony)' : 'Anchor Zone',
      kuaInfluence: !isEastGroup ? 'पारिवारिक एकता, दांपत्य मधुरता और नेतृत्व शक्ति।' : 'घर के मुखिया का बेडरूम भारी व सुरक्षित रखें।',
      explanation: 'नैऋत्य कोण पृथ्वी तत्व और पितृ स्थान है। यह पारिवारिक स्थिरता, रिश्तों में मधुरता और वित्तीय ठहराव प्रदान करता है।',
      traditionalRemedy: VASTU_ZONES.SOUTH_WEST.remedy,
      favorableActivities: VASTU_ZONES.SOUTH_WEST.favorableActivities,
      unfavorableElements: VASTU_ZONES.SOUTH_WEST.unfavorableElements
    },
    {
      direction: 'West',
      directionKey: 'WEST',
      hindiName: VASTU_ZONES.WEST.hindiName,
      rulingPlanet: VASTU_ZONES.WEST.rulingPlanet,
      element: VASTU_ZONES.WEST.element,
      loShuDigit: VASTU_ZONES.WEST.loShuDigit,
      lifeDomain: VASTU_ZONES.WEST.lifeDomain,
      status: favorableDirs.includes('West') ? 'SUPPORTIVE' : 'NEUTRAL',
      statusLabelHindi: favorableDirs.includes('West') ? 'अत्यंत शुभ (Supportive)' : 'तटस्थ (Neutral Balance)',
      kuaCategory: !isEastGroup ? 'Tian Yi (Vitality & Gains)' : 'Metal Harmony',
      kuaInfluence: !isEastGroup ? 'आर्थिक लाभ, बच्चों की पढ़ाई और रचनात्मक सफलता।' : 'विंड चाइम लगाएं और धातु तत्व संतुलित रखें।',
      explanation: 'पश्चिम दिशा वरुण देव और शनि/केतु की धातु ऊर्जा का स्थान है। यह संतान सुख, रचनात्मकता और व्यापारिक लाभ आकर्षित करती है।',
      traditionalRemedy: VASTU_ZONES.WEST.remedy,
      favorableActivities: VASTU_ZONES.WEST.favorableActivities,
      unfavorableElements: VASTU_ZONES.WEST.unfavorableElements
    },
    {
      direction: 'North-West',
      directionKey: 'NORTH_WEST',
      hindiName: VASTU_ZONES.NORTH_WEST.hindiName,
      rulingPlanet: VASTU_ZONES.NORTH_WEST.rulingPlanet,
      element: VASTU_ZONES.NORTH_WEST.element,
      loShuDigit: VASTU_ZONES.NORTH_WEST.loShuDigit,
      lifeDomain: VASTU_ZONES.NORTH_WEST.lifeDomain,
      status: favorableDirs.includes('North-West') ? 'SUPPORTIVE' : 'NEUTRAL',
      statusLabelHindi: favorableDirs.includes('North-West') ? 'अत्यंत शुभ (Supportive)' : 'तटस्थ (Neutral Balance)',
      kuaCategory: !isEastGroup ? 'Yan Nian / Helpful Mentors' : 'Air Flow',
      kuaInfluence: !isEastGroup ? 'सच्चे मार्गदर्शक, बैंक लोन सहायता और विदेश यात्रा के योग।' : 'अतिथि कक्ष या तैयार माल का भंडार रखें।',
      explanation: 'वायव्य कोण वायु देव और चंद्रमा/शुक्र की ऊर्जा का केंद्र है। यह समाज से मदद, नेटवर्किंग और जीवन में गतिशीलता लाता है।',
      traditionalRemedy: VASTU_ZONES.NORTH_WEST.remedy,
      favorableActivities: VASTU_ZONES.NORTH_WEST.favorableActivities,
      unfavorableElements: VASTU_ZONES.NORTH_WEST.unfavorableElements
    },
    {
      direction: 'Center (Brahmasthan)',
      directionKey: 'CENTER',
      hindiName: VASTU_ZONES.CENTER.hindiName,
      rulingPlanet: VASTU_ZONES.CENTER.rulingPlanet,
      element: VASTU_ZONES.CENTER.element,
      loShuDigit: VASTU_ZONES.CENTER.loShuDigit,
      lifeDomain: VASTU_ZONES.CENTER.lifeDomain,
      status: 'SUPPORTIVE',
      statusLabelHindi: 'समग्र प्राण ऊर्जा केंद्र (Universal Equilibrium)',
      kuaCategory: 'Brahma Sthan (Cosmic Core)',
      kuaInfluence: 'पूरे भवन में ऊर्जा का निरंतर संतुलन और सुख-समृद्धि का संचार।',
      explanation: 'ब्रह्मस्थान भवन की नाभि है। इसे हमेशा खुला, स्वच्छ और हल्का रखना चाहिए ताकि ऊर्जा का संचार निर्बाध बना रहे।',
      traditionalRemedy: VASTU_ZONES.CENTER.remedy,
      favorableActivities: VASTU_ZONES.CENTER.favorableActivities,
      unfavorableElements: VASTU_ZONES.CENTER.unfavorableElements
    }
  ];

  // 3. PROPERTY NUMBERS ANALYSIS (Chaldean + Vedic Compatibility)
  const houseAnalysis = houseNumber ? analyzePropertyEntity('House Number', houseNumber, mulank, bhagyank) : undefined;
  const flatAnalysis = flatNumber ? analyzePropertyEntity('Flat Number', flatNumber, mulank, bhagyank) : undefined;
  const buildingAnalysis = buildingNumber ? analyzePropertyEntity('Building Number', buildingNumber, mulank, bhagyank) : undefined;
  const floorAnalysis = floor ? analyzePropertyEntity('Floor Number', String(floor), mulank, bhagyank) : undefined;
  const entranceAnalysis = entranceNumber ? analyzePropertyEntity('Main Entrance Number', entranceNumber, mulank, bhagyank) : undefined;

  // Facing Direction Analysis
  const isFacingFavorable = favorableDirs.some(d => d.toLowerCase() === facingDirection.toLowerCase());
  const facingAnalysis = {
    direction: facingDirection,
    isFavorable: isFacingFavorable,
    statusLabelHindi: isFacingFavorable ? 'अनुकूल दिशा (Harmonious Facing)' : 'ध्यान देने योग्य (Remedial Balancing Required)',
    explanationHindi: isFacingFavorable
      ? `आपके Kua ग्रुप (${groupType.replace('_', ' ')}) के अनुसार ${facingDirection} दिशा मुख्य मुखड़े (Facing) के लिए अत्यंत अनुकूल है। यह भवन में सकारात्मक प्राण ऊर्जा का प्रवाह बढ़ाती है।`
      : `आपके Kua ग्रुप (${groupType.replace('_', ' ')}) के अनुसार ${facingDirection} दिशा में मुख्य मुखड़ा होने से ऊर्जा का प्रवाह विपरीत हो सकता है। इसे संतुलित करने के लिए प्रवेश द्वार पर तांबे/पीतल का स्वास्तिक या पिरामिड लगाएं।`,
    remedyHindi: isFacingFavorable
      ? 'मुख्य प्रवेश द्वार पर रोशनी उत्तम रखें और तोरण या स्वास्तिक चिन्ह लगाएं।'
      : 'प्रवेश द्वार की दहलीज के नीचे पीतल की पट्टी या 3 पिरामिड स्थापित करें और पर्याप्त प्रकाश रखें।'
  };

  // 4. FUNCTIONAL ZONES SUMMARY
  const zonesSummary = {
    careerZone: {
      zone: 'Career & Opportunities',
      direction: 'North (उत्तर)',
      element: 'Water (जल)',
      status: favorableDirs.includes('North') ? 'Strong Flow' : 'Requires Balancing',
      hindiGuidance: 'करियर में पदोन्नति, नए व्यापारिक अवसर और आर्थिक वृद्धि के लिए उत्तर दिशा को खुला, हल्का और स्वच्छ रखें। कार्य करते समय उत्तर की ओर मुख करें।',
      remedy: 'उत्तर दिशा में कांच के पात्र में स्वच्छ जल और ताजा मनी प्लांट रखें; नीले या हरे रंग का उपयोग करें।'
    },
    wealthZone: {
      zone: 'Wealth & Liquidity',
      direction: 'South-East (आग्नेय)',
      element: 'Fire (अग्नि)',
      status: favorableDirs.includes('South-East') ? 'Strong Flow' : 'Requires Balancing',
      hindiGuidance: 'नकद तरलता (Cash Flow), दैनिक धन आगमन और समृद्धि के लिए आग्नेय कोण में रसोई या इलेक्ट्रिक मीटर स्थापित करें। यहाँ पानी का जमाव न होने दें।',
      remedy: 'आग्नेय कोण में हल्का लाल या नारंगी नाइट बल्ब जलाएं; यहाँ नीला या काला रंग बिल्कुल न लगाएं।'
    },
    healthZone: {
      zone: 'Health & Vitality',
      direction: 'East / North-East (पूर्व / ईशान)',
      element: 'Wood / Water',
      status: favorableDirs.includes('East') || favorableDirs.includes('North-East') ? 'Strong Flow' : 'Requires Balancing',
      hindiGuidance: 'शारीरिक स्फूर्ति, उत्तम स्वास्थ्य और मानसिक तनाव मुक्ति के लिए पूर्व व ईशान कोण को हमेशा साफ और प्राकृतिक रोशनी से युक्त रखें।',
      remedy: 'पूर्व की दीवार पर तांबे का सूर्य लगाएं और ईशान कोण में तांबे के पात्र में गंगाजल या क्रिस्टल पिरामिड रखें।'
    },
    relationshipZone: {
      zone: 'Relationships & Harmony',
      direction: 'South-West (नैऋत्य)',
      element: 'Earth (पृथ्वी)',
      status: favorableDirs.includes('South-West') ? 'Strong Flow' : 'Requires Balancing',
      hindiGuidance: 'पारिवारिक शांति, दांपत्य प्रेम और निर्णय लेने की स्थिरता के लिए नैऋत्य कोण में घर के मुखिया का मास्टर बेडरूम बनाएं।',
      remedy: 'नैऋत्य कोण में पीतल या भारी पत्थर की वस्तुएं रखें; यहाँ मुख्य प्रवेश द्वार या बोरवेल न बनाएं।'
    },
    fameZone: {
      zone: 'Fame & Recognition',
      direction: 'South (दक्षिण)',
      element: 'Fire (अग्नि)',
      status: favorableDirs.includes('South') ? 'Strong Flow' : 'Requires Balancing',
      hindiGuidance: 'समाज में यश, मान-सम्मान, ब्रांड वैल्यू और कानूनी मामलों में सफलता हेतु दक्षिण दिशा की दीवार को ऊंचा, भारी और मजबूत रखें।',
      remedy: 'दक्षिण की दीवार पर अपनी उपलब्धियों/सर्टिफिकेट्स को लाल फ्रेम में लगाएं और लाल या सिंदूरी कलाकृतियां रखें।'
    },
    successZone: {
      zone: 'Overall Success & Expansion',
      direction: isEastGroup ? 'South-East / East' : 'North-East / West',
      element: isEastGroup ? 'Wood' : 'Earth / Metal',
      status: 'Auspicious Alignment',
      hindiGuidance: `आपके Kua अंक #${kuaProfile.kuaNumber} के अनुसार आपकी मुख्य सफलता दिशा ${kuaProfile.favourableDirections.shengChi} है। महत्वपूर्ण समझौतों और व्यावसायिक बैठकों में इसी दिशा की ओर मुख करें।`,
      remedy: 'अपनी कार्य मेज पर शुभ दिशा में क्रिस्टल बॉल या छोटा पीतल का ग्लोब रखें।'
    }
  };

  // 5. WORKSPACE VASTU
  const primarySittingDir = isEastGroup ? 'North (उत्तर) या East (पूर्व)' : 'North-East (ईशान) या West (पश्चिम)';
  const workspaceVastu: WorkspaceVastuAnalysis = {
    recommendedSittingDirection: primarySittingDir,
    sittingDirectionReasonHindi: `आपके Kua अंक #${kuaProfile.kuaNumber} (${groupType.replace('_', ' ')}) के अनुसार कार्य करते समय आपका मुख ${primarySittingDir} की ओर होना सर्वोच्च बौद्धिक एकाग्रता और व्यापारिक लाभ देता है।`,
    careerZoneNorthGuidance: 'अपने कार्यक्षेत्र में उत्तर दिशा में कंप्यूटर या लैपटॉप रखें; पीठ के पीछे ठोस दीवार रखें और सीधे दरवाजे के सामने न बैठें।',
    wealthZoneSouthEastGuidance: 'कार्यालय के आग्नेय कोण (South-East) में बिलिंग डेस्क, कैश बॉक्स या वित्तीय फाइल्स रखें।',
    workEnvironmentBalancing: [
      'कार्य मेज को हमेशा अव्यवस्था (clutter) से मुक्त और साफ रखें।',
      'मेज पर उत्तर या पूर्व दिशा में छोटा हरा पौधा (जैसे जेड प्लांट या मनी प्लांट) रखें।',
      'अपने बैठने के स्थान के ठीक ऊपर कोई भारी बीम (Ceiling Beam) न होने दें।'
    ],
    traditionalWorkspaceRemedies: [
      'कार्य मेज के उत्तर-पूर्व कोने में पारदर्शी स्फटिक (Quartz Crystal) पिरामिड रखें।',
      'महत्वपूर्ण व्यापारिक फोन कॉल्स और वीडियो मीटिंग्स के समय उत्तर या पूर्व की ओर मुख रखें।',
      'कैश ड्रॉर में लाल कपड़े में 5 इलायची और तांबे का सिक्का रखें।'
    ]
  };

  // 6. HOME ENERGY ASSESSMENT
  const homeEnergyAssessment: HomeEnergyAssessment = {
    overallHomeVibration: `आपके घर का संपूर्ण ऊर्जा ढांचा आपके मूलांक #${mulank}, भाग्यांक #${bhagyank} और Kua अंक #${kuaProfile.kuaNumber} के साथ सामंजस्य पर आधारित है।`,
    houseVibrationSummary: houseAnalysis ? houseAnalysis.explanationHindi : 'मकान नंबर का विश्लेषण उपलब्ध नहीं है।',
    flatVibrationSummary: flatAnalysis ? flatAnalysis.explanationHindi : undefined,
    entranceVibrationSummary: entranceAnalysis ? entranceAnalysis.explanationHindi : undefined,
    facingDirectionHarmonics: facingAnalysis.explanationHindi,
    kuaDirectionLayerSummary: `Kua #${kuaProfile.kuaNumber} के अनुसार आपके 4 शुभ कोण (${kuaProfile.favorableDirections.map(d => d.direction).join(', ')}) सकारात्मक ऊर्जा बढ़ाते हैं।`,
    careerAreaNorth: zonesSummary.careerZone.hindiGuidance,
    wealthAreaSouthEast: zonesSummary.wealthZone.hindiGuidance,
    wellnessAreaEastNorthEast: zonesSummary.healthZone.hindiGuidance,
    relationshipAreaSouthWest: zonesSummary.relationshipZone.hindiGuidance,
    fameAreaSouth: zonesSummary.fameZone.hindiGuidance,
    traditionalBalancingSuggestions: [
      'घर के मुख्य द्वार पर नियमित रूप से ताजे फूलों का तोरण या ॐ/स्वास्तिक चिन्ह लगाएं।',
      'घर के केंद्र (ब्रह्मस्थान) को हमेशा खुला और भारी वजन से मुक्त रखें।',
      'रसोई घर में अग्नि और जल के तत्वों (चूल्हा और सिंक) को एक-दूसरे के बिल्कुल पास न रखें।'
    ]
  };

  // 7. LO SHU + NUMERO VASTU FUSION
  const birthGridObj: Record<number, number> = {};
  if (parsedDate.isValid) {
    parsedDate.digits.forEach(d => {
      if (d >= 1 && d <= 9) {
        birthGridObj[d] = (birthGridObj[d] || 0) + 1;
      }
    });
  }
  const loShuVastuFusion = buildLoShuVastuFusion(missingNumbers, birthGridObj);

  // 8. 5-LAYERED MASTER STRUCTURE
  const layeredReport: LayeredNumeroVastuReport = {
    layer1_dobCore: {
      mulank,
      bhagyank,
      compoundDOBSum,
      dobHindiSummary: `मूलांक #${mulank}, भाग्यांक #${bhagyank} और जन्मतिथि कुल योग ${compoundDOBSum} आपके प्राथमिक ऊर्जा केंद्र हैं।`
    },
    layer2_loShuGrid: {
      missingDigits: missingNumbers,
      gridFusionNotes: loShuVastuFusion.filter(f => f.status === 'MISSING'),
      fusionExplanationHindi: 'Lo Shu ग्रिड के अनुपस्थित अंकों से संबंधित Vastu दिशाओं को संतुलित करके ऊर्जा के प्रवाह को अनुकूलित किया जाता है।'
    },
    layer3_kuaDirections: {
      kuaNumber: kuaProfile.kuaNumber,
      group: kuaProfile.group,
      groupLabelHindi: isEastGroup ? 'ईस्ट ग्रुप (East Group)' : 'वेस्ट ग्रुप (West Group)',
      element: kuaProfile.element,
      favorableDirections: kuaProfile.favorableDirections,
      unfavorableDirections: kuaProfile.unfavorableDirections,
      all8DirectionsDetailed
    },
    layer4_propertyNumbers: {
      houseNumber: houseAnalysis,
      flatNumber: flatAnalysis,
      buildingNumber: buildingAnalysis,
      floorNumber: floorAnalysis,
      mainEntrance: entranceAnalysis,
      facingDirection: facingAnalysis
    },
    layer5_traditionalRemedies: {
      homeRemedies: [
        'घर के मुख्य द्वार पर हल्का पीला या सफेद प्रकाश रखें और दहलीज को हमेशा साफ रखें।',
        'उत्तर दिशा में कांच के बाउल में स्वच्छ जल रखें और हर 3 दिन में पानी बदलें।',
        'ईशान कोण में पूजा घर स्थापित करें और प्रतिदिन सुबह घी का दीपक जलाएं।'
      ],
      officeRemedies: workspaceVastu.traditionalWorkspaceRemedies,
      directionalRemedies: [
        'उत्तर दिशा (Career): ताजे हरे पौधे और जल तत्व का उपयोग करें।',
        'आग्नेय कोण (Wealth): लाल या गुलाबी नाइट लैंप और कपूर डिफ्यूज़र का उपयोग करें।',
        'नैऋत्य कोण (Stability): भारी पीली वस्तुएं और मास्टर बेडरूम की स्थिरता बनाए रखें।',
        'पश्चिम कोण (Gains): 6 रॉड वाली धातु की विंड चाइम स्थापित करें।'
      ],
      colourHarmonization: {
        luckyColours: isEastGroup ? ['Emerald Green', 'Sky Blue', 'Cream', 'Bright Yellow'] : ['Pure White', 'Metallic Silver', 'Golden Yellow', 'Beige'],
        balanceColours: ['Off-White', 'Pastel Peach', 'Warm Tan'],
        avoidColours: isEastGroup ? ['Heavy Matte Grey', 'Excessive Black'] : ['Excessive Dark Red', 'Heavy Dark Green'],
        roomGuidance: 'लिविंग रूम में हल्के वॉर्म टोन, बेडरूम में सुखद पेस्टल रंग और पूजा कक्ष में श्वेत या हल्का पीला रंग सर्वश्रेष्ठ है।'
      },
      environmentalAdjustments: [
        'प्राकृतिक सूर्य के प्रकाश और ताजी हवा का घर में नियमित प्रवेश सुनिश्चित करें।',
        'घर के किसी भी नल से पानी टपकने न दें; यह धन के रिसाव का पारंपरिक प्रतीक माना जाता है।'
      ],
      traditionalObjects: [
        'पीतल का स्वास्तिक (मुख्य द्वार हेतु)',
        'स्फटिक या तांबे का पिरामिड (ईशान कोण व अध्ययन मेज हेतु)',
        'धातु की 6-रॉड विंड चाइम (पश्चिम या वायव्य कोण हेतु)'
      ],
      botanicalAndPlants: [
        'तुलसी का पौधा (पूर्व या उत्तर-पूर्व में)',
        'मनी प्लांट (उत्तर या दक्षिण-पूर्व में जल पात्र में)',
        'जेड प्लांट (कार्य मेज पर उत्तर दिशा में)'
      ],
      charityAndLifestyle: [
        'बुधवार को हरी मूंग की दाल या हरा चारा गाय को अर्पित करें।',
        'शनिवार को जरूरतमंद व्यक्तियों को भोजन या वस्त्र का दान करें।'
      ],
      disclaimer: 'यह विश्लेषण पारंपरिक भारतीय न्यूमरो-वास्तु व दिशा सिद्धांतों पर आधारित है। इसे वास्तु ऊर्जा संतुलन के रूप में देखें, यह कोई चमत्कारी दावा नहीं है।'
    }
  };

  // Generate standard NumeroVaastuReport for backward compatibility
  const vaastuReport = generateNumeroVaastuReport(dob, (gender as 'MALE' | 'FEMALE') || 'MALE', '');

  const compatibleDirections = favorableDirs.slice(0, 2).map(dir => ({
    direction: dir,
    element: dir.includes('East') || dir === 'East' ? 'Wood' : (dir === 'North' ? 'Water' : (dir === 'South' ? 'Fire' : 'Earth')),
    influence: 'उच्च चुंबकीय सामंजस्य: समृद्धि, आरोग्य और पारिवारिक उन्नति।',
    score: 95
  }));

  const supportiveDirections = favorableDirs.slice(2).map(dir => ({
    direction: dir,
    element: dir.includes('Metal') || dir === 'West' ? 'Metal' : 'Earth',
    influence: 'सहायक ऊर्जा प्रवाह: व्यक्तिगत विकास और रचनात्मकता।',
    score: 82
  }));

  const inauspiciousDirs = isEastGroup ? westDirs : eastDirs;
  const neutralDirections = [inauspiciousDirs[0]].map(dir => ({
    direction: dir,
    element: 'संतुलनकारी तत्व',
    influence: 'पारंपरिक उपायों और नियमित स्वच्छता से ऊर्जा अनुकूलित रहती है।',
    score: 65
  }));

  const cautionDirections = inauspiciousDirs.slice(1).map(dir => ({
    direction: dir,
    element: 'सावधानी क्षेत्र',
    influence: 'इस दिशा में भारी कचरा या अव्यवस्था न होने दें; उपाय आवश्यक हैं।',
    score: 45
  }));

  return {
    methodology: 'LeoFamily Numero Vastu incorporates classical Vedic directional deities combined with Eight Mansions Kua harmonics, Chaldean numerical vibrations, and Lo Shu grid node balancing.',
    sourceCitation: {
      document: SOURCES.LEOFAMILY_NUMERO_VASTU_PDF.sourceDocument,
      author: SOURCES.LEOFAMILY_NUMERO_VASTU_PDF.author || 'LeoFamily',
      topic: SOURCES.LEOFAMILY_NUMERO_VASTU_PDF.topic
    },
    kuaNumber: kuaProfile.kuaNumber,
    groupType,
    groupDescription,
    compatibleDirections,
    supportiveDirections,
    neutralDirections,
    cautionDirections,
    directionsAnalysis: all8DirectionsDetailed,
    zonesSummary,
    propertyAnalysis: {
      house: houseAnalysis,
      flat: flatAnalysis,
      building: buildingAnalysis,
      floor: floorAnalysis,
      entrance: entranceAnalysis,
      facing: facingAnalysis
    },
    workspaceVastu,
    homeEnergyAssessment,
    loShuVastuFusion,
    layeredReport,
    houseNumberVibration: houseAnalysis ? {
      raw: houseAnalysis.rawInput,
      compound: houseAnalysis.compound,
      root: houseAnalysis.root,
      harmony: houseAnalysis.compatibilityLabel,
      description: houseAnalysis.explanationHindi
    } : undefined,
    entranceVibration: entranceAnalysis ? {
      raw: entranceAnalysis.rawInput,
      root: entranceAnalysis.root,
      description: entranceAnalysis.explanationHindi
    } : undefined,
    facingDirectionAnalysis: {
      facing: facingDirection,
      isAuspicious: isFacingFavorable,
      recommendation: facingAnalysis.explanationHindi
    },
    balanceRecommendations: [
      `निवास व कार्यक्षेत्र में अनुशंसित रंगों का प्रयोग करें: ${layeredReport.layer5_traditionalRemedies.colourHarmonization.luckyColours.join(', ')}।`,
      `अध्ययन या कार्य मेज को ${primarySittingDir} दिशा में रखें जिससे एकाग्रता और व्यापारिक लाभ बढ़े।`,
      `घर के ब्रह्मस्थान (केंद्र) को हमेशा स्वच्छ और खुले आवागमन युक्त रखें।`
    ],
    traditionalRemedySuggestions: [
      ...layeredReport.layer5_traditionalRemedies.homeRemedies,
      ...layeredReport.layer5_traditionalRemedies.directionalRemedies
    ],
    zonesReport: vaastuReport.zonesReport,
    colourCorrection: vaastuReport.colourCorrection
  };
}
