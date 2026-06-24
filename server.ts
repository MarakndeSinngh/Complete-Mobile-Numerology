import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { PAIR_MEANINGS } from "./src/services/pairMeanings";
import { generateMedicalNumerologyReport } from "./src/services/medicalNumerologyEngine";
import { generateNumeroVaastuReport } from "./src/services/numeroVaastuEngine";
import { calculateDashaAndYearForecast } from "./src/services/dashaEngine";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parser
  app.use(express.json());

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
- **3. चिकित्सा अंकशास्त्र एवं आयुर्वेदिक दोष निदान (Medical Numerology & Ayurvedic Dosha Diagnosis)**: Translate their medical numerology profile into deep Vedic wellness insights. Mention their dominant doshas, health strength, digestive indices, weak body systems, comprehensive dietary guidelines (recommended foods, avoid foods, recommended fruits and vegetables), sleep guides, and custom morning routine. 
  *ADD A STRICT PROFESSIONAL DISCLAIMER AT THE START OF THIS CHAPTER: "यह रिपोर्ट केवल अंकशास्त्र-आधारित कल्याण अंतर्दृष्टि और जीवनशैली मार्गदर्शन प्रदान करती है। यह पेशेवर चिकित्सा सलाह, निदान या उपचार का विकल्प नहीं है।"*
- **4. न्यूमरो वास्तु प्रो एवं चुंबकीय दिशा संरेखण (Numero Vaastu Pro & Spatial Direction Coordinates)**: Analyze space vibrations using their Kua number and group. Provide their Success, Health, and Career directions, lucky/anti colors suggestions for home, bedroom, office, and vehicles, and discuss active zone enhancement remedies (Career, Money, Relationship, and Spiritual). Include detailed Lo Shu + Vaastu remedies for their missing numbers!
- **5. आगामी दशा चक्र एवं व्यक्तिगत वर्ष फलादेश (Planetary Dasha Cycles & Personal Year Forecast)**: Break down their current running Mahadasha and Antardasha influences. Map the exact health, career, relationship, and financial impacts of this cycle, followed by their Personal Year 2026 forecast and predictions for the next 5 years (2026 to 2030).
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
- **3. लोशू ग्रिड चार्ट एवं तत्त्व मीमांसा (Loshu Grid Chart & Elemental Metaphysics)**: A complete diagnostic writeup on their 3x3 magic square. Discuss Wood, Water, Fire, Earth, Metal distribution inside their chart.
- **4. राजयोग विमान एवं सक्रिय ऊर्जा प्रवाह (Sovereign Planes & Active Energies)**: Extensive assessment of active planes: ${strengthArrows.map((s: any) => s.name).join(', ') || 'सक्रिय राजयोग'}. Explain how these shape their material wealth, mental focus, and actions.
- **5. शून्य विमान, अनुपस्थित अंक एवं सुधारत्मक वेध (Empty Planes, Missing Figures & Karmic Remedies)**: Full list of missing numbers. Detail the Lal Kitab remedies, direction activation (like North career zone, Northwest support), and gemstone rituals required.
- **6. वर्तमान महादशा और अंतर्दशा चक्र विश्लेषण (Planetary Period Dasha Audit)**: Point out their running Mahadasha of ${currentMahadasha?.planet} and Antardasha of ${currentAntardasha?.planet}. Give a year-by-year checklist on how to conduct negotiations, financial investments, and maintain health during this period, plus what days/hours to avoid.
- **7. वर्ष 2026-2030 आगामी मार्गदर्शन (5-Year Detailed Planetary Forecast)**: Provide structured annual predictions for the next 5 years based on shifting Personal Years.
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
