import { SOURCES } from './sourceRegistry';
import { MANDATORY_MEDICAL_WELLNESS_DISCLAIMER } from './wellnessDefinitions';

export { MANDATORY_MEDICAL_WELLNESS_DISCLAIMER };

export interface DayLordInfo {
  dayNameEn: string;
  dayNameHi: string;
  number: number;
  graha: string;
  grahaHi: string;
  sourceDocument: string;
  pageNumber: number;
  methodology: string;
}

export const DAY_LORD_MAPPINGS: Record<number, DayLordInfo> = {
  0: { // Sunday
    dayNameEn: 'Sunday',
    dayNameHi: 'रविवार',
    number: 1,
    graha: 'Sun (Surya)',
    grahaHi: 'सूर्य (Surya)',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 1,
    methodology: 'Supplied Course Methodology (Raajeev Singh Chauhann)'
  },
  1: { // Monday
    dayNameEn: 'Monday',
    dayNameHi: 'सोमवार',
    number: 2,
    graha: 'Moon (Chandra)',
    grahaHi: 'चंद्रमा (Chandra)',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 1,
    methodology: 'Supplied Course Methodology (Raajeev Singh Chauhann)'
  },
  2: { // Tuesday
    dayNameEn: 'Tuesday',
    dayNameHi: 'मंगलवार',
    number: 9,
    graha: 'Mars (Mangal)',
    grahaHi: 'मंगल (Mangal)',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 1,
    methodology: 'Supplied Course Methodology (Raajeev Singh Chauhann)'
  },
  3: { // Wednesday
    dayNameEn: 'Wednesday',
    dayNameHi: 'बुधवार',
    number: 5,
    graha: 'Mercury (Budha)',
    grahaHi: 'बुध (Budha)',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 1,
    methodology: 'Supplied Course Methodology (Raajeev Singh Chauhann)'
  },
  4: { // Thursday
    dayNameEn: 'Thursday',
    dayNameHi: 'गुरुवार',
    number: 3,
    graha: 'Jupiter (Guru)',
    grahaHi: 'बृहस्पति / गुरु (Guru)',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 1,
    methodology: 'Supplied Course Methodology (Raajeev Singh Chauhann)'
  },
  5: { // Friday
    dayNameEn: 'Friday',
    dayNameHi: 'शुक्रवार',
    number: 6,
    graha: 'Venus (Shukra)',
    grahaHi: 'शुक्र (Shukra)',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 1,
    methodology: 'Supplied Course Methodology (Raajeev Singh Chauhann)'
  },
  6: { // Saturday
    dayNameEn: 'Saturday',
    dayNameHi: 'शनिवार',
    number: 8,
    graha: 'Saturn (Shani)',
    grahaHi: 'शनि (Shani)',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 1,
    methodology: 'Supplied Course Methodology (Raajeev Singh Chauhann)'
  }
};

export interface AyurvedicDoshaDefinition {
  number: number;
  dosha: 'Pitta' | 'Kapha' | 'Vata';
  doshaHi: string;
  planet: string;
  planetHi: string;
  birthDates: number[];
  elements: string[];
  elementsHi: string;
}

export const NUMBER_DOSHA_MAP: Record<number, AyurvedicDoshaDefinition> = {
  1: {
    number: 1,
    dosha: 'Pitta',
    doshaHi: 'पित्त (Pitta - अग्नि + जल)',
    planet: 'Sun',
    planetHi: 'सूर्य (Surya)',
    birthDates: [1, 10, 19, 28],
    elements: ['Fire', 'Water'],
    elementsHi: 'अग्नि और जल'
  },
  2: {
    number: 2,
    dosha: 'Kapha',
    doshaHi: 'कफ (Kapha - पृथ्वी + जल)',
    planet: 'Moon',
    planetHi: 'चंद्रमा (Chandra)',
    birthDates: [2, 11, 20, 29],
    elements: ['Earth', 'Water'],
    elementsHi: 'पृथ्वी और जल'
  },
  3: {
    number: 3,
    dosha: 'Kapha',
    doshaHi: 'कफ (Kapha - पृथ्वी + जल)',
    planet: 'Jupiter (Guru)',
    planetHi: 'बृहस्पति / गुरु (Guru)',
    birthDates: [3, 12, 21, 30],
    elements: ['Earth', 'Water'],
    elementsHi: 'पृथ्वी और जल'
  },
  4: {
    number: 4,
    dosha: 'Vata',
    doshaHi: 'वात (Vata - आकाश + वायु / Wind Energy)',
    planet: 'Rahu',
    planetHi: 'राहु (Rahu)',
    birthDates: [4, 13, 22, 31],
    elements: ['Space', 'Air'],
    elementsHi: 'आकाश और वायु (वायु ऊर्जा)'
  },
  5: {
    number: 5,
    dosha: 'Vata',
    doshaHi: 'वात (Vata - आकाश + वायु)',
    planet: 'Mercury',
    planetHi: 'बुध (Budha)',
    birthDates: [5, 14, 23],
    elements: ['Space', 'Air'],
    elementsHi: 'आकाश और वायु'
  },
  6: {
    number: 6,
    dosha: 'Kapha',
    doshaHi: 'कफ (Kapha - पृथ्वी + जल)',
    planet: 'Venus',
    planetHi: 'शुक्र (Shukra)',
    birthDates: [6, 15, 24],
    elements: ['Earth', 'Water'],
    elementsHi: 'पृथ्वी और जल'
  },
  7: {
    number: 7,
    dosha: 'Kapha',
    doshaHi: 'कफ (Kapha - पृथ्वी + जल)',
    planet: 'Ketu',
    planetHi: 'केतु (Ketu)',
    birthDates: [7, 16, 25],
    elements: ['Earth', 'Water'],
    elementsHi: 'पृथ्वी और जल'
  },
  8: {
    number: 8,
    dosha: 'Vata',
    doshaHi: 'वात (Vata - आकाश + वायु)',
    planet: 'Saturn',
    planetHi: 'शनि (Shani)',
    birthDates: [8, 17, 26],
    elements: ['Space', 'Air'],
    elementsHi: 'आकाश और वायु'
  },
  9: {
    number: 9,
    dosha: 'Pitta',
    doshaHi: 'पित्त (Pitta - अग्नि + जल)',
    planet: 'Mars',
    planetHi: 'मंगल (Mangal)',
    birthDates: [9, 18, 27],
    elements: ['Fire', 'Water'],
    elementsHi: 'अग्नि और जल'
  }
};

export interface DoshaBalanceDetail {
  dosha: string;
  doshaHi: string;
  composition: string;
  balancedQualitiesEn: string[];
  balancedQualitiesHi: string[];
  imbalancedSymptomsEn: string[];
  imbalancedSymptomsHi: string[];
  sourceDocument: string;
  pageNumber: number;
}

