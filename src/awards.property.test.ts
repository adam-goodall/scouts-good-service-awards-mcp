// Feature: good-service-awards-mcp, Property 4: Award progression validation
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { isValidProgression } from "./awards.js";
import type { AwardName } from "./types.js";

/**
 * **Validates: Requirements 1.5, 1.7**
 *
 * Property 4: Award progression validation
 * For any (previousAward, targetAward) combination where targetAward is not
 * the valid next step in the hierarchy from previousAward (including the case
 * where previousAward equals targetAward), isValidProgression returns false.
 * For valid progressions, it returns true.
 */

const ALL_AWARDS: AwardName[] = [
  "Chief Scout's Commendation for Good Service",
  "Award for Merit",
  "Bar to the Award for Merit",
  "Silver Acorn",
  "Bar to the Silver Acorn",
  "Silver Wolf",
];

// The exhaustive set of valid progressions
const VALID_PROGRESSIONS: Array<[AwardName | null, AwardName]> = [
  [null, "Chief Scout's Commendation for Good Service"],
  [null, "Award for Merit"],
  ["Chief Scout's Commendation for Good Service", "Award for Merit"],
  ["Award for Merit", "Bar to the Award for Merit"],
  ["Bar to the Award for Merit", "Silver Acorn"],
  ["Silver Acorn", "Bar to the Silver Acorn"],
  ["Silver Acorn", "Silver Wolf"],
  ["Bar to the Silver Acorn", "Silver Wolf"],
];

function isKnownValidProgression(
  from: AwardName | null,
  to: AwardName,
): boolean {
  return VALID_PROGRESSIONS.some(([f, t]) => f === from && t === to);
}

const awardNameArb = fc.constantFrom(...ALL_AWARDS);
const previousAwardArb = fc.constantFrom<(AwardName | null)[]>(
  null,
  ...ALL_AWARDS,
);

describe("Property 4: Award progression validation", () => {
  it("invalid progressions return false", () => {
    fc.assert(
      fc.property(previousAwardArb, awardNameArb, (from, to) => {
        if (!isKnownValidProgression(from, to)) {
          expect(isValidProgression(from, to)).toBe(false);
        }
      }),
      { numRuns: 100 },
    );
  });

  it("valid progressions return true", () => {
    fc.assert(
      fc.property(previousAwardArb, awardNameArb, (from, to) => {
        if (isKnownValidProgression(from, to)) {
          expect(isValidProgression(from, to)).toBe(true);
        }
      }),
      { numRuns: 100 },
    );
  });

  it("same award to same award is always invalid", () => {
    fc.assert(
      fc.property(awardNameArb, (award) => {
        expect(isValidProgression(award, award)).toBe(false);
      }),
      { numRuns: 100 },
    );
  });
});
