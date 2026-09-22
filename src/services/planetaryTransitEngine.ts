/**
 * Planetary Transit Engine (ग्रह गोचर वेधशाला)
 * Real-time Vedic calculation of Saturn (शनि) and Rahu (राहु) transits
 * and their specific aspects (Drishti) on Driver (मूलांक) and Conductor (भाग्यांक) numbers.
 */

export interface PlanetaryPosition {
  planet: 'Saturn' | 'Rahu';
  vedicName: string;
  sanskritName: string;
  governingNumber: number;
  currentSign: string;
  currentSignHi: string;
  degree: string;
  nakshatra: string;
  nakshatraPada: number;
  nakshatraLord: string;
  motion: 'Direct' | 'Retrograde' | 'Stationary';
  motionHi: string;
  element: string;
  vedicTransitHouses: number[]; // e.g. Saturn aspects 3rd, 7th, 10th; Rahu aspects 5th, 7th, 9th
  transitPhaseSummary: string;
  transitPhaseSummaryHi: string;
}

export type AspectPolarity = 'FAVORABLE' | 'CHALLENGING' | 'TRANSFORMATIVE' | 'NEUTRAL';

export interface NumberAspectDetail {
  targetType: 'DRIVER' | 'CONDUCTOR';
  targetNumber: number;
  targetPlanet: string;
  saturnAspect: {
    relationship: 'FRIEND' | 'ENEMY' | 'NEUTRAL' | 'SELF';
    polarity: AspectPolarity;
    title: string;
    titleHi: string;
    drishtiType: string;
    drishtiTypeHi: string;
    impactDescription: string;
    impactDescriptionHi: string;
    opportunity: string;
    caution: string;
    remedy: string;
  };
  rahuAspect: {
    relationship: 'FRIEND' | 'ENEMY' | 'NEUTRAL' | 'SELF';
    polarity: AspectPolarity;
    title: string;
    titleHi: string;
    drishtiType: string;
    drishtiTypeHi: string;
    impactDescription: string;
    impactDescriptionHi: string;
    opportunity: string;
    caution: string;
    remedy: string;
  };
}

export interface TransitAnalysisResult {
  saturnPosition: PlanetaryPosition;
  rahuPosition: PlanetaryPosition;
  driverAspect: NumberAspectDetail;
  conductorAspect: NumberAspectDetail;
  overallTransitScore: number; // 0 to 100
  overallVerdict: string;
  overallVerdictHi: string;
  dominantThemes: string[];
  dominantThemesHi: string[];
  favorableActivities: string[];
  activitiesToAvoid: string[];
  shaniRemedy: string;
  rahuRemedy: string;
}

// Current Astronomical / Vedic Ephemeris Data for 2026
export const CURRENT_SATURN_TRANSIT: PlanetaryPosition = {
  planet: 'Saturn',
  vedicName: 'शनि देव (Shani)',
  sanskritName: 'शनैश्चर (Shanaishchara)',
  governingNumber: 8,
  currentSign: 'Pisces (Meena Rashi)',
  currentSignHi: 'मीन राशि (जल तत्व)',
  degree: '18° 42\'',
  nakshatra: 'Uttara Bhadrapada',
  nakshatraPada: 2,
  nakshatraLord: 'Saturn (शनि)',
  motion: 'Direct',
  motionHi: 'मार्गी (Direct)',
  element: 'Water / Ether',
  vedicTransitHouses: [3, 7, 10],
  transitPhaseSummary: 'Saturn in Pisces dissolves rigid structures and demands deep ethical discipline, spiritual maturity, and honest karma.',
  transitPhaseSummaryHi: 'मीन राशि में शनि देव का गोचर अहंकार को समाप्त कर आध्यात्मिक परिपक्वता, धैर्य और सत्य कर्म की परीक्षा लेता है।'
};

export const CURRENT_RAHU_TRANSIT: PlanetaryPosition = {
  planet: 'Rahu',
  vedicName: 'राहु ग्रह (North Node)',
  sanskritName: 'स्वरभानु (Svarbhanu)',
  governingNumber: 4,
  currentSign: 'Aquarius (Kumbha Rashi)',
  currentSignHi: 'कुंभ राशि (वायु तत्व)',
  degree: '08° 15\'',
  nakshatra: 'Shatabhisha',
  nakshatraPada: 3,
  nakshatraLord: 'Rahu (राहु)',
  motion: 'Retrograde',
  motionHi: 'वक्री (Always Retrograde)',
  element: 'Air / Electricity',
  vedicTransitHouses: [5, 7, 9],
  transitPhaseSummary: 'Rahu in Aquarius stimulates revolutionary technology, digital frontiers, social networks, and unconventional material windfalls.',
  transitPhaseSummaryHi: 'कुंभ राशि में राहु का गोचर डिजिटल क्रांति, नवीन तकनीक, अपरंपरागत विस्तार और अप्रत्याशित वित्तीय अवसरों को गति देता है।'
};

