import { PlaneAnalysis } from './types';

const PLANE_TEMPLATES = [
  { name: 'Mental Plane', type: 'HORIZONTAL' as const, digits: [9, 5, 1], title: 'मानसिक विचार विमान', description: 'Governs thought, strategy, memory, and cognitive sharpness.' },
  { name: 'Emotional Plane', type: 'HORIZONTAL' as const, digits: [3, 5, 7], title: 'भावनात्मक संवेदनशीलता विमान', description: 'Governs intuition, empathy, feelings, and emotional resilience.' },
  { name: 'Practical Plane', type: 'HORIZONTAL' as const, digits: [8, 1, 6], title: 'व्यावहारिक भौतिक विमान', description: 'Governs physical execution, hard work, trade, and luxury.' },
  { name: 'Thought Plane', type: 'VERTICAL' as const, digits: [4, 3, 8], title: 'नियोजन एवं विचार विमान', description: 'Indicates deep research, systematic planning, and structural ideas.' },
  { name: 'Will Plane', type: 'VERTICAL' as const, digits: [9, 5, 1], title: 'इच्छाशक्ति संकल्प विमान', description: 'Determines inner drive, persistent willpower, and execution focus.' },
  { name: 'Action Plane', type: 'VERTICAL' as const, digits: [2, 7, 6], title: 'क्रियान्वयन भौतिक विमान', description: 'Measures swift translation of business plans into mechanical output.' },
  { name: 'Golden Prosperity Plane', type: 'DIAGONAL' as const, digits: [4, 5, 6], title: 'स्वर्ण समृद्धि विमान', description: 'Brings luxury, financial prosperity, and material balance.' },
  { name: 'Silver Spiritual Plane', type: 'DIAGONAL' as const, digits: [2, 5, 8], title: 'रजत आध्यात्मिक विमान', description: 'Governs peace of mind, high emotional wisdom, and steady focus.' }
];

export function calculatePlanes(enhancedGrid: Record<number, number>): PlaneAnalysis[] {
  return PLANE_TEMPLATES.map(template => {
    const presentCount = template.digits.filter(d => (enhancedGrid[d] || 0) > 0).length;
    let status: 'FULL' | 'EMPTY' | 'PARTIAL' = 'PARTIAL';
    let strengthScore = 0;

    if (presentCount === 3) {
      status = 'FULL';
      strengthScore = 100;
    } else if (presentCount === 0) {
      status = 'EMPTY';
      strengthScore = 0;
    } else {
      status = 'PARTIAL';
      strengthScore = Math.round((presentCount / 3) * 100);
    }

    return {
      name: template.name,
      type: template.type,
      digits: template.digits,
      title: template.title,
      description: template.description,
      strengthScore,
      status
    };
  });
}
