// Feature: good-service-awards-mcp, Property 8: Whitespace-only field rejection
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { validateNominationForm } from "./nomination.js";
import type { NominationInput } from "./types.js";

/**
 * **Validates: Requirements 2.7, 6.5**
 *
 * Property 8: Whitespace-only field rejection
 * For any required nomination form field and any string composed entirely of
 * whitespace characters (including empty string), the nomination form validation
 * SHALL reject the input with an error identifying that field.
 */

const REQUIRED_STRING_FIELDS = [
  "mainRole",
  "additionalService",
  "keyAchievements",
  "levelOfService",
  "communityInvolvement",
  "otherInformation",
  "citation",
] as const;

function makeValidInput(): NominationInput {
  return {
    mainRole: "Group Scout Leader",
    additionalService: "District training advisor",
    keyAchievements: "Led successful camp programme",
    achievementsPeriod: "since_last_award",
    levelOfService: "Consistently high commitment",
    serviceLevelChange: "similar",
    communityInvolvement: "Active in local community events",
    otherInformation: "Mentored new leaders",
    citation: "Dedicated volunteer with outstanding service",
  };
}

describe("Property 8: Whitespace-only field rejection", () => {
  const whitespaceArb = fc.oneof(
    fc.constant(""),
    fc
      .array(fc.constantFrom(" ", "\t", "\n", "\r"), {
        minLength: 1,
        maxLength: 20,
      })
      .map((chars) => chars.join("")),
  );

  it("any required field set to whitespace-only is rejected with a field-specific error", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...REQUIRED_STRING_FIELDS),
        whitespaceArb,
        (field, whitespaceValue) => {
          const input = makeValidInput();
          input[field] = whitespaceValue;

          const result = validateNominationForm(input);

          // Validation must reject
          expect(result.valid).toBe(false);

          // Errors must include one for the specific field
          const fieldError = result.errors.find((e) => e.field === field);
          expect(fieldError).toBeDefined();
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: good-service-awards-mcp, Property 7: Citation length boundary

/**
 * **Validates: Requirements 2.4**
 *
 * Property 7: Citation length boundary
 * For any string > 300 characters, nomination form validation rejects with a citation error.
 * For any string 1–300 characters (non-whitespace-only), validation accepts (no citation error).
 */

function makeValidInputWithCitation(citation: string): NominationInput {
  return {
    mainRole: "Section Leader",
    additionalService: "District training team",
    keyAchievements: "Led multiple camps",
    achievementsPeriod: "since_last_award",
    levelOfService: "District level",
    serviceLevelChange: "similar",
    communityInvolvement: "Local community events",
    otherInformation: "Mentored new leaders",
    citation,
  };
}

describe("Property 7: Citation length boundary", () => {
  it("strings longer than 300 characters are rejected with a citation error", () => {
    const longCitationArb = fc
      .string({ minLength: 301, maxLength: 500 })
      .filter((s) => s.trim().length > 0);

    fc.assert(
      fc.property(longCitationArb, (citation) => {
        const input = makeValidInputWithCitation(citation);
        const result = validateNominationForm(input);

        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.field === "citation")).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it("strings between 1 and 300 characters (non-whitespace-only) are accepted", () => {
    const validCitationArb = fc
      .string({ minLength: 1, maxLength: 300 })
      .filter((s) => s.trim().length > 0);

    fc.assert(
      fc.property(validCitationArb, (citation) => {
        const input = makeValidInputWithCitation(citation);
        const result = validateNominationForm(input);

        expect(result.errors.some((e) => e.field === "citation")).toBe(false);
      }),
      { numRuns: 100 },
    );
  });
});
