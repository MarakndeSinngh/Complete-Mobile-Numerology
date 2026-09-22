import { DOBAnalysis, NameAnalysis, MobileAnalysis, remediesAdvice } from '../types';
import { getCompoundDetails, CompoundInterpretation } from './compoundDatabase';
import { computeLoshuAnalysis } from './loshuEngine';
import { calculateAdvancedCompatibility, AdvancedCompatibilityReport } from './compatibilityKnowledgeBase';

export interface FullConsultationReport {
  summary: string;
  birthDetailNotes: string;
  driverConductorSync: string;
  compoundFrequencies: string;
  loshuGridAudit: string;
  arrowsInsight: string;
  missingNumbersRemedies: string;
  destinedCareerPath: string;
  financialVastuVibe: string;
  gemstoneRecommendation: string;
  remedyActionPlan: string;
  longTermForecast: string;
  consultantClosingNotes: string;
}

export function generateFullConsultationReport(
  name: string,
  dob: string,
  mobile: string
): FullConsultationReport {
  // Pre-calculations
  const parts = dob.split('-');
  const year = parseInt(parts[0], 10) || 1990;
  const month = parseInt(parts[1], 10) || 1;
  const day = parseInt(parts[2], 10) || 1;

  // Reduced parts
  const d1 = Math.floor(day / 10);
  const d2 = day % 10;

  // Roots
  let rDay = day;
  while (rDay > 9) {
    rDay = rDay.toString().split('').reduce((acc, x) => acc + parseInt(x, 10), 0);
  }

  const cleanDob = dob.replace(/[^0-9]/g, '');
  let rCond = cleanDob.split('').reduce((acc, x) => acc + parseInt(x, 10), 0);
  while (rCond > 9) {
    rCond = rCond.toString().split('').reduce((acc, x) => acc + parseInt(x, 10), 0);
  }

  // Get compound details
  const compDetails = getCompoundDetails(day);
  const lGrid = computeLoshuAnalysis(dob, name);

  // Derive driver & conductor planetary names
  const planets: Record<number, string> = {
    1: 'Sun (सूर्य) - Power, Authority, Leadership, Sovereign Soul',
    2: 'Moon (चंद्र) - Emotion, Partnership, Intuitive Creative Pulse',
    3: 'Jupiter (गुरु) - Wisdom, Councils, Academic Expansion, Devotion',
    4: 'Rahu (राहु) - Sudden Vision, Material Tactics, Unorthodox Speed',
    5: 'Mercury (बुध) - Smart Commerce, Public Relations, Multi-tasking Speed',
    6: 'Venus (शुक्र) - Luxury, Brand Magnetism, Fine Arts, Domestic Bliss',
    7: 'Ketu (केतु) - Analytical Depth, Astrological Eye, Detachment',
    8: 'Saturn (शनि) - Systematic Execution, Legacy Structuring, Delays',
    9: 'Mars (मंगल) - Fire Dynamics, Direct Courage, Surgical Precision'
  };

  const drPlanet = planets[rDay] || 'Sun (सूर्य)';
  const coPlanet = planets[rCond] || 'Jupiter (गुरु)';

  // 1. SUMMARY
  const summary = `अनुभवी भारतीय अंकशास्त्रीय विश्लेषण, जिसे विशेष रूप से ${name} के लिए तैयार किया गया है। आपका जन्म ${day} तारीख (मूलांक ${rDay}) को हुआ है और आपका भाग्यांक (Conductor) ${rCond} है। आपके मुख्य व्यक्तित्व को ${drPlanet} (Driver) दिशा दे रहे हैं और आपके जीवन पथ को ${coPlanet} (Conductor / भाग्यांक) का मार्गदर्शन प्राप्त है। यह संयोजन आपके प्रशासनिक कौशल, कार्यशैली, रिश्तों और धनोपार्जन की क्षमता को गहरा प्रभाव प्रदान करता है।`;

  // 2. BIRTH DETAIL NOTES
  const birthDetailNotes = `पारम्परिक अंकशास्त्र के अनुसार आपकी जन्म तारीख ${day} है। आपका जीवन कम्पाउंड संख्या ${day} के प्रभाव में आता है। ${
    day > 9 
      ? `चूँकि आपकी जन्म तारीख एक दोहरा अंक (${day}) है, इसलिए आप केवल एकल मूलांक ${rDay} तक सीमित नहीं हैं। आपके जीवन पर अंक ${d1} और अंक ${d2} दोनों की सम्मिलित ऊर्जाओं का गहरा प्रभाव रहता है। आपकी हर कार्यशैली में यह दोहरा प्रभाव दिखता है, जो आपको विशिष्ट अवसर और रणनीतिक लाभ प्रदान करता है।`
      : `चूँकि आपका जन्म एकल अंक (${day}) के दिन हुआ है, इसलिए आपका ग्रह प्रभाव अत्यंत स्पष्ट और शुद्ध है। आप अपने स्वामी ग्रह ${drPlanet} के प्रत्यक्ष और मौलिक गुणों को अपने दैनिक जीवन व निर्णय क्षमता में पूर्ण रूप से अभिव्यक्त करते हैं।`
  } सही नाम की स्पेलिंग और हस्ताक्षर (Signature) के साथ तालमेल बिठाकर आप जीवन में असाधारण सफलता प्राप्त कर सकते हैं।`;

  // 3. DRIVER CONDUCTOR SYNC
  const syncs: Record<number, Record<number, string>> = {
    1: {
      1: 'सूर्य-सूर्य संगम: अत्यधिक प्रशासनिक अधिकार और नेतृत्व। दूसरों के अधीन काम करना कठिन। पूर्ण रूप से स्वतंत्र व्यवसाय या उच्च पद के अनुकूल।',
      5: 'सूर्य-बुध तालमेल: व्यापार, कम्युनिकेशन और कॉरपोरेट क्षेत्र में जबरदस्त सफलता। धन आगमन के निरंतर सुगम मार्ग।',
      8: 'सूर्य-शनि द्वंद्व: कार्यों में अप्रत्याशित विलंब, पिता या वरिष्ठ अधिकारियों से मतभेद। शनिवार को सरसों के तेल के उपाय और धैर्य आवश्यक।',
    },
    5: {
      6: 'बुध-शुक्र संगम: भौतिक समृद्धि, ब्रांडिंग, लग्जरी और मीडिया में असाधारण सफलता। समाज में विशेष आकर्षण और मान-सम्मान।',
      9: 'बुध-मंगल ऊर्जा: त्वरित निर्णय, तेज वाणी और प्रभावशाली मार्केटिंग क्षमता। जल्दबाजी और क्रोध पर नियंत्रण रखें।'
    }
  };

  const syncText = syncs[rDay]?.[rCond] || 
    `Driver ${rDay} और Conductor ${rCond} का यह संबंध एक संतुलित और सहयोगी प्रवाह का निर्माण करता है। आपका Driver ${rDay} आपकी दैनिक कार्यशैली तय करता है, जबकि Conductor ${rCond} आपके जीवन के दीर्घकालिक लक्ष्यों को दिशा देता है। 34 वर्ष की आयु के आसपास यह तालमेल पूर्ण स्थिरता प्रदान करता है।`;

  // 4. COMPOUND FREQUENCIES
  const compoundFrequencies = `आपकी जन्म तारीख के कम्पाउंड नंबर ${day} का विश्लेषण:
  - शीर्षक: ${compDetails.title}
  - मुख्य प्रभाव: ${compDetails.meaning}
  - भविष्य का संकेत: ${compDetails.prediction}
  - मुख्य विशेषताएं: ${compDetails.positiveTraits.join(', ')}
  - सावधानियां: ${compDetails.negativeTraits.join(', ')}`;

  // 5. LOS HU GRID AUDIT
  const gridDigits = Object.values(lGrid.loshuGrid).filter(box => box.count > 0).map(box => box.digit);
  const presentNums = gridDigits.join(', ');
  const loshuGridAudit = `आपके Lo Shu Grid में सक्रिय अंक हैं: [${presentNums}]। प्रमुख विश्लेषण:
  ${gridDigits.includes(4) && gridDigits.includes(9) && gridDigits.includes(2) ? '✓ सक्रिय Mental Plane (4,9,2): कुशाग्र स्मरण शक्ति, तीव्र तार्किक क्षमता और उत्कृष्ट रणनीतिक सोच।' : '✗ Mental Plane में कुछ अंक रिक्त: सूक्ष्म विवरणों को व्यवस्थित रखने के लिए डायरी या डिजिटल नोट्स का उपयोग लाभकारी रहेगा।'}
  ${gridDigits.includes(3) && gridDigits.includes(5) && gridDigits.includes(7) ? '✓ सक्रिय Emotional Plane (3,5,7): गहरी अंतर्दृष्टि, संवेदनशीलता, चुंबकीय संवाद शैली और जन-सहानुभूति।' : '✗ Emotional Plane में कुछ अंक रिक्त: भावनाओं की अपेक्षा व्यावहारिक व तार्किक निर्णयों को अधिक प्राथमिकता देते हैं।'}
  ${gridDigits.includes(8) && gridDigits.includes(1) && gridDigits.includes(6) ? '✓ सक्रिय Practical Plane (8,1,6): उत्कृष्ट व्यावहारिक समझ, मजबूत व्यावसायिक प्रबंधन और जमीनी क्रियान्वयन क्षमता।' : '✗ Practical Plane में कुछ अंक रिक्त: विचारों को समयबद्ध क्रियान्वयन में बदलने के लिए नियमित अनुशासन और दिनचर्या आवश्यक है।'}`;

  // 6. ARROWS INSIGHT
  const arrowInsightText = lGrid.strengthArrows.length > 0
    ? `आपके Lo Shu Grid में ${lGrid.strengthArrows.length} शक्तिशाली और शुभ योग (Arrows of Strength) बन रहे हैं: ${lGrid.strengthArrows.map(a => a.name).join(', ')}। भारतीय अंकशास्त्र में ये ऊर्जा के मजबूत चैनल माने जाते हैं, जो जीवन में निरंतर प्रगति और प्रतिष्ठा दिलाते हैं। जैसे- ${lGrid.strengthArrows[0]?.description || 'संतुलित ऊर्जा'}।`
    : `आपके Lo Shu Grid में कोई पूर्ण प्राथमिक एरो (Arrow) नहीं बन रहा है। इसका तात्पर्य है कि आप जीवन में किसी तय ढर्रे के बजाय अपने व्यक्तिगत संघर्ष, व्यावहारिक अनुभव और बहुमुखी प्रतिभा के बल पर अपनी पहचान बनाएंगे।`;

  // 7. MISSING NUMBERS REMEDIES
  const missingDigits = lGrid.missingNumbers.map(item => item.digit);
  const missingString = missingDigits.join(', ');
  const missingDetails = lGrid.missingNumbers.map(item => {
    const n = item.digit;
    const missReds: Record<number, string> = {
      2: 'मिसिंग 2 (चंद्रमा): मानसिक अकेलापन और बेचैनी। उपाय: चांदी के बर्तन में जल पिएं और पूर्णिमा को ध्यान करें।',
      3: 'मिसिंग 3 (गुरु): ज्ञान और मार्गदर्शन में कमी। उपाय: गुरुवार को माथे पर केसर या हल्दी का तिलक लगाएं।',
      4: 'मिसिंग 4 (राहु): अचानक वित्तीय रुकावटें और योजना की कमी। उपाय: कार्यस्थल पर ठोस लकड़ी की वस्तु या हरा पेन रखें।',
      5: 'मिसिंग 5 (बुध): व्यापारिक अस्थिरता और संवाद में झिझक। उपाय: बुधवार को गाय को हरा चारा खिलाएं और तुलसी का पौधा लगाएं।',
      6: 'मिसिंग 6 (शुक्र): भौतिक सुखों और पारिवारिक सहयोग में कमी। उपाय: घर के मुख्य द्वार पर चंदन या गुलाब का इत्र छिड़कें।',
      7: 'मिसिंग 7 (केतु): शोध और विश्लेषणात्मक समर्थन में कमी। उपाय: मंगलवार को कुत्तों को मीठी रोटी या बिस्कुट खिलाएं।',
      8: 'मिसिंग 8 (शनि): अचल संपत्ति और स्थायित्व में देरी। उपाय: शनिवार की शाम पीपल के पेड़ के नीचे तिल या सरसों के तेल का दीपक जलाएं।',
      9: 'मिसिंग 9 (मंगल): उत्साह और ऊर्जा में कमी। उपाय: दाहिनी कलाई पर लाल कलावा या तांबे का कड़ा धारण करें।'
    };
    return missReds[n] || `मिसिंग ${n}: इष्ट मंत्र का शांत मन से जप करें।`;
  }).join('\n  ');

  const missingNumbersRemedies = `आपके ग्रिड में ये रिक्त अंक हैं: [${missingString}]। अंकशास्त्र में रिक्त अंक उन क्षेत्रों को दर्शाते हैं जहां संतुलन और ऊर्जा उपाय आवश्यक हैं:
  ${missingDetails}`;

  // 8. ALIGNED CAREER PATH
  const destinedCareerPath = `आपके Driver ${rDay} और Conductor (भाग्यांक) ${rCond} के संयोजन के अनुसार सर्वोत्तम करियर क्षेत्र:
  - मुख्य क्षेत्र: ${compDetails.careerImpact}
  - द्वितीयक क्षेत्र: ${rDay === 1 || rCond === 1 ? 'प्रशासनिक सेवाएं, सरकारी अनुबंध, कॉरपोरेट लीडरशिप, उच्च प्रबंधन' : 
                          rDay === 5 || rCond === 5 ? 'व्यापार, सॉफ्टवेयर व आईटी, शेयर बाजार, मीडिया, जनसंपर्क और कंसल्टेंसी' : 
                          rDay === 6 || rCond === 6 ? 'लग्जरी उत्पाद, फैशन, इंटीरियर डिजाइनिंग, रियल एस्टेट, हॉस्पिटैलिटी' : 
                          'औद्योगिक निर्माण, तकनीकी शिक्षा, ऑडिटिंग एवं प्रणाली सुरक्षा'}`;

  // 9. FINANCIAL VASTU VIBE
  const financialVastuVibe = `अपने कार्यस्थल और घर की आर्थिक ऊर्जा को वास्तु अनुसार बढ़ाने के उपाय:
  - मुख्य धन दिशा: दक्षिण-पूर्व (शुक्र - आग्नेय कोण) और उत्तर दिशा (कुबेर व बुध)। इन दोनों कोनों को साफ-सुथरा रखें और भारी कबाड़ या लाल डस्टबिन न रखें।
  - शुभ कार्य दिशा: ${compDetails.luckyElements.direction}। महत्वपूर्ण क्लाइंट मीटिंग्स या वित्तीय निर्णय लेते समय इसी दिशा की ओर मुख करें।
  - डेस्क व्यवस्था: उत्तर दिशा में एक सुंदर हरा पौधा (Money Plant आदि) रखने से नए अवसर और ग्राहक निरंतर आकर्षित होते हैं।`;

  // 10. GEMSTONE ENGINE
  const primaryGem = getPrimaryGemstone(rDay);
  const secondaryGem = getSecondaryGemstone(rCond);
  const gemstoneRecommendation = `अंकशास्त्रीय एवं ग्रहीय संतुलन हेतु आपके लिए उपयुक्त रत्न (Gemstones):
  - मुख्य रत्न (Primary Gemstone): ${primaryGem.name} (आभामंडल और ऊर्जा सुरक्षा)
    * धारण विधि: ${primaryGem.whenWear}
    * मुख्य लाभ: ${primaryGem.benefit}
    * विशेष सावधानी: ${primaryGem.warning}
  - सहायक रत्न (Secondary Gemstone): ${secondaryGem.name} (भाग्य अवरोध दूर करने हेतु)
    * धारण विधि: ${secondaryGem.whenWear}
    * मुख्य लाभ: ${secondaryGem.benefit}`;

  // 11. REMEDY ACTION PLAN
  const remedyActionPlan = `आपका 30-दिवसीय सरल उपाय एवं कार्य योजना (Action Plan):
  1. शुभ रंग (Lucky Color): महत्वपूर्ण बैठकों और अनुबंधों के दौरान अपने परिधान में ${compDetails.luckyElements.color} रंग शामिल करें।
  2. सकारात्मक हस्ताक्षर (Signature): अपने हस्ताक्षर को 15 डिग्री ऊपर की ओर उठाव दें। नीचे एक सरल रेखा खींचें और अंत में कभी भी फुल-स्टॉप (Dot) न लगाएं।
  3. साप्ताहिक व्रत/संयम: अपने स्वामी ग्रह की अनुकूलता के लिए ${compDetails.luckyElements.day}वार को हल्का व सात्विक भोजन ग्रहण करें।
  4. दैनिक मंत्र: प्रातःकाल सूर्योदय के समय ${getPlanetName(rDay)} के बीज मंत्र का 108 बार शांत भाव से जप करें।`;

  // 12. LONG-TERM FORECAST
  const longTermForecast = `व्यक्तिगत वर्ष चक्र (Personal Year 2026) के अनुसार यह वर्ष नई नींव रखने, संपर्कों के विस्तार और योजनाबद्ध प्रगति का काल है। 2027 के उत्तरार्ध तक आपके करियर में एक महत्वपूर्ण उपलब्धि दर्ज होगी। शनिवार की शाम लंबी व्यावसायिक यात्राओं से बचें और उन साझेदारों को प्राथमिकता दें जिनका मूलांक 1, 5 या 6 हो।`;

  // 13. CONSULTANT CLOSING NOTES
  const consultantClosingNotes = `अंकशास्त्रीय परामर्श का सार: अंक आपके भाग्य की सीमाओं को नहीं बांधते, बल्कि वे केवल खगोलीय दिशा-निर्देश प्रस्तुत करते हैं। अपने नाम की स्पेलिंग को मित्र अंक 5 (बुध) या 6 (शुक्र) पर संतुलित करके और नियमित दिनचर्या का पालन करके आप 90% बाधाओं को दूर कर सकते हैं। ईश्वर आपको सुख, समृद्धि और अटूट शांति प्रदान करे!`;

  return {
    summary,
    birthDetailNotes,
    driverConductorSync: syncText,
    compoundFrequencies,
    loshuGridAudit,
    arrowsInsight: arrowInsightText,
    missingNumbersRemedies,
    destinedCareerPath,
    financialVastuVibe,
    gemstoneRecommendation,
    remedyActionPlan,
    longTermForecast,
    consultantClosingNotes
  };
}

