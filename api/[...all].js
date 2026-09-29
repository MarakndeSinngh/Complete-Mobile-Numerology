// src/server/serverlessApi.ts
import express from "express";

// src/server/accessEngine.ts
import crypto from "crypto";

// src/types/reportAccess.ts
var REPORT_REGISTRY = {
  MOBILE_NUMEROLOGY: {
    type: "MOBILE_NUMEROLOGY",
    titleEn: "Mobile Numerology & 81 Pair Vibration Analysis",
    titleHi: "\u092E\u094B\u092C\u093E\u0907\u0932 \u0905\u0902\u0915\u0936\u093E\u0938\u094D\u0924\u094D\u0930 \u090F\u0935\u0902 81 \u092F\u0941\u0917\u0932 \u0915\u0902\u092A\u0928 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923",
    titleMr: "\u092E\u094B\u092C\u093E\u0908\u0932 \u0905\u0902\u0915\u0936\u093E\u0938\u094D\u0924\u094D\u0930 \u0906\u0923\u093F 81 \u091C\u094B\u0921\u0940 \u0915\u0902\u092A\u0928 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923",
    titleBn: "\u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u09B8\u0982\u0996\u09CD\u09AF\u09BE\u09A4\u09A4\u09CD\u09A4\u09CD\u09AC \u0993 \u09EE\u09E7 \u099C\u09CB\u09A1\u09BC\u09BE \u0995\u09AE\u09CD\u09AA\u09A8 \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3",
    titleGu: "\u0AAE\u0ACB\u0AAC\u0ABE\u0A87\u0AB2 \u0A85\u0A82\u0A95\u0AB6\u0ABE\u0AB8\u0ACD\u0AA4\u0ACD\u0AB0 \u0A85\u0AA8\u0AC7 81 \u0A9C\u0ACB\u0AA1\u0AC0 \u0A95\u0A82\u0AAA\u0AA8 \u0AB5\u0ABF\u0AB6\u0ACD\u0AB2\u0AC7\u0AB7\u0AA3",
    descriptionEn: "Full Chaldean and Vedic mobile number analysis (Permanently 100% Free).",
    descriptionHi: "\u0938\u092E\u094D\u092A\u0942\u0930\u094D\u0923 \u091A\u093E\u0932\u0921\u0940\u0928 \u090F\u0935\u0902 \u0935\u0948\u0926\u093F\u0915 \u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 (\u0938\u094D\u0925\u093E\u092F\u0940 \u0930\u0942\u092A \u0938\u0947 100% \u092E\u0941\u092B\u093C\u094D\u0924)\u0964",
    isFree: true,
    priceInr: 0
  },
  LOSHU: {
    type: "LOSHU",
    titleEn: "Complete Lo Shu Grid & Planes Analysis",
    titleHi: "\u0938\u092E\u094D\u092A\u0942\u0930\u094D\u0923 \u0932\u094B \u0936\u0942 \u0917\u094D\u0930\u093F\u0921 \u090F\u0935\u0902 \u092A\u094D\u0932\u0947\u0928 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923",
    titleMr: "\u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u0932\u094B \u0936\u0942 \u0917\u094D\u0930\u093F\u0921 \u0906\u0923\u093F \u092A\u094D\u0932\u0947\u0928 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923",
    titleBn: "\u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09B2\u09CB \u09B6\u09C1 \u0997\u09CD\u09B0\u09BF\u09A1 \u0993 \u09AA\u09CD\u09B2\u09C7\u09A8 \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3",
    titleGu: "\u0AB8\u0A82\u0AAA\u0AC2\u0AB0\u0ACD\u0AA3 \u0AB2\u0ACB \u0AB6\u0AC2 \u0A97\u0ACD\u0AB0\u0AC0\u0AA1 \u0A85\u0AA8\u0AC7 \u0AAA\u0ACD\u0AB2\u0AC7\u0AA8 \u0AB5\u0ABF\u0AB6\u0ACD\u0AB2\u0AC7\u0AB7\u0AA3",
    descriptionEn: "Comprehensive 3x3 magic square and 8 master planes diagnostic report.",
    descriptionHi: "\u0935\u093F\u0938\u094D\u0924\u0943\u0924 3x3 \u0917\u094D\u0930\u093F\u0921 \u090F\u0935\u0902 8 \u092E\u0939\u093E-\u0924\u0932\u094B\u0902 \u0915\u093E \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923\u093E\u0924\u094D\u092E\u0915 \u092A\u0930\u093E\u092E\u0930\u094D\u0936\u0964",
    isFree: false,
    priceInr: 33
  },
  MASTER_REPORT: {
    type: "MASTER_REPORT",
    titleEn: "32-Section Master Consultation Dossier",
    titleHi: "32-\u0905\u0927\u094D\u092F\u093E\u092F \u092E\u0939\u093E-\u092A\u0930\u093E\u092E\u0930\u094D\u0936 \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u0930\u093F\u092A\u094B\u0930\u094D\u091F",
    titleMr: "32-\u092A\u094D\u0930\u0915\u0930\u0923\u093E\u0902\u091A\u093E \u092E\u0939\u093E-\u0938\u0932\u094D\u0932\u093E\u0917\u093E\u0930 \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u0905\u0939\u0935\u093E\u0932",
    titleBn: "\u09E9\u09E8-\u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC \u09AE\u09B9\u09BE-\u09AA\u09B0\u09BE\u09AE\u09B0\u09CD\u09B6 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F",
    titleGu: "32-\u0AAA\u0ACD\u0AB0\u0A95\u0AB0\u0AA3\u0ACB\u0AA8\u0ACB \u0AAE\u0AB9\u0ABE-\u0AAA\u0AB0\u0ABE\u0AAE\u0AB0\u0ACD\u0AB6 \u0AB8\u0A82\u0AAA\u0AC2\u0AB0\u0ACD\u0AA3 \u0AB0\u0ABF\u0AAA\u0ACB\u0AB0\u0ACD\u0A9F",
    descriptionEn: "All-inclusive 32-chapter client dossier with deep synthesis and PDF export.",
    descriptionHi: "\u0938\u092D\u0940 32 \u0905\u0927\u094D\u092F\u093E\u092F\u094B\u0902 \u0915\u093E \u0935\u093F\u0938\u094D\u0924\u0943\u0924 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923\u093E\u0924\u094D\u092E\u0915 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C \u0935 \u092A\u094D\u0930\u093F\u0902\u091F\u0947\u092C\u0932 PDF\u0964",
    isFree: false,
    priceInr: 33
  },
  NAME_NUMEROLOGY: {
    type: "NAME_NUMEROLOGY",
    titleEn: "Name Numerology & Spell Balancing",
    titleHi: "\u0928\u093E\u092E \u0905\u0902\u0915\u0936\u093E\u0938\u094D\u0924\u094D\u0930 \u090F\u0935\u0902 \u0938\u094D\u092A\u0947\u0932\u093F\u0902\u0917 \u0938\u0902\u0924\u0941\u0932\u0928",
    titleMr: "\u0928\u093E\u0935 \u0905\u0902\u0915\u0936\u093E\u0938\u094D\u0924\u094D\u0930 \u0906\u0923\u093F \u0938\u094D\u092A\u0947\u0932\u093F\u0902\u0917 \u0938\u0902\u0924\u0941\u0932\u0928",
    titleBn: "\u09A8\u09BE\u09AE \u09B8\u0982\u0996\u09CD\u09AF\u09BE\u09A4\u09A4\u09CD\u09A4\u09CD\u09AC \u0993 \u09AC\u09BE\u09A8\u09BE\u09A8 \u09AD\u09BE\u09B0\u09B8\u09BE\u09AE\u09CD\u09AF",
    titleGu: "\u0AA8\u0ABE\u0AAE \u0A85\u0A82\u0A95\u0AB6\u0ABE\u0AB8\u0ACD\u0AA4\u0ACD\u0AB0 \u0A85\u0AA8\u0AC7 \u0AB8\u0ACD\u0AAA\u0AC7\u0AB2\u0ABF\u0A82\u0A97 \u0AB8\u0A82\u0AA4\u0AC1\u0AB2\u0AA8",
    descriptionEn: "Chaldean & Pythagorean compound frequency and letter harmony report.",
    descriptionHi: "\u091A\u093E\u0932\u0921\u0940\u0928 \u0935 \u092A\u093E\u0907\u0925\u093E\u0917\u094B\u0930\u093F\u092F\u0928 \u0938\u0902\u092F\u0941\u0915\u094D\u0924 \u0906\u0935\u0943\u0924\u094D\u0924\u093F \u090F\u0935\u0902 \u0905\u0915\u094D\u0937\u0930\u094B\u0902 \u0915\u093E \u0938\u0942\u0915\u094D\u0937\u094D\u092E \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923\u0964",
    isFree: false,
    priceInr: 33
  },
  SIGNATURE_AUDIT: {
    type: "SIGNATURE_AUDIT",
    titleEn: "Signature & Handwriting Energy Audit",
    titleHi: "\u0939\u0938\u094D\u0924\u093E\u0915\u094D\u0937\u0930 \u0935 \u0911\u091F\u094B\u0917\u094D\u0930\u093E\u092B \u090A\u0930\u094D\u091C\u093E \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923",
    titleMr: "\u0938\u094D\u0935\u093E\u0915\u094D\u0937\u0930\u0940 \u0906\u0923\u093F \u0939\u0938\u094D\u0924\u093E\u0915\u094D\u0937\u0930 \u090A\u0930\u094D\u091C\u093E \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923",
    titleBn: "\u09B8\u09CD\u09AC\u09BE\u0995\u09CD\u09B7\u09B0 \u0993 \u09B9\u09B8\u09CD\u09A4\u09BE\u0995\u09CD\u09B7\u09B0 \u09B6\u0995\u09CD\u09A4\u09BF \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3",
    titleGu: "\u0AB9\u0AB8\u0ACD\u0AA4\u0ABE\u0A95\u0ACD\u0AB7\u0AB0 \u0A85\u0AA8\u0AC7 \u0AB8\u0AB9\u0AC0 \u0A8A\u0AB0\u0ACD\u0A9C\u0ABE \u0AB5\u0ABF\u0AB6\u0ACD\u0AB2\u0AC7\u0AB7\u0AA3",
    descriptionEn: "Stroke, slant, underscore, and planetary alignment signature analysis.",
    descriptionHi: "\u0939\u0938\u094D\u0924\u093E\u0915\u094D\u0937\u0930 \u0938\u094D\u091F\u094D\u0930\u094B\u0915, \u091D\u0941\u0915\u093E\u0935 \u0914\u0930 \u0905\u0927\u094B\u0930\u0947\u0916\u093E \u0915\u093E \u0938\u0942\u0915\u094D\u0937\u094D\u092E \u0905\u0902\u0915\u0936\u093E\u0938\u094D\u0924\u094D\u0930\u0940\u092F \u0911\u0921\u093F\u091F\u0964",
    isFree: false,
    priceInr: 33
  },
  MEDICAL_NUMEROLOGY: {
    type: "MEDICAL_NUMEROLOGY",
    titleEn: "Medical Numerology & Vedic Wellness",
    titleHi: "\u0935\u0948\u0926\u093F\u0915 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u090F\u0935\u0902 \u0928\u094D\u092F\u0942\u092E\u0947\u0930\u094B\u0932\u0949\u091C\u0940 \u092A\u0930\u093E\u092E\u0930\u094D\u0936",
    titleMr: "\u0935\u0948\u0926\u093F\u0915 \u0906\u0930\u094B\u0917\u094D\u092F \u0906\u0923\u093F \u0928\u094D\u092F\u0942\u092E\u0930\u094B\u0932\u0949\u091C\u0940 \u0938\u0932\u094D\u0932\u093E",
    titleBn: "\u09AC\u09C8\u09A6\u09BF\u0995 \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF \u0993 \u09A8\u09BF\u0989\u09AE\u09C7\u09B0\u09CB\u09B2\u099C\u09BF \u09AA\u09B0\u09BE\u09AE\u09B0\u09CD\u09B6",
    titleGu: "\u0AB5\u0AC8\u0AA6\u0ABF\u0A95 \u0AB8\u0ACD\u0AB5\u0ABE\u0AB8\u0ACD\u0AA5\u0ACD\u0AAF \u0A85\u0AA8\u0AC7 \u0AA8\u0ACD\u0AAF\u0AC2\u0AAE\u0AB0\u0ACB\u0AB2\u0ACB\u0A9C\u0AC0 \u0AAA\u0AB0\u0ABE\u0AAE\u0AB0\u0ACD\u0AB6",
    descriptionEn: "Planetary anatomy, elemental vulnerabilities, and holistic wellness guidance.",
    descriptionHi: "\u0917\u094D\u0930\u0939-\u0905\u0902\u0917 \u0938\u0902\u092C\u0902\u0927, \u0924\u094D\u0930\u093F\u0926\u094B\u0937 \u0938\u0902\u0924\u0941\u0932\u0928 \u0914\u0930 \u092A\u093E\u0930\u0902\u092A\u0930\u093F\u0915 \u0906\u092F\u0941\u0930\u094D\u0935\u0947\u0926\u093F\u0915 \u091C\u0940\u0935\u0928\u0936\u0948\u0932\u0940 \u0938\u0941\u091D\u093E\u0935\u0964",
    isFree: false,
    priceInr: 33
  },
  VASTU: {
    type: "VASTU",
    titleEn: "NumeroVastu & 8-Directional Matrix",
    titleHi: "\u0928\u094D\u092F\u0942\u092E\u0947\u0930\u094B \u0935\u093E\u0938\u094D\u0924\u0941 \u090F\u0935\u0902 8-\u0926\u093F\u0936\u093E \u090A\u0930\u094D\u091C\u093E \u0938\u0902\u0924\u0941\u0932\u0928",
    titleMr: "\u0928\u094D\u092F\u0942\u092E\u0947\u0930\u094B \u0935\u093E\u0938\u094D\u0924\u0941 \u0906\u0923\u093F 8-\u0926\u093F\u0936\u093E \u090A\u0930\u094D\u091C\u093E \u0938\u0902\u0924\u0941\u0932\u0928",
    titleBn: "\u09A8\u09BF\u0989\u09AE\u09C7\u09B0\u09CB \u09AC\u09BE\u09B8\u09CD\u09A4\u09C1 \u0993 \u09EE-\u09A6\u09BF\u0995 \u09B6\u0995\u09CD\u09A4\u09BF \u09AD\u09BE\u09B0\u09B8\u09BE\u09AE\u09CD\u09AF",
    titleGu: "\u0AA8\u0ACD\u0AAF\u0AC2\u0AAE\u0AC7\u0AB0\u0ACB \u0AB5\u0ABE\u0AB8\u0ACD\u0AA4\u0AC1 \u0A85\u0AA8\u0AC7 8-\u0AA6\u0ABF\u0AB6\u0ABE \u0A8A\u0AB0\u0ACD\u0A9C\u0ABE \u0AB8\u0A82\u0AA4\u0AC1\u0AB2\u0AA8",
    descriptionEn: "Directional deities, home energy grids, and non-demolition remedies.",
    descriptionHi: "\u0926\u093F\u0936\u093E\u0928\u093F\u0930\u094D\u0926\u0947\u0936\u093F\u0924 \u090A\u0930\u094D\u091C\u093E, \u0906\u0935\u093E\u0938 \u0938\u093E\u092E\u0902\u091C\u0938\u094D\u092F \u090F\u0935\u0902 \u092C\u093F\u0928\u093E \u0924\u094B\u0921\u093C-\u092B\u094B\u0921\u093C \u0915\u0947 \u0938\u0930\u0932 \u0909\u092A\u093E\u092F\u0964",
    isFree: false,
    priceInr: 33
  },
  KUA: {
    type: "KUA",
    titleEn: "Kua Number & 8 Mansions Harmonics",
    titleHi: "\u0915\u0941\u0906 \u0905\u0902\u0915 \u090F\u0935\u0902 \u0905\u0937\u094D\u091F \u0926\u093F\u0936\u093E \u0936\u0941\u092D-\u0905\u0936\u0941\u092D \u091A\u0915\u094D\u0930",
    titleMr: "\u0915\u0941\u0906 \u0905\u0902\u0915 \u0906\u0923\u093F \u0905\u0937\u094D\u091F \u0926\u093F\u0936\u093E \u0936\u0941\u092D-\u0905\u0936\u0941\u092D \u091A\u0915\u094D\u0930",
    titleBn: "\u0995\u09C1\u09AF\u09BC\u09BE \u09A8\u09AE\u09CD\u09AC\u09B0 \u0993 \u0985\u09B7\u09CD\u099F \u09A6\u09BF\u0995 \u09B6\u09C1\u09AD-\u0985\u09B6\u09C1\u09AD \u099A\u0995\u09CD\u09B0",
    titleGu: "\u0A95\u0AC1\u0A86 \u0A85\u0A82\u0A95 \u0A85\u0AA8\u0AC7 \u0A85\u0AB7\u0ACD\u0A9F \u0AA6\u0ABF\u0AB6\u0ABE \u0AB6\u0AC1\u0AAD-\u0A85\u0AB6\u0AC1\u0AAD \u0A9A\u0A95\u0ACD\u0AB0",
    descriptionEn: "Eight Mansions Sheng Chi, Tien Yi, and personal spatial orientation.",
    descriptionHi: "\u0935\u094D\u092F\u0915\u094D\u0924\u093F\u0917\u0924 \u0936\u0941\u092D-\u0905\u0936\u0941\u092D \u0926\u093F\u0936\u093E\u090F\u0902 \u090F\u0935\u0902 \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u090A\u0930\u094D\u091C\u093E \u0905\u092D\u093F\u0935\u093F\u0928\u094D\u092F\u093E\u0938\u0964",
    isFree: false,
    priceInr: 33
  },
  HOUSE_FLAT: {
    type: "HOUSE_FLAT",
    titleEn: "House & Flat Number Numerology",
    titleHi: "\u092E\u0915\u093E\u0928 \u0935 \u092B\u094D\u0932\u0948\u091F \u0928\u0902\u092C\u0930 \u0905\u0902\u0915\u0936\u093E\u0938\u094D\u0924\u094D\u0930\u0940\u092F \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923",
    titleMr: "\u0918\u0930 \u0906\u0923\u093F \u092B\u094D\u0932\u0945\u091F \u0928\u0902\u092C\u0930 \u0905\u0902\u0915\u0936\u093E\u0938\u094D\u0924\u094D\u0930\u0940\u092F \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923",
    titleBn: "\u09AC\u09BE\u09A1\u09BC\u09BF \u0993 \u09AB\u09CD\u09B2\u09CD\u09AF\u09BE\u099F \u09A8\u09AE\u09CD\u09AC\u09B0 \u09B8\u0982\u0996\u09CD\u09AF\u09BE\u09A4\u09BE\u09A4\u09CD\u09A4\u09CD\u09AC\u09BF\u0995 \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3",
    titleGu: "\u0AAE\u0A95\u0ABE\u0AA8 \u0A85\u0AA8\u0AC7 \u0AAB\u0ACD\u0AB2\u0AC7\u0A9F \u0AA8\u0A82\u0AAC\u0AB0 \u0A85\u0A82\u0A95\u0AB6\u0ABE\u0AB8\u0ACD\u0AA4\u0ACD\u0AB0\u0AC0\u0AAF \u0AB5\u0ABF\u0AB6\u0ACD\u0AB2\u0AC7\u0AB7\u0AA3",
    descriptionEn: "Residential compound vibration and resident alignment diagnostic.",
    descriptionHi: "\u0906\u0935\u093E\u0938\u0940\u092F \u092A\u0930\u093F\u0938\u0930 \u0905\u0902\u0915 \u0915\u0902\u092A\u0928 \u090F\u0935\u0902 \u092A\u0930\u093F\u0935\u093E\u0930 \u0915\u0947 \u0938\u0926\u0938\u094D\u092F\u094B\u0902 \u0915\u0947 \u0938\u093E\u0925 \u0924\u093E\u0932\u092E\u0947\u0932\u0964",
    isFree: false,
    priceInr: 33
  },
  VEHICLE: {
    type: "VEHICLE",
    titleEn: "Vehicle Numerology & Owner Compatibility",
    titleHi: "\u0935\u093E\u0939\u0928 \u0905\u0902\u0915\u0936\u093E\u0938\u094D\u0924\u094D\u0930 \u090F\u0935\u0902 \u0938\u094D\u0935\u093E\u092E\u0940 \u0905\u0928\u0941\u0915\u0942\u0932\u0924\u093E",
    titleMr: "\u0935\u093E\u0939\u0928 \u0905\u0902\u0915\u0936\u093E\u0938\u094D\u0924\u094D\u0930 \u0906\u0923\u093F \u092E\u093E\u0932\u0915 \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E",
    titleBn: "\u09AF\u09BE\u09A8\u09AC\u09BE\u09B9\u09A8 \u09B8\u0982\u0996\u09CD\u09AF\u09BE\u09A4\u09A4\u09CD\u09A4\u09CD\u09AC \u0993 \u09AE\u09BE\u09B2\u09BF\u0995 \u09B8\u09BE\u09AE\u099E\u09CD\u099C\u09B8\u09CD\u09AF",
    titleGu: "\u0AB5\u0ABE\u0AB9\u0AA8 \u0A85\u0A82\u0A95\u0AB6\u0ABE\u0AB8\u0ACD\u0AA4\u0ACD\u0AB0 \u0A85\u0AA8\u0AC7 \u0AAE\u0ABE\u0AB2\u0ABF\u0A95 \u0AB8\u0AC1\u0AB8\u0A82\u0A97\u0AA4\u0AA4\u0ABE",
    descriptionEn: "Registration number compound reduction and journey protection audit.",
    descriptionHi: "\u0935\u093E\u0939\u0928 \u092A\u0902\u091C\u0940\u0915\u0930\u0923 \u0928\u0902\u092C\u0930, \u0938\u094D\u0935\u093E\u092E\u0940 \u0905\u0928\u0941\u0915\u0942\u0932\u0924\u093E \u090F\u0935\u0902 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u090A\u0930\u094D\u091C\u093E \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923\u0964",
    isFree: false,
    priceInr: 33
  },
  BUSINESS: {
    type: "BUSINESS",
    titleEn: "Business & Corporate Numerology Pro",
    titleHi: "\u0935\u094D\u092F\u093E\u092A\u093E\u0930 \u090F\u0935\u0902 \u0915\u0949\u0930\u094D\u092A\u094B\u0930\u0947\u091F \u0905\u0902\u0915\u0936\u093E\u0938\u094D\u0924\u094D\u0930 \u092A\u094D\u0930\u094B",
    titleMr: "\u0935\u094D\u092F\u0935\u0938\u093E\u092F \u0906\u0923\u093F \u0915\u0949\u0930\u094D\u092A\u094B\u0930\u0947\u091F \u0905\u0902\u0915\u0936\u093E\u0938\u094D\u0924\u094D\u0930 \u092A\u094D\u0930\u094B",
    titleBn: "\u09AC\u09CD\u09AF\u09AC\u09B8\u09BE \u0993 \u0995\u09B0\u09CD\u09AA\u09CB\u09B0\u09C7\u099F \u09B8\u0982\u0996\u09CD\u09AF\u09BE\u09A4\u09A4\u09CD\u09A4\u09CD\u09AC \u09AA\u09CD\u09B0\u09CB",
    titleGu: "\u0AB5\u0ACD\u0AAF\u0AB5\u0AB8\u0ABE\u0AAF \u0A85\u0AA8\u0AC7 \u0A95\u0ACB\u0AB0\u0ACD\u0AAA\u0ACB\u0AB0\u0AC7\u0A9F \u0A85\u0A82\u0A95\u0AB6\u0ABE\u0AB8\u0ACD\u0AA4\u0ACD\u0AB0 \u0AAA\u0ACD\u0AB0\u0ACB",
    descriptionEn: "Firm name, brand harmony, partner synastry, and revenue vibration.",
    descriptionHi: "\u092B\u0930\u094D\u092E \u0928\u093E\u092E, \u091F\u094D\u0930\u0947\u0921\u092E\u093E\u0930\u094D\u0915 \u0915\u0902\u092A\u0928, \u0938\u093E\u091D\u0947\u0926\u093E\u0930 \u0924\u093E\u0932\u092E\u0947\u0932 \u090F\u0935\u0902 \u0935\u094D\u092F\u093E\u092A\u093E\u0930 \u0935\u093F\u0938\u094D\u0924\u093E\u0930 \u0930\u093F\u092A\u094B\u0930\u094D\u091F\u0964",
    isFree: false,
    priceInr: 33
  },
  MARRIAGE: {
    type: "MARRIAGE",
    titleEn: "Marriage Synastry & Compatibility Pro",
    titleHi: "\u0935\u093F\u0935\u093E\u0939 \u0905\u0928\u0941\u0915\u0942\u0932\u0924\u093E \u090F\u0935\u0902 \u0938\u0902\u092C\u0902\u0927 \u092E\u093F\u0932\u093E\u0928 \u092A\u094D\u0930\u094B",
    titleMr: "\u0935\u093F\u0935\u093E\u0939 \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E \u0906\u0923\u093F \u0938\u0902\u092C\u0902\u0927 \u091C\u0941\u0933\u0923\u0940 \u092A\u094D\u0930\u094B",
    titleBn: "\u09AC\u09BF\u09AC\u09BE\u09B9 \u09B8\u09BE\u09AE\u099E\u09CD\u099C\u09B8\u09CD\u09AF \u0993 \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995 \u09AE\u09BF\u09B2\u09A8 \u09AA\u09CD\u09B0\u09CB",
    titleGu: "\u0AB2\u0A97\u0ACD\u0AA8 \u0AB8\u0AC1\u0AB8\u0A82\u0A97\u0AA4\u0AA4\u0ABE \u0A85\u0AA8\u0AC7 \u0AB8\u0A82\u0AAC\u0A82\u0AA7 \u0AAE\u0AC7\u0AB3\u0ABE\u0AAA \u0AAA\u0ACD\u0AB0\u0ACB",
    descriptionEn: "Multi-layer synastry, karmic synergy, and lifelong harmony report.",
    descriptionHi: "\u0926\u094D\u0935\u093F-\u092A\u0915\u094D\u0937\u0940\u092F \u0917\u094D\u0930\u093F\u0921 \u092E\u093F\u0932\u093E\u0928, \u0915\u093E\u0930\u094D\u092E\u093F\u0915 \u0924\u093E\u0932\u092E\u0947\u0932 \u090F\u0935\u0902 \u0935\u0948\u0935\u093E\u0939\u093F\u0915 \u0938\u0902\u0924\u0941\u0932\u0928 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928\u0964",
    isFree: false,
    priceInr: 33
  },
  CHILD_NAMES: {
    type: "CHILD_NAMES",
    titleEn: "Child Lucky Names & Coordinate Selection",
    titleHi: "\u0936\u093F\u0936\u0941 \u0932\u0915\u0940 \u0928\u093E\u092E \u091A\u092F\u0928 \u090F\u0935\u0902 \u0917\u094D\u0930\u093F\u0921 \u0938\u092E\u0928\u094D\u0935\u092F",
    titleMr: "\u092C\u093E\u0933\u093E\u091A\u0947 \u092D\u093E\u0917\u094D\u092F\u0935\u093E\u0928 \u0928\u093E\u0935 \u0928\u093F\u0935\u0921 \u0906\u0923\u093F \u0917\u094D\u0930\u093F\u0921 \u0938\u092E\u0928\u094D\u0935\u092F",
    titleBn: "\u09B6\u09BF\u09B6\u09C1\u09B0 \u09B2\u09BE\u0995\u09BF \u09A8\u09BE\u09AE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0993 \u0997\u09CD\u09B0\u09BF\u09A1 \u09B8\u09AE\u09A8\u09CD\u09AC\u09AF\u09BC",
    titleGu: "\u0AAC\u0ABE\u0AB3\u0A95\u0AA8\u0ABE \u0AB2\u0A95\u0AC0 \u0AA8\u0ABE\u0AAE \u0AAA\u0AB8\u0A82\u0AA6\u0A97\u0AC0 \u0A85\u0AA8\u0AC7 \u0A97\u0ACD\u0AB0\u0AC0\u0AA1 \u0AB8\u0A82\u0A95\u0AB2\u0AA8",
    descriptionEn: "Vedic natal coordinate balancing and curated auspicious name list.",
    descriptionHi: "\u091C\u0928\u094D\u092E\u0924\u093F\u0925\u093F \u0905\u0928\u0941\u0938\u093E\u0930 \u0936\u0941\u092D \u0928\u093E\u092E\u093E\u0915\u094D\u0937\u0930, \u0917\u094D\u0930\u093F\u0921 \u0938\u0902\u0924\u0941\u0932\u0928 \u090F\u0935\u0902 \u091A\u092F\u0928\u093F\u0924 \u0928\u093E\u092E\u094B\u0902 \u0915\u0940 \u0938\u0942\u091A\u0940\u0964",
    isFree: false,
    priceInr: 33
  },
  LUCKY_DATES: {
    type: "LUCKY_DATES",
    titleEn: "Lucky Dates & Auspicious Muhurta Finder",
    titleHi: "\u0936\u0941\u092D \u0924\u093F\u0925\u093F\u092F\u093E\u0902 \u090F\u0935\u0902 \u0905\u0928\u0941\u0915\u0942\u0932 \u092E\u0941\u0939\u0942\u0930\u094D\u0924 \u091A\u092F\u0928",
    titleMr: "\u0936\u0941\u092D \u0924\u093E\u0930\u0916\u093E \u0906\u0923\u093F \u0905\u0928\u0941\u0915\u0942\u0932 \u092E\u0941\u0939\u0942\u0930\u094D\u0924 \u0928\u093F\u0935\u0921",
    titleBn: "\u09B6\u09C1\u09AD \u09A4\u09BE\u09B0\u09BF\u0996 \u0993 \u0985\u09A8\u09C1\u0995\u09C2\u09B2 \u09AE\u09C1\u09B9\u09C2\u09B0\u09CD\u09A4 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8",
    titleGu: "\u0AB6\u0AC1\u0AAD \u0AA4\u0ABE\u0AB0\u0AC0\u0A96\u0ACB \u0A85\u0AA8\u0AC7 \u0A85\u0AA8\u0AC1\u0A95\u0AC2\u0AB3 \u0AAE\u0AC1\u0AB9\u0AC2\u0AB0\u0ACD\u0AA4 \u0AAA\u0AB8\u0A82\u0AA6\u0A97\u0AC0",
    descriptionEn: "Personalized date scoring for business, property, surgery, and travel.",
    descriptionHi: "\u0915\u093E\u0930\u094D\u092F \u0915\u0947 \u0909\u0926\u094D\u0926\u0947\u0936\u094D\u092F \u0905\u0928\u0941\u0938\u093E\u0930 \u092E\u0942\u0932\u093E\u0902\u0915, \u092D\u093E\u0917\u094D\u092F\u093E\u0902\u0915 \u0935 \u0935\u093E\u0930-\u0917\u094D\u0930\u0939 \u0905\u0928\u0941\u0915\u0942\u0932 \u0924\u093F\u0925\u093F\u092F\u093E\u0902\u0964",
    isFree: false,
    priceInr: 33
  },
  DASHA: {
    type: "DASHA",
    titleEn: "Vedic Mahadasha & Antardasha Time Cycles",
    titleHi: "\u0935\u0948\u0926\u093F\u0915 \u092E\u0939\u093E\u0926\u0936\u093E \u090F\u0935\u0902 \u0905\u0902\u0924\u0930\u094D\u0926\u0936\u093E \u0938\u092E\u092F \u091A\u0915\u094D\u0930",
    titleMr: "\u0935\u0948\u0926\u093F\u0915 \u092E\u0939\u093E\u0926\u0936\u093E \u0906\u0923\u093F \u0905\u0902\u0924\u0930\u094D\u0926\u0936\u093E \u0935\u0947\u0933 \u091A\u0915\u094D\u0930",
    titleBn: "\u09AC\u09C8\u09A6\u09BF\u0995 \u09AE\u09B9\u09BE\u09A6\u09B6\u09BE \u0993 \u0985\u09A8\u09CD\u09A4\u09B0\u09CD\u09A6\u09B6\u09BE \u09B8\u09AE\u09AF\u09BC \u099A\u0995\u09CD\u09B0",
    titleGu: "\u0AB5\u0AC8\u0AA6\u0ABF\u0A95 \u0AAE\u0AB9\u0ABE\u0AA6\u0AB6\u0ABE \u0A85\u0AA8\u0AC7 \u0A85\u0A82\u0AA4\u0AB0\u0ACD\u0AA6\u0AB6\u0ABE \u0AB8\u0AAE\u0AAF \u0A9A\u0A95\u0ACD\u0AB0",
    descriptionEn: "Yearly and monthly planetary dasha transit periods and remedies.",
    descriptionHi: "\u0935\u093E\u0930\u094D\u0937\u093F\u0915 \u090F\u0935\u0902 \u092E\u093E\u0938\u093F\u0915 \u0917\u094D\u0930\u0939\u0940\u092F \u0926\u0936\u093E \u0938\u0902\u0915\u094D\u0930\u092E\u0923 \u0915\u093E\u0932, \u092A\u094D\u0930\u092D\u093E\u0935 \u090F\u0935\u0902 \u0938\u093F\u0926\u094D\u0927 \u0909\u092A\u093E\u092F\u0964",
    isFree: false,
    priceInr: 33
  },
  YEAR_FORECAST: {
    type: "YEAR_FORECAST",
    titleEn: "Personal Year & Multi-Year Forecast",
    titleHi: "\u0935\u094D\u092F\u0915\u094D\u0924\u093F\u0917\u0924 \u0935\u0930\u094D\u0937 \u090F\u0935\u0902 3-\u0935\u0930\u094D\u0937\u0940\u092F \u0938\u092E\u092F \u091A\u0915\u094D\u0930",
    titleMr: "\u0935\u0948\u092F\u0915\u094D\u0924\u093F\u0915 \u0935\u0930\u094D\u0937 \u0906\u0923\u093F 3-\u0935\u0930\u094D\u0937\u0940\u092F \u0935\u0947\u0933 \u091A\u0915\u094D\u0930",
    titleBn: "\u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09AC\u099B\u09B0 \u0993 \u09E9-\u09AC\u099B\u09B0\u09C7\u09B0 \u09B8\u09AE\u09AF\u09BC \u099A\u0995\u09CD\u09B0",
    titleGu: "\u0AB5\u0ACD\u0AAF\u0A95\u0ACD\u0AA4\u0ABF\u0A97\u0AA4 \u0AB5\u0AB0\u0ACD\u0AB7 \u0A85\u0AA8\u0AC7 3-\u0AB5\u0ABE\u0AB0\u0ACD\u0AB7\u0ABF\u0A95 \u0AB8\u0AAE\u0AAF \u0A9A\u0A95\u0ACD\u0AB0",
    descriptionEn: "Current, upcoming, and long-term annual vibration forecast.",
    descriptionHi: "\u0935\u0930\u094D\u0924\u092E\u093E\u0928, \u0906\u0917\u093E\u092E\u0940 \u090F\u0935\u0902 \u0926\u0940\u0930\u094D\u0918\u0915\u093E\u0932\u093F\u0915 \u0935\u093E\u0930\u094D\u0937\u093F\u0915 \u090A\u0930\u094D\u091C\u093E \u0915\u0902\u092A\u0928 \u090F\u0935\u0902 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928\u0964",
    isFree: false,
    priceInr: 33
  }
};

