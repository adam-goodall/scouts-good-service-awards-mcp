import type {
  WorkflowState,
  WorkflowResponse,
  StepResponse,
  ResultResponse,
  ErrorResponse,
  EligibilityInput,
  EligibilityAssessment,
  AwardName,
} from "./types.js";
import { checkEligibility } from "./eligibility.js";

const VALID_AWARD_VALUES: ReadonlyArray<AwardName | "none"> = [
  "Chief Scout's Commendation for Good Service",
  "Award for Merit",
  "Bar to the Award for Merit",
  "Silver Acorn",
  "Bar to the Silver Acorn",
  "Silver Wolf",
  "none",
];

/**
 * Pure function that inspects the current workflow state and returns
 * the appropriate next step response. Evaluates fields in a fixed order
 * and returns the first step whose data is missing or invalid.
 *
 * Wrapped in try-catch to ensure no unhandled exceptions escape —
 * unexpected errors are returned as ErrorResponse.
 */
export function resolveNextStep(state: WorkflowState): WorkflowResponse {
  try {
    // Semantic validation for fields that pass Zod but are logically invalid
    const semanticError = validateSemantics(state);
    if (semanticError) {
      return semanticError;
    }

    // Step 1: membership_number
    if (!hasValue(state.membershipNumber)) {
      return membershipNumberStep();
    }

    // Step 2: nominee_name
    if (!hasValidName(state.nomineeName)) {
      return nomineeNameStep();
    }

    // Step 3: current_roles
    if (state.currentRoles === undefined) {
      return currentRolesStep();
    }

    // Step 4: historic_roles
    if (state.historicRoles === undefined) {
      return historicRolesStep();
    }

    // Step 5: current_awards
    if (state.currentAwards === undefined) {
      return currentAwardsStep();
    }

    // Step 6: criminal_record_check
    if (state.criminalRecordCheck === undefined) {
      return criminalRecordCheckStep();
    }

    // Step 7: mandatory_learning
    if (state.mandatoryLearning === undefined) {
      return mandatoryLearningStep();
    }

    // Step 8: eligibility_result
    if (!state.lineManagers) {
      return computeEligibilityResult(state);
    }

    // Step 9: line_managers
    if (!state.lineManagers.confirmed) {
      return lineManagersStep();
    }

    // Step 10: line_manager_input
    if (!state.lineManagers.input || state.lineManagers.input.length === 0) {
      return lineManagerInputStep();
    }

    // Step 11: summary
    return buildSummary(state);
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error
        ? error.message
        : "Unexpected error during workflow step resolution",
    };
  }
}

// --- Validation helpers ---

function hasValue(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0;
}

function hasValidName(value: string | undefined): boolean {
  if (value === undefined) return false;
  const trimmed = value.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
}

// --- Semantic validation ---

/**
 * Checks for field combinations that pass Zod schema validation but are
 * semantically invalid. Returns an ErrorResponse if issues are found,
 * or null if the state is semantically valid.
 */
function validateSemantics(state: WorkflowState): ErrorResponse | null {
  const invalidFields: string[] = [];

  if (state.currentRoles !== undefined && state.currentRoles.totalRoles < 0) {
    invalidFields.push("currentRoles.totalRoles");
  }

  if (state.historicRoles !== undefined && state.historicRoles.totalServiceYears < 0) {
    invalidFields.push("historicRoles.totalServiceYears");
  }

  if (
    state.currentAwards !== undefined &&
    !VALID_AWARD_VALUES.includes(state.currentAwards.highestAward)
  ) {
    invalidFields.push("currentAwards.highestAward");
  }

  if (invalidFields.length > 0) {
    return {
      error: true,
      message: `Invalid field values: ${invalidFields.join(", ")}`,
      invalidFields,
    };
  }

  return null;
}

// --- Step response builders ---

function membershipNumberStep(): StepResponse {
  return {
    step: "membership_number",
    prompt: "What is the nominee's membership number? You can find this on their member record in the membership system.",
    field: "membershipNumber",
    nextStep: "nominee_name",
  };
}

function nomineeNameStep(): StepResponse {
  return {
    step: "nominee_name",
    prompt: "What is the nominee's full name (given name and surname)?",
    instructions: "Please provide the name as it appears on their membership record. The name must be between 2 and 100 characters.",
    field: "nomineeName",
    nextStep: "current_roles",
  };
}

function currentRolesStep(): StepResponse {
  return {
    step: "current_roles",
    prompt: "Please navigate to the nominee's current roles in the membership system and take a screenshot.",
    instructions: "Navigate to: Member record → Roles tab → Current roles. The nominee must hold at least one role with a status of \"Full\" (not \"Provisional\" or \"Provisional + System\") to be considered as holding a valid appointment.",
    field: "currentRoles",
    nextStep: "historic_roles",
  };
}

function historicRolesStep(): StepResponse {
  return {
    step: "historic_roles",
    prompt: "Please navigate to the nominee's historic roles page and take a screenshot.",
    instructions: "Navigate to: Member record → Roles tab → Historic roles. This is used to calculate total qualifying adult service years. The screenshot should show role titles and start/end dates.",
    field: "historicRoles",
    nextStep: "current_awards",
  };
}

