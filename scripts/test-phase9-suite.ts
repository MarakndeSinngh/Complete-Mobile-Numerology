import { calculateMulank, calculateBhagyank, generateCompleteNumerologyProfile, CompleteNumerologyProfile } from '../src/core';
import { calculateKuaNumber } from '../src/core/kuaEngine';
import { calculatePersonalYearNumber } from '../src/core/luckyDatesEngine';
import { calculateChaldeanNameSum } from '../src/core/chaldeanEngine';
import { calculatePythagoreanName } from '../src/core/pythagoreanEngine';
import { analyzeMobileNumerology } from '../src/core/mobileNumerologyEngine';
import { AdvancedInsightEngine } from '../src/core/advancedInsightEngine';
import { CHAPTER_RULE_GOVERNANCE_MAP } from '../src/core/methodology/chapterRuleMap';
import { methodologyRegistry } from '../src/core/methodology/methodologyRegistry';
import { reportAccessEngine } from '../src/server/accessEngine';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  message: string;
  evidence?: any;
}

const results: TestResult[] = [];

function assert(suite: string, name: string, condition: boolean, message: string, evidence?: any) {
  results.push({
    suite,
    name,
    passed: condition,
    message,
    evidence,
  });
  const symbol = condition ? '✓ PASS' : '✗ FAIL';
  console.log(`[${symbol}] [${suite}] ${name}: ${message}`);
}