export const DOSHA_DETAILS: Record<'Vata' | 'Pitta' | 'Kapha', DoshaBalanceDetail> = {
  Vata: {
    dosha: 'Vata',
    doshaHi: 'वात दोष (Vata Dosha)',
    composition: 'Space + Air (आकाश + वायु) — Wind Energy',
    balancedQualitiesEn: [
      'Promotes high creativity, mental flexibility, and enthusiasm',
      'Energetic, active, quick learner, and multi-tasker',
      'Kind-hearted, slim/lean body structure with good memory'
    ],
    balancedQualitiesHi: [
      'संतुष्ट वात दोष रचनात्मकता (Creativity) और लचीलापन बढ़ाता है।',
      'ऊर्जावान, सक्रिय, संवाद कौशल में निपुण और शीघ्र सीखने वाले होते हैं।',
      'दयालु, चुस्त, जीवंत, उत्साह से भरपूर और दुबला-पतला शरीर।'
    ],
    imbalancedSymptomsEn: [
      'Lower back pain, menstrual disorders, abdominal pain, dry skin, constipation',
      'Forgetfulness, anxiety, unstable mood, high sensitivity to cold',
      'Sleeping disorders (insomnia), irregular appetite, poor digestion and gas problems'
    ],
    imbalancedSymptomsHi: [
      'पीठ के निचले हिस्से में दर्द, मासिक धर्म संबंधी विकार, पेट दर्द, त्वचा का रूखापन, कब्ज।',
      'भुलक्कड़पन, चिंता, अस्थिर मनोदशा, ठंड के प्रति अत्यधिक संवेदनशीलता।',
      'नींद न आने की बीमारी (Insomnia), अनियमित भूख, खराब पाचन और गैस की समस्या।'
    ],
    sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
    pageNumber: 5
  },
  Pitta: {
    dosha: 'Pitta',
    doshaHi: 'पित्त दोष (Pitta Dosha)',
    composition: 'Fire + Water (अग्नि + जल) — Transformative Energy',
    balancedQualitiesEn: [
      'Promotes leadership qualities, vibrant social life, self-determination, intelligence',
      'High energy levels, strong desire, mastering skills',
      'Healthy glowing skin and hair, good blood circulation, commanding loud voice'
    ],
    balancedQualitiesHi: [
      'संतुष्ट पित्त दोष नेतृत्व गुण, अच्छा सामाजिक जीवन, आकर्षण और निर्णय क्षमता को बढ़ाता है।',
      'बुद्धिमान, मजबूत ऊर्जा स्तर, कौशल में निपुणता और प्रबल इच्छाशक्ति।',
      'स्वस्थ त्वचा और बाल, अच्छा रक्त संचार (Blood Circulation) और प्रभावशाली आवाज़।'
    ],
    imbalancedSymptomsEn: [
      'Anger issues, hatred, jealousy, impatience, prone to acne and inflammation',
      'Very sensitive to hot temperature (12 PM to 2 PM), bleeding gums, hair fall, skin issues',
      'Acidity, heartburn, always feeling hungry, oily skin, excess sweating, high irritation'
    ],
    imbalancedSymptomsHi: [
      'क्रोध, अधीरता, ईर्ष्या, मुँहासे, शरीर में सूजन और चिड़चिड़ापन।',
      'दोपहर के गर्म तापमान (12 से 2 बजे) के प्रति संवेदनशीलता, मसूड़ों से खून आना, बाल झड़ना।',
      'एसिडिटी, सीने में जलन, हमेशा भूख लगना, तैलीय त्वचा और अत्यधिक पसीना।'
    ],
    sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
    pageNumber: 7
  },
  Kapha: {
    dosha: 'Kapha',
    doshaHi: 'कफ दोष (Kapha Dosha)',
    composition: 'Earth + Water (पृथ्वी + जल) — Structural Stability',
    balancedQualitiesEn: [
      'Romantic, caring, loving, emotional, calm, wise, patient with motherly touch',
      'Strong bones, big muscles, thick lustrous hair, broad eyelashes, broad chest'
    ],
    balancedQualitiesHi: [
      'संतुष्ट कफ वाले व्यक्ति देखभाल करने वाले, प्रेमपूर्ण, भावुक, शांत, बुद्धिमान और धैर्यवान होते हैं।',
      'मजबूत हड्डियां, सुगठित मांसपेशियां, घने बाल, चौड़ी पलकें और चौड़ी छाती।'
    ],
    imbalancedSymptomsEn: [
      'Sluggishness, laziness, over-sleeping, breathing issues, prone to depression',
      'Asthma, respiratory congestion, body feeling cold overnight, joint pains'
    ],
    imbalancedSymptomsHi: [
      'सुस्ती, आलस्य, अधिक सोने की आदत, सांस लेने में समस्या और अवसाद (Depression) की संभावना।',
      'अस्थमा, फेफड़ों में कफ का जमाव, रात भर शरीर का ठंडा रहना और जोड़ों में दर्द।'
    ],
    sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
    pageNumber: 8
  }
};

export interface PlanetBodyPartAndDisease {
  number: number;
  planetEn: string;
  planetHi: string;
  bodyPartsEn: string[];
  bodyPartsHi: string[];
  traditionalDiseasesEn: string[];
  traditionalDiseasesHi: string[];
  sourceDocument: string;
  pageNumber: number;
}

