/**
 * LEOFAMILY VEDIC KUNDALI 3X3 GRID ENGINE
 * Distinct from Lo Shu Grid:
 * Row 1: [3, 1, 9] (Dharma / Will & Authority)
 * Row 2: [6, 7, 5] (Artha / Practical & Commercial)
 * Row 3: [2, 8, 4] (Kama-Moksha / Intuition, Karma & Transformation)
 */

export interface VedicGridCell {
  digit: number;
  graha: string;
  direction: string;
  count: number;
  lifeDomain: string;
}

export interface VedicAspectBreakdown {
  dharmaAxis: { numbers: number[]; presentCount: number; interpretation: string };
  arthaAxis: { numbers: number[]; presentCount: number; interpretation: string };
  kamaMokshaAxis: { numbers: number[]; presentCount: number; interpretation: string };
}

export interface VedicGridAnalysis {
  matrix: number[][];
  grid: Record<number, VedicGridCell>;
  aspects: VedicAspectBreakdown;
  triadAspects: {
    dharmaAxis: { name: string; presentCount: number; interpretation: string };
    arthaAxis: { name: string; presentCount: number; interpretation: string };
    kamaMokshaAxis: { name: string; presentCount: number; interpretation: string };
  };
  vedicSynthesis: string;
  synthesis: string;
}

const VEDIC_GRID_POSITIONS: Record<number, { graha: string; direction: string; domain: string }> = {
  3: { graha: 'बृहस्पति (Jupiter)', direction: 'उत्तर-पूर्व (ईशान)', domain: 'ज्ञान, विवेक एवं मार्गदर्शन' },
  1: { graha: 'सूर्य (Sun)', direction: 'पूर्व (East)', domain: 'नेतृत्व, प्राण ऊर्जा एवं आत्म-सम्मान' },
  9: { graha: 'मंगल (Mars)', direction: 'दक्षिण (South)', domain: 'पराक्रम, साहस एवं क्रियान्वयन' },
  6: { graha: 'शुक्र (Venus)', direction: 'दक्षिण-पूर्व (आग्नेय)', domain: 'वैभव, सौंदर्य, कला एवं संसाधन' },
  7: { graha: 'केतु (Ketu)', direction: 'उत्तर-पश्चिम (वायव्य)', domain: 'सूक्ष्म अंतर्ज्ञान, अनुसंधान एवं वैराग्य' },
  5: { graha: 'बुध (Mercury)', direction: 'केंद्र (Brahmasthan)', domain: 'व्यापार, संचार, संतुलन एवं निर्णय क्षमता' },
  2: { graha: 'चंद्रमा (Moon)', direction: 'उत्तर-पश्चिम (वायव्य)', domain: 'मन, कल्पना, भावना एवं जल तत्व' },
  8: { graha: 'शनि (Saturn)', direction: 'पश्चिम (West)', domain: 'कर्म, न्याय, अनुशासन एवं धैर्य' },
  4: { graha: 'राहु (Rahu)', direction: 'दक्षिण-पश्चिम (नैऋत्य)', domain: 'दूरदर्शिता, नवाचार, कूटनीति एवं अचानक प्रगति' }
};

