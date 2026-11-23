import type { Award, AwardName } from "./types.js";

/** When the embedded award rules were last checked against official Scouts guidance. */
export const AWARD_DATA_LAST_REVIEWED = "2026-11-23";

/** Official sources the embedded award rules are based on. */
export const AWARD_DATA_SOURCES = [
  "https://www.scouts.org.uk/volunteers/learning-development-and-awards/awards-and-recognition/good-service-awards/",
  "https://www.scouts.org.uk/volunteers/learning-development-and-awards/awards-and-recognition/awards-process/",
  "https://cms.scouts.org.uk/media/18084/quick-reference-awards-guide-gs.pdf",
];

export const AWARD_HIERARCHY: Award[] = [
  {
    name: "Chief Scout's Commendation for Good Service",
    minimumServiceYears: 5,
    classification: "lower",
    prerequisite: null,
    approvalAuthority: "District Commissioner and above",
    fiveYearGapRequired: true,
    description:
      "Recognises at least 5 years of outstanding service to Scouting.",
  },
  {
    name: "Award for Merit",
    minimumServiceYears: 10,
    classification: "lower",
    prerequisite: null,
    approvalAuthority: "District Commissioner and above",
    fiveYearGapRequired: true,
    description:
      "Recognises at least 10 years of outstanding service to Scouting.",
  },
  {
    name: "Bar to the Award for Merit",
    minimumServiceYears: null,
    classification: "lower",
    prerequisite: "Award for Merit",
    approvalAuthority: "County Commissioner and above",
    fiveYearGapRequired: true,
    description:
      "Recognises continued outstanding service, at least 5 years after receiving the Award for Merit.",
  },
  {
    name: "Silver Acorn",
    minimumServiceYears: 20,
    classification: "lower",
    prerequisite: null,
    approvalAuthority: "County Commissioner and above",
    fiveYearGapRequired: true,
    description:
      "Recognises at least 20 years of specially distinguished service.",
  },
  {
    name: "Bar to the Silver Acorn",
    minimumServiceYears: null,
    classification: "higher",
    prerequisite: "Silver Acorn",
    approvalAuthority: "National Awards Advisory Group",
    fiveYearGapRequired: true,
    description:
      "Recognises continued specially distinguished service, at least 5 years after receiving the Silver Acorn.",
  },
  {
    name: "Silver Wolf",
    minimumServiceYears: 30,
    classification: "higher",
    prerequisite: null,
    approvalAuthority: "National Awards Advisory Group",
    fiveYearGapRequired: true,
    description:
      "The Chief Scout's unrestricted gift, rarely awarded for less than 30 years of service. No previous award is needed.",
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
 * Whether `to` can be the next Good Service Award for someone whose most
 * recent Good Service Award is `from` (null = none).
 *
 * - The same award can never be received twice.
 * - Awards cannot go backwards in the hierarchy.
 * - The Bars need the award they are a bar to as the most recent award:
 *   Bar to the Award for Merit needs Award for Merit, Bar to the Silver Acorn
 *   needs Silver Acorn.
 * - Every other award needs no previous award, so it can follow any lower one
 *   (or none). Service years and the five-year gap are checked separately.
 */
export function isValidProgression(
  from: AwardName | null,
  to: AwardName,
): boolean {
  if (from === to) {
    return false;
  }

  const target = getAwardByName(to);
  if (target.name.startsWith("Bar to")) {
    return from === target.prerequisite;
  }

  if (from === null) {
    return true;
  }

  const fromIndex = AWARD_HIERARCHY.findIndex((a) => a.name === from);
  if (fromIndex === -1) {
    throw new Error(`Unknown award: ${from}`);
  }
  const toIndex = AWARD_HIERARCHY.findIndex((a) => a.name === to);
  return toIndex > fromIndex;
}
