import { describe, it, expect } from "vitest";
import {
  AWARD_HIERARCHY,
  getAwardByName,
  getNextAward,
  isValidProgression,
} from "./awards.js";
import type { AwardName } from "./types.js";

describe("AWARD_HIERARCHY", () => {
  it("contains all six awards in progression order", () => {
    expect(AWARD_HIERARCHY).toHaveLength(6);
    expect(AWARD_HIERARCHY.map((a) => a.name)).toEqual([
      "Chief Scout's Commendation for Good Service",
      "Award for Merit",
      "Bar to the Award for Merit",
      "Silver Acorn",
      "Bar to the Silver Acorn",
      "Silver Wolf",
    ]);
  });

  it("has correct minimum service years for each award", () => {
    const years = AWARD_HIERARCHY.map((a) => a.minimumServiceYears);
    expect(years).toEqual([5, 10, 15, 20, 25, 30]);
  });

  it("classifies lower and higher awards correctly", () => {
    const classifications = AWARD_HIERARCHY.map((a) => a.classification);
    expect(classifications).toEqual([
      "lower",
      "lower",
      "lower",
      "lower",
      "higher",
      "higher",
    ]);
  });

  it("all awards require a 5-year gap", () => {
    expect(AWARD_HIERARCHY.every((a) => a.fiveYearGapRequired)).toBe(true);
  });

  it("lower awards are approved locally", () => {
    const lowerAwards = AWARD_HIERARCHY.filter(
      (a) => a.classification === "lower",
    );
    expect(
      lowerAwards.every(
        (a) => a.approvalAuthority === "Local (District/County/Area)",
      ),
    ).toBe(true);
  });

  it("higher awards require National Awards Advisory Group", () => {
    const higherAwards = AWARD_HIERARCHY.filter(
      (a) => a.classification === "higher",
    );
    expect(
      higherAwards.every(
        (a) => a.approvalAuthority === "National Awards Advisory Group",
      ),
    ).toBe(true);
  });

  it("Silver Wolf description mentions Chief Scout's unrestricted gift", () => {
    const silverWolf = AWARD_HIERARCHY.find((a) => a.name === "Silver Wolf");
    expect(silverWolf?.description).toContain("unrestricted gift");
  });
});

describe("getAwardByName", () => {
  it("returns the correct award for each name", () => {
    const award = getAwardByName("Silver Acorn");
    expect(award.minimumServiceYears).toBe(20);
    expect(award.classification).toBe("lower");
    expect(award.prerequisite).toBe("Bar to the Award for Merit");
  });

  it("throws for an unknown award name", () => {
    expect(() => getAwardByName("Fake Award" as AwardName)).toThrow(
      "Unknown award",
    );
  });
});

describe("getNextAward", () => {
  it("returns Award for Merit after Chief Scout's Commendation", () => {
    expect(
      getNextAward("Chief Scout's Commendation for Good Service"),
    ).toBe("Award for Merit");
  });

  it("returns Bar to the Award for Merit after Award for Merit", () => {
    expect(getNextAward("Award for Merit")).toBe("Bar to the Award for Merit");
  });

  it("returns null after Silver Wolf (no next award)", () => {
    expect(getNextAward("Silver Wolf")).toBeNull();
  });

  it("throws for an unknown award name", () => {
    expect(() => getNextAward("Fake Award" as AwardName)).toThrow(
      "Unknown award",
    );
  });
});

describe("isValidProgression", () => {
  it("allows null → Chief Scout's Commendation", () => {
    expect(
      isValidProgression(null, "Chief Scout's Commendation for Good Service"),
    ).toBe(true);
  });

  it("allows null → Award for Merit", () => {
    expect(isValidProgression(null, "Award for Merit")).toBe(true);
  });

  it("rejects null → Bar to the Award for Merit (skipping)", () => {
    expect(isValidProgression(null, "Bar to the Award for Merit")).toBe(false);
  });

  it("allows Chief Scout's Commendation → Award for Merit", () => {
    expect(
      isValidProgression(
        "Chief Scout's Commendation for Good Service",
        "Award for Merit",
      ),
    ).toBe(true);
  });

  it("allows Award for Merit → Bar to the Award for Merit", () => {
    expect(
      isValidProgression("Award for Merit", "Bar to the Award for Merit"),
    ).toBe(true);
  });

  it("allows Bar to the Award for Merit → Silver Acorn", () => {
    expect(
      isValidProgression("Bar to the Award for Merit", "Silver Acorn"),
    ).toBe(true);
  });

  it("allows Silver Acorn → Bar to the Silver Acorn", () => {
    expect(
      isValidProgression("Silver Acorn", "Bar to the Silver Acorn"),
    ).toBe(true);
  });

  it("allows Silver Acorn → Silver Wolf", () => {
    expect(isValidProgression("Silver Acorn", "Silver Wolf")).toBe(true);
  });

  it("allows Bar to the Silver Acorn → Silver Wolf", () => {
    expect(
      isValidProgression("Bar to the Silver Acorn", "Silver Wolf"),
    ).toBe(true);
  });

  it("rejects same award → same award", () => {
    expect(isValidProgression("Award for Merit", "Award for Merit")).toBe(
      false,
    );
  });

  it("rejects backwards progression", () => {
    expect(
      isValidProgression(
        "Silver Acorn",
        "Chief Scout's Commendation for Good Service",
      ),
    ).toBe(false);
  });

  it("rejects skipping multiple levels", () => {
    expect(isValidProgression("Award for Merit", "Silver Acorn")).toBe(false);
  });

  it("rejects null → Silver Wolf (skipping all)", () => {
    expect(isValidProgression(null, "Silver Wolf")).toBe(false);
  });
});
