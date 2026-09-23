/**
 * LEOFAMILY CONFLICT DETECTOR & METHODOLOGY AUDITOR
 * Runs automated consistency checks across all internal definitions and engines.
 */

import { IMMUTABLE_LOSHU_GRID } from './methodology/loshuDefinitions';
import { MASTER_PLANES } from './methodology/planeDefinitions';
import { MASTER_ARROWS } from './methodology/arrowDefinitions';
import { MOBILE_COMPOUND_DATABASE } from './methodology/mobileDefinitions';
import { PLANET_DEFINITIONS } from './methodology/planetMappings';
import { calculateMulank, calculateBhagyank } from './numerologyEngine';
import { getCombination81 } from './methodology/combinationDefinitions';
import { VEDIC_GRID_POSITIONS } from './vedicGridEngine';
import { analyzeKarmicPatterns } from './karmicEngine';
import { calculateKuaNumber } from './kuaEngine';
import { generate90DayActionPlan } from './actionPlanEngine';

export interface ConflictReport {
  timestamp: string;
  totalChecks: number;
  conflictsFound: number;
  conflicts: {
    system: string;
    description: string;
    severity: 'CRITICAL' | 'WARNING' | 'NOTICE';
    file1?: string;
    file2?: string;
  }[];
  isConsistent: boolean;
}

