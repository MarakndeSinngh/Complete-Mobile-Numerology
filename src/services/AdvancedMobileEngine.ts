import { reduceToSingleDigit } from './numerologyEngine';
import { PAIR_MEANINGS, PairMeaning } from './pairMeanings';
import { HINDI_PAIR_MEANINGS } from './hindiPairs';

export interface MobileAnalysisNew {
  mobileNumber: string;
  modifiedNumber: string;
  compoundTotal: number;
  reducedTotal: number;
  rating: 'EXCELLENT' | 'GOOD' | 'AVOID' | 'CAN GO' | 'OK';
  score: number;
  
  // Compound Analysis Details
  compoundDetails: {
    compound: number;
    root: number;
    title: string;
    compoundMeaning: string;
    rootMeaning: string;
    combinedMeaning: string;
  };

  // Pair Analysis
  pairs: {
    pair: string;
    meaning: string;
    positive: string;
    negative: string;
    area: 'Wealth' | 'Career' | 'Relationships' | 'Health' | 'Spiritual' | 'General';
    severity: number;
  }[];

  // Triples Pattern Analysis
  triples: {
    triple: string;
    title: string;
    vibe: string;
    advice: string;
  }[];

  // Frequency mapping and dominant planet
  frequencies: { digit: number; count: number; name: string; percentage: number }[];
  dominantPlenaryName: string;

  // Harmony details
  harmony: {
    friendlyCount: number;
    neutralCount: number;
    enemyCount: number;
    friendlyList: number[];
    enemyList: number[];
    harmonyScore: number;
  };

  // Dimensional category profiles (0-100 derived)
  categories: {
    wealth: number;
    career: number;
    relationships: number;
    health: number;
    spiritual: number;
  };
}

