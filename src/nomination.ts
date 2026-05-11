import type { NominationInput, ValidationResult, FieldError } from "./types.js";

const REQUIRED_STRING_FIELDS = [
  "mainRole",
  "additionalService",
  "keyAchievements",
  "levelOfService",
  "communityInvolvement",
  "otherInformation",
  "citation",
] as const;

const FIELD_LABELS: Record<string, string> = {
  mainRole: "Main role description",
  additionalService: "Additional service",
  keyAchievements: "Key achievements",
  levelOfService: "Level of service",
  communityInvolvement: "Community involvement",
  otherInformation: "Other relevant information",
  citation: "Citation",
};

const MAX_CITATION_LENGTH = 300;

export function validateNominationForm(input: NominationInput): ValidationResult {
  const errors: FieldError[] = [];

  for (const field of REQUIRED_STRING_FIELDS) {
    if (!input[field] || input[field].trim().length === 0) {
      errors.push({
        field,
        message: `${FIELD_LABELS[field]} is required and must not be empty`,
      });
    }
  }

  if (input.citation && input.citation.trim().length > 0 && input.citation.length > MAX_CITATION_LENGTH) {
    errors.push({
      field: "citation",
      message: `Citation must be no more than ${MAX_CITATION_LENGTH} characters (currently ${input.citation.length})`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function formatNominationForm(input: NominationInput): string {
  const achievementsPeriodText =
    input.achievementsPeriod === "since_last_award"
      ? "period since last award"
      : "entire service";

  const serviceLevelChangeText =
    input.serviceLevelChange === "similar"
      ? "continued at a similar level"
      : "substantially increased";

  const styleText = input.style === "structured" ? "structured" : "narrative";

  const sections = [
    "=== Good Service Award Nomination Form ===",
    `Style: ${styleText}`,
    "",
  ];

  if (input.narrativeContext) {
    sections.push(`Narrative Context: ${input.narrativeContext}`);
    sections.push("");
  }

  sections.push(
    `Main Role: ${input.mainRole}`,
    "",
    `Additional Service: ${input.additionalService}`,
    "",
    `Key Achievements: ${input.keyAchievements}`,
    `Achievements relate to: ${achievementsPeriodText}`,
    "",
    `Level of Service: ${input.levelOfService}`,
    `Level of service has: ${serviceLevelChangeText}`,
    "",
    `Community Involvement: ${input.communityInvolvement}`,
    "",
    `Other Information: ${input.otherInformation}`,
    "",
    `Citation (max 300 chars): ${input.citation}`,
  );

  if (input.extendedCitation) {
    sections.push("");
    sections.push(`Extended Citation: ${input.extendedCitation}`);
  }

  sections.push(
    "",
    "---",
    "Reminder: Please verify the nominee's eligibility before submitting this nomination.",
  );

  return sections.join("\n");
}