export function buildVedicGrid(dobDigits: number[]): VedicGridAnalysis {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  dobDigits.forEach((digit) => {
    if (digit >= 1 && digit <= 9) counts[digit]++;
  });

  const matrix: number[][] = [
    [3, 1, 9],
    [6, 7, 5],
    [2, 8, 4]
  ];

  const grid: Record<number, VedicGridCell> = {};
  for (let d = 1; d <= 9; d++) {
    const meta = VEDIC_GRID_POSITIONS[d];
    grid[d] = {
      digit: d,
      graha: meta.graha,
      direction: meta.direction,
      count: counts[d],
      lifeDomain: meta.domain
    };
  }

  // Triad Axes Interpretation in Hindi
  const dharmaNumbers = [3, 1, 9];
  const dharmaPresent = dharmaNumbers.filter(n => counts[n] > 0).length;
  let dharmaInterpretation = '';
  if (dharmaPresent === 3) {
    dharmaInterpretation = 'धर्म त्रिकोण (3-1-9) पूर्ण रूप से सक्रिय: गुरु का ज्ञान, सूर्य का आत्म-विश्वास और मंगल का पराक्रम मिलकर आपको एक असाधारण दूरदर्शी मार्गदर्शक और शक्तिशाली नेतृत्वकर्ता बनाते हैं।';
  } else if (dharmaPresent === 2) {
    dharmaInterpretation = 'धर्म त्रिकोण (3-1-9) आंशिक रूप से संतुलित: उद्देश्य के प्रति निष्ठा और नैतिक नेतृत्व की सुदृढ़ क्षमता उपस्थित है, जो निरंतर प्रयासों से उत्कृष्ट परिणाम देती है।';
  } else {
    dharmaInterpretation = 'धर्म त्रिकोण (3-1-9) में विकास की गुंजाइश: गुरु मंत्र का जप और सूर्य देव को जल अर्पित करने से संकल्प शक्ति और नैतिक स्पष्टता में वृद्धि होगी।';
  }

  const arthaNumbers = [6, 7, 5];
  const arthaPresent = arthaNumbers.filter(n => counts[n] > 0).length;
  let arthaInterpretation = '';
  if (arthaPresent === 3) {
    arthaInterpretation = 'अर्थ त्रिकोण (6-7-5) पूर्ण सक्रिय: शुक्र का आकर्षण, केतु की सूक्ष्म दृष्टि और बुध की व्यावसायिक चातुर्य मिलकर व्यापार, वित्त प्रबंधन और समाज में प्रतिष्ठा का मजबूत आधार बनाते हैं।';
  } else if (arthaPresent === 2) {
    arthaInterpretation = 'अर्थ त्रिकोण (6-7-5) संतुलित प्रवाह: व्यावहारिक सूझबूझ और व्यावसायिक कौशल अच्छा है; वित्तीय योजनाओं में व्यवस्थित संतुलन बना रहता है।';
  } else {
    arthaInterpretation = 'अर्थ त्रिकोण (6-7-5) में संतुलन आवश्यक: वित्तीय अनुशासन और नियमित बजट प्रबंधन पर विशेष ध्यान दें; व्यापारिक संवाद में पारदर्शिता रखें।';
  }

  const kamaMokshaNumbers = [2, 8, 4];
  const kamaMokshaPresent = kamaMokshaNumbers.filter(n => counts[n] > 0).length;
  let kamaMokshaInterpretation = '';
  if (kamaMokshaPresent === 3) {
    kamaMokshaPresent === 3;
    kamaMokshaInterpretation = 'काम-मोक्ष त्रिकोण (2-8-4) पूर्ण जागृत: चंद्रमा का संवेदनशील अंतर्मन, शनि का कठोर कर्म अनुशासन और राहु की गहरी अंतर्दृष्टि जीवन की जटिल चुनौतियों को पार कर आध्यात्मिक गहराई प्रदान करती है।';
  } else if (kamaMokshaPresent === 2) {
    kamaMokshaInterpretation = 'काम-मोक्ष त्रिकोण (2-8-4) मध्यम सक्रिय: व्यावहारिक कर्मठता और भावनात्मक संवेदनशीलता के बीच सुंदर तालमेल है। धैर्य बनाए रखने पर दीर्घकालिक सफलता निश्चित है।';
  } else {
    kamaMokshaInterpretation = 'काम-मोक्ष त्रिकोण (2-8-4) में सहज प्रवाह: मानसिक शांति हेतु प्रतिदिन 10 मिनट मौन ध्यान करें और कर्म में निरंतरता बनाए रखें।';
  }

  const aspects: VedicAspectBreakdown = {
    dharmaAxis: { numbers: dharmaNumbers, presentCount: dharmaPresent, interpretation: dharmaInterpretation },
    arthaAxis: { numbers: arthaNumbers, presentCount: arthaPresent, interpretation: arthaInterpretation },
    kamaMokshaAxis: { numbers: kamaMokshaNumbers, presentCount: kamaMokshaPresent, interpretation: kamaMokshaInterpretation }
  };

  const triadAspects = {
    dharmaAxis: { name: 'धर्म एवं आत्म-शक्ति अक्ष [3, 1, 9]', presentCount: dharmaPresent, interpretation: dharmaInterpretation },
    arthaAxis: { name: 'अर्थ एवं व्यावसायिक संसाधन अक्ष [6, 7, 5]', presentCount: arthaPresent, interpretation: arthaInterpretation },
    kamaMokshaAxis: { name: 'काम, कर्म एवं आत्मिक मोक्ष अक्ष [2, 8, 4]', presentCount: kamaMokshaPresent, interpretation: kamaMokshaInterpretation }
  };

  const totalPresent = Object.values(counts).filter(c => c > 0).length;
  const vedicSynthesis = `पारंपरिक 3x3 वैदिक कुंडली में 9 में से ${totalPresent} ग्रहीय ऊर्जाएं सीधे जन्मतिथि से सक्रिय हैं। यह ग्रहीय संरचना जीवन के व्यावहारिक, नैतिक एवं आध्यात्मिक लक्ष्यों के बीच एक अनूठा संतुलन स्थापित करती है।`;

  return {
    matrix,
    grid,
    aspects,
    triadAspects,
    vedicSynthesis,
    synthesis: vedicSynthesis
  };
}
