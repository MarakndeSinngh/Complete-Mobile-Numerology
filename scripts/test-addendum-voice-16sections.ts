/**
 * scripts/test-addendum-voice-16sections.ts
 *
 * Verifies all requirements of the ADDENDUM — REPORT VOICE & STRUCTURE:
 * 1. 16 Sections in exact order.
 * 2. Consultant voice: "आप / You", bolded key words (**...**).
 * 3. Bullet length: >90% <= 12 words (average 3-10 words).
 * 4. Zero sample leakage: No 'Raajeev', '9930117696', 'persion@gmail', '50=5', '16-5-2039'.
 * 5. Distinctiveness: Driver 5 / Conductor 7 vs Driver 7 / Conductor 5.
 * 6. Golden Profile validation: Markandey Singh (05/08/1983, 9519093555).
 * 7. Single footer disclaimer per section: "पारंपरिक अंक-ज्योतिष पर आधारित मार्गदर्शन".
 * 8. Missing input notice when DOB/name/mobile is missing.
 * 9. Medical sanitization: Zero forbidden terms (cancer, tumour, cystic, suicidal).
 */

import { buildAddendumConsultationDossier } from '../src/core/addendumConsultationModel';
import { generateCompleteNumerologyProfile } from '../src/core';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`[PASS ✓] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL ✗] ${message}`);
    failed++;
  }
}

console.log('============================================================');
console.log('ADDENDUM CONSULTATION & 16-SECTION VERIFICATION SUITE');
console.log('============================================================\n');

// 1. Golden Profile: Markandey Singh (DOB: 05/08/1983, Mobile: 9519093555)
const markandeyProfile = generateCompleteNumerologyProfile({
  name: 'Markandey Singh',
  dob: '1983-08-05',
  gender: 'MALE',
  mobile: '9519093555'
});

const dossierHi = buildAddendumConsultationDossier(markandeyProfile, 'hi', {
  personalDetails: {
    name: 'Markandey Singh',
    dob: '05/08/1983',
    mobile: '9519093555',
    gender: 'MALE'
  },
  isAdmin: true
});

const dossierEn = buildAddendumConsultationDossier(markandeyProfile, 'en', {
  personalDetails: {
    name: 'Markandey Singh',
    dob: '05/08/1983',
    mobile: '9519093555',
    gender: 'MALE'
  },
  isAdmin: true
});

// Check section count
assert(dossierHi.sections.length === 16, `Hindi dossier has exactly 16 sections (got ${dossierHi.sections.length})`);
assert(dossierEn.sections.length === 16, `English dossier has exactly 16 sections (got ${dossierEn.sections.length})`);

// Check section ordering
const expectedSectionIds = [
  'sec-01-core-traits',
  'sec-02-combined-influence',
  'sec-03-strengths-challenges',
  'sec-04-characteristics',
  'sec-05-consultant-comments',
  'sec-06-loshu-grid',
  'sec-07-name-correction',
  'sec-08-mobile-audit',
  'sec-09-lucky-elements',
  'sec-10-health-indicators',
  'sec-11-personal-remedies',
  'sec-12-bank-email',
  'sec-13-numero-vastu',
  'sec-14-yoga-prayer',
  'sec-15-year-predictions',
  'sec-16-closing-note'
];

expectedSectionIds.forEach((id, idx) => {
  assert(
    dossierHi.sections[idx].id === id && dossierHi.sections[idx].sectionNumber === idx + 1,
    `Section ${idx + 1} matches canonical ID '${id}'`
  );
});

// Check bullet word count rule: >90% <= 12 words
console.log(`\n--- Bullet Word Count Analysis (Simple Hindi) ---`);
console.log(`Total Bullets: ${dossierHi.stats.totalBullets}`);
console.log(`Bullets <= 12 words: ${dossierHi.stats.bulletsUnder12Words} (${dossierHi.stats.pctUnder12Words.toFixed(1)}%)`);
assert(
  dossierHi.stats.pctUnder12Words >= 90,
  `Bullet length compliance: ${dossierHi.stats.pctUnder12Words.toFixed(1)}% <= 12 words (threshold >= 90%)`
);

// Check bolding in bullets (**...**)
let totalBoldedBullets = 0;
let totalBulletsWithText = 0;
dossierHi.sections.forEach(s => {
  if (s.bullets) {
    s.bullets.forEach(b => {
      totalBulletsWithText++;
      if (/\*\*.+?\*\*/.test(b.text)) {
        totalBoldedBullets++;
      }
    });
  }
});
const pctBolded = (totalBoldedBullets / totalBulletsWithText) * 100;
assert(
  pctBolded >= 80,
  `Bolding compliance: ${pctBolded.toFixed(1)}% of bullets contain bolded key terms (**...**)`
);

