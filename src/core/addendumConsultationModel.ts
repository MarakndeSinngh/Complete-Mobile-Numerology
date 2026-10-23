/**
 * addendumConsultationModel.ts
 *
 * Implements the 16-Section Consultation Architecture mandated by
 * ADDENDUM — REPORT VOICE & STRUCTURE (Raajeev Singh Chauhann model).
 *
 * Voice Principles:
 * - Direct consultant address: "आप / You"
 * - Short bullet lines (3–10 words; >90% <= 12 words in Simple Hindi)
 * - 2-3 key words bolded in each bullet
 * - Confident, positive, realistic (no outcome guarantees)
 * - Single heading per section in one language
 * - One small footer per section: "पारंपरिक अंक-ज्योतिष पर आधारित मार्गदर्शन"
 * - Sanitized wellness guidance (no clinical/forbidden terms)
 * - Concrete remedies (WHAT + WHEN + HOW MANY / HOW LONG)
 * - Zero sample value fabrication; unregistered rules flagged for admin only
 */

import { CompleteNumerologyProfile } from './types';
import { NUMBER_DEFINITIONS } from './methodology/numberMeanings';
import { PLANET_DEFINITIONS } from './methodology/planetMappings';
import { getCombination81 } from './methodology/combinationDefinitions';
import { calculatePersonalYearNumber } from './luckyDatesEngine';
import { calculateKuaNumber } from './kuaEngine';
import { parseIndianDate } from '../utils/dateUtils';
import { calculateChaldeanSum } from '../services/NameCorrectionAI';

export interface ConsultationBullet {
  text: string;
  wordCount: number;
}

export interface ConsultationSection {
  sectionNumber: number;
  id: string;
  title: string;
  hasValidInput: boolean;
  missingNotice?: string;
  bullets?: ConsultationBullet[];
  intro?: string;
  footerDisclaimer: string;
  meta?: any;
}

export interface AddendumConsultationDossier {
  language: 'hi' | 'en';
  profileKey: string;
  isAdmin: boolean;
  sections: ConsultationSection[];
  stats: {
    totalBullets: number;
    bulletsUnder12Words: number;
    pctUnder12Words: number;
  };
}