// Compounds descriptions under Chaldean principles
const MOBILE_COMPOUND_DICTIONARY: Record<number, { title: string; compoundMeaning: string; rootMeaning: string; combinedMeaning: string; score: number }> = {
  10: {
    title: 'The Wheel of Fortune (भाग्य चक्र)',
    compoundMeaning: 'Symbolizes honor, self-confidence, fame, and rise in professional status.',
    rootMeaning: 'Sun rules 1, injecting extreme creative fire and sovereign leadership.',
    combinedMeaning: 'Exceptional for pioneering startup ventures, political ambitions, and getting government connections.',
    score: 85
  },
  11: {
    title: 'The Clashing Fists (संघर्ष कुंडली)',
    compoundMeaning: 'Warns of severe friction, hidden enemies, and betrayal from trusted peers.',
    rootMeaning: 'Moon rules 2, prompting deep emotional turbulence and changing temperaments.',
    combinedMeaning: 'Brings high artistic talents but advises strict legal contracts and caution with partners.',
    score: 55
  },
  12: {
    title: 'The Sacrifice & Anxiety (तपस्या चक्र)',
    compoundMeaning: 'Indicates mental worry, delayed projects, and sacrifices for others.',
    rootMeaning: 'Jupiter rules 3, providing inner wisdom and spiritual learning under distress.',
    combinedMeaning: 'Excellent for scholars, priests, and writers, but sluggish for immediate real estate accumulation.',
    score: 65
  },
  13: {
    title: 'Sovereignty & Unorthodox Transition (परिवर्तन योग)',
    compoundMeaning: 'The number of deep change, administrative command, and breaking standard norms.',
    rootMeaning: 'Rahu rules 4, delivering electric leaps, technological authority, and sudden wealth.',
    combinedMeaning: 'Forces rapid authority gains or sudden workspace reforms. Ideal for tech leaders.',
    score: 75
  },
  14: {
    title: 'The Movement of Assets (स्थिरता योग)',
    compoundMeaning: 'A highly progressive business node, indicating success in media, trading, and PR.',
    rootMeaning: 'Mercury rules 5, offering brilliant intellectual coordination and negotiation flair.',
    combinedMeaning: 'Superb for business owners, stock traders, and journalists. It multiplies wealth gates.',
    score: 95
  },
  15: {
    title: 'The Magician of Arts (आकर्षण कुलम)',
    compoundMeaning: 'A highly magnetic compound bringing strong physical appeal, luxury, and artistic success.',
    rootMeaning: 'Venus rules 6, conferring comforts, high quality taste, and supportive relationships.',
    combinedMeaning: 'Auspicious compound for artists, actors, hospitality consultants, and luxury brand creators.',
    score: 95
  },
  16: {
    title: 'The Shattered Citadel (पतन चक्र)',
    compoundMeaning: 'Warns of sudden changes, physical vulnerabilities, and loss of stored wealth.',
    rootMeaning: 'Ketu rules 7, giving massive spiritual awakening and analytical science depth.',
    combinedMeaning: 'Very strong for occult research and philosophical isolation, but alerts of career delays.',
    score: 35
  },
  17: {
    title: 'The Crown of Magi (महिषा चक्र)',
    compoundMeaning: 'A distinguished compound showing outstanding administrative achievements, legacy, and legal power.',
    rootMeaning: 'Saturn rules 8, bringing structured justice and massive public command.',
    combinedMeaning: 'Superb for judicial personnel, long-term investors, and large industrialists.',
    score: 90
  },
  18: {
    title: 'The Internal Conflict (अंतर्द्वंद योग)',
    compoundMeaning: 'Vibrations of fierce verbal battles, physical struggle, and deep emotional secrets.',
    rootMeaning: 'Mars rules 9, giving great physical defense, surgical precision, and army fitness.',
    combinedMeaning: 'Strong for police, martial artists, and surgeons, but warns of marital friction.',
    score: 40
  },
  19: {
    title: 'The Sovereign Sun (सूर्य प्रताप)',
    compoundMeaning: 'The highest single solar compound representing absolute victory, health, and clean wealth.',
    rootMeaning: 'Sun rules 1, conferring indestructible confidence, command, and authority.',
    combinedMeaning: 'Brings immense public respect, successful businesses, and flawless administrative support.',
    score: 100
  },
  23: {
    title: 'The Royal Star of the Lion (सिंह चक्र)',
    compoundMeaning: 'Highly fortunate. Guarantees help from authorities, dynamic communication, and rapid success.',
    rootMeaning: 'Mercury rules 5, aligning analytical speed with social magnetism.',
    combinedMeaning: 'Called the "wealth booster". Guarantees continuous funds flow and superb public relations.',
    score: 98
  },
  24: {
    title: 'The Weaver of Luxury (लक्ष्मी रूप)',
    compoundMeaning: 'A deeply harmonious Venusian vibration bringing massive financial safety and peaceful love.',
    rootMeaning: 'Venus rules 6, conferring luxury, soft lifestyle, and supportive marriage alliances.',
    combinedMeaning: 'Brings high quality vehicles, luxury assets, and peaceful domestic progress. Extremely positive.',
    score: 96
  },
  32: {
    title: 'The Speaker of Nations (वक्ता योग)',
    compoundMeaning: 'Great for negotiations, partnerships, and high volume international trading.',
    rootMeaning: 'Mercury rules 5, sparking rapid strategic expansion and quick decisions.',
    combinedMeaning: 'Ensures that your written words and emails bring lucrative opportunities. Highly supportive.',
    score: 85
  },
  33: {
    title: 'The Teacher of Gurus (ज्ञान चक्र)',
    compoundMeaning: 'Deep spiritual, protective frequency. Brings assistance from highly placed mentors and scholars.',
    rootMeaning: 'Venus rules 6, bringing divine aesthetic wisdom and artistic guidance.',
    combinedMeaning: 'Propels educational institutional success, noble counseling, and deep protective boundaries.',
    score: 95
  },
  37: {
    title: 'The Royal Crown (मुकुट योग)',
    compoundMeaning: 'Highly protective compound. Assures heavy status, powerful contacts, and sudden windfalls.',
    rootMeaning: 'Ketu rules 7, fueling sharp analytical insights and dynamic public backing.',
    combinedMeaning: 'Excellent for high finance directors, astrologers, and corporate strategic planners.',
    score: 98
  },
  41: {
    title: 'The Builder of Empires (दिशा योग)',
    compoundMeaning: 'Forces active planning. Multiplies structural and administrative success with slight struggle.',
    rootMeaning: 'Mercury rules 5, offering rapid communication networks and commerce pathways.',
    combinedMeaning: 'Superb for property developers, civil architects, and logistics heads.',
    score: 75
  },
  42: {
    title: 'The Golden Touch (स्वर्ण स्पर्श)',
    compoundMeaning: 'Confers amazing aesthetic designs, luxurious domestic comforts, and great savings flow.',
    rootMeaning: 'Venus rules 6, delivering beautiful relations and dynamic support systems.',
    combinedMeaning: 'Ensures beautiful vehicles, strong jewelry accumulation, and peaceful marital growth.',
    score: 88
  },
  46: {
    title: 'The Sovereign Catalyst (महा संबल)',
    compoundMeaning: 'Delivers dynamic authority and sudden material accumulation through foreign connections.',
    rootMeaning: 'Sun rules 1, providing active commands and clear identity goals.',
    combinedMeaning: 'Fosters rapid promotional cycles in corporate ladders and builds magnetic personal charisma.',
    score: 92
  },
  51: {
    title: 'The Merchant Emperor (कुबेर योग)',
    compoundMeaning: 'Highly auspicious, signifying complete control over markets, rapid sales, and active retail luck.',
    rootMeaning: 'Venus rules 6, conferring luxury branding and customer loyalty.',
    combinedMeaning: 'An outstanding corporate phone frequency. Propels massive business turnovers and partnerships.',
    score: 98
  }
};