async function runPhase9TestSuite() {
  console.log('============================================================');
  console.log('LEOFAMILY NUMEROLOGY — PHASE 9 AUTOMATED QA & INTEGRITY SUITE');
  console.log('============================================================\n');

  // =========================================================================
  // 1. CALCULATION INTEGRITY REGRESSION MATRIX
  // =========================================================================
  console.log('--- SUITE 1: CALCULATION INTEGRITY ---');

  // Profile A: 05/08/1983 (Mulank: 5, Bhagyank: 5+8+1+9+8+3 = 34 -> 7, Male Kua: 100-83=17->8)
  const mulankA = calculateMulank('1983-08-05');
  const bhagyankA = calculateBhagyank('1983-08-05');
  const kuaA = calculateKuaNumber(1983, 'MALE');
  const pyA = calculatePersonalYearNumber('1983-08-05', 2026); // 5 + 8 + 2+0+2+6 = 13 + 10 = 23 -> 5

  assert('CALCULATION', 'Profile A (05/08/1983) Mulank', mulankA === 5, `Mulank is ${mulankA} (Expected: 5)`);
  assert('CALCULATION', 'Profile A (05/08/1983) Bhagyank', bhagyankA === 7, `Bhagyank is ${bhagyankA} (Expected: 7)`);
  assert('CALCULATION', 'Profile A (1983, MALE) Kua', kuaA.kuaNumber === 8, `Kua is ${kuaA.kuaNumber} (Expected: 8, West Group)`);
  assert('CALCULATION', 'Profile A Personal Year 2026', pyA === 5, `PY is ${pyA} (Expected: 5)`);

  // Profile B: 14/08/1983 (Mulank: 1+4 = 5, Bhagyank: 1+4+8+1+9+8+3 = 34 -> 7)
  const mulankB = calculateMulank('1983-08-14');
  const bhagyankB = calculateBhagyank('1983-08-14');
  assert('CALCULATION', 'Profile B (14/08/1983) Mulank', mulankB === 5, `Compound 14 reduces to 5`);
  assert('CALCULATION', 'Profile B (14/08/1983) Bhagyank', bhagyankB === 7, `Bhagyank is 7`);

  // Profile C: 29/11/1990 (Mulank: 2+9=11->2, Bhagyank: 2+9+1+1+1+9+9+0 = 32 -> 5)
  const mulankC = calculateMulank('1990-11-29');
  const bhagyankC = calculateBhagyank('1990-11-29');
  assert('CALCULATION', 'Profile C (29/11/1990) Mulank', mulankC === 2, `Mulank is ${mulankC} (Expected: 2)`);
  assert('CALCULATION', 'Profile C (29/11/1990) Bhagyank', bhagyankC === 5, `Bhagyank is ${bhagyankC} (Expected: 5)`);

  // Name Calculations: "RAAJEEV SINGH"
  const chaldeanName = calculateChaldeanNameSum('RAAJEEV SINGH');
  const pythagoreanName = calculatePythagoreanName('RAAJEEV SINGH');
  assert('NAME_CALCULATION', 'Chaldean Name Calculation', chaldeanName.compound > 0 && chaldeanName.root >= 1 && chaldeanName.root <= 9, `Chaldean: ${chaldeanName.compound} -> ${chaldeanName.root}`);
  assert('NAME_CALCULATION', 'Pythagorean Name Calculation', pythagoreanName.totalSum > 0 && pythagoreanName.expressionNumber >= 1 && pythagoreanName.expressionNumber <= 9, `Pythagorean: ${pythagoreanName.totalSum} -> ${pythagoreanName.expressionNumber}`);

  // Mobile Numerology: "9876543210"
  const mobileRes = analyzeMobileNumerology('9876543210');
  assert('MOBILE_CALCULATION', 'Mobile 10-Digit Compound', mobileRes.compoundNumber === 45, `Total is ${mobileRes.compoundNumber} (Expected: 45)`);
  assert('MOBILE_CALCULATION', 'Mobile Root Number', mobileRes.rootNumber === 9, `Root is ${mobileRes.rootNumber} (Expected: 9)`);
  assert('MOBILE_CALCULATION', 'Mobile Zero Replacement', mobileRes.modifiedNumber.length === 10, `Modified number: ${mobileRes.modifiedNumber}`);
  assert('MOBILE_CALCULATION', 'Mobile Adjacent Pairs Count', mobileRes.pairsAnalysis.length === 9, `Adjacent pairs count is ${mobileRes.pairsAnalysis.length} (Expected: 9)`);

  // =========================================================================
  // 2. ENHANCED LO SHU SPECIAL CASE QA
  // =========================================================================
  console.log('\n--- SUITE 2: ENHANCED LO SHU SPECIAL CASES ---');

  const profileObj: CompleteNumerologyProfile = generateCompleteNumerologyProfile({
    dob: '1983-08-05',
    name: 'Markandey Singh',
    mobile: '9876543210',
    gender: 'MALE',
  });

  const presentDigits = profileObj.loshu?.enhancedGrid?.effectivePresentDigits || [];
  const missingDigits = profileObj.loshu?.enhancedGrid?.effectiveMissingDigits || [];

  assert('LO_SHU_QA', 'Lo Shu Present Digits Identified', presentDigits.includes(5) && presentDigits.includes(8) && presentDigits.includes(1) && presentDigits.includes(9) && presentDigits.includes(3), `Present: ${presentDigits.join(', ')}`);
  assert('LO_SHU_QA', 'Lo Shu Missing Digits Identified', missingDigits.includes(2) && missingDigits.includes(4) && missingDigits.includes(6), `Missing: ${missingDigits.join(', ')}`);
  assert('LO_SHU_QA', 'Enhanced 3-Layer Flat Grid populated', Object.keys(profileObj.loshu?.enhancedGrid?.flatGrid || {}).length > 0, `Flat grid cells count: ${Object.keys(profileObj.loshu?.enhancedGrid?.flatGrid || {}).length}`);
  assert('LO_SHU_QA', 'Planes of Destiny Calculated', (profileObj.loshu?.planes || []).length === 8, `Planes count: ${(profileObj.loshu?.planes || []).length}`);
  assert('LO_SHU_QA', 'Arrows of Strength/Weakness Calculated', (profileObj.loshu?.arrows || []).length === 12, `Arrows count: ${(profileObj.loshu?.arrows || []).length}`);

  // =========================================================================
  // 3. METHODOLOGY GOVERNANCE & 32-CHAPTER TRACEABILITY
  // =========================================================================
  console.log('\n--- SUITE 3: METHODOLOGY GOVERNANCE & 32-CHAPTER TRACEABILITY ---');

  const chapterKeys = Object.keys(CHAPTER_RULE_GOVERNANCE_MAP);
  assert('METHODOLOGY', 'Canonical 32 Chapters Mapped', chapterKeys.length === 32, `Total mapped chapters: ${chapterKeys.length} (Expected: 32)`);

  let allChaptersHaveSources = true;
  let allChaptersHaveRules = true;
  let allChaptersHavePillars = true;

  chapterKeys.forEach((k) => {
    const ch = CHAPTER_RULE_GOVERNANCE_MAP[k];
    if (!ch.sourceCitations || ch.sourceCitations.length === 0) allChaptersHaveSources = false;
    if (!ch.governingRuleIds || ch.governingRuleIds.length === 0) allChaptersHaveRules = false;
    if (!ch.primaryPillar) allChaptersHavePillars = false;
  });

  assert('METHODOLOGY', 'Every Chapter Has Source Citations', allChaptersHaveSources, 'All 32 chapters contain formal source citations');
  assert('METHODOLOGY', 'Every Chapter Has Governing Rule IDs', allChaptersHaveRules, 'All 32 chapters link to registered methodology rule IDs');
  assert('METHODOLOGY', 'Every Chapter Has Assigned 5-Pillar Category', allChaptersHavePillars, 'All 32 chapters map to CORE, CAREER, RELATIONSHIPS, VASTU, or ACTION');

  // =========================================================================
  // 4. ADVANCED INSIGHT ENGINE QA & SAFETY
  // =========================================================================
  console.log('\n--- SUITE 4: ADVANCED INSIGHT ENGINE QA & SAFETY ---');

  const insightDossier = AdvancedInsightEngine.generateDossier(profileObj);

  assert('INSIGHT_ENGINE', 'Primary Insights Generated', insightDossier.primaryInsights.length >= 3 && insightDossier.primaryInsights.length <= 5, `Primary insights count: ${insightDossier.primaryInsights.length}`);
  assert('INSIGHT_ENGINE', 'Standout Profile Narrative Present', insightDossier.standoutProfileNarrative.hi.length > 20 && insightDossier.standoutProfileNarrative.en.length > 20, 'Bilingual standout summary generated');
  assert('INSIGHT_ENGINE', 'All Insights Validated Against Rules', insightDossier.allValidatedInsights.every((i) => i.status === 'VALIDATED'), '100% of generated insights passed governance validation');
  assert('INSIGHT_ENGINE', '90-Day Prioritized Action Plan Present', insightDossier.prioritizedActionPlan.length === 4, `Action plan phases count: ${insightDossier.prioritizedActionPlan.length}`);

  // Safety check: No fatalistic/deterministic claims
  let hasDeterministicWording = false;
  insightDossier.allValidatedInsights.forEach((ins) => {
    const text = (ins.summary.en + ' ' + ins.whyThisMatters.en + ' ' + ins.practicalFocus.en).toLowerCase();
    if (text.includes('guaranteed wealth') || text.includes('will become rich') || text.includes('cure disease')) {
      hasDeterministicWording = true;
    }
  });
  assert('SAFETY_GOVERNANCE', 'No Deterministic / Fatalistic Wording', !hasDeterministicWording, 'All insights adhere to consultative, non-deterministic phrasing');

  // =========================================================================
  // 5. SERVER-AUTHORITATIVE SECURITY & ENTITLEMENT QA
  // =========================================================================
  console.log('\n--- SUITE 5: SERVER-AUTHORITATIVE ACCESS & ENTITLEMENT ---');

  // Check public reports: LOSHU and MOBILE_NUMEROLOGY are free
  const freeAccess = await reportAccessEngine.checkReportAccess('LOSHU', 'test_key_free');
  assert('SECURITY', 'LOSHU is Free & Accessible for All', freeAccess.allowed === true, 'Free tier accessible without payment');

  const mobileScannerAccess = await reportAccessEngine.checkReportAccess('MOBILE_NUMEROLOGY', 'test_key_mobile');
  assert('SECURITY', 'MOBILE_NUMEROLOGY is 100% Free', mobileScannerAccess.allowed === true, 'Mobile scanner is completely free');

  // Check private report: MASTER_REPORT is locked without entitlement
  const masterReportAccess = await reportAccessEngine.checkReportAccess('MASTER_REPORT', 'unpaid_profile_user_123');
  assert('SECURITY', 'MASTER_REPORT is Server-Locked for Unpaid Users', masterReportAccess.allowed === false, 'Master report requires verified entitlement');

  // Check UPI Payment Flow: Submit UTR -> PENDING -> Admin Approve -> ENTITLED
  const testUtr = `TEST_UTR_${Date.now()}`;
  const submitUpi = await reportAccessEngine.submitUpiPayment(
    'MASTER_REPORT',
    'profile_test_qa_456',
    testUtr,
    'user@okhdfcbank',
    'QA Test User',
    undefined,
    'qa.test@example.com'
  );

  assert('PAYMENT_LIFECYCLE', 'UPI UTR Submission State is PENDING', submitUpi.success === true && submitUpi.status === 'PENDING', `Submission ID: ${submitUpi.submissionId}, Status: ${submitUpi.status}`);

  // Verify Admin Approval
  const verifyRes = await reportAccessEngine.verifyAdminUpiPayment(
    submitUpi.submissionId,
    'APPROVE',
    undefined,
    'QA Admin Hardening Tester'
  );

  assert('PAYMENT_LIFECYCLE', 'Admin Approval Grants Entitlement', verifyRes.success === true && verifyRes.status === 'VERIFIED', 'Status updated to VERIFIED');

  // Verify that report is now unlocked for that profileKey
  const unlockedCheck = await reportAccessEngine.checkReportAccess('MASTER_REPORT', 'profile_test_qa_456', undefined, 'qa.test@example.com');
  assert('PAYMENT_LIFECYCLE', 'Report Access is Now Unlocked Post-Approval', unlockedCheck.allowed === true, `Entitlement check result: ${JSON.stringify(unlockedCheck)}`);

  // Verify Idempotency: Repeating Admin Approval does not error or duplicate
  const repeatVerify = await reportAccessEngine.verifyAdminUpiPayment(
    submitUpi.submissionId,
    'APPROVE',
    undefined,
    'QA Admin'
  );
  assert('PAYMENT_LIFECYCLE', 'Admin Verification is Idempotent', repeatVerify.success === true, 'Idempotent verification passes without duplication');

  // =========================================================================
  // 6. SUMMARY REPORT
  // =========================================================================
  console.log('\n============================================================');
  console.log('PHASE 9 TEST SUMMARY:');
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`TOTAL TESTS: ${results.length}`);
  console.log(`PASSED: ${passedCount}`);
  console.log(`FAILED: ${failedCount}`);
  console.log('============================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runPhase9TestSuite().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