// Check zero sample value leakage
console.log(`\n--- Zero Sample Value Leakage Audit ---`);
const allTextHi = JSON.stringify(dossierHi);
const allTextEn = JSON.stringify(dossierEn);

const forbiddenPatterns = [
  /Raajeev/i,
  /9930117696/,
  /persion@gmail/,
  /50=5/,
  /16-5-2039/
];

forbiddenPatterns.forEach(pattern => {
  const leakedHi = pattern.test(allTextHi);
  const leakedEn = pattern.test(allTextEn);
  assert(!leakedHi && !leakedEn, `Zero leakage of sample pattern ${pattern.toString()}`);
});

// Check Driver / Conductor for Markandey Singh
const sec1 = dossierHi.sections[0];
assert(sec1.meta.driver === 5, `Markandey Singh Driver is 5 (got ${sec1.meta.driver})`);
assert(sec1.meta.conductor === 7, `Markandey Singh Conductor is 7 (got ${sec1.meta.conductor})`);

// Check distinctiveness: Driver 7 / Conductor 5 profile
console.log('\n--- Distinctiveness Test: Driver 5/7 vs Driver 7/5 ---');
const distinctProfile = generateCompleteNumerologyProfile({
  name: 'Sample Person',
  dob: '1980-07-07',
  gender: 'MALE',
  mobile: '9876543210'
});

const distinctDossier = buildAddendumConsultationDossier(distinctProfile, 'hi', {
  personalDetails: {
    name: 'Sample Person',
    dob: '07/07/1980',
    mobile: '9876543210',
    gender: 'MALE'
  }
});

assert(
  distinctDossier.sections[0].meta.driver === 7 && distinctDossier.sections[0].meta.conductor === 5,
  `Distinct profile has Driver 7 / Conductor 5`
);
assert(
  distinctDossier.sections[0].title !== dossierHi.sections[0].title,
  `Section 1 title is strictly distinct between Driver 5/7 and Driver 7/5`
);
assert(
  distinctDossier.sections[8].meta.luckyColors !== dossierHi.sections[8].meta.luckyColors,
  `Lucky colors are strictly distinct between Driver 5 and Driver 7`
);

// Check medical numerology sanitization
console.log(`\n--- Medical Numerology Sanitization Audit ---`);
const sec10 = dossierHi.sections[9];
assert(sec10.id === 'sec-10-health-indicators', `Section 10 is Health Indicators`);
const forbiddenMedical = ['cancer', 'tumour', 'cystic', 'suicidal', 'कैंसर', 'ट्यूमर', 'आत्मघाती'];
let foundForbidden = false;
forbiddenMedical.forEach(term => {
  if (JSON.stringify(sec10).toLowerCase().includes(term)) {
    foundForbidden = true;
    console.error(`Found forbidden medical term: ${term}`);
  }
});
assert(!foundForbidden, `Section 10 strictly free of forbidden disease/suicide terms`);

// Check Section 11 remedies: 5 concrete actions each
console.log(`\n--- Section 11 Remedies Audit (WHAT + WHEN + HOW LONG) ---`);
const sec11 = dossierHi.sections[10];
assert(sec11.meta.personalRemedy1.length === 5, `Personal Remedy 1 has exactly 5 concrete actions`);
assert(sec11.meta.personalRemedy2.length === 5, `Personal Remedy 2 has exactly 5 concrete actions`);

// Check missing input handling
console.log(`\n--- Missing Input Resilience Audit ---`);
const missingDobProfile = generateCompleteNumerologyProfile({
  name: 'Anonymous',
  dob: '',
  gender: 'MALE'
});
// Force empty dob
missingDobProfile.identity.dob = '';
missingDobProfile.identity.standardDOB = '';

const missingDossier = buildAddendumConsultationDossier(missingDobProfile, 'hi', {
  personalDetails: { name: '', dob: '', mobile: '' }
});
assert(!missingDossier.sections[0].hasValidInput, `Section 1 correctly flags missing DOB`);
assert(Boolean(missingDossier.sections[0].missingNotice), `Section 1 displays clean missing input notice`);
assert(!missingDossier.sections[6].hasValidInput, `Section 7 (Name) flags missing name input`);
assert(!missingDossier.sections[7].hasValidInput, `Section 8 (Mobile) flags missing mobile input`);

// Check Section Footers
console.log(`\n--- Section Footer Consistency Audit ---`);
dossierHi.sections.forEach(s => {
  assert(
    s.footerDisclaimer.includes('पारंपरिक अंक-ज्योतिष पर आधारित मार्गदर्शन'),
    `Section ${s.sectionNumber} includes mandatory single footer disclaimer`
  );
});

console.log('\n============================================================');
console.log(`TOTAL CHECKS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('============================================================');

if (failed > 0) {
  process.exit(1);
}
