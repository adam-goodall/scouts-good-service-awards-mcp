// Feature: good-service-awards-mcp, Property 1: Eligibility result consistency
// Feature: good-service-awards-mcp, Property 3: Service years threshold
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { checkEligibility } from "./eligibility.js";
import type { AwardName, EligibilityInput } from "./types.js";

/**
 * **Validates: Requirements 1.1, 1.2**
 *
 * Property 1: Eligibility result consistency
 * For any valid EligibilityInput with a target award, the result `eligible`
 * field SHALL be true if and only if the `unmetCriteria` array is empty.
 * If `eligible` is false, every unmet criterion has a non-empty reason string.
 */

const ALL_AWARDS: AwardName[] = [
  "Chief Scout's Commendation for Good Service",
  "Award for Merit",
  "Bar to the Award for Merit",
  "Silver Acorn",
  "Bar to the Silver Acorn",
  "Silver Wolf",
];

const previousAwardArb = fc.constantFrom<(AwardName | "none")[]>(
  "none",
  ...ALL_AWARDS,
);

const targetAwardArb = fc.constantFrom(...ALL_AWARDS);

const dateOfLastAwardArb = fc.option(
  fc
    .date({ min: new Date(2000, 0, 1), max: new Date() })
    .filter((d) => !isNaN(d.getTime()))
    .map((d) => d.toISOString().split("T")[0]),
  { nil: undefined },
);

const eligibilityInputArb: fc.Arbitrary<EligibilityInput> = fc.record({
  serviceYears: fc.integer({ min: 1, max: 50 }),
  isMember: fc.boolean(),
  isAppointed: fc.boolean(),
  mandatoryLearningComplete: fc.boolean(),
  criminalRecordCheckValid: fc.boolean(),
  previousAward: previousAwardArb,
  dateOfLastAward: dateOfLastAwardArb,
  targetAward: targetAwardArb,
});

