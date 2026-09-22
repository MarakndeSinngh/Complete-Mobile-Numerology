import { PlaneAnalysis } from './types';
import { LEOFAMILY_PLANES } from './planeDefinitions';

/**
 * Phase 13: LeoFamily Plane Analysis Engine
 * Calculates 8 master planes from the enhanced LeoFamily grid:
 * Horizontal: Mind (4-9-2), Emotional (3-5-7), Practical (8-1-6)
 * Vertical: Thought (4-3-8), Will (9-5-1), Action (2-7-6)
 * Diagonal: Golden Success (4-5-6), Silver Yog (2-5-8)
 */
export function calculatePlanes(
  enhancedGrid: Record<number, number>,
  birthGrid?: Record<number, number>,
  driver?: number,
  bhagyank?: number
): PlaneAnalysis[] {
  const bg = birthGrid || enhancedGrid;
  const drv = driver || 0;
  const bhg = bhagyank || 0;

  return LEOFAMILY_PLANES.map(template => {
    const presentDigits = template.coordinates.filter(d => (enhancedGrid[d] || 0) > 0);
    const missingDigits = template.coordinates.filter(d => (enhancedGrid[d] || 0) === 0);
    const presentCount = presentDigits.length;

    let status: 'COMPLETE' | 'PARTIAL' | 'EMPTY' = 'EMPTY';
    let completionPercentage = 0;
    let interpretation = '';
    let practicalMeaning = '';

    if (presentCount === 3) {
      status = 'COMPLETE';
      completionPercentage = 100;
      interpretation = `${template.title} (${template.coordinates.join('-')}) पूरी तरह से पूर्ण (100%) है। इसके तीनों अंक सक्रिय हैं, जिससे यह प्लेन पूर्ण सामर्थ्य और उत्तम परिणाम प्रदान कर रहा है।`;
      practicalMeaning = `${template.name} के क्षेत्र में स्वाभाविक महारत और सकारात्मक ऊर्जा: ${template.strengths.slice(0, 2).join('; ')}`;
    } else if (presentCount === 2) {
      status = 'PARTIAL';
      completionPercentage = 66;
      interpretation = `${template.title} (${template.coordinates.join('-')}) आंशिक रूप से सक्रिय (2/3) है। इसमें मिसिंग अंक: ${missingDigits.join(', ')} है।`;
      practicalMeaning = `इस प्लेन में अच्छा कार्यात्मक सामर्थ्य है। मिसिंग अंक (${missingDigits.join(', ')}) के लिए सरल उपायों और सजगता से संतुलन बनाया जा सकता है।`;
    } else if (presentCount === 1) {
      status = 'PARTIAL';
      completionPercentage = 33;
      interpretation = `${template.title} (${template.coordinates.join('-')}) का 1 अंक सक्रिय (${presentDigits.join(', ')}) है। बाकी मिसिंग अंक: ${missingDigits.join(', ')} हैं।`;
      practicalMeaning = `बुनियादी बीज सक्रिय है; मिसिंग अंक (${missingDigits.join(' और ')}) पर ध्यान देने से इस क्षेत्र में स्थिरता और प्रगति मिलेगी।`;
    } else {
      status = 'EMPTY';
      completionPercentage = 0;
      interpretation = `${template.title} (${template.coordinates.join('-')}) के तीनों अंक ग्रिड में रिक्त (Empty) हैं।`;
      practicalMeaning = `यह क्षेत्र जीवन में सजग विकास की मांग करता है। उचित मार्गदर्शन और उपायों के माध्यम से इसे संतुलित किया जा सकता है।`;
    }

    // Determine sources for each present digit
    const sourceSet = new Set<string>();
    presentDigits.forEach(d => {
      if ((bg[d] || 0) > 0) sourceSet.add('Birth');
      if (d === drv) sourceSet.add('Driver');
      if (d === bhg) sourceSet.add('Bhagyank');
    });
    const sources = Array.from(sourceSet);

    return {
      name: template.name,
      type: template.type,
      digits: template.coordinates,
      title: template.title,
      description: template.meaning,
      strengthScore: completionPercentage,
      status: status,
      completionPercentage,
      strengthPercentage: completionPercentage,
      presentDigits,
      completeNumbers: presentDigits,
      missingDigits,
      missingNumbers: missingDigits,
      presentCount,
      meaning: template.meaning,
      interpretation,
      practicalMeaning,
      strengths: template.strengths,
      weaknesses: template.weaknesses,
      careerImpact: template.careerImpact,
      relationshipImpact: template.relationshipImpact,
      financialImpact: template.financialImpact,
      healthImpact: template.healthImpact,
      recommendedRemedies: template.recommendedRemedies,
      sources
    };
  });
}
