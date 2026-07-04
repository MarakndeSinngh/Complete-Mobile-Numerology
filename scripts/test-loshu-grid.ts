import { computeLoshuAnalysis } from '../src/services/loshuEngine';
import { computeLoshuMasterReport } from '../src/services/loshuMasterEngine';

interface TestDOB {
  name: string;
  dob: string;
  expectedCounts: Record<number, number>;
}

const testCases: TestDOB[] = [
  {
    name: "Markandey Singh",
    dob: "1983-08-05", // Digits: 1, 9, 8, 3, 8, 5
    expectedCounts: {
      1: 1, // '1'
      2: 0,
      3: 1, // '3'
      4: 0,
      5: 1, // '5'
      6: 0,
      7: 0,
      8: 2, // '8', '8'
      9: 1  // '9'
    }
  },
  {
    name: "John Doe",
    dob: "1995-12-03", // Digits: 1, 9, 9, 5, 1, 2, 3
    expectedCounts: {
      1: 2, // '1', '1'
      2: 1, // '2'
      3: 1, // '3'
      4: 0,
      5: 1, // '5'
      6: 0,
      7: 0,
      8: 0,
      9: 2  // '9', '9'
    }
  },
  {
    name: "Aman Verma",
    dob: "2000-10-10", // Digits: 2, 1, 1 (zeros are ignored)
    expectedCounts: {
      1: 2, // '1', '1'
      2: 1, // '2'
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0
    }
  }
];

function runTests() {
  console.log("=========================================");
  console.log("RUNNING LO SHU GRID ENGINE REGRESSION TESTS");
  console.log("=========================================");

  let allPassed = true;

  for (const tc of testCases) {
    console.log(`\nTesting Case: ${tc.name} | DOB: ${tc.dob}`);
    let casePassed = true;
    
    // 1. Test computeLoshuAnalysis from loshuEngine.ts
    const analysis = computeLoshuAnalysis(tc.dob, tc.name);
    console.log("  Checking loshuEngine.ts (computeLoshuAnalysis):");
    for (let d = 1; d <= 9; d++) {
      const actualCount = analysis.loshuGrid[d].dobCount;
      const expectedCount = tc.expectedCounts[d];
      if (actualCount !== expectedCount) {
        console.error(`  ❌ Digit ${d}: Expected count ${expectedCount}, but got ${actualCount}`);
        casePassed = false;
        allPassed = false;
      } else {
        console.log(`  ✓ Digit ${d}: count ${actualCount} matches`);
      }
    }

    // 2. Test computeLoshuMasterReport from loshuMasterEngine.ts
    const masterReport = computeLoshuMasterReport(tc.dob, tc.name, "MALE");
    console.log("  Checking loshuMasterEngine.ts (computeLoshuMasterReport):");
    for (let d = 1; d <= 9; d++) {
      const expectedCount = tc.expectedCounts[d];
      const isPresentInReport = masterReport.gridAnalysis.present.includes(d);
      const isExpectedPresent = expectedCount > 0;
      
      if (isPresentInReport !== isExpectedPresent) {
        console.error(`  ❌ Digit ${d}: Expected presence ${isExpectedPresent}, but got ${isPresentInReport}`);
        casePassed = false;
        allPassed = false;
      } else {
        console.log(`  ✓ Digit ${d}: presence matches`);
      }
    }
    
    if (casePassed) {
      console.log(`  🎉 All counts and presence states match exactly for ${tc.name}!`);
    } else {
      console.error(`  ❌ Failed counts for ${tc.name}`);
    }
  }

  console.log("\n=========================================");
  if (allPassed) {
    console.log("🎉 SUCCESS: All regression tests passed! No derived values are present in the Lo Shu Grid.");
    process.exit(0);
  } else {
    console.error("❌ FAILURE: Regression tests failed.");
    process.exit(1);
  }
}

runTests();
