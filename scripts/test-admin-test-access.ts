/**
 * LEOFAMILY NUMEROLOGY — ADMIN_TEST ACCESS & PROFILE ISOLATION SUITE
 * Validates server-authoritative internal test access for:
 * 1. affectioncosmos@gmail.com
 * 2. attractabundance909@gmail.com
 *
 * Ensures:
 * - Unpaid normal users remain strictly locked
 * - Paid users remain functional (PAID accessType)
 * - Unauthenticated users remain blocked
 * - Same profile data across 2 users does NOT cause cross-user contamination or access bleed
 * - Users without profiles do not crash the system
 * - All My Reports endpoints function cleanly
 */

import { reportAccessEngine, isInternalAdminTestEmail, getAdminTestEmails } from '../src/server/accessEngine';
import { getProfileIsolationKey } from '../src/utils/localeUtils';
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
  console.log('LEOFAMILY NUMEROLOGY — ADMIN_TEST ACCESS & PROFILE ISOLATION');
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

  console.log('\n--- 7. Profile Data Collision & Isolation Test (Same Profile Data) ---');
  // Both User A (Admin) and User B (Normal) use identical personal details:
  // Name: "Markandey Singh", DOB: "05/08/1983", Mobile: "9876543210"
  const sharedProfileIdentity = {
    fullName: 'Markandey Singh',
    name: 'Markandey Singh',
    dob: '05/08/1983',
    mobile: '9876543210',
    gender: 'MALE'
  };
  const sharedProfileKey = getProfileIsolationKey(sharedProfileIdentity);

  // User A (Admin) checks access with shared profile key
  const userACheck = await reportAccessEngine.checkReportAccess(
    'MASTER_REPORT',
    sharedProfileKey,
    tokenA
  );
  assert(
    userACheck.allowed === true && userACheck.accessType === 'ADMIN_TEST',
    '[ISOLATION] User A (Admin) Access on Shared Profile Data',
    'User A gets ADMIN_TEST access on their profile data'
  );

  // User B (Normal) checks access with the exact same profile key
  const userBCheck = await reportAccessEngine.checkReportAccess(
    'MASTER_REPORT',
    sharedProfileKey,
    normalToken
  );
  assert(
    userBCheck.allowed === false,
    '[ISOLATION] User B (Normal) Denied on Same Profile Data',
    'User B does not inherit User A admin access despite identical profile details'
  );

  // User B cannot query or retrieve User A reports
  const userBReports = await reportAccessEngine.getUserReports(normalToken);
  assert(
    !userBReports.reports.some(r => r.userId === 'sb_usr_admin_a_123'),
    '[ISOLATION] User B Cannot Access User A Report Records',
    'User B report list strictly contains only User B owned records'
  );

  console.log('\n--- 8. Admin User with Missing / Empty Profile ---');
  const emptyProfileCheck = await reportAccessEngine.checkReportAccess(
    'MASTER_REPORT',
    '',
    tokenA
  );
  assert(
    emptyProfileCheck.allowed === true && emptyProfileCheck.profileKey === 'default_profile',
    '[RESILIENCE] Admin Test User with Empty Profile Key',
    'Empty profile key falls back safely to default_profile without crashing'
  );

  console.log('\n--- 9. All My Reports Endpoints Robustness ---');
  const summaryA = await reportAccessEngine.getUserAccessSummary(tokenA);
  assert(
    summaryA.success === true && summaryA.summary.adminTestAccess === true,
    '[API_AUDIT] Access Summary for Admin User',
    'Access summary correctly flags adminTestAccess: true'
  );

  const upiSubmissionsA = await reportAccessEngine.getUserUpiSubmissions(tokenA);
  assert(
    upiSubmissionsA.success === true && Array.isArray(upiSubmissionsA.submissions),
    '[API_AUDIT] User UPI Submissions Query',
    'User UPI submissions endpoint returns clean array without throwing'
  );

  const paymentHistoryA = await reportAccessEngine.getUserPaymentHistory(tokenA);
  assert(
    paymentHistoryA.success === true && Array.isArray(paymentHistoryA.payments),
    '[API_AUDIT] User Payment History Query',
    'Payment history query returns clean array without throwing'
  );

  const testReportItem = await reportAccessEngine.getReportById(
    'admin_test_master_sb_usr_admin_a_123',
    tokenA
  );
  assert(
    testReportItem.success === true && testReportItem.report.accessType === 'ADMIN_TEST',
    '[API_AUDIT] Retrieve Admin Test Report by ID',
    'Admin test report retrieved by ID with status UNLOCKED'
  );

  console.log('\n--- 10. Feedback Submission with ADMIN_TEST ---');
  const feedbackRes = await reportAccessEngine.submitConsultationFeedback(
    {
      reportType: 'MASTER_REPORT',
      profileKey: sharedProfileKey,
      rating: 5,
      clarity: 'crystal_clear',
      actionability: 'highly_actionable',
      feedbackText: 'Admin test validation of full 32-chapter dossier with profile isolation.',
    },
    tokenA
  );

  assert(
    feedbackRes.success === true,
    '[FEEDBACK] Admin Test User Feedback Submission',
    `Feedback recorded successfully (ID: ${feedbackRes.feedbackId})`
  );

  console.log('\n============================================================');
  console.log('ADMIN_TEST ACCESS & ISOLATION SUITE RESULTS');
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