// src/server/db.ts
import pg from "pg";
var { Pool } = pg;
function getDatabaseConnectionString() {
  if (typeof process === "undefined" || !process.env) return null;
  const candidates = [
    process.env.SUPABASE_DB_URL,
    process.env.POSTGRES_URL,
    process.env.SUPABASE_POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.DATABASE_URL
  ];
  for (const url of candidates) {
    if (!url || typeof url !== "string") continue;
    const trimmed = url.trim();
    if (!trimmed.startsWith("postgres://") && !trimmed.startsWith("postgresql://")) {
      continue;
    }
    if (trimmed.includes("[YOUR-") || trimmed.includes("YOUR-PROJECT-REF") || trimmed.includes("[YOUR-PASSWORD]") || trimmed.includes("example.com")) {
      continue;
    }
    return trimmed;
  }
  return null;
}
function isDatabaseConfigured() {
  return !!getDatabaseConnectionString();
}
var poolInstance = null;
var schemaInitPromise = null;
var schemaInitialized = false;
function getDatabasePool() {
  if (poolInstance) {
    return poolInstance;
  }
  const connectionString = getDatabaseConnectionString();
  if (!connectionString) {
    throw new Error("DATABASE_NOT_CONFIGURED: PostgreSQL connection string is missing in environment variables.");
  }
  const isLocalhost = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
  poolInstance = new Pool({
    connectionString,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
    max: 3,
    // Serverless-friendly low connection footprint
    idleTimeoutMillis: 1e4,
    connectionTimeoutMillis: 5e3
  });
  poolInstance.on("error", (err) => {
    console.error("[PostgreSQL Pool Notice] Idle client error:", err?.message || err);
  });
  return poolInstance;
}
async function query(text, params = []) {
  const pool = getDatabasePool();
  return await pool.query(text, params);
}
async function withTransaction(callback) {
  const pool = getDatabasePool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (e) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      console.warn("[PostgreSQL Transaction] Rollback notice:", rollbackErr);
    }
    throw e;
  } finally {
    client.release();
  }
}
async function ensureDatabaseSchema() {
  if (schemaInitialized || !isDatabaseConfigured()) {
    return;
  }
  if (schemaInitPromise) {
    return await schemaInitPromise;
  }
  schemaInitPromise = (async () => {
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(64) PRIMARY KEY,
          supabase_user_id VARCHAR(64),
          email VARCHAR(255),
          email_verified BOOLEAN NOT NULL DEFAULT FALSE,
          mobile VARCHAR(15),
          mobile_verified BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ALTER TABLE users ADD COLUMN IF NOT EXISTS supabase_user_id VARCHAR(64);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile VARCHAR(15);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile_verified BOOLEAN NOT NULL DEFAULT FALSE;
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_mobile_unique ON users(mobile) WHERE mobile IS NOT NULL AND mobile != '';
        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_supabase_id_unique ON users(supabase_user_id) WHERE supabase_user_id IS NOT NULL;
      `);
      await query(`
        CREATE TABLE IF NOT EXISTS free_claims (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          supabase_user_id VARCHAR(64),
          email VARCHAR(255),
          mobile VARCHAR(15),
          report_type VARCHAR(64) NOT NULL,
          profile_key VARCHAR(128) NOT NULL,
          claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ALTER TABLE free_claims ADD COLUMN IF NOT EXISTS supabase_user_id VARCHAR(64);
        ALTER TABLE free_claims ADD COLUMN IF NOT EXISTS email VARCHAR(255);
        ALTER TABLE free_claims ADD COLUMN IF NOT EXISTS mobile VARCHAR(15);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_free_claims_user_unique ON free_claims(user_id);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_free_claims_supabase_unique ON free_claims(supabase_user_id) WHERE supabase_user_id IS NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_free_claims_email ON free_claims(email);
      `);
      await query(`
        CREATE TABLE IF NOT EXISTS entitlements (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          supabase_user_id VARCHAR(64),
          email VARCHAR(255),
          mobile VARCHAR(15),
          report_type VARCHAR(64) NOT NULL,
          profile_key VARCHAR(128) NOT NULL,
          access_type VARCHAR(32) NOT NULL,
          amount INT NOT NULL DEFAULT 0,
          currency VARCHAR(8) NOT NULL DEFAULT 'INR',
          payment_status VARCHAR(32) NOT NULL DEFAULT 'GRANTED',
          razorpay_order_id VARCHAR(128),
          razorpay_payment_id VARCHAR(128),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ALTER TABLE entitlements ADD COLUMN IF NOT EXISTS supabase_user_id VARCHAR(64);
        ALTER TABLE entitlements ADD COLUMN IF NOT EXISTS email VARCHAR(255);
        ALTER TABLE entitlements ADD COLUMN IF NOT EXISTS mobile VARCHAR(15);
        CREATE INDEX IF NOT EXISTS idx_entitlements_supabase ON entitlements(supabase_user_id);
        CREATE INDEX IF NOT EXISTS idx_entitlements_email ON entitlements(email);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_entitlements_user_profile_report_unique ON entitlements(user_id, profile_key, report_type);
        CREATE INDEX IF NOT EXISTS idx_entitlements_rzp_pay ON entitlements(razorpay_payment_id);
      `);
      await query(`
        CREATE TABLE IF NOT EXISTS payment_transactions (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          supabase_user_id VARCHAR(64),
          email VARCHAR(255),
          mobile VARCHAR(15),
          profile_key VARCHAR(128) NOT NULL,
          report_type VARCHAR(64) NOT NULL,
          razorpay_order_id VARCHAR(128) NOT NULL,
          razorpay_payment_id VARCHAR(128),
          amount INT NOT NULL,
          currency VARCHAR(8) NOT NULL DEFAULT 'INR',
          status VARCHAR(32) NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS supabase_user_id VARCHAR(64);
        ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS email VARCHAR(255);
        ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS mobile VARCHAR(15);
        CREATE INDEX IF NOT EXISTS idx_tx_user ON payment_transactions(user_id);
        CREATE INDEX IF NOT EXISTS idx_tx_supabase ON payment_transactions(supabase_user_id);
        CREATE INDEX IF NOT EXISTS idx_tx_email ON payment_transactions(email);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_tx_order_id_unique ON payment_transactions(razorpay_order_id);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_tx_payment_id_unique ON payment_transactions(razorpay_payment_id) WHERE razorpay_payment_id IS NOT NULL AND razorpay_payment_id != '';
      `);
      await query(`
        CREATE TABLE IF NOT EXISTS payment_webhook_events (
          id VARCHAR(64) PRIMARY KEY,
          event_id VARCHAR(128) NOT NULL UNIQUE,
          event_type VARCHAR(64) NOT NULL,
          processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_webhook_event_id ON payment_webhook_events(event_id);
      `);
      schemaInitialized = true;
      console.log("[PostgreSQL] Durable database schema initialized successfully.");
    } catch (err) {
      console.error("[PostgreSQL] Schema initialization warning:", err?.message || err);
    } finally {
      schemaInitPromise = null;
    }
  })();
  return await schemaInitPromise;
}

// src/server/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";
var getSupabaseUrl = () => {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://placeholder-leofamily.supabase.co";
};
var getSupabaseKey = () => {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";
};
var isSupabaseServerConfigured = () => {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  return !!url && !url.includes("placeholder") && !url.includes("[YOUR-") && !!key && !key.includes("placeholder");
};
var serverSupabaseClient = null;
var getServerSupabaseClient = () => {
  if (serverSupabaseClient) return serverSupabaseClient;
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  serverSupabaseClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  return serverSupabaseClient;
};
async function verifySupabaseToken(token) {
  if (!token || typeof token !== "string") return null;
  const cleanToken = token.startsWith("Bearer ") ? token.substring(7).trim() : token.trim();
  if (!cleanToken) return null;
  if (isSupabaseServerConfigured()) {
    try {
      const client = getServerSupabaseClient();
      const { data, error } = await client.auth.getUser(cleanToken);
      if (error || !data.user) {
        return null;
      }
      return {
        supabaseUserId: data.user.id,
        email: data.user.email || "",
        emailVerified: !!(data.user.email_confirmed_at || data.user.confirmed_at)
      };
    } catch {
      return null;
    }
  }
  return null;
}

// src/server/accessEngine.ts
var REPORT_PRICE_INR = 33;
var REPORT_PRICE_PAISE = 3300;
function isServerlessRuntime() {
  return !!(typeof process !== "undefined" && process.env?.VERCEL || typeof process !== "undefined" && process.env?.AWS_LAMBDA_FUNCTION_VERSION || typeof process !== "undefined" && process.env?.NODE_ENV === "production");
}
function getSafeConfigAudit() {
  const env = typeof process !== "undefined" && process.env || {};
  return {
    AUTH_PROVIDER: "SUPABASE_EMAIL_OTP",
    SUPABASE_AUTH_CONFIGURED: isSupabaseServerConfigured(),
    SUPABASE_URL_PRESENT: !!(env.SUPABASE_URL || env.VITE_SUPABASE_URL),
    SUPABASE_KEY_PRESENT: !!(env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY),
    DATABASE_CONFIGURED: isDatabaseConfigured(),
    RAZORPAY_KEY_PRESENT: !!env.RAZORPAY_KEY_ID,
    RAZORPAY_SECRET_PRESENT: !!env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_PRESENT: !!env.RAZORPAY_WEBHOOK_SECRET,
    GEMINI_KEY_PRESENT: !!env.GEMINI_API_KEY,
    IS_SERVERLESS_RUNTIME: isServerlessRuntime()
  };
}
function getRazorpayKeyId() {
  return typeof process !== "undefined" && process.env?.RAZORPAY_KEY_ID || "rzp_test_leofamily_sandbox";
}
function getRazorpayKeySecret() {
  return typeof process !== "undefined" && process.env?.RAZORPAY_KEY_SECRET || "sandbox_secret_leofamily_2026";
}
function getRazorpayWebhookSecret() {
  return typeof process !== "undefined" && process.env?.RAZORPAY_WEBHOOK_SECRET || "sandbox_webhook_secret_leofamily_2026";
}
function normalizeEmail(rawEmail) {
  if (!rawEmail || typeof rawEmail !== "string") return "";
  return rawEmail.trim().toLowerCase();
}
var LocalSandboxFallback = class {
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.freeClaims = /* @__PURE__ */ new Map();
    this.entitlements = /* @__PURE__ */ new Map();
    this.orders = /* @__PURE__ */ new Map();
    this.payments = /* @__PURE__ */ new Map();
    this.processedEvents = /* @__PURE__ */ new Set();
  }
};
var ReportAccessEngine = class {
  constructor() {
    this.localSandbox = new LocalSandboxFallback();
  }
  async ensureDb() {
    if (isDatabaseConfigured()) {
      await ensureDatabaseSchema();
    } else if (isServerlessRuntime()) {
      throw new Error("DATABASE_UNAVAILABLE: Database connection is required in production environment.");
    }
  }
  /**
   * Cryptographically resolve and authenticate user session from Supabase Bearer Token
   */
  async resolveAuthenticatedUser(authHeader, optionalEmail) {
    const cleanEmail = normalizeEmail(optionalEmail);
    if (authHeader) {
      const supabaseUser = await verifySupabaseToken(authHeader);
      if (supabaseUser) {
        await this.ensureDb();
        const userEmail = normalizeEmail(supabaseUser.email) || cleanEmail;
        const supabaseId = supabaseUser.supabaseUserId;
        const isVerified = supabaseUser.emailVerified;
        if (process.env.NODE_ENV !== "production") {
          console.log(`[AuthEngine:ResolveUser] Resolved Supabase ID: ${supabaseId} (Verified: ${isVerified})`);
        }
        if (isDatabaseConfigured()) {
          const generatedId = `usr_${crypto.randomBytes(8).toString("hex")}`;
          const upsertRes = await query(
            `INSERT INTO users (id, supabase_user_id, email, email_verified, created_at, updated_at)
             VALUES ($1, $2, $3, $4, NOW(), NOW())
             ON CONFLICT (supabase_user_id) WHERE supabase_user_id IS NOT NULL
             DO UPDATE SET email = EXCLUDED.email, email_verified = EXCLUDED.email_verified, updated_at = NOW()
             RETURNING id, supabase_user_id, email, email_verified, mobile`,
            [generatedId, supabaseId, userEmail, isVerified]
          );
          if (upsertRes.rows.length > 0) {
            const row = upsertRes.rows[0];
            return {
              id: row.id,
              supabaseUserId: row.supabase_user_id || supabaseId,
              email: row.email || userEmail,
              emailVerified: row.email_verified ?? isVerified,
              mobile: row.mobile || void 0
            };
          }
        } else {
          let user = this.localSandbox.users.get(supabaseId) || this.localSandbox.users.get(userEmail);
          if (!user) {
            const internalId = `usr_${crypto.randomBytes(8).toString("hex")}`;
            user = {
              id: internalId,
              supabaseUserId: supabaseId,
              email: userEmail,
              emailVerified: isVerified
            };
            this.localSandbox.users.set(supabaseId, user);
            this.localSandbox.users.set(userEmail, user);
          }
          return user;
        }
      }
    }
    if (!isServerlessRuntime() && !isSupabaseServerConfigured() && cleanEmail) {
      await this.ensureDb();
      if (isDatabaseConfigured()) {
        const userRes = await query(`SELECT id, supabase_user_id, email, email_verified, mobile FROM users WHERE email = $1`, [cleanEmail]);
        if (userRes.rows.length > 0) {
          const u = userRes.rows[0];
          return {
            id: u.id,
            supabaseUserId: u.supabase_user_id || u.id,
            email: u.email,
            emailVerified: u.email_verified,
            mobile: u.mobile
          };
        }
      } else {
        const u = this.localSandbox.users.get(cleanEmail);
        if (u) return u;
      }
    }
    return null;
  }
  // 1. Send Email OTP using Supabase Auth
  async sendEmailOtp(rawEmail) {
    const email = normalizeEmail(rawEmail);
    if (!email || !email.includes("@") || !email.includes(".")) {
      throw new Error("\u0915\u0943\u092A\u092F\u093E \u090F\u0915 \u092E\u093E\u0928\u094D\u092F \u0908\u092E\u0947\u0932 \u092A\u0924\u093E \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902 (Please enter a valid email address)");
    }
    if (isSupabaseServerConfigured()) {
      const client = getServerSupabaseClient();
      const productionRedirect = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://complete-mobile-numerology.vercel.app");
      const { error } = await client.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: productionRedirect
        }
      });
      if (error) {
        console.error("Supabase Auth sendEmailOtp error:", error);
        throw new Error(`SUPABASE_AUTH_ERROR: ${error.message || "Unable to send verification email"}`);
      }
    } else {
      console.log(`[Local Development Notice] Supabase Auth Email OTP requested for: ${email}`);
    }
    return {
      success: true,
      message: `OTP sent successfully to ${email}. Please check your inbox and spam folder.`
    };
  }
  // 2. Verify Email OTP using Supabase Auth (or sync verified session)
  async verifyEmailOtp(rawEmail, token, authHeader) {
    const email = normalizeEmail(rawEmail);
    const cleanToken = (token || "").replace(/[\s-]/g, "").trim();
    if (authHeader || cleanToken && cleanToken.length > 30) {
      const header = authHeader || `Bearer ${cleanToken}`;
      const authUser = await this.resolveAuthenticatedUser(header, email);
      if (authUser) {
        return {
          success: true,
          session: {
            access_token: header.replace("Bearer ", "").trim(),
            user: authUser
          },
          user: authUser
        };
      }
    }
    if (!email) {
      throw new Error("Missing email address");
    }
    if (!cleanToken) {
      throw new Error("\u0915\u0943\u092A\u092F\u093E \u0908\u092E\u0947\u0932 \u092A\u0930 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 OTP \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902 (Please enter the OTP sent to your email)");
    }
    if (isSupabaseServerConfigured()) {
      const client = getServerSupabaseClient();
      const { data, error } = await client.auth.verifyOtp({
        email,
        token: cleanToken,
        type: "email"
      });
      if (error || !data.user) {
        console.error("Supabase Auth verifyOtp error:", error);
        throw new Error(`INVALID_OTP: ${error?.message || "Invalid or expired OTP. Please check and retry."}`);
      }
      await this.ensureDb();
      const supabaseId = data.user.id;
      if (isDatabaseConfigured()) {
        const userRes = await query(`SELECT id FROM users WHERE supabase_user_id = $1 OR email = $2`, [supabaseId, email]);
        if (userRes.rows.length === 0) {
          const internalId = `usr_${crypto.randomBytes(8).toString("hex")}`;
          await query(
            `INSERT INTO users (id, supabase_user_id, email, email_verified, created_at, updated_at) VALUES ($1, $2, $3, TRUE, NOW(), NOW())`,
            [internalId, supabaseId, email]
          );
        } else {
          await query(
            `UPDATE users SET supabase_user_id = $1, email = $2, email_verified = TRUE, updated_at = NOW() WHERE id = $3`,
            [supabaseId, email, userRes.rows[0].id]
          );
        }
      }
      return {
        success: true,
        session: data.session,
        user: data.user
      };
    } else {
      let user = this.localSandbox.users.get(email);
      if (!user) {
        const internalId = `usr_${crypto.randomBytes(8).toString("hex")}`;
        user = {
          id: internalId,
          supabaseUserId: `sub_${internalId}`,
          email,
          emailVerified: true
        };
        this.localSandbox.users.set(email, user);
      }
      return {
        success: true,
        session: { access_token: `dev_token_${user.id}`, user },
        user
      };
    }
  }
  // 2b. Synchronize Authenticated Supabase Session & Ensure User Record Exists
  async syncSession(authHeader, optionalEmail) {
    await this.ensureDb();
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      throw new Error("UNAUTHORIZED: Invalid or expired session token");
    }
    let hasClaimedFreeReport = false;
    let freeReportDetails = void 0;
    if (isDatabaseConfigured()) {
      const claimRes = await query(
        `SELECT report_type, profile_key, claimed_at FROM free_claims WHERE user_id = $1 OR supabase_user_id = $2 OR email = $3`,
        [authUser.id, authUser.supabaseUserId, authUser.email]
      );
      if (claimRes.rows.length > 0) {
        hasClaimedFreeReport = true;
        freeReportDetails = {
          reportType: claimRes.rows[0].report_type,
          claimedAt: claimRes.rows[0].claimed_at,
          profileKey: claimRes.rows[0].profile_key
        };
      }
    } else {
      const fc = this.localSandbox.freeClaims.get(authUser.email);
      if (fc) {
        hasClaimedFreeReport = true;
        freeReportDetails = {
          reportType: fc.reportType,
          claimedAt: fc.claimedAt,
          profileKey: fc.profileKey
        };
      }
    }
    return {
      success: true,
      user: {
        id: authUser.id,
        supabaseUserId: authUser.supabaseUserId,
        email: authUser.email,
        emailVerified: authUser.emailVerified,
        mobile: authUser.mobile || "",
        hasClaimedFreeReport,
        freeReportDetails
      }
    };
  }
  // 3. Central Report Access Check
  async checkReportAccess(reportType, profileKey, authHeader, optionalEmail) {
    await this.ensureDb();
    const safeKey = profileKey || "default_profile";
    if (!REPORT_REGISTRY[reportType]) {
      return {
        allowed: false,
        requiresPayment: true,
        isFirstFreeReport: false,
        isFreeReportType: false,
        canClaimFree: false,
        price: REPORT_PRICE_INR,
        reportType,
        profileKey: safeKey,
        reason: "Invalid report type requested"
      };
    }
    if (reportType === "MOBILE_NUMEROLOGY") {
      return {
        allowed: true,
        requiresPayment: false,
        isFirstFreeReport: false,
        isFreeReportType: true,
        canClaimFree: false,
        price: 0,
        reportType,
        profileKey: safeKey,
        accessType: "FREE"
      };
    }
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (authUser) {
      if (isDatabaseConfigured()) {
        const entRes = await query(
          `SELECT id, access_type, amount FROM entitlements WHERE (user_id = $1 OR supabase_user_id = $2) AND profile_key = $3 AND report_type = $4`,
          [authUser.id, authUser.supabaseUserId, safeKey, reportType]
        );
        if (entRes.rows.length > 0) {
          const ent = entRes.rows[0];
          return {
            allowed: true,
            requiresPayment: false,
            isFirstFreeReport: false,
            isFreeReportType: false,
            canClaimFree: false,
            price: ent.amount,
            reportType,
            profileKey: safeKey,
            accessType: ent.access_type,
            entitlementId: ent.id
          };
        }
        const claimRes = await query(
          `SELECT id, report_type FROM free_claims WHERE user_id = $1 OR supabase_user_id = $2`,
          [authUser.id, authUser.supabaseUserId]
        );
        if (claimRes.rows.length === 0) {
          return {
            allowed: false,
            requiresPayment: false,
            isFirstFreeReport: true,
            isFreeReportType: false,
            canClaimFree: true,
            price: 0,
            reportType,
            profileKey: safeKey,
            reason: "Your first specialist report is 100% FREE. Click Claim Free Report to generate."
          };
        } else {
          return {
            allowed: false,
            requiresPayment: true,
            isFirstFreeReport: false,
            isFreeReportType: false,
            canClaimFree: false,
            price: REPORT_PRICE_INR,
            reportType,
            profileKey: safeKey,
            reason: "Free report entitlement already consumed. \u20B933 required per additional report."
          };
        }
      } else {
        const entKey = `${authUser.id}_${reportType}_${safeKey}`;
        const ent = this.localSandbox.entitlements.get(entKey);
        if (ent) {
          return {
            allowed: true,
            requiresPayment: false,
            isFirstFreeReport: false,
            isFreeReportType: false,
            canClaimFree: false,
            price: ent.amount,
            reportType,
            profileKey: safeKey,
            accessType: ent.accessType,
            entitlementId: ent.id
          };
        }
        const freeClaim = this.localSandbox.freeClaims.get(authUser.id) || this.localSandbox.freeClaims.get(authUser.email);
        if (!freeClaim) {
          return {
            allowed: false,
            requiresPayment: false,
            isFirstFreeReport: true,
            isFreeReportType: false,
            canClaimFree: true,
            price: 0,
            reportType,
            profileKey: safeKey,
            reason: "Your first specialist report is 100% FREE. Click Claim Free Report to generate."
          };
        } else {
          return {
            allowed: false,
            requiresPayment: true,
            isFirstFreeReport: false,
            isFreeReportType: false,
            canClaimFree: false,
            price: REPORT_PRICE_INR,
            reportType,
            profileKey: safeKey,
            reason: "Free report entitlement already consumed. \u20B933 required per additional report."
          };
        }
      }
    }
    return {
      allowed: false,
      requiresPayment: false,
      isFirstFreeReport: true,
      isFreeReportType: false,
      canClaimFree: false,
      price: REPORT_PRICE_INR,
      reportType,
      profileKey: safeKey,
      reason: "Please verify email to access your report."
    };
  }
  // 4. Claim First Free Report (Atomic ACID Transaction & DB Unique Constraint)
  async claimFreeReport(reportType, profileKey, authHeader, optionalEmail) {
    await this.ensureDb();
    if (reportType === "MOBILE_NUMEROLOGY") {
      throw new Error("Mobile Numerology is already permanently free");
    }
    if (!REPORT_REGISTRY[reportType]) {
      throw new Error("Invalid report type");
    }
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      throw new Error("UNAUTHORIZED: Valid authenticated email session is required to claim free report.");
    }
    const { id: userId, supabaseUserId, email } = authUser;
    const safeKey = profileKey || "default_profile";
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (isDatabaseConfigured()) {
      return await withTransaction(async (client) => {
        const existingClaimRes = await client.query(
          `SELECT report_type FROM free_claims WHERE user_id = $1 OR supabase_user_id = $2`,
          [userId, supabaseUserId]
        );
        if (existingClaimRes.rows.length > 0) {
          throw new Error(`\u092E\u0941\u092B\u093C\u094D\u0924 \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u0905\u0927\u093F\u0915\u093E\u0930 \u092A\u0939\u0932\u0947 \u0939\u0940 ${existingClaimRes.rows[0].report_type} \u0915\u0947 \u0932\u093F\u090F \u0909\u092A\u092F\u094B\u0917 \u0915\u093F\u092F\u093E \u091C\u093E \u091A\u0941\u0915\u093E \u0939\u0948\u0964 Additional reports are \u20B933.`);
        }
        const claimId = `claim_${crypto.randomBytes(8).toString("hex")}`;
        try {
          await client.query(
            `INSERT INTO free_claims (id, user_id, supabase_user_id, email, report_type, profile_key, claimed_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [claimId, userId, supabaseUserId, email, reportType, safeKey]
          );
        } catch (dbErr) {
          if (dbErr?.code === "23505") {
            throw new Error("\u092E\u0941\u092B\u093C\u094D\u0924 \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u0905\u0927\u093F\u0915\u093E\u0930 \u092A\u0939\u0932\u0947 \u0939\u0940 \u0909\u092A\u092F\u094B\u0917 \u0915\u093F\u092F\u093E \u091C\u093E \u091A\u0941\u0915\u093E \u0939\u0948\u0964 (Free report entitlement already claimed)");
          }
          throw dbErr;
        }
        const entitlementId = `ent_free_${crypto.randomBytes(8).toString("hex")}`;
        await client.query(
          `INSERT INTO entitlements (id, user_id, supabase_user_id, email, report_type, profile_key, access_type, amount, currency, payment_status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'FREE', 0, 'INR', 'GRANTED', NOW(), NOW())
           ON CONFLICT (user_id, profile_key, report_type) DO NOTHING`,
          [entitlementId, userId, supabaseUserId, email, reportType, safeKey]
        );
        const entitlement = {
          id: entitlementId,
          userId,
          mobile: email,
          reportType,
          profileKey: safeKey,
          accessType: "FREE",
          amount: 0,
          paymentStatus: "GRANTED",
          createdAt: now
        };
        return { success: true, allowed: true, entitlement };
      });
    } else {
      if (this.localSandbox.freeClaims.has(userId) || this.localSandbox.freeClaims.has(email)) {
        throw new Error("\u092E\u0941\u092B\u093C\u094D\u0924 \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u0905\u0927\u093F\u0915\u093E\u0930 \u092A\u0939\u0932\u0947 \u0939\u0940 \u0909\u092A\u092F\u094B\u0917 \u0915\u093F\u092F\u093E \u091C\u093E \u091A\u0941\u0915\u093E \u0939\u0948\u0964");
      }
      this.localSandbox.freeClaims.set(userId, {
        userId,
        supabaseUserId,
        email,
        reportType,
        profileKey: safeKey,
        claimedAt: now
      });
      const entitlementId = `ent_free_${crypto.randomBytes(8).toString("hex")}`;
      const entitlement = {
        id: entitlementId,
        userId,
        mobile: email,
        reportType,
        profileKey: safeKey,
        accessType: "FREE",
        amount: 0,
        paymentStatus: "GRANTED",
        createdAt: now
      };
      this.localSandbox.entitlements.set(`${userId}_${reportType}_${safeKey}`, entitlement);
      return { success: true, allowed: true, entitlement };
    }
  }
  // 5. Create ₹33 Razorpay Payment Order (Strict Fail-Closed Integration)
  async createPaymentOrder(reportType, profileKey, authHeader, optionalEmail) {
    await this.ensureDb();
    if (!REPORT_REGISTRY[reportType]) {
      throw new Error("Invalid report type");
    }
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      throw new Error("UNAUTHORIZED: Please verify email before initiating payment.");
    }
    const { id: userId, supabaseUserId, email } = authUser;
    const safeKey = profileKey || "default_profile";
    const keyId = getRazorpayKeyId();
    const keySecret = getRazorpayKeySecret();
    const receipt = `rcpt_${Date.now()}_${reportType.substring(0, 4).toLowerCase()}`;
    if (!keyId || !keySecret) {
      if (isServerlessRuntime()) {
        throw new Error("PAYMENT_CONFIGURATION_ERROR: Razorpay gateway credentials are not configured.");
      }
    }
    let razorpayOrderId = "";
    if (keyId && keySecret && keyId.startsWith("rzp_")) {
      try {
        const rzpAuthHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6e3);
        const response = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": rzpAuthHeader
          },
          body: JSON.stringify({
            amount: REPORT_PRICE_PAISE,
            currency: "INR",
            receipt,
            notes: {
              userId,
              supabaseUserId,
              email,
              profileKey: safeKey,
              reportType
            }
          }),
          signal: controller.signal
        }).finally(() => clearTimeout(timeout));
        if (!response.ok) {
          const errBody = await response.text();
          console.error("Razorpay API order error response:", errBody);
          throw new Error("PAYMENT_PROVIDER_UNAVAILABLE: Razorpay order generation failed.");
        }
        const rzpData = await response.json();
        if (!rzpData?.id) {
          throw new Error("PAYMENT_PROVIDER_UNAVAILABLE: Invalid response from Razorpay.");
        }
        razorpayOrderId = rzpData.id;
      } catch (err) {
        console.error("Razorpay order generation error:", err?.message || err);
        throw new Error(err?.message || "PAYMENT_PROVIDER_UNAVAILABLE: Could not create payment order with gateway.");
      }
    } else {
      if (isServerlessRuntime()) {
        throw new Error("PAYMENT_CONFIGURATION_ERROR: Valid Razorpay Key ID and Secret are required in production.");
      }
      razorpayOrderId = `order_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    }
    if (isDatabaseConfigured()) {
      const txId = `tx_${crypto.randomBytes(8).toString("hex")}`;
      await query(
        `INSERT INTO payment_transactions (id, user_id, supabase_user_id, email, profile_key, report_type, razorpay_order_id, amount, currency, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'INR', 'CREATED', NOW(), NOW())
         ON CONFLICT (razorpay_order_id) DO NOTHING`,
        [txId, userId, supabaseUserId, email, safeKey, reportType, razorpayOrderId, REPORT_PRICE_INR]
      );
    } else {
      this.localSandbox.orders.set(razorpayOrderId, {
        orderId: razorpayOrderId,
        userId,
        email,
        reportType,
        profileKey: safeKey,
        amount: REPORT_PRICE_INR,
        status: "CREATED"
      });
    }
    return {
      orderId: razorpayOrderId,
      amount: REPORT_PRICE_INR,
      amountPaise: REPORT_PRICE_PAISE,
      currency: "INR",
      keyId,
      reportType,
      profileKey: safeKey,
      mobile: email,
      receipt
    };
  }
  // 6. Verify Razorpay Payment Signature & Grant Entitlement (ACID Transaction)
  async verifyPayment(orderId, paymentId, signature, reportType, profileKey, authHeader, optionalEmail) {
    await this.ensureDb();
    if (!orderId || !paymentId) {
      throw new Error("Missing orderId or paymentId");
    }
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      throw new Error("UNAUTHORIZED: Valid authenticated email session required for payment verification.");
    }
    const { id: userId, supabaseUserId, email } = authUser;
    const safeKey = profileKey || "default_profile";
    const keySecret = getRazorpayKeySecret();
    if (!keySecret) {
      throw new Error("PAYMENT_CONFIGURATION_ERROR: RAZORPAY_KEY_SECRET is not configured on server.");
    }
    const expectedSignature = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
    if (signature !== expectedSignature) {
      throw new Error("\u0905\u0935\u0948\u0927 \u092D\u0941\u0917\u0924\u093E\u0928 \u0939\u0938\u094D\u0924\u093E\u0915\u094D\u0937\u0930 (Invalid Razorpay payment signature verification failed)");
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (isDatabaseConfigured()) {
      return await withTransaction(async (client) => {
        const orderRes = await client.query(
          `SELECT user_id, supabase_user_id, report_type, profile_key, amount FROM payment_transactions WHERE razorpay_order_id = $1`,
          [orderId]
        );
        if (orderRes.rows.length === 0) {
          throw new Error("PAYMENT_VERIFICATION_FAILED: Order ID was not generated by LeoFamily server.");
        }
        const txOrder = orderRes.rows[0];
        if (txOrder.user_id !== userId && txOrder.supabase_user_id !== supabaseUserId || txOrder.report_type !== reportType || txOrder.profile_key !== safeKey || Number(txOrder.amount) !== REPORT_PRICE_INR) {
          throw new Error("PAYMENT_VERIFICATION_FAILED: Order details mismatch (user, profile, reportType, or amount).");
        }
        const existingEntRes = await client.query(
          `SELECT id, user_id, supabase_user_id, email, report_type, profile_key, access_type, amount, created_at FROM entitlements WHERE (user_id = $1 OR supabase_user_id = $2) AND profile_key = $3 AND report_type = $4`,
          [userId, supabaseUserId, safeKey, reportType]
        );
        if (existingEntRes.rows.length > 0) {
          const e = existingEntRes.rows[0];
          return {
            success: true,
            accessGranted: true,
            entitlement: {
              id: e.id,
              userId: e.user_id,
              mobile: e.email || email,
              reportType: e.report_type,
              profileKey: e.profile_key,
              accessType: e.access_type,
              amount: e.amount,
              paymentId,
              orderId,
              paymentStatus: "PAID",
              createdAt: e.created_at
            }
          };
        }
        const txId = `tx_${crypto.randomBytes(8).toString("hex")}`;
        await client.query(
          `INSERT INTO payment_transactions (id, user_id, supabase_user_id, email, profile_key, report_type, razorpay_order_id, razorpay_payment_id, amount, currency, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'INR', 'PAID', NOW(), NOW())
           ON CONFLICT (razorpay_order_id) DO UPDATE SET razorpay_payment_id = $8, status = 'PAID', updated_at = NOW()`,
          [txId, userId, supabaseUserId, email, safeKey, reportType, orderId, paymentId, REPORT_PRICE_INR]
        );
        const entitlementId = `ent_paid_${crypto.randomBytes(8).toString("hex")}`;
        await client.query(
          `INSERT INTO entitlements (id, user_id, supabase_user_id, email, report_type, profile_key, access_type, amount, currency, payment_status, razorpay_order_id, razorpay_payment_id, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'PAID', $7, 'INR', 'PAID', $8, $9, NOW(), NOW())
           ON CONFLICT (user_id, profile_key, report_type) DO UPDATE SET payment_status = 'PAID', updated_at = NOW()`,
          [entitlementId, userId, supabaseUserId, email, reportType, safeKey, REPORT_PRICE_INR, orderId, paymentId]
        );
        const entitlement = {
          id: entitlementId,
          userId,
          mobile: email,
          reportType,
          profileKey: safeKey,
          accessType: "PAID",
          amount: REPORT_PRICE_INR,
          paymentId,
          orderId,
          paymentStatus: "PAID",
          createdAt: now
        };
        return { success: true, accessGranted: true, entitlement };
      });
    } else {
      const entKey = `${userId}_${reportType}_${safeKey}`;
      const existing = this.localSandbox.entitlements.get(entKey);
      if (existing) {
        return { success: true, accessGranted: true, entitlement: existing };
      }
      const entitlement = {
        id: `ent_paid_${crypto.randomBytes(8).toString("hex")}`,
        userId,
        mobile: email,
        reportType,
        profileKey: safeKey,
        accessType: "PAID",
        amount: REPORT_PRICE_INR,
        paymentId,
        orderId,
        paymentStatus: "PAID",
        createdAt: now
      };
      this.localSandbox.entitlements.set(entKey, entitlement);
      this.localSandbox.payments.set(paymentId, {
        internalUserId: userId,
        email,
        profileKey: safeKey,
        reportType,
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        amount: REPORT_PRICE_INR,
        currency: "INR",
        paymentStatus: "PAID",
        createdAt: now
      });
      return { success: true, accessGranted: true, entitlement };
    }
  }
  // 7. Webhook processing
  async processWebhook(rawBody, signatureHeader) {
    await this.ensureDb();
    const webhookSecret = getRazorpayWebhookSecret();
    if (signatureHeader) {
      const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
      const isTestMode = webhookSecret.includes("sandbox") || !process.env.RAZORPAY_WEBHOOK_SECRET;
      if (signatureHeader !== expectedSignature && !isTestMode) {
        throw new Error("Invalid Razorpay webhook signature");
      }
    }
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      throw new Error("Invalid webhook JSON payload");
    }
    const eventId = payload.id || `evt_${Date.now()}`;
    const eventType = payload.event || "unknown";
    if (isDatabaseConfigured()) {
      const existingEvt = await query(`SELECT id FROM payment_webhook_events WHERE event_id = $1`, [eventId]);
      if (existingEvt.rows.length > 0) {
        return {
          success: true,
          event: eventType,
          status: "ALREADY_PROCESSED",
          message: "Webhook event already processed (idempotent duplicate)."
        };
      }
      await query(
        `INSERT INTO payment_webhook_events (id, event_id, event_type, processed_at, created_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         ON CONFLICT (event_id) DO NOTHING`,
        [`wevt_${crypto.randomBytes(8).toString("hex")}`, eventId, eventType]
      );
      if (eventType === "payment.captured" || eventType === "order.paid") {
        const paymentEntity = payload.payload?.payment?.entity;
        const orderEntity = payload.payload?.order?.entity;
        const orderId = paymentEntity?.order_id || orderEntity?.id;
        const paymentId = paymentEntity?.id || `pay_wh_${Date.now()}`;
        if (orderId) {
          const txRes = await query(`SELECT user_id, supabase_user_id, email, profile_key, report_type FROM payment_transactions WHERE razorpay_order_id = $1`, [orderId]);
          if (txRes.rows.length > 0) {
            const tx = txRes.rows[0];
            const entId = `ent_paid_${crypto.randomBytes(8).toString("hex")}`;
            await query(
              `INSERT INTO entitlements (id, user_id, supabase_user_id, email, report_type, profile_key, access_type, amount, currency, payment_status, razorpay_order_id, razorpay_payment_id, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, 'PAID', $7, 'INR', 'PAID', $8, $9, NOW(), NOW())
               ON CONFLICT (user_id, profile_key, report_type) DO UPDATE SET payment_status = 'PAID', updated_at = NOW()`,
              [entId, tx.user_id, tx.supabase_user_id, tx.email, tx.report_type, tx.profile_key, REPORT_PRICE_INR, orderId, paymentId]
            );
          }
        }
      }
    } else {
      if (this.localSandbox.processedEvents.has(eventId)) {
        return {
          success: true,
          event: eventType,
          status: "ALREADY_PROCESSED",
          message: "Webhook event already processed (idempotent duplicate)."
        };
      }
      this.localSandbox.processedEvents.add(eventId);
    }
    return {
      success: true,
      event: eventType,
      status: "PROCESSED",
      message: "Razorpay webhook processed successfully."
    };
  }
  // 8. Retrieve All Reports for Authenticated Customer
  async getUserReports(authHeader, optionalEmail) {
    await this.ensureDb();
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      return { success: true, reports: [], total: 0 };
    }
    const reportItems = [];
    if (isDatabaseConfigured()) {
      const entRes = await query(
        `SELECT id, user_id, profile_key, report_type, access_type, amount, currency, payment_status, razorpay_payment_id, razorpay_order_id, created_at
         FROM entitlements WHERE user_id = $1 OR supabase_user_id = $2 ORDER BY created_at DESC`,
        [authUser.id, authUser.supabaseUserId]
      );
      for (const ent of entRes.rows) {
        const def = REPORT_REGISTRY[ent.report_type] || REPORT_REGISTRY.MASTER_REPORT;
        reportItems.push({
          id: ent.id,
          userId: ent.user_id,
          profileKey: ent.profile_key,
          reportType: ent.report_type,
          titleHi: def.titleHi,
          titleEn: def.titleEn,
          titleMr: def.titleMr,
          titleBn: def.titleBn,
          titleGu: def.titleGu,
          accessType: ent.access_type,
          amount: ent.amount,
          currency: "INR",
          status: "UNLOCKED",
          paymentId: ent.razorpay_payment_id,
          orderId: ent.razorpay_order_id,
          createdAt: ent.created_at
        });
      }
      const mobileDef = REPORT_REGISTRY.MOBILE_NUMEROLOGY;
      reportItems.push({
        id: `perm_mobile_${authUser.id}`,
        userId: authUser.id,
        profileKey: "mobile_scanner_profile",
        reportType: "MOBILE_NUMEROLOGY",
        titleHi: mobileDef.titleHi,
        titleEn: mobileDef.titleEn,
        titleMr: mobileDef.titleMr,
        titleBn: mobileDef.titleBn,
        titleGu: mobileDef.titleGu,
        accessType: "ALWAYS_FREE",
        amount: 0,
        currency: "INR",
        status: "UNLOCKED",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    } else {
      for (const ent of this.localSandbox.entitlements.values()) {
        if (ent.userId === authUser.id || ent.email === authUser.email) {
          const def = REPORT_REGISTRY[ent.reportType] || REPORT_REGISTRY.MASTER_REPORT;
          reportItems.push({
            id: ent.id,
            userId: ent.userId,
            profileKey: ent.profileKey,
            reportType: ent.reportType,
            titleHi: def.titleHi,
            titleEn: def.titleEn,
            titleMr: def.titleMr,
            titleBn: def.titleBn,
            titleGu: def.titleGu,
            accessType: ent.accessType,
            amount: ent.amount,
            currency: "INR",
            status: "UNLOCKED",
            paymentId: ent.paymentId,
            orderId: ent.orderId,
            createdAt: ent.createdAt
          });
        }
      }
      const mobileDef = REPORT_REGISTRY.MOBILE_NUMEROLOGY;
      reportItems.push({
        id: `perm_mobile_${authUser.id}`,
        userId: authUser.id,
        profileKey: "mobile_scanner_profile",
        reportType: "MOBILE_NUMEROLOGY",
        titleHi: mobileDef.titleHi,
        titleEn: mobileDef.titleEn,
        titleMr: mobileDef.titleMr,
        titleBn: mobileDef.titleBn,
        titleGu: mobileDef.titleGu,
        accessType: "ALWAYS_FREE",
        amount: 0,
        currency: "INR",
        status: "UNLOCKED",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    reportItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return {
      success: true,
      reports: reportItems,
      total: reportItems.length
    };
  }
  // 9. Retrieve Verified Payment History for Customer
  async getUserPaymentHistory(authHeader, optionalEmail) {
    await this.ensureDb();
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      return { success: true, payments: [], total: 0 };
    }
    const historyItems = [];
    if (isDatabaseConfigured()) {
      const claimRes = await query(
        `SELECT report_type, profile_key, claimed_at FROM free_claims WHERE user_id = $1 OR supabase_user_id = $2`,
        [authUser.id, authUser.supabaseUserId]
      );
      if (claimRes.rows.length > 0) {
        const fc = claimRes.rows[0];
        historyItems.push({
          id: `claim_${fc.claimed_at}`,
          userId: authUser.id,
          reportType: fc.report_type,
          profileKey: fc.profile_key,
          amount: 0,
          currency: "INR",
          status: "FREE",
          paymentReference: "Complimentary Free Claim (\u20B90)",
          createdAt: fc.claimed_at
        });
      }
      const txRes = await query(
        `SELECT id, report_type, profile_key, amount, currency, status, razorpay_order_id, razorpay_payment_id, created_at
         FROM payment_transactions WHERE user_id = $1 OR supabase_user_id = $2 ORDER BY created_at DESC`,
        [authUser.id, authUser.supabaseUserId]
      );
      for (const tx of txRes.rows) {
        historyItems.push({
          id: tx.razorpay_payment_id || tx.id,
          userId: authUser.id,
          reportType: tx.report_type,
          profileKey: tx.profile_key,
          amount: tx.amount,
          currency: tx.currency,
          status: tx.status === "PAID" ? "PAID" : "CREATED",
          paymentReference: tx.razorpay_payment_id || `Order (${tx.razorpay_order_id})`,
          orderId: tx.razorpay_order_id,
          createdAt: tx.created_at
        });
      }
    } else {
      const freeClaim = this.localSandbox.freeClaims.get(authUser.id) || this.localSandbox.freeClaims.get(authUser.email);
      if (freeClaim) {
        historyItems.push({
          id: `claim_${freeClaim.claimedAt}`,
          userId: authUser.id,
          reportType: freeClaim.reportType,
          profileKey: freeClaim.profileKey,
          amount: 0,
          currency: "INR",
          status: "FREE",
          paymentReference: "Complimentary Free Claim (\u20B90)",
          createdAt: freeClaim.claimedAt
        });
      }
      for (const p of this.localSandbox.payments.values()) {
        if (p.internalUserId === authUser.id || p.email === authUser.email) {
          historyItems.push({
            id: p.razorpayPaymentId,
            userId: authUser.id,
            reportType: p.reportType,
            profileKey: p.profileKey,
            amount: p.amount,
            currency: p.currency,
            status: "PAID",
            paymentReference: p.razorpayPaymentId,
            orderId: p.razorpayOrderId,
            createdAt: p.createdAt
          });
        }
      }
    }
    historyItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return {
      success: true,
      payments: historyItems,
      total: historyItems.length
    };
  }
  // 10. Retrieve Access & Entitlement Summary
  async getUserAccessSummary(authHeader, optionalEmail) {
    await this.ensureDb();
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      return {
        success: true,
        summary: {
          mobile: "",
          mobileVerified: false,
          mobileNumerology: { status: "ALWAYS_FREE", price: 0 },
          firstNonMobileReport: { status: "AVAILABLE" },
          additionalReports: { priceInr: REPORT_PRICE_INR, pricePaise: REPORT_PRICE_PAISE },
          totalReportsUnlocked: 0,
          totalPaidAmountInr: 0
        }
      };
    }
    if (isDatabaseConfigured()) {
      const claimRes = await query(`SELECT report_type, profile_key, claimed_at FROM free_claims WHERE user_id = $1 OR supabase_user_id = $2`, [authUser.id, authUser.supabaseUserId]);
      const freeClaim = claimRes.rows[0];
      const entRes = await query(`SELECT access_type, amount FROM entitlements WHERE user_id = $1 OR supabase_user_id = $2`, [authUser.id, authUser.supabaseUserId]);
      const entitlements = entRes.rows;
      const paidEntitlements = entitlements.filter((e) => e.access_type === "PAID");
      const totalPaidAmount = paidEntitlements.reduce((sum, e) => sum + Number(e.amount), 0);
      return {
        success: true,
        summary: {
          mobile: authUser.email,
          mobileVerified: authUser.emailVerified,
          mobileNumerology: { status: "ALWAYS_FREE", price: 0 },
          firstNonMobileReport: {
            status: freeClaim ? "USED" : "AVAILABLE",
            reportType: freeClaim?.report_type,
            claimedAt: freeClaim?.claimed_at,
            profileKey: freeClaim?.profile_key
          },
          additionalReports: { priceInr: REPORT_PRICE_INR, pricePaise: REPORT_PRICE_PAISE },
          totalReportsUnlocked: entitlements.length + 1,
          // +1 for Mobile Numerology
          totalPaidAmountInr: totalPaidAmount
        }
      };
    } else {
      const freeClaim = this.localSandbox.freeClaims.get(authUser.id) || this.localSandbox.freeClaims.get(authUser.email);
      const userEntitlements = Array.from(this.localSandbox.entitlements.values()).filter((e) => e.userId === authUser.id || e.email === authUser.email);
      const paidEntitlements = userEntitlements.filter((e) => e.accessType === "PAID");
      const totalPaidAmount = paidEntitlements.reduce((sum, e) => sum + e.amount, 0);
      return {
        success: true,
        summary: {
          mobile: authUser.email,
          mobileVerified: true,
          mobileNumerology: { status: "ALWAYS_FREE", price: 0 },
          firstNonMobileReport: {
            status: freeClaim ? "USED" : "AVAILABLE",
            reportType: freeClaim?.reportType,
            claimedAt: freeClaim?.claimedAt,
            profileKey: freeClaim?.profileKey
          },
          additionalReports: { priceInr: REPORT_PRICE_INR, pricePaise: REPORT_PRICE_PAISE },
          totalReportsUnlocked: userEntitlements.length + 1,
          totalPaidAmountInr: totalPaidAmount
        }
      };
    }
  }
  // 11. Retrieve Single Report by ID with Server Ownership Validation
  async getReportById(reportId, authHeader, optionalEmail) {
    await this.ensureDb();
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      throw new Error("Authentication required to access report");
    }
    if (reportId.startsWith("perm_mobile_")) {
      const def = REPORT_REGISTRY.MOBILE_NUMEROLOGY;
      return {
        success: true,
        allowed: true,
        report: {
          id: reportId,
          userId: authUser.id,
          profileKey: "mobile_scanner_profile",
          reportType: "MOBILE_NUMEROLOGY",
          titleHi: def.titleHi,
          titleEn: def.titleEn,
          titleMr: def.titleMr,
          titleBn: def.titleBn,
          titleGu: def.titleGu,
          accessType: "ALWAYS_FREE",
          amount: 0,
          currency: "INR",
          status: "UNLOCKED",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
    }
    if (isDatabaseConfigured()) {
      const entRes = await query(`SELECT * FROM entitlements WHERE id = $1`, [reportId]);
      if (entRes.rows.length === 0) {
        throw new Error("Report not found in server registry");
      }
      const ent = entRes.rows[0];
      if (ent.user_id !== authUser.id && ent.supabase_user_id !== authUser.supabaseUserId) {
        throw new Error("Unauthorized: You do not own this report entitlement");
      }
      const def = REPORT_REGISTRY[ent.report_type] || REPORT_REGISTRY.MASTER_REPORT;
      return {
        success: true,
        allowed: true,
        report: {
          id: ent.id,
          userId: ent.user_id,
          profileKey: ent.profile_key,
          reportType: ent.report_type,
          titleHi: def.titleHi,
          titleEn: def.titleEn,
          titleMr: def.titleMr,
          titleBn: def.titleBn,
          titleGu: def.titleGu,
          accessType: ent.access_type,
          amount: ent.amount,
          currency: "INR",
          status: "UNLOCKED",
          paymentId: ent.razorpay_payment_id,
          orderId: ent.razorpay_order_id,
          createdAt: ent.created_at
        }
      };
    } else {
      let targetEnt = null;
      for (const ent of this.localSandbox.entitlements.values()) {
        if (ent.id === reportId) {
          targetEnt = ent;
          break;
        }
      }
      if (!targetEnt) {
        throw new Error("Report not found in server registry");
      }
      if (targetEnt.userId !== authUser.id && targetEnt.email !== authUser.email) {
        throw new Error("Unauthorized: You do not own this report entitlement");
      }
      const def = REPORT_REGISTRY[targetEnt.reportType] || REPORT_REGISTRY.MASTER_REPORT;
      return {
        success: true,
        allowed: true,
        report: {
          id: targetEnt.id,
          userId: targetEnt.userId,
          profileKey: targetEnt.profileKey,
          reportType: targetEnt.reportType,
          titleHi: def.titleHi,
          titleEn: def.titleEn,
          titleMr: def.titleMr,
          titleBn: def.titleBn,
          titleGu: def.titleGu,
          accessType: targetEnt.accessType,
          amount: targetEnt.amount,
          currency: "INR",
          status: "UNLOCKED",
          paymentId: targetEnt.paymentId,
          orderId: targetEnt.orderId,
          createdAt: targetEnt.createdAt
        }
      };
    }
  }
  // 12. Admin Audit Data
  async getAdminAuditData() {
    await this.ensureDb();
    if (isDatabaseConfigured()) {
      const usersCount = await query(`SELECT COUNT(*) as count FROM users`);
      const claimsCount = await query(`SELECT COUNT(*) as count FROM free_claims`);
      const paidCount = await query(`SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total_rev FROM entitlements WHERE access_type = 'PAID'`);
      return {
        storageType: "SUPABASE_POSTGRESQL",
        totalUsers: Number(usersCount.rows[0]?.count || 0),
        totalFreeClaims: Number(claimsCount.rows[0]?.count || 0),
        totalPaidReports: Number(paidCount.rows[0]?.count || 0),
        totalRevenueInr: Number(paidCount.rows[0]?.total_rev || 0),
        configDiagnostics: getSafeConfigAudit()
      };
    } else {
      return {
        storageType: "LOCAL_SANDBOX_MEMORY",
        totalUsers: this.localSandbox.users.size,
        totalFreeClaims: this.localSandbox.freeClaims.size,
        totalPaidReports: Array.from(this.localSandbox.entitlements.values()).filter((e) => e.accessType === "PAID").length,
        totalRevenueInr: Array.from(this.localSandbox.entitlements.values()).filter((e) => e.accessType === "PAID").reduce((sum, e) => sum + e.amount, 0),
        configDiagnostics: getSafeConfigAudit()
      };
    }
  }
};
var reportAccessEngine = new ReportAccessEngine();

// src/server/serverlessApi.ts
import { GoogleGenAI } from "@google/genai";
var app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-razorpay-signature");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  if (process.env.NODE_ENV !== "production") {
    console.log(`[API REQUEST] ${req.method} ${req.originalUrl || req.url}`);
  }
  next();
});
var router = express.Router();
router.post("/auth/send-email-otp", async (req, res) => {
  try {
    const { email } = req.body || {};
    const result = await reportAccessEngine.sendEmailOtp(email);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e?.message || "Failed to send email OTP" });
  }
});
router.post("/auth/verify-email-otp", async (req, res) => {
  try {
    const { email, token } = req.body || {};
    const authHeader = req.headers["authorization"] || (req.body?.accessToken ? `Bearer ${req.body.accessToken}` : null);
    const result = await reportAccessEngine.verifyEmailOtp(email, token, authHeader);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e?.message || "Failed to verify email OTP" });
  }
});
router.post("/auth/sync-session", async (req, res) => {
  try {
    const { email } = req.body || {};
    const authHeader = req.headers["authorization"] || (req.body?.accessToken ? `Bearer ${req.body.accessToken}` : null);
    const result = await reportAccessEngine.syncSession(authHeader, email);
    res.json(result);
  } catch (e) {
    res.status(401).json({ success: false, error: e?.message || "Unauthorized session" });
  }
});
router.post("/auth/request-otp", async (req, res) => {
  try {
    const { email, mobile } = req.body || {};
    const target = email || (mobile ? `${mobile}@leofamily.local` : "");
    const result = await reportAccessEngine.sendEmailOtp(target);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e?.message || "Failed to request OTP" });
  }
});
router.post("/auth/verify-otp", async (req, res) => {
  try {
    const { email, mobile, otp } = req.body || {};
    const target = email || (mobile ? `${mobile}@leofamily.local` : "");
    const result = await reportAccessEngine.verifyEmailOtp(target, otp);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e?.message || "Failed to verify OTP" });
  }
});
router.get("/reports/check-access", async (req, res) => {
  try {
    const reportType = req.query.reportType;
    const profileKey = req.query.profileKey || "default_profile";
    const email = req.query.email;
    const authHeader = req.headers["authorization"];
    if (!reportType) {
      return res.status(400).json({
        success: false,
        error: "Missing reportType parameter",
        code: "INVALID_REQUEST"
      });
    }
    if (process.env.NODE_ENV !== "production") {
      console.log(`[API:CheckAccess] Checking access for ${reportType} (profile: ${profileKey})`);
    }
    const result = await reportAccessEngine.checkReportAccess(reportType, profileKey, authHeader, email);
    res.json(result);
  } catch (e) {
    console.error("[API:CheckAccess:Error]", e?.message || e);
    const isDbErr = e?.message?.includes("DATABASE") || e?.message?.includes("connection") || e?.message?.includes("Pool");
    res.status(isDbErr ? 503 : 500).json({
      success: false,
      error: isDbErr ? "Database connection is temporarily unavailable. Please retry in a few moments." : e?.message || "Failed to check report access",
      code: isDbErr ? "DATABASE_UNAVAILABLE" : "ACCESS_CHECK_FAILED"
    });
  }
});
router.all("/reports/claim-free", (req, res, next) => {
  if (req.method !== "POST" && req.method !== "OPTIONS") {
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed. Claiming a free report requires a POST request.`,
      code: "METHOD_NOT_ALLOWED"
    });
  }
  next();
});
router.post("/reports/claim-free", async (req, res) => {
  try {
    const { reportType, profileKey, email } = req.body || {};
    const authHeader = req.headers["authorization"];
    if (!reportType) {
      return res.status(400).json({
        success: false,
        error: "Missing reportType",
        code: "INVALID_REQUEST"
      });
    }
    if (process.env.NODE_ENV !== "production") {
      console.log(`[API:ClaimFree] Attempting free claim for ${reportType} (profile: ${profileKey})`);
    }
    const result = await reportAccessEngine.claimFreeReport(reportType, profileKey, authHeader, email);
    res.json(result);
  } catch (e) {
    console.error("[API:ClaimFree:Error]", e?.message || e);
    const msg = e?.message || "Failed to claim free report";
    const isAuth = msg.includes("UNAUTHORIZED") || msg.includes("session");
    const isDbErr = msg.includes("DATABASE") || msg.includes("connection");
    const isAlready = msg.includes("\u092A\u0939\u0932\u0947 \u0939\u0940") || msg.includes("already");
    const status = isAuth ? 401 : isDbErr ? 503 : 400;
    res.status(status).json({
      success: false,
      error: msg,
      code: isAuth ? "UNAUTHORIZED" : isDbErr ? "DATABASE_UNAVAILABLE" : isAlready ? "ALREADY_CLAIMED" : "CLAIM_FAILED"
    });
  }
});
router.post("/payments/create-order", async (req, res) => {
  try {
    const { reportType, profileKey, email } = req.body || {};
    const authHeader = req.headers["authorization"];
    if (!reportType) {
      return res.status(400).json({
        success: false,
        error: "Missing reportType",
        code: "INVALID_REQUEST"
      });
    }
    const result = await reportAccessEngine.createPaymentOrder(reportType, profileKey, authHeader, email);
    res.json(result);
  } catch (e) {
    console.error("[API:CreateOrder:Error]", e?.message || e);
    const msg = e?.message || "Failed to create payment order";
    const isAuth = msg.includes("UNAUTHORIZED") || msg.includes("verify email");
    res.status(isAuth ? 401 : 400).json({
      success: false,
      error: msg,
      code: isAuth ? "UNAUTHORIZED" : "ORDER_CREATION_FAILED"
    });
  }
});
router.post("/payments/verify-payment", async (req, res) => {
  try {
    const { orderId, paymentId, signature, reportType, profileKey, email } = req.body || {};
    const authHeader = req.headers["authorization"];
    if (!orderId || !reportType) {
      return res.status(400).json({
        success: false,
        error: "Missing orderId or reportType",
        code: "INVALID_REQUEST"
      });
    }
    const result = await reportAccessEngine.verifyPayment(
      orderId,
      paymentId || "",
      signature || "",
      reportType,
      profileKey,
      authHeader,
      email
    );
    res.json(result);
  } catch (e) {
    console.error("[API:VerifyPayment:Error]", e?.message || e);
    res.status(400).json({
      success: false,
      error: e?.message || "Failed to verify payment",
      code: "PAYMENT_VERIFICATION_FAILED"
    });
  }
});
router.post("/payments/webhook", async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"] || "";
    const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const result = await reportAccessEngine.processWebhook(rawBody, signature);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e?.message || "Webhook verification failed" });
  }
});
router.get("/reports/my-reports", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const email = req.query.email;
    const data = await reportAccessEngine.getUserReports(authHeader, email);
    res.json(data);
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch user reports" });
  }
});
router.get("/payments/history", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const email = req.query.email;
    const data = await reportAccessEngine.getUserPaymentHistory(authHeader, email);
    res.json(data);
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch payment history" });
  }
});
router.get("/reports/access-summary", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const email = req.query.email;
    const data = await reportAccessEngine.getUserAccessSummary(authHeader, email);
    res.json(data);
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch access summary" });
  }
});
router.get("/reports/:reportId", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const email = req.query.email;
    const { reportId } = req.params;
    const data = await reportAccessEngine.getReportById(reportId, authHeader, email);
    res.json(data);
  } catch (e) {
    res.status(403).json({ success: false, error: e?.message || "Failed to access report" });
  }
});
router.get("/admin/entitlements", async (req, res) => {
  try {
    const data = await reportAccessEngine.getAdminAuditData();
    res.json(data);
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch admin audit data" });
  }
});
router.get("/otp-debug", (req, res) => {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  const isProduction = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
  const allowDebug = !isProduction || process.env.ENABLE_OTP_DEBUG === "true" || req.query.adminKey === process.env.ADMIN_SECRET_KEY;
  if (!allowDebug) {
    return res.status(403).json({
      success: false,
      error: "FORBIDDEN",
      message: "Diagnostic debug endpoint is restricted in production mode."
    });
  }
  const audit = reportAccessEngine ? reportAccessEngine.getSafeConfigAudit?.() : {};
  res.json({
    success: true,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    runtime: {
      isServerless: !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.NODE_ENV === "production"),
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || "development"
    },
    fast2smsConfig: {
      OTP_MODE: process.env.OTP_MODE || (isProduction ? "live" : "test"),
      FAST2SMS_API_KEY_PRESENT: !!process.env.FAST2SMS_API_KEY,
      FAST2SMS_OTP_ID_PRESENT: !!process.env.FAST2SMS_OTP_ID,
      FAST2SMS_API_URL_PRESENT: !!process.env.FAST2SMS_API_URL,
      FAST2SMS_VERIFY_URL_PRESENT: !!process.env.FAST2SMS_VERIFY_URL,
      FAST2SMS_EFFECTIVE_SEND_ENDPOINT: process.env.FAST2SMS_API_URL || "https://www.fast2sms.com/dev/otp/send",
      FAST2SMS_EFFECTIVE_VERIFY_ENDPOINT: process.env.FAST2SMS_VERIFY_URL || "https://www.fast2sms.com/dev/otp/verify"
    },
    gatewayConfig: {
      RAZORPAY_KEY_ID_PRESENT: !!process.env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET_PRESENT: !!process.env.RAZORPAY_KEY_SECRET,
      RAZORPAY_WEBHOOK_SECRET_PRESENT: !!process.env.RAZORPAY_WEBHOOK_SECRET
    },
    databaseConfig: {
      DATABASE_CONFIGURED: !!(process.env.DATABASE_URL || process.env.SUPABASE_DB_URL)
    },
    aiConfig: {
      GEMINI_API_KEY_PRESENT: !!process.env.GEMINI_API_KEY
    }
  });
});
app.use("/api", router);
app.use("/", router);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "ENDPOINT_NOT_FOUND",
    message: `API endpoint ${req.method} ${req.originalUrl || req.url} not found.`
  });
});
app.use((err, req, res, next) => {
  console.error("Vercel Serverless Error:", err);
  res.status(500).json({
    success: false,
    error: "INTERNAL_SERVER_ERROR",
    message: err?.message || "An unexpected internal server error occurred."
  });
});
var serverlessApi_default = (req, res) => {
  return app(req, res);
};
export {
  serverlessApi_default as default
};
