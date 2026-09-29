// api/index.ts
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
        CREATE TABLE IF NOT EXISTS profiles (
          id VARCHAR(64) PRIMARY KEY,
          email TEXT,
          phone TEXT,
          full_name TEXT,
          first_name TEXT,
          last_name TEXT,
          avatar_url TEXT,
          preferred_language TEXT DEFAULT 'hi',
          country_code TEXT DEFAULT 'IN',
          auth_provider TEXT DEFAULT 'google',
          email_verified BOOLEAN DEFAULT FALSE,
          phone_verified BOOLEAN DEFAULT FALSE,
          last_login_at TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
        CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
        CREATE INDEX IF NOT EXISTS idx_profiles_auth_provider ON profiles(auth_provider);
      `);
      await query(`
        CREATE TABLE IF NOT EXISTS numerology_profiles (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          full_name TEXT NOT NULL,
          date_of_birth DATE NOT NULL,
          mobile_number TEXT,
          email TEXT,
          gender TEXT DEFAULT 'MALE',
          language TEXT DEFAULT 'hi',
          birth_day INTEGER,
          birth_month INTEGER,
          birth_year INTEGER,
          mulank INTEGER,
          bhagyank INTEGER,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_numerology_profiles_user ON numerology_profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_numerology_profiles_mobile ON numerology_profiles(mobile_number);
        CREATE INDEX IF NOT EXISTS idx_numerology_profiles_dob ON numerology_profiles(date_of_birth);
      `);
      await query(`
        CREATE TABLE IF NOT EXISTS report_runs (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          profile_id VARCHAR(64),
          report_type VARCHAR(64) NOT NULL,
          report_key VARCHAR(128) NOT NULL,
          profile_name TEXT,
          date_of_birth TEXT,
          mobile_number TEXT,
          language VARCHAR(16) DEFAULT 'hi',
          status VARCHAR(32) DEFAULT 'generated',
          report_data JSONB,
          access_type VARCHAR(32) DEFAULT 'FREE',
          amount INTEGER DEFAULT 0,
          payment_id VARCHAR(128),
          generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_report_runs_user ON report_runs(user_id);
        CREATE INDEX IF NOT EXISTS idx_report_runs_type ON report_runs(report_type);
        CREATE INDEX IF NOT EXISTS idx_report_runs_gen_at ON report_runs(generated_at DESC);
      `);
      await query(`
        CREATE TABLE IF NOT EXISTS user_activity (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          event_type VARCHAR(64) NOT NULL,
          page TEXT,
          report_type VARCHAR(64),
          metadata JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_user_activity_user ON user_activity(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_activity_event ON user_activity(event_type);
        CREATE INDEX IF NOT EXISTS idx_user_activity_created ON user_activity(created_at DESC);
      `);
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
      if (process.env.NODE_ENV !== "production") {
        console.log("[PostgreSQL] Durable database schema initialized successfully.");
      }
    } catch (err) {
      console.warn("[PostgreSQL] Schema initialization notice:", err?.message || err);
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
async function verifySupabaseToken(tokenOrHeader) {
  if (!tokenOrHeader || typeof tokenOrHeader !== "string") return null;
  const cleanToken = tokenOrHeader.startsWith("Bearer ") ? tokenOrHeader.substring(7).trim() : tokenOrHeader.trim();
  if (!cleanToken || cleanToken === "undefined" || cleanToken === "null") return null;
  if (isSupabaseServerConfigured()) {
    try {
      const client = getServerSupabaseClient();
      const { data, error } = await client.auth.getUser(cleanToken);
      if (error || !data.user) {
        return null;
      }
      const u = data.user;
      const userMeta = u.user_metadata || {};
      const appMeta = u.app_metadata || {};
      const provider = appMeta.provider || userMeta.provider || (u.phone ? "whatsapp" : "google");
      const fullName = userMeta.full_name || userMeta.name || [userMeta.first_name, userMeta.last_name].filter(Boolean).join(" ") || "";
      const avatarUrl = userMeta.avatar_url || userMeta.picture || "";
      const isEmailVerified = !!(u.email_confirmed_at || u.confirmed_at);
      const isPhoneVerified = !!(u.phone_confirmed_at || u.phone && !u.email);
      return {
        supabaseUserId: u.id,
        email: u.email ? u.email.trim().toLowerCase() : "",
        phone: u.phone || "",
        fullName,
        avatarUrl,
        emailVerified: isEmailVerified,
        phoneVerified: isPhoneVerified,
        authProvider: provider === "google" ? "google" : u.phone ? "whatsapp" : "other",
        rawMetadata: userMeta
      };
    } catch (e) {
      console.warn("[SupabaseServer] verifySupabaseToken error:", e);
      return null;
    }
  }
  return null;
}
async function requireAuthenticatedUser(req) {
  const authHeader = req.headers?.["authorization"] || req.headers?.["Authorization"];
  const user = await verifySupabaseToken(authHeader);
  if (!user) {
    throw new Error("UNAUTHORIZED: A valid Supabase authentication session is required.");
  }
  return user;
}

// src/server/accessEngine.ts
var REPORT_PRICE_INR = 33;
var REPORT_PRICE_PAISE = 3300;
function isServerlessRuntime() {
  return !!(typeof process !== "undefined" && process.env?.VERCEL || typeof process !== "undefined" && process.env?.AWS_LAMBDA_FUNCTION_VERSION || typeof process !== "undefined" && process.env?.NODE_ENV === "production");
}
function isPublicReport(reportType) {
  return reportType === "MOBILE_NUMEROLOGY" || reportType === "LOSHU";
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
function normalizeIndianMobile(rawMobile) {
  if (!rawMobile) return "";
  const digits = String(rawMobile).replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.substring(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.substring(1);
  if (digits.length > 10) return digits.slice(-10);
  return digits;
}
var ReportAccessEngine = class {
  async ensureDb() {
    if (isDatabaseConfigured()) {
      await ensureDatabaseSchema();
    }
  }
  /**
   * Resolve authoritative authenticated user from Supabase Bearer token
   */
  async resolveAuthenticatedUser(authHeader) {
    if (!authHeader) return null;
    const user = await verifySupabaseToken(authHeader);
    if (user) {
      await this.ensureDb();
      await this.syncProfileRecord(user);
    }
    return user;
  }
  /**
   * Sync Supabase user metadata into public.profiles
   */
  async syncProfileRecord(user, extra) {
    if (!isDatabaseConfigured()) return;
    try {
      const preferredLang = extra?.preferredLanguage || "hi";
      const name = extra?.fullName || user.fullName || "";
      await query(
        `INSERT INTO profiles (
          id, email, phone, full_name, avatar_url, preferred_language,
          auth_provider, email_verified, phone_verified, last_login_at, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          email = COALESCE(NULLIF(EXCLUDED.email, ''), profiles.email),
          phone = COALESCE(NULLIF(EXCLUDED.phone, ''), profiles.phone),
          full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name),
          avatar_url = COALESCE(NULLIF(EXCLUDED.avatar_url, ''), profiles.avatar_url),
          email_verified = EXCLUDED.email_verified OR profiles.email_verified,
          phone_verified = EXCLUDED.phone_verified OR profiles.phone_verified,
          last_login_at = NOW(),
          updated_at = NOW()`,
        [
          user.supabaseUserId,
          user.email || null,
          user.phone || null,
          name || null,
          user.avatarUrl || null,
          preferredLang,
          user.authProvider,
          user.emailVerified,
          user.phoneVerified
        ]
      );
    } catch (e) {
      console.warn("[ReportAccessEngine:syncProfileRecord] Notice:", e);
    }
  }
  /**
   * Save or update reusable Numerology Profile
   */
  async saveNumerologyProfile(userId, details) {
    await this.ensureDb();
    if (!isDatabaseConfigured()) {
      return { id: `num_${Date.now()}`, ...details };
    }
    const id = `np_${crypto.randomBytes(8).toString("hex")}`;
    const cleanMobile = normalizeIndianMobile(details.mobile);
    const cleanEmail = normalizeEmail(details.email);
    const parts = (details.dob || "").split("-").map(Number);
    const birthYear = parts[0] || null;
    const birthMonth = parts[1] || null;
    const birthDay = parts[2] || null;
    const res = await query(
      `INSERT INTO numerology_profiles (
        id, user_id, full_name, date_of_birth, mobile_number, email,
        gender, language, birth_day, birth_month, birth_year, mulank, bhagyank,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      RETURNING *`,
      [
        id,
        userId,
        details.fullName.trim(),
        details.dob,
        cleanMobile || null,
        cleanEmail || null,
        details.gender || "MALE",
        details.language || "hi",
        birthDay,
        birthMonth,
        birthYear,
        details.mulank || null,
        details.bhagyank || null
      ]
    );
    return res.rows[0] || { id, ...details };
  }
  /**
   * Record User Activity in audit table
   */
  async recordActivity(userId, eventType, page, reportType, metadata) {
    if (!isDatabaseConfigured()) return;
    try {
      const id = `act_${crypto.randomBytes(8).toString("hex")}`;
      await query(
        `INSERT INTO user_activity (id, user_id, event_type, page, report_type, metadata, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [id, userId, eventType, page || null, reportType || null, JSON.stringify(metadata || {})]
      );
    } catch (e) {
      console.warn("[ReportAccessEngine:recordActivity] Notice:", e);
    }
  }
  /**
   * Save generated report run
   */
  async saveReportRun(userId, reportType, reportKey, reportData, options) {
    await this.ensureDb();
    const id = `rr_${crypto.randomBytes(8).toString("hex")}`;
    if (isDatabaseConfigured()) {
      await query(
        `INSERT INTO report_runs (
          id, user_id, profile_id, report_type, report_key, profile_name,
          date_of_birth, mobile_number, language, status, report_data,
          access_type, amount, payment_id, generated_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'generated', $10, $11, $12, $13, NOW(), NOW())`,
        [
          id,
          userId,
          options?.profileId || null,
          reportType,
          reportKey,
          options?.profileName || null,
          options?.dob || null,
          options?.mobile || null,
          options?.language || "hi",
          JSON.stringify(reportData || {}),
          options?.accessType || "FREE",
          options?.amount || 0,
          options?.paymentId || null
        ]
      );
    }
    return id;
  }
  /**
   * Check access entitlement for report
   */
  async checkReportAccess(reportType, profileKey = "default_profile", authHeader) {
    if (isPublicReport(reportType)) {
      return {
        allowed: true,
        requiresPayment: false,
        isFirstFreeReport: false,
        isFreeReportType: true,
        canClaimFree: false,
        price: 0,
        reportType,
        profileKey,
        accessType: "FREE"
      };
    }
    const user = await this.resolveAuthenticatedUser(authHeader);
    if (!user) {
      return {
        allowed: false,
        requiresPayment: false,
        isFirstFreeReport: false,
        isFreeReportType: false,
        canClaimFree: false,
        price: REPORT_PRICE_INR,
        reportType,
        profileKey,
        reason: "LOGIN_REQUIRED: Please sign in with Google or WhatsApp to access this report."
      };
    }
    const userId = user.supabaseUserId;
    await this.ensureDb();
    if (isDatabaseConfigured()) {
      const entRes = await query(
        `SELECT id, access_type, payment_status, created_at
         FROM entitlements
         WHERE user_id = $1 AND profile_key = $2 AND report_type = $3
         LIMIT 1`,
        [userId, profileKey, reportType]
      );
      if (entRes.rows.length > 0) {
        return {
          allowed: true,
          requiresPayment: false,
          isFirstFreeReport: false,
          isFreeReportType: false,
          canClaimFree: false,
          price: 0,
          reportType,
          profileKey,
          accessType: entRes.rows[0].access_type,
          entitlementId: entRes.rows[0].id
        };
      }
      const claimRes = await query(
        `SELECT id, report_type, claimed_at FROM free_claims WHERE user_id = $1 LIMIT 1`,
        [userId]
      );
      const hasClaimed = claimRes.rows.length > 0;
      return {
        allowed: false,
        requiresPayment: hasClaimed,
        isFirstFreeReport: !hasClaimed,
        isFreeReportType: false,
        canClaimFree: !hasClaimed,
        price: hasClaimed ? REPORT_PRICE_INR : 0,
        reportType,
        profileKey,
        reason: hasClaimed ? "PAYMENT_REQUIRED" : "FIRST_REPORT_FREE_AVAILABLE"
      };
    }
    return {
      allowed: false,
      requiresPayment: true,
      isFirstFreeReport: false,
      isFreeReportType: false,
      canClaimFree: false,
      price: REPORT_PRICE_INR,
      reportType,
      profileKey
    };
  }
  /**
   * Claim 1st Complimentary Free Report
   */
  async claimFreeReport(reportType, profileKey = "default_profile", authHeader) {
    const user = await this.resolveAuthenticatedUser(authHeader);
    if (!user) {
      throw new Error("UNAUTHORIZED: Valid Supabase login is required to claim your free report.");
    }
    if (isPublicReport(reportType)) {
      throw new Error("INVALID_REQUEST: Mobile Numerology and Lo Shu are already permanently free.");
    }
    const userId = user.supabaseUserId;
    await this.ensureDb();
    if (!isDatabaseConfigured()) {
      return {
        success: true,
        entitlementId: `ent_free_${Date.now()}`,
        message: "First free report claimed successfully."
      };
    }
    return await withTransaction(async (client) => {
      const existingClaim = await client.query(
        `SELECT id, report_type, claimed_at FROM free_claims WHERE user_id = $1 FOR UPDATE`,
        [userId]
      );
      if (existingClaim.rows.length > 0) {
        throw new Error("ALREADY_CLAIMED: You have already used your 1 complimentary free report.");
      }
      const claimId = `fc_${crypto.randomBytes(8).toString("hex")}`;
      const entId = `ent_${crypto.randomBytes(8).toString("hex")}`;
      await client.query(
        `INSERT INTO free_claims (id, user_id, supabase_user_id, email, mobile, report_type, profile_key, claimed_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [claimId, userId, userId, user.email || null, user.phone || null, reportType, profileKey]
      );
      await client.query(
        `INSERT INTO entitlements (
          id, user_id, supabase_user_id, email, mobile, report_type, profile_key,
          access_type, amount, currency, payment_status, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'FREE', 0, 'INR', 'GRANTED', NOW(), NOW())
        ON CONFLICT (user_id, profile_key, report_type)
        DO UPDATE SET access_type = 'FREE', updated_at = NOW()`,
        [entId, userId, userId, user.email || null, user.phone || null, reportType, profileKey]
      );
      await client.query(
        `INSERT INTO user_activity (id, user_id, event_type, report_type, metadata, created_at)
         VALUES ($1, $2, 'free_report_claimed', $3, $4, NOW())`,
        [`act_${crypto.randomBytes(8).toString("hex")}`, userId, reportType, JSON.stringify({ profileKey })]
      );
      return {
        success: true,
        entitlementId: entId,
        message: "Congratulations! Your first comprehensive report has been unlocked for FREE."
      };
    });
  }
  /**
   * Create Razorpay Payment Order (₹33)
   */
  async createPaymentOrder(reportType, profileKey = "default_profile", authHeader) {
    const user = await this.resolveAuthenticatedUser(authHeader);
    if (!user) {
      throw new Error("UNAUTHORIZED: Valid login is required to purchase report access.");
    }
    const keyId = getRazorpayKeyId();
    const keySecret = getRazorpayKeySecret();
    const orderId = `order_${crypto.randomBytes(8).toString("hex")}`;
    const userId = user.supabaseUserId;
    await this.ensureDb();
    if (isDatabaseConfigured()) {
      const txId = `tx_${crypto.randomBytes(8).toString("hex")}`;
      await query(
        `INSERT INTO payment_transactions (
          id, user_id, supabase_user_id, email, mobile, profile_key, report_type,
          razorpay_order_id, amount, currency, status, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'INR', 'CREATED', NOW(), NOW())`,
        [
          txId,
          userId,
          userId,
          user.email || null,
          user.phone || null,
          profileKey,
          reportType,
          orderId,
          REPORT_PRICE_INR
        ]
      );
    }
    return {
      orderId,
      amount: REPORT_PRICE_INR,
      amountPaise: REPORT_PRICE_PAISE,
      currency: "INR",
      keyId,
      reportType,
      profileKey,
      mobile: user.phone || "",
      receipt: `rcpt_${Date.now()}`
    };
  }
  /**
   * Verify Razorpay Payment Signature and Grant Entitlement
   */
  async verifyPayment(orderId, paymentId, signature, reportType, profileKey = "default_profile", authHeader) {
    const user = await this.resolveAuthenticatedUser(authHeader);
    if (!user) {
      throw new Error("UNAUTHORIZED: Valid login is required to verify payment.");
    }
    const userId = user.supabaseUserId;
    await this.ensureDb();
    const keySecret = getRazorpayKeySecret();
    if (signature && isServerlessRuntime()) {
      const expectedSignature = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
      if (expectedSignature !== signature) {
        throw new Error("PAYMENT_SIGNATURE_MISMATCH: Payment verification failed.");
      }
    }
    const entId = `ent_${crypto.randomBytes(8).toString("hex")}`;
    if (isDatabaseConfigured()) {
      await withTransaction(async (client) => {
        await client.query(
          `UPDATE payment_transactions
           SET razorpay_payment_id = $1, status = 'CAPTURED', updated_at = NOW()
           WHERE razorpay_order_id = $2`,
          [paymentId, orderId]
        );
        await client.query(
          `INSERT INTO entitlements (
            id, user_id, supabase_user_id, email, mobile, report_type, profile_key,
            access_type, amount, currency, payment_status, razorpay_order_id,
            razorpay_payment_id, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'PAID', $8, 'INR', 'PAID', $9, $10, NOW(), NOW())
          ON CONFLICT (user_id, profile_key, report_type)
          DO UPDATE SET
            access_type = 'PAID',
            amount = $8,
            payment_status = 'PAID',
            razorpay_order_id = $9,
            razorpay_payment_id = $10,
            updated_at = NOW()`,
          [
            entId,
            userId,
            userId,
            user.email || null,
            user.phone || null,
            reportType,
            profileKey,
            REPORT_PRICE_INR,
            orderId,
            paymentId
          ]
        );
        await client.query(
          `INSERT INTO user_activity (id, user_id, event_type, report_type, metadata, created_at)
           VALUES ($1, $2, 'payment_verified', $3, $4, NOW())`,
          [
            `act_${crypto.randomBytes(8).toString("hex")}`,
            userId,
            reportType,
            JSON.stringify({ orderId, paymentId, amount: REPORT_PRICE_INR })
          ]
        );
      });
    }
    return {
      success: true,
      entitlementId: entId,
      message: "Payment verified successfully! Your specialist report is unlocked."
    };
  }
  /**
   * Process Razorpay Webhook Event
   */
  async processWebhook(rawBody, signature) {
    const webhookSecret = getRazorpayWebhookSecret();
    if (signature && isServerlessRuntime()) {
      const expectedSig = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
      if (expectedSig !== signature) {
        throw new Error("INVALID_WEBHOOK_SIGNATURE");
      }
    }
    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.id || `evt_${Date.now()}`;
    const eventType = payload.event || "payment.captured";
    await this.ensureDb();
    if (isDatabaseConfigured()) {
      await query(
        `INSERT INTO payment_webhook_events (id, event_id, event_type, processed_at, created_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         ON CONFLICT (event_id) DO NOTHING`,
        [`pwe_${crypto.randomBytes(8).toString("hex")}`, eventId, eventType]
      );
    }
    return { success: true, processed: true, eventId };
  }
  /**
   * Retrieve all saved reports for authenticated user
   */
  async getUserReports(authHeader) {
    const user = await this.resolveAuthenticatedUser(authHeader);
    if (!user) {
      throw new Error("UNAUTHORIZED: Valid login is required to fetch your reports.");
    }
    const userId = user.supabaseUserId;
    await this.ensureDb();
    if (!isDatabaseConfigured()) {
      return [];
    }
    const res = await query(
      `SELECT
        id, user_id, profile_key, report_type, access_type, amount,
        currency, payment_status, razorpay_payment_id, razorpay_order_id,
        created_at, updated_at
       FROM entitlements
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return res.rows.map((row) => {
      const reg = REPORT_REGISTRY[row.report_type] || {
        titleEn: row.report_type,
        titleHi: row.report_type,
        titleMr: row.report_type,
        titleBn: row.report_type,
        titleGu: row.report_type
      };
      return {
        id: row.id,
        userId: row.user_id,
        profileKey: row.profile_key,
        reportType: row.report_type,
        titleEn: reg.titleEn,
        titleHi: reg.titleHi,
        titleMr: reg.titleMr,
        titleBn: reg.titleBn,
        titleGu: reg.titleGu,
        accessType: row.access_type,
        amount: row.amount || 0,
        currency: row.currency || "INR",
        status: "UNLOCKED",
        paymentId: row.razorpay_payment_id,
        orderId: row.razorpay_order_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    });
  }
  /**
   * Retrieve payment history for authenticated user
   */
  async getUserPaymentHistory(authHeader) {
    const user = await this.resolveAuthenticatedUser(authHeader);
    if (!user) {
      throw new Error("UNAUTHORIZED: Valid login is required to fetch payment history.");
    }
    const userId = user.supabaseUserId;
    await this.ensureDb();
    if (!isDatabaseConfigured()) return [];
    const res = await query(
      `SELECT id, user_id, report_type, profile_key, amount, currency, status, razorpay_payment_id, razorpay_order_id, created_at
       FROM payment_transactions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return res.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      reportType: row.report_type,
      profileKey: row.profile_key,
      amount: row.amount,
      currency: row.currency,
      status: row.status,
      paymentReference: row.razorpay_payment_id || row.razorpay_order_id || "Free Welcome Gift",
      orderId: row.razorpay_order_id,
      createdAt: row.created_at
    }));
  }
  /**
   * Retrieve single report run by ID with strict ownership validation
   */
  async getReportById(reportId, authHeader) {
    const user = await this.resolveAuthenticatedUser(authHeader);
    if (!user) {
      throw new Error("UNAUTHORIZED: Valid login is required to access report details.");
    }
    const userId = user.supabaseUserId;
    await this.ensureDb();
    if (!isDatabaseConfigured()) return null;
    const res = await query(
      `SELECT * FROM report_runs WHERE id = $1 AND user_id = $2 LIMIT 1`,
      [reportId, userId]
    );
    if (res.rows.length === 0) {
      throw new Error("NOT_FOUND: Report not found or unauthorized access.");
    }
    return res.rows[0];
  }
};
var reportAccessEngine = new ReportAccessEngine();

// api/index.ts
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
  const matchedPath = req.headers["x-matched-path"] || req.headers["x-vercel-matched-path"];
  if (matchedPath && (req.url === "/api" || req.url === "/" || req.url === "")) {
    req.url = matchedPath;
  }
  if (process.env.NODE_ENV !== "production") {
    console.log(`[API REQUEST] ${req.method} ${req.originalUrl || req.url}`);
  }
  next();
});
var router = express.Router();
router.post("/user/profile", async (req, res) => {
  try {
    const user = await requireAuthenticatedUser(req);
    const { preferredLanguage, fullName, dob, mobile, gender, mulank, bhagyank } = req.body || {};
    await reportAccessEngine.syncProfileRecord(user, {
      preferredLanguage,
      fullName
    });
    let numerologyProfile = null;
    if (dob && (fullName || user.fullName)) {
      numerologyProfile = await reportAccessEngine.saveNumerologyProfile(user.supabaseUserId, {
        fullName: fullName || user.fullName || "Seeker",
        dob,
        mobile: mobile || user.phone,
        email: user.email,
        gender: gender || "MALE",
        language: preferredLanguage || "hi",
        mulank,
        bhagyank
      });
    }
    res.json({
      success: true,
      user: {
        id: user.supabaseUserId,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        authProvider: user.authProvider
      },
      numerologyProfile
    });
  } catch (e) {
    const isAuth = e?.message?.includes("UNAUTHORIZED");
    res.status(isAuth ? 401 : 500).json({ success: false, error: e?.message || "Failed to sync profile" });
  }
});
router.get("/reports/check-access", async (req, res) => {
  try {
    const reportType = req.query.reportType;
    const profileKey = req.query.profileKey || "default_profile";
    const authHeader = req.headers["authorization"];
    if (!reportType) {
      return res.status(400).json({
        success: false,
        error: "Missing reportType parameter",
        code: "INVALID_REQUEST"
      });
    }
    const result = await reportAccessEngine.checkReportAccess(reportType, profileKey, authHeader);
    res.json(result);
  } catch (e) {
    console.error("[API:CheckAccess:Error]", e?.message || e);
    const isDbErr = e?.message?.includes("DATABASE") || e?.message?.includes("connection");
    res.status(isDbErr ? 503 : 500).json({
      success: false,
      error: isDbErr ? "Database connection is temporarily unavailable." : e?.message || "Failed to check report access",
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
    const { reportType, profileKey } = req.body || {};
    const authHeader = req.headers["authorization"];
    if (!reportType) {
      return res.status(400).json({
        success: false,
        error: "Missing reportType",
        code: "INVALID_REQUEST"
      });
    }
    const result = await reportAccessEngine.claimFreeReport(reportType, profileKey, authHeader);
    res.json(result);
  } catch (e) {
    console.error("[API:ClaimFree:Error]", e?.message || e);
    const msg = e?.message || "Failed to claim free report";
    const isAuth = msg.includes("UNAUTHORIZED") || msg.includes("login");
    const isDbErr = msg.includes("DATABASE") || msg.includes("connection");
    const isAlready = msg.includes("ALREADY_CLAIMED") || msg.includes("already");
    const status = isAuth ? 401 : isDbErr ? 503 : isAlready ? 400 : 400;
    res.status(status).json({
      success: false,
      error: msg,
      code: isAuth ? "UNAUTHORIZED" : isDbErr ? "DATABASE_UNAVAILABLE" : isAlready ? "ALREADY_CLAIMED" : "CLAIM_FAILED"
    });
  }
});
router.post("/payments/create-order", async (req, res) => {
  try {
    const { reportType, profileKey } = req.body || {};
    const authHeader = req.headers["authorization"];
    if (!reportType) {
      return res.status(400).json({
        success: false,
        error: "Missing reportType",
        code: "INVALID_REQUEST"
      });
    }
    const result = await reportAccessEngine.createPaymentOrder(reportType, profileKey, authHeader);
    res.json(result);
  } catch (e) {
    console.error("[API:CreateOrder:Error]", e?.message || e);
    const msg = e?.message || "Failed to create payment order";
    const isAuth = msg.includes("UNAUTHORIZED") || msg.includes("login");
    res.status(isAuth ? 401 : 400).json({
      success: false,
      error: msg,
      code: isAuth ? "UNAUTHORIZED" : "ORDER_CREATION_FAILED"
    });
  }
});
router.post("/payments/verify-payment", async (req, res) => {
  try {
    const { orderId, paymentId, signature, reportType, profileKey } = req.body || {};
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
      authHeader
    );
    res.json(result);
  } catch (e) {
    console.error("[API:VerifyPayment:Error]", e?.message || e);
    const isAuth = e?.message?.includes("UNAUTHORIZED");
    res.status(isAuth ? 401 : 400).json({
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
router.post("/reports/save-run", async (req, res) => {
  try {
    const user = await requireAuthenticatedUser(req);
    const { reportType, reportKey, reportData, profileName, dob, mobile, language, accessType, amount, paymentId } = req.body || {};
    if (!reportType || !reportData) {
      return res.status(400).json({ success: false, error: "Missing reportType or reportData" });
    }
    const runId = await reportAccessEngine.saveReportRun(
      user.supabaseUserId,
      reportType,
      reportKey || `${reportType}_${Date.now()}`,
      reportData,
      {
        profileName,
        dob,
        mobile,
        language,
        accessType,
        amount,
        paymentId
      }
    );
    res.json({ success: true, runId });
  } catch (e) {
    const isAuth = e?.message?.includes("UNAUTHORIZED");
    res.status(isAuth ? 401 : 500).json({ success: false, error: e?.message || "Failed to save report run" });
  }
});
router.get("/reports/my-reports", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const data = await reportAccessEngine.getUserReports(authHeader);
    res.json(data);
  } catch (e) {
    const isAuth = e?.message?.includes("UNAUTHORIZED");
    res.status(isAuth ? 401 : 500).json({ success: false, error: e?.message || "Failed to fetch user reports" });
  }
});
router.get("/payments/history", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const data = await reportAccessEngine.getUserPaymentHistory(authHeader);
    res.json(data);
  } catch (e) {
    const isAuth = e?.message?.includes("UNAUTHORIZED");
    res.status(isAuth ? 401 : 500).json({ success: false, error: e?.message || "Failed to fetch payment history" });
  }
});
router.get("/reports/:reportId", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const { reportId } = req.params;
    const data = await reportAccessEngine.getReportById(reportId, authHeader);
    res.json(data);
  } catch (e) {
    const isAuth = e?.message?.includes("UNAUTHORIZED");
    res.status(isAuth ? 401 : 403).json({ success: false, error: e?.message || "Failed to access report" });
  }
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
  console.error("Serverless Error:", err);
  res.status(500).json({
    success: false,
    error: "INTERNAL_SERVER_ERROR",
    message: err?.message || "An unexpected internal server error occurred."
  });
});
var index_default = (req, res) => {
  return app(req, res);
};
export {
  index_default as default
};