const PLANET_NAMES_BY_NUMBER: Record<number, string> = {
  1: 'Sun (सूर्य)',
  2: 'Moon (चन्द्र)',
  3: 'Jupiter (बृहस्पति)',
  4: 'Rahu (राहु)',
  5: 'Mercury (बुध)',
  6: 'Venus (शुक्र)',
  7: 'Ketu (केतु)',
  8: 'Saturn (शनि)',
  9: 'Mars (मंगल)'
};

/**
 * Calculates how Saturn (#8) aspects a specific number (1-9)
 */
function getSaturnAspect(num: number, targetType: 'DRIVER' | 'CONDUCTOR'): NumberAspectDetail['saturnAspect'] {
  switch (num) {
    case 1:
      return {
        relationship: 'ENEMY',
        polarity: 'CHALLENGING',
        title: 'Surya-Shani Karmic Friction (सूर्य-शनि संबंध)',
        titleHi: 'सूर्य-शनि संघर्ष एवं अहंकार शुद्धि दृष्टि',
        drishtiType: '10th House Karma Drishti (दशम कर्म दृष्टि)',
        drishtiTypeHi: 'दशम कर्म दृष्टि (कठोर परीक्षा)',
        impactDescription: 'Saturn transiting against Sun-ruled #1 tests executive authority, government interactions, and fatherly bonds. Arrogant shortcuts backfire, while humble discipline yields immense respect.',
        impactDescriptionHi: 'सूर्य के अंक 1 पर शनि का प्रभाव अधिकार, वरिष्ठों से संबंध और अहंकार की परीक्षा लेता है। जल्दबाजी और क्रोध से बचें; शांत धैर्य से कार्य करने पर चिरस्थायी सफलता मिलेगी।',
        opportunity: 'Build enduring executive credentials through sheer merit rather than charisma.',
        caution: 'Avoid ego clashes with government officials, bosses, or father figures.',
        remedy: 'Offer water with a pinch of red kumkum to the rising Sun daily; feed black sesame to ants on Saturday.'
      };
    case 2:
      return {
        relationship: 'ENEMY',
        polarity: 'TRANSFORMATIVE',
        title: 'Vish Yog Resonance (विष योग प्रभाव)',
        titleHi: 'विष योग व मानसिक संवेदनशीलता दृष्टि',
        drishtiType: '7th House Direct Opposition (समसप्तक दृष्टि)',
        drishtiTypeHi: 'समसप्तक दृष्टि (सीधा मानसिक प्रभाव)',
        impactDescription: 'Saturn\'s cold earth energy directly meets the Moon\'s warm fluid waters. Can cause overthinking, temporary melancholy, or hesitation. When channelled inward, it awakens profound mystical intuition.',
        impactDescriptionHi: 'चंद्रमा के अंक 2 पर शनि की दृष्टि भावनात्मक उतार-चढ़ाव व अनिद्रा दे सकती है। इस ऊर्जा को आध्यात्मिक साधना, ध्यान और रचनात्मक लेखन में लगाएं।',
        opportunity: 'Deep introspection, spiritual meditation, and emotional resilience.',
        caution: 'Do not make major emotional or relationship decisions during dark moon nights.',
        remedy: 'Perform Jalabhishek on Shiva Lingam on Mondays; wear a pure silver ring or keep a silver coin.'
      };
    case 3:
      return {
        relationship: 'NEUTRAL',
        polarity: 'FAVORABLE',
        title: 'Dharma-Karma Adhyatmik Yog (गुरु-शनि समन्वय)',
        titleHi: 'धर्म-कर्म समन्वय एवं ज्ञान स्थिरीकरण',
        drishtiType: '3rd House Upachaya Drishti (तृतीय पराक्रम दृष्टि)',
        drishtiTypeHi: 'तृतीय पराक्रम दृष्टि (ज्ञान व प्रयास)',
        impactDescription: 'Saturn grounds Jupiter\'s philosophical optimism into pragmatic reality. Ideal for long-term educational projects, legal settlements, book publishing, and structural mentorship.',
        impactDescriptionHi: 'गुरु के अंक 3 पर शनि की दृष्टि विचारों को व्यावहारिक धरातल पर उतारती है। कानूनी मामलों, उच्च शिक्षा, कोचिंग व परामर्श कार्यों में ठोस सफलता के योग हैं।',
        opportunity: 'Turn abstract knowledge and counseling skills into structured commercial courses or advisory roles.',
        caution: 'Beware of cynicism or judging others too harshly when standards are unmet.',
        remedy: 'Apply yellow sandalwood/haldi tilak on the forehead; donate yellow chana dal on Thursdays.'
      };
    case 4:
      return {
        relationship: 'NEUTRAL',
        polarity: 'TRANSFORMATIVE',
        title: 'Shani-Rahu Karmic Crucible (शनि-राहु संबंध)',
        titleHi: 'शनि-राहु कर्म चक्र एवं अप्रत्याशित परिणाम',
        drishtiType: '10th House Heavy Karma Drishti (दशम कर्म दृष्टि)',
        drishtiTypeHi: 'दशम कर्म दृष्टि (तकनीकी व कूटनीतिक उभार)',
        impactDescription: 'Both heavy karmic planets interact. Delays occur only to realign your technical architecture. Phenomenal potential in software, foreign trade, data infrastructure, and forensic analysis.',
        impactDescriptionHi: 'राहु के अंक 4 पर शनि की दृष्टि अचानक बदलाव और तकनीकी प्रगति लाती है। शॉर्टकट से बचें और पारदर्शी कार्यप्रणाली अपनाएं।',
        opportunity: 'Revolutionize technological pipelines, cybersecurity, and systemic efficiency.',
        caution: 'Avoid speculative gambling or signing ambiguous documents in haste.',
        remedy: 'Feed stray dogs with roti mixed with mustard oil on Saturday evenings; avoid dark blue clothes on Tuesdays.'
      };
    case 5:
      return {
        relationship: 'FRIEND',
        polarity: 'FAVORABLE',
        title: 'Budh-Shani Vyapar Rajyoga (बुध-शनि मित्र दृष्टि)',
        titleHi: 'बुध-शनि व्यापारिक मित्र दृष्टि (सर्वश्रेष्ठ राजयोग)',
        drishtiType: '7th House Friendly Aspect (मित्र समसप्तक दृष्टि)',
        drishtiTypeHi: 'मित्र समसप्तक दृष्टि (व्यापार व वित्तीय स्थिरता)',
        impactDescription: 'Saturn shares supreme friendship with Mercury. Saturn\'s slow patience stabilizes Mercury\'s restless intellect, resulting in profitable corporate negotiations, clean audits, and profitable contracts.',
        impactDescriptionHi: 'बुध के अंक 5 पर शनि की परम मित्र दृष्टि व्यापार, बैंकिंग, डिजिटल मार्केटिंग और कागजी कार्यों में भारी लाभ व स्थिरता सुनिश्चित करती है।',
        opportunity: 'Sign long-term multi-year contracts, expand commercial distribution, and automate operations.',
        caution: 'Ensure contracts have strict penalty clauses for non-compliance.',
        remedy: 'Feed soaked green moong to birds on Wednesday morning; use emerald or peridot stone.'
      };
    case 6:
      return {
        relationship: 'FRIEND',
        polarity: 'FAVORABLE',
        title: 'Shukra-Shani Exaltation Resonance (शुक्र-शनि सौभाग्य दृष्टि)',
        titleHi: 'शुक्र-शनि परम मित्र दृष्टि (स्थिर वैभव व संपदा)',
        drishtiType: '3rd House Upachaya Trine (उपचय वृद्धि दृष्टि)',
        drishtiTypeHi: 'उपचय वृद्धि दृष्टि (कला व संपत्ति अर्जन)',
        impactDescription: 'Saturn exalts in Venus\'s sign (Libra). This transit brings grounded aesthetic beauty, luxury real estate acquisition, architectural appreciation, and refined maturity in partnerships.',
        impactDescriptionHi: 'शुक्र के अंक 6 पर शनि की दृष्टि वाहन, भूमि, आभूषण और कलात्मक उपक्रमों में स्थायी संपत्ति निर्माण के प्रबल योग बनाती है।',
        opportunity: 'Acquire tangible assets, renovate legacy properties, and cement high-value artistic alliances.',
        caution: 'Do not overextend credit cards on transient status symbols.',
        remedy: 'Donate white sweets, curd, or rice to needy women on Friday; wear pure natural attar.'
      };
    case 7:
      return {
        relationship: 'FRIEND',
        polarity: 'FAVORABLE',
        title: 'Ketu-Shani Vairagya & Research Drishti (केतु-शनि अंतर्दृष्टि)',
        titleHi: 'केतु-शनि गूढ़ अनुसंधान एवं वैराग्य दृष्टि',
        drishtiType: '7th House Mystical Aspect (रहस्यमयी दृष्टि)',
        drishtiTypeHi: 'रहस्यमयी दृष्टि (शोध व आंतरिक प्रकाश)',
        impactDescription: 'Ketu represents spiritual liberation and Saturn enforces detachment. Fosters unprecedented breakthroughs in deep research, esoteric studies, medical discovery, and mental detachment from petty drama.',
        impactDescriptionHi: 'केतु के अंक 7 पर शनि का प्रभाव शोध, तंत्र, चिकित्सा और गुप्त विद्याओं में असाधारण महारत देता है। सांसारिक दिखावे से विरक्ति होगी।',
        opportunity: 'Write deep analytical theses, master meditative dhyana, and solve complex unresolved mysteries.',
        caution: 'Do not isolate yourself completely from family responsibilities.',
        remedy: 'Donate dark blankets or umbrellas to elderly ascetics; practice silence (Maun Vrat) for 1 hour on Saturdays.'
      };
    case 8:
      return {
        relationship: 'SELF',
        polarity: 'CHALLENGING',
        title: 'Shani Sadesati & Return Transit (शनि समभाव व पूर्ण कर्म परीक्षा)',
        titleHi: 'शनि स्व-अंक दृष्टि (महाकर्म परीक्षा व राज्याधिकार)',
        drishtiType: 'Conjunction & Karmic Reckoning (समान ऊर्जा संलयन)',
        drishtiTypeHi: 'समान ऊर्जा संलयन (कड़ा इम्तिहान एवं सर्वोच्च शिखर)',
        impactDescription: 'Saturn transiting in resonance with your birth #8 puts you through the crucible of ultimate destiny. Laziness brings swift karmic penalties, but relentless honest labor crowns you with lasting authority.',
        impactDescriptionHi: 'शनि के अंक 8 पर शनि का सीधा गोचर जीवन का सबसे निर्णायक मोड़ है। यहाँ मेहनत का फल 100% मिलता है और आलस्य पर तुरंत दंड मिलता है।',
        opportunity: 'Assume massive leadership responsibilities, restructure businesses, and build generational wealth.',
        caution: 'Never disrespect laborers, maids, or service workers under this transit.',
        remedy: 'Light a mustard oil lamp under a Peepal tree on Saturday evening; chant "Om Sham Shanaishcharaya Namah" 108 times.'
      };
    case 9:
    default:
      return {
        relationship: 'ENEMY',
        polarity: 'CHALLENGING',
        title: 'Mangal-Shani Agni-Sheetal Conflict (मंगल-शनि द्वंद्व दृष्टि)',
        titleHi: 'मंगल-शनि अग्नि-शीत द्वंद्व दृष्टि (आक्रोश नियंत्रण)',
        drishtiType: '10th House Explosive Aspect (दशम उग्र दृष्टि)',
        drishtiTypeHi: 'दशम उग्र दृष्टि (धैर्य की अग्नि परीक्षा)',
        impactDescription: 'Fiery Mars meets icy Saturn. Impatience clashing with structural resistance creates dangerous internal friction or physical rashness. Channel this intense kinetic energy into physical training or engineering.',
        impactDescriptionHi: 'मंगल के अंक 9 पर शनि की दृष्टि अग्नि और बर्फ का टकराव है। वाहन सावधानी से चलाएं, जल्दबाजी और क्रोध पर पूर्ण नियंत्रण रखें।',
        opportunity: 'Tackle Herculean tasks requiring extreme physical stamina, surgical precision, or crisis management.',
        caution: 'Drive carefully and strictly avoid road rage or heated midnight debates.',
        remedy: 'Recite Hanuman Chalisa or Bajrang Baan daily; donate red lentils (masoor dal) to workers on Tuesdays.'
      };
  }
}

