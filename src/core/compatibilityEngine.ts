import { calculateAdvancedCompatibility } from '../services/advancedCompatibilityEngine';

export { calculateAdvancedCompatibility };

export function calculateCompatibility(
  person1: { name: string; dob: string; mobile?: string },
  person2: { name: string; dob: string; mobile?: string }
) {
  if (!person1.dob || !person2.dob) {
    return {
      score: 50,
      verdict: 'PENDING',
      details: 'Please provide Date of Birth for both partners to run advanced compatibility analysis.'
    };
  }
  return calculateAdvancedCompatibility(person1, person2);
}