function getPlanetName(num: number): string {
  const ps: Record<number, string> = {
    1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercury', 6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars'
  };
  return ps[num] || 'Sovereign';
}

function getPrimaryGemstone(root: number): { name: string; benefit: string; whenWear: string; warning: string } {
  const gems: Record<number, { name: string; benefit: string; whenWear: string; warning: string }> = {
    1: { name: 'Ruby (माणिक्य - 4.5 रत्ती सोने या तांबे में)', benefit: 'नेतृत्व क्षमता और आत्मविश्वास बढ़ाता है, नेत्र विकारों को दूर कर मान-सम्मान दिलाता है।', whenWear: 'रविवार प्रातः सूर्योदय के समय तर्जनी या अनामिका उंगली में।', warning: 'नीलम या हीरे के साथ कभी न पहनें।' },
    2: { name: 'Natural Pearl (मोती - 5 रत्ती चांदी में)', benefit: 'भावनात्मक संतुलन लाता है, मानसिक तनाव शांत कर अच्छी नींद प्रदान करता है।', whenWear: 'सोमवार प्रातः कनिष्ठिका (छोटी उंगली) में।', warning: 'अत्यधिक कफ या श्वास विकार के समय परहेज करें।' },
    3: { name: 'Yellow Sapphire (पुखराज - 5 रत्ती सोने में)', benefit: 'उच्च शिक्षा में सफलता, आध्यात्मिक विवेक और योग्य मार्गदर्शकों का सहयोग दिलाता है।', whenWear: 'गुरुवार प्रातः तर्जनी उंगली में।', warning: 'सुनिश्चित करें कि रत्न में कोई काला धब्बा या दरार न हो।' },
    4: { name: 'Hessonite (गोमेद - 4 रत्ती चांदी में)', benefit: 'अचानक तकनीकी रुकावटों और भ्रम को दूर कर रातों-रात अप्रत्याशित सफलता देता है।', whenWear: 'शनिवार सूर्यास्त के बाद मध्यमा उंगली में।', warning: 'मूलांक 9 वालों को बिना परामर्श नहीं पहनना चाहिए।' },
    5: { name: 'Emerald (पन्ना - 4 रत्ती सोने या चांदी में)', benefit: 'कुशाग्र बुद्धि, वाक्पटुता, व्यापारिक गणना और व्यापार में भारी लाभ दिलाता है।', whenWear: 'बुधवार प्रातः कनिष्ठिका उंगली में।', warning: 'पहनने से पूर्व कच्चे दूध और गंगाजल से शुद्ध करें।' },
    6: { name: 'Diamond / Opal (0.5 कैरट या ओपल चांदी/सोने में)', benefit: 'ब्रांड वैल्यू बढ़ाता है, भौतिक सुख-साधनों और दांपत्य जीवन में आकर्षण व मधुरता लाता है।', whenWear: 'शुक्रवार सूर्योदय के समय अनामिका उंगली में।', warning: 'अत्यधिक अहंकार या ईगो होने पर सावधानी रखें।' },
    7: { name: 'Cat’s Eye (लहसुनिया - 4 रत्ती चांदी में)', benefit: 'गुप्त शत्रुओं से रक्षा, आध्यात्मिक एकाग्रता और दुर्घटनाओं से सुरक्षा देता है।', whenWear: 'मंगलवार देर शाम मध्यमा उंगली में।', warning: 'माणिक्य या मूंगा के साथ कभी धारण न करें।' },
    8: { name: 'Blue Sapphire (नीलम - 3 रत्ती पंचधातु या चांदी में)', benefit: 'अचल संपत्ति लाभ, तीव्र न्याय, कानूनी सुरक्षा और अनुशासित प्रगति कराता है।', whenWear: 'शनिवार सूर्यास्त के समय मध्यमा उंगली में।', warning: 'विशेष सावधानी: धारण करने से पूर्व 3 दिन तक तकिए के नीचे रखकर परीक्षण अवश्य करें।' },
    9: { name: 'Red Coral (मूंगा - 6 रत्ती तांबे या सोने में)', benefit: 'शारीरिक ऊर्जा और साहस में वृद्धि, आलस्य निवारण और प्रशासनिक कार्यों में सफलता।', whenWear: 'मंगलवार प्रातः सूर्योदय के समय अनामिका उंगली में।', warning: 'अत्यधिक उच्च रक्तचाप की स्थिति में योग्य सलाह लें।' }
  };
  return gems[root] || gems[1];
}