export const PLANET_BODY_PARTS_DISEASES: Record<number, PlanetBodyPartAndDisease> = {
  1: {
    number: 1,
    planetEn: 'Sun',
    planetHi: 'सूर्य (Surya)',
    bodyPartsEn: ['Bone', 'Right Eye', 'Hair', 'Heart', 'Brain', 'Upper Abdomen', 'Glow on the skin'],
    bodyPartsHi: ['हड्डी', 'दाहिनी आँख', 'बाल', 'हृदय (Heart)', 'मस्तिष्क (Brain)', 'ऊपरी पेट', 'त्वचा पर चमक'],
    traditionalDiseasesEn: [
      'Eye-related problems, baldness, sunstroke, high fever, loss of appetite',
      'Diarrhoea, heart-related issues, loss of thirst, blood pressure (Low or high)',
      'Trouble in 4th month of pregnancy, bone-related issues, migraine'
    ],
    traditionalDiseasesHi: [
      'आँख से संबंधित समस्याएं, गंजापन, लू लगना, तेज बुखार, भूख न लगना',
      'हृदय से संबंधित समस्याएं, रक्तचाप / Blood Pressure (कम या अधिक)',
      'गर्भावस्था के चौथे महीने में परेशानी, हड्डियों की समस्याएं, माइग्रेन'
    ],
    sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
    pageNumber: 12
  },
  2: {
    number: 2,
    planetEn: 'Moon',
    planetHi: 'चंद्रमा (Chandra)',
    bodyPartsEn: ['Left Eye', 'WBC (White blood Cells)', 'Female reproductive organs', 'Tonsil Glands', 'Digestive system', 'Female breast', 'Stomach', 'Respiratory System', 'Urinary Bladder', 'Uterus', 'Chest'],
    bodyPartsHi: ['बायीं आँख', 'श्वेत रक्त कोशिकाएँ (WBC)', 'महिला प्रजनन अंग', 'टॉन्सिल ग्रंथियाँ', 'पाचन तंत्र', 'महिला स्तन', 'पेट / आमाशय', 'श्वसन तंत्र', 'मूत्राशय', 'गर्भाशय', 'छाती'],
    traditionalDiseasesEn: [
      'Cold and cough, digestive issues, constipation, laziness, eye diseases',
      'Impurities in blood, depression, pregnancy issues, menstrual disorders, psychological problems'
    ],
    traditionalDiseasesHi: [
      'सर्दी-खांसी, पाचन संबंधी समस्याएं, कब्ज, चक्कर आना, आँखों के रोग',
      'रक्त में अशुद्धियां, अवसाद (Depression), गर्भावस्था संबंधी समस्याएं, मासिक धर्म संबंधी विकार, मनोवैज्ञानिक तनाव'
    ],
    sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
    pageNumber: 12
  },
  3: {
    number: 3,
    planetEn: 'Jupiter',
    planetHi: 'बृहस्पति / गुरु (Jupiter)',
    bodyPartsEn: ['Fat related', 'Thighs', 'Hips', 'Stomach', 'Liver', 'Pancreas', 'Nervous system', 'Lungs', 'Kidney', 'Spleen', 'Brain', 'Throat', 'Feet', 'Nostrils'],
    bodyPartsHi: ['वसा (Fat) से संबंधित', 'जांघें', 'कूल्हे', 'पेट', 'यकृत (Liver)', 'अग्न्याशय (Pancreas)', 'तंत्रिका तंत्र', 'फेफड़े', 'गुर्दे (Kidney)', 'तिल्ली (Spleen)', 'मस्तिष्क', 'गला', 'पैर', 'नासिका'],
    traditionalDiseasesEn: [
      'Bronchitis, prostate breathing issues, liver issues, jaundice, hernia',
      'Problem in 3rd month of pregnancy, high cholesterol, blood clotting, cancer, paralysis'
    ],
    traditionalDiseasesHi: [
      'श्वसनीशोथ (Bronchitis), प्रोस्टेट, सांस लेने में समस्या, लीवर संबंधी समस्या, पीलिया (Jaundice), हर्निया',
      'गर्भावस्था के तीसरे महीने में समस्या, उच्च कोलेस्ट्रॉल (High Cholesterol), रक्त का थक्का जमना, पक्षाघात (Paralysis)'
    ],
    sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
    pageNumber: 12
  },
  4: {
    number: 4,
    planetEn: 'Rahu',
    planetHi: 'राहु (Rahu)',
    bodyPartsEn: ['Head', 'Ear', 'Intestine', 'Lips', 'Mouth', 'Neck', 'Legs', 'Brain', 'Breathing system', 'Respiratory system', 'Lungs'],
    bodyPartsHi: ['सिर', 'कान', 'आंत (Intestines)', 'होंठ', 'मुंह', 'गर्दन', 'पैर', 'मस्तिष्क', 'श्वास प्रणाली', 'श्वसन प्रणाली', 'फेफड़े'],
    traditionalDiseasesEn: [
      'Undiagnosed disease, cataract, viral infection, allergy, sleeping disorder, piles',
      'Herpes, skin problems, food poisoning, fungal infection, leg injuries, accidents, insanity, brain dysfunction'
    ],
    traditionalDiseasesHi: [
      'अज्ञात व अनिदान रोग, मोतियाबिंद, आत्महत्या की प्रवृत्ति, वायरल संक्रमण, एलर्जी, नींद की बीमारी (अनिद्रा)',
      'बवासीर (Piles), दाद, त्वचा की समस्या, भोजन विषाक्तता (Food Poisoning), फंगल संक्रमण, पैर की चोट, मस्तिष्क की शिथिलता'
    ],
    sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
    pageNumber: 12
  },
  5: {
    number: 5,
    planetEn: 'Mercury',
    planetHi: 'बुध (Mercury)',
    bodyPartsEn: ['Sense Organs', 'Nose', 'Ear', 'Eyes', 'Tongue', 'Skin Nervous system', 'Stammering', 'Arms', 'Hands', 'Shoulder', 'Forehead', 'Lungs', 'Throat', 'Vocal'],
    bodyPartsHi: ['ज्ञानेंद्रियाँ', 'नाक', 'कान', 'आँख', 'जीभ', 'त्वचा तंत्रिका तंत्र', 'हकलाना', 'भुजाएँ', 'हाथ', 'कंधा', 'माथा', 'फेफड़े', 'गला', 'स्वरयंत्र (Vocal Cords)'],
    traditionalDiseasesEn: [
      'Ringworm, baldness, insomnia, cold, cough, teeth-related issues, itching',
      'White spots, skin diseases, ENT problems, eczema, thyroid, hypodermia, pregnancy 7th month, shoulder pain, headache, stammering'
    ],
    traditionalDiseasesHi: [
      'दाद, गंजापन, अनिद्रा, सर्दी, खांसी, दांतों की समस्याएं, खुजली, सफेद दाग',
      'त्वचा रोग, ईएनटी (ENT) समस्याएं, एक्जिमा, थायरॉयड, 7वें महीने में गर्भावस्था की समस्या, हाथ और कंधे में दर्द, सिरदर्द, हकलाना'
    ],
    sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
    pageNumber: 13
  },
  6: {
    number: 6,
    planetEn: 'Venus',
    planetHi: 'शुक्र (Venus)',
    bodyPartsEn: ['Beauty of skin', 'Sexual organs', 'Eyes', 'Glow on eyes', 'Cheeks', 'Face', 'Ovaries', 'Private parts', 'Kidney'],
    bodyPartsHi: ['त्वचा की सुंदरता', 'यौन अंग', 'आंखें', 'आंखों की चमक', 'गाल', 'चेहरा', 'अंडाशय (Ovaries)', 'गुप्तांग', 'गुर्दे (Kidneys)'],
    traditionalDiseasesEn: [
      'Sexuality, childbirth issues, abortion, urinary problem, kidney related issues',
      'Eyes diseases, low sperm count, uneven skin tone, miscarriages'
    ],
    traditionalDiseasesHi: [
      'कामुकता, प्रसव संबंधी समस्याएं, गर्भपात, मूत्र संबंधी समस्या, गुर्दे (Kidney) से संबंधित समस्याएं',
      'आंखों के रोग, शुक्राणुओं की कमी, असमान त्वचा का रंग'
    ],
    sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
    pageNumber: 13
  },
  7: {
    number: 7,
    planetEn: 'Ketu',
    planetHi: 'केतु (Ketu)',
    bodyPartsEn: ['Joints', 'Legs', 'Arms', 'Stomach', 'Abdomen', 'Lower body', 'Nails', 'Nerves', 'Arteries'],
    bodyPartsHi: ['जोड़', 'पैर', 'हाथ', 'पेट', 'उदर', 'निचला शरीर', 'नाखून', 'नसें', 'धमनियां'],
    traditionalDiseasesEn: [
      'Cuts, wounds, viral infection, joint pains, heart blockage, urine disorder, piles',
      'Viral fever, tumour, cystic growth, lower back pain issues, spinal cord issues, unwanted growth, dark circles under eyes, thyroid, Parkinson disease'
    ],
    traditionalDiseasesHi: [
      'कट, घाव, वायरल संक्रमण, जोड़ों का दर्द, हृदय की रुकावट (Blockage), मूत्र विकार, बवासीर',
      'वायरल बुखार, ट्यूमर, सिस्टिक वृद्धि, पीठ के निचले हिस्से में दर्द, रीढ़ की हड्डी की समस्या, आँखों के नीचे काले घेरे, थायरॉयड, पार्किंसन रोग'
    ],
    sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
    pageNumber: 13
  },
  8: {
    number: 8,
    planetEn: 'Saturn',
    planetHi: 'शनि (Saturn)',
    bodyPartsEn: ['Knees', 'Chin', 'Digestive system', 'Legs', 'Feet', 'Teeth', 'Muscles', 'Digestive organs', 'Nerves'],
    bodyPartsHi: ['घुटने', 'ठोड़ी', 'पाचन तंत्र', 'पैर', 'पंजे', 'दांत', 'मांसपेशियां', 'पाचन अंग', 'तंत्रिकाएं'],
    traditionalDiseasesEn: [
      'Chronic diseases, blood infection, teeth related issues, weakness in muscles, laziness',
      'Gas trouble, arthritis, ulcers, indigestion, hair fall, problems in 6th month of pregnancy'
    ],
    traditionalDiseasesHi: [
      'दीर्घकालिक (Chronic) रोग, रक्त संक्रमण, दांतों से संबंधित समस्याएं, मांसपेशियों में कमजोरी, आलस्य',
      'गैस की समस्या, गठिया (Arthritis), अल्सर, अपच, बाल झड़ना, गर्भावस्था के छठे महीने में समस्या'
    ],
    sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
    pageNumber: 13
  },
  9: {
    number: 9,
    planetEn: 'Mars',
    planetHi: 'मंगल (Mars)',
    bodyPartsEn: ['Eyebrows', 'Bridge of the nose', 'Blood', 'RBC', 'Bone marrow', 'Heart', 'Haemoglobin', 'Forehead', 'Chest'],
    bodyPartsHi: ['भौहें', 'नाक का पुल', 'रक्त', 'आरबीसी (RBC)', 'अस्थि मज्जा (Bone Marrow)', 'हृदय', 'हीमोग्लोबिन', 'माथा', 'छाती'],
    traditionalDiseasesEn: [
      'Redness of skin, loss of blood, blood pressure, acidity issues, constipation, digestive issues',
      'Problem in 2nd month of pregnancy, fever, hormonal problem, injuries, accidents, burns, blood clots, heart related issues'
    ],
    traditionalDiseasesHi: [
      'त्वचा का लाल होना, रक्त की कमी, रक्तचाप, एसिडिटी की समस्या, कब्ज, पाचन संबंधी समस्या',
      'गर्भावस्था के दूसरे महीने में समस्या, बुखार, हार्मोनल समस्या, चोट, दुर्घटना, जलन, रक्त के थक्के (Blood Clots), हृदय संबंधी समस्याएं'
    ],
    sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
    pageNumber: 13
  }
};

