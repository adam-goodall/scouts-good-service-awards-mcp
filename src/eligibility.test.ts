import { describe, it, expect } from "vitest";
import {
  checkEligibility,
  getEligibleAwards,
  checkGeneralCriteria,
  checkAwardSpecificCriteria,
} from "./eligibility.js";
import type { EligibilityInput } from "./types.js";

const fullyEligibleInput: EligibilityInput = {
  serviceYears: 10,
  isMember: true,
  isAppointed: true,
  mandatoryLearningComplete: true,
  criminalRecordCheckValid: true,
  previousAward: "Chief Scout's Commendation for Good Service",
  dateOfLastAward: "2015-01-01",
  targetAward: "Award for Merit",
};

describe("checkGeneralCriteria", () => {
  it("returns no unmet criteria when all general criteria are met", () => {
    const result = checkGeneralCriteria(fullyEligibleInput);
    expect(result).toEqual([]);
  });

  it("returns unmet criterion for non-member", () => {
    const result = checkGeneralCriteria({ ...fullyEligibleInput, isMember: false });
    expect(result).toHaveLength(1);
    expect(result[0].criterion).toBe("Membership");
  });

  it("returns unmet criterion for not appointed", () => {
    const result = checkGeneralCriteria({ ...fullyEligibleInput, isAppointed: false });
    expect(result).toHaveLength(1);
    expect(result[0].criterion).toBe("Appointment");
  });

  it("returns unmet criterion for incomplete mandatory learning", () => {
    const result = checkGeneralCriteria({
      ...fullyEligibleInput,
      mandatoryLearningComplete: false,
    });
    expect(result).toHaveLength(1);
    expect(result[0].criterion).toBe("Mandatory Learning");
  });

  it("returns unmet criterion for invalid CRC", () => {
    const result = checkGeneralCriteria({
      ...fullyEligibleInput,
      criminalRecordCheckValid: false,
    });
    expect(result).toHaveLength(1);
    expect(result[0].criterion).toBe("Criminal Record Check");
  });

  it("returns multiple unmet criteria when several are not met", () => {
    const result = checkGeneralCriteria({
      ...fullyEligibleInput,
      isMember: false,
      isAppointed: false,
    });
    expect(result).toHaveLength(2);
  });
});

describe("checkAwardSpecificCriteria", () => {
  it("returns no unmet criteria when all specific criteria are met", () => {
    const result = checkAwardSpecificCriteria(fullyEligibleInput);
    expect(result).toEqual([]);
  });

  it("returns empty array when no targetAward is specified", () => {
    const { targetAward, ...rest } = fullyEligibleInput;
    const result = checkAwardSpecificCriteria({ ...rest, targetAward: undefined });
    expect(result).toEqual([]);
  });

  it("returns unmet criterion for insufficient service years", () => {
    const result = checkAwardSpecificCriteria({
      ...fullyEligibleInput,
      serviceYears: 5,
    });
    expect(result.some((c) => c.criterion === "Service Years")).toBe(true);
  });

  it("returns unmet criterion for invalid progression", () => {
    const result = checkAwardSpecificCriteria({
      ...fullyEligibleInput,
      previousAward: "none",
      targetAward: "Silver Acorn",
    });
    expect(result.some((c) => c.criterion === "Award Progression")).toBe(true);
  });

  it("returns unmet criterion when nominee already holds target award", () => {
    const result = checkAwardSpecificCriteria({
      ...fullyEligibleInput,
      previousAward: "Award for Merit",
      targetAward: "Award for Merit",
    });
    expect(result.some((c) => c.criterion === "Award Progression")).toBe(true);
    expect(result.some((c) => c.reason.includes("already holds"))).toBe(true);
  });

  it("returns unmet criterion when 5-year gap not met", () => {
    const recentDate = new Date();
    recentDate.setFullYear(recentDate.getFullYear() - 3);
    const result = checkAwardSpecificCriteria({
      ...fullyEligibleInput,
      dateOfLastAward: recentDate.toISOString().split("T")[0],
    });
    expect(result.some((c) => c.criterion === "Five-Year Gap")).toBe(true);
  });

  it("does not flag 5-year gap when more than 5 years have passed", () => {
    const result = checkAwardSpecificCriteria({
      ...fullyEligibleInput,
      dateOfLastAward: "2015-01-01",
    });
    expect(result.some((c) => c.criterion === "Five-Year Gap")).toBe(false);
  });
});

describe("checkEligibility", () => {
  it("returns eligible when all criteria are met", () => {
    const result = checkEligibility(fullyEligibleInput);
    expect(result.eligible).toBe(true);
    expect(result.targetAward).toBe("Award for Merit");
    expect(result.unmetCriteria).toEqual([]);
  });

  it("returns ineligible with unmet criteria when criteria are not met", () => {
    const result = checkEligibility({
      ...fullyEligibleInput,
      isMember: false,
    });
    expect(result.eligible).toBe(false);
    expect(result.unmetCriteria.length).toBeGreaterThan(0);
  });

  it("returns validation error for non-positive service years", () => {
    const result = checkEligibility({ ...fullyEligibleInput, serviceYears: 0 });
    expect(result.eligible).toBe(false);
    expect(result.unmetCriteria[0].criterion).toBe("serviceYears");
  });

  it("returns validation error for non-integer service years", () => {
    const result = checkEligibility({ ...fullyEligibleInput, serviceYears: 5.5 });
    expect(result.eligible).toBe(false);
    expect(result.unmetCriteria[0].criterion).toBe("serviceYears");
  });

  it("returns validation error for negative service years", () => {
    const result = checkEligibility({ ...fullyEligibleInput, serviceYears: -3 });
    expect(result.eligible).toBe(false);
    expect(result.unmetCriteria[0].criterion).toBe("serviceYears");
  });

  it("returns eligibleAwards when no targetAward specified", () => {
    const result = checkEligibility({
      serviceYears: 10,
      isMember: true,
      isAppointed: true,
      mandatoryLearningComplete: true,
      criminalRecordCheckValid: true,
      previousAward: "none",
    });
    expect(result.eligibleAwards).toBeDefined();
    expect(result.eligibleAwards!.length).toBeGreaterThan(0);
  });

  it("eligible is true iff unmetCriteria is empty (Property 1)", () => {
    const result = checkEligibility(fullyEligibleInput);
    expect(result.eligible).toBe(result.unmetCriteria.length === 0);
  });
});

describe("getEligibleAwards", () => {
  it("returns awards the nominee qualifies for", () => {
    const result = getEligibleAwards({
      serviceYears: 10,
      isMember: true,
      isAppointed: true,
      mandatoryLearningComplete: true,
      criminalRecordCheckValid: true,
      previousAward: "none",
      dateOfLastAward: "2015-01-01",
    });
    expect(result).toContain("Award for Merit");
  });

  it("returns empty array when no awards are eligible", () => {
    const result = getEligibleAwards({
      serviceYears: 1,
      isMember: false,
      isAppointed: false,
      mandatoryLearningComplete: false,
      criminalRecordCheckValid: false,
      previousAward: "none",
    });
    expect(result).toEqual([]);
  });

  it("new volunteer with 5 years is eligible for Commendation", () => {
    const result = getEligibleAwards({
      serviceYears: 5,
      isMember: true,
      isAppointed: true,
      mandatoryLearningComplete: true,
      criminalRecordCheckValid: true,
      previousAward: "none",
    });
    expect(result).toContain("Chief Scout's Commendation for Good Service");
  });
});
