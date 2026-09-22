import { MethodologyRule, methodologyRegistry } from './methodologyRegistry';
import { SOURCES } from './sourceRegistry';

export interface PlanetDefinition {
  number: number;
  planetEn: string;
  planetHi: string;
  deity: string;
  element: string;
  day: string;
  color: string;
  gemstone: string;
  mantra: string;
  cosmicNature: string;
  friendlyNumbers: number[];
  neutralNumbers: number[];
  enemyNumbers: number[];
  careerResonances: string[];
}

export const PLANET_DEFINITIONS: Record<number, PlanetDefinition> = {
  1: {
    number: 1,
    planetEn: 'Sun',
    planetHi: 'Surya (सूर्य)',
    deity: 'Surya Deva',
    element: 'Fire',
    day: 'Sunday',
    color: 'Gold / Ruby Red / Deep Orange',
    gemstone: 'Ruby (Manik)',
    mantra: 'OM SURYAYA NAMAH',
    cosmicNature: 'प्रशासनिक, आत्मविश्वासी, नेतृत्वकर्ता, संप्रभु ऊर्जा एवं मार्गदर्शक।',
    friendlyNumbers: [1, 2, 3, 5, 9],
    neutralNumbers: [7],
    enemyNumbers: [4, 6, 8],
    careerResonances: ['Government Administration', 'Civil Services', 'Corporate Leadership', 'Politics', 'Pioneering Ventures']
  },
  2: {
    number: 2,
    planetEn: 'Moon',
    planetHi: 'Chandra (चन्द्र)',
    deity: 'Chandra Deva',
    element: 'Water',
    day: 'Monday',
    color: 'Pearl White / Cream / Silver',
    gemstone: 'Pearl (Moti) / Moonstone',
    mantra: 'OM CHANDRAYA NAMAH',
    cosmicNature: 'सहज अंतर्ज्ञानी, संवेदनशील, पोषणकारी, भावनात्मक और सौहार्दपूर्ण।',
    friendlyNumbers: [1, 3, 5],
    neutralNumbers: [2, 6, 7],
    enemyNumbers: [4, 8, 9],
    careerResonances: ['Psychology', 'Counseling', 'Public Relations', 'Fine Arts', 'Hospitality', 'Dairy/Liquids']
  },
  3: {
    number: 3,
    planetEn: 'Jupiter',
    planetHi: 'Guru / Brihaspati (बृहस्पति)',
    deity: 'Brihaspati Deva',
    element: 'Ether / Wood',
    day: 'Thursday',
    color: 'Yellow / Saffron / Goldenrod',
    gemstone: 'Yellow Sapphire (Pukhraj)',
    mantra: 'OM GUM GURAVE NAMAH',
    cosmicNature: 'विद्वान, दूरदर्शी, नैतिक, दार्शनिक, परामर्शदाता और आध्यात्मिक गुरु।',
    friendlyNumbers: [1, 2, 3, 5, 9],
    neutralNumbers: [7],
    enemyNumbers: [4, 6, 8],
    careerResonances: ['Higher Education', 'Judiciary / Law', 'Advisory / Consulting', 'Spiritual Mentorship', 'Finance & Banking']
  },
  4: {
    number: 4,
    planetEn: 'Rahu',
    planetHi: 'Rahu (राहू - North Lunar Node)',
    deity: 'Rahu Deva',
    element: 'Air / Electricity / Wood',
    day: 'Saturday',
    color: 'Smoky Grey / Steel Blue',
    gemstone: 'Hessonite (Gomed)',
    mantra: 'OM RAHAVE NAMAH',
    cosmicNature: 'अन्वेषी, लीक से हटकर सोचने वाला, तकनीकी निपुणता और अप्रत्याशित परिवर्तनों का कारक।',
    friendlyNumbers: [5, 6, 7, 8],
    neutralNumbers: [3],
    enemyNumbers: [1, 2, 4, 9],
    careerResonances: ['Information Technology', 'Aviation / Space', 'Unconventional Business', 'Electronics', 'Speculation & Media']
  },
  5: {
    number: 5,
    planetEn: 'Mercury',
    planetHi: 'Budha (बुध)',
    deity: 'Budha Deva',
    element: 'Earth',
    day: 'Wednesday',
    color: 'Emerald Green',
    gemstone: 'Emerald (Panna)',
    mantra: 'OM BUDHAYA NAMAH',
    cosmicNature: 'व्यापारिक, विश्लेषणात्मक, संतुलित, संवादकुशल, बहुमुखी और चतुर रणनीतिकार।',
    friendlyNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9], // Universal friend in classical Indian numerology
    neutralNumbers: [],
    enemyNumbers: [],
    careerResonances: ['Trading & Commerce', 'Communication & Media', 'Data Science & Analytics', 'Marketing', 'Diplomacy']
  },
  6: {
    number: 6,
    planetEn: 'Venus',
    planetHi: 'Shukra (शुक्र)',
    deity: 'Shukra Deva',
    element: 'Metal / Water',
    day: 'Friday',
    color: 'Diamond White / Soft Pastel Pink',
    gemstone: 'Diamond (Heera) / White Zircon',
    mantra: 'OM SHUKRAYA NAMAH',
    cosmicNature: 'सौंदर्यप्रेमी, कलात्मक, विलासिता व आकर्षण का केंद्र, भौतिक सुख और समृद्धि प्रदाता।',
    friendlyNumbers: [4, 5, 6, 7, 8],
    neutralNumbers: [9],
    enemyNumbers: [1, 2, 3],
    careerResonances: ['Luxury Goods', 'Fashion & Film', 'Interior Design', 'Hospitality & Fine Dining', 'Cosmetics & Architecture']
  },
  7: {
    number: 7,
    planetEn: 'Ketu',
    planetHi: 'Ketu (केतु - South Lunar Node)',
    deity: 'Lord Ganesha / Ketu Deva',
    element: 'Metal / Ether',
    day: 'Tuesday',
    color: 'Spotted / Multi-color / Ash Grey',
    gemstone: "Cat's Eye (Lehsuniya)",
    mantra: 'OM KETAVE NAMAH',
    cosmicNature: 'गहन शोधकर्ता, आध्यात्मिक जिज्ञासु, विश्लेषणात्मक और अंतर्मुखी दार्शनिक।',
    friendlyNumbers: [1, 3, 4, 5, 6],
    neutralNumbers: [2, 8],
    enemyNumbers: [7, 9],
    careerResonances: ['Scientific Research', 'Occult & Astro Studies', 'Data Forensics', 'Software Architecture', 'Healing Arts']
  },
  8: {
    number: 8,
    planetEn: 'Saturn',
    planetHi: 'Shani (शनि)',
    deity: 'Shani Deva',
    element: 'Earth',
    day: 'Saturday',
    color: 'Dark Navy Blue / Charcoal Black',
    gemstone: 'Blue Sapphire (Neelam)',
    mantra: 'OM SHAM SHANAISCHARAYA NAMAH',
    cosmicNature: 'न्यायप्रिय, अनुशासित, कर्मठ, कर्मफल प्रदाता, धैर्यवान और दीर्घकालिक निर्माता।',
    friendlyNumbers: [4, 5, 6, 7],
    neutralNumbers: [3],
    enemyNumbers: [1, 2, 8, 9],
    careerResonances: ['Real Estate & Infrastructure', 'Heavy Manufacturing / Mining', 'Judiciary & Governance', 'Large Industrial Conglomerates']
  },
  9: {
    number: 9,
    planetEn: 'Mars',
    planetHi: 'Mangal (मंगल)',
    deity: 'Mangala Deva / Lord Hanuman',
    element: 'Fire',
    day: 'Tuesday',
    color: 'Bright Vermilion / Blood Red',
    gemstone: 'Red Coral (Moonga)',
    mantra: 'OM MANGALAYA NAMAH',
    cosmicNature: 'ऊर्जावान, साहसी, रक्षक, कर्मठ योद्धा और मानवीय संवेदनाओं से युक्त।',
    friendlyNumbers: [1, 2, 3, 5],
    neutralNumbers: [6, 7],
    enemyNumbers: [4, 8, 9],
    careerResonances: ['Defense Forces / Police', 'Surgery & Emergency Medicine', 'Competitive Sports', 'Civil Engineering', 'Humanitarian Leadership']
  }
};

// Register all rules in the registry
Object.values(PLANET_DEFINITIONS).forEach((planet) => {
  const rule: MethodologyRule = {
    id: `PLANET_${planet.number}`,
    category: 'PLANET',
    ruleName: `${planet.planetEn} (${planet.planetHi}) Rulership for Digit ${planet.number}`,
    system: 'LEOFAMILY',
    source: SOURCES.INDIAN_CLASSICAL_VEDIC,
    description: `अंक ${planet.number} के स्वामी ग्रह ${planet.planetHi} का खगोलीय और अंकशास्त्रीय ऊर्जा प्रभाव।`,
    interpretation: planet.cosmicNature,
    confidence: 100,
    safetyLevel: 'SAFE',
    details: planet
  };
  methodologyRegistry.registerRule(rule);
});