describe("Property 1: Eligibility result consistency", () => {
  it("eligible === (unmetCriteria.length === 0) for any valid input with a target award", () => {
    fc.assert(
      fc.property(eligibilityInputArb, (input) => {
        const result = checkEligibility(input);
        expect(result.eligible).toBe(result.unmetCriteria.length === 0);
      }),
      { numRuns: 100 },
    );
  });

  it("if ineligible, every unmet criterion has a non-empty reason string", () => {
    fc.assert(
      fc.property(eligibilityInputArb, (input) => {
        const result = checkEligibility(input);
        if (!result.eligible) {
          for (const criterion of result.unmetCriteria) {
            expect(criterion.reason).toBeTruthy();
            expect(typeof criterion.reason).toBe("string");
            expect(criterion.reason.length).toBeGreaterThan(0);
          }
        }
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * **Validates: Requirements 1.4**
 *
 * Property 3: Service years threshold
 * For any serviceYears below the minimum for a target award,
 * unmetCriteria includes insufficient service years.
 */

const AWARD_MINIMUMS: Array<{
  name: AwardName;
  minimumServiceYears: number;
  prerequisite: AwardName | "none";
}> = [
  {
    name: "Chief Scout's Commendation for Good Service",
    minimumServiceYears: 5,
    prerequisite: "none",
  },
  {
    name: "Award for Merit",
    minimumServiceYears: 10,
    prerequisite: "none",
  },
  {
    name: "Bar to the Award for Merit",
    minimumServiceYears: 15,
    prerequisite: "Award for Merit",
  },
  {
    name: "Silver Acorn",
    minimumServiceYears: 20,
    prerequisite: "Bar to the Award for Merit",
  },
  {
    name: "Bar to the Silver Acorn",
    minimumServiceYears: 25,
    prerequisite: "Silver Acorn",
  },
  {
    name: "Silver Wolf",
    minimumServiceYears: 30,
    prerequisite: "Silver Acorn",
  },
];

// Generator: picks a random award, then generates serviceYears below its minimum
const belowThresholdArb = fc.constantFrom(...AWARD_MINIMUMS).chain((award) =>
  fc.integer({ min: 1, max: award.minimumServiceYears - 1 }).map((serviceYears) => ({
    award,
    serviceYears,
  })),
);

describe("Property 3: Service years threshold", () => {
  it("serviceYears below minimum results in unmet Service Years criterion", () => {
    fc.assert(
      fc.property(belowThresholdArb, ({ award, serviceYears }) => {
        const input: EligibilityInput = {
          serviceYears,
          isMember: true,
          isAppointed: true,
          mandatoryLearningComplete: true,
          criminalRecordCheckValid: true,
          previousAward: award.prerequisite,
          dateOfLastAward: "2010-01-01",
          targetAward: award.name,
        };

        const result = checkEligibility(input);

        expect(result.eligible).toBe(false);
        expect(
          result.unmetCriteria.some((c) => c.criterion === "Service Years"),
        ).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});

// Feature: good-service-awards-mcp, Property 2: Eligible awards list completeness

/**
 * **Validates: Requirements 1.3**
 *
 * Property 2: Eligible awards list completeness
 * For any valid EligibilityInput without a target award, each award in the
 * returned eligibleAwards list, evaluating that same input with that award as
 * targetAward SHALL return eligible: true. For each award NOT in the list,
 * evaluating with that award as targetAward SHALL return eligible: false.
 */

const eligibilityInputWithoutTargetArb = fc.record({
  serviceYears: fc.integer({ min: 1, max: 50 }),
  isMember: fc.boolean(),
  isAppointed: fc.boolean(),
  mandatoryLearningComplete: fc.boolean(),
  criminalRecordCheckValid: fc.boolean(),
  previousAward: previousAwardArb,
  dateOfLastAward: dateOfLastAwardArb,
});

describe("Property 2: Eligible awards list completeness", () => {
  it("each award in eligibleAwards returns eligible:true when checked individually", () => {
    fc.assert(
      fc.property(eligibilityInputWithoutTargetArb, (input) => {
        const result = checkEligibility(input as EligibilityInput);

        expect(result.eligibleAwards).toBeDefined();

        for (const award of result.eligibleAwards!) {
          const individualResult = checkEligibility({
            ...input,
            targetAward: award,
          } as EligibilityInput);
          expect(individualResult.eligible).toBe(true);
        }
      }),
      { numRuns: 100 },
    );
  });

  it("each award NOT in eligibleAwards returns eligible:false when checked individually", () => {
    fc.assert(
      fc.property(eligibilityInputWithoutTargetArb, (input) => {
        const result = checkEligibility(input as EligibilityInput);

        expect(result.eligibleAwards).toBeDefined();

        const notEligible = ALL_AWARDS.filter(
          (a) => !result.eligibleAwards!.includes(a),
        );

        for (const award of notEligible) {
          const individualResult = checkEligibility({
            ...input,
            targetAward: award,
          } as EligibilityInput);
          expect(individualResult.eligible).toBe(false);
        }
      }),
      { numRuns: 100 },
    );
  });
});

// Feature: good-service-awards-mcp, Property 10: Invalid service years validation

/**
 * **Validates: Requirements 6.1**
 *
 * Property 10: Invalid service years validation
 * For any non-positive-integer serviceYears, a validation error is returned.
 */
describe("Property 10: Invalid service years validation", () => {
  const invalidServiceYearsArb = fc.oneof(
    fc.integer({ min: -100, max: 0 }),
    fc.double({ min: 0.1, max: 50, noNaN: true }).filter((n) => !Number.isInteger(n)),
  );

  const validInputWithInvalidServiceYears = (serviceYears: number): EligibilityInput => ({
    serviceYears,
    isMember: true,
    isAppointed: true,
    mandatoryLearningComplete: true,
    criminalRecordCheckValid: true,
    previousAward: "none",
    targetAward: "Chief Scout's Commendation for Good Service",
  });

  it("returns eligible === false for any non-positive-integer serviceYears", () => {
    fc.assert(
      fc.property(invalidServiceYearsArb, (serviceYears) => {
        const input = validInputWithInvalidServiceYears(serviceYears);
        const result = checkEligibility(input);
        expect(result.eligible).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it("includes an unmet criterion with criterion === 'serviceYears'", () => {
    fc.assert(
      fc.property(invalidServiceYearsArb, (serviceYears) => {
        const input = validInputWithInvalidServiceYears(serviceYears);
        const result = checkEligibility(input);
        const serviceYearsCriterion = result.unmetCriteria.find(
          (c) => c.criterion === "serviceYears",
        );
        expect(serviceYearsCriterion).toBeDefined();
      }),
      { numRuns: 100 },
    );
  });

  it("reason mentions 'whole number greater than zero'", () => {
    fc.assert(
      fc.property(invalidServiceYearsArb, (serviceYears) => {
        const input = validInputWithInvalidServiceYears(serviceYears);
        const result = checkEligibility(input);
        const serviceYearsCriterion = result.unmetCriteria.find(
          (c) => c.criterion === "serviceYears",
        );
        expect(serviceYearsCriterion!.reason).toContain("whole number greater than zero");
      }),
      { numRuns: 100 },
    );
  });
});
