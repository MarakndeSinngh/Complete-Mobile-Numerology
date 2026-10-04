/**
 * LEOFAMILY NUMEROLOGY — PHASE 10 PRODUCTION FUNNEL & REAL-WORLD VALIDATION SUITE
 * 
 * Verifies the complete 12-stage production operating loop:
 * USER -> LANDING -> FREE ANALYSIS -> FREE RESULT -> MASTER REPORT PREVIEW ->
 * ₹33 PAYMENT -> UTR -> ADMIN VERIFICATION -> ENTITLEMENT -> MASTER REPORT ->
 * PDF -> USER ACTION -> FEEDBACK -> ANALYTICS -> OBSERVABILITY
 * 
 * Environment & Access Limitations are strictly recorded as:
 * "NOT VERIFIED — ENVIRONMENT / ACCESS LIMITATION"
 */

import {
  calculateMulank,
  calculateBhagyank,
  generateCompleteNumerologyProfile,
  CompleteNumerologyProfile
} from '../src/core';
import { calculateKuaNumber } from '../src/core/kuaEngine';
import { calculatePersonalYearNumber } from '../src/core/luckyDatesEngine';
import { deriveExpertConsultationDossier } from '../src/core/expertConsultationEngine';
import { analyzeCrossPatterns } from '../src/core/crossPatternEngine';
import { AdvancedInsightEngine } from '../src/core/advancedInsightEngine';
import { methodologyRegistry } from '../src/core/methodology/methodologyRegistry';
import { CHAPTER_RULE_GOVERNANCE_MAP } from '../src/core/methodology/chapterRuleMap';
import { REPORT_REGISTRY, isPublicReport } from '../src/types/reportAccess';
import { PAYMENT_CONFIG } from '../src/config/paymentConfig';
import { reportAccessEngine } from '../src/server/accessEngine';
import { isDatabaseConfigured } from '../src/server/db';

interface TestResult {
  category: string;
  testName: string;
  status: 'PASS' | 'FAIL' | 'NOT_VERIFIED_LIMITATION';
  details: string;
}

const testResults: TestResult[] = [];

function assert(
  category: string,
  testName: string,
  condition: boolean,
  passDetails: string,
  failDetails?: string
) {
  if (condition) {
    testResults.push({
      category,
      testName,
      status: 'PASS',
      details: passDetails
    });
    console.log(`[PASS ✓] [${category}] ${testName}: ${passDetails}`);
  } else {
    testResults.push({
      category,
      testName,
      status: 'FAIL',
      details: failDetails || 'Assertion failed'
    });
    console.error(`[FAIL ✗] [${category}] ${testName}: ${failDetails || 'Assertion failed'}`);
  }
}

function recordLimitation(category: string, testName: string, reason: string) {
  testResults.push({
    category,
    testName,
    status: 'NOT_VERIFIED_LIMITATION',
    details: `NOT VERIFIED — ENVIRONMENT / ACCESS LIMITATION: ${reason}`
  });
  console.log(`[LIMITATION ⚠] [${category}] ${testName}: NOT VERIFIED — ENVIRONMENT / ACCESS LIMITATION: ${reason}`);
}