export interface RemediesDietPlan {
  number: number;
  foodsEn: string[];
  foodsHi: string[];
  fastingEn: string;
  fastingHi: string;
  precautionsEn: string[];
  precautionsHi: string[];
  sourceDocument: string;
  pageNumber: number;
}

export const REMEDIES_DIET_PLANS: Record<number, RemediesDietPlan> = {
  1: {
    number: 1,
    foodsEn: ['Honey', 'Raisin', 'Barley bread', 'Oranges', 'Lemons', 'Dates'],
    foodsHi: ['शहद', 'किशमिश', 'जौ की रोटी', 'संतरे', 'नींबू', 'खजूर'],
    fastingEn: 'On Sunday',
    fastingHi: 'रविवार को उपवास रखें।',
    precautionsEn: [
      'Take a tablespoon of honey in the morning with water is good for their health.',
      'Yoga and meditation are recommended to keep their mind and nerves relaxed.',
      'Wake up earlier than Sun rises'
    ],
    precautionsHi: [
      'सुबह पानी के साथ एक बड़ा चम्मच शहद लेना स्वास्थ्य के लिए अच्छा है।',
      'मन और तंत्रिकाओं को शांत रखने के लिए योग और ध्यान की सलाह दी जाती है।',
      'सूर्योदय से पहले उठें।'
    ],
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 4
  },
  2: {
    number: 2,
    foodsEn: ['White and yellow pumpkin', 'Cucumber', 'Green cabbage and lettuce', 'Watermelon', 'Pomegranate', 'Banana'],
    foodsHi: ['सफेद और पीला कद्दू', 'खीरा', 'हरी पत्तागोभी और सलाद पत्ता', 'तरबूज', 'अनार', 'केला'],
    fastingEn: 'On Monday',
    fastingHi: 'सोमवार को उपवास रखें।',
    precautionsEn: [
      'Eat watery food, vegetable, and fruit.',
      'Drink water in silver glass or in green water bottle.',
      'Drink plenty of water, as your body requires a lot of water.',
      'Let go of anxiety.',
      'Their health issues start from mind and attack body; controlling the mind curbs health issues.',
      'Yoga, Pranayama and Meditation is a must for number 2 to control mood swings.'
    ],
    precautionsHi: [
      'पानी युक्त भोजन, हरी सब्ज़ियाँ और रसीले फल खाएँ।',
      'चाँदी के गिलास या हरे रंग की बोतल में पानी पिएँ।',
      'खूब पानी पिएँ, क्योंकि शरीर को पर्याप्त जल की आवश्यकता होती है।',
      'चिंता और व्यर्थ की घबराहट को दूर करें।',
      'स्वास्थ्य समस्याएं मन से शुरू होकर शरीर पर प्रभाव डालती हैं; मन पर नियंत्रण रखने से समस्याएं दूर होती हैं।',
      'मिज़ाज (Mood Swings) को नियंत्रित करने के लिए योग, प्राणायाम और ध्यान अति आवश्यक है।'
    ],
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 6
  },
  3: {
    number: 3,
    foodsEn: ['Food grains like wheat, pulses etc.', 'Vegetables like tomato, lemon', 'Fruit like pomegranate, pineapple', 'Almonds', 'Cherries, strawberries, apple, peaches, olives, grapes'],
    foodsHi: ['गेहूं, दालें आदि जैसे अनाज', 'टमाटर, नींबू जैसी सब्ज़ियाँ', 'अनार, अनानास जैसे फल', 'बादाम', 'चेरी, स्ट्रॉबेरी, सेब, आड़ू, जैतून, अंगूर'],
    fastingEn: 'On Thursday and abstain from eating banana.',
    fastingHi: 'गुरुवार को उपवास रखें और गुरुवार को केला खाने से परहेज़ करें।',
    precautionsEn: [
      'Practice serenity and do not overstrain nervous system.',
      'They should avoid eating non-veg.',
      "Don't smoke and avoid smoky and dusty atmosphere.",
      'Avoid cold stuff like ice cream, cold drink etc.'
    ],
    precautionsHi: [
      'शांति का अभ्यास करें और तंत्रिका तंत्र पर ज़्यादा दबाव न डालें।',
      'मांसाहारी भोजन से बचना चाहिए।',
      'धूम्रपान न करें और धुएँ व धूल भरे वातावरण से बचें।',
      'आइसक्रीम, कोल्ड ड्रिंक आदि जैसी ठंडी चीज़ों से बचें।'
    ],
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 8
  },
  4: {
    number: 4,
    foodsEn: ['Leafy vegetables', 'Sprouts', 'Ginger', 'Onion', 'Spinach'],
    foodsHi: ['पत्तेदार सब्ज़ियाँ', 'अंकुरित अनाज', 'अदरक', 'प्याज', 'पालक'],
    fastingEn: 'On Monday',
    fastingHi: 'सोमवार को उपवास रखें।',
    precautionsEn: [
      'Eat food which can improve digestion, like leafy vegetables, ginger and onions.',
      'Avoid red meat.',
      'Yoga, Meditation'
    ],
    precautionsHi: [
      'ऐसे खाद्य पदार्थ खाएँ जो पाचन क्रिया को बेहतर बना सकें, जैसे पत्तेदार सब्ज़ियाँ, अदरक और प्याज।',
      'लाल मांस से परहेज़ करें।',
      'नियमित योग और ध्यान करें।'
    ],
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 10
  },
  5: {
    number: 5,
    foodsEn: ['Walnut, Pista and nuts of all kinds', "Cow's milk and Ghee", 'Figs, cereal and Oats', 'Carrots'],
    foodsHi: ['अखरोट, पिस्ता और सभी प्रकार के मेवे', 'गाय का दूध और देसी घी', 'अंजीर, अनाज और ओट्स', 'गाजर'],
    fastingEn: 'Fast on Wednesday or full moon day.',
    fastingHi: 'बुधवार या पूर्णिमा के दिन उपवास रखें।',
    precautionsEn: [
      'Sleep well and be in harmony with your surroundings.',
      'Yoga and Pranayama.',
      'Try to remain calm and practice patience.'
    ],
    precautionsHi: [
      'अच्छी नींद लें और अपने परिवेश के साथ सामंजस्य बिठाएँ।',
      'योग और प्राणायाम का नियमित अभ्यास करें।',
      'शांत रहने और धैर्य रखने का प्रयास करें।'
    ],
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 11
  },
  6: {
    number: 6,
    foodsEn: ['Fruits like Watermelon, Pomegranate, pineapple, musk melon, apples, grapes, Figs, raisin', 'Nuts like apricot, walnut, almond', 'All kinds of beans', 'Spinach'],
    foodsHi: ['फल जैसे तरबूज, अनार, अनानास, खरबूजा, सेब, अंगूर, अंजीर, किशमिश', 'मेवे जैसे खुबानी, अखरोट, बादाम', 'सभी प्रकार की फलियाँ', 'पालक'],
    fastingEn: 'On Fridays',
    fastingHi: 'शुक्रवार को उपवास रखें।',
    precautionsEn: [
      'Stay in surroundings with fresh air, this will strengthen your heart.',
      'Avoid food which causes constipation.'
    ],
    precautionsHi: [
      'ताज़ी हवा में रहें, इससे आपका हृदय मज़बूत होगा।',
      'ऐसे गरिष्ठ भोजन से बचें जिससे कब्ज हो।'
    ],
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 12
  },
  7: {
    number: 7,
    foodsEn: ['Green and leafy vegetables like lettuce, cauliflower, pumpkin, cucumber and onion', 'Mushroom', 'Apple, cranberries, banana, grapes, pineapple', 'Raisin', 'Juices of all fruits'],
    foodsHi: ['हरी और पत्तेदार सब्ज़ियाँ जैसे लेट्यूस, फूलगोभी, कद्दू, खीरा और प्याज', 'मशरूम', 'सेब, क्रैनबेरी, केला, अंगूर, अनानास', 'किशमिश', 'सभी फलों के रस'],
    fastingEn: 'On Tuesday',
    fastingHi: 'मंगलवार को उपवास रखें।',
    precautionsEn: [
      'Avoid oily and spicy foods.',
      'They are not very strong physically so they should not strain their body physically.',
      'Avoid negative thinking.'
    ],
    precautionsHi: [
      'तैलीय और अत्यधिक मसालेदार भोजन से बचें।',
      'शारीरिक रूप से बहुत अधिक श्रम या तनाव न डालें, अपनी क्षमता अनुसार कार्य करें।',
      'नकारात्मक सोच और अत्यधिक चिंता से बचें।'
    ],
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 13
  },
  8: {
    number: 8,
    foodsEn: ['Juices of fruits (Lime juice without sugar)', 'Pineapple, Banana and Raisin', 'Cucumber', 'Carrot, Spinach, Broccoli', 'Yam'],
    foodsHi: ['फलों का रस (बिना चीनी वाला नींबू पानी)', 'अनानास, केला और किशमिश', 'खीरा', 'गाजर, पालक, ब्रोकली', 'रतालू'],
    fastingEn: 'On Saturday',
    fastingHi: 'शनिवार को उपवास रखें।',
    precautionsEn: [
      'Avoid meat, coffee, and Tea.',
      'Avoid overeating, eat little less than your full stomach.',
      'After 40 years of age, substitute your diet with Milk and fruit in dinner.',
      'Avoid food which causes constipation.'
    ],
    precautionsHi: [
      'मांस, कॉफ़ी और अधिक चाय से परहेज़ करें।',
      'ज़्यादा खाने से बचें, पेट भर खाने से थोड़ा कम खाएँ।',
      '40 वर्ष की आयु के बाद, रात के खाने में हल्का दूध और फलों का सेवन करें।',
      'ऐसे भोजन से बचें जिससे कब्ज हो।'
    ],
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 15
  },
  9: {
    number: 9,
    foodsEn: ['Onion - must be included in diet', 'Garlic (must for women of this number)', 'Ginger', 'Lady finger, Yam, Tomato'],
    foodsHi: ['प्याज - अपने आहार में ज़रूर शामिल करें', 'लहसुन (इस अंक की महिलाओं के लिए विशेष लाभकारी)', 'अदरक', 'भिंडी, रतालू, टमाटर'],
    fastingEn: 'On Tuesday',
    fastingHi: 'मंगलवार को उपवास रखें।',
    precautionsEn: [
      'Avoid eating chilies and spicy food.',
      'Avoid eating meat.',
      'Food with hot spices must be avoided at all costs.'
    ],
    precautionsHi: [
      'मिर्च और अत्यधिक मसालेदार भोजन से बचें।',
      'मांस खाने से बचें।',
      'तीखे मसालों वाले भोजन से हर हाल में बचना चाहिए।'
    ],
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 16
  }
};