function currentAwardsStep(): StepResponse {
  return {
    step: "current_awards",
    prompt: "Please navigate to the nominee's awards page in the membership system and take a screenshot.",
    instructions: "Navigate to: Member record → Awards tab. This shows previously received Good Service Awards, which determines the next eligible award in the hierarchy. If the nominee has no previous awards, they would be considered for the first award in the hierarchy.",
    field: "currentAwards",
    nextStep: "criminal_record_check",
  };
}

function criminalRecordCheckStep(): StepResponse {
  return {
    step: "criminal_record_check",
    prompt: "Does the nominee have a current criminal records disclosure check?",
    instructions: "A valid disclosure check is required for eligibility. The nominee must hold a current check at the time of nomination. Please confirm yes or no.",
    field: "criminalRecordCheck",
    nextStep: "mandatory_learning",
  };
}

function mandatoryLearningStep(): StepResponse {
  return {
    step: "mandatory_learning",
    prompt: "Has the nominee completed their mandatory learning?",
    instructions: "Mandatory learning completion is required for eligibility. Please confirm yes or no.",
    field: "mandatoryLearning",
    nextStep: "eligibility_result",
  };
}

// --- Eligibility assessment ---

function deriveEligibilityInput(state: WorkflowState): EligibilityInput {
  return {
    serviceYears: state.historicRoles!.totalServiceYears,
    isMember: true, // Assumed — they're in the membership system
    isAppointed: state.currentRoles!.hasNonProvisionalRole,
    mandatoryLearningComplete: state.mandatoryLearning!,
    criminalRecordCheckValid: state.criminalRecordCheck!,
    previousAward: state.currentAwards!.highestAward,
  };
}

function computeEligibilityResult(state: WorkflowState): ResultResponse {
  const input = deriveEligibilityInput(state);
  const result = checkEligibility(input);

  const assessment: EligibilityAssessment = {
    eligible: result.eligible,
    hasValidAppointment: state.currentRoles!.hasNonProvisionalRole,
    totalServiceYears: state.historicRoles!.totalServiceYears,
    highestCurrentAward: state.currentAwards!.highestAward,
    nextAwardInProgression: result.targetAward ?? result.eligibleAwards?.[0] ?? null,
  };

  if (result.unmetCriteria.length > 0) {
    assessment.unmetCriteria = result.unmetCriteria;
  }

  return {
    step: "eligibility_result",
    assessment,
  };
}

function lineManagersStep(): StepResponse {
  return {
    step: "line_managers",
    prompt: "Based on the nominee's current roles, please confirm that you have spoken with all of the nominee's line managers about this nomination.",
    instructions: "You must speak with all line managers before proceeding. Line manager input is used to build the narrative for the nomination citation. If you have not yet spoken with all line managers, please do so before continuing.",
    field: "lineManagers",
    nextStep: "line_manager_input",
  };
}

function lineManagerInputStep(): StepResponse {
  return {
    step: "line_manager_input",
    prompt: "Please provide input from each of the nominee's line managers.",
    instructions: "For each line manager, provide: their name, at least one direct quote about the nominee, one observation about the nominee's contribution, and one specific example of the nominee's service.",
    field: "lineManagers",
    nextStep: "summary",
  };
}

function buildSummary(state: WorkflowState): ResultResponse {
  return {
    step: "summary",
    summary: {
      sections: [
        {
          section: "Main Role",
          status: state.currentRoles ? "populatable" : "requires_input",
          description: state.currentRoles
            ? "Can be populated from the nominee's current roles data"
            : "Describe the nominee's main role and responsibilities",
        },
        {
          section: "Additional Service",
          status: "requires_input",
          description: "Describe the nominee's service beyond their main role, including any additional roles or responsibilities",
        },
        {
          section: "Key Achievements",
          status: state.lineManagers?.input?.length ? "populatable" : "requires_input",
          description: state.lineManagers?.input?.length
            ? "Can be populated from line manager quotes, observations, and examples"
            : "Provide key achievements and examples of the nominee's service",
        },
        {
          section: "Level of Service",
          status: "requires_input",
          description: "Describe the level and scope of the nominee's service (local, district, county, regional, national)",
        },
        {
          section: "Community Involvement",
          status: "requires_input",
          description: "Provide examples of the nominee's involvement in the wider community beyond Scouting",
        },
        {
          section: "Other Information",
          status: "requires_input",
          description: "Provide any additional context or information relevant to the nomination",
        },
        {
          section: "Citation",
          status: "requires_input",
          description: "Write a concise citation of up to 300 characters summarising the nominee's service",
        },
      ],
      availableTools: [
        { name: "get_nomination_guidance", purpose: "Get the nomination form structure, field guidance, and eligibility workflow instructions for writing a Good Service Award nomination" },
        { name: "get_sample_citations", purpose: "Get complete example nominations for a given award level to use as style and tone reference when writing nominations" },
        { name: "get_writing_tips", purpose: "Get citation masterclass guidance and best practices for writing effective Good Service Award nominations" },
      ],
    },
  };
}