function getSecondaryGemstone(root: number): { name: string; benefit: string; whenWear: string } {
  const gems: Record<number, { name: string; benefit: string; whenWear: string }> = {
    1: { name: 'Red Garnet (गार्नेट)', benefit: 'शारीरिक स्फूर्ति और आत्मविश्वास बढ़ाता है।', whenWear: 'रविवार प्रातः' },
    2: { name: 'Moonstone (मूनस्टोन)', benefit: 'मानसिक तनाव शांत करता है और अंतर्ज्ञान को जगाता है।', whenWear: 'सोमवार प्रातः' },
    3: { name: 'Yellow Topaz (सुनहला)', benefit: 'स्थिर आर्थिक लाभ और वित्तीय दस्तावेजों की सुरक्षा करता है।', whenWear: 'गुरुवार प्रातः' },
    4: { name: 'Amber (अंबर)', benefit: 'लंबी यात्राओं में ऊर्जा और सजगता बनाए रखता है।', whenWear: 'शनिवार' },
    5: { name: 'Green Jade (ग्रीन जेड)', benefit: 'उत्कृष्ट व्यापारिक गणना और रिटेल बिक्री में सौभाग्य देता है।', whenWear: 'बुधवार प्रातः' },
    6: { name: 'White Zircon (सफेद जरकन)', benefit: 'ब्रांड प्रस्तुति और आकर्षण क्षमता को बढ़ाता है।', whenWear: 'शुक्रवार सूर्योदय' },
    7: { name: 'Tiger Eye (टाइगर आई)', benefit: 'एकाग्रता बढ़ाता है और नजर दोष से सुरक्षा प्रदान करता है।', whenWear: 'मंगलवार' },
    8: { name: 'Iolite (नीली)', benefit: 'अटके कार्यों में गति लाता है और जोड़ों को राहत देता है।', whenWear: 'शनिवार सूर्यास्त' },
    9: { name: 'Carnelian (कार्नेलियन)', benefit: 'शरीर में नई ऊर्जा और निर्भीक साहस का संचार करता है।', whenWear: 'मंगलवार सूर्योदय' }
  };
  return gems[root] || gems[5];
}