/**
 * Calculates how Rahu (#4) aspects a specific number (1-9)
 */
function getRahuAspect(num: number, targetType: 'DRIVER' | 'CONDUCTOR'): NumberAspectDetail['rahuAspect'] {
  switch (num) {
    case 1:
      return {
        relationship: 'ENEMY',
        polarity: 'CHALLENGING',
        title: 'Surya-Rahu Grahan Dynamic (सूर्य-राहु ग्रहण दृष्टि)',
        titleHi: 'सूर्य-राहु ग्रहण दृष्टि (महत्वाकांक्षा व भ्रम)',
        drishtiType: '7th House Direct Polar Drishti (समसप्तक दृष्टि)',
        drishtiTypeHi: 'समसप्तक दृष्टि (अचानक प्रसिद्धि या लांछन)',
        impactDescription: 'Rahu casts a magnetic yet illusionary aura over Sun-ruled #1. Cravings for instant global fame and viral recognition peak. Stay ethically grounded to prevent sudden reputational drops.',
        impactDescriptionHi: 'सूर्य के अंक 1 पर राहु की दृष्टि अचानक अत्यधिक महत्वाकांक्षा और शोहरत की भूख जगाती है। बिना सोचे समझे प्रचार करने से बचें।',
        opportunity: 'Harness mass digital media, viral branding, and international recognition.',
        caution: 'Do not associate with shady financial intermediaries or tax shortcuts.',
        remedy: 'Offer water to the rising Sun with copper vessel; chant the Gayatri Mantra 27 times every morning.'
      };
    case 2:
      return {
        relationship: 'ENEMY',
        polarity: 'CHALLENGING',
        title: 'Chandra-Rahu Psychological Surge (चन्द्र-राहु मानसिक भ्रम)',
        titleHi: 'चन्द्र-राहु ग्रहण दृष्टि (कल्पनाशीलता व मानसिक अशांति)',
        drishtiType: '5th House Trinal Aspect (पंचम बुद्धि दृष्टि)',
        drishtiTypeHi: 'पंचम बुद्धि दृष्टि (कल्पना, अनिद्रा व रहस्य)',
        impactDescription: 'Rahu clouds the Moon\'s pure waters with surreal desires and phantom fears. Can spark creative genius in cinema, fiction, or virtual reality, but requires grounding to prevent anxiety.',
        impactDescriptionHi: 'चंद्रमा के अंक 2 पर राहु की दृष्टि गहरी कल्पनाशीलता और सिनेमाई रचनात्मकता देती है, किंतु मन में अज्ञात भय भी ला सकती है।',
        opportunity: 'Produce extraordinary creative fiction, film scripts, and avant-garde designs.',
        caution: 'Avoid toxic digital scrolling late at night; stay hydrated with pure water.',
        remedy: 'Drink water from a solid silver tumbler; wear a small silver square piece in your wallet.'
      };
    case 3:
      return {
        relationship: 'ENEMY',
        polarity: 'TRANSFORMATIVE',
        title: 'Guru-Rahu Chandal Frequencies (गुरु-राहु विद्रोही दृष्टि)',
        titleHi: 'गुरु-राहु विद्रोही व सुधारक दृष्टि (परंपरा से हटकर)',
        drishtiType: '9th House Bhagya Transformation (नवम भाग्य दृष्टि)',
        drishtiTypeHi: 'नवम भाग्य दृष्टि (रूढ़िवादिता पर प्रहार)',
        impactDescription: 'Rahu rebels against rigid orthodoxy. Inspires revolutionary educational methods, digital coaching models, and cross-cultural philosophies. Demands vigilance against dubious spiritual teachers.',
        impactDescriptionHi: 'गुरु के अंक 3 पर राहु की दृष्टि पारंपरिक सीमाओं को तोड़कर ऑनलाइन शिक्षा, वैश्विक मंच और नए प्रयोगों का मार्ग खोलती है।',
        opportunity: 'Build international educational platforms and challenge outdated pedagogical Dogmas.',
        caution: 'Never compromise intellectual honesty or promote unverified claims.',
        remedy: 'Worship Lord Vishnu or Shiva with yellow flowers; respect genuine elder mentors.'
      };
    case 4:
      return {
        relationship: 'SELF',
        polarity: 'TRANSFORMATIVE',
        title: 'Double Rahu Super-Conductor (द्वि-राहु चुंबकीय चक्र)',
        titleHi: 'द्वि-राहु प्रवर्धन चक्र (विशाल डिजिटल उछाल)',
        drishtiType: 'Resonance & Material Amplification (समान तरंग प्रवर्धन)',
        drishtiTypeHi: 'समान तरंग प्रवर्धन (तीव्र विस्तार व सतर्कता)',
        impactDescription: 'Rahu transiting in resonance with birth #4 creates a vortex of ambition. You think years ahead of your peers in technology, algorithmic trading, and unconventional wealth creation.',
        impactDescriptionHi: 'राहु के अंक 4 पर राहु का गोचर अप्रत्याशित वित्तीय उछाल, विदेशी संपर्क और हाई-टेक परियोजनाओं में बड़ी छलांग लगाता है।',
        opportunity: 'Launch disruptive AI tools, foreign market ventures, and high-frequency digital campaigns.',
        caution: 'Keep feet firmly on the ground; avoid speculative crypto gambles and insomnia.',
        remedy: 'Immerse a dry coconut in flowing river water on Wednesday; keep electronic devices clean and organized.'
      };
    case 5:
      return {
        relationship: 'FRIEND',
        polarity: 'FAVORABLE',
        title: 'Budh-Rahu Digital Alchemy (बुध-राहु वित्तीय जादू)',
        titleHi: 'बुध-राहु मित्र दृष्टि (डिजिटल धन लाभ व कुशाग्र बुद्धि)',
        drishtiType: '5th House Trinal Brilliance (पंचम त्रिकोण दृष्टि)',
        drishtiTypeHi: 'पंचम त्रिकोण दृष्टि (मार्केटिंग व त्वरित लाभ)',
        impactDescription: 'One of the sharpest combinations in modern numerology. Rahu amplifies Mercury\'s analytical speed into algorithmic precision, viral marketing prowess, and lucrative brokerages.',
        impactDescriptionHi: 'बुध के अंक 5 पर राहु की पंचम दृष्टि अत्यंत शुभ है। यह ट्रेडिंग, ई-कॉमर्स, सॉफ्टवेयर और मीडिया में भारी लाभ प्रदान करती है।',
        opportunity: 'Execute hyper-targeted marketing campaigns and scale digital platforms rapidly.',
        caution: 'Verify financial calculations twice to prevent software glitch oversights.',
        remedy: 'Keep a money plant in the North direction; gift green clothing to young girls on Wednesday.'
      };
    case 6:
      return {
        relationship: 'FRIEND',
        polarity: 'FAVORABLE',
        title: 'Shukra-Rahu Glamour & Wealth Magnet (शुक्र-राहु सम्मोहन दृष्टि)',
        titleHi: 'शुक्र-राहु सम्मोहन दृष्टि (अप्रत्याशित धन व आकर्षण)',
        drishtiType: '9th House Luxuria Aspect (नवम ऐश्वर्य दृष्टि)',
        drishtiTypeHi: 'नवम ऐश्वर्य दृष्टि (लक्जरी व सामाजिक प्रतिष्ठा)',
        impactDescription: 'Rahu adores Venusian #6. Triggers irresistible personal magnetism, viral entertainment success, luxury vehicle upgrades, and unexpected high-value sponsorship deals.',
        impactDescriptionHi: 'शुक्र के अंक 6 पर राहु की नवम दृष्टि सिनेमा, फैशन, मॉडलिंग, लक्जरी ऑटोमोबाइल और मीडिया में अपार लोकप्रियता देती है।',
        opportunity: 'Attract elite sponsors, monetize creative personal brands, and command aesthetic leadership.',
        caution: 'Maintain transparent fidelity in intimate relationships; avoid scandalous entrapments.',
        remedy: 'Keep fresh white flowers in the bedroom; spray mild sandalwood fragrance before going to meetings.'
      };
    case 7:
      return {
        relationship: 'NEUTRAL',
        polarity: 'TRANSFORMATIVE',
        title: 'Rahu-Ketu Axis Harmonizer (राहु-केतु अक्ष समन्वय)',
        titleHi: 'राहु-केतु अक्ष समन्वय (भौतिक व आध्यात्मिक संतुलन)',
        drishtiType: 'Opposition Axis Drishti (समसप्तक धुरी दृष्टि)',
        drishtiTypeHi: 'समसप्तक धुरी दृष्टि (आध्यात्मिक व सांसारिक संतुलन)',
        impactDescription: 'Balancing the Head (Rahu #4) and the Tail (Ketu #7). Reconciles your future worldly ambitions with your deep past-life detachment. Extraordinary psychic dreams and problem-solving.',
        impactDescriptionHi: 'केतु के अंक 7 पर राहु का प्रभाव भौतिक इच्छाओं और आध्यात्मिक विरक्ति के बीच सटीक संतुलन साधने का स्वर्णिम अवसर है।',
        opportunity: 'Synthesize ancient occult wisdom with modern digital delivery mechanisms.',
        caution: 'Avoid feeling disillusioned with material achievements; every experience has purpose.',
        remedy: 'Feed stray dogs or birds daily; practice transcendental meditation daily at sunrise.'
      };
    case 8:
      return {
        relationship: 'NEUTRAL',
        polarity: 'FAVORABLE',
        title: 'Shani-Rahu Engineering Alliance (शनि-राहु तकनीकी गठजोड़)',
        titleHi: 'शनि-राहु तकनीकी गठजोड़ (दीर्घकालिक निर्माण)',
        drishtiType: '3rd House Upachaya Aspect (तृतीय पराक्रम दृष्टि)',
        drishtiTypeHi: 'तृतीय पराक्रम दृष्टि (भारी उद्योग व तकनीकी विजय)',
        impactDescription: 'Saturn\'s steady discipline directs Rahu\'s erratic brilliance. Unmatched synergy for heavy civil infrastructure, industrial mining, patent acquisitions, and automated workflows.',
        impactDescriptionHi: 'शनि के अंक 8 पर राहु का प्रभाव अदम्य साहस और दृढ़ता देता है। यह बड़ी कंपनियों, निर्माण कार्यों और कानूनी विजय के लिए उत्तम है।',
        opportunity: 'Architect robust multi-decade businesses with automated algorithmic systems.',
        caution: 'Refuse all illegal shortcuts; Saturn will audit everything Rahu attempts to bypass.',
        remedy: 'Support physically disabled persons with mobility aids or food; chant Shani Chalisa on Saturdays.'
      };
    case 9:
    default:
      return {
        relationship: 'ENEMY',
        polarity: 'CHALLENGING',
        title: 'Angarak Volatility Frequencies (अंगारक दृष्टि प्रभाव)',
        titleHi: 'अंगारक योग प्रभाव (उग्र ऊर्जा व सतर्कता)',
        drishtiType: '7th House High-Octane Aspect (समसप्तक उग्र दृष्टि)',
        drishtiTypeHi: 'समसप्तक उग्र दृष्टि (धैर्य व दुर्घटना बचाव)',
        impactDescription: 'Mars #9 combined with Rahu\'s unbridled expansion creates explosive energy. Phenomenal for military, emergency services, or athletic conquest, but hazardous for negotiations if anger flares.',
        impactDescriptionHi: 'मंगल के अंक 9 पर राहु की दृष्टि अत्यंत विस्फोटक ऊर्जा पैदा करती है। इसे खेल, कसरत या बड़े मिशन में लगाएं; व्यर्थ बहस से बचें।',
        opportunity: 'Smash through long-standing barriers through audacious, decisive physical action.',
        caution: 'Never engage in hostile confrontation; avoid operating heavy machinery when fatigued.',
        remedy: 'Read Hanuman Chalisa 3 times daily; keep a red handkerchief with you; donate blood if health permits.'
      };
  }
}

