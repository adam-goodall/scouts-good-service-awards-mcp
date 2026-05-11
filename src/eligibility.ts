import type {
  AwardName,
  EligibilityInput,
  EligibilityResult,
  UnmetCriterion,
} from "./types.js";
import { AWARD_HIERARCHY, getAwardByName, isValidProgression } from "./awards.js";

/**
 * Checks general eligibility criteria that apply to all awards:
 * - Must be a member
 * - Must be appointed
 * - Must have completed mandatory learning
 * - Must have a valid criminal record check
 */
export function checkGeneralCriteria(input: EligibilityInput): UnmetCriterion[] {
  const unmet: UnmetCriterion[] = [];

  if (!input.isMember) {
    unmet.push({
      criterion: "Membership",
      reason: "Nominee must be a current member of Scouts",
    });
  }

  if (!input.isAppointed) {
    unmet.push({
      criterion: "Appointment",
      reason: "Nominee must hold a current appointment",
    });
  }

  if (!input.mandatoryLearningComplete) {
    unmet.push({
      criterion: "Mandatory Learning",
      reason: "Nominee must have completed mandatory learning",
    });
  }

  if (!input.criminalRecordCheckValid) {
    unmet.push({
      criterion: "Criminal Record Check",
      reason: "Nominee must have a valid criminal record check",
    });
  }

  return unmet;
}

/**
 * Checks award-specific eligibility criteria:
 * - Service years meet minimum for target award
 * - Award progression is valid (correct next step)
 * - 5-year gap since last award (if dateOfLastAward provided)
 * - Cannot already hold the target award
 */
export function checkAwardSpecificCriteria(input: EligibilityInput): UnmetCriterion[] {
  const unmet: UnmetCriterion[] = [];

  if (!input.targetAward) {
    return unmet;
  }

  const award = getAwardByName(input.targetAward);

  // Service years check
  if (input.serviceYears < award.minimumServiceYears) {
    unmet.push({
      criterion: "Service Years",
      reason: `Nominee has ${input.serviceYears} years of service but ${award.name} requires a minimum of ${award.minimumServiceYears} years`,
    });
  }

  // Award progression check (includes cannot already hold target award - Req 1.7)
  const previousAward = input.previousAward === "none" ? null : input.previousAward;
  if (!isValidProgression(previousAward, input.targetAward)) {
    if (previousAward === input.targetAward) {
      unmet.push({
        criterion: "Award Progression",
        reason: `Nominee already holds ${input.targetAward}`,
      });
    } else {
      unmet.push({
        criterion: "Award Progression",
        reason: `${input.targetAward} is not a valid progression from ${previousAward ?? "no previous award"}`,
      });
    }
  }

  // 5-year gap check
  if (input.dateOfLastAward) {
    const lastAwardDate = new Date(input.dateOfLastAward);
    const now = new Date();
    const fiveYearsLater = new Date(lastAwardDate);
    fiveYearsLater.setFullYear(fiveYearsLater.getFullYear() + 5);

    if (fiveYearsLater > now) {
      unmet.push({
        criterion: "Five-Year Gap",
        reason: `Nominee received their last award on ${input.dateOfLastAward}; at least 5 years must have passed since the last Good Service Award`,
      });
    }
  }

  return unmet;
}

/**
 * Evaluates all eligibility criteria for a given input.
 * If targetAward is specified, checks against that award.
 * If targetAward is not specified, determines all eligible awards.
 */
export function checkEligibility(input: EligibilityInput): EligibilityResult {
  // Validate serviceYears is a positive integer (Req 6.1)
  if (!Number.isInteger(input.serviceYears) || input.serviceYears <= 0) {
    return {
      eligible: false,
      targetAward: input.targetAward,
      unmetCriteria: [
        {
          criterion: "serviceYears",
          reason: "Service years must be a whole number greater than zero",
        },
      ],
    };
  }

  if (input.targetAward) {
    const generalUnmet = checkGeneralCriteria(input);
    const specificUnmet = checkAwardSpecificCriteria(input);
    const unmetCriteria = [...generalUnmet, ...specificUnmet];

    return {
      eligible: unmetCriteria.length === 0,
      targetAward: input.targetAward,
      unmetCriteria,
    };
  }

  // No target award specified — determine all eligible awards
  const eligibleAwards = getEligibleAwards(input);

  return {
    eligible: eligibleAwards.length > 0,
    eligibleAwards,
    unmetCriteria: [],
  };
}

/**
 * Determines all awards a nominee qualifies for based on their details.
 */
export function getEligibleAwards(
  input: Omit<EligibilityInput, "targetAward">,
): AwardName[] {
  const eligible: AwardName[] = [];

  for (const award of AWARD_HIERARCHY) {
    const inputWithTarget: EligibilityInput = {
      ...input,
      targetAward: award.name,
    };

    const generalUnmet = checkGeneralCriteria(inputWithTarget);
    const specificUnmet = checkAwardSpecificCriteria(inputWithTarget);

    if (generalUnmet.length === 0 && specificUnmet.length === 0) {
      eligible.push(award.name);
    }
  }

  return eligible;
}