const PLANET_NAMES_MAP: Record<number, string> = {
  1: 'Sun (सूर्य)',
  2: 'Moon (चंद्र)',
  3: 'Jupiter (गुरु)',
  4: 'Rahu (राहु)',
  5: 'Mercury (बुध)',
  6: 'Venus (शुक्र)',
  7: 'Ketu (केतु)',
  8: 'Saturn (शनि)',
  9: 'Mars (मंगल)'
};

// Harmony alignments
const FRIENDLY_MATRIX: Record<number, number[]> = {
  1: [1, 2, 3, 5, 9],
  2: [1, 2, 3, 5],
  3: [1, 2, 3, 5, 7, 9],
  4: [1, 5, 6, 7, 8],
  5: [1, 2, 3, 5, 6],
  6: [1, 5, 6, 7],
  7: [1, 3, 4, 5, 6, 9],
  8: [3, 4, 5, 6, 7],
  9: [1, 3, 5, 7, 9]
};

const ENEMY_MATRIX: Record<number, number[]> = {
  1: [8, 4],
  2: [8, 9],
  3: [6],
  4: [2, 9],
  5: [9],
  6: [3],
  7: [2, 8],
  8: [1, 2, 9],
  9: [4, 8]
};

export function analyzeMobileNumberAdvanced(mobileStr: string): MobileAnalysisNew {
  const digitsOnly = mobileStr.replace(/[^0-9]/g, '');

  // Step 1: Calculate Compound
  let compoundTotal = 0;
  for (let i = 0; i < digitsOnly.length; i++) {
    compoundTotal += parseInt(digitsOnly[i], 10);
  }
  const reducedTotal = reduceToSingleDigit(compoundTotal);

  // Zeros replaced with previous
  let modifiedChars: string[] = [];
  for (let i = 0; i < digitsOnly.length; i++) {
    const ch = digitsOnly[i];
    if (ch === '0') {
      const prev = i > 0 ? modifiedChars[i - 1] : '9';
      modifiedChars.push(prev);
    } else {
      modifiedChars.push(ch);
    }
  }
  const modifiedNumber = modifiedChars.join('');

  // 1. Compound interpretation lookup
  let compDetails = MOBILE_COMPOUND_DICTIONARY[compoundTotal];
  if (!compDetails) {
    compDetails = {
      title: `Chaldean Compound No. ${compoundTotal}`,
      compoundMeaning: `A unique cosmic vibration of index ${compoundTotal}, demanding diligent calculations.`,
      rootMeaning: `Reduces to Root ${reducedTotal}, ruled by ${PLANET_NAMES_MAP[reducedTotal]}.`,
      combinedMeaning: `Fosters lifetime lessons, directing energies toward stabilizing ${PLANET_NAMES_MAP[reducedTotal]} frequencies.`,
      score: 65
    };
  }

  // 2. Continuous Pair Analysis
  const pairsList: MobileAnalysisNew['pairs'] = [];
  for (let i = 0; i < modifiedNumber.length - 1; i++) {
    const pStr = modifiedNumber.substring(i, i + 2);
    const hindiLookup = HINDI_PAIR_MEANINGS[pStr];
    const lookup = PAIR_MEANINGS[pStr];
    if (hindiLookup) {
      pairsList.push({
        pair: pStr,
        meaning: hindiLookup.meaning,
        positive: hindiLookup.positive,
        negative: hindiLookup.negative,
        area: lookup?.area || 'General',
        severity: lookup?.severity || 70
      });
    } else if (lookup) {
      pairsList.push({
        pair: pStr,
        meaning: lookup.meaning,
        positive: lookup.positive,
        negative: lookup.negative,
        area: lookup.area,
        severity: lookup.severity
      });
    } else {
      // Stand-in basic pairing interpretation
      const p1 = parseInt(pStr[0], 10);
      const p2 = parseInt(pStr[1], 10);
      const friendly = FRIENDLY_MATRIX[p1]?.includes(p2) ? 'Harmonious' : 'Neutral';
      pairsList.push({
        pair: pStr,
        meaning: `${PLANET_NAMES_MAP[p1]?.split(' ')[0]} से ${PLANET_NAMES_MAP[p2]?.split(' ')[0]} का संबंध`,
        positive: `डिजिटल संवाद और बातचीत में संतुलित प्रवाह बनाए रखता है।`,
        negative: `अहंकार और मतभेदों से बचने के लिए सजगता आवश्यक है।`,
        area: 'General',
        severity: friendly === 'Harmonious' ? 80 : 60
      });
    }
  }

  // 3. Triples Analysis
  const triplesList: MobileAnalysisNew['triples'] = [];
  for (let i = 0; i < modifiedNumber.length - 2; i++) {
    const tStr = modifiedNumber.substring(i, i + 3);
    
    // Check repeating triples (AAA)
    if (tStr[0] === tStr[1] && tStr[1] === tStr[2]) {
      const digit = parseInt(tStr[0], 10);
      let title = `त्रिक पुनरावृत्ति आवृत्ति ${digit}${digit}${digit}`;
      let vibe = `${PLANET_NAMES_MAP[digit]} की ऊर्जा का अत्यधिक संकेंद्रण। इस क्षेत्र में तीव्र प्रभाव उत्पन्न करता है।`;
      let advice = `ग्रह के प्रतिकूल गोचर के समय लंबी कॉल या तीखी बहसों से बचें।`;
      
      if (digit === 1) { title = 'सूर्य त्रिक मुकुट (111)'; vibe = 'अत्यधिक आत्म-सम्मान, नेतृत्व क्षमता और प्रशासनिक प्रभाव।'; advice = 'अहंकार को नियंत्रित रखें और वरिष्ठों से सलाह लें।'; }
      else if (digit === 2) { title = 'चंद्रमा त्रिक भंवर (222)'; vibe = 'तीव्र भावनात्मक संवेदनशीलता, रचनात्मकता और कल्पनाशीलता।'; advice = 'मन को शांत रखने के लिए नियमित ध्यान व प्राणायाम करें।'; }
      else if (digit === 3) { title = 'गुरु विद्या शिखर (333)'; vibe = 'गहरा ज्ञान, दूसरों को सिखाने की इच्छा और मान-सम्मान।'; advice = 'विनम्रता से दूसरों के विचार भी सुनें।'; }
      else if (digit === 5) { title = 'व्यापार समृद्धि योग (555)'; vibe = 'उत्कृष्ट व्यावसायिक व जनसंपर्क क्षमता, तीव्र लेन-देन गति।'; advice = 'समझौते करते समय कानूनी पहलुओं की पूरी जांच करें।'; }
      else if (digit === 9) { title = 'मंगल तेज प्रवाह (999)'; vibe = 'अदम्य साहस, उच्च शारीरिक ऊर्जा और तुरंत एक्शन का जज्बा।'; advice = 'गुस्से और तेज गति से वाहन चलाने पर नियंत्रण रखें।'; }

      triplesList.push({ triple: tStr, title, vibe, advice });
    } else if (tStr === '135' || tStr === '531') {
      triplesList.push({
        triple: tStr,
        title: 'श्री गणेश प्रचुर प्रवाह (गणेश योग)',
        vibe: 'ज्ञान (3), संवाद (5) और कर्म (1) का सुंदर संगम। व्यापार के लिए अत्यंत शुभ।',
        advice: 'इस नंबर के सक्रिय रहने पर मुख्य व्यावसायिक योजनाएं शुरू करें!'
      });
    } else if (tStr === '246' || tStr === '642') {
      triplesList.push({
        triple: tStr,
        title: 'लक्जरी व सुख-सुविधा योग (लक्ष्मी योग)',
        vibe: 'शुक्र की कला (6), चंद्रमा की भावनाएं (2) और राहु के विस्तार का संगम।',
        advice: 'वाहन, संपत्ति या कलात्मक संपत्तियों के क्रय हेतु उत्तम।'
      });
    }
  }

  // 4. Frequency Analysis
  const counts: Record<number, number> = {};
  for (let d = 1; d <= 9; d++) counts[d] = 0;
  for (let i = 0; i < modifiedNumber.length; i++) {
    const dVal = parseInt(modifiedNumber[i], 10);
    if (dVal > 0) {
      counts[dVal] = (counts[dVal] || 0) + 1;
    }
  }

  const frequencies: MobileAnalysisNew['frequencies'] = [];
  let maxCount = 0;
  let dominantPlenaryValue = 5;

  Object.keys(counts).forEach(k => {
    const digit = parseInt(k, 10);
    const count = counts[digit];
    if (count > maxCount) {
      maxCount = count;
      dominantPlenaryValue = digit;
    }
    frequencies.push({
      digit,
      count,
      name: PLANET_NAMES_MAP[digit] || '',
      percentage: Math.round((count / digitsOnly.length) * 100)
    });
  });

  const dominantPlenaryName = PLANET_NAMES_MAP[dominantPlenaryValue] || 'Mercury (बुध)';

  // 5. Harmony Analysis (Friendly vs Enemy)
  let friendlyCount = 0;
  let neutralCount = 0;
  let enemyCount = 0;

  const friendlyList = FRIENDLY_MATRIX[reducedTotal] || [];
  const enemyList = ENEMY_MATRIX[reducedTotal] || [];

  for (let i = 0; i < digitsOnly.length; i++) {
    const d = parseInt(digitsOnly[i], 10);
    if (d === 0) continue;
    if (d === reducedTotal || friendlyList.includes(d)) {
      friendlyCount++;
    } else if (enemyList.includes(d)) {
      enemyCount++;
    } else {
      neutralCount++;
    }
  }

  let harmonyScore = Math.round(((friendlyCount + neutralCount * 0.5) / digitsOnly.length) * 100);
  harmonyScore = Math.min(100, Math.max(30, harmonyScore));

  // Determine overall rating
  let rating: MobileAnalysisNew['rating'] = 'OK';
  const finalAgilityScore = Math.round((compDetails.score * 0.6) + (harmonyScore * 0.4));
  
  if (finalAgilityScore >= 88) rating = 'EXCELLENT';
  else if (finalAgilityScore >= 75) rating = 'GOOD';
  else if (finalAgilityScore >= 60) rating = 'CAN GO';
  else if (finalAgilityScore >= 45) rating = 'OK';
  else rating = 'AVOID';

  // 6. Category Scores (Derived using solid logic)
  // Wealth: boosted by 5s, 6s, 8s, 2s. Penalized by hostile pairings like 16, 48.
  let wScore = 55 + (counts[5] * 12) + (counts[6] * 12) - (pairsList.filter(p => ['16', '61', '48', '84', '28', '82'].includes(p.pair)).length * 15);
  // Career: boosted by 1s, 3s, 5s. Penalized by 41, 16.
  let cScore = 60 + (counts[1] * 15) + (counts[3] * 12) - (pairsList.filter(p => ['41', '14', '16'].includes(p.pair)).length * 15);
  // Relations: boosted by 2s, 6s, 7s. Penalized by 99, 18, 36.
  let rScore = 58 + (counts[2] * 15) + (counts[6] * 12) - (pairsList.filter(p => ['18', '81', '36', '63'].includes(p.pair)).length * 15);
  // Health: boosted by 3s, 9s. Penalized by excess repeating or 16, 49.
  let hScore = 65 + (counts[3] * 10) - (pairsList.filter(p => ['16', '61', '49', '94'].includes(p.pair)).length * 15);
  // Spiritual: boosted by 7s, 3s, 9s.
  let sScore = 50 + (counts[7] * 20) + (counts[3] * 15);

  const cleanScore = (val: number) => Math.min(100, Math.max(25, Math.round(val)));

  return {
    mobileNumber: mobileStr,
    modifiedNumber,
    compoundTotal,
    reducedTotal,
    rating,
    score: finalAgilityScore,
    compoundDetails: {
      compound: compoundTotal,
      root: reducedTotal,
      title: compDetails.title,
      compoundMeaning: compDetails.compoundMeaning,
      rootMeaning: compDetails.rootMeaning,
      combinedMeaning: compDetails.combinedMeaning
    },
    pairs: pairsList,
    triples: triplesList,
    frequencies,
    dominantPlenaryName,
    harmony: {
      friendlyCount,
      neutralCount,
      enemyCount,
      friendlyList,
      enemyList,
      harmonyScore
    },
    categories: {
      wealth: cleanScore(wScore),
      career: cleanScore(cScore),
      relationships: cleanScore(rScore),
      health: cleanScore(hScore),
      spiritual: cleanScore(sScore)
    }
  };
}
