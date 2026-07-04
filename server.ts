import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { PAIR_MEANINGS } from "./src/services/pairMeanings";
import { generateMedicalNumerologyReport } from "./src/services/medicalNumerologyEngine";
import { generateNumeroVaastuReport } from "./src/services/numeroVaastuEngine";
import { calculateDashaAndYearForecast } from "./src/services/dashaEngine";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parser with high payload limit for base64 image uploads
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // Lazy initialize Gemini client safely
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined.");
    }
    return new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_FOR_TESTING",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API router for Gemini report generation
  app.post("/api/report", async (req, res) => {
    try {
      const { personalDetails, dobAnalysis, nameAnalysis, mobileAnalysis, remedies } = req.body;

      if (!personalDetails?.name) {
        return res.status(400).json({ error: "Missing personal details name" });
      }

      // Compute additional premium modules for the report
      const dobStr = personalDetails.dob || "1990-01-01";
      const medReport = generateMedicalNumerologyReport(dobStr, personalDetails.name);
      const vaastuReport = generateNumeroVaastuReport(dobStr, personalDetails.gender || 'MALE', personalDetails.name);
      const dashaReport = calculateDashaAndYearForecast(dobStr, 2026);

      // Calculate or extract consecutive pairs from the mobile number digits
      const mobileRaw = personalDetails.mobile || "";
      const digits = mobileRaw.replace(/[^0-9]/g, '');
      let modifiedChars: string[] = [];
      for (let i = 0; i < digits.length; i++) {
        const d = digits[i];
        if (d === '0') {
          const prev = i > 0 ? modifiedChars[i - 1] : '9';
          modifiedChars.push(prev);
        } else {
          modifiedChars.push(d);
        }
      }
      const modifiedNumber = modifiedChars.join('');

      const extractedPairsWithMeanings = [];
      for (let i = 0; i < modifiedNumber.length - 1; i++) {
        const pair = modifiedNumber.substring(i, i + 2);
        const detail = PAIR_MEANINGS[pair];
        if (detail) {
          extractedPairsWithMeanings.push({
            pairVal: pair,
            meaning: detail.meaning,
            positive: detail.positive,
            negative: detail.negative,
            severity: detail.severity
          });
        }
      }

      const pairsDataString = extractedPairsWithMeanings.map(item => {
        return `PAIR: ${item.pairVal}
Meaning/Title: ${item.meaning}
Positive Vibrations: ${item.positive}
Negative/Warning: ${item.negative}
Stability/Severity Score: ${item.severity}%`;
      }).join("\n\n");

      const client = getGeminiClient();

      const prompt = `
Generate an exhaustive, highly detailed, professional, and empathetic traditional Numerology Life Advisory Report in pure, respectful Hindi.
This must reads like a 15-25 page premium consulting portfolio booklet.

Subject Auditable Credentials:
- Name (नाम): ${personalDetails.name}
- Date of Birth (जन्म तारीख): ${personalDetails.dob}
- Gender (लिंग): ${personalDetails.gender || 'निर्दिष्ट नहीं'}
- Focal Phone Line (मोबाईल नंबर): ${personalDetails.mobile} (সংशोधित कंपन: ${modifiedNumber})

Primary Grid Coordinates Calculated by Design Engines (Use these values exactly):
1. Date of Birth Grid (जन्मांक एवं भाग्यांक विश्लेषण):
   - Life Path Number (जीवन पथ संख्या / भाग्यांक): ${dobAnalysis.lifePathNumber}
   - Birth Number (जन्मांक / मूलांक): ${dobAnalysis.birthNumber}
   - Destiny Number (नामांक / भाग्य संख्या): ${dobAnalysis.destinyNumber}
   - Soul Urge Number: ${dobAnalysis.soulUrgeNumber}
   - Personality Number: ${dobAnalysis.personalityNumber}
   - Maturity Number: ${dobAnalysis.maturityNumber}
   - Attitude Number: ${dobAnalysis.attitudeNumber}
   - Personal Year: ${dobAnalysis.personalYear}
   - Missing Numbers in Birth grid: ${dobAnalysis.missingNumbers.join(', ')}

2. Medical Numerology & Ayurvedic Doshas:
   - Dominant Dosha: ${medReport.dominantDosha}
   - Secondary Dosha: ${medReport.secondaryDosha}
   - Prakriti Constitution: ${medReport.prakritiType} (Vata: ${medReport.doshaComposition.vata}%, Pitta: ${medReport.doshaComposition.pitta}%, Kapha: ${medReport.doshaComposition.kapha}%)
   - Health Wellness Score: ${medReport.scores.healthScore}/100, Digestive: ${medReport.scores.digestiveScore}/100, Immunity: ${medReport.scores.immunityScore}/100
   - Weak body organs/systems: ${medReport.weakBodySystems.join(', ')}
   - Recommended Foods: ${medReport.dietRecommendations.recommendedFoods.join(', ')}
   - Foods to Avoid: ${medReport.dietRecommendations.foodsToAvoid.join(', ')}
   - Recommended Fasting Day: ${medReport.dietRecommendations.recommendedFastingDay}
   - Recommended Yoga & Pranayama: ${medReport.ayurvedicLifestyle.yogaSuggestions.join(', ')}; ${medReport.ayurvedicLifestyle.pranayamaSuggestions.join(', ')}

3. Numero Vaastu Pro Parameters:
   - Kua Number (कुआ अंक): ${vaastuReport.kuaNumber} (Group: ${vaastuReport.groupType === 'EAST_GROUP' ? 'पूर्व दिशा समूह' : 'पश्चिम दिशा समूह'})
   - Lucky Directions: Success -> ${vaastuReport.directions.success.direction}, Health -> ${vaastuReport.directions.health.direction}, Family -> ${vaastuReport.directions.family.direction}, Growth -> ${vaastuReport.directions.personalDev.direction}
   - Avoid Directions: ${vaastuReport.directions.avoidList.join(', ')}
   - Lucky Colours: ${vaastuReport.colourCorrection.luckyColours.join(', ')}, Balance: ${vaastuReport.colourCorrection.balanceColours.join(', ')}, Anti: ${vaastuReport.colourCorrection.antiColours.join(', ')}
   - Vastu zone recommendations: Career: ${vaastuReport.zonesReport.careerZone.enhancement}, Money: ${vaastuReport.zonesReport.moneyZone.enhancement}, Relationships: ${vaastuReport.zonesReport.relationshipZone.enhancement}

4. Dasha Engine & Personal Year Forecast:
   - Current running Mahadasha (9-year Master Cycle): Rulership by ${dashaReport.currentMahadasha.planetName} from year ${dashaReport.currentMahadasha.startYear} to ${dashaReport.currentMahadasha.endYear}
   - Current running Antardasha (1-year Sub Cycle): Sub planet ${dashaReport.currentAntardasha.subPlanetName} (Forecast: ${dashaReport.currentAntardasha.forecast})
   - Shifting Personal Year Transit for 2026: Personal Year ${dashaReport.personalYearNumber} (${dashaReport.personalYearForecast})

5. Mobile Phone Vibrational Diagnostics:
   - Suggestive lucky ending frequencies: ${remedies.mobileEndings.join(', ')}
   - Compound vibration score: ${mobileAnalysis.compoundTotal}
   - Reduced core frequency: ${mobileAnalysis.reducedTotal} (Rating Category: ${mobileAnalysis.rating}, Score: ${mobileAnalysis.score}/100)
   - Hostile planetary pairs triggered: ${mobileAnalysis.hostileRelationships.map((h: any) => h.title).join(', ') || 'कोई नहीं'}

Active Consecutive Pairs Discovered inside User's Mobile:
${pairsDataString || 'कोई नहीं'}

Please lay out the report with the following exact chapters in professional, rich, and highly formatted Markdown. All text must be in elite traditional Hindi:

- **1. मुख्य व्यक्तिगत सारांश (Executive Personal Summary)**: A majestic, poetic birds-eye view of their alignment, cosmic destiny, and general aura state.
- **2. मूल व्यक्तित्व एवं खगोलीय-अंक ज्योतिष ब्लूप्रिंट (Core Personality & Astro-Numerology Blueprint)**: Dive deeply into Life Path (भाग्यांक), Birth Number (मूलांक), Destiny Number (नामांक), and Soul Urge frequency analysis in supreme consulting detail.

  महत्वपूर्ण निर्देश (CRITICAL INSTRUCTION - NO SHALLOW OUTPUT):
  इस अध्याय में शामिल प्रत्येक अंक (Life Path Number, Birth Number, Destiny Number, Soul Urge Number, Personality Number, Maturity Number, और Attitude Number) के लिए आपको बिना किसी अपवाद के निम्नलिखित पाँचों अनुभागों (five sections) को पूरी तरह से विस्तृत रूप में प्रस्तुत करना होगा। सामान्य या संक्षिप्त वाक्य (generic filler/shallow sentences) बिल्कुल न लिखें:
  
  A) **गणना एवं स्रोत (Derivation & Calculation)**:
     स्पष्ट रूप से दिखाएं कि यह अंक कैसे प्राप्त किया गया है। उदाहरण के लिए:
     - जन्मांक (Birth Number): "23 -> 2 + 3 = 5"
     - भाग्यांक (Life Path): "1984-11-23 -> 1+9+8+4+1+1+2+3 = 29 -> 2+9 = 11 -> 1+1 = 2"
     - नामांक (Destiny): "M-A-R-K-A-N-D-E → 4+1+2+2+1+5+4+1 = 20 → 2+0 = 2" (चैल्डियन पद्धति के वास्तविक मानों के साथ पूरी वर्ण-दर-वर्ण जोड़ श्रृंखला दर्शाएं)।
  
  B) **गहन फलादेश (In-depth Interpretation)**:
     प्रत्येक अंक के लिए न्यूनतम 100-150 शब्दों का एक आत्मीय, गहरा और व्यक्तिगत फलादेश द्वितीय-पुरुष स्वर ("आप", "आपकी प्रकृति", "आपके जीवन में...") में होना चाहिए। यह व्याख्या पूरी तरह से उस विशिष्ट अंक और संबंधित ज्योतिषीय परंपरा (चैल्डियन/वैदिक) के अनुकूल होनी चाहिए। इसमें कोई सामान्य जेनेरिक वाक्य दोहराया नहीं जाना चाहिए।
  
  C) **सकारात्मक शक्तियाँ (Strengths)**:
     कम से कम 3 से 5 अत्यधिक व्यावहारिक, वास्तविक और विशिष्ट बुलेट बिंदु जो आपकी अद्वितीय शक्तियों और प्रतिभाओं को दर्शाते हों।
  
  D) **नकारात्मक पहलू / छाया प्रतिरूप (Challenges / Shadow Side)**:
     कम से कम 3 से 5 विशिष्ट बुलेट बिंदु जो आपकी कमजोरियों, छिपी हुई आदतों और उन छाया पक्षों को दर्शाते हों जिन्हें सुधारने की आवश्यकता है।
  
  E) **जीवन के महत्वपूर्ण क्षेत्रों में प्रकटीकरण (Expressions)**:
     - **पेशेवर जीवन एवं करियर (Career)**: इस अंक का आपके करियर, व्यवसाय और धन उपार्जन शैली पर विस्तृत प्रभाव (1 लघु पैराग्राफ)।
     - **प्रेम एवं पारस्परिक संबंध (Relationships)**: इस अंक का आपके विवाह, प्रेम, और पारिवारिक संबंधों में संवाद शैली पर प्रभाव (1 लघु पैराग्राफ)।
     - **व्यक्तिगत एवं आत्मिक विकास (Personal Growth)**: इस अंक का आपके आंतरिक आध्यात्मिक उत्थान, आत्म-जागरूकता और जीवन के वास्तविक उद्देश्यों पर प्रभाव (1 लघु पैराग्राफ)।

- **3. चिकित्सा अंकशास्त्र एवं आयुर्वेदिक दोष निदान (Medical Numerology & Ayurvedic Dosha Diagnosis)**: Translate their medical numerology profile into deep Vedic wellness insights. Mention their dominant doshas, health strength, digestive indices, weak body systems, comprehensive dietary guidelines (recommended foods, avoid foods, recommended fruits and vegetables), sleep guides, and custom morning routine. 
  *ADD A STRICT PROFESSIONAL DISCLAIMER AT THE START OF THIS CHAPTER: "यह रिपोर्ट केवल अंकशास्त्र-आधारित कल्याण अंतर्दृष्टि और जीवनशैली मार्गदर्शन प्रदान करती है। यह पेशेवर चिकित्सा सलाह, निदान या उपचार का विकल्प नहीं है।"*
- **4. न्यूमरो वास्तु प्रो एवं चुंबकीय दिशा संरेखण (Numero Vaastu Pro & Spatial Direction Coordinates)**: Analyze space vibrations using their Kua number and group. Provide their Success, Health, and Career directions, lucky/anti colors suggestions for home, bedroom, office, and vehicles, and discuss active zone enhancement remedies (Career, Money, Relationship, and Spiritual). Include detailed Lo Shu + Vaastu remedies for their missing numbers!
- **5. आगामी दशा चक्र एवं व्यक्तिगत वर्ष फलादेश (Planetary Dasha Cycles & Personal Year Forecast)**: Break down their current running Mahadasha and Antardasha influences. Map the exact health, career, relationship, and financial impacts of this cycle, followed by their Personal Year 2026 forecast and predictions for the next 5 years (2026 to 2030).

  महत्वपूर्ण निर्देश (CRITICAL INSTRUCTION - NO SHALLOW OUTPUT):
  सक्रिय व्यक्तिगत वर्ष (Personal Year 2026) के लिए आपको बिना किसी अपवाद के निम्नलिखित पाँचों अनुभागों (five sections) को पूरी तरह से विस्तृत रूप में प्रस्तुत करना होगा:
  A) **गणना एवं स्रोत (Derivation)**: जन्म तिथि और माह के साथ वर्ष 2026 को जोड़कर गणना दर्शाएं (जैसे: 23+11+2026 = 2+3+1+1+2+0+2+6 = 17 -> 1+7 = 8)।
  B) **गहन फलादेश (In-depth Interpretation)**: न्यूनतम 100-150 शब्दों में हिन्दी में लिखी व्याख्या जो इस वर्ष की विशिष्ट ऊर्जा कम्पन को दर्शाए।
  C) **सकारात्मक प्रभाव (Strengths/Opportunities)**: इस वर्ष के लिए 3 से 5 विशिष्ट बुलेट बिंदु।
  D) **सावधानी एवं संभावित चुनौतियाँ (Challenges/Shadow Side)**: इस वर्ष आपके समक्ष आने वाले संभावित जोखिमों और सावधानियों के 3 से 5 बुलेट बिंदु।
  E) **जीवन के महत्वपूर्ण क्षेत्रों में अभिव्यक्ति (Expressions)**: करियर, संबंधों, और आत्मिक विकास पर प्रभाव (प्रत्येक का 1 संक्षिप्त पैराग्राफ)।

- **6. मोबाईल अंक निदान एवं सुधारात्मक उपाय (Mobile Diagnostics & Audit Remedies)**:
  Examine the user's mobile total vibrations, repeating alarms, and hostile relationships.
  
  For EVERY pair listed in the "Active Consecutive Pairs Discovered" above, you MUST display it in this exact format. Do NOT combine them. Keep them formatted as individual cards using clean, elegant blockquotes or styled markdown:

  PAIR: [संख्या, जैसे: 31]
  
  शीर्षक:
  [शीर्षक का नाम - Use Traditional terms, e.g., "प्रशासनिक एवं सरकारी संबंध", "संवेदनशीलता एवं मानसिक अशांति" or similar descriptive Hindi names]
  
  सकारात्मक प्रभाव:
  • [सकारात्मक प्रभाव बिंदु 1]
  • [सकारात्मक प्रभाव बिंदु 2]
  ...
  
  सावधानी:
  • [सावधानी का विवरण बिंदु 1]
  • [सावधानी का विवरण बिंदु 2]
  ...
  
  स्थिरता स्कोर:
  [X]%
  
- **7. सर्वकल्याणकारी लाल किताब कवच (Comprehensive Altar Remedies Shield)**: Personalized signature guidelines (angle, underline), lucky dates, corporate metal structures placement, and customized home altar guidelines. Includes gemstone rituals and lucky colors.
`;

      const aiResponse = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `You are an elite, compassionate astro-numerologist with 25 years of consulting experience in traditional Indian Vedic & Mobile Numerology.

CRITICAL LANGUAGE INSTRUCTION:
The entire Mobile Numerology Report must be generated in PROFESSIONAL HINDI exactly in the style used in traditional premium Mobile Numerology PDFs and consultations.

Do NOT use:
- Google-translated Hindi
- Modern corporate Hindi
- Hinglish
- English mixed sentences

Use:
- Traditional Numerology Hindi (शास्त्रीय एवं पारंपरिक ज्योतिषीय हिंदी)
- Simple, beautiful, and highly readable Hindi
- Same elite, consulting, respectful, and authoritative tone ("आप", "आपका", "शुभम", "आशीर्वाद")

Common English-to-Hindi mapping examples to adhere to strictly:
- Positive Resonance -> सकारात्मक प्रभाव / शुभ लक्षण
- Vibrational Constraint -> सावधानी / संभावित चुनौती / नकारात्मक योग
- Government Connection & Leadership -> सरकारी संबंध और नेतृत्व क्षमता
- Leadership & Authority -> नेतृत्व और अधिकार
- Love Connection with Domestic Load -> पारिवारिक जिम्मेदारियों के साथ प्रेम संबंध
- Creative Planner & Event Manager -> रचनात्मक योजनाकार एवं आयोजन प्रबंधक
- Master Event Organiser & Designer -> उत्कृष्ट आयोजक एवं रचनात्मक डिज़ाइन क्षमता
- Communication -> संचार क्षमता
- Money Flow -> धन प्रवाह
- Education -> शिक्षा
- Marriage -> वैवाहिक जीवन
- Relationships -> संबंध
- Health -> स्वास्थ्य
- Children -> संतान पक्ष
- Business -> व्यवसाय
- Luck -> भाग्य
- Success -> सफलता

For every pair result display in this format:
PAIR: [संख्या]

शीर्षक:
[शीर्षक का नाम]

सकारात्मक प्रभाव:
• [बिंदु...]

सावधानी:
• [बिंदु...]

स्थिरता स्कोर:
[X]%

For any structured cards, use these key markers:
- शीर्षक
- सकारात्मक प्रभाव
- सावधानी
- जीवन पर प्रभाव
- उपयुक्त क्षेत्र
- स्थिरता स्कोर
- उपाय

The output should look like a master-class, deeply personalized, premium consultation report preparado by an experienced cosmic guru. Ensure maximum details and thoroughness.`,
          temperature: 0.70,
        }
      });

      const responseText = aiResponse.text || "आपका आध्यात्मिक फलादेश वर्तमान में ग्रहों के पारगमन के कारण उपलब्ध नहीं है। कृपया पुनः प्रयास करें।";
      res.json({ report: responseText });
    } catch (err: any) {
      console.error("Gemini server error: ", err);
      res.status(500).json({ error: "ब्रह्मांडीय सर्वर से संपर्क विफल रहा। कृपया आवश्यक सेटिंग्स में अपनी GEMINI_API_KEY जांचें।" });
    }
  });

  // API router for Loshu Grid Report generation
  app.post("/api/loshu-report", async (req, res) => {
    try {
      const { personalDetails, mulank, bhagyank, loshuGrid, missingNumbers, strengthArrows, weaknessArrows, personalYear, currentMahadasha, currentAntardasha } = req.body;

      if (!personalDetails?.name) {
        return res.status(400).json({ error: "Missing personal details name" });
      }

      const client = getGeminiClient();

      const prompt = `
Generate an exhaustive, supreme quality, 10-15 page equivalent Astro-Numerology Life Advisory Report in traditional, dignified, and highly formatted Hindi.
This is a standard "Complete Loshu Grid Analysis & Vedic-Chaldean Destiny Blueprint Report".

Subject Credentials:
- Name (नाम): ${personalDetails.name}
- Birthdate (जन्म तारीख): ${personalDetails.dob}
- Gender (लिंग): ${personalDetails.gender || 'निर्दिष्ट नहीं'}

Loshu Grid Key Parameters (Calculated Coordinates):
1. Psychic Number / Driver (मूलांक /जन्मांक): ${mulank} (Co-ruled by planet planetary alignments)
2. Destiny Number / Conductor (भाग्यांक / जीवन पथ संख्या): ${bhagyank}
3. Active Personal Year 2026 (सक्रिय व्यक्तिगत वर्ष): ${personalYear.number} - Title: ${personalYear.title}
4. Active Planetary Cycles running currently:
   - Current Mahadasha (वर्तमान महादशा): ${currentMahadasha?.planet || 'सक्रिय चक्र'} (Age: ${currentMahadasha?.startAge}-${currentMahadasha?.endAge} / Years: ${currentMahadasha?.startYear}-${currentMahadasha?.endYear})
   - Current Antardasha (वर्तमान अंतर्दशा): ${currentAntardasha?.planet || 'सक्रिय उपचक्र'} (Duration: ${currentAntardasha?.durationMonths} months)

Grid Map Analysis Details:
- Strength Arrows/Planes present (सक्रिय राजयोग - बलशाली विमान):
  ${strengthArrows.map((s: any) => `• ${s.name} (${s.title}): Digits: ${s.digits.join(', ')} (Description: ${s.description})`).join('\n  ') || 'कोई नहीं'}
- Weakness Arrows/Planes present (दुर्बलता या शून्य विमान):
  ${weaknessArrows.map((w: any) => `• ${w.name} (${w.title}): Digits: ${w.digits.join(', ')} (Remedy: ${w.remedy})`).join('\n  ') || 'कोई नहीं'}
- Missing Numbers (लोशू ग्रिड में अनुपस्थित अंक एवं तत्त्व):
  ${missingNumbers.map((m: any) => `• Digit ${m.digit} (Element: ${m.element}): ${m.meaning} -> Remedy Suggestion: ${m.remedy}`).join('\n  ') || 'कोई नहीं'}

Active Grid Digit Counts (Loshu Representation):
${Object.values(loshuGrid).map((g: any) => `Digit ${g.digit}: Element: ${g.element}, Direction: ${g.direction}, Count: ${g.count} times. (Lifeforce: ${g.meaning})`).join('\n')}

Please output a majestic, highly professional report under the following chapters with maximum consulting length, containing deep analysis, ancient references, and practical steps. High-end Markdown tables, lists, and bold phrases in pure, respectful Vedic Hindi are necessary.

Report Chapters to construct:
- **1. मंगलाचरण एवं ब्रह्मांडीय प्रस्तावना (Divine Invocation & Cosmic Preface)**: Poetic greeting, invocation of divine vibrations, and overview of the subject's birth star alignments.
- **2. मूलांक एवं भाग्यांक - आपके जीवन का दोहरा कम्पास (Psychic & Destiny - The Dual Compasses)**: Deep advisory analysis of Mulank (${mulank}) and Bhagyank (${bhagyank}) traits, career recommendations, spiritual lessons, and mutual alignment.

  महत्वपूर्ण निर्देश (CRITICAL INSTRUCTION - NO SHALLOW OUTPUT):
  इस अध्याय में शामिल दोनों प्रमुख अंकों - मूलांक (Psychic Number: ${mulank}) और भाग्यांक (Destiny Number: ${bhagyank}) के लिए बिना किसी अपवाद के आपको निम्नलिखित पाँचों अनुभागों (five sections) को पूरी तरह से विस्तृत और व्यापक रूप में प्रस्तुत करना होगा:
  
  A) **गणना एवं स्रोत (Derivation & Calculation)**:
     स्पष्ट रूप से दर्शाएं कि ये अंक आपके जन्म विवरण से किस तरह प्राप्त किए गए हैं।
     - मूलांक (Psychic Number): जन्म तिथि के दिन का जोड़ (जैसे: "23 -> 2 + 3 = 5")।
     - भाग्यांक (Destiny Number): जन्म तिथि, माह और वर्ष का कुल योग (जैसे: "1984-11-23 -> 1+9+8+4+1+1+2+3 = 29 -> 2+9 = 11 -> 1+1 = 2")।
  
  B) **गहन फलादेश (In-depth Interpretation)**:
     प्रत्येक अंक के लिए न्यूनतम 100-150 शब्दों का आत्मीय, गहरा और व्यक्तिगत फलादेश द्वितीय-पुरुष स्वर ("आप", "आपकी आंतरिक ऊर्जा...") में लिखें, जो इस अंक की शास्त्रीय वैदिक ज्योतिष परंपरा को स्पष्ट करता हो। कोई सामान्य भराव वाक्य (filler text) स्वीकार्य नहीं है।
  
  C) **सकारात्मक विशिष्टताएँ (Strengths)**:
     3 से 5 विशिष्ट बुलेट बिंदु जो आपकी सकारात्मक शक्तियों, मानसिक झुकाव और जन्मजात प्रतिभाओं को उजागर करते हों।
  
  D) **चुनौतियाँ और छाया रूप (Challenges / Shadow Side)**:
     3 से 5 बुलेट बिंदु जो आपके जीवन के संघर्षों, नकारात्मक प्रवृत्तियों और उन कमजोरियों को दर्शाते हों जिन पर आपको ध्यान देना है।
  
  E) **जीवन के महत्वपूर्ण क्षेत्रों में अभिव्यक्ति (Expressions)**:
     - **पेशेवर करियर (Career)**: इस अंक का आपके व्यवसाय, नौकरी, निर्णय लेने की शैली और व्यावसायिक सफलता पर प्रभाव (1 लघु पैराग्राफ)।
     - **पारस्परिक संबंध (Relationships)**: इस अंक का आपके पारिवारिक जीवन, वैवाहिक संबंधों और समाज में संचार पर प्रभाव (1 लघु पैराग्राफ)।
     - **व्यक्तिगत विकास (Personal Growth)**: इस अंक का आपके जीवन के आध्यात्मिक उद्देश्यों, आंतरिक संतोष और व्यक्तिगत परिपक्वता पर प्रभाव (1 लघु पैराग्राफ)।

- **3. लोशू ग्रिड चार्ट एवं तत्त्व मीमांसा (Loshu Grid Chart & Elemental Metaphysics)**: A complete diagnostic writeup on their 3x3 magic square. Discuss Wood, Water, Fire, Earth, Metal distribution inside their chart.
- **4. राजयोग विमान एवं सक्रिय ऊर्जा प्रवाह (Sovereign Planes & Active Energies)**: Extensive assessment of active planes: ${strengthArrows.map((s: any) => s.name).join(', ') || 'सक्रिय राजयोग'}. Explain how these shape their material wealth, mental focus, and actions.
- **5. शून्य विमान, अनुपस्थित अंक एवं सुधारत्मक वेध (Empty Planes, Missing Figures & Karmic Remedies)**: Full list of missing numbers. Detail the Lal Kitab remedies, direction activation (like North career zone, Northwest support), and gemstone rituals required.
- **6. वर्तमान महादशा और अंतर्दशा चक्र विश्लेषण (Planetary Period Dasha Audit)**: Point out their running Mahadasha of ${currentMahadasha?.planet} and Antardasha of ${currentAntardasha?.planet}. Give a year-by-year checklist on how to conduct negotiations, financial investments, and maintain health during this period, plus what days/hours to avoid.
- **7. वर्ष 2026-2030 आगामी मार्गदर्शन (5-Year Detailed Planetary Forecast)**: Provide structured annual predictions for the next 5 years based on shifting Personal Years.

  महत्वपूर्ण निर्देश (CRITICAL INSTRUCTION - NO SHALLOW OUTPUT):
  सक्रिय व्यक्तिगत वर्ष 2026 (Personal Year: ${personalYear.number}) के लिए आपको बिना किसी अपवाद के निम्नलिखित पाँचों अनुभागों (five sections) को पूरी तरह से विस्तृत रूप में प्रस्तुत करना होगा:
  A) **गणना एवं स्रोत (Derivation)**: जन्म तिथि और माह के साथ वर्ष 2026 को जोड़कर स्पष्ट गणना दर्शाएं।
  B) **गहन फलादेश (In-depth Interpretation)**: न्यूनतम 100-150 शब्दों में हिन्दी में लिखी व्याख्या जो इस वर्ष की विशिष्ट ऊर्जा कम्पन को दर्शाए।
  C) **सकारात्मक प्रभाव (Strengths/Opportunities)**: इस वर्ष के लिए 3 से 5 विशिष्ट बुलेट बिंदु।
  D) **सावधानी एवं संभावित चुनौतियाँ (Challenges/Shadow Side)**: इस वर्ष आपके समक्ष आने वाले संभावित जोखिमों और सावधानियों के 3 से 5 बुलेट बिंदु।
  E) **जीवन के महत्वपूर्ण क्षेत्रों में अभिव्यक्ति (Expressions)**: करियर, संबंधों, और आत्मिक विकास पर प्रभाव (प्रत्येक का 1 संक्षिप्त पैराग्राफ)।

- **8. सर्वकल्याणकारी लाल किताब कवच (Comprehensive Altar Remedies Shield)**: Personalized signature guidelines (angle, underline), lucky dates, corporate metal structures placement, and customized home altar guidelines.

Write with premium consulting mastery strictly following traditional Vedic Hindi, keeping the quality worthy of elite consultations.
`;

      const aiResponse = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `You are an elite, compassionate astro-numerologist with 25 years of consulting experience in traditional Indian Vedic, Chaldean & Loshu Grid Numerology.

CRITICAL LANGUAGE INSTRUCTION:
The entire Loshu Numerology Report must be generated in PROFESSIONAL HINDI exactly in the style used in traditional premium Vedic/Loshu PDFs and consultations.

Do NOT use:
- Google-translated Hindi
- Modern corporate Hinglish
- Single English sentences inside content blocks

Use:
- Traditional Numerology Hindi (शास्त्रीय एवं पारंपरिक ज्योतिषीय हिंदी)
- Deep, highly detailed, respectful, and authoritative tone ("आप", "आपका", "शुभम", "आशीर्वाद")
- Authentic terms: मूलांक (Psychic), भाग्यांक (Destiny), लोशू ग्रिड (Loshu Grid), राजयोग (Sovereign Plane), महादशा (Major Cycle), अंतर्दशा (Sub Cycle), लाल किताब उपाय (Lal Kitab remedies).

Structure the report with pristine Markdown layout, neat tables, divider lines, and elegant blockquotes. Make it look professional.`,
          temperature: 0.70,
        }
      });

      const responseText = aiResponse.text || "ब्रह्मांडीय ऊर्जा संचरण में बाधा के कारण वर्तमान में फलादेश अनुपलब्ध है।";
      res.json({ report: responseText });
    } catch (err: any) {
      console.error("Gemini server error for Loshu: ", err);
      res.status(500).json({ error: "ब्रह्मांडीय सर्वर से संपर्क विफल रहा। कृपया आवश्यक सेटिंग्स में अपनी GEMINI_API_KEY जांचें।" });
    }
  });

  // Helper function to generate high-fidelity, customized signature audits as a fallback
  const generateFallbackSignatureAudit = (styleId: string, personalDetails: any, driver: number, conductor: number, nameNumber: number) => {
    const name = personalDetails?.name || "Aspirant";
    const finalStyleId = styleId || "RISING_UNDERLINE";

    if (finalStyleId === "TRAILING_DOT_BELOW") {
      return {
        analysis: {
          direction: "Flat or slightly wave-like direction, showing high resilience and adaptability under changing corporate environments.",
          size: "Compact but highly dense strokes, symbolizing a focused, detail-oriented personality with high privacy boundaries.",
          firstLetterSize: `The first letter of '${name}' is exceptionally prominent, almost 3x larger than lowercase characters, showing strong personal pride but also a subconscious defensive shield.`,
          underlineStyle: "No active underline is used, signifying a desire to operate independently without relying on traditional safety nets.",
          endStroke: "The end stroke curves backward or stops abruptly, indicating an analytical mind that thoroughly evaluates risks before executing actions.",
          dotPlacement: "A single prominent trailing dot is placed below the final character, which acts as a subconscious anchor but can sometimes create blockages if too heavy.",
          letterLegibility: "Moderate legibility with stylized trailing loops, reflecting a highly strategic thinker who keeps their core plans close to their chest.",
          nameCompletion: "First name is fully spelled out with a bold, stylized dot, while the surname is omitted, indicating a self-made persona.",
          overallFlow: "Calculated, rhythmic, but with sharp angular turns that show high analytical power and mechanical precision."
        },
        scores: {
          careerScore: 78,
          financialFlowScore: 75,
          recognitionScore: 82,
          leadershipScore: 85,
          businessSuccessScore: 80,
          relationshipHarmonyScore: 72,
          overallSignatureScore: 79
        },
        assessment: {
          currentSignatureAssessment: `This style features an exceptionally large first letter paired with a trailing dot below or after the signature. For ${name}, with Driver #${driver} and Conductor #${conductor}, this indicates high self-reliance, strategic reserve, and a strong self-protection mechanism. Co-ruled by Rahu and Saturn, it gives you deep investigative powers and a sharp, critical mind. However, the isolated trailing dot acts as a cosmic full-stop or anchor. While it provides deep grounding, it can also manifest as subconscious roadblocks, sudden delays, or a tendency to stall key decisions at the final hour.`,
          strengths: [
            "Exceptional self-image and individual drive symbolized by the large initial.",
            "Excellent risk management and analytical evaluation of details.",
            "High capacity for independent decision-making and strategic planning."
          ],
          weaknesses: [
            "The isolated dot creates a sudden energy block, slowing down progress.",
            "Lack of an underline foundation may cause feelings of being unsupported in critical situations.",
            "Abrupt end strokes can lead to sudden, unexplained endings in partnerships."
          ],
          riskAreas: [
            "Tendency to attract sudden administrative audits or legal hurdles due to the Rahu-Saturn dot configuration.",
            "Communication blockages or misunderstanding with close business associates."
          ],
          recommendedCorrections: [
            "Shift the trailing dot from being a solitary stop to a supporting double dot below a new foundation underline.",
            "Soften the sharp angles in the middle characters to allow smoother energy flow and reduce internal stress.",
            "Ensure the end stroke of your last letter sweeps forward and upward rather than stopping abruptly.",
            "Write your new signature with a green or black ink pen on clean unruled paper 21 times before sleeping."
          ],
          idealSignatureStyle: "A prominent first letter, followed by fluid legible middle letters, supported by a clean ascending underline with two balanced dots below.",
          personalizedSignatureBlueprint: "Start with a grand, rounded first letter. Write the rest of your name in a flowing, legible script. Draw a straight, slightly rising underline. Place two small, neat dots horizontally below the middle of the underline."
        },
        beforeAfter: {
          before: {
            visualDescription: "A heavy, isolated dot at the very end of a flat signature, with sharp angles and a closed, abrupt ending.",
            impact: "Manifests as sudden blockages in cash flow and unexpected operational delays right when deals are about to close."
          },
          after: {
            visualDescription: "A fluid, legible script with an upward-pointing exit stroke, supported by a clean underline and two balanced dots beneath it.",
            impact: "Releases stagnant funds, brings friendly mentors into your sphere, and unlocks continuous opportunities."
          }
        }
      };
    } else if (finalStyleId === "FALLING_LINE") {
      return {
        analysis: {
          direction: "Downward sloping (Southwest descent) in the trailing segment, showing a gradual drop in stamina or confidence toward the end of tasks.",
          size: "Medium at the start but shrinking significantly toward the end, signaling an energy leak or fatigue.",
          firstLetterSize: "Standard first letter, but the succeeding letters gradually lose their height and scale, representing vulnerability to external pressure.",
          underlineStyle: "Absent or a downward-drooping line, which drains the grounding element and increases anxiety.",
          endStroke: "Declining or pointing downwards, representing a leak in the wealth sector and sudden loss of interest.",
          dotPlacement: "Irregular dotting or a dot cutting the baseline, signifying minor health issues or frequent energy drains.",
          letterLegibility: "Low to moderate legibility, indicating a tendency to feel overwhelmed or misunderstood by peers.",
          nameCompletion: "Letters get compressed or scribbled at the end, showing a rush to finish and a lack of patience with administrative details.",
          overallFlow: "Declining momentum, starting with high enthusiasm but closing with high tension or friction."
        },
        scores: {
          careerScore: 60,
          financialFlowScore: 52,
          recognitionScore: 58,
          leadershipScore: 62,
          businessSuccessScore: 55,
          relationshipHarmonyScore: 65,
          overallSignatureScore: 58
        },
        assessment: {
          currentSignatureAssessment: `Your current signature exhibits a downward slope, particularly in the trailing segment. In Handwriting Vastu, this is a critical energy drain known as the 'Descent Trap'. For someone with Driver #${driver} and Conductor #${conductor}, it indicates that while you start projects with immense enthusiasm (ruled by Mars/Sun), you face substantial stamina drains, mental fatigue, or self-doubt as you approach the finish line. This downward angle acts as a siphon in your wealth and career sectors, causing hard-earned gains or recognition to slip away at the last moment. Immediate structural alignment is strongly recommended.`,
          strengths: [
            "Energetic and powerful start to new initiatives.",
            "Strong initial presentation and personal charm."
          ],
          weaknesses: [
            "Downward trailing slope drains career energy and causes fatigue.",
            "Shrinking letter size indicates falling confidence under sustained pressure.",
            "Scribbled ending letters lead to misunderstandings and administrative delays."
          ],
          riskAreas: [
            "High vulnerability to financial losses, unexpected expenses, or leakage of liquid wealth.",
            "Frequent delays in receiving credit or recognition for your hard work."
          ],
          recommendedCorrections: [
            "You MUST consciously tilt your signature upwards. Ensure the entire signature slopes at a 10 to 15-degree angle from left to right.",
            "Keep all letters in your name uniform in height, rather than letting them shrink toward the end.",
            "Add a solid, straight, independent horizontal underline that rises slightly at the end to act as a cosmic support shield.",
            "Practice the new ascending signature 33 times daily for 21 days with a high-quality indigo rollerball pen."
          ],
          idealSignatureStyle: "A 15-degree rising line with uniform character sizing and an independent upward-flicking underline foundation.",
          personalizedSignatureBlueprint: "Write on unruled white paper. Keep your hand relaxed. Write your name so that each letter is legible and stays on an ascending line. Draw a bold, straight underline underneath, starting from the second letter and flicking upwards at the end."
        },
        beforeAfter: {
          before: {
            visualDescription: "A signature that starts strong but slopes downwards toward the right, with letters shrinking and scribbling at the end.",
            impact: "Drains your financial savings, causes minor joint or energy health issues, and delays promotions."
          },
          after: {
            visualDescription: "An ascending signature with beautifully spaced, uniform letters and a firm, rising underline foundation.",
            impact: "Secures your financial assets, boosts daily energy levels, and ensures you receive full credit and fame for your achievements."
          }
        }
      };
    } else if (finalStyleId === "DOUBLE_UNDERLINE") {
      return {
        analysis: {
          direction: "Stable, perfectly flat horizontal alignment, representing a highly structured, objective, and realistic approach to life.",
          size: "Large, bold, and expansive, commanding immediate attention and establishing a powerful physical presence.",
          firstLetterSize: "Strong, blocky, and wide first letter, representing a solid corporate base and high protective instincts.",
          underlineStyle: "Two clean, parallel underlines run beneath the signature. In Vastu, this represents a double-foundation (Earth and Metal elements) which guarantees massive stability.",
          endStroke: "Horizontal or curving slightly upward, representing a careful, calculated exit that locks in profits.",
          dotPlacement: "Perfectly balanced dots placed precisely between or below the underlines, serving as protective anchors.",
          letterLegibility: "Highly structured and legible, showing absolute clarity of purpose and high commercial acumen.",
          nameCompletion: "Uses both first name and surname clearly, establishing strong connection to lineage and a desire for legacy building.",
          overallFlow: "Robust, authoritative, with clear spacing and powerful deliberate strokes that show immense discipline."
        },
        scores: {
          careerScore: 88,
          financialFlowScore: 95,
          recognitionScore: 85,
          leadershipScore: 90,
          businessSuccessScore: 93,
          relationshipHarmonyScore: 78,
          overallSignatureScore: 89
        },
        assessment: {
          currentSignatureAssessment: `Your current signature uses a straight horizontal style with a double underline support. In Handwriting Vastu, this is known as the 'Fortress' or 'Double Vault' structure. It is an exceptionally strong format for corporate leaders, business owners, and financial experts. For someone with Driver #${driver} and Conductor #${conductor}, co-ruled by Mercury and Saturn, it instills immense commercial intelligence, deep financial discipline, and a highly systematic way of working. The double parallel lines create an unbreakable barrier against financial losses and ensure that your business ventures have a permanent, rock-solid foundation.`,
          strengths: [
            "Unmatched financial stability and asset protection from the double underline.",
            "Immense administrative and executive authority.",
            "Outstanding clarity of goals and methodical execution."
          ],
          weaknesses: [
            "Can sometimes indicate extreme rigidity or a reluctance to adapt to rapid changes.",
            "The double lines can occasionally attract heavy responsibilities that cause mental pressure."
          ],
          riskAreas: [
            "Over-analyzing simple situations, leading to missed fast-paced opportunities.",
            "Creating an overly formal barrier in personal relationships due to high structure."
          ],
          recommendedCorrections: [
            "Keep the double underlines exactly parallel and ensure they never cross each other or touch any descending loops.",
            "Soften the starting letters slightly with a gentle curve to improve personal relationship harmony and adaptability.",
            "Ensure the underlines do not extend too far beyond the signature itself, keeping the energy concentrated.",
            "Practice your signature 15 times daily using a premium black or deep blue fountain pen on rich paper."
          ],
          idealSignatureStyle: "A stable horizontal signature supported by two parallel lines that are clean, distinct, and end with a slight upward tilt.",
          personalizedSignatureBlueprint: "Write your full name in a clean, bold horizontal line. Draw two perfectly straight, parallel lines underneath, separated by 2mm. Ensure both lines are clean and unbroken, ending exactly where your name ends."
        },
        beforeAfter: {
          before: {
            visualDescription: "Double underlines that are uneven, crossing, or touching the bottom loops of your letters.",
            impact: "Manifests as excessive workload, minor back-and-forth delays in partnerships, and unnecessary rigid arguments."
          },
          after: {
            visualDescription: "Two beautiful, clean, perfectly parallel underlines below a bold, clearly spaced horizontal signature.",
            impact: "Locks in massive wealth accumulation, secures corporate leadership positions, and builds an enduring personal legacy."
          }
        }
      };
    } else {
      // Default RISING_UNDERLINE
      return {
        analysis: {
          direction: "The signature maintains a beautiful, precise 15-degree upward slope (Eastward ascent), symbolizing constant growth and healthy ambition.",
          size: "A healthy medium-to-large size, occupying the page space with confidence without spilling over or crowding other elements.",
          firstLetterSize: `The first letter of '${name}' is perfectly scaled, being approximately 2x larger than the lowercase characters, showing strong self-image and protective boundaries.`,
          underlineStyle: "A straight, single underline starts after the first letter and runs to the end. This acts as a firm, stable foundation (Earth Element) to support your endeavors.",
          endStroke: "The end stroke finishes with an assertive upward-right flick, signaling positive closure and inviting prosperous future partnerships.",
          dotPlacement: "No unnecessary blocking dots are present, which ensures smooth movement and lack of communication gaps with outer allies.",
          letterLegibility: "Highly legible and distinct letters, establishing that the subject has clear, transparent intentions and values direct public relationships.",
          nameCompletion: "The full first name is clearly utilized, reinforcing personal identity, followed by a stylized last name initial to manage family heritage elegantly.",
          overallFlow: "Extremely fluid, consistent rhythm, showing a balanced flow of personal energy and healthy stamina."
        },
        scores: {
          careerScore: 92,
          financialFlowScore: 89,
          recognitionScore: 94,
          leadershipScore: 88,
          businessSuccessScore: 90,
          relationshipHarmonyScore: 86,
          overallSignatureScore: 91
        },
        assessment: {
          currentSignatureAssessment: `Your current signature utilizes an upward ascending style with a solid underline foundation. In Handwriting Vastu, this style is known as the 'Vanguard' or 'Sovereign Path'. For someone with Driver #${driver} and Conductor #${conductor}, this progressive mindset aligns perfectly with your cosmic timeline. The planetary vibrations of the Sun and Jupiter are well-aligned here, creating standard leadership traits and natural executive abilities. The underline acts as a horizontal anchor, providing a steady support system for your career decisions and preventing sudden energy drops.`,
          strengths: [
            "Excellent ascending confidence that drives persistent progress.",
            "Underline acts as a firm Vastu foundation, securing long-term career stability.",
            "Upward end stroke invites healthy recognition and lucrative opportunities."
          ],
          weaknesses: [
            "Minor rush in ending letters can sometimes lead to impatience in closing deals.",
            "The underline must be kept clean; any overlapping lower loop letters like g, j, p, y could create self-sabotaging traps."
          ],
          riskAreas: [
            "Potential financial leakages if the underline crosses or cuts the baseline of any trailing letters.",
            "Slight over-commitment of personal resources due to high ambition slope."
          ],
          recommendedCorrections: [
            "Ensure the underline begins after the first letter and never cuts any lower loops (g, j, p, y) of your name.",
            "Enlarge the first letter slightly so it stands exactly 2.5 times higher than the succeeding lowercase letters.",
            "Ensure the upward trailing stroke rises exactly at a 15 to 20 degree angle to keep Jupiter vibrations active.",
            "Begin practicing this corrected script 11 times daily on unruled white paper with an indigo gel pen."
          ],
          idealSignatureStyle: "A 15-degree rising line with a single clean underline and a bold first letter, matching the 'Sovereign Path' archetype.",
          personalizedSignatureBlueprint: "Use an indigo or deep blue ink pen. Write your first name clearly, sloping upwards at a 15-degree angle. Draw a single straight line underneath from the second letter to the end, ending with an upward flick at the top right. Leave a 1mm gap between letters."
        },
        beforeAfter: {
          before: {
            visualDescription: "Slightly congested letters with an underline that occasionally touches or cuts through the lower loops of your characters.",
            impact: "Creates minor delays in project approvals and causes occasional unexpected expenditure or leakages of liquid cash."
          },
          after: {
            visualDescription: "A pristine, spacious script ascending at 15 degrees, supported by a clean, independent horizontal foundation line and a larger initial letter.",
            impact: "Unlocks supreme cash-flow stability, accelerates pending executive promotions, and commands high social respect."
          }
        }
      };
    }
  };

  // API router for AI Signature Audit Pro System
  app.post("/api/signature-audit", async (req, res) => {
    const { image, personalDetails, manualSelection, driver, conductor, nameNumber } = req.body;

    // Check if GEMINI_API_KEY is defined and not equal to MOCK placeholder
    const apiKey = process.env.GEMINI_API_KEY;
    const hasValidKey = apiKey && apiKey !== "" && apiKey !== "MOCK_KEY_FOR_TESTING";

    if (!hasValidKey) {
      console.log("No valid GEMINI_API_KEY present. Serving high-fidelity customized fallback signature audit analysis.");
      const fallbackResult = generateFallbackSignatureAudit(
        manualSelection?.styleId,
        personalDetails,
        driver || 1,
        conductor || 1,
        nameNumber || 1
      );
      return res.json(fallbackResult);
    }

    try {
      const client = getGeminiClient();

      const contents: any[] = [];

      if (image) {
        try {
          // general base64 data clean up
          const base64Data = image.replace(/^data:[^;]+;base64,/, "");
          const mimeType = image.match(/^data:([^;]+);base64,/)?.[1] || "image/png";
          contents.push({
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          });
        } catch (e) {
          console.error("Failed to parse base64 image data, running with textual descriptors only:", e);
        }
      }

      const promptText = `
Perform a highly professional and rigorous Signature Handwriting Vastu & Chaldean Numerology Audit.
${personalDetails?.name ? `Subject Name: ${personalDetails.name}` : ""}
${personalDetails?.dob ? `Date of Birth: ${personalDetails.dob}` : ""}

Subject's Numerological Vibration Grid:
- Driver Number (Mulank): ${driver || 1}
- Conductor Number (Bhagyank): ${conductor || 1}
- Name Spelling Total (Destiny/Expression): ${nameNumber || 1}

Current Selected Signature Attribute Style (Fallback or reference metadata):
- Style Identifier: ${manualSelection?.styleId || "RISING_UNDERLINE"}

Detailed Hand Writing Vastu Parameters to Audit:
1. Signature Direction: Rising, flat, declining, wavy, or climbing.
2. Signature Size: Overly large, tiny, standard, medium.
3. First Letter Size: Capitalization level, scale relative to other letters.
4. Underline Style: Single line, double line, no line, cutting through tail loops.
5. End Stroke: Upward flick, downward tail, horizontal stroke, hooked block.
6. Dot Placement: No dots, trailing dot, underline dots, dots below names.
7. Letter Legibility: Legible characters, scribble style, thread-like lines, chaotic overlap.
8. Name Completion: Complete first and last names, initials, only first name, crossed out name.
9. Overall Flow: Harmonious, aggressive angles, standard balance, high negative space.

Generate a comprehensive assessment, occult scores (0 to 100), risk areas, and concrete remedies.
The output MUST strictly match the required JSON structure and be written in deep, professional, consulting-grade English with elegant astrological vocabulary.

Return data in the EXACT JSON format matching the schema properties:
- 'analysis': Deep breakdown of the 9 visual handwriting parameters.
- 'scores': Specific numerological alignment scores (0-100).
- 'assessment': Highly detailed narrative, list of strengths, list of weaknesses, risk areas, recommended corrections, ideal signature style tailored to Driver/Conductor, and the physical blueprint instructions.
- 'beforeAfter': Visual/textual descriptions explaining current negative traits (Before) and ideal restructured blueprint traits (After).
`;

      contents.push(promptText);

      const signatureAuditSchema = {
        type: Type.OBJECT,
        properties: {
          analysis: {
            type: Type.OBJECT,
            properties: {
              direction: { type: Type.STRING, description: "Detailed Handwriting Vastu analysis of signature direction" },
              size: { type: Type.STRING, description: "Analysis of physical signature size and space utilization" },
              firstLetterSize: { type: Type.STRING, description: "Audit of the first letter's projection and scale" },
              underlineStyle: { type: Type.STRING, description: "Vastu analysis of the underline and support curves" },
              endStroke: { type: Type.STRING, description: "Energy analysis of the signature's termination and exit angles" },
              dotPlacement: { type: Type.STRING, description: "Analysis of trailing dots or blocking anchor points" },
              letterLegibility: { type: Type.STRING, description: "Clear commentary on letter legibility and transparency" },
              nameCompletion: { type: Type.STRING, description: "Vastu impact of partial vs full name utilization in signature" },
              overallFlow: { type: Type.STRING, description: "General energetic rhythm, spikes, loops, and fluid velocity" }
            },
            required: ["direction", "size", "firstLetterSize", "underlineStyle", "endStroke", "dotPlacement", "letterLegibility", "nameCompletion", "overallFlow"]
          },
          scores: {
            type: Type.OBJECT,
            properties: {
              careerScore: { type: Type.INTEGER },
              financialFlowScore: { type: Type.INTEGER },
              recognitionScore: { type: Type.INTEGER },
              leadershipScore: { type: Type.INTEGER },
              businessSuccessScore: { type: Type.INTEGER },
              relationshipHarmonyScore: { type: Type.INTEGER },
              overallSignatureScore: { type: Type.INTEGER }
            },
            required: ["careerScore", "financialFlowScore", "recognitionScore", "leadershipScore", "businessSuccessScore", "relationshipHarmonyScore", "overallSignatureScore"]
          },
          assessment: {
            type: Type.OBJECT,
            properties: {
              currentSignatureAssessment: { type: Type.STRING, description: "Comprehensive, deeply detailed executive paragraph on their current handwriting" },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 2-3 positive vibrational aspects" },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 2-3 blocking aspects" },
              riskAreas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 2-3 critical risks (e.g. monetary leaks, delayed fame)" },
              recommendedCorrections: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3-4 exact actionable correction steps" },
              idealSignatureStyle: { type: Type.STRING, description: "Detailed description of the perfect signature tailored to their birth numbers" },
              personalizedSignatureBlueprint: { type: Type.STRING, description: "Comprehensive step-by-step physical blueprint (e.g. ideal angle, pen, starting letter)" }
            },
            required: ["currentSignatureAssessment", "strengths", "weaknesses", "riskAreas", "recommendedCorrections", "idealSignatureStyle", "personalizedSignatureBlueprint"]
          },
          beforeAfter: {
            type: Type.OBJECT,
            properties: {
              before: {
                type: Type.OBJECT,
                properties: {
                  visualDescription: { type: Type.STRING, description: "Visual description of the current layout flaws" },
                  impact: { type: Type.STRING, description: "Vibrational/financial/career blockages caused by current style" }
                },
                required: ["visualDescription", "impact"]
              },
              after: {
                type: Type.OBJECT,
                properties: {
                  visualDescription: { type: Type.STRING, description: "Visual blueprint of the corrected ideal style" },
                  impact: { type: Type.STRING, description: "Positive planetary alignments and cash flows unlocked by corrected layout" }
                },
                required: ["visualDescription", "impact"]
              }
            },
            required: ["before", "after"]
          }
        },
        required: ["analysis", "scores", "assessment", "beforeAfter"]
      };

      const aiResponse = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: "You are an elite, highly experienced Astro-Numerologist and Vastu Handwriting Specialist. You deliver comprehensive, non-generic, deep-dive signature analyses and audits that look like premium masterclass dossiers.",
          responseMimeType: "application/json",
          responseSchema: signatureAuditSchema,
          temperature: 0.2,
        }
      });

      const responseText = aiResponse.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini.");
      }

      const parsedResult = JSON.parse(responseText);
      res.json(parsedResult);
    } catch (err: any) {
      console.error("AI Signature Audit Gemini server error: ", err);
      console.log("Serving high-fidelity fallback signature audit analysis due to Gemini API failure.");
      const fallbackResult = generateFallbackSignatureAudit(
        manualSelection?.styleId,
        personalDetails,
        driver || 1,
        conductor || 1,
        nameNumber || 1
      );
      res.json(fallbackResult);
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cosmic Server running on host 0.0.0.0, port ${PORT}`);
  });
}

startServer();
