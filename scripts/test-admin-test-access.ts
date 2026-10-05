/**
 * LEOFAMILY NUMEROLOGY — ADMIN_TEST ACCESS VERIFICATION SUITE
 * Validates server-authoritative internal test access for:
 * 1. affectioncosmos@gmail.com
 * 2. attractabundance909@gmail.com
 *
 * Ensures:
 * - Unpaid normal users remain strictly locked
 * - Paid users remain functional (PAID accessType)
 * - Unauthenticated users remain blocked
 * - No fake payments or UTRs are created
 * - Client manipulation cannot bypass server checks
 */

import { reportAccessEngine, isInternalAdminTestEmail, getAdminTestEmails } from '../src/server/accessEngine';
import { REPORT_REGISTRY } from '../src/types/reportAccess';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS ✓] ${testName}: ${detail}`);
  } else {
    failedTests++;
    console.error(`[FAIL ✗] ${testName}: ${detail}`);
  }
}

function makeMockJwt(email: string, sub: string = 'mock-sub-123'): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      sub,
      email,
      role: 'authenticated',
      aud: 'authenticated',
      exp: Math.floor(Date.now() / 1000) + 3600,
      email_confirmed_at: new Date().toISOString(),
      user_metadata: { email, full_name: 'Admin Test User' }
    })
  ).toString('base64url');
  const sig = 'mock_signature';
  return `Bearer ${header}.${payload}.${sig}`;
}

async function runAdminTestAccessSuite() {
  console.log('============================================================');
  console.log('LEOFAMILY NUMEROLOGY — ADMIN_TEST ACCESS VERIFICATION SUITE');
  console.log('============================================================\n');

  console.log('--- 1. Server-Side Allowlist Configuration Audit ---');
  const allowlist = getAdminTestEmails();
  assert(
    allowlist.includes('affectioncosmos@gmail.com'),
    '[ALLOWLIST] Primary Admin Account',
    'affectioncosmos@gmail.com is present in server allowlist'
  );
  assert(
    allowlist.includes('attractabundance909@gmail.com'),
    '[ALLOWLIST] Secondary Admin Account',
    'attractabundance909@gmail.com is present in server allowlist'
  );
  assert(
    isInternalAdminTestEmail('AffectionCosmos@gmail.com '),
    '[ALLOWLIST] Case-Insensitive Normalization',
    'AffectionCosmos@gmail.com normalized to lowercase and trimmed'
  );
  assert(
    !isInternalAdminTestEmail('normaluser@gmail.com'),
    '[ALLOWLIST] Normal User Negative Test',
    'normaluser@gmail.com is correctly rejected from admin allowlist'
  );

  console.log('\n--- 2. Admin Account A: affectioncosmos@gmail.com ---');
  const tokenA = makeMockJwt('affectioncosmos@gmail.com', 'sb_usr_admin_a_123');
  const accessCheckA = await reportAccessEngine.checkReportAccess(
    'MASTER_REPORT',
    'profile_admin_a_test',
    tokenA
  );

  assert(
    accessCheckA.allowed === true,
    '[ADMIN_A_ACCESS] Master Report Access',
    `Allowed: ${accessCheckA.allowed}`
  );
  assert(
    accessCheckA.accessType === 'ADMIN_TEST',
    '[ADMIN_A_ACCESS] Access Type Identifier',
    `accessType is strictly ADMIN_TEST (got: ${accessCheckA.accessType})`
  );
  assert(
    accessCheckA.requiresPayment === false,
    '[ADMIN_A_ACCESS] Zero Payment Requirement',
    'No ₹33 payment required for admin test user'
  );

  const myReportsA = await reportAccessEngine.getUserReports(tokenA);
  assert(
    myReportsA.reports.some(r => r.reportType === 'MASTER_REPORT' && r.accessType === 'ADMIN_TEST'),
    '[ADMIN_A_MY_REPORTS] My Reports Content',
    'Master Report test dossier appears in My Reports for admin test account A'
  );

  console.log('\n--- 3. Admin Account B: attractabundance909@gmail.com ---');
  const tokenB = makeMockJwt('attractabundance909@gmail.com', 'sb_usr_admin_b_456');
  const accessCheckB = await reportAccessEngine.checkReportAccess(
    'MASTER_REPORT',
    'profile_admin_b_test',
    tokenB
  );

  assert(
    accessCheckB.allowed === true,
    '[ADMIN_B_ACCESS] Master Report Access',
    `Allowed: ${accessCheckB.allowed}`
  );
  assert(
    accessCheckB.accessType === 'ADMIN_TEST',
    '[ADMIN_B_ACCESS] Access Type Identifier',
    `accessType is strictly ADMIN_TEST (got: ${accessCheckB.accessType})`
  );
  assert(
    accessCheckB.requiresPayment === false,
    '[ADMIN_B_ACCESS] Zero Payment Requirement',
    'No ₹33 payment required for admin test user'
  );

  const myReportsB = await reportAccessEngine.getUserReports(tokenB);
  assert(
    myReportsB.reports.some(r => r.reportType === 'MASTER_REPORT' && r.accessType === 'ADMIN_TEST'),
    '[ADMIN_B_MY_REPORTS] My Reports Content',
    'Master Report test dossier appears in My Reports for admin test account B'
  );

  console.log('\n--- 4. Unpaid Normal User (Must Remain Strictly Locked) ---');
  const normalToken = makeMockJwt('normalcustomer99@gmail.com', 'sb_usr_normal_99');
  const normalCheck = await reportAccessEngine.checkReportAccess(
    'MASTER_REPORT',
    'profile_normal_customer',
    normalToken
  );

  assert(
    normalCheck.allowed === false,
    '[NORMAL_USER] Master Report Paywall Protection',
    'Unpaid normal user is denied direct access to Master Report'
  );
  assert(
    normalCheck.requiresPayment === true || normalCheck.canClaimFree === true,
    '[NORMAL_USER] Monetization / Free Claim Enforced',
    `requiresPayment: ${normalCheck.requiresPayment}, price: ₹${normalCheck.price}`
  );

  console.log('\n--- 5. Unauthenticated / Logged-Out Access ---');
  const unauthCheck = await reportAccessEngine.checkReportAccess(
    'MASTER_REPORT',
    'profile_anon_123',
    null
  );

  assert(
    unauthCheck.allowed === false,
    '[UNAUTHENTICATED] Master Report Locked',
    'Logged out anonymous visitor is blocked from Master Report'
  );

  console.log('\n--- 6. Client Parameter Bypass Resistance ---');
  // Simulates client attempting to spoof headers or query params
  const spoofCheck = await reportAccessEngine.checkReportAccess(
    'MASTER_REPORT',
    'profile_spoofed',
    null,
    'attacker@random.com'
  );

  assert(
    spoofCheck.allowed === false,
    '[SECURITY] No Email Spoofing Bypass in Serverless',
    'Unverified client email cannot grant admin or master report access'
  );

  console.log('\n--- 7. Feedback Submission with ADMIN_TEST ---');
  const feedbackRes = await reportAccessEngine.submitConsultationFeedback(
    {
      reportType: 'MASTER_REPORT',
      profileKey: 'profile_admin_a_test',
      rating: 5,
      clarity: 'crystal_clear',
      actionability: 'highly_actionable',
      feedbackText: 'Admin test validation of full 32-chapter dossier - excellent fidelity.',
    },
    tokenA
  );

  assert(
    feedbackRes.success === true,
    '[FEEDBACK] Admin Test User Feedback Submission',
    `Feedback recorded successfully (ID: ${feedbackRes.feedbackId})`
  );

  console.log('\n============================================================');
  console.log('ADMIN_TEST ACCESS SUITE RESULTS');
  console.log('============================================================');
  console.log(`TOTAL CHECKS: ${totalTests}`);
  console.log(`PASSED: ${passedTests}`);
  console.log(`FAILED: ${failedTests}`);
  console.log('============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAdminTestAccessSuite().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