export function runMethodologyAudit(): ConflictReport {
  const conflicts: ConflictReport['conflicts'] = [];
  let checks = 0;

  // Check 1: Verify Lo Shu digits are strictly 1-9 without zero
  checks++;
  const loshuDigits = Object.keys(IMMUTABLE_LOSHU_GRID).map(Number);
  if (loshuDigits.includes(0)) {
    conflicts.push({
      system: 'LOSHU_GRID',
      description: 'Zero was found inside Lo Shu grid positions. Zeros must be excluded.',
      severity: 'CRITICAL'
    });
  }
  for (let i = 1; i <= 9; i++) {
    if (!loshuDigits.includes(i)) {
      conflicts.push({
        system: 'LOSHU_GRID',
        description: `Digit ${i} is missing from immutable Lo Shu grid definition.`,
        severity: 'CRITICAL'
      });
    }
  }

  // Check 2: Verify all 8 Master Planes have exactly 3 valid digits
  checks++;
  if (MASTER_PLANES.length !== 8) {
    conflicts.push({
      system: 'PLANES',
      description: `Expected 8 master planes (3 horizontal, 3 vertical, 2 diagonal), but found ${MASTER_PLANES.length}.`,
      severity: 'CRITICAL'
    });
  }
  MASTER_PLANES.forEach(plane => {
    if (plane.digits.length !== 3) {
      conflicts.push({
        system: 'PLANES',
        description: `Plane ${plane.name} has ${plane.digits.length} digits instead of 3.`,
        severity: 'CRITICAL'
      });
    }
  });

  // Check 3: Verify all 12 Master Arrows
  checks++;
  if (MASTER_ARROWS.length !== 12) {
    conflicts.push({
      system: 'ARROWS',
      description: `Expected 12 master arrows, but found ${MASTER_ARROWS.length}.`,
      severity: 'WARNING'
    });
  }

  // Check 4: Verify Mulank calculation consistency on canonical test dates
  checks++;
  const m1 = calculateMulank('05/08/1983');
  if (m1 !== 5) {
    conflicts.push({
      system: 'MULANK_ENGINE',
      description: `DOB 05/08/1983 should yield Mulank 5, got ${m1}.`,
      severity: 'CRITICAL'
    });
  }
  const m2 = calculateMulank('14/08/1983');
  if (m2 !== 5) {
    conflicts.push({
      system: 'MULANK_ENGINE',
      description: `DOB 14/08/1983 should yield Mulank 5, got ${m2}.`,
      severity: 'CRITICAL'
    });
  }

  // Check 5: Verify Bhagyank calculation on canonical test date (05/08/1983 -> 5+8+1+9+8+3 = 34 -> 7)
  checks++;
  const b1 = calculateBhagyank('05/08/1983');
  if (b1 !== 7) {
    conflicts.push({
      system: 'BHAGYANK_ENGINE',
      description: `DOB 05/08/1983 should yield Bhagyank 7, got ${b1}.`,
      severity: 'CRITICAL'
    });
  }

  // Check 6: Verify Planetary mappings cover digits 1-9
  checks++;
  for (let i = 1; i <= 9; i++) {
    if (!PLANET_DEFINITIONS[i]) {
      conflicts.push({
        system: 'PLANET_MAPPINGS',
        description: `Missing planetary definition for digit ${i}.`,
        severity: 'CRITICAL'
      });
    }
  }

  // Check 7: Mobile compound ratings completeness
  checks++;
  const sampleCompounds = [10, 14, 15, 16, 18, 19, 23, 24];
  sampleCompounds.forEach(c => {
    if (!MOBILE_COMPOUND_DATABASE[c]) {
      conflicts.push({
        system: 'MOBILE_COMPOUNDS',
        description: `Compound ${c} missing from MOBILE_COMPOUND_DATABASE.`,
        severity: 'WARNING'
      });
    }
  });

  // Check 8: Verify all 81 Combinations exist (1-1 through 9-9)
  checks++;
  let missingCombos = 0;
  for (let m = 1; m <= 9; m++) {
    for (let b = 1; b <= 9; b++) {
      const combo = getCombination81(m, b);
      if (!combo || !combo.title || !combo.code) {
        missingCombos++;
      }
    }
  }
  if (missingCombos > 0) {
    conflicts.push({
      system: 'COMBINATION_81',
      description: `${missingCombos} of 81 combinations failed retrieval or were incomplete.`,
      severity: 'CRITICAL'
    });
  }

  // Check 9: Vedic Grid positions completeness (digits 1-9 in 3x3 layout)
  checks++;
  for (let d = 1; d <= 9; d++) {
    const pos = VEDIC_GRID_POSITIONS[d];
    if (!pos || !pos.graha || !pos.direction) {
      conflicts.push({
        system: 'VEDIC_GRID',
        description: `Vedic Grid position for digit ${d} is invalid or missing definition.`,
        severity: 'CRITICAL'
      });
    }
  }

  // Check 10: Karmic Debt engine isolation (13, 14, 16, 19 detected; 15, 17 NOT flagged)
  checks++;
  const karmic13 = analyzeKarmicPatterns(13, 4, 31);
  if (!karmic13.hasKarmicDebt || !karmic13.karmicDebts.some(k => k.number === 13)) {
    conflicts.push({
      system: 'KARMIC_ENGINE',
      description: 'Day 13 should register as Karmic Debt #13.',
      severity: 'CRITICAL'
    });
  }
  const karmic15 = analyzeKarmicPatterns(15, 6, 24);
  if (karmic15.hasKarmicDebt) {
    conflicts.push({
      system: 'KARMIC_ENGINE',
      description: 'Day 15 is not a classical karmic debt and should not be flagged.',
      severity: 'CRITICAL'
    });
  }

  // Check 11: Kua calculation verification (Male 1984 -> 6 West; Female 1984 -> 9 East)
  checks++;
  const kuaMale1984 = calculateKuaNumber(1984, 'MALE');
  if (kuaMale1984.kuaNumber !== 6) {
    conflicts.push({
      system: 'KUA_ENGINE',
      description: `Male 1984 expected Kua 6, got ${kuaMale1984.kuaNumber}.`,
      severity: 'CRITICAL'
    });
  }
  const kuaFemale1984 = calculateKuaNumber(1984, 'FEMALE');
  if (kuaFemale1984.kuaNumber !== 9) {
    conflicts.push({
      system: 'KUA_ENGINE',
      description: `Female 1984 expected Kua 9, got ${kuaFemale1984.kuaNumber}.`,
      severity: 'CRITICAL'
    });
  }

  // Check 12: 90-Day Action Plan structure
  checks++;
  const actionPlan = generate90DayActionPlan({
    mulank: 1,
    bhagyank: 7,
    missingNumbers: [4, 8],
    repeatedNumbers: [1],
    weakPlanes: []
  });
  if (!actionPlan.phases.preparation || !actionPlan.phases.remediation || !actionPlan.phases.observation) {
    conflicts.push({
      system: 'ACTION_PLAN_ENGINE',
      description: 'Expected 3 structured phases (preparation, remediation, observation) in 90-day action plan.',
      severity: 'CRITICAL'
    });
  }

  return {
    timestamp: new Date().toISOString(),
    totalChecks: checks,
    conflictsFound: conflicts.length,
    conflicts,
    isConsistent: conflicts.length === 0
  };
}