export interface VedicRemedyAction {
  number: number;
  dayEn: string;
  dayHi: string;
  planetEn: string;
  planetHi: string;
  remediesEn: string[];
  remediesHi: string[];
  goodKarmasHi: string;
  livingPlanetsHi: string;
  sourceDocument: string;
  pageNumber: number;
}

export const VEDIC_REMEDIES_MAP: Record<number, VedicRemedyAction> = {
  1: {
    number: 1,
    dayEn: 'Sunday',
    dayHi: 'रविवार',
    planetEn: 'Sun',
    planetHi: 'सूर्य (Surya)',
    remediesEn: [
      'Surya Devta Jal in early morning',
      'Lal Chandan Tilak on forehead',
      'Help father or father figure or an old person',
      'Serve red cow with wheat',
      'Donate wheat in any Bhandara where food is served to many people',
      'Feed cow jaggery (gud)',
      'Chant Gayatri Mantra'
    ],
    remediesHi: [
      'प्रातःकाल सूर्य देवता को तांबे के पात्र से जल अर्पित करें',
      'माथे पर लाल चंदन का तिलक लगाएँ',
      'पिता, पितृतुल्य या किसी वृद्ध व्यक्ति की सहायता करें एवं आशीर्वाद लें',
      'लाल रंग की गाय को गेहूँ खिलाएँ',
      'भंडारे या लंगर में जहाँ बहुत से लोगों को भोजन कराया जाता हो, गेहूँ दान करें',
      'गाय को गुड़ खिलाएँ',
      'प्रतिदिन श्रद्धापूर्वक गायत्री मंत्र का जाप करें'
    ],
    goodKarmasHi: 'पिता व बुजुर्गों का सम्मान, अन्न दान (गेहूँ), एवं गायत्री उपासना।',
    livingPlanetsHi: 'पिता, पितृतुल्य संरक्षक एवं लाल गाय।',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 18
  },
  2: {
    number: 2,
    dayEn: 'Monday',
    dayHi: 'सोमवार',
    planetEn: 'Moon',
    planetHi: 'चंद्रमा (Chandra)',
    remediesEn: [
      'Give water (Jal chadhaye) to Shivling',
      'Use silver spoon',
      'Use silver glass for drinking water or use green water bottle',
      'Keep silver ball with you in purse',
      'Chandrama tratak on full moon (Gazing at moon on full moon)',
      'Grow white flowers in home',
      'Donate to widows',
      'Donate rice in Mandir or Gurdwara for bhandara',
      'Donate mishri to Mandir or Gurdwara for bhandara',
      'Donate milk',
      'Donate white clothes',
      'Jap of Om Namah Shivay'
    ],
    remediesHi: [
      'शिवलिंग पर कच्चा दूध व शुद्ध जल चढ़ाएँ',
      'चाँदी के चम्मच का प्रयोग करें',
      'पानी पीने के लिए चाँदी के गिलास या हरे रंग की बोतल का प्रयोग करें',
      'पर्स या जेब में ठोस चाँदी की छोटी गेंद रखें',
      'पूर्णिमा पर चंद्रमा त्राटक (दर्शन एवं ध्यान) करें',
      'घर में सफेद सुगंधित फूल उगाएँ',
      'विधवाओं एवं असहाय महिलाओं को दान करें',
      'मंदिर या गुरुद्वारे में लंगर हेतु चावल व मिश्री दान करें',
      'दूध एवं सफेद वस्त्रों का दान करें',
      'ॐ नमः शिवाय मंत्र का शांत मन से जाप करें'
    ],
    goodKarmasHi: 'शिव उपासना, असहाय महिलाओं/विधवाओं का सहयोग, चावल व दूध का दान।',
    livingPlanetsHi: 'माता, मौसी, सास एवं वृद्ध असहाय महिलाएं।',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 19
  },
  3: {
    number: 3,
    dayEn: 'Thursday',
    dayHi: 'गुरुवार',
    planetEn: 'Jupiter',
    planetHi: 'बृहस्पति / गुरु (Guru)',
    remediesEn: [
      'Grow banana tree in park/temple (outside house)',
      'Drink water with honey',
      'Help your Gurus in any way',
      'Put Kesar or Haldi tilak on forehead',
      'Donate yellow khichdi, kadi-rice, haldi, chane ki dal, yellow clothes, honey, ghee',
      'Feed cows with yellow channa dal',
      'Worship Lord Vishnu'
    ],
    remediesHi: [
      'पार्क या मंदिर में (घर के बाहर) केले का पौधा लगाएँ',
      'गुनगुने पानी में थोड़ा शहद मिलाकर पिएँ',
      'अपने गुरुओं, शिक्षकों और आचार्यों की सेवा व सहायता करें',
      'माथे पर केसर या शुद्ध हल्दी का तिलक लगाएँ',
      'पीली खिचड़ी, कढ़ी-चावल, हल्दी, चने की दाल, पीले वस्त्र, शहद व घी दान करें',
      'गायों को भीगी हुई पीली चने की दाल खिलाएँ',
      'भगवान विष्णु की नियमित पूजा व आराधना करें'
    ],
    goodKarmasHi: 'गुरु सेवा, विष्णु पूजन, पीली दाल व हल्दी का दान, गायों की सेवा।',
    livingPlanetsHi: 'गुरु, शिक्षक, मार्गदर्शक, वृद्ध विद्वान एवं ब्राह्मण।',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 20
  },
  4: {
    number: 4,
    dayEn: 'Saturday',
    dayHi: 'शनिवार',
    planetEn: 'Rahu',
    planetHi: 'राहु (Rahu)',
    remediesEn: [
      'Donate to sweepers',
      'Donate to handicap persons',
      'Keep your terrace clean, no iron items clutter',
      'Help your grand parents (father side)',
      'Keep sandalwood piece in your wallet/purse',
      'Clean your toilet yourself',
      'Donate cleaning items, thread and needle, black sesame (til) seeds, tea leaves (chaipatti)',
      'Worship Maa Saraswati Devi',
      'Read Hanuman Chalisa daily',
      'Feed dogs'
    ],
    remediesHi: [
      'सफाई कर्मचारियों एवं जरूरतमंदों को दान दें',
      'दिव्यांग / विकलांग व्यक्तियों की सहायता करें',
      'अपनी छत बिल्कुल साफ़ रखें, वहाँ कबाड़ या जंग लगा लोहा न रखें',
      'अपने दादा-दादी (पिता पक्ष) की सेवा और मदद करें',
      'अपने बटुए / पर्स में असली चंदन की लकड़ी का टुकड़ा रखें',
      'अपना शौचालय (Toilet) स्वयं साफ़ रखें',
      'सफ़ाई का सामान, धागा-सुई, काले तिल एवं चायपत्ती का दान करें',
      'माँ सरस्वती देवी की पूजा करें एवं प्रतिदिन हनुमान चालीसा पढ़ें',
      'कुत्तों को भोजन खिलाएँ'
    ],
    goodKarmasHi: 'सफाई कर्मचारियों की सहायता, छत की स्वच्छता, हनुमान चालीसा एवं पशु सेवा।',
    livingPlanetsHi: 'दादा-दादी, सफाईकर्मी एवं दिव्यांगजन।',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 22
  },
  5: {
    number: 5,
    dayEn: 'Wednesday',
    dayHi: 'बुधवार',
    planetEn: 'Mercury',
    planetHi: 'बुध (Budha)',
    remediesEn: [
      'Feed cow with green fodder',
      'Grow Tulsi plant at home',
      'Offer Ladoo prasad to Ganesh ji, specially on Wednesday',
      'Give green bangles to transgender',
      'Make small girls happy',
      'Donate to transgenders, donate hari mung dal, green clothes',
      'Help your daughter / Bua (father sister) / sister',
      'Gift your daughter / Bua or sister with green colour things'
    ],
    remediesHi: [
      'गाय को ताज़ा हरा चारा खिलाएँ',
      'घर में तुलसी का पौधा लगाएँ और सेवा करें',
      'बुधवार के दिन भगवान श्री गणेश जी को बेसन या मोदक के लड्डू का भोग लगाएँ',
      'किन्नरों को हरी चूड़ियाँ या वस्त्र भेंट करें एवं उनका आशीर्वाद लें',
      'छोटी कन्याओं को प्रसन्न रखें और उपहार दें',
      'हरी मूंग दाल एवं हरे वस्त्रों का दान करें',
      'अपनी बेटी, बुआ और बहन की सहायता करें और उन्हें हरे रंग की वस्तुएँ उपहार में दें'
    ],
    goodKarmasHi: 'तुलसी पूजन, गणेश वंदना, कन्या सेवा, हरी दाल दान एवं गौ-सेवा।',
    livingPlanetsHi: 'बेटी, बहन, बुआ एवं छोटी कन्याएँ।',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 23
  },
  6: {
    number: 6,
    dayEn: 'Friday',
    dayHi: 'शुक्रवार',
    planetEn: 'Venus',
    planetHi: 'शुक्र (Shukra)',
    remediesEn: [
      'Take bath with water mixed with Kewda essence',
      'Feed ants with white sugar/khand',
      'Donate to blind people or who have issue in one eye',
      'Worship Maha Laxmi',
      'Respect and help the females in your life, keep them happy',
      'Donate camphor (kapoor), batasha, curd, itra (perfume), sugar, milk, white clothes',
      'Donate white sweets on Friday (6 pieces)',
      'Donate vanilla ice-cream to poor children'
    ],
    remediesHi: [
      'केवड़ा सत्व मिले सुगंधित जल से स्नान करें',
      'चींटियों को सफेद चीनी अथवा खांड खिलाएँ',
      'नेत्रहीन व्यक्तियों या एक आँख की समस्या वाले लोगों की सहायता व दान करें',
      'माँ महालक्ष्मी जी की विधिवत पूजा व आराधना करें',
      'अपने जीवन की सभी महिलाओं (पत्नी, माता, पुत्री) का सम्मान करें और उन्हें प्रसन्न रखें',
      'कपूर, बताशा, दही, प्राकृतिक इत्र, चीनी, दूध एवं सफेद वस्त्र दान करें',
      'शुक्रवार को 6 पीस सफेद मिठाई मंदिर में या जरूरतमंदों को बाँटें',
      'गरीब बच्चों को वनीला आइसक्रीम खिलाएँ'
    ],
    goodKarmasHi: 'महालक्ष्मी पूजन, महिलाओं का सम्मान, दृष्टिहीनों की सहायता एवं सफेद पदार्थों का दान।',
    livingPlanetsHi: 'पत्नी, महिला सहकर्मी एवं कन्याएँ।',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 24
  },
  7: {
    number: 7,
    dayEn: 'Tuesday - Saturday',
    dayHi: 'मंगलवार - शनिवार',
    planetEn: 'Ketu',
    planetHi: 'केतु (Ketu)',
    remediesEn: [
      'Meditate for some time',
      'Donate urad chilka wali dal',
      'Donate to sweeper',
      'Help your grand parents (mother side)',
      'Donate to handicap persons',
      'Worship Lord Ganesh',
      'Learn occult science',
      'Avoid smoking and drinking',
      'Cut your foot nails, keep feet/toes clean',
      'Feed dogs'
    ],
    remediesHi: [
      'प्रतिदिन कुछ समय एकांत में ध्यान (Meditation) करें',
      'उड़द छिलका वाली दाल का दान करें',
      'सफाईकर्मियों एवं दिव्यांग व्यक्तियों को दान दें',
      'अपने नाना-नानी (माँ पक्ष) की सेवा और मदद करें',
      'भगवान श्री गणेश जी की नियमित पूजा करें',
      'गूढ़ विद्या, ज्योतिष या आध्यात्मिक ज्ञान का अध्ययन करें',
      'धूम्रपान और नशीले पदार्थों से पूर्ण परहेज़ रखें',
      'अपने पैरों व उंगलियों को हमेशा साफ़ रखें और समय पर नाखून काटें',
      'कुत्तों को भोजन खिलाएँ'
    ],
    goodKarmasHi: 'गणेश आराधना, मौन ध्यान, नाना-नानी की सेवा, कुत्तों को भोजन, स्वच्छता।',
    livingPlanetsHi: 'नाना-नानी, साधु-संत एवं स्ट्रीट डॉग्स।',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 26
  },
  8: {
    number: 8,
    dayEn: 'Saturday',
    dayHi: 'शनिवार',
    planetEn: 'Saturn',
    planetHi: 'शनि (Shani)',
    remediesEn: [
      'Donate sabut urad dal, iron items, sarso oil, leather items, black clothes',
      'Prepare Bengal gram in iron karahi/utensil with mustard oil and donate',
      'Offer water to Peepal tree',
      'Keep cobbler (mochi) happy',
      'Donate to labor class'
    ],
    remediesHi: [
      'साबुत उड़द दाल, लोहे की वस्तुएँ, सरसों का तेल, चमड़े की वस्तुएँ एवं काले वस्त्र दान करें',
      'लोहे की कड़ाही में सरसों के तेल में काले चने पकाकर गरीबों में बाँटें',
      'पीपल के वृक्ष पर प्रातःकाल जल चढ़ाएँ एवं सायंकाल सरसों के तेल का दीपक जलाएँ',
      'मोची (Cobbler) और श्रमजीवियों को उचित पारिश्रमिक दें और प्रसन्न रखें',
      'मजदूर वर्ग व सहायकों को दान व सहयोग दें'
    ],
    goodKarmasHi: 'श्रमिक वर्ग की सहायता, पीपल पूजन, सरसों का तेल व काले चने का दान।',
    livingPlanetsHi: 'श्रमिक, मजदूर, सेवक एवं मोची।',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 27
  },
  9: {
    number: 9,
    dayEn: 'Tuesday',
    dayHi: 'मंगलवार',
    planetEn: 'Mars',
    planetHi: 'मंगल (Mangal)',
    remediesEn: [
      'Offer services to Hanuman temple',
      'Donate bundi prasad',
      'Donate red masoor dal, brass items, red clothes',
      'Donate blood (blood remedy / rakt nivarak)',
      'Recite Hanuman Chalisa',
      'Recite Ram Stuti'
    ],
    remediesHi: [
      'हनुमान मंदिर में नियमित दर्शन, सेवा और प्रार्थना करें',
      'मंगलवार को बूंदी का प्रसाद चढ़ाकर भक्तों में बाँटें',
      'लाल मसूर की दाल, पीतल की वस्तुएँ और लाल रंग के वस्त्र दान करें',
      'वर्ष में कम से कम एक बार रक्तदान करें (रक्त दोष निवारक उपाय)',
      'प्रतिदिन श्रद्धापूर्वक हनुमान चालीसा का पाठ करें',
      'श्री राम स्तुति (श्री रामचंद्र कृपालु भजु मन) का पाठ करें'
    ],
    goodKarmasHi: 'हनुमान आराधना, रक्तदान, बूंदी प्रसाद व लाल मसूर दाल का दान।',
    livingPlanetsHi: 'छोटे भाई, सैनिक, पुलिसकर्मी एवं रक्त संबंधी।',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 28
  }
};

