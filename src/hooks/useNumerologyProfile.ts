import { useMemo } from 'react';
import { generateCompleteNumerologyProfile, CompleteProfileInput } from '../core/calculationEngine';
import { NumerologyProfile } from '../core/types';

export function useNumerologyProfile(input: CompleteProfileInput): {
  profile: NumerologyProfile | null;
  error: Error | null;
} {
  return useMemo(() => {
    if (!input.dob || !input.name) {
      return { profile: null, error: null };
    }
    try {
      const profile = generateCompleteNumerologyProfile(input);
      return { profile, error: null };
    } catch (err: any) {
      console.error('Numerology Engine Error:', err);
      return { profile: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }, [
    input.dob,
    input.name,
    input.mobile,
    input.gender,
    input.marriageDob,
    input.vehicleNumber,
    input.houseNumber,
    input.businessName
  ]);
}
