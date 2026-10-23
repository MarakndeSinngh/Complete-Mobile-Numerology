/**
 * scripts/render-golden-profile.ts
 *
 * Renders the full 16-section consultation text for Golden Profile:
 * Markandey Singh, DOB: 05/08/1983, Mobile: 9519093555, Male, Year: 2026.
 * Both Simple Hindi and English texts are displayed.
 */

import { buildAddendumConsultationDossier } from '../src/core/addendumConsultationModel';
import { generateCompleteNumerologyProfile } from '../src/core';

const profile = generateCompleteNumerologyProfile({
  name: 'Markandey Singh',
  dob: '1983-08-05',
  gender: 'MALE',
  mobile: '9519093555'
});

const personalDetails = {
  name: 'Markandey Singh',
  dob: '05/08/1983',
  mobile: '9519093555',
  gender: 'MALE'
};

console.log('================================================================');
console.log('GOLDEN PROFILE: MARKANDEY SINGH (SIMPLE HINDI RENDERING)');
console.log('================================================================\n');

const dossierHi = buildAddendumConsultationDossier(profile, 'hi', {
  personalDetails,
  isAdmin: true,
  consultantName: 'LeoFamily Vedic Numerology'
});

dossierHi.sections.forEach(s => {
  console.log(`\n### [${s.sectionNumber.toString().padStart(2, '0')}] ${s.title}`);
  if (s.intro) {
    console.log(`Intro: ${s.intro}`);
  }
  if (s.bullets) {
    s.bullets.forEach(b => {
      console.log(` • ${b.text}  (${b.wordCount} words)`);
    });
  }
  if (s.meta?.defectTable) {
    console.log(' [Numero Vastu 8-Direction Flaw Table Included]');
  }
  if (s.meta?.adminNotice) {
    console.log(` [Admin Notice: ${s.meta.adminNotice}]`);
  }
  console.log(` *पाद-टिप्पणी: ${s.footerDisclaimer}*`);
});

console.log('\n================================================================');
console.log('GOLDEN PROFILE: MARKANDEY SINGH (ENGLISH RENDERING)');
console.log('================================================================\n');

const dossierEn = buildAddendumConsultationDossier(profile, 'en', {
  personalDetails,
  isAdmin: true,
  consultantName: 'LeoFamily Vedic Numerology'
});

dossierEn.sections.forEach(s => {
  console.log(`\n### [${s.sectionNumber.toString().padStart(2, '0')}] ${s.title}`);
  if (s.intro) {
    console.log(`Intro: ${s.intro}`);
  }
  if (s.bullets) {
    s.bullets.forEach(b => {
      console.log(` • ${b.text}  (${b.wordCount} words)`);
    });
  }
  if (s.meta?.defectTable) {
    console.log(' [Numero Vastu 8-Direction Flaw Table Included]');
  }
  if (s.meta?.adminNotice) {
    console.log(` [Admin Notice: ${s.meta.adminNotice}]`);
  }
  console.log(` *Footer: ${s.footerDisclaimer}*`);
});