export type DashaCompatibilityType = 'SUPPORTIVE' | 'NEUTRAL' | 'CHALLENGING';

export interface DashaCompatibilityResult {
  mahadashaLord: number;
  antardashaLord: number;
  status: DashaCompatibilityType;
  statusHi: string;
  relationshipName: string;
  explanationHi: string;
  adviceHi: string;
  sourceDocument: string;
  pageNumber: number;
}

// Classical and Course Friendly/Neutral/Enemy planetary relations
const PLANETARY_FRIENDS: Record<number, number[]> = {
  1: [2, 3, 9],       // Sun friends: Moon, Jupiter, Mars
  2: [1, 5],          // Moon friends: Sun, Mercury
  3: [1, 2, 9],       // Jupiter friends: Sun, Moon, Mars
  4: [5, 6, 8],       // Rahu friends: Mercury, Venus, Saturn
  5: [1, 6],          // Mercury friends: Sun, Venus
  6: [4, 5, 8],       // Venus friends: Rahu, Mercury, Saturn
  7: [2, 9],          // Ketu friends: Moon, Mars
  8: [4, 5, 6],       // Saturn friends: Rahu, Mercury, Venus
  9: [1, 2, 3]        // Mars friends: Sun, Moon, Jupiter
};

const PLANETARY_ENEMIES: Record<number, number[]> = {
  1: [6, 8, 4],       // Sun enemies: Venus, Saturn, Rahu
  2: [4, 8, 9],       // Moon enemies: Rahu, Saturn, Mars
  3: [6, 7],          // Jupiter enemies: Venus, Ketu
  4: [1, 2, 9],       // Rahu enemies: Sun, Moon, Mars
  5: [3, 9],          // Mercury enemies: Jupiter, Mars
  6: [1, 2, 3],       // Venus enemies: Sun, Moon, Jupiter
  7: [1, 4, 8],       // Ketu enemies: Sun, Rahu, Saturn
  8: [1, 2, 9],       // Saturn enemies: Sun, Moon, Mars
  9: [4, 8, 6]        // Mars enemies: Rahu, Saturn, Venus
};

