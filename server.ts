import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { PAIR_MEANINGS } from "./src/services/pairMeanings";

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

      // Calculate or extract consecutive pairs from the mobile number digits
      // (Using Zero-replacement logic matching the design engine)
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

Subject Auditable Credentials:
- Aura Name (नाम): ${personalDetails.name}
- Source Birthdate (जन्म तारीख): ${personalDetails.dob}
- Gender (लिंग): ${personalDetails.gender || 'निर्दिष्ट नहीं'}
- Focal Phone Line (मोबाईल नंबर): ${personalDetails.mobile} (संशोधित कंपन धारा: ${modifiedNumber})

Primary Grid Coordinates Calculated by Vedic Math (Use these values exactly):
1. Date of Birth Grid (जन्मांक एवं भाग्यांक विश्लेषण):
   - Life Path Number (जीवन पथ संख्या / भाग्यांक): ${dobAnalysis.lifePathNumber}
   - Birth Number (जन्मांक / मूलांक): ${dobAnalysis.birthNumber}
   - Destiny Number (नामांक / भाग्य संख्या): ${dobAnalysis.destinyNumber}
   - Soul Urge Number (आत्मिक इच्छा संख्या): ${dobAnalysis.soulUrgeNumber}
   - Personality Number (व्यक्तित्व संख्या): ${dobAnalysis.personalityNumber}
   - Maturity Number (परिपक्वता संख्या): ${dobAnalysis.maturityNumber}
   - Attitude Number (दृष्टिकोण संख्या): ${dobAnalysis.attitudeNumber}
   - Pinnacles (शिखर काल चक्र): ${dobAnalysis.pinnacles.join(', ')}
   - Challenges (चुनौतियाँ): ${dobAnalysis.challenges.join(', ')}
   - Personal Year 2026 (व्यक्तिगत वर्ष): ${dobAnalysis.personalYear}
   - Missing Numbers in Birth grid (लोशू ग्रिड में अनुपस्थित अंक): ${dobAnalysis.missingNumbers.join(', ')}
   - Karmic Debt Numbers (कर्मिक ऋण संख्या): ${dobAnalysis.karmicDebtNumbers.join(', ')}
   - Karmic Lessons (कर्मिक पाठ): ${dobAnalysis.karmicLessons.join(', ')}

2. Name Vibration Coordinates (नाम कंपन विश्लेषण):
   - Chaldean Name number (काल्डियन नामांक): ${nameAnalysis.chaldeanNumber}
   - Pythagorean Name number (पाइथागोरियन नामांक): ${nameAnalysis.pythagoreanNumber}
   - Indian/Vedic phonetic value (वैदिक स्वर नामांक): ${nameAnalysis.indianNumber}
   - Positive Traits: ${nameAnalysis.traits.positive.join(', ')}
   - Negative Traits: ${nameAnalysis.traits.negative.join(', ')}
   - Suitable Careers: ${nameAnalysis.traits.careers.join(', ')}

3. Mobile Phone Vibrational Diagnostics:
   - Suggestive lucky ending frequencies (अनुशंसित मोबाईल अंतिम अंक): ${remedies.mobileEndings.join(', ')}
   - Compound vibration score (संयुक्त मोबाईल कंपन योग): ${mobileAnalysis.compoundTotal}
   - Reduced core frequency (घटित मूल अंक प्रभाव): ${mobileAnalysis.reducedTotal}
   - Vibrational Rating Category (कंपन मूल्यांकन): ${mobileAnalysis.rating} (Score: ${mobileAnalysis.score}/100)
   - Repeating digit alarms (तीन या अधिक बार दोहराए गए अंक): ${mobileAnalysis.repeatingAlarms.map((a: any) => `${a.digit} (बार: ${a.count})`).join(', ') || 'कोई नहीं'}
   - Hostile planetary pairs triggered (विरोधी ग्रहों के प्रतिकूल योग): ${mobileAnalysis.hostileRelationships.map((h: any) => h.title).join(', ') || 'कोई नहीं'}

Active Consecutive Pairs Discovered inside User's Mobile (Focal transitions):
${pairsDataString || 'कोई नहीं'}

Please lay out the report with the following exact chapters in professional, rich, and highly formatted Markdown. All text must be in elite traditional Hindi:

- **1. मुख्य व्यक्तिगत सारांश (Executive Personal Summary)**: A majestic, poetic birds-eye view of their alignment, cosmic destiny, and general aura state.
- **2. मूल व्यक्तित्व एवं खगोलीय-अंक ज्योतिष ब्लूप्रिंट (Core Personality & Astro-Numerology Blueprint)**: Dive deeply into Life Path (भाग्यांक), Birth Number (मूलांक), Destiny Number (नामांक), and Soul Urge frequency analysis in supreme consulting detail.
- **3. कर्मिक ऋण और जीवन की चुनौतियाँ (Karmic Debts and Lifelong Challenges)**: Deep breakdown of karmic numbers and Pinnacles/Challenge transitions.
- **4. काल्डियन बनाम पाइथागोरियन अंक प्रणाली विश्लेषण (Chaldean vs Pythagorean System Audit)**: Comparative examination of their name values under both systems.
- **5. मोबाईल अंक निदान एवं सुधारात्मक उपाय (Mobile Diagnostics & Audit Remedies)**:
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
  
- **6. लाल किताब एवं ज्योतिषीय उपाय मैट्रिक्स (Lal Kitab & Astrological Remedies Matrix)**: Comprehensive consulting on Name correction spelling, lucky colors, signature advice, gemstones, and lucky days in Hindi.
- **7. आगामी 5 वर्षों का भविष्यफल (5-Year Forecast)**: Comprehensive guide from year 2026 to 2030 (वर्ष-वार फलादेश).
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
