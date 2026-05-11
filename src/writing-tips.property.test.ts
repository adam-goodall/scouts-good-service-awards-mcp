// Feature: nomination-form-writer, Property 5: Award-specific writing tips availability
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { getWritingTips } from "./writing-tips.js";
import type { AwardName } from "./types.js";

/**
 * **Validates: Requirements 3.5**
 *
 * Property 5: Award-specific writing tips availability
 * For any valid AwardName, calling getWritingTips(awardName) SHALL return a
 * response where awardSpecificTips is a non-empty array of strings.
 */

const ALL_AWARDS: AwardName[] = [
  "Chief Scout's Commendation for Good Service",
  "Award for Merit",
  "Bar to the Award for Merit",
  "Silver Acorn",
  "Bar to the Silver Acorn",
  "Silver Wolf",
];

const awardNameArb = fc.constantFrom(...ALL_AWARDS);

describe("Property 5: Award-specific writing tips availability", () => {
  it("returns non-empty awardSpecificTips for any valid award name", () => {
    fc.assert(
      fc.property(awardNameArb, (awardName) => {
        const result = getWritingTips(awardName);

        expect(result.awardSpecificTips).toBeDefined();
        expect(Array.isArray(result.awardSpecificTips)).toBe(true);
        expect(result.awardSpecificTips!.length).toBeGreaterThan(0);
        result.awardSpecificTips!.forEach((tip) => {
          expect(typeof tip).toBe("string");
          expect(tip.length).toBeGreaterThan(0);
        });
      }),
      { numRuns: 100 },
    );
  });
});
