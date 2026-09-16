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
      interpretation = `The ${template.name} (${template.coordinates.join('-')}) is fully complete. All three vibrational nodes are active, channeling maximum harmonic power.`;
      practicalMeaning = `Outstanding natural mastery in ${template.name.toLowerCase()} domains: ${template.strengths.slice(0, 2).join('; ')}.`;
    } else if (presentCount === 2) {
      status = 'PARTIAL';
      completionPercentage = 66;
      interpretation = `The ${template.name} (${template.coordinates.join('-')}) is partially formed (2/3 active). Missing node: ${missingDigits.join(', ')}.`;
      practicalMeaning = `Strong functional capability, though occasional support or mindful focus is recommended for the missing digit (${missingDigits.join(', ')}).`;
    } else if (presentCount === 1) {
      status = 'PARTIAL';
      completionPercentage = 33;
      interpretation = `The ${template.name} (${template.coordinates.join('-')}) is partially activated with 1 node present (${presentDigits.join(', ')}). Missing nodes: ${missingDigits.join(', ')}.`;
      practicalMeaning = `Foundational seed active; conscious development of ${missingDigits.join(' and ')} brings balance.`;
    } else {
      status = 'EMPTY';
      completionPercentage = 0;
      interpretation = `The ${template.name} (${template.coordinates.join('-')}) has no active nodes in the chart.`;
      practicalMeaning = `Traditionally represents an area requiring conscious development through lifestyle remedies and practical mentorship.`;
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
