import { ExplanationDetail } from './types';
import { LEOFAMILY_PLANES } from './planeDefinitions';

export function generateExplanations(
  scores: any,
  enhancedGrid: Record<number, number>,
  driver: number,
  bhagyank: number
): Record<string, ExplanationDetail> {
  const presentDigits = Object.entries(enhancedGrid)
    .filter(([_, count]) => count > 0)
    .map(([digit]) => parseInt(digit, 10));

  const mindPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Mind Plane')!;
  const emotionalPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Emotional Plane')!;
  const practicalPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Practical Plane')!;
  const willPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Will Plane')!;
  const actionPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Action Plane')!;
  const silverYogDef = LEOFAMILY_PLANES.find(p => p.name === 'Silver Yog')!;

  const explanationMap: Record<string, ExplanationDetail> = {
    mentalStrength: {
      score: scores.mentalStrength,
      reason: `मस्तिष्क तल (Mind Plane ${mindPlaneDef.coordinates.join('')}) में उपस्थित अंकों के आधार पर: ${mindPlaneDef.coordinates.filter(d => enhancedGrid[d] > 0).join(', ') || 'कोई नहीं'}। मानसिक सतर्कता, तीव्र बुद्धि और उत्तम विचार क्षमता।`,
      formulaUsed: 'Math.max(35, Math.round((mentalCount / 3) * 100))',
      numbersUsed: mindPlaneDef.coordinates.filter(d => enhancedGrid[d] > 0),
      source: `Mind Plane ${mindPlaneDef.coordinates.join('')} Presence Frequencies`
    },
    emotionalStrength: {
      score: scores.emotionalStrength,
      reason: `भावनात्मक तल (Emotional Plane ${emotionalPlaneDef.coordinates.join('')}) के आधार पर: ${emotionalPlaneDef.coordinates.filter(d => enhancedGrid[d] > 0).join(', ') || 'कोई नहीं'}। अंतर्ज्ञान, संवेदनशीलता और सहानुभूति का स्तर दर्शाता है।`,
      formulaUsed: 'Math.max(35, Math.round((emotionalCount / 3) * 100))',
      numbersUsed: emotionalPlaneDef.coordinates.filter(d => enhancedGrid[d] > 0),
      source: `Emotional Plane ${emotionalPlaneDef.coordinates.join('')} Presence Frequencies`
    },
    practicalStrength: {
      score: scores.practicalStrength,
      reason: `व्यावहारिक तल (Practical Plane ${practicalPlaneDef.coordinates.join('')}) के आधार पर: ${practicalPlaneDef.coordinates.filter(d => enhancedGrid[d] > 0).join(', ') || 'कोई नहीं'}। कर्मठता, वित्तीय प्रबंधन और काम पूरा करने की लगन को नियंत्रित करता है।`,
      formulaUsed: 'Math.max(35, Math.round((practicalCount / 3) * 100))',
      numbersUsed: practicalPlaneDef.coordinates.filter(d => enhancedGrid[d] > 0),
      source: `Practical Plane ${practicalPlaneDef.coordinates.join('')} Presence Frequencies`
    },
    leadershipScore: {
      score: scores.leadershipScore,
      reason: `इच्छाशक्ति तल (Will Plane ${willPlaneDef.coordinates.join('')}) और कर्म तल (Action Plane ${actionPlaneDef.coordinates.join('')}) के समन्वय व मूलांक ${driver} पर आधारित। सूर्य (1) और मंगल (9) की उपस्थिति नेतृत्व क्षमता को मजबूती देती है।`,
      formulaUsed: '30 + Math.round(score951 * 35) + Math.round(score276 * 15) + (driver === 1 || driver === 9 ? 15 : 0)',
      numbersUsed: [...willPlaneDef.coordinates, ...actionPlaneDef.coordinates].filter(d => enhancedGrid[d] > 0),
      source: `Will Plane ${willPlaneDef.coordinates.join('')} & Action Plane ${actionPlaneDef.coordinates.join('')} alignment`
    },
    communicationScore: {
      score: scores.communicationScore,
      reason: `मस्तिष्क तल (Mind Plane ${mindPlaneDef.coordinates.join('')}) और भावनात्मक तल (Emotional Plane ${emotionalPlaneDef.coordinates.join('')}) के समन्वय से निर्धारित। केंद्रीय बुध (5) वाणी में स्पष्टता और प्रभाव देता है।`,
      formulaUsed: '30 + Math.round(score492 * 30) + Math.round(score357 * 20) + (driver === 5 || conductor === 5 ? 15 : 0)',
      numbersUsed: [...mindPlaneDef.coordinates, ...emotionalPlaneDef.coordinates].filter(d => enhancedGrid[d] > 0),
      source: `Mercury Stabilizer 5 & Emotional Plane ${emotionalPlaneDef.coordinates.join('')}`
    },
    spiritualScore: {
      score: scores.spiritualScore,
      reason: `भावनात्मक तल ${emotionalPlaneDef.coordinates.join('')} और रजत योग (Silver Yog ${silverYogDef.coordinates.join('')}) पर आधारित। केतु (7) और गुरु (3) के सूक्ष्म प्रभाव से अंतर्दृष्टि प्राप्त होती है।`,
      formulaUsed: '30 + Math.round(score357 * 30) + Math.round(score258 * 20) + (driver/conductor === 7 || 3 ? 15 : 0)',
      numbersUsed: [...emotionalPlaneDef.coordinates, ...silverYogDef.coordinates].filter(d => enhancedGrid[d] > 0),
      source: `Silver Yog ${silverYogDef.coordinates.join('')} & Emotional Plane ${emotionalPlaneDef.coordinates.join('')}`
    },
    relationshipScore: {
      score: scores.relationshipScore,
      reason: `भावनात्मक तल ${emotionalPlaneDef.coordinates.join('')} और कर्म तल ${actionPlaneDef.coordinates.join('')} के सामंजस्य पर आधारित। चंद्रमा (2) और शुक्र (6) की ऊर्जा संबंधों में मधुरता लाती है।`,
      formulaUsed: '30 + Math.round(score357 * 25) + Math.round(score276 * 25) + (driver/conductor === 2 || 6 ? 15 : 0)',
      numbersUsed: [...emotionalPlaneDef.coordinates, ...actionPlaneDef.coordinates].filter(d => enhancedGrid[d] > 0),
      source: 'Venus Harmony 6 & Moon Empathy 2'
    },
    careerPotentialScore: {
      score: scores.careerPotentialScore,
      reason: `प्रशासनिक नेतृत्व क्षमता, संवाद कुशलता और व्यावहारिक निष्पादन की समग्र ऊर्जा का विश्लेषण।`,
      formulaUsed: 'Math.round((leadershipScore + communicationScore + practicalStrength) / 3)',
      numbersUsed: [...willPlaneDef.coordinates, ...practicalPlaneDef.coordinates].filter(d => enhancedGrid[d] > 0),
      source: 'Career potential integration index'
    },
    overallLoshuScore: {
      score: scores.overallLoshuScore,
      reason: `सभी तलों (Planes) और अंकों के संपूर्ण संतुलन को दर्शाने वाला समग्र अंकशास्त्रीय सूचकांक।`,
      formulaUsed: 'Math.round((mental + emotional + practical + leadership + communication + spiritual + relationship) / 7)',
      numbersUsed: presentDigits,
      source: 'Consolidated Numerology Profile score index'
    }
  };

  return explanationMap;
}
