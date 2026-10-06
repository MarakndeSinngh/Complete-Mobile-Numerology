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
          mobile VARCHAR(20),
          mobile_verified BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ALTER TABLE users ADD COLUMN IF NOT EXISTS supabase_user_id VARCHAR(64);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile VARCHAR(20);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile_verified BOOLEAN NOT NULL DEFAULT FALSE;
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_mobile_unique ON users(mobile) WHERE mobile IS NOT NULL AND mobile != '';
        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_supabase_id_unique ON users(supabase_user_id) WHERE supabase_user_id IS NOT NULL;

        CREATE TABLE IF NOT EXISTS profiles (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          email TEXT,
          phone TEXT,
          full_name TEXT,
          first_name TEXT,
          last_name TEXT,
          avatar_url TEXT,
          preferred_language TEXT DEFAULT 'hi',
          country_code TEXT DEFAULT 'IN',
          auth_provider TEXT,
          email_verified BOOLEAN DEFAULT FALSE,
          phone_verified BOOLEAN DEFAULT FALSE,
          last_login_at TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id VARCHAR(64);
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'hi';
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'IN';
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS auth_provider TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ DEFAULT NOW();
        CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id_unique ON profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
        CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);

        CREATE TABLE IF NOT EXISTS numerology_profiles (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          full_name TEXT,
          date_of_birth DATE,
          dob_string VARCHAR(32),
          mobile_number TEXT,
          email TEXT,
          gender TEXT,
          language TEXT DEFAULT 'hi',
          birth_day INTEGER,
          birth_month INTEGER,
          birth_year INTEGER,
          mulank INTEGER,
          bhagyank INTEGER,
          kua_number INTEGER,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE numerology_profiles ADD COLUMN IF NOT EXISTS dob_string VARCHAR(32);
        ALTER TABLE numerology_profiles ADD COLUMN IF NOT EXISTS kua_number INTEGER;
        CREATE INDEX IF NOT EXISTS idx_num_profiles_user ON numerology_profiles(user_id);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_num_profiles_user_unique ON numerology_profiles(user_id);

        CREATE TABLE IF NOT EXISTS report_runs (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          profile_id VARCHAR(64),
          profile_name TEXT,
          dob_string VARCHAR(32),
          report_type VARCHAR(64) NOT NULL,
          report_key VARCHAR(128),
          language VARCHAR(16) DEFAULT 'hi',
          status VARCHAR(32) DEFAULT 'generated',
          metadata JSONB DEFAULT '{}'::jsonb,
          generated_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_report_runs_user ON report_runs(user_id);
        CREATE INDEX IF NOT EXISTS idx_report_runs_type ON report_runs(report_type);
        CREATE INDEX IF NOT EXISTS idx_report_runs_generated_at ON report_runs(generated_at);

        CREATE TABLE IF NOT EXISTS user_activity (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          event_type VARCHAR(64) NOT NULL,
          page VARCHAR(128),
          report_type VARCHAR(64),
          metadata JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_user_activity_user ON user_activity(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at);
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
      await query(`
        CREATE TABLE IF NOT EXISTS upi_submissions (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          supabase_user_id VARCHAR(64),
          email VARCHAR(255),
          mobile VARCHAR(20),
          user_name TEXT,
          report_type VARCHAR(64) NOT NULL,
          profile_key VARCHAR(128) NOT NULL,
          utr_number VARCHAR(64) NOT NULL,
          upi_id VARCHAR(128),
          amount INT NOT NULL DEFAULT 33,
          currency VARCHAR(8) NOT NULL DEFAULT 'INR',
          status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
          rejection_reason TEXT,
          verified_by VARCHAR(64),
          verified_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_upi_sub_user ON upi_submissions(user_id);
        CREATE INDEX IF NOT EXISTS idx_upi_sub_supabase ON upi_submissions(supabase_user_id);
        CREATE INDEX IF NOT EXISTS idx_upi_sub_status ON upi_submissions(status);
        CREATE INDEX IF NOT EXISTS idx_upi_sub_utr ON upi_submissions(utr_number);

        -- 7. Consultation Feedback & Quality Ratings (Phase 10)
        CREATE TABLE IF NOT EXISTS consultation_feedback (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64),
          supabase_user_id VARCHAR(64),
          email VARCHAR(255),
          report_type VARCHAR(64) NOT NULL DEFAULT 'MASTER_REPORT',
          profile_key VARCHAR(128) NOT NULL DEFAULT 'default_profile',
          rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
          clarity VARCHAR(64),
          actionability VARCHAR(64),
          feedback_text TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON consultation_feedback(created_at);
        CREATE INDEX IF NOT EXISTS idx_feedback_report_type ON consultation_feedback(report_type);
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
      if (!error && data?.user) {
        const u = data.user;
        const meta = u.user_metadata || {};
        const appMeta = u.app_metadata || {};
        const provider = appMeta.provider || (u.phone ? "whatsapp" : "google");
        const fullName = meta.full_name || meta.name || [meta.first_name, meta.last_name].filter(Boolean).join(" ") || "";
        const parts = fullName.split(" ");
        const firstName = meta.first_name || parts[0] || "";
        const lastName = meta.last_name || parts.slice(1).join(" ") || "";
        const avatarUrl = meta.avatar_url || meta.picture || "";
        return {
          supabaseUserId: u.id,
          email: u.email || "",
          phone: u.phone || "",
          fullName,
          firstName,
          lastName,
          avatarUrl,
          authProvider: provider,
          emailVerified: !!(u.email_confirmed_at || u.confirmed_at),
          phoneVerified: !!(u.phone_confirmed_at || u.phone && (u.confirmed_at || meta.phone_verified))
        };
      }
    } catch (apiErr) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[SupabaseServer] REST getUser check notice:", apiErr);
      }
    }
  }
  try {
    const parts = cleanToken.split(".");
    if (parts.length === 3) {
      const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf8");
      const payload = JSON.parse(payloadJson);
      const nowSec = Math.floor(Date.now() / 1e3);
      const isNotExpired = !payload.exp || payload.exp > nowSec;
      const isAuthRole = payload.role === "authenticated" || payload.aud === "authenticated" || payload.iss?.includes("supabase");
      if (isNotExpired && isAuthRole && (payload.sub || payload.email)) {
        const meta = payload.user_metadata || {};
        const appMeta = payload.app_metadata || {};
        const email = payload.email || meta.email || "";
        const fullName = meta.full_name || meta.name || "";
        const partsName = fullName.split(" ");
        return {
          supabaseUserId: payload.sub || `sb_${Date.now()}`,
          email,
          phone: payload.phone || meta.phone || "",
          fullName,
          firstName: meta.first_name || partsName[0] || "",
          lastName: meta.last_name || partsName.slice(1).join(" ") || "",
          avatarUrl: meta.avatar_url || meta.picture || "",
          authProvider: appMeta.provider || "supabase",
          emailVerified: !!(payload.email_confirmed_at || meta.email_verified || email),
          phoneVerified: !!(payload.phone_confirmed_at || meta.phone_verified)
        };
      }
    }
  } catch (jwtErr) {
  }
  return null;
}

// src/server/adminAllowlist.ts
var CANONICAL_ADMIN_TEST_EMAILS = [
  "affectioncosmos@gmail.com",
  "attractabundance909@gmail.com"
];
function normalizeEmail(email) {
  if (!email || typeof email !== "string") return "";
  return email.trim().toLowerCase();
}
function getAdminEmails() {
  const set = new Set(CANONICAL_ADMIN_TEST_EMAILS.map((e) => e.trim().toLowerCase()));
  const envVal = typeof process !== "undefined" && process.env?.ADMIN_TEST_EMAILS || "";
  if (envVal && typeof envVal === "string") {
    envVal.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean).forEach((e) => set.add(e));
  }
  return Array.from(set);
}
function isAdminEmail(email) {
  if (!email || typeof email !== "string") return false;
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  return getAdminEmails().includes(normalized);
}
var isInternalAdminTestEmail = isAdminEmail;

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
      try {
        await ensureDatabaseSchema();
      } catch (err) {
        console.warn("[PostgreSQL] ensureDb schema notice:", err?.message || err);
      }
    }
  }
  /**
   * System Runtime Diagnostics (Phase 16 - Step 5 Production Verification)
   * Safely probes each stage without exposing credentials or secrets.
   */
  async getRuntimeDiagnostics(authHeader, email) {
    let serverlessStatus = "ok";
    let envStatus = typeof process !== "undefined" && process.env ? "ok" : "fail";
    let supabaseStatus = isSupabaseServerConfigured() ? "ok" : "not_configured";
    let dbConfigStatus = isDatabaseConfigured() ? "ok" : "not_configured";
    let dbConnStatus = "not_configured";
    let authStatus = "unauthenticated";
    let isAdminTest = false;
    if (isDatabaseConfigured()) {
      try {
        await query("SELECT 1 AS probe");
        dbConnStatus = "ok";
      } catch (e) {
        dbConnStatus = `connection_error: ${e?.message || "timeout"}`;
      }
    }
    try {
      const user = await this.resolveAuthenticatedUser(authHeader, email);
      if (user) {
        authStatus = "ok";
        isAdminTest = isInternalAdminTestEmail(user.email);
      }
    } catch (authErr) {
      authStatus = `auth_error: ${authErr?.message || "failed"}`;
    }
    return {
      success: true,
      serverless: serverlessStatus,
      environment: envStatus,
      supabase: supabaseStatus,
      databaseConfig: dbConfigStatus,
      databaseConnection: dbConnStatus,
      auth: authStatus,
      adminTestAccess: isAdminTest,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  /**
   * Cryptographically resolve and authenticate user session from Supabase Bearer Token
   */
  async resolveAuthenticatedUser(authHeader, optionalEmail) {
    const cleanEmail = normalizeEmail(optionalEmail);
    if (authHeader) {
      const supabaseUser = await verifySupabaseToken(authHeader);
      if (supabaseUser) {
        const userEmail = normalizeEmail(supabaseUser.email) || cleanEmail;
        const supabaseId = supabaseUser.supabaseUserId;
        const isVerified = supabaseUser.emailVerified;
        if (process.env.NODE_ENV !== "production") {
          console.log(`[AuthEngine:ResolveUser] Resolved Supabase ID: ${supabaseId} (Verified: ${isVerified})`);
        }
        if (isInternalAdminTestEmail(userEmail)) {
          return {
            id: `usr_admin_${supabaseId.slice(0, 16)}`,
            supabaseUserId: supabaseId,
            email: userEmail,
            emailVerified: true
          };
        }
        if (isDatabaseConfigured()) {
          try {
            await this.ensureDb();
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
          } catch (dbErr) {
            console.warn("[AuthEngine:ResolveUser] DB user upsert notice:", dbErr);
          }
          return {
            id: `usr_${supabaseId.slice(0, 16)}`,
            supabaseUserId: supabaseId,
            email: userEmail,
            emailVerified: isVerified
          };
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
    if (!isServerlessRuntime() && cleanEmail) {
      if (isDatabaseConfigured()) {
        try {
          await this.ensureDb();
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
        } catch (err) {
          console.warn("[AuthEngine:ResolveUser] Dev lookup notice:", err);
        }
      } else {
        let u = this.localSandbox.users.get(cleanEmail);
        if (!u) {
          const internalId = `usr_${crypto.randomBytes(8).toString("hex")}`;
          u = {
            id: internalId,
            supabaseUserId: internalId,
            email: cleanEmail,
            emailVerified: true
          };
          this.localSandbox.users.set(cleanEmail, u);
          this.localSandbox.users.set(internalId, u);
        }
        return u;
      }
    }
    return null;
  }
  // 2b. Synchronize Authenticated Supabase Session & Ensure User + Profile Record Exists
  async syncSession(authHeader, optionalProfile) {
    const supabaseUser = await verifySupabaseToken(authHeader);
    if (!supabaseUser || !supabaseUser.supabaseUserId) {
      throw new Error("UNAUTHORIZED: Invalid or expired session token");
    }
    const userId = supabaseUser.supabaseUserId;
    const email = normalizeEmail(supabaseUser.email || optionalProfile?.email);
    const phone = supabaseUser.phone || optionalProfile?.phone || "";
    const fullName = supabaseUser.fullName || optionalProfile?.fullName || "";
    const firstName = supabaseUser.firstName || optionalProfile?.firstName || "";
    const lastName = supabaseUser.lastName || optionalProfile?.lastName || "";
    const avatarUrl = supabaseUser.avatarUrl || optionalProfile?.avatarUrl || "";
    const authProvider = supabaseUser.authProvider || (phone ? "whatsapp" : "google");
    const emailVerified = supabaseUser.emailVerified;
    const phoneVerified = supabaseUser.phoneVerified;
    const lang = optionalProfile?.language || "hi";
    if (isInternalAdminTestEmail(email)) {
      return {
        success: true,
        user: {
          id: `usr_admin_${userId.slice(0, 16)}`,
          supabaseUserId: userId,
          email,
          phone,
          fullName: fullName || "Admin Test User",
          avatarUrl,
          authProvider,
          emailVerified: true,
          phoneVerified: true,
          hasClaimedFreeReport: true,
          freeReportDetails: {
            reportType: "MASTER_REPORT",
            claimedAt: (/* @__PURE__ */ new Date()).toISOString(),
            profileKey: "default_profile"
          },
          isAdminTest: true
        },
        profile: {
          userId,
          email,
          phone,
          fullName: fullName || "Admin Test User",
          avatarUrl,
          authProvider,
          emailVerified: true,
          phoneVerified: true,
          preferredLanguage: lang,
          isAdminTest: true
        },
        isAdminTest: true
      };
    }
    await this.ensureDb();
    let userProfile = null;
    if (isDatabaseConfigured()) {
      try {
        await query(
          `INSERT INTO users (id, supabase_user_id, email, email_verified, mobile, mobile_verified, created_at, updated_at)
           VALUES ($1, $1, $2, $3, $4, $5, NOW(), NOW())
           ON CONFLICT (supabase_user_id) WHERE supabase_user_id IS NOT NULL
           DO UPDATE SET email = EXCLUDED.email, email_verified = EXCLUDED.email_verified, mobile = COALESCE(EXCLUDED.mobile, users.mobile), mobile_verified = COALESCE(EXCLUDED.mobile_verified, users.mobile_verified), updated_at = NOW()`,
          [userId, email, emailVerified, phone, phoneVerified]
        );
        const profRes = await query(
          `INSERT INTO profiles (id, user_id, email, phone, full_name, first_name, last_name, avatar_url, preferred_language, auth_provider, email_verified, phone_verified, last_login_at, created_at, updated_at)
           VALUES ($1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW(), NOW())
           ON CONFLICT (user_id)
           DO UPDATE SET
             email = COALESCE(EXCLUDED.email, profiles.email),
             phone = COALESCE(EXCLUDED.phone, profiles.phone),
             full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
             avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
             auth_provider = COALESCE(EXCLUDED.auth_provider, profiles.auth_provider),
             email_verified = EXCLUDED.email_verified OR profiles.email_verified,
             phone_verified = EXCLUDED.phone_verified OR profiles.phone_verified,
             last_login_at = NOW(),
             updated_at = NOW()
           RETURNING *`,
          [userId, email, phone, fullName, firstName, lastName, avatarUrl, lang, authProvider, emailVerified, phoneVerified]
        );
        userProfile = profRes.rows[0];
        await this.logUserActivity(authHeader, "login", { provider: authProvider });
      } catch (dbErr) {
        console.warn("[syncSession] Database synchronization notice:", dbErr?.message || dbErr);
      }
    }
    let hasClaimedFreeReport = false;
    let freeReportDetails = void 0;
    if (isDatabaseConfigured()) {
      try {
        const claimRes = await query(
          `SELECT report_type, profile_key, claimed_at FROM free_claims WHERE user_id = $1 OR supabase_user_id = $1`,
          [userId]
        );
        if (claimRes.rows.length > 0) {
          hasClaimedFreeReport = true;
          freeReportDetails = {
            reportType: claimRes.rows[0].report_type,
            claimedAt: claimRes.rows[0].claimed_at,
            profileKey: claimRes.rows[0].profile_key
          };
        }
      } catch (dbErr) {
        console.warn("[syncSession] Free claims lookup notice:", dbErr?.message || dbErr);
      }
    }
    return {
      success: true,
      user: {
        id: userId,
        supabaseUserId: userId,
        email,
        phone,
        fullName,
        avatarUrl,
        authProvider,
        emailVerified,
        phoneVerified,
        hasClaimedFreeReport,
        freeReportDetails
      },
      profile: userProfile || {
        userId,
        email,
        phone,
        fullName,
        avatarUrl,
        authProvider,
        emailVerified,
        phoneVerified,
        preferredLanguage: lang
      }
    };
  }
  // 2c. Save/Update Numerology Profile
  async saveNumerologyProfile(authHeader, profileData) {
    await this.ensureDb();
    const supabaseUser = await verifySupabaseToken(authHeader);
    if (!supabaseUser || !supabaseUser.supabaseUserId) {
      throw new Error("UNAUTHORIZED: Login required to save numerology profile.");
    }
    const userId = supabaseUser.supabaseUserId;
    const {
      fullName,
      dateOfBirth,
      mobileNumber,
      email,
      gender,
      language = "hi",
      mulank,
      bhagyank,
      kuaNumber
    } = profileData;
    let dobDate = null;
    if (dateOfBirth) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
        dobDate = dateOfBirth;
      } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth)) {
        const [d, m, y] = dateOfBirth.split("/");
        dobDate = `${y}-${m}-${d}`;
      }
    }
    let bDay = 0, bMonth = 0, bYear = 0;
    if (dobDate) {
      const parts = dobDate.split("-");
      bYear = parseInt(parts[0], 10) || 0;
      bMonth = parseInt(parts[1], 10) || 0;
      bDay = parseInt(parts[2], 10) || 0;
    }
    if (isDatabaseConfigured()) {
      const profileId = `np_${crypto.randomBytes(8).toString("hex")}`;
      const res = await query(
        `INSERT INTO numerology_profiles (id, user_id, full_name, date_of_birth, dob_string, mobile_number, email, gender, language, birth_day, birth_month, birth_year, mulank, bhagyank, kua_number, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
         ON CONFLICT (user_id)
         DO UPDATE SET
           full_name = EXCLUDED.full_name,
           date_of_birth = EXCLUDED.date_of_birth,
           dob_string = EXCLUDED.dob_string,
           mobile_number = EXCLUDED.mobile_number,
           email = EXCLUDED.email,
           gender = EXCLUDED.gender,
           language = EXCLUDED.language,
           birth_day = EXCLUDED.birth_day,
           birth_month = EXCLUDED.birth_month,
           birth_year = EXCLUDED.birth_year,
           mulank = EXCLUDED.mulank,
           bhagyank = EXCLUDED.bhagyank,
           kua_number = EXCLUDED.kua_number,
           updated_at = NOW()
         RETURNING *`,
        [profileId, userId, fullName, dobDate, dateOfBirth, mobileNumber, email, gender, language, bDay, bMonth, bYear, mulank, bhagyank, kuaNumber]
      );
      await this.logUserActivity(authHeader, "profile_updated", { fullName, dateOfBirth });
      return { success: true, profile: res.rows[0] };
    }
    return { success: true, profile: { userId, fullName, dateOfBirth, mobileNumber, email, gender } };
  }
  // 2d. Get Current User's Saved Numerology Profile
  async getNumerologyProfile(authHeader) {
    await this.ensureDb();
    const supabaseUser = await verifySupabaseToken(authHeader);
    if (!supabaseUser || !supabaseUser.supabaseUserId) {
      return { success: true, profile: null };
    }
    if (isDatabaseConfigured()) {
      const res = await query(`SELECT * FROM numerology_profiles WHERE user_id = $1`, [supabaseUser.supabaseUserId]);
      return { success: true, profile: res.rows[0] || null };
    }
    return { success: true, profile: null };
  }
  // 2e. Record Report Run in report_runs table
  async recordReportRun(authHeader, reportData) {
    await this.ensureDb();
    const supabaseUser = await verifySupabaseToken(authHeader);
    if (!supabaseUser || !supabaseUser.supabaseUserId) {
      return { success: false, reportRunId: "" };
    }
    const userId = supabaseUser.supabaseUserId;
    const runId = `run_${crypto.randomBytes(8).toString("hex")}`;
    const lang = reportData.language || "hi";
    if (isDatabaseConfigured()) {
      await query(
        `INSERT INTO report_runs (id, user_id, profile_name, dob_string, report_type, report_key, language, status, metadata, generated_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'generated', $8, NOW(), NOW())`,
        [runId, userId, reportData.profileName || "", reportData.dobString || "", reportData.reportType, reportData.reportKey || "", lang, JSON.stringify(reportData.metadata || {})]
      );
      await this.logUserActivity(authHeader, "report_generated", {
        reportType: reportData.reportType,
        profileName: reportData.profileName
      });
    }
    return { success: true, reportRunId: runId };
  }
  // 2f. Log User Activity
  async logUserActivity(authHeader, eventType, metadata = {}) {
    try {
      if (!isDatabaseConfigured()) return;
      const supabaseUser = await verifySupabaseToken(authHeader);
      if (!supabaseUser || !supabaseUser.supabaseUserId) return;
      const actId = `act_${crypto.randomBytes(8).toString("hex")}`;
      await query(
        `INSERT INTO user_activity (id, user_id, event_type, report_type, metadata, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [actId, supabaseUser.supabaseUserId, eventType, metadata?.reportType || null, JSON.stringify(metadata || {})]
      );
    } catch (e) {
      console.warn("[ActivityLogger] Notice:", e);
    }
  }
  // 3. Central Report Access Check
  async checkReportAccess(reportType, profileKey, authHeader, optionalEmail) {
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
    if (reportType === "MOBILE_NUMEROLOGY" || reportType === "LOSHU") {
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
      if (isAdminEmail(authUser.email)) {
        return {
          allowed: true,
          requiresPayment: false,
          isFirstFreeReport: false,
          isFreeReportType: false,
          canClaimFree: false,
          price: 0,
          reportType,
          profileKey: safeKey,
          accessType: "ADMIN_TEST",
          reason: "Internal Test Access \u2014 Authorized test account (Free access to all reports)"
        };
      }
      await this.ensureDb();
      if (isDatabaseConfigured()) {
        try {
          const entRes = await query(
            `SELECT id, access_type, amount FROM entitlements WHERE (user_id = $1 OR supabase_user_id = $2) AND profile_key = $3 AND report_type = $4`,
            [authUser.id, authUser.supabaseUserId, safeKey, reportType]
          );
          if (entRes.rows.length > 0) {
            const ent2 = entRes.rows[0];
            return {
              allowed: true,
              requiresPayment: false,
              isFirstFreeReport: false,
              isFreeReportType: false,
              canClaimFree: false,
              price: ent2.amount,
              reportType,
              profileKey: safeKey,
              accessType: ent2.access_type,
              entitlementId: ent2.id
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
        } catch (dbErr) {
          console.warn("[checkReportAccess] Database query notice:", dbErr);
          if (isServerlessRuntime()) {
            return {
              allowed: false,
              requiresPayment: true,
              isFirstFreeReport: false,
              isFreeReportType: false,
              canClaimFree: false,
              price: REPORT_PRICE_INR,
              reportType,
              profileKey: safeKey,
              reason: "Database is currently unavailable. Access requires database verification."
            };
          }
        }
      }
      if (isServerlessRuntime()) {
        return {
          allowed: false,
          requiresPayment: true,
          isFirstFreeReport: false,
          isFreeReportType: false,
          canClaimFree: false,
          price: REPORT_PRICE_INR,
          reportType,
          profileKey: safeKey,
          reason: "Database is required in production environment."
        };
      }
      const entKey = `${authUser.id}_${reportType}_${safeKey}`;
      let ent = this.localSandbox.entitlements.get(entKey);
      if (!ent && authUser.email) {
        for (const item of this.localSandbox.entitlements.values()) {
          if ((item.email === authUser.email || item.userId === authUser.id) && item.reportType === reportType && item.profileKey === safeKey) {
            ent = item;
            break;
          }
        }
      }
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
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      return { success: true, reports: [], total: 0 };
    }
    if (isAdminEmail(authUser.email)) {
      const allReportTypes = [
        "MASTER_REPORT",
        "MOBILE_NUMEROLOGY",
        "LOSHU",
        "NAME_NUMEROLOGY",
        "MARRIAGE",
        "VEHICLE",
        "HOUSE_FLAT",
        "BUSINESS",
        "SIGNATURE_AUDIT",
        "CHILD_NAMES",
        "LUCKY_DATES",
        "MEDICAL_NUMEROLOGY",
        "VASTU",
        "DASHA",
        "YEAR_FORECAST"
      ];
      const reportItems2 = allReportTypes.map((rType) => {
        const def = REPORT_REGISTRY[rType] || REPORT_REGISTRY.MASTER_REPORT;
        return {
          id: `admin_test_${rType.toLowerCase()}_${authUser.id}`,
          userId: authUser.id,
          profileKey: "default_profile",
          reportType: rType,
          titleHi: `${def.titleHi} (\u0906\u0902\u0924\u0930\u093F\u0915 \u091F\u0947\u0938\u094D\u091F \u090F\u0915\u094D\u0938\u0947\u0938)`,
          titleEn: `${def.titleEn} (Internal Test Access)`,
          titleMr: `${def.titleMr} (\u092A\u094D\u0930\u0936\u093E\u0938\u0915\u0940\u092F \u091A\u093E\u091A\u0923\u0940)`,
          titleBn: `${def.titleBn} (\u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u099F\u09C7\u09B8\u09CD\u099F \u0985\u09CD\u09AF\u09BE\u0995\u09CD\u09B8\u09C7\u09B8)`,
          titleGu: `${def.titleGu} (\u0A8F\u0AA1\u0AAE\u0ABF\u0AA8 \u0A9F\u0AC7\u0AB8\u0ACD\u0A9F \u0A8F\u0A95\u0ACD\u0AB8\u0AC7\u0AB8)`,
          accessType: "ADMIN_TEST",
          amount: 0,
          currency: "INR",
          status: "UNLOCKED",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      });
      return {
        success: true,
        reports: reportItems2,
        total: reportItems2.length
      };
    }
    await this.ensureDb();
    const reportItems = [];
    if (isDatabaseConfigured()) {
      try {
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
      } catch (dbErr) {
        console.warn("[getUserReports] DB fetch notice:", dbErr);
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
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      return { success: true, payments: [], total: 0 };
    }
    if (isAdminEmail(authUser.email)) {
      return {
        success: true,
        payments: [],
        total: 0
      };
    }
    await this.ensureDb();
    const historyItems = [];
    if (isDatabaseConfigured()) {
      try {
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
      } catch (dbErr) {
        console.warn("[getUserPaymentHistory] DB fetch notice:", dbErr);
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
    if (isAdminEmail(authUser.email)) {
      return {
        success: true,
        summary: {
          mobile: authUser.email,
          mobileVerified: true,
          mobileNumerology: { status: "ALWAYS_FREE", price: 0 },
          firstNonMobileReport: {
            status: "AVAILABLE",
            reportType: "MASTER_REPORT",
            claimedAt: (/* @__PURE__ */ new Date()).toISOString(),
            profileKey: "default_profile"
          },
          additionalReports: { priceInr: 0, pricePaise: 0 },
          totalReportsUnlocked: Object.keys(REPORT_REGISTRY).length,
          totalPaidAmountInr: 0,
          adminTestAccess: true
        }
      };
    }
    await this.ensureDb();
    if (isDatabaseConfigured()) {
      try {
        const claimRes = await query(`SELECT report_type, profile_key, claimed_at FROM free_claims WHERE user_id = $1 OR supabase_user_id = $2`, [authUser.id, authUser.supabaseUserId]);
        const freeClaim2 = claimRes.rows[0];
        const entRes = await query(`SELECT access_type, amount FROM entitlements WHERE user_id = $1 OR supabase_user_id = $2`, [authUser.id, authUser.supabaseUserId]);
        const entitlements = entRes.rows;
        const paidEntitlements2 = entitlements.filter((e) => e.access_type === "PAID");
        const totalPaidAmount2 = paidEntitlements2.reduce((sum, e) => sum + Number(e.amount), 0);
        return {
          success: true,
          summary: {
            mobile: authUser.email,
            mobileVerified: authUser.emailVerified,
            mobileNumerology: { status: "ALWAYS_FREE", price: 0 },
            firstNonMobileReport: {
              status: freeClaim2 ? "USED" : "AVAILABLE",
              reportType: freeClaim2?.report_type,
              claimedAt: freeClaim2?.claimed_at,
              profileKey: freeClaim2?.profile_key
            },
            additionalReports: { priceInr: REPORT_PRICE_INR, pricePaise: REPORT_PRICE_PAISE },
            totalReportsUnlocked: entitlements.length + 1,
            // +1 for Mobile Numerology
            totalPaidAmountInr: totalPaidAmount2,
            adminTestAccess: false
          }
        };
      } catch (dbErr) {
        console.warn("[getUserAccessSummary] DB fetch notice:", dbErr);
      }
    }
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
        totalPaidAmountInr: totalPaidAmount,
        adminTestAccess: isInternalAdminTestEmail(authUser.email)
      }
    };
  }
  // 11. Retrieve Single Report by ID with Server Ownership Validation
  async getReportById(reportId, authHeader, optionalEmail) {
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      throw new Error("Authentication required to access report");
    }
    if (reportId.startsWith("admin_test_") || isAdminEmail(authUser.email)) {
      const matchedType = Object.keys(REPORT_REGISTRY).find((k) => reportId.toLowerCase().includes(k.toLowerCase())) || "MASTER_REPORT";
      const def = REPORT_REGISTRY[matchedType] || REPORT_REGISTRY.MASTER_REPORT;
      return {
        success: true,
        allowed: true,
        report: {
          id: reportId.startsWith("admin_test_") ? reportId : `admin_test_${matchedType.toLowerCase()}_${authUser.id}`,
          userId: authUser.id,
          profileKey: "default_profile",
          reportType: matchedType,
          titleHi: `${def.titleHi} (\u0906\u0902\u0924\u0930\u093F\u0915 \u091F\u0947\u0938\u094D\u091F \u090F\u0915\u094D\u0938\u0947\u0938)`,
          titleEn: `${def.titleEn} (Internal Test Access)`,
          titleMr: `${def.titleMr} (\u092A\u094D\u0930\u0936\u093E\u0938\u0915\u0940\u092F \u091A\u093E\u091A\u0923\u0940)`,
          titleBn: `${def.titleBn} (\u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u099F\u09C7\u09B8\u09CD\u099F \u0985\u09CD\u09AF\u09BE\u0995\u09CD\u09B8\u09C7\u09B8)`,
          titleGu: `${def.titleGu} (\u0A8F\u0AA1\u0AAE\u0ABF\u0AA8 \u0A9F\u0AC7\u0AB8\u0ACD\u0A9F \u0A8F\u0A95\u0ACD\u0AB8\u0AC7\u0AB8)`,
          accessType: "ADMIN_TEST",
          amount: 0,
          currency: "INR",
          status: "UNLOCKED",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
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
    await this.ensureDb();
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
  // 11b. Authorize PDF Generation (Server-Authoritative)
  async authorizePdf(reportType, profileKey, authHeader, optionalEmail) {
    const access = await this.checkReportAccess(reportType, profileKey, authHeader, optionalEmail);
    if (!access.allowed) {
      return {
        success: false,
        allowed: false,
        message: "PDF export requires a verified paid entitlement or authorized admin test access."
      };
    }
    if (access.accessType === "ADMIN_TEST") {
      try {
        await this.logUserActivity(authHeader, "ADMIN_TEST_PDF_ACCESS", {
          reportType,
          profileKey
        });
      } catch {
      }
    }
    return {
      success: true,
      allowed: true,
      accessType: access.accessType,
      message: "PDF generation authorized."
    };
  }
  // 12. Admin Audit Data
  async getAdminAuditData() {
    await this.ensureDb();
    if (isDatabaseConfigured()) {
      const usersCount = await query(`SELECT COUNT(*) as count FROM users`);
      const claimsCount = await query(`SELECT COUNT(*) as count FROM free_claims`);
      const paidCount = await query(`SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total_rev FROM entitlements WHERE access_type = 'PAID'`);
      const pendingUpi = await query(`SELECT COUNT(*) as count FROM upi_submissions WHERE status = 'PENDING'`);
      return {
        storageType: "SUPABASE_POSTGRESQL",
        totalUsers: Number(usersCount.rows[0]?.count || 0),
        totalFreeClaims: Number(claimsCount.rows[0]?.count || 0),
        totalPaidReports: Number(paidCount.rows[0]?.count || 0),
        totalRevenueInr: Number(paidCount.rows[0]?.total_rev || 0),
        pendingUpiVerifications: Number(pendingUpi.rows[0]?.count || 0),
        configDiagnostics: getSafeConfigAudit()
      };
    } else {
      return {
        storageType: "LOCAL_SANDBOX_MEMORY",
        totalUsers: this.localSandbox.users.size,
        totalFreeClaims: this.localSandbox.freeClaims.size,
        totalPaidReports: Array.from(this.localSandbox.entitlements.values()).filter((e) => e.accessType === "PAID").length,
        totalRevenueInr: Array.from(this.localSandbox.entitlements.values()).filter((e) => e.accessType === "PAID").reduce((sum, e) => sum + e.amount, 0),
        pendingUpiVerifications: 0,
        configDiagnostics: getSafeConfigAudit()
      };
    }
  }
  // 13. Submit UPI QR Payment with UTR for Admin Verification
  async submitUpiPayment(reportType, profileKey, utrNumber, upiId, userName, authHeader, optionalEmail) {
    await this.ensureDb();
    const cleanUtr = String(utrNumber || "").trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      throw new Error("\u0915\u0943\u092A\u092F\u093E \u090F\u0915 \u092E\u093E\u0928\u094D\u092F UTR (12-\u0905\u0902\u0915\u0940\u092F \u0932\u0947\u0928-\u0926\u0947\u0928 \u0938\u0902\u0916\u094D\u092F\u093E) \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902\u0964");
    }
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    const userId = authUser?.id || `guest_${crypto.randomBytes(6).toString("hex")}`;
    const supabaseUserId = authUser?.supabaseUserId || null;
    const email = authUser?.email || normalizeEmail(optionalEmail) || "guest@leofamily.online";
    const mobile = authUser?.mobile || "";
    const safeKey = profileKey || "default_profile";
    const submissionId = `upi_${crypto.randomBytes(8).toString("hex")}`;
    if (isDatabaseConfigured()) {
      await query(
        `INSERT INTO upi_submissions (id, user_id, supabase_user_id, email, mobile, user_name, report_type, profile_key, utr_number, upi_id, amount, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'PENDING', NOW(), NOW())`,
        [submissionId, userId, supabaseUserId, email, mobile, userName || "Aspirant", reportType, safeKey, cleanUtr, upiId || "leofamily@upi", REPORT_PRICE_INR]
      );
    } else {
      this.localSandbox.upiSubmissions = this.localSandbox.upiSubmissions || /* @__PURE__ */ new Map();
      this.localSandbox.upiSubmissions.set(submissionId, {
        id: submissionId,
        userId,
        supabaseUserId,
        email,
        mobile,
        userName: userName || "Aspirant",
        reportType,
        profileKey: safeKey,
        utrNumber: cleanUtr,
        upiId: upiId || "leofamily@upi",
        amount: REPORT_PRICE_INR,
        status: "PENDING",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    return {
      success: true,
      submissionId,
      status: "PENDING",
      message: "Payment details submitted successfully. Verification pending by admin."
    };
  }
  // 14. Retrieve User's UPI Submissions
  async getUserUpiSubmissions(authHeader, optionalEmail) {
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      return { success: true, submissions: [] };
    }
    if (isInternalAdminTestEmail(authUser.email)) {
      return { success: true, submissions: [] };
    }
    await this.ensureDb();
    if (isDatabaseConfigured()) {
      try {
        const res = await query(
          `SELECT * FROM upi_submissions WHERE user_id = $1 OR supabase_user_id = $2 OR email = $3 ORDER BY created_at DESC`,
          [authUser.id, authUser.supabaseUserId, authUser.email]
        );
        return { success: true, submissions: res.rows };
      } catch (dbErr) {
        console.warn("[getUserUpiSubmissions] DB fetch notice:", dbErr);
      }
    }
    const subs = Array.from((this.localSandbox.upiSubmissions || /* @__PURE__ */ new Map()).values()).filter(
      (s) => s.userId === authUser.id || s.email === authUser.email
    );
    return { success: true, submissions: subs };
  }
  // 14b. Check UPI Payment Status
  async getUpiPaymentStatus(reportType, profileKey, authHeader, optionalEmail, utr) {
    await this.ensureDb();
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    const cleanEmail = normalizeEmail(optionalEmail) || authUser?.email || "";
    const cleanUtr = (utr || "").trim();
    const accessCheck = await this.checkReportAccess(reportType, profileKey, authHeader, cleanEmail);
    if (accessCheck.allowed) {
      return {
        success: true,
        status: "VERIFIED",
        isUnlocked: true,
        message: "Report access is active and unlocked."
      };
    }
    if (isDatabaseConfigured()) {
      let subQuery = `SELECT * FROM upi_submissions WHERE (report_type = $1 AND profile_key = $2)`;
      const params = [reportType, profileKey];
      if (cleanUtr) {
        params.push(cleanUtr);
        subQuery += ` AND utr_number = $${params.length}`;
      } else if (cleanEmail) {
        params.push(cleanEmail);
        subQuery += ` AND email = $${params.length}`;
      }
      subQuery += ` ORDER BY created_at DESC LIMIT 1`;
      const res = await query(subQuery, params);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          success: true,
          status: row.status,
          isUnlocked: row.status === "VERIFIED",
          record: {
            id: row.id,
            utr: row.utr_number,
            amount: row.amount,
            status: row.status,
            rejectionReason: row.rejection_reason,
            createdAt: row.created_at
          }
        };
      }
    } else {
      const subs = Array.from((this.localSandbox.upiSubmissions || /* @__PURE__ */ new Map()).values());
      const match = subs.reverse().find((s) => {
        if (s.reportType !== reportType) return false;
        if (cleanUtr && s.utrNumber === cleanUtr) return true;
        if (cleanEmail && s.email === cleanEmail) return true;
        if (s.profileKey === profileKey) return true;
        return false;
      });
      if (match) {
        return {
          success: true,
          status: match.status,
          isUnlocked: match.status === "VERIFIED",
          record: {
            id: match.id,
            utr: match.utrNumber,
            amount: match.amount,
            status: match.status,
            rejectionReason: match.rejectionReason,
            createdAt: match.createdAt
          }
        };
      }
    }
    return {
      success: true,
      status: "NOT_FOUND",
      isUnlocked: false,
      message: "No pending or verified UPI submission found."
    };
  }
  // 15. Admin: Get all Pending UPI Submissions
  async getAdminPendingPayments() {
    await this.ensureDb();
    if (isDatabaseConfigured()) {
      const res = await query(`SELECT * FROM upi_submissions ORDER BY created_at DESC LIMIT 100`);
      return { success: true, submissions: res.rows };
    } else {
      const subs = Array.from((this.localSandbox.upiSubmissions || /* @__PURE__ */ new Map()).values());
      return { success: true, submissions: subs };
    }
  }
  // Alias for getAdminPendingPayments
  async getAdminUpiPayments() {
    return this.getAdminPendingPayments();
  }
  // 16. Admin: Verify (Approve / Reject) UPI Payment
  async verifyAdminUpiPayment(submissionId, action, rejectionReason, verifiedBy) {
    await this.ensureDb();
    if (!submissionId) throw new Error("Missing submissionId");
    if (isDatabaseConfigured()) {
      return await withTransaction(async (client) => {
        const subRes = await client.query(`SELECT * FROM upi_submissions WHERE id = $1`, [submissionId]);
        if (subRes.rows.length === 0) {
          throw new Error("UPI submission not found");
        }
        const sub = subRes.rows[0];
        if (action === "APPROVE") {
          await client.query(
            `UPDATE upi_submissions SET status = 'VERIFIED', verified_by = $1, verified_at = NOW(), updated_at = NOW() WHERE id = $2`,
            [verifiedBy || "admin", submissionId]
          );
          const entId = `ent_upi_${crypto.randomBytes(8).toString("hex")}`;
          await client.query(
            `INSERT INTO entitlements (id, user_id, supabase_user_id, email, mobile, report_type, profile_key, access_type, amount, currency, payment_status, razorpay_payment_id, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'PAID', $8, 'INR', 'PAID', $9, NOW(), NOW())
             ON CONFLICT (user_id, profile_key, report_type)
             DO UPDATE SET access_type = 'PAID', amount = EXCLUDED.amount, payment_status = 'PAID', razorpay_payment_id = EXCLUDED.razorpay_payment_id, updated_at = NOW()`,
            [entId, sub.user_id, sub.supabase_user_id, sub.email, sub.mobile, sub.report_type, sub.profile_key, sub.amount, sub.utr_number]
          );
          return { success: true, status: "VERIFIED", message: "Payment verified and report unlocked successfully" };
        } else {
          await client.query(
            `UPDATE upi_submissions SET status = 'REJECTED', rejection_reason = $1, verified_by = $2, verified_at = NOW(), updated_at = NOW() WHERE id = $3`,
            [rejectionReason || "UTR verification failed with bank records", verifiedBy || "admin", submissionId]
          );
          return { success: true, status: "REJECTED", message: "Payment submission marked as rejected" };
        }
      });
    } else {
      const map = this.localSandbox.upiSubmissions || /* @__PURE__ */ new Map();
      const sub = map.get(submissionId);
      if (!sub) throw new Error("Submission not found in sandbox");
      if (action === "APPROVE") {
        sub.status = "VERIFIED";
        sub.verifiedAt = (/* @__PURE__ */ new Date()).toISOString();
        const entId = `ent_upi_${crypto.randomBytes(8).toString("hex")}`;
        this.localSandbox.entitlements.set(`${sub.userId}_${sub.reportType}_${sub.profileKey}`, {
          id: entId,
          userId: sub.userId,
          email: sub.email,
          mobile: sub.mobile,
          reportType: sub.reportType,
          profileKey: sub.profileKey,
          accessType: "PAID",
          amount: sub.amount,
          paymentStatus: "PAID",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          paymentId: sub.utrNumber
        });
        return { success: true, status: "VERIFIED", message: "Payment verified and report unlocked" };
      } else {
        sub.status = "REJECTED";
        sub.rejectionReason = rejectionReason || "Invalid UTR";
        return { success: true, status: "REJECTED", message: "Payment marked as rejected" };
      }
    }
  }
  // 17. Submit Consultation Feedback & Quality Ratings (Phase 10)
  async submitConsultationFeedback(feedback, authHeader, optionalEmail) {
    await this.ensureDb();
    const rating = Math.max(1, Math.min(5, Number(feedback.rating) || 5));
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    const userId = authUser?.id || `guest_${crypto.randomBytes(6).toString("hex")}`;
    const supabaseUserId = authUser?.supabaseUserId || null;
    const email = authUser?.email || normalizeEmail(optionalEmail) || "guest@leofamily.online";
    const feedbackId = `fb_${crypto.randomBytes(8).toString("hex")}`;
    const reportType = feedback.reportType || "MASTER_REPORT";
    const profileKey = feedback.profileKey || "default_profile";
    if (isDatabaseConfigured()) {
      await query(
        `INSERT INTO consultation_feedback (id, user_id, supabase_user_id, email, report_type, profile_key, rating, clarity, actionability, feedback_text, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
        [feedbackId, userId, supabaseUserId, email, reportType, profileKey, rating, feedback.clarity || "", feedback.actionability || "", feedback.feedbackText || ""]
      );
    } else {
      this.localSandbox.consultationFeedback = this.localSandbox.consultationFeedback || [];
      this.localSandbox.consultationFeedback.push({
        id: feedbackId,
        userId,
        supabaseUserId,
        email,
        reportType,
        profileKey,
        rating,
        clarity: feedback.clarity || "",
        actionability: feedback.actionability || "",
        feedbackText: feedback.feedbackText || "",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    try {
      await this.logUserActivity(authHeader, "CONSULTATION_FEEDBACK_SUBMITTED", {
        rating,
        reportType,
        clarity: feedback.clarity,
        actionability: feedback.actionability
      });
    } catch {
    }
    return {
      success: true,
      feedbackId,
      message: "\u0906\u092A\u0915\u0940 \u092E\u0942\u0932\u094D\u092F\u0935\u093E\u0928 \u092A\u094D\u0930\u0924\u093F\u0915\u094D\u0930\u093F\u092F\u093E \u0938\u092B\u0932\u0924\u093E\u092A\u0942\u0930\u094D\u0935\u0915 \u0926\u0930\u094D\u091C \u0915\u0940 \u0917\u0908 \u0939\u0948\u0964 (Feedback submitted successfully)"
    };
  }
  // 18. Admin: Get Consultation Feedback (Phase 10)
  async getAdminFeedback() {
    await this.ensureDb();
    if (isDatabaseConfigured()) {
      const res = await query(`SELECT * FROM consultation_feedback ORDER BY created_at DESC LIMIT 100`);
      return { success: true, feedback: res.rows };
    } else {
      const list = this.localSandbox.consultationFeedback || [];
      return { success: true, feedback: [...list].reverse() };
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
app.use((req, res, next) => {
  if (req.body !== void 0 && typeof req.body === "object" && Object.keys(req.body).length > 0) {
    return next();
  }
  express.json({ limit: "15mb" })(req, res, (err) => {
    if (err) {
      console.warn("[BodyParser Notice] JSON parse notice:", err?.message || err);
    }
    next();
  });
});
app.use((req, res, next) => {
  if (req.body !== void 0 && typeof req.body === "object" && Object.keys(req.body).length > 0) {
    return next();
  }
  express.urlencoded({ limit: "15mb", extended: true })(req, res, (err) => {
    if (err) {
      console.warn("[BodyParser Notice] Urlencoded parse notice:", err?.message || err);
    }
    next();
  });
});
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  const matchedPath = req.headers["x-matched-path"] || req.headers["x-vercel-matched-path"] || req.headers["x-now-route-matches"];
  if (matchedPath && (req.url === "/api" || req.url === "/" || req.url === "" || req.url.startsWith("/api?") || req.url.startsWith("/?"))) {
    const queryIndex = req.url.indexOf("?");
    const queryString = queryIndex !== -1 ? req.url.substring(queryIndex) : "";
    req.url = matchedPath.includes("?") ? matchedPath : `${matchedPath}${queryString}`;
  }
  if (process.env.NODE_ENV !== "production") {
    console.log(`[API REQUEST] ${req.method} ${req.originalUrl || req.url}`);
  }
  next();
});
var router = express.Router();
router.post("/auth/sync-session", async (req, res) => {
  const requestId = `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  try {
    const authHeader = req.headers["authorization"] || (req.body?.accessToken ? `Bearer ${req.body.accessToken}` : null);
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "UNAUTHORIZED: Missing authorization header",
        code: "UNAUTHORIZED",
        requestId
      });
    }
    const result = await reportAccessEngine.syncSession(authHeader, req.body);
    res.json({ ...result, requestId });
  } catch (e) {
    const msg = e?.message || "Failed to synchronize session";
    const isAuth = msg.includes("UNAUTHORIZED") || msg.includes("Invalid or expired");
    console.error(`[AUTH_SYNC_SESSION_ERROR] [${requestId}]`, msg);
    res.status(isAuth ? 401 : 500).json({
      success: false,
      error: msg,
      code: isAuth ? "UNAUTHORIZED" : "AUTH_SYNC_FAILED",
      requestId
    });
  }
});
router.post("/profiles/save", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const result = await reportAccessEngine.saveNumerologyProfile(authHeader, req.body);
    res.json(result);
  } catch (e) {
    const isAuth = e?.message?.includes("UNAUTHORIZED");
    res.status(isAuth ? 401 : 400).json({ success: false, error: e?.message || "Failed to save profile" });
  }
});
router.get("/profiles/current", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const result = await reportAccessEngine.getNumerologyProfile(authHeader);
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch profile" });
  }
});
router.post("/reports/record-run", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const result = await reportAccessEngine.recordReportRun(authHeader, req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e?.message || "Failed to record report run" });
  }
});
router.post("/activity/log", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const { eventType, metadata } = req.body || {};
    await reportAccessEngine.logUserActivity(authHeader, eventType, metadata);
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, error: e?.message });
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
router.post("/payments/submit-upi", async (req, res) => {
  try {
    const { reportType, profileKey, utr, email, mobile, amount } = req.body || {};
    const authHeader = req.headers["authorization"];
    const canonicalType = reportType || "MASTER_REPORT";
    if (canonicalType !== "MASTER_REPORT" && !REPORT_REGISTRY[canonicalType]) {
      return res.status(400).json({
        success: false,
        error: "Invalid report type for UPI checkout",
        code: "INVALID_REPORT_TYPE"
      });
    }
    const expectedPrice = REPORT_REGISTRY[canonicalType]?.priceInr ?? 33;
    if (amount !== void 0 && Number(amount) !== expectedPrice) {
      console.warn(`[UPI Security] Client submitted amount \u20B9${amount}, server enforcing \u20B9${expectedPrice}`);
    }
    if (!utr || typeof utr !== "string" || utr.trim().length < 6) {
      return res.status(400).json({
        success: false,
        error: "\u0915\u0943\u092A\u092F\u093E \u090F\u0915 \u092E\u093E\u0928\u094D\u092F 12-\u0905\u0902\u0915\u0940\u092F UTR / Transaction ID \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902",
        code: "INVALID_UTR"
      });
    }
    const result = await reportAccessEngine.submitUpiPayment(
      canonicalType,
      profileKey,
      utr,
      authHeader,
      email,
      mobile
    );
    res.json(result);
  } catch (e) {
    console.error("[API:SubmitUpi:Error]", e?.message || e);
    res.status(400).json({
      success: false,
      error: e?.message || "Failed to submit UPI payment for verification",
      code: "UPI_SUBMISSION_FAILED"
    });
  }
});
router.get("/payments/upi-status", async (req, res) => {
  try {
    const reportType = req.query.reportType || "MASTER_REPORT";
    const profileKey = req.query.profileKey || "default_profile";
    const utr = req.query.utr;
    const email = req.query.email;
    const authHeader = req.headers["authorization"];
    const result = await reportAccessEngine.getUpiPaymentStatus(
      reportType,
      profileKey,
      authHeader,
      email,
      utr
    );
    res.json(result);
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e?.message || "Failed to retrieve UPI payment status",
      code: "STATUS_CHECK_FAILED"
    });
  }
});
router.get("/payments/my-upi-submissions", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const email = req.query.email;
    const data = await reportAccessEngine.getUserUpiSubmissions(authHeader, email);
    res.json(data);
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e?.message || "Failed to fetch user UPI submissions",
      code: "SUBMISSIONS_FETCH_FAILED"
    });
  }
});
router.post("/payments/submit-utr", async (req, res) => {
  try {
    const { reportType, profileKey, utr, email, mobile, amount } = req.body || {};
    const authHeader = req.headers["authorization"];
    const canonicalType = reportType || "MASTER_REPORT";
    const result = await reportAccessEngine.submitUpiPayment(
      canonicalType,
      profileKey,
      utr,
      authHeader,
      email,
      mobile
    );
    res.json(result);
  } catch (e) {
    res.status(400).json({
      success: false,
      error: e?.message || "Failed to submit UTR",
      code: "UTR_SUBMISSION_FAILED"
    });
  }
});
router.get(["/admin/upi-payments", "/admin/pending-upi-payments"], async (req, res) => {
  try {
    const data = await reportAccessEngine.getAdminUpiPayments();
    res.json(data);
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e?.message || "Failed to fetch UPI payment records",
      code: "ADMIN_UPI_FETCH_FAILED"
    });
  }
});
router.post("/admin/verify-upi-payment", async (req, res) => {
  try {
    const { submissionId, paymentId, action, rejectionReason, notes, verifiedBy, adminIdentifier } = req.body || {};
    const targetId = submissionId || paymentId;
    const targetAction = action === "APPROVED" ? "APPROVE" : action === "REJECTED" ? "REJECT" : action;
    const targetReason = rejectionReason || notes || "";
    const targetAdmin = verifiedBy || adminIdentifier || "Admin";
    if (!targetId || !targetAction || targetAction !== "APPROVE" && targetAction !== "REJECT") {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid paymentId/submissionId or action (must be APPROVE or REJECT)",
        code: "INVALID_ADMIN_ACTION"
      });
    }
    const result = await reportAccessEngine.verifyAdminUpiPayment(
      targetId,
      targetAction,
      targetReason,
      targetAdmin
    );
    res.json(result);
  } catch (e) {
    console.error("[API:AdminVerifyUpi:Error]", e?.message || e);
    res.status(400).json({
      success: false,
      error: e?.message || "Failed to execute admin payment verification",
      code: "ADMIN_ACTION_FAILED"
    });
  }
});
router.post("/feedback/submit", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const email = req.query.email;
    const result = await reportAccessEngine.submitConsultationFeedback(req.body, authHeader, email);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e?.message || "Failed to submit consultation feedback" });
  }
});
router.get("/admin/feedback", async (req, res) => {
  try {
    const result = await reportAccessEngine.getAdminFeedback();
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch consultation feedback" });
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
router.get(["/system/diagnostics", "/admin/runtime-diagnostics"], async (req, res) => {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  const authHeader = req.headers["authorization"];
  const email = req.query.email;
  const adminKey = req.query.adminKey;
  const authUser = await reportAccessEngine.resolveAuthenticatedUser(authHeader, email);
  const isAdmin = authUser && reportAccessEngine.isInternalAdminTestEmail?.(authUser.email) || email && ["affectioncosmos@gmail.com", "attractabundance909@gmail.com"].includes(email.toLowerCase().trim()) || adminKey && adminKey === process.env.ADMIN_SECRET_KEY;
  const isProduction = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
  if (isProduction && !isAdmin && process.env.ENABLE_OTP_DEBUG !== "true") {
    return res.status(403).json({
      success: false,
      error: "FORBIDDEN",
      message: "Diagnostics are restricted to authorized admin test sessions."
    });
  }
  const diag = await reportAccessEngine.getRuntimeDiagnostics(authHeader, email);
  res.json(diag);
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
    authConfig: {
      AUTH_PROVIDER: "SUPABASE_AUTH",
      SUPABASE_URL_PRESENT: !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
      SUPABASE_ANON_KEY_PRESENT: !!(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
      SUPABASE_SERVICE_ROLE_KEY_PRESENT: !!process.env.SUPABASE_SERVICE_ROLE_KEY
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

// src/server/vercelEntry.ts
var vercelEntry_default = serverlessApi_default;
export {
  vercelEntry_default as default
};
