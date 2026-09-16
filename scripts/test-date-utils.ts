import {
  parseIndianDate,
  formatDateIndian,
  formatDateForDisplay,
  formatDateForStorage,
  normalizeIndianDate,
  isValidIndianDate,
  DATE_DISPLAY_FORMAT,
  DATE_STORAGE_FORMAT
} from '../src/utils/dateUtils';
import { calculateDriver, calculateBhagyank } from '../src/core/numerologyEngine';
import { computeLoshuAnalysis } from '../src/services/loshuEngine';
import { computeLoshuMasterReport } from '../src/services/loshuMasterEngine';

console.log("=========================================");
console.log("RUNNING DATE UTILS & INDIAN FORMAT TESTS");
console.log(`Config: DISPLAY=${DATE_DISPLAY_FORMAT} | STORAGE=${DATE_STORAGE_FORMAT}`);
console.log("=========================================");

// Test cases required by the user prompt
const requiredTests = [
  {
    inputIndian: "05/08/1983",
    flexibleInput: "5/8/1983",
    expectedStorage: "1983-08-05",
    expectedDisplay: "05/08/1983",
    expectedDay: 5,
    expectedMonth: 8,
    expectedYear: 1983,
    expectedDriver: 5,
    expectedBhagyank: 7,
    expectedDobDigits: [5, 8, 1, 9, 8, 3]
  },
  {
    inputIndian: "14/08/1983",
    flexibleInput: "14/8/1983",
    expectedStorage: "1983-08-14",
    expectedDisplay: "14/08/1983",
    expectedDay: 14,
    expectedMonth: 8,
    expectedYear: 1983,
    expectedDriver: 5, // 1 + 4 = 5
    expectedBhagyank: 7, // 1+9+8+3+0+8+1+4 = 34 -> 7
    expectedDobDigits: [1, 4, 8, 1, 9, 8, 3]
  },
  {
    inputIndian: "02/07/1983",
    flexibleInput: "2/7/1983",
    expectedStorage: "1983-07-02",
    expectedDisplay: "02/07/1983",
    expectedDay: 2,
    expectedMonth: 7,
    expectedYear: 1983,
    expectedDriver: 2,
    expectedBhagyank: 3, // 1+9+8+3+0+7+0+2 = 30 -> 3
    expectedDobDigits: [2, 7, 1, 9, 8, 3]
  },
  {
    inputIndian: "19/02/1980",
    flexibleInput: "19/2/1980",
    expectedStorage: "1980-02-19",
    expectedDisplay: "19/02/1980",
    expectedDay: 19,
    expectedMonth: 2,
    expectedYear: 1980,
    expectedDriver: 1, // 1 + 9 = 10 -> 1
    expectedBhagyank: 3, // 1+9+8+0+0+2+1+9 = 30 -> 3
    expectedDobDigits: [1, 9, 2, 1, 9, 8]
  }
];

let allPassed = true;

for (const t of requiredTests) {
  console.log(`\nTesting Indian Date: ${t.inputIndian}`);
  
  // 1. Parsing
  const parsed = parseIndianDate(t.inputIndian);
  if (!parsed || parsed.day !== t.expectedDay || parsed.month !== t.expectedMonth || parsed.year !== t.expectedYear) {
    console.error(`  ❌ parseIndianDate failed for ${t.inputIndian}: got ${JSON.stringify(parsed)}`);
    allPassed = false;
  } else {
    console.log(`  ✓ parseIndianDate parsed ${t.expectedDay}/${t.expectedMonth}/${t.expectedYear} correctly`);
  }

  // 2. Flexible parsing
  const parsedFlex = parseIndianDate(t.flexibleInput);
  if (!parsedFlex || parsedFlex.day !== t.expectedDay || parsedFlex.month !== t.expectedMonth || parsedFlex.year !== t.expectedYear) {
    console.error(`  ❌ parseIndianDate failed for flexible input ${t.flexibleInput}: got ${JSON.stringify(parsedFlex)}`);
    allPassed = false;
  } else {
    console.log(`  ✓ parseIndianDate parsed flexible ${t.flexibleInput} correctly`);
  }

  // 3. Storage conversion
  const storage = formatDateForStorage(t.inputIndian);
  if (storage !== t.expectedStorage) {
    console.error(`  ❌ formatDateForStorage failed: expected ${t.expectedStorage}, got ${storage}`);
    allPassed = false;
  } else {
    console.log(`  ✓ formatDateForStorage created ${storage}`);
  }

  // 4. Display conversion from storage
  const display = formatDateForDisplay(storage);
  if (display !== t.expectedDisplay) {
    console.error(`  ❌ formatDateForDisplay failed: expected ${t.expectedDisplay}, got ${display}`);
    allPassed = false;
  } else {
    console.log(`  ✓ formatDateForDisplay created ${display}`);
  }

  // 5. Driver & Bhagyank calculation from internal storage
  const driver = calculateDriver(storage);
  const bhagyank = calculateBhagyank(storage);
  if (driver !== t.expectedDriver) {
    console.error(`  ❌ calculateDriver failed: expected ${t.expectedDriver}, got ${driver}`);
    allPassed = false;
  } else {
    console.log(`  ✓ Driver / Mulank: #${driver} matches expected #${t.expectedDriver}`);
  }

  if (bhagyank !== t.expectedBhagyank) {
    console.error(`  ❌ calculateBhagyank failed: expected ${t.expectedBhagyank}, got ${bhagyank}`);
    allPassed = false;
  } else {
    console.log(`  ✓ Bhagyank / Conductor: #${bhagyank} matches expected #${t.expectedBhagyank}`);
  }

  // 6. Complete Lo Shu Analysis check
  const analysis = computeLoshuAnalysis(storage, "Test Seeker");
  if (analysis.mulank !== t.expectedDriver || analysis.bhagyank !== t.expectedBhagyank) {
    console.error(`  ❌ computeLoshuAnalysis mismatch: Mulank=${analysis.mulank}, Bhagyank=${analysis.bhagyank}`);
    allPassed = false;
  } else {
    console.log(`  ✓ computeLoshuAnalysis engine verified successfully`);
  }
}

// Invalid dates testing
console.log("\nTesting Invalid Dates Validation:");
const invalidDates = [
  "31/02/1983", // Feb has max 28 in 1983
  "29/02/1983", // 1983 is not leap year
  "00/08/1983", // day 0
  "05/00/1983", // month 0
  "35/08/1983", // day 35
  "31/04/1983", // April has 30 days
  "31/06/1983", // June has 30 days
  "31/09/1983", // Sept has 30 days
  "31/11/1983", // Nov has 30 days
  "invalid",
  "",
  "99/99/9999"
];

for (const inv of invalidDates) {
  const isValid = isValidIndianDate(inv);
  if (isValid) {
    console.error(`  ❌ Expected "${inv}" to be INVALID, but got valid!`);
    allPassed = false;
  } else {
    console.log(`  ✓ Rejected invalid date "${inv}" properly`);
  }
}

// Valid leap year test: 29/02/1980 (1980 was a leap year)
if (isValidIndianDate("29/02/1980")) {
  console.log(`  ✓ Accepted leap year date "29/02/1980" properly`);
} else {
  console.error(`  ❌ "29/02/1980" should be VALID leap year date!`);
  allPassed = false;
}

if (!allPassed) {
  console.error("\n❌ Some tests failed!");
  process.exit(1);
} else {
  console.log("\n=========================================");
  console.log("🎉 ALL DATE UTILS & INDIAN FORMAT TESTS PASSED!");
  console.log("=========================================");
}