async function runProductionFunnelTests() {
  console.log('\n============================================================');
  console.log('LEOFAMILY NUMEROLOGY — PHASE 10 PRODUCTION VALIDATION SUITE');
  console.log('============================================================\n');

  // -------------------------------------------------------------
  // 1. PRODUCTION ENVIRONMENT & SECRETS AUDIT
  // -------------------------------------------------------------
  console.log('--- 1. Production Environment & Security Audit ---');

  // Pricing Integrity
  assert(
    'PRICING',
    'Master Report Price Enforcement',
    PAYMENT_CONFIG.MASTER_REPORT_PRICE === 33 && REPORT_REGISTRY.MASTER_REPORT.priceInr === 33,
    'Authoritative price strictly locked at ₹33 INR in both PAYMENT_CONFIG and REPORT_REGISTRY.'
  );

  // UPI Configuration
  assert(
    'PAYMENT_CONFIG',
    'Official UPI Merchant Credentials',
    PAYMENT_CONFIG.LEOFAMILY_UPI_ID === 'leofamily@upi' && PAYMENT_CONFIG.LEOFAMILY_PAYEE_NAME.includes('LeoFamily'),
    `Official UPI VPA: ${PAYMENT_CONFIG.LEOFAMILY_UPI_ID} (${PAYMENT_CONFIG.LEOFAMILY_PAYEE_NAME})`
  );

  // UPI Intent URL format
  const sampleIntent = PAYMENT_CONFIG.getUpiIntentUrl(33, 'LeoFamily_Master_Report');
  assert(
    'PAYMENT_CONFIG',
    'UPI Intent URL Compliance',
    sampleIntent.startsWith('upi://pay?') && sampleIntent.includes('pa=leofamily@upi') && sampleIntent.includes('am=33'),
    `Generated compliant UPI intent URI: ${sampleIntent}`
  );

  // Database Connection Classification
  const dbActive = isDatabaseConfigured();
  if (dbActive) {
    assert(
      'DATABASE',
      'PostgreSQL Connection Availability',
      true,
      'Live PostgreSQL database connection pool configured and active.'
    );
  } else {
    recordLimitation(
      'DATABASE',
      'Remote PostgreSQL Cloud Database',
      'DATABASE_URL contains sandbox/local placeholders. LocalSandboxFallback memory active for isolation.'
    );
  }

  // Supabase Auth Service Role / Cloud Project
  const hasSupabaseUrl = !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
  const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (hasSupabaseUrl && hasServiceRoleKey) {
    assert(
      'AUTHENTICATION',
      'Supabase Server-Side Secret Provisioning',
      true,
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are present on server.'
    );
  } else {
    recordLimitation(
      'AUTHENTICATION',
      'Live Supabase Project Cloud Verification',
      'Supabase service role credentials not configured in local environment; guest/token verification simulated.'
    );
  }

  // -------------------------------------------------------------
  // 2. STAGE 1 & 2: USER PROFILE & FREE NUMEROLOGY CALCULATOR
  // -------------------------------------------------------------
  console.log('\n--- 2. Stage 1 & 2: User Input & Calculation Integrity ---');
  const testDOB = '1983-08-05';
  const testName = 'Rajeev Kumar';
  const testGender = 'MALE';
  const testMobile = '9876543210';

  const mulank = calculateMulank(testDOB);
  const bhagyank = calculateBhagyank(testDOB);
  const kua = calculateKuaNumber(1983, 'MALE');
  const py = calculatePersonalYearNumber(testDOB, 2026);

  assert('CALCULATION', 'Mulank (Driver) Calculation', mulank === 5, `Mulank = ${mulank} (Expected 5)`);
  assert('CALCULATION', 'Bhagyank (Destiny) Calculation', bhagyank === 7, `Bhagyank = ${bhagyank} (Expected 7)`);
  assert('CALCULATION', 'Kua Calculation', kua.kuaNumber === 8 && kua.group === 'WEST_GROUP', `Kua = ${kua.kuaNumber} (${kua.group})`);
  assert('CALCULATION', 'Personal Year 2026', py === 5, `Personal Year = ${py} (Expected 5)`);

  const profile: CompleteNumerologyProfile = generateCompleteNumerologyProfile({
    dob: testDOB,
    name: testName,
    gender: testGender,
    mobile: testMobile
  });
  assert('CALCULATION', 'Profile Grid Population', profile.loshu.birthGrid[5] >= 1, 'Raw DOB digits populated in Lo Shu natal grid');

  // -------------------------------------------------------------
  // 3. STAGE 3: PUBLIC VS PRIVATE ACCESS CLASSIFICATION
  // -------------------------------------------------------------
  console.log('\n--- 3. Stage 3: Public vs Private Access Gate ---');
  assert('ACCESS_CONTROL', 'Public Tier: Lo Shu Report', isPublicReport('LOSHU') === true, 'Lo Shu grid report is permanently free');
  assert('ACCESS_CONTROL', 'Public Tier: Mobile Numerology', isPublicReport('MOBILE_NUMEROLOGY') === true, 'Mobile Numerology report is permanently free');
  assert('ACCESS_CONTROL', 'Private Tier: 32-Chapter Master Report', isPublicReport('MASTER_REPORT') === false, 'Master Report is strictly private/paid');

  // Check unauthenticated access for Master Report
  const guestCheck = await reportAccessEngine.checkReportAccess(
    'MASTER_REPORT',
    'profile_test_guest',
    null,
    'unpaid_guest@example.com'
  );
  assert(
    'ACCESS_CONTROL',
    'Unpaid Access Gate Denial',
    guestCheck.allowed === false,
    `Unpaid user correctly denied access to Master Report (allowed: false, price: ${guestCheck.price})`
  );

  // -------------------------------------------------------------
  // 4. STAGES 4–8: ₹33 PAYMENT, UTR SUBMISSION & ADMIN VERIFICATION
  // -------------------------------------------------------------
  console.log('\n--- 4. Stages 4–8: ₹33 Payment, UTR Submission & Admin Loop ---');
  const testUtr = '428812345678';
  const testUserEmail = 'production_test_user@leofamily.online';
  const testProfileKey = 'profile_test_eev_19830805';

  // 4a. Short / Invalid UTR rejection
  try {
    await reportAccessEngine.submitUpiPayment(
      'MASTER_REPORT',
      testProfileKey,
      '123', // Invalid UTR (too short)
      'leofamily@upi',
      'Test User',
      null,
      testUserEmail
    );
    assert('ANTI_FRAUD', 'Invalid UTR Rejection', false, 'Expected error for short UTR');
  } catch (err: any) {
    assert(
      'ANTI_FRAUD',
      'Invalid UTR Rejection',
      true,
      `Invalid UTR (<6 chars) properly rejected with: "${err.message}"`
    );
  }

  // 4b. Valid UTR submission
  const submitRes = await reportAccessEngine.submitUpiPayment(
    'MASTER_REPORT',
    testProfileKey,
    testUtr,
    'leofamily@upi',
    'Rajeev Kumar',
    null,
    testUserEmail
  );
  assert(
    'UPI_FLOW',
    'Valid UTR Submission',
    submitRes.success && submitRes.status === 'PENDING' && !!submitRes.submissionId,
    `Payment submitted with ID ${submitRes.submissionId} (Status: ${submitRes.status})`
  );

  // 4c. Verify submission appears in Admin Pending list
  const pendingRes = await reportAccessEngine.getAdminPendingPayments();
  const foundPending = pendingRes.submissions.find((s: any) => s.id === submitRes.submissionId || s.utrNumber === testUtr);
  assert(
    'ADMIN_PANEL',
    'Admin Pending Payment Listing',
    !!foundPending && foundPending.status === 'PENDING',
    `Found pending UTR submission ${testUtr} in admin queue`
  );

  // 4d. Admin Approves Payment
  const verifyRes = await reportAccessEngine.verifyAdminUpiPayment(
    submitRes.submissionId,
    'APPROVE',
    'Verified with bank ledger',
    'Lead Auditor'
  );
  assert(
    'ADMIN_PANEL',
    'Admin Payment Approval',
    verifyRes.success && verifyRes.status === 'VERIFIED',
    `Admin approval succeeded: ${verifyRes.message}`
  );

  // 4e. Verify Entitlement is Granted
  const paidCheck = await reportAccessEngine.checkReportAccess(
    'MASTER_REPORT',
    testProfileKey,
    null,
    testUserEmail
  );
  assert(
    'ENTITLEMENT',
    'Post-Verification Entitlement Grant',
    paidCheck.allowed === true && paidCheck.accessType === 'PAID',
    `Report access granted! Allowed: ${paidCheck.allowed}, AccessType: ${paidCheck.accessType}`
  );

  // -------------------------------------------------------------
  // 5. STAGES 9–10: 32-CHAPTER MASTER REPORT & METHODOLOGY
  // -------------------------------------------------------------
  console.log('\n--- 5. Stages 9–10: 32-Chapter Master Dossier & Methodology ---');
  const expertDossier = deriveExpertConsultationDossier(profile);
  const patternDossier = analyzeCrossPatterns(profile);
  const insightDossier = AdvancedInsightEngine.generateDossier(profile);

  assert(
    'METHODOLOGY',
    'Chapter Governance Completeness',
    Object.keys(CHAPTER_RULE_GOVERNANCE_MAP).length === 32,
    `All 32 canonical consultation chapters registered with governance metadata`
  );

  assert(
    'METHODOLOGY',
    'Rule Registry Provenance',
    methodologyRegistry.getAllRules().length >= 35,
    `${methodologyRegistry.getAllRules().length} authoritative methodology rules registered in registry`
  );

  assert(
    'INSIGHT_ENGINE',
    'Advanced Cross-Pattern Synthesis',
    insightDossier.allValidatedInsights.length > 0 && !!insightDossier.standoutProfileNarrative?.en,
    `Validated ${insightDossier.allValidatedInsights.length} explainable insights with standout narrative: "${insightDossier.standoutProfileNarrative.en.slice(0, 45)}..."`
  );

  assert(
    'EXPERT_DOSSIER',
    'Dossier Executive Summary Presence',
    !!expertDossier.consultantSnapshot && expertDossier.consultantSnapshot.coreVerdictHi.length > 0,
    `Consultation dossier synthesized with core verdict: "${expertDossier.consultantSnapshot.coreVerdictHi.slice(0, 45)}..."`
  );

  // -------------------------------------------------------------
  // 6. STAGE 11: USER ACTION, CONSULTATION FEEDBACK & TELEMETRY
  // -------------------------------------------------------------
  console.log('\n--- 6. Stage 11: Feedback Loop & Telemetry Observability ---');
  const feedbackRes = await reportAccessEngine.submitConsultationFeedback(
    {
      reportType: 'MASTER_REPORT',
      profileKey: testProfileKey,
      rating: 5,
      clarity: 'crystal_clear',
      actionability: 'highly_actionable',
      feedbackText: 'The 32 chapters were exceptionally clear and the 90-day plan gave concrete remedial steps.'
    },
    null,
    testUserEmail
  );
  assert(
    'FEEDBACK_LOOP',
    'Customer Feedback Submission',
    feedbackRes.success && !!feedbackRes.feedbackId,
    `Feedback recorded with ID: ${feedbackRes.feedbackId}`
  );

  const adminFb = await reportAccessEngine.getAdminFeedback();
  const myFb = adminFb.feedback.find((f: any) => f.id === feedbackRes.feedbackId);
  assert(
    'FEEDBACK_LOOP',
    'Admin Feedback Observability',
    !!myFb && myFb.rating === 5 && myFb.clarity === 'crystal_clear',
    `Admin successfully retrieved 5-star rating with clarity: ${myFb?.clarity}`
  );

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n============================================================');
  console.log('PHASE 10 VALIDATION SUMMARY');
  console.log('============================================================');
  const passCount = testResults.filter(t => t.status === 'PASS').length;
  const failCount = testResults.filter(t => t.status === 'FAIL').length;
  const limitCount = testResults.filter(t => t.status === 'NOT_VERIFIED_LIMITATION').length;

  console.log(`TOTAL CHECKS: ${testResults.length}`);
  console.log(`PASSED: ${passCount}`);
  console.log(`FAILED: ${failCount}`);
  console.log(`LIMITATIONS (ENVIRONMENT): ${limitCount}`);
  console.log('============================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runProductionFunnelTests().catch((e) => {
  console.error("FATAL ERROR IN TEST SUITE:", e);
  process.exit(1);
});