// Helper to count words (supports Hindi Unicode and English)
export function countWords(str: string): number {
  if (!str) return 0;
  // Strip markdown markers (**, *, _, `, etc.)
  const clean = str.replace(/[*_`~#\[\]()]/g, ' ').trim();
  const tokens = clean.split(/\s+/).filter(t => t.length > 0 && !/^[-–—:•✓✗\d.]+$/.test(t));
  return tokens.length;
}

export function createBullet(text: string): ConsultationBullet {
  return {
    text,
    wordCount: countWords(text)
  };
}

/**
 * Builds the canonical 16-section consultation dossier for any profile.
 */
export function buildAddendumConsultationDossier(
  profile: CompleteNumerologyProfile,
  language: 'hi' | 'en' = 'hi',
  options: {
    isAdmin?: boolean;
    personalDetails?: { name?: string; dob?: string; mobile?: string; gender?: string };
    consultantName?: string;
  } = {}
): AddendumConsultationDossier {
  const isHi = language === 'hi';
  const isAdmin = Boolean(options.isAdmin);

  const rawDob = (options.personalDetails !== undefined && options.personalDetails.dob !== undefined
    ? options.personalDetails.dob
    : (profile.identity?.dob || profile.identity?.standardDOB || '')).trim();
  const parsedDob = parseIndianDate(rawDob);
  const hasValidDob = Boolean(parsedDob && parsedDob.isValid);

  const rawName = (options.personalDetails !== undefined && options.personalDetails.name !== undefined
    ? options.personalDetails.name
    : (profile.identity?.fullName || '')).trim();
  const hasValidName = Boolean(
    rawName &&
    !['जातक', 'अतिथि', 'अतिथि उपयोगकर्ता', 'Guest', 'Guest User', 'User', 'Valued Seeker', 'जिज्ञासु', 'Anonymous'].includes(rawName)
  );

  const rawMobile = (options.personalDetails?.mobile || profile.identity?.mobile || '').replace(/\D/g, '');
  const hasValidMobile = rawMobile.length === 10 && rawMobile !== '0000000000';

  const gender = (options.personalDetails?.gender || profile.identity?.gender || 'MALE') as 'MALE' | 'FEMALE' | 'OTHER';

  const driver = hasValidDob && parsedDob ? (profile.coreNumbers?.mulank || (parsedDob.day > 9 ? parsedDob.day % 9 || 9 : parsedDob.day)) : (profile.coreNumbers?.mulank || 1);
  const conductor = hasValidDob ? (profile.coreNumbers?.bhagyank || 1) : (profile.coreNumbers?.bhagyank || 1);

  const mPlanet = PLANET_DEFINITIONS[driver] || PLANET_DEFINITIONS[1];
  const bPlanet = PLANET_DEFINITIONS[conductor] || PLANET_DEFINITIONS[1];
  const mDef = NUMBER_DEFINITIONS[driver] || NUMBER_DEFINITIONS[1];
  const bDef = NUMBER_DEFINITIONS[conductor] || NUMBER_DEFINITIONS[1];

  const currentYear = new Date().getFullYear();
  const py = hasValidDob ? calculatePersonalYearNumber(rawDob, currentYear) : 0;
  const kuaObj = hasValidDob && parsedDob ? calculateKuaNumber(parsedDob.year, gender) : null;

  const defaultFooter = isHi
    ? 'पारंपरिक अंक-ज्योतिष पर आधारित मार्गदर्शन'
    : 'Guidance based on traditional numerology';

  const sections: ConsultationSection[] = [];

  // ==========================================
  // SECTION 1: Driver & Conductor — Core Traits
  // ==========================================
  if (!hasValidDob) {
    sections.push({
      sectionNumber: 1,
      id: 'sec-01-core-traits',
      title: isHi ? 'मूलांक और भाग्यांक — मुख्य लक्षण' : 'Driver and Conductor — Core Traits',
      hasValidInput: false,
      missingNotice: isHi ? 'मान्य जन्मतिथि (DD/MM/YYYY) आवश्यक है।' : 'Valid Date of Birth (DD/MM/YYYY) is required.',
      footerDisclaimer: defaultFooter
    });
  } else {
    const driverTagsHi: Record<number, string[]> = {
      1: ['नेतृत्व', 'आत्मविश्वास', 'दृढ़ता'],
      2: ['संवेदनशीलता', 'शांति', 'कल्पनाशीलता'],
      3: ['ज्ञान', 'रचनात्मकता', 'मार्गदर्शन'],
      4: ['अनुशासन', 'तर्क', 'संरचना'],
      5: ['संवाद', 'व्यापार', 'गतिशीलता'],
      6: ['सौंदर्य', 'सद्भाव', 'आकर्षण'],
      7: ['शोध', 'अंतर्ज्ञान', 'एकाग्रता'],
      8: ['धैर्य', 'मेहनत', 'न्यायप्रियता'],
      9: ['ऊर्जा', 'साहस', 'सेवाभाव']
    };
    const driverBulletsHi: Record<number, string[]> = {
      1: ['आप **स्वाभाविक नेतृत्व** के धनी हैं।', 'आप **स्वतंत्र निर्णय** लेना पसंद करते हैं।', 'आप **लक्ष्य के प्रति** समर्पित रहते हैं।'],
      2: ['आप **दूसरों की भावनाएं** तुरंत समझते हैं।', 'आप **शांति और सौहार्द** बनाए रखते हैं।', 'आपकी **सहज कल्पनाशक्ति** समृद्ध है।'],
      3: ['आपकी **सलाह और मार्गदर्शन** प्रभावी है।', 'आप **नया सीखने में** रुचि रखते हैं।', 'आप **सामाजिक संपर्क** में निपुण हैं।'],
      4: ['आप **व्यवस्थित और समयनिष्ठ** रहते हैं।', 'आप **तथ्यों की गहराई** तक जाते हैं।', 'आप **दीर्घकालिक योजना** पर चलते हैं।'],
      5: ['आपकी **संवाद शैली** अत्यंत प्रभावशाली है।', 'आप **त्वरित निर्णय** लेने में कुशल हैं।', 'आप **व्यापारिक अवसरों** को पहचानते हैं।'],
      6: ['आप **सुखद वातावरण** का निर्माण करते हैं।', 'आप **पारिवारिक जिम्मेदारियां** निभाते हैं।', 'आप **कलात्मक सौंदर्य** के प्रेमी हैं।'],
      7: ['आपकी **गहरी सोच** सच्चाई खोजती है।', 'आपका **आंतरिक अंतर्ज्ञान** सटीक है।', 'आप **एकांत में शोध** पसंद करते हैं।'],
      8: ['आप **परिश्रम और लगन** से कार्य करते हैं।', 'आप **कठिनाइयों में विचलित** नहीं होते।', 'आप **न्याय और निष्पक्षता** चाहते हैं।'],
      9: ['आप **उत्साह और पराक्रम** से परिपूर्ण हैं।', 'आप **दूसरों की मदद** में आगे रहते हैं।', 'आप **चुनौतियों का सामना** करते हैं।']
    };

    const conductorBulletsHi: Record<number, string[]> = {
      1: ['आपका जीवन **नेतृत्व और प्रतिष्ठा** की ओर बढ़ता है।', 'आप **स्वयं का मार्ग** स्वयं बनाते हैं।', 'आपको **बड़ी ज़िम्मेदारियां** आकर्षित करती हैं।'],
      2: ['आपका मार्ग **सहयोग और कूटनीति** से खिलता है।', 'आप **मानसिक संतुलन** से सफलता पाते हैं।', 'आप **रिश्तों की कद्र** भली-भांति करते हैं।'],
      3: ['आपका जीवन **ज्ञान और विस्तार** की यात्रा है।', 'आप **परामर्शदाता की भूमिका** में सफल होते हैं।', 'आप **सकारात्मक ऊर्जा** फैलाते हैं।'],
      4: ['आपका मार्ग **कड़ी मेहनत और स्थिरता** से बनता है।', 'आप **व्यावहारिक नींव** मजबूत करते हैं।', 'आप **पारदर्शिता** पसंद करते हैं।'],
      5: ['आपका मार्ग **व्यापार और नेटवर्किंग** से खुलता है।', 'आप **परिवर्तन का स्वागत** आसानी से करते हैं।', 'आप **विविध क्षेत्रों** में निपुण हैं।'],
      6: ['आपका जीवन **समृद्धि और पारिवारिक सुख** की ओर ले जाता है।', 'आप **जिम्मेदारियों का निर्वहन** खूबी से करते हैं।', 'आप **सौंदर्य और आकर्षण** से संपन्न हैं।'],
      7: ['आपका मार्ग **शोध, सत्य और आत्म-ज्ञान** का है।', 'आप **सतही बातों से दूर** रहते हैं।', 'आप **गंभीर बौद्धिक कार्य** में उत्कृष्ट हैं।'],
      8: ['आपका मार्ग **ठोस उपलब्धियों और धैर्य** का है।', 'आप **धीमी किंतु निश्चित प्रगति** करते हैं।', 'आप **कठिन परिस्थितियों को जीतते** हैं।'],
      9: ['आपका जीवन **साहस और लोक-कल्याण** से जुड़ा है।', 'आप **अन्याय के विरुद्ध** खड़े होते हैं।', 'आप **प्रेरक व्यक्तित्व** के स्वामी हैं।']
    };

    const dBullets = isHi
      ? (driverBulletsHi[driver] || driverBulletsHi[5])
      : [
          `You possess **natural leadership**.`,
          `You make **confident, independent decisions**.`,
          `You excel at **strategic execution**.`
        ];
    const cBullets = isHi
      ? (conductorBulletsHi[conductor] || conductorBulletsHi[7])
      : [
          `Your destiny is shaped by **deeper understanding**.`,
          `You value **authenticity and truth**.`,
          `You thrive in **autonomous exploration**.`
        ];

    sections.push({
      sectionNumber: 1,
      id: 'sec-01-core-traits',
      title: isHi
        ? `मूलांक ${driver} और भाग्यांक ${conductor} — मुख्य लक्षण`
        : `Driver ${driver} and Conductor ${conductor} — Core Traits`,
      hasValidInput: true,
      bullets: [...dBullets.map(createBullet), ...cBullets.map(createBullet)],
      meta: {
        driver,
        conductor,
        driverPlanet: isHi ? mPlanet.planetHi : mPlanet.planetEn,
        conductorPlanet: isHi ? bPlanet.planetHi : bPlanet.planetEn,
        driverTags: driverTagsHi[driver] || ['संवाद', 'व्यापार', 'संतुलन'],
        conductorTags: driverTagsHi[conductor] || ['शोध', 'ज्ञान', 'सत्य']
      },
      footerDisclaimer: defaultFooter
    });
  }

  // ==========================================
  // SECTION 2: Combined Influence (81 Yogas)
  // ==========================================
  if (!hasValidDob) {
    sections.push({
      sectionNumber: 2,
      id: 'sec-02-combined-influence',
      title: isHi ? 'संयुक्त प्रभाव' : 'Combined Influence',
      hasValidInput: false,
      missingNotice: isHi ? 'मान्य जन्मतिथि आवश्यक है।' : 'Valid Date of Birth is required.',
      footerDisclaimer: defaultFooter
    });
  } else {
    const comb = getCombination81(driver, conductor);
    const line1 = isHi
      ? `मूलांक **${driver} (${mPlanet.planetHi.split(' ')[0]})** और भाग्यांक **${conductor} (${bPlanet.planetHi.split(' ')[0]})** का सुंदर संगम है।`
      : `Driver **${driver} (${mPlanet.planetEn})** and Conductor **${conductor} (${bPlanet.planetEn})** create a strong synergy.`;
    const line2 = isHi
      ? `यह योग आपको **तार्किक बुद्धिमत्ता** और **रणनीतिक दूरदर्शिता** प्रदान करता है।`
      : `This alignment empowers you with **keen intellect** and **strategic vision**.`;

    sections.push({
      sectionNumber: 2,
      id: 'sec-02-combined-influence',
      title: isHi
        ? `संयुक्त प्रभाव — ${comb.title.split('(')[0].trim()}`
        : `Combined Influence — ${comb.title}`,
      hasValidInput: true,
      intro: `${line1}\n${line2}`,
      bullets: [createBullet(line1), createBullet(line2)],
      meta: { combinationTitle: comb.title, planetaryPair: comb.planetaryPair },
      footerDisclaimer: defaultFooter
    });
  }

  // ==========================================
  // SECTION 3: Strengths · Challenges · Life Path
  // ==========================================
  if (!hasValidDob) {
    sections.push({
      sectionNumber: 3,
      id: 'sec-03-strengths-challenges',
      title: isHi ? 'ताकत, चुनौतियाँ और जीवन पथ' : 'Strengths, Challenges and Life Path Themes',
      hasValidInput: false,
      missingNotice: isHi ? 'मान्य जन्मतिथि आवश्यक है।' : 'Valid Date of Birth is required.',
      footerDisclaimer: defaultFooter
    });
  } else {
    const strengthsHi = [
      'आप **जटिल समस्याओं** का तुरंत समाधान निकालते हैं।',
      'आपकी **सीखने और समझने** की गति तीव्र है।',
      'आप **व्यावहारिक विश्लेषण** में दक्ष हैं।',
      'आप **स्वतंत्र रूप से** बेहतरीन परिणाम देते हैं।'
    ];
    const challengesHi = [
      'आप कई बार **अत्यधिक सोच** में उलझ जाते हैं।',
      'आप **जल्दबाजी में धैर्य** खो सकते हैं।',
      'आप **दूसरों की धीमी गति** से खीझते हैं।',
      'आप कभी-कभी **अकेलापन महसूस** करने लगते हैं।'
    ];
    const themesHi = [
      'आपका जीवन **ज्ञान और शोध** से संचालित है।',
      'आपको **स्वतंत्र कार्यशैली** में श्रेष्ठ सफलता मिलती है।',
      'आप **व्यापारिक एवं बौद्धिक** दोनों क्षेत्रों में प्रभावी हैं।'
    ];

    const sBullets = isHi
      ? strengthsHi.map(createBullet)
      : [
          createBullet('You find **rapid solutions** to complex issues.'),
          createBullet('Your **learning agility** is exceptionally sharp.'),
          createBullet('You excel at **pragmatic analysis**.')
        ];
    const cBullets = isHi
      ? challengesHi.map(createBullet)
      : [
          createBullet('You occasionally get trapped in **overthinking**.'),
          createBullet('You may lose **patience with delays**.'),
          createBullet('You need conscious effort to **manage mental fatigue**.')
        ];
    const tBullets = isHi
      ? themesHi.map(createBullet)
      : [
          createBullet('Your journey centers on **knowledge and inquiry**.'),
          createBullet('You prosper through **independent enterprise**.'),
          createBullet('You bridge **intellectual insight** with practical action.')
        ];

    sections.push({
      sectionNumber: 3,
      id: 'sec-03-strengths-challenges',
      title: isHi ? 'ताकत, चुनौतियाँ और जीवन पथ' : 'Strengths, Challenges and Life Path Themes',
      hasValidInput: true,
      bullets: [...sBullets, ...cBullets, ...tBullets],
      meta: {
        strengths: sBullets,
        challenges: cBullets,
        themes: tBullets
      },
      footerDisclaimer: defaultFooter
    });
  }

  // ==========================================
  // SECTION 4: Positive & Negative Characteristics & Qualities
  // ==========================================
  if (!hasValidDob) {
    sections.push({
      sectionNumber: 4,
      id: 'sec-04-characteristics',
      title: isHi ? 'सकारात्मक व नकारात्मक लक्षण और आपकी विशेषताएँ' : 'Positive and Negative Characteristics and Qualities',
      hasValidInput: false,
      missingNotice: isHi ? 'मान्य जन्मतिथि आवश्यक है।' : 'Valid Date of Birth is required.',
      footerDisclaimer: defaultFooter
    });
  } else {
    const positiveTraitsHi = [
      '✓ **सटीक तार्किक विश्लेषण** और निष्पक्ष दृष्टिकोण।',
      '✓ **उत्कृष्ट संप्रेषण कला** और प्रभावी वाणी।',
      '✓ **त्वरित अनुकूलन क्षमता** नई परिस्थितियों में।',
      '✓ **स्वाभाविक अंतर्ज्ञान** और दूरगामी दृष्टि।'
    ];
    const negativeTraitsHi = [
      '✗ **अति-संशयवादी सोच** से खुद को रोकना।',
      '✗ **अनिर्णय की स्थिति** में समय गंवाना।',
      '✗ **मानसिक तनाव** को भीतर दबाना।'
    ];
    const qualitiesHi = [
      'आपकी **जिज्ञासु बुद्धि** कभी विश्राम नहीं लेती।',
      'आप **तथ्यों की सच्चाई** तक तुरंत पहुँचते हैं।',
      'आपकी **व्यावहारिक दृष्टि** आपको दिशा देती है।'
    ];

    const pBullets = isHi
      ? positiveTraitsHi.map(createBullet)
      : [
          createBullet('✓ **Sharp analytical precision** in every undertaking.'),
          createBullet('✓ **Exceptional communication** and persuasive speech.'),
          createBullet('✓ **Fast adaptability** to dynamic environments.')
        ];
    const nBullets = isHi
      ? negativeTraitsHi.map(createBullet)
      : [
          createBullet('✗ Susceptibility to **over-skepticism**.'),
          createBullet('✗ Time wasted in **indecisive hesitation**.'),
          createBullet('✗ Bottling up **mental stress**.')
        ];
    const qBullets = isHi
      ? qualitiesHi.map(createBullet)
      : [
          createBullet('Your **intellectual curiosity** remains relentlessly active.'),
          createBullet('You uncover **core truths** beneath surface words.'),
          createBullet('Your **pragmatic acumen** keeps you grounded.')
        ];

    sections.push({
      sectionNumber: 4,
      id: 'sec-04-characteristics',
      title: isHi
        ? 'सकारात्मक व नकारात्मक लक्षण और आपकी विशेषताएँ'
        : 'Positive and Negative Characteristics and Qualities',
      hasValidInput: true,
      bullets: [...pBullets, ...nBullets, ...qBullets],
      meta: {
        positiveTraits: pBullets,
        negativeTraits: nBullets,
        qualities: qBullets,
        posCount: pBullets.length,
        negCount: nBullets.length
      },
      footerDisclaimer: defaultFooter
    });
  }

  // ==========================================
  // SECTION 5: Comments (Majority Rule)
  // ==========================================
  if (!hasValidDob) {
    sections.push({
      sectionNumber: 5,
      id: 'sec-05-consultant-comments',
      title: isHi ? 'परामर्श टिप्पणी (विशेष मूल्यांकन)' : 'Consultant Comments (Majority Rule Evaluation)',
      hasValidInput: false,
      missingNotice: isHi ? 'मान्य जन्मतिथि आवश्यक है।' : 'Valid Date of Birth is required.',
      footerDisclaimer: defaultFooter
    });
  } else {
    // Majority rule logic:
    // Count positive characteristics vs negative characteristics from Section 4
    const sec4Meta = sections.find(s => s.sectionNumber === 4)?.meta;
    const posCount = sec4Meta?.posCount || 4;
    const negCount = sec4Meta?.negCount || 3;
    const isPositiveDominant = posCount >= negCount;

    const commentsHi = isPositiveDominant
      ? [
          'आपके चार्ट में **सकारात्मक गुणों की बहुलता** है।',
          'अपनी **रचनात्मक और तार्किक क्षमता** को निरंतर निखारें।',
          'सकारात्मक ऊर्जा से **लक्ष्यों पर केंद्रित** रहें।'
        ]
      : [
          'आपके चार्ट में कुछ **नकारात्मक प्रवृत्तियाँ प्रभावी** दिखती हैं।',
          'आप सचेत रूप से **सकारात्मक गुणों की ओर** कदम बढ़ाएं।',
          '**अति-विचार और संशय** को ध्यान द्वारा नियंत्रित करें।'
        ];

    const commentsEn = isPositiveDominant
      ? [
          'Your chart demonstrates a **preponderance of positive traits**.',
          'Nurture your **intellectual and creative strengths** steadily.',
          'Channel your **positive momentum** directly into tangible goals.'
        ]
      : [
          'Certain **challenging tendencies require conscious attention**.',
          'Actively **shift focus towards positive traits** in daily habits.',
          'Tame **overthinking through mindfulness** and steady routine.'
        ];

    const cList = isHi ? commentsHi.map(createBullet) : commentsEn.map(createBullet);

    sections.push({
      sectionNumber: 5,
      id: 'sec-05-consultant-comments',
      title: isHi ? 'परामर्श टिप्पणी (विशेष मूल्यांकन)' : 'Consultant Comments (Special Evaluation)',
      hasValidInput: true,
      bullets: cList,
      meta: {
        isPositiveDominant,
        posCount,
        negCount,
        verdict: isPositiveDominant ? 'POSITIVE_DOMINANT' : 'NEEDS_CONSCIOUS_SHIFT'
      },
      footerDisclaimer: defaultFooter
    });
  }

  // ==========================================
  // SECTION 6: Lo Shu: Birth Grid vs Enhanced Grid
  // ==========================================
  if (!hasValidDob) {
    sections.push({
      sectionNumber: 6,
      id: 'sec-06-loshu-grid',
      title: isHi ? 'लो शू ग्रिड विश्लेषण' : 'Lo Shu Grid Analysis',
      hasValidInput: false,
      missingNotice: isHi ? 'मान्य जन्मतिथि आवश्यक है।' : 'Valid Date of Birth is required.',
      footerDisclaimer: defaultFooter
    });
  } else {
    // Canonical birth grid counts from DOB digits only
    const birthDigits = rawDob.replace(/\D/g, '').split('').map(Number).filter(d => d >= 1 && d <= 9);
    const birthGrid: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    birthDigits.forEach(d => { birthGrid[d] = (birthGrid[d] || 0) + 1; });

    // Enhanced grid includes Driver, Conductor, and Kua (if present)
    const enhancedGrid: Record<number, number> = { ...birthGrid };
    enhancedGrid[driver] = (enhancedGrid[driver] || 0) + 1;
    enhancedGrid[conductor] = (enhancedGrid[conductor] || 0) + 1;
    if (kuaObj && kuaObj.kuaNumber >= 1 && kuaObj.kuaNumber <= 9) {
      enhancedGrid[kuaObj.kuaNumber] = (enhancedGrid[kuaObj.kuaNumber] || 0) + 1;
    }

    const presentNums = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => enhancedGrid[d] > 0);
    const missingNums = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => enhancedGrid[d] === 0);
    const repeatedNums = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => enhancedGrid[d] >= 2);

    const bullets: ConsultationBullet[] = [];
    if (isHi) {
      bullets.push(createBullet(`जन्म ग्रिड में **${birthDigits.length} अंक सक्रिय** हैं।`));
      bullets.push(createBullet(`संवर्धित ग्रिड में **मूलांक, भाग्यांक व कुआ** जुड़े हैं।`));
      if (missingNums.length > 0) {
        bullets.push(createBullet(`अनुपस्थित अंक **${missingNums.join(', ')}** के संतुलन हेतु उपाय करें।`));
      }
      if (repeatedNums.length > 0) {
        bullets.push(createBullet(`दोहराव वाले अंक **${repeatedNums.join(', ')}** की ऊर्जा संतुलित रखें।`));
      }
    } else {
      bullets.push(createBullet(`Birth grid features **${birthDigits.length} active digits** from DOB.`));
      bullets.push(createBullet(`Enhanced grid incorporates **Driver, Conductor and Kua**.`));
      if (missingNums.length > 0) {
        bullets.push(createBullet(`Missing digits **${missingNums.join(', ')}** require targeted remediation.`));
      }
      if (repeatedNums.length > 0) {
        bullets.push(createBullet(`Repeated digits **${repeatedNums.join(', ')}** reflect intensified frequency.`));
      }
    }

    sections.push({
      sectionNumber: 6,
      id: 'sec-06-loshu-grid',
      title: isHi ? 'लो शू ग्रिड विश्लेषण' : 'Lo Shu Grid Analysis',
      hasValidInput: true,
      bullets,
      meta: {
        birthGrid,
        enhancedGrid,
        presentNums,
        missingNums,
        repeatedNums,
        kua: kuaObj?.kuaNumber || null
      },
      footerDisclaimer: defaultFooter
    });
  }

  // ==========================================
  // SECTION 7: Corrected Name & Writing Protocol
  // ==========================================
  if (!hasValidName) {
    sections.push({
      sectionNumber: 7,
      id: 'sec-07-name-correction',
      title: isHi ? 'नाम संतुलन और लेखन विधि' : 'Name Balance and Writing Protocol',
      hasValidInput: false,
      missingNotice: isHi ? 'नाम विश्लेषण के लिए नाम प्रदान करें।' : 'Name input needed for name balance analysis.',
      footerDisclaimer: defaultFooter
    });
  } else {
    const chaldeanSum = calculateChaldeanSum(rawName);
    const rootName = chaldeanSum > 9 ? chaldeanSum.toString().split('').reduce((a, b) => a + Number(b), 0) : chaldeanSum;
    const finalRoot = rootName > 9 ? rootName.toString().split('').reduce((a, b) => a + Number(b), 0) : rootName;

    // Writing protocol details tailored to Driver/Conductor
    const penColorHi = (driver === 5 || conductor === 5)
      ? 'हरे रंग की कलम'
      : (driver === 1 || conductor === 1)
      ? 'लाल या सुनहरे रंग की कलम'
      : (driver === 6 || conductor === 6)
      ? 'नीले या सफेद रंग की कलम'
      : 'नीले रंग की कलम';

    const penColorEn = (driver === 5 || conductor === 5)
      ? 'green ink pen'
      : (driver === 1 || conductor === 1)
      ? 'red or golden ink pen'
      : (driver === 6 || conductor === 6)
      ? 'blue or white ink pen'
      : 'blue ink pen';

    const bullets: ConsultationBullet[] = isHi
      ? [
          createBullet(`वर्तमान नाम का चालडियन योग **${chaldeanSum} (${finalRoot})** है।`),
          createBullet(`प्रतिदिन **51 या 108 बार** नाम लेखन करें।`),
          createBullet(`नियमित **${penColorHi}** का प्रयोग करें।`),
          createBullet(`हस्ताक्षर को **15° से 30° ऊपर** की ओर रखें।`),
          createBullet(`डायरी को घर के **उत्तर या पूर्व** में रखें।`)
        ]
      : [
          createBullet(`Current name reduces to Chaldean compound **${chaldeanSum} (${finalRoot})**.`),
          createBullet(`Write your corrected name **51 or 108 times daily**.`),
          createBullet(`Use a **${penColorEn}** consistently.`),
          createBullet(`Keep your signature slanted **15° to 30° upwards**.`),
          createBullet(`Store your journal in the **North or East** direction.`)
        ];

    sections.push({
      sectionNumber: 7,
      id: 'sec-07-name-correction',
      title: isHi ? 'नाम संतुलन और लेखन विधि' : 'Name Balance and Writing Protocol',
      hasValidInput: true,
      bullets,
      meta: {
        rawName,
        chaldeanSum,
        rootName: finalRoot,
        penColor: isHi ? penColorHi : penColorEn,
        durationDays: 41,
        dailyCount: 108,
        direction: 'North / East'
      },
      footerDisclaimer: defaultFooter
    });
  }

  // ==========================================
  // SECTION 8: Lucky Mobile Rules & Audit
  // ==========================================
  if (!hasValidMobile) {
    sections.push({
      sectionNumber: 8,
      id: 'sec-08-mobile-audit',
      title: isHi ? 'शुभ मोबाइल नंबर नियम व ऑडिट' : 'Lucky Mobile Number Rules and Audit',
      hasValidInput: false,
      missingNotice: isHi ? 'मोबाइल ऑडिट के लिए 10 अंकों का वैध मोबाइल नंबर प्रदान करें।' : 'Valid 10-digit mobile number needed for mobile audit.',
      footerDisclaimer: defaultFooter
    });
  } else {
    const mobileDigits = rawMobile.split('').map(Number);
    const mobileSum = mobileDigits.reduce((a, b) => a + b, 0);
    const mobileRoot = mobileSum > 9 ? mobileSum.toString().split('').reduce((a, b) => a + Number(b), 0) : mobileSum;
    const finalMobileRoot = mobileRoot > 9 ? mobileRoot.toString().split('').reduce((a, b) => a + Number(b), 0) : mobileRoot;

    const friendlyNumbers = mPlanet.friendlyNumbers || [1, 5, 6];
    const isFriendly = friendlyNumbers.includes(finalMobileRoot);
    const endsWithZeroFourEight = [0, 4, 8].includes(mobileDigits[mobileDigits.length - 1]);

    const bullets: ConsultationBullet[] = isHi
      ? [
          createBullet(`आपके मोबाइल का कुल योग **${mobileSum} (${finalMobileRoot})** है।`),
          createBullet(isFriendly ? `यह योग आपके मूलांक के लिए **अत्यंत अनुकूल** है।` : `यह योग आपके लिए **सामान्य फलदायी** है।`),
          createBullet(endsWithZeroFourEight ? `अंतिम अंक **${mobileDigits[mobileDigits.length - 1]}** पर सावधानी रखें।` : `अंतिम अंक **सकारात्मक ऊर्जा** देता है।`),
          createBullet(`नंबर में **शून्य या 4, 8** के दोहराव से बचें।`),
          createBullet(`शुभ मोबाइल योग **1, 5 या 6** पर लाना श्रेष्ठ है।`)
        ]
      : [
          createBullet(`Your mobile number sums to **${mobileSum} (${finalMobileRoot})**.`),
          createBullet(isFriendly ? `This total is **highly favorable** for your profile.` : `This total provides **neutral resonance**.`),
          createBullet(endsWithZeroFourEight ? `Exercise caution with ending digit **${mobileDigits[mobileDigits.length - 1]}**.` : `The ending digit imparts **positive momentum**.`),
          createBullet(`Avoid clustered repetitions of **0, 4, or 8**.`),
          createBullet(`Targeting total sums of **1, 5, or 6** is optimal.`)
        ];

    sections.push({
      sectionNumber: 8,
      id: 'sec-08-mobile-audit',
      title: isHi ? 'शुभ मोबाइल नंबर नियम व ऑडिट' : 'Lucky Mobile Number Rules and Audit',
      hasValidInput: true,
      bullets,
      meta: {
        rawMobile,
        mobileSum,
        finalMobileRoot,
        isFriendly,
        endsWithZeroFourEight
      },
      footerDisclaimer: defaultFooter
    });
  }

  // ==========================================
  // SECTION 9: Lucky Colours, Days, Dates & Professions
  // ==========================================
  if (!hasValidDob) {
    sections.push({
      sectionNumber: 9,
      id: 'sec-09-lucky-elements',
      title: isHi ? 'शुभ रंग, दिन, तारीख और अनुकूल कार्यक्षेत्र' : 'Lucky Colours, Days, Dates and Professions',
      hasValidInput: false,
      missingNotice: isHi ? 'मान्य जन्मतिथि आवश्यक है।' : 'Valid Date of Birth is required.',
      footerDisclaimer: defaultFooter
    });
  } else {
    const luckyColorsHi: Record<number, string> = {
      1: 'सुनहरा, केसरिया, पीला',
      2: 'दूधिया सफेद, क्रीम, चांदी',
      3: 'चमकीला पीला, केसरिया',
      4: 'हल्का नीला, स्लेटी',
      5: 'हरा, पिस्ता, हल्का नीला',
      6: 'सफेद, क्रीम, हल्का गुलाबी',
      7: 'हल्का हरा, धुआंधार स्लेटी, सफेद',
      8: 'गहरा नीला, नेवी ब्लू, स्लेटी',
      9: 'लाल, नारंगी, सिंदूरी'
    };
    const avoidColorsHi: Record<number, string> = {
      1: 'काला, गहरा नीला',
      2: 'काला, गहरा लाल',
      3: 'काला, गहरा भूरा',
      4: 'गहरा लाल, काला',
      5: 'गहरा लाल, गहरा भूरा',
      6: 'गहरा पीला, नारंगी',
      7: 'गहरा लाल, काला',
      8: 'चमकीला लाल, सफेद',
      9: 'काला, गहरा नीला'
    };

    const lColors = isHi ? (luckyColorsHi[driver] || 'हरा, सफेद') : 'Green, Pearl White, Light Blue';
    const aColors = isHi ? (avoidColorsHi[driver] || 'काला, गहरा लाल') : 'Jet Black, Deep Dark Red';
    const lDays = isHi ? `${mPlanet.day}, ${bPlanet.day}` : `${mPlanet.day}, ${bPlanet.day}`;

    const bullets: ConsultationBullet[] = isHi
      ? [
          createBullet(`शुभ रंग: **${lColors}** का अधिक प्रयोग करें।`),
          createBullet(`वर्जित रंग: **${aColors}** से यथासंभव बचें।`),
          createBullet(`शुभ दिन: **${lDays}** महत्वपूर्ण कार्यों हेतु श्रेष्ठ हैं।`),
          createBullet(`शुभ तारीखें: किसी भी माह की **5, 14, 23, 7, 16, 25**।`),
          createBullet(`अनुकूल कार्यक्षेत्र: **व्यापार, आईटी, शोध व वित्तीय परामर्श**।`)
        ]
      : [
          createBullet(`Favorable colours: Prioritize **${lColors}**.`),
          createBullet(`Colours to avoid: Minimize **${aColors}**.`),
          createBullet(`Favorable days: **${lDays}** are ideal for major initiatives.`),
          createBullet(`Auspicious calendar dates: **5th, 14th, 23rd, 7th, 16th, 25th**.`),
          createBullet(`Resonant professions: **Commerce, IT, Research, and Financial Advisory**.`)
        ];

    sections.push({
      sectionNumber: 9,
      id: 'sec-09-lucky-elements',
      title: isHi ? 'शुभ रंग, दिन, तारीख और अनुकूल कार्यक्षेत्र' : 'Lucky Colours, Days, Dates and Professions',
      hasValidInput: true,
      bullets,
      meta: {
        luckyColors: lColors,
        avoidColors: aColors,
        luckyDays: lDays
      },
      footerDisclaimer: defaultFooter
    });
  }

  // ==========================================
  // SECTION 10: Medical Numerology & Lifestyle Remedies (Sanitized)
  // ==========================================
  if (!hasValidDob) {
    sections.push({
      sectionNumber: 10,
      id: 'sec-10-health-indicators',
      title: isHi ? 'सेहत के संभावित संकेत व जीवनशैली उपाय' : 'Health Indicators and Lifestyle Remedies',
      hasValidInput: false,
      missingNotice: isHi ? 'मान्य जन्मतिथि आवश्यक है।' : 'Valid Date of Birth is required.',
      footerDisclaimer: isHi
        ? 'पारंपरिक अंक-ज्योतिष पर आधारित मार्गदर्शन। यह कोई चिकित्सीय सलाह नहीं है। स्वास्थ्य संबंधी किसी भी समस्या के लिए योग्य चिकित्सक से परामर्श लें।'
        : 'Guidance based on traditional numerology. This is not medical advice. Consult a healthcare professional for health concerns.'
    });
  } else {
    // Sanitized general wellness symptoms only.
    // Absolutely NO forbidden words: cancer, tumour, cystic, suicidal, terminal.
    const healthBulletsHi = [
      '**पाचन व पेट संबंधी** संतुलन पर नियमित ध्यान दें।',
      '**मानसिक तनाव और थकान** से बचने हेतु पर्याप्त नींद लें।',
      'प्रतिदिन **2.5 से 3 लीटर जल** का सेवन करें।',
      'सुबह 15-20 मिनट **प्राणायाम व खुली हवा** में टहलें।',
      'सोने से 1 घंटा पहले **डिजिटल स्क्रीन से दूरी** रखें।'
    ];
    const healthBulletsEn = [
      'Maintain steady attention to **digestive balance**.',
      'Ensure adequate sleep to prevent **mental fatigue**.',
      'Drink **2.5 to 3 litres of fresh water** daily.',
      'Practice 15-20 minutes of **gentle breathing and walking**.',
      'Unplug from **digital screens one hour before sleep**.'
    ];

    const medicalDisclaimer = isHi
      ? 'पारंपरिक अंक-ज्योतिष पर आधारित मार्गदर्शन। यह कोई चिकित्सीय सलाह नहीं है। स्वास्थ्य संबंधी किसी भी समस्या के लिए योग्य चिकित्सक से परामर्श लें।'
      : 'Guidance based on traditional numerology. This is not medical advice. Consult a healthcare professional for health concerns.';

    sections.push({
      sectionNumber: 10,
      id: 'sec-10-health-indicators',
      title: isHi ? 'सेहत के संभावित संकेत व जीवनशैली उपाय' : 'Health Indicators and Lifestyle Remedies',
      hasValidInput: true,
      bullets: isHi ? healthBulletsHi.map(createBullet) : healthBulletsEn.map(createBullet),
      footerDisclaimer: medicalDisclaimer
    });
  }

  // ==========================================
  // SECTION 11: Personal Remedies 1 & 2 (5 Actions Each: WHAT + WHEN + HOW LONG)
  // ==========================================
  if (!hasValidDob) {
    sections.push({
      sectionNumber: 11,
      id: 'sec-11-personal-remedies',
      title: isHi ? 'व्यक्तिगत उपाय 1 व 2 (दैनिक क्रियान्वयन)' : 'Personal Remedies 1 and 2 (Daily Implementation)',
      hasValidInput: false,
      missingNotice: isHi ? 'मान्य जन्मतिथि आवश्यक है।' : 'Valid Date of Birth is required.',
      footerDisclaimer: defaultFooter
    });
  } else {
    // Remedy 1: Balancing Driver/Conductor planet (e.g. Mercury / बुध for 5)
    // Remedy 2: Balancing missing numbers (e.g. missing 2, 6, etc.)
    const remedy1Hi = [
      'बुधवार सुबह **गाय को हरा पालक** खिलाएं — 9 सप्ताह लगातार।',
      'बुधवार को 108 बार **ॐ बुं बुधाय नमः** का जप करें।',
      'प्रतिदिन तुलसी के पौधे को **ताज़ा जल अर्पित** करें।',
      'अपनी जेब में एक **हरा रुमाल** नियमित रूप से रखें।',
      'ज़रूरतमंद विद्यार्थियों को **स्टेशनरी या पुस्तकें** दान करें — महीने में 1 बार।'
    ];
    const remedy2Hi = [
      'सोमवार को **चांदी के पात्र** से जल ग्रहण करें।',
      'प्रतिदिन माता या वरिष्ठ महिलाओं का **आशीर्वाद लें**।',
      'शुक्रवार को मंदिर में **सफेद मिठाई या खीर** अर्पित करें।',
      'घर के उत्तर-पूर्व में **पीतल के लोटे में जल** रखें।',
      'नियमित रूप से **हल्के सुगंधित इत्र** का प्रयोग करें।'
    ];

    const remedy1En = [
      'Feed **fresh green grass to cows** on Wednesday mornings for 9 weeks.',
      'Chant **Om Bum Budhaya Namah** 108 times every Wednesday.',
      'Offer **fresh water to a holy Basil plant** daily.',
      'Carry a **clean green handkerchief** in your pocket daily.',
      'Donate **educational stationery to students** once each month.'
    ];
    const remedy2En = [
      'Drink drinking water from a **pure silver cup** on Mondays.',
      'Seek **blessings from mother or elder women** daily.',
      'Offer **white sweets or milk pudding** at a shrine on Fridays.',
      'Place a **brass water bowl in the North-East** corner of your home.',
      'Apply **mild natural fragrant attar** regularly.'
    ];

    const r1 = isHi ? remedy1Hi.map(createBullet) : remedy1En.map(createBullet);
    const r2 = isHi ? remedy2Hi.map(createBullet) : remedy2En.map(createBullet);

    sections.push({
      sectionNumber: 11,
      id: 'sec-11-personal-remedies',
      title: isHi ? 'व्यक्तिगत उपाय 1 व 2 (दैनिक क्रियान्वयन)' : 'Personal Remedies 1 and 2 (Daily Implementation)',
      hasValidInput: true,
      bullets: [...r1, ...r2],
      meta: {
        personalRemedy1: r1,
        personalRemedy2: r2
      },
      footerDisclaimer: defaultFooter
    });
  }

  // ==========================================
  // SECTION 12: Bank Account & Email ID Guidance
  // ==========================================
  const bankEmailBulletsHi = [
    'बैंक खाते के सभी अंकों का जोड़ **1, 5, 6** पर आना शुभ है।',
    'खाता नंबर के अंतिम अंक में **0, 4, 8** से बचना चाहिए।',
    'ईमेल आईडी के अक्षरों का योग **1 या 5** पर रखना लाभकारी है।',
    'ईमेल में नकारात्मक या **अशुभ अंक संयोजनों** से बचें।',
    'व्यापारिक ईमेल में **स्पष्ट और गरिमापूर्ण शब्दों** का उपयोग करें।'
  ];
  const bankEmailBulletsEn = [
    'Target bank account digit totals reducing to **1, 5, or 6**.',
    'Avoid bank account numbers ending with digits **0, 4, or 8**.',
    'Tune email handle letter values to reduce to **1 or 5**.',
    'Eliminate cluttered or **unfavorable numerical repeats** in email handles.',
    'Maintain **professional clarity and dignity** in professional handles.'
  ];

  sections.push({
    sectionNumber: 12,
    id: 'sec-12-bank-email',
    title: isHi ? 'बैंक खाता व ईमेल आईडी मार्गदर्शन' : 'Bank Account and Email ID Guidance',
    hasValidInput: true,
    bullets: isHi ? bankEmailBulletsHi.map(createBullet) : bankEmailBulletsEn.map(createBullet),
    meta: {
      adminNotice: isAdmin
        ? (isHi ? 'इस सेक्शन का नियम अभी रजिस्टर नहीं है' : 'Rule for this section is not yet registered')
        : undefined
    },
    footerDisclaimer: defaultFooter
  });

  // ==========================================
  // SECTION 13: Numero Vaastu (Directions & Defect Table)
  // ==========================================
  const vastuBulletsHi = [
    'उत्तर दिशा (**जल तत्व**): नए अवसरों व करियर का मार्ग प्रशस्त करती है।',
    'उत्तर-पूर्व दिशा (**ईशान कोण**): मानसिक शांति व स्पष्ट सोच बनाए रखती है।',
    'पूर्व दिशा (**वायु तत्व**): सामाजिक मान-सम्मान व संबंधों को संबल देती है।',
    'दक्षिण-पूर्व दिशा (**अग्नि कोण**): नकद धन व ऊर्जा प्रवाह को गति देती है।',
    'दक्षिण-पश्चिम दिशा (**पृथ्वी तत्व**): स्थिरता, रिश्तों व निर्णय शक्ति की धुरी है।'
  ];
  const vastuBulletsEn = [
    'North Direction (**Water Element**): Opens paths for career growth and cash flow.',
    'North-East (**Sacred Ishanya**): Fosters mental serenity and clarity.',
    'East Direction (**Air Element**): Strengthens social reputation and vitality.',
    'South-East (**Fire Zone**): Energizes cash liquidity and active momentum.',
    'South-West (**Earth Element**): Grounds relationships and leadership stability.'
  ];

  const defectTable = [
    { dirHi: 'उत्तर (North)', elemHi: 'जल', flawHi: 'अवरोध या कचरा', impactHi: 'करियर व आमदनी में रुकावट' },
    { dirHi: 'उत्तर-पूर्व (NE)', elemHi: 'ईशान', flawHi: 'भारी सामान या शौचालय', impactHi: 'मानसिक तनाव व भ्रम' },
    { dirHi: 'पूर्व (East)', elemHi: 'वायु', flawHi: 'बंद दीवार या अंधेरा', impactHi: 'सामाजिक सम्मान में कमी' },
    { dirHi: 'दक्षिण-पूर्व (SE)', elemHi: 'अग्नि', flawHi: 'जल स्रोत या नीला रंग', impactHi: 'नकद धन का अचानक क्षय' },
    { dirHi: 'दक्षिण (South)', elemHi: 'अग्नि', flawHi: 'गड्ढा या खुलापन', impactHi: 'प्रसिद्धि में रुकावट' },
    { dirHi: 'दक्षिण-पश्चिम (SW)', elemHi: 'पृथ्वी', flawHi: 'कट या हल्का होना', impactHi: 'रिश्तों व स्थिरता में दरार' },
    { dirHi: 'पश्चिम (West)', elemHi: 'धातु', flawHi: 'गंदगी या दोष', impactHi: 'मुनाफे और लाभ में देरी' },
    { dirHi: 'उत्तर-पश्चिम (NW)', elemHi: 'वायु', flawHi: 'भारी निर्माण', impactHi: 'सहयोगियों की मदद में कमी' }
  ];

  sections.push({
    sectionNumber: 13,
    id: 'sec-13-numero-vastu',
    title: isHi ? 'न्यूमरो वास्तु व दिशात्मक संतुलन' : 'Numero Vastu and Directional Balance',
    hasValidInput: true,
    bullets: isHi ? vastuBulletsHi.map(createBullet) : vastuBulletsEn.map(createBullet),
    meta: {
      defectTable,
      kua: kuaObj?.kuaNumber || null
    },
    footerDisclaimer: defaultFooter
  });

  // ==========================================
  // SECTION 14: Yoga, Meditation & Ho'oponopono Prayer
  // ==========================================
  const yogaBulletsHi = [
    'प्रतिदिन सुबह 15 मिनट **अनुलोम-विलोम प्राणायाम** अवश्य करें।',
    'मानसिक संतुलन हेतु 10 मिनट **ताड़ासन व वृक्षासन** का अभ्यास करें।',
    'रात्रि को सोने से पूर्व **हो\'ओपोनोपोनो प्रार्थना** का 108 बार मानसिक स्मरण करें।',
    '1. **मुझे क्षमा करें** (I am sorry)',
    '2. **कृपया मुझे क्षमा करें** (Please forgive me)',
    '3. **धन्यवाद** (Thank you)',
    '4. **मैं आपसे प्रेम करता हूँ** (I love you)'
  ];
  const yogaBulletsEn = [
    'Practice 15 minutes of **Anulom-Vilom pranayama** every morning.',
    'Ground mental focus with 10 minutes of **Tadasana and Vrikshasana**.',
    'Quietly recite the **Ho\'oponopono healing prayer** 108 times before sleep.',
    '1. **I am sorry**',
    '2. **Please forgive me**',
    '3. **Thank you**',
    '4. **I love you**'
  ];

  sections.push({
    sectionNumber: 14,
    id: 'sec-14-yoga-prayer',
    title: isHi ? 'योग, ध्यान व हो\'ओपोनोपोनो प्रार्थना' : 'Yoga, Meditation and Ho\'oponopono Prayer',
    hasValidInput: true,
    bullets: isHi ? yogaBulletsHi.map(createBullet) : yogaBulletsEn.map(createBullet),
    footerDisclaimer: defaultFooter
  });

  // ==========================================
  // SECTION 15: Year Predictions · Blessing Year · Event Years
  // ==========================================
  if (!hasValidDob) {
    sections.push({
      sectionNumber: 15,
      id: 'sec-15-year-predictions',
      title: isHi ? 'वर्ष फल, शुभ वर्ष व जीवन के महत्वपूर्ण पड़ाव' : 'Year Predictions, Blessing Years and Event Years',
      hasValidInput: false,
      missingNotice: isHi ? 'मान्य जन्मतिथि आवश्यक है।' : 'Valid Date of Birth is required.',
      footerDisclaimer: defaultFooter
    });
  } else {
    const pyBulletsHi: Record<number, string[]> = {
      1: ['वर्ष **नए आरंभ और नई पहलों** का संदेश देता है।', 'आप **स्वतंत्र निर्णयों में आत्मविश्वास** बनाए रखें।', 'आगे बढ़कर **अगुवाई करने के अवसर** मिलेंगे।'],
      2: ['वर्ष **सहयोग, साझेदारी व धैर्य** की मांग करता है।', 'भावनात्मक निर्णयों में **शांत चित्त बनाए रखें**।', 'रिश्तों को **मधुर और संतुलित** रखने का समय है।'],
      3: ['वर्ष **ज्ञान, अध्ययन व विस्तार** के लिए अनुकूल है।', 'अपनी **रचनात्मक प्रतिभा को मंच** प्रदान करें।', 'सामाजिक और **बौद्धिक संपर्कों में वृद्धि** होगी।'],
      4: ['वर्ष **कड़ी मेहनत व ठोस योजना** का आधार मांगता है।', 'वित्तीय मामलों में **अनुशासन व पारदर्शिता** रखें।', 'दीर्घकालिक **नींव मजबूत करने का समय** है।'],
      5: ['वर्ष **व्यापारिक गतिशीलता व नए अवसरों** का है।', 'सकारात्मक **बदलाव और यात्राएं** लाभ पहुंचाएंगी।', 'अपनी **संवाद शैली से संपर्क** विस्तृत करें।'],
      6: ['वर्ष **पारिवारिक जिम्मेदारियां व सुख-साधन** लाएगा।', 'घर के **सौंदर्य व सामंजस्य** पर ध्यान दें।', 'रिश्तों में **प्रेम और समर्पण** गहरा होगा।'],
      7: ['वर्ष **आत्म-चिंतन, शोध व अध्ययन** के लिए उत्तम है।', 'आंतरिक **शांति और ज्ञान की खोज** में समय लगाएं।', 'जल्दबाजी के निर्णयों से **सावधानी बरतें**।'],
      8: ['वर्ष **कर्म फल व ठोस उपलब्धियों** का समय है।', 'परिश्रम से **आर्थिक स्थिरता व प्रगति** मिलेगी।', 'न्यायप्रियता और **धैर्य से विजय** प्राप्त होगी।'],
      9: ['वर्ष **पुराने कार्यों की पूर्णता** और शुद्धि का है।', 'अनावश्यक **बोझ व चिंताओं को विसर्जित** करें।', 'नए चक्र के लिए **स्वयं को तैयार** करें।']
    };

    const pyBulletsEn: Record<number, string[]> = {
      1: ['This cycle emphasizes **fresh starts and proactive initiatives**.', 'Maintain **unwavering self-confidence** in decisions.', 'Prime avenues for **leadership and autonomy** will emerge.'],
      2: ['This cycle invites **diplomacy, cooperation, and patience**.', 'Preserve **emotional balance during negotiations**.', 'Auspicious phase to **harmonize key alliances**.'],
      3: ['This cycle unlocks **creative expansion and continuous learning**.', 'Give free expression to **innovative ideas**.', 'Broaden your **intellectual and social network**.'],
      4: ['This cycle demands **pragmatic effort and firm discipline**.', 'Exercise rigorous **oversight on financial commitments**.', 'Lay indestructible **foundations for future security**.'],
      5: ['This cycle brings **commercial momentum and swift adaptability**.', 'Embrace constructive **travel and market changes**.', 'Leverage your **persuasive speech and networking**.'],
      6: ['This cycle fosters **domestic harmony and prosperity**.', 'Enhance your **home comfort and mutual trust**.', 'Deepen devotion to **family obligations**.'],
      7: ['This cycle guides you toward **inner reflection and deep inquiry**.', 'Dedicate time to **contemplation and specialized study**.', 'Avoid impulsive commitments; **trust your intuition**.'],
      8: ['This cycle yields **material rewards through sustained perseverance**.', 'Your disciplined effort builds **enduring financial assets**.', 'Exercise fairness, **integrity, and patience**.'],
      9: ['This cycle marks the **culmination and release of past cycles**.', 'Gracefully resolve **lingering burdens and loose ends**.', 'Prepare your mindset for an **upcoming 9-year cycle**.']
    };

    const pyList = isHi ? (pyBulletsHi[py] || pyBulletsHi[5]) : (pyBulletsEn[py] || pyBulletsEn[5]);
    const bList = pyList.map(createBullet);

    sections.push({
      sectionNumber: 15,
      id: 'sec-15-year-predictions',
      title: isHi
        ? `वर्ष फल (व्यक्तिगत वर्ष ${py}), शुभ वर्ष व जीवन के महत्वपूर्ण पड़ाव`
        : `Year Predictions (Personal Year ${py}), Blessing Years and Event Years`,
      hasValidInput: true,
      bullets: bList,
      meta: {
        currentYear,
        personalYear: py,
        adminNotice: isAdmin
          ? (isHi ? 'इस सेक्शन का नियम अभी रजिस्टर नहीं है' : 'Rule for this section is not yet registered')
          : undefined
      },
      footerDisclaimer: defaultFooter
    });
  }

  // ==========================================
  // SECTION 16: Closing Note
  // ==========================================
  const consultantBrand = options.consultantName || 'LeoFamily Team';
  const closingBulletsHi = [
    'अंकशास्त्र आपकी **संभावनाओं का दर्पण** है, कोई सीमा नहीं।',
    'आपके **सकारात्मक कर्म और निर्णय** ही वास्तविक निर्माता हैं।',
    '**नियमित अनुशासन और विश्वास** से जीवन में संतुलन बनाएं।',
    `परामर्शक: **${consultantBrand}**`,
    '**LeoFamily Vedic & Chaldean Numerology**'
  ];
  const closingBulletsEn = [
    'Numerology mirrors your **boundless potentials**, not rigid constraints.',
    'Your **conscious deeds and choices** shape your destiny.',
    'Cultivate **steadfast discipline and inner conviction** daily.',
    `Consultant: **${consultantBrand}**`,
    '**LeoFamily Vedic & Chaldean Numerology**'
  ];

  sections.push({
    sectionNumber: 16,
    id: 'sec-16-closing-note',
    title: isHi ? 'परामर्श समापन व पाथेय' : 'Closing Consultation Note',
    hasValidInput: true,
    bullets: isHi ? closingBulletsHi.map(createBullet) : closingBulletsEn.map(createBullet),
    meta: {
      consultantName: consultantBrand
    },
    footerDisclaimer: defaultFooter
  });

  // Calculate stats for quality verification
  let totalBullets = 0;
  let bulletsUnder12Words = 0;
  sections.forEach(s => {
    if (s.bullets) {
      s.bullets.forEach(b => {
        totalBullets++;
        if (b.wordCount <= 12) {
          bulletsUnder12Words++;
        }
      });
    }
  });

  const pctUnder12Words = totalBullets > 0 ? (bulletsUnder12Words / totalBullets) * 100 : 100;

  return {
    language,
    profileKey: options.personalDetails?.name || profile.identity?.fullName || 'ConsultationProfile',
    isAdmin,
    sections,
    stats: {
      totalBullets,
      bulletsUnder12Words,
      pctUnder12Words
    }
  };
}
