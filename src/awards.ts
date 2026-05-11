import type { Award, AwardName } from "./types.js";

export const AWARD_HIERARCHY: Award[] = [
  {
    name: "Chief Scout's Commendation for Good Service",
    minimumServiceYears: 5,
    classification: "lower",
    prerequisite: null,
    approvalAuthority: "Local (District/County/Area)",
    fiveYearGapRequired: true,
    description:
      "Recognises at least 5 years of outstanding service to Scouting.",
  },
  {
    name: "Award for Merit",
    minimumServiceYears: 10,
    classification: "lower",
    prerequisite: null,
    approvalAuthority: "Local (District/County/Area)",
    fiveYearGapRequired: true,
    description:
      "Recognises at least 10 years of outstanding service to Scouting.",
  },
  {
    name: "Bar to the Award for Merit",
    minimumServiceYears: 15,
    classification: "lower",
    prerequisite: "Award for Merit",
    approvalAuthority: "Local (District/County/Area)",
    fiveYearGapRequired: true,
    description:
      "Recognises continued outstanding service beyond the Award for Merit.",
  },
  {
    name: "Silver Acorn",
    minimumServiceYears: 20,
    classification: "lower",
    prerequisite: "Bar to the Award for Merit",
    approvalAuthority: "Local (District/County/Area)",
    fiveYearGapRequired: true,
    description:
      "Recognises at least 20 years of specially distinguished service.",
  },
  {
    name: "Bar to the Silver Acorn",
    minimumServiceYears: 25,
    classification: "higher",
    prerequisite: "Silver Acorn",
    approvalAuthority: "National Awards Advisory Group",
    fiveYearGapRequired: true,
    description:
      "Recognises continued specially distinguished service beyond the Silver Acorn.",
  },
  {
    name: "Silver Wolf",
    minimumServiceYears: 30,
    classification: "higher",
    prerequisite: "Silver Acorn",
    approvalAuthority: "National Awards Advisory Group",
    fiveYearGapRequired: true,
    description:
      "The Chief Scout's unrestricted gift, rarely awarded for less than 30 years of service. Normally requires the nominee to hold Silver Acorn.",
  },
];

export function getAwardByName(name: AwardName): Award {
  const award = AWARD_HIERARCHY.find((a) => a.name === name);
  if (!award) {
    throw new Error(`Unknown award: ${name}`);
  }
  return award;
}

export function getNextAward(currentAward: AwardName): AwardName | null {
  const index = AWARD_HIERARCHY.findIndex((a) => a.name === currentAward);
  if (index === -1) {
    throw new Error(`Unknown award: ${currentAward}`);
  }
  if (index >= AWARD_HIERARCHY.length - 1) {
    return null;
  }
  return AWARD_HIERARCHY[index + 1].name;
}

/**
 * Valid progressions:
 * - null → Chief Scout's Commendation: valid (first award)
 * - null → Award for Merit: valid (first award, can skip Commendation)
 * - Chief Scout's Commendation → Award for Merit: valid
 * - Award for Merit → Bar to the Award for Merit: valid
 * - Bar to the Award for Merit → Silver Acorn: valid
 * - Silver Acorn → Bar to the Silver Acorn: valid
 * - Silver Acorn → Silver Wolf: valid (normally requires Silver Acorn)
 * - Bar to the Silver Acorn → Silver Wolf: valid
 * - Same award → same award: INVALID
 * - Skipping backwards or multiple levels: INVALID
 */
export function isValidProgression(
  from: AwardName | null,
  to: AwardName,
): boolean {
  // Cannot progress to the same award (Requirement 1.7)
  if (from === to) {
    return false;
  }

  // Starting from no previous award
  if (from === null) {
    return (
      to === "Chief Scout's Commendation for Good Service" ||
      to === "Award for Merit"
    );
  }

  // Define valid transitions from each award
  const validTransitions: Record<AwardName, AwardName[]> = {
    "Chief Scout's Commendation for Good Service": ["Award for Merit"],
    "Award for Merit": ["Bar to the Award for Merit"],
    "Bar to the Award for Merit": ["Silver Acorn"],
    "Silver Acorn": ["Bar to the Silver Acorn", "Silver Wolf"],
    "Bar to the Silver Acorn": ["Silver Wolf"],
    "Silver Wolf": [],
  };

  return validTransitions[from].includes(to);
}