/**
 * Calculates complete planetary transit report for a given driver and conductor number
 */
export function calculatePlanetaryTransitImpact(
  driverNumber: number,
  conductorNumber: number
): TransitAnalysisResult {
  // Normalize numbers to 1-9
  const dNum = ((driverNumber - 1) % 9) + 1;
  const cNum = ((conductorNumber - 1) % 9) + 1;

  const driverAspect: NumberAspectDetail = {
    targetType: 'DRIVER',
    targetNumber: dNum,
    targetPlanet: PLANET_NAMES_BY_NUMBER[dNum] || 'Unknown',
    saturnAspect: getSaturnAspect(dNum, 'DRIVER'),
    rahuAspect: getRahuAspect(dNum, 'DRIVER')
  };

  const conductorAspect: NumberAspectDetail = {
    targetType: 'CONDUCTOR',
    targetNumber: cNum,
    targetPlanet: PLANET_NAMES_BY_NUMBER[cNum] || 'Unknown',
    saturnAspect: getSaturnAspect(cNum, 'CONDUCTOR'),
    rahuAspect: getRahuAspect(cNum, 'CONDUCTOR')
  };

  // Compute overall transit harmony score
  let scorePoints = 50; // baseline

  const scoreMap: Record<AspectPolarity, number> = {
    FAVORABLE: 15,
    TRANSFORMATIVE: 8,
    NEUTRAL: 4,
    CHALLENGING: -6
  };

  scorePoints += scoreMap[driverAspect.saturnAspect.polarity];
  scorePoints += scoreMap[driverAspect.rahuAspect.polarity];
  scorePoints += scoreMap[conductorAspect.saturnAspect.polarity];
  scorePoints += scoreMap[conductorAspect.rahuAspect.polarity];

  // Clamp score between 25 and 96
  const finalScore = Math.min(96, Math.max(25, scorePoints));

  let overallVerdict = 'Harmonious & Transformational Transit Window';
  let overallVerdictHi = 'अत्यंत अनुकूल एवं परिवर्तनकारी गोचर काल';

  if (finalScore < 50) {
    overallVerdict = 'Karmic Reckoning & Cautionary Alignment Window';
    overallVerdictHi = 'सतर्कता एवं कर्म शुद्धि का गोचर चक्र';
  } else if (finalScore < 70) {
    overallVerdict = 'Balanced Evolution & Disciplined Growth Phase';
    overallVerdictHi = 'संतुलित विकास एवं अनुशासित प्रगति काल';
  } else {
    overallVerdict = 'Supreme Rajyoga Transit & Accelerated Expansion';
    overallVerdictHi = 'सर्वोच्च राजयोग गोचर एवं अप्रत्याशित सफलता काल';
  }

  const dominantThemes = [
    `Saturn in ${CURRENT_SATURN_TRANSIT.currentSign.split(' ')[0]} demands structured foundation in life goals`,
    `Rahu in ${CURRENT_RAHU_TRANSIT.currentSign.split(' ')[0]} accelerates foreign and digital opportunities`,
    `Driver #${dNum} aspects stimulate ${driverAspect.saturnAspect.polarity.toLowerCase()} daily workflows`,
    `Conductor #${cNum} aspects govern ${conductorAspect.rahuAspect.polarity.toLowerCase()} long-term destiny trajectory`
  ];

  const dominantThemesHi = [
    `शनि देव का मीन राशि में गोचर जीवन में ठोस अनुशासन और सत्यनिष्ठा की मांग करता है`,
    `राहु का कुंभ राशि में गोचर नए तकनीकी, डिजिटल व विदेशी आयामों को सक्रिय करता है`,
    `मूलांक #${dNum} पर ग्रह दृष्टि दैनिक निर्णयों और कार्यशैली को तीव्रता से प्रभावित कर रही है`,
    `भाग्यांक #${cNum} पर गोचर प्रभाव दीर्घकालिक करियर व भाग्य के द्वार खोल रहा है`
  ];

  const favorableActivities = [
    'Automating operations and securing long-term legal contracts',
    'Launching digital media channels, software systems, and data analytics',
    'Engaging in disciplined meditation and philanthropic karma remediation',
    'Real estate renovation, long-term asset accumulation, and debt restructuring'
  ];

  const activitiesToAvoid = [
    'Impulsive anger, heated debates, or road rage during transit peaks',
    'Speculative gambling, untrusted cryptocurrency schemes, or get-rich-quick shortcuts',
    'Neglecting physical sleep cycles or skipping spiritual grounding routines',
    'Disrespecting elders, domestic workers, or subordinate employees'
  ];

  return {
    saturnPosition: CURRENT_SATURN_TRANSIT,
    rahuPosition: CURRENT_RAHU_TRANSIT,
    driverAspect,
    conductorAspect,
    overallTransitScore: finalScore,
    overallVerdict,
    overallVerdictHi,
    dominantThemes,
    dominantThemesHi,
    favorableActivities,
    activitiesToAvoid,
    shaniRemedy: 'शनिवार की शाम पीपल के वृक्ष के नीचे सरसों के तेल का दीपक जलाएं और ॐ शं शनैश्चराय नमः का जाप करें।',
    rahuRemedy: 'बुधवार या शनिवार को भैरव जी या शिव जी की आराधना करें और पक्षियों या मछलियों को दाना डालें।'
  };
}
