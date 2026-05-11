// Feature: nomination-form-writer, Property 1: Section completeness
// Feature: nomination-form-writer, Property 2: Award-specific guidance availability
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { getNominationGuidance } from "./nomination-guidance.js";
import type { AwardName } from "./types.js";

/**
 * **Validates: Requirements 1.2**
 *
 * Property 1: Section completeness
 * For any section returned by `getNominationGuidance()`, it SHALL have a
 * non-empty title, a non-empty description, and a non-empty tips array
 * with at least one entry.
 */

const guidance = getNominationGuidance();
const sectionIndexArb = fc.integer({
  min: 0,
  max: guidance.sections.length - 1,
});

describe("Property 1: Section completeness", () => {
  it("every section has a non-empty title", () => {
    fc.assert(
      fc.property(sectionIndexArb, (index) => {
        const section = guidance.sections[index];
        expect(section.title).toBeDefined();
        expect(section.title.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it("every section has a non-empty description", () => {
    fc.assert(
      fc.property(sectionIndexArb, (index) => {
        const section = guidance.sections[index];
        expect(section.description).toBeDefined();
        expect(section.description.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it("every section has a non-empty tips array with at least one entry", () => {
    fc.assert(
      fc.property(sectionIndexArb, (index) => {
        const section = guidance.sections[index];
        expect(section.tips).toBeDefined();
        expect(Array.isArray(section.tips)).toBe(true);
        expect(section.tips.length).toBeGreaterThan(0);
        for (const tip of section.tips) {
          expect(tip.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 },
    );
  });
});


/**
 * **Validates: Requirements 1.4, 1.5**
 *
 * Property 2: Award-specific guidance availability
 * For any valid AwardName, calling `getNominationGuidance(awardName)` SHALL
 * return a response where `awardSpecificGuidance` is defined, has a matching
 * `awardName` field, and contains non-empty `evidenceRequired`, `typicalProfile`,
 * and `tips` fields.
 */

const AWARD_NAMES: AwardName[] = [
  "Chief Scout's Commendation for Good Service",
  "Award for Merit",
  "Bar to the Award for Merit",
  "Silver Acorn",
  "Bar to the Silver Acorn",
  "Silver Wolf",
];

const awardNameArb = fc.constantFrom(...AWARD_NAMES);

describe("Property 2: Award-specific guidance availability", () => {
  it("awardSpecificGuidance is defined for any valid AwardName", () => {
    fc.assert(
      fc.property(awardNameArb, (awardName) => {
        const result = getNominationGuidance(awardName);
        expect(result.awardSpecificGuidance).toBeDefined();
      }),
      { numRuns: 100 },
    );
  });

  it("awardSpecificGuidance has a matching awardName field", () => {
    fc.assert(
      fc.property(awardNameArb, (awardName) => {
        const result = getNominationGuidance(awardName);
        expect(result.awardSpecificGuidance!.awardName).toBe(awardName);
      }),
      { numRuns: 100 },
    );
  });

  it("awardSpecificGuidance has non-empty evidenceRequired", () => {
    fc.assert(
      fc.property(awardNameArb, (awardName) => {
        const result = getNominationGuidance(awardName);
        expect(result.awardSpecificGuidance!.evidenceRequired.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it("awardSpecificGuidance has non-empty typicalProfile", () => {
    fc.assert(
      fc.property(awardNameArb, (awardName) => {
        const result = getNominationGuidance(awardName);
        expect(result.awardSpecificGuidance!.typicalProfile.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it("awardSpecificGuidance has non-empty tips array", () => {
    fc.assert(
      fc.property(awardNameArb, (awardName) => {
        const result = getNominationGuidance(awardName);
        const tips = result.awardSpecificGuidance!.tips;
        expect(tips.length).toBeGreaterThan(0);
        for (const tip of tips) {
          expect(tip.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 },
    );
  });
});