export function getDashaCompatibility(mahaLord: number, antarLord: number): DashaCompatibilityResult {
  if (mahaLord === antarLord) {
    return {
      mahadashaLord: mahaLord,
      antardashaLord: antarLord,
      status: 'SUPPORTIVE',
      statusHi: 'अति अनुकूल (Harmonious Same Vibration)',
      relationshipName: 'स्व-ग्रहीय तादात्म्य (Same Planet Resonance)',
      explanationHi: `महादशा और अंतर्दशा दोनों स्वामी अंक ${mahaLord} हैं। इस अवधि में उस ग्रह के मूल गुण, महत्वाकांक्षा और जीवन-लक्ष्य पूरी तीव्रता से प्रकट होते हैं।`,
      adviceHi: 'इस अवधि में संबंधित ग्रह के विशिष्ट नियमों और सात्विक आहार का निष्ठापूर्वक पालन करें।',
      sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
      pageNumber: 2
    };
  }

  const isFriend = (PLANETARY_FRIENDS[mahaLord] || []).includes(antarLord);
  const isEnemy = (PLANETARY_ENEMIES[mahaLord] || []).includes(antarLord);

  if (isFriend) {
    return {
      mahadashaLord: mahaLord,
      antardashaLord: antarLord,
      status: 'SUPPORTIVE',
      statusHi: 'अनुकूल एवं सहयोगी (Supportive / Mitra)',
      relationshipName: 'मित्र ग्रहीय सामंजस्य (Friendly Planetary Synergy)',
      explanationHi: `महादशा स्वामी अंक ${mahaLord} और अंतर्दशा स्वामी अंक ${antarLord} आपस में मित्र भाव रखते हैं। यह समय कार्यों में सहज प्रगति, सहयोग और मानसिक संतुष्टि का माना जाता है।`,
      adviceHi: 'सकारात्मक अवसरों का लाभ उठाएं और रचनात्मक कार्यों में ऊर्जा लगाएं।',
      sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
      pageNumber: 2
    };
  }

  if (isEnemy) {
    return {
      mahadashaLord: mahaLord,
      antardashaLord: antarLord,
      status: 'CHALLENGING',
      statusHi: 'सतर्कता एवं सावधानी (Challenging / Shatru)',
      relationshipName: 'विरोधी ग्रहीय दबाव (Conflicting Planetary Influences)',
      explanationHi: `महादशा स्वामी अंक ${mahaLord} और अंतर्दशा स्वामी अंक ${antarLord} के बीच ऊर्जा का तीव्र अंतर है। यह समय निर्णय लेने में धैर्य, स्वास्थ्य के प्रति सतर्कता और संयमित आचरण की मांग करता है।`,
      adviceHi: 'वाद-विवाद से बचें, गरिष्ठ भोजन का त्याग करें और संबंधित वैदिक उपायों का नियमित पालन करें।',
      sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
      pageNumber: 2
    };
  }

  return {
    mahadashaLord: mahaLord,
    antardashaLord: antarLord,
    status: 'NEUTRAL',
    statusHi: 'संतुलित एवं सामान्य (Neutral / Sama)',
    relationshipName: 'सम ग्रहीय संबंध (Neutral Steady Balance)',
    explanationHi: `महादशा स्वामी अंक ${mahaLord} और अंतर्दशा स्वामी अंक ${antarLord} परस्पर सम भाव में हैं। जीवन में स्थिरता बनी रहेगी और परिणाम आपके निजी परिश्रम पर निर्भर करेंगे।`,
    adviceHi: 'नियमित दिनचर्या बनाए रखें और अपने निर्धारित लक्ष्यों पर ध्यान केंद्रित रखें।',
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 2
  };
}
