// Feature: nomination-form-writer, Property 4: Sample nomination completeness
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { getSampleCitations } from "./sample-citations.js";

/**
 * **Validates: Requirements 2.5**
 *
 * Property 4: Sample nomination completeness
 * For any sample nomination returned by `getSampleCitations()`, all 7 section
 * fields (`mainRole`, `additionalService`, `keyAchievements`, `levelOfService`,
 * `communityInvolvement`, `otherInformation`, `citation`) SHALL be non-empty strings.
 */

const { samples } = getSampleCitations();
const sampleIndexArb = fc.integer({ min: 0, max: samples.length - 1 });

const sectionFields = [
  "mainRole",
  "additionalService",
  "keyAchievements",
  "levelOfService",
  "communityInvolvement",
  "otherInformation",
  "citation",
] as const;

describe("Property 4: Sample nomination completeness", () => {
  it("every sample has all 7 section fields as non-empty strings", () => {
    fc.assert(
      fc.property(sampleIndexArb, (index) => {
        const sample = samples[index];
        for (const field of sectionFields) {
          expect(typeof sample[field]).toBe("string");
          expect(sample[field].length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 },
    );
  });
});
