import { describe, it, expect } from "vitest";
import { validateNominationForm, formatNominationForm } from "./nomination.js";
import type { NominationInput } from "./types.js";

function validInput(overrides: Partial<NominationInput> = {}): NominationInput {
  return {
    mainRole: "Group Scout Leader",
    additionalService: "District training advisor",
    keyAchievements: "Led group growth from 20 to 60 members",
    achievementsPeriod: "since_last_award",
    levelOfService: "Exceptional commitment over many years",
    serviceLevelChange: "substantially_increased",
    communityInvolvement: "Active in local community events",
    otherInformation: "Mentored several new leaders",
    citation: "For outstanding service to Scouting in the local community",
    ...overrides,
  };
}

describe("validateNominationForm", () => {
  it("returns valid for a complete, correct input", () => {
    const result = validateNominationForm(validInput());
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects empty mainRole", () => {
    const result = validateNominationForm(validInput({ mainRole: "" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "mainRole" }),
    );
  });

  it("rejects whitespace-only fields", () => {
    const result = validateNominationForm(validInput({ keyAchievements: "   \t\n  " }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "keyAchievements" }),
    );
  });

  it("rejects citation over 300 characters", () => {
    const longCitation = "a".repeat(301);
    const result = validateNominationForm(validInput({ citation: longCitation }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "citation" }),
    );
  });

  it("accepts citation of exactly 300 characters", () => {
    const citation = "a".repeat(300);
    const result = validateNominationForm(validInput({ citation }));
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("reports multiple errors for multiple empty fields", () => {
    const result = validateNominationForm(
      validInput({ mainRole: "", additionalService: "  ", citation: "" }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBe(3);
    const fields = result.errors.map((e) => e.field);
    expect(fields).toContain("mainRole");
    expect(fields).toContain("additionalService");
    expect(fields).toContain("citation");
  });

  it("each error has a non-empty message", () => {
    const result = validateNominationForm(validInput({ mainRole: "" }));
    for (const error of result.errors) {
      expect(error.message.length).toBeGreaterThan(0);
    }
  });
});

describe("formatNominationForm", () => {
  it("contains all field values in the output", () => {
    const input = validInput();
    const output = formatNominationForm(input);
    expect(output).toContain(input.mainRole);
    expect(output).toContain(input.additionalService);
    expect(output).toContain(input.keyAchievements);
    expect(output).toContain(input.levelOfService);
    expect(output).toContain(input.communityInvolvement);
    expect(output).toContain(input.otherInformation);
    expect(output).toContain(input.citation);
  });

  it("includes achievements period context for since_last_award", () => {
    const output = formatNominationForm(
      validInput({ achievementsPeriod: "since_last_award" }),
    );
    expect(output).toContain("period since last award");
  });

  it("includes achievements period context for entire_service", () => {
    const output = formatNominationForm(
      validInput({ achievementsPeriod: "entire_service" }),
    );
    expect(output).toContain("entire service");
  });

  it("includes service level change context for similar", () => {
    const output = formatNominationForm(
      validInput({ serviceLevelChange: "similar" }),
    );
    expect(output).toContain("continued at a similar level");
  });

  it("includes service level change context for substantially_increased", () => {
    const output = formatNominationForm(
      validInput({ serviceLevelChange: "substantially_increased" }),
    );
    expect(output).toContain("substantially increased");
  });

  it("includes eligibility reminder", () => {
    const output = formatNominationForm(validInput());
    expect(output).toContain(
      "Reminder: Please verify the nominee's eligibility before submitting this nomination.",
    );
  });
});
