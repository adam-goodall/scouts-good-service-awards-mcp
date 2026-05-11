export type AwardName =
  | "Chief Scout's Commendation for Good Service"
  | "Award for Merit"
  | "Bar to the Award for Merit"
  | "Silver Acorn"
  | "Bar to the Silver Acorn"
  | "Silver Wolf";

export type AwardClassification = "lower" | "higher";

export interface Award {
  name: AwardName;
  minimumServiceYears: number;
  classification: AwardClassification;
  prerequisite: AwardName | null;
  approvalAuthority: string;
  fiveYearGapRequired: boolean;
  description: string;
}

export interface EligibilityInput {
  serviceYears: number;
  isMember: boolean;
  isAppointed: boolean;
  mandatoryLearningComplete: boolean;
  criminalRecordCheckValid: boolean;
  previousAward: AwardName | "none";
  dateOfLastAward?: string; // ISO date
  targetAward?: AwardName;
}

export interface EligibilityResult {
  eligible: boolean;
  targetAward?: AwardName;
  eligibleAwards?: AwardName[];
  unmetCriteria: UnmetCriterion[];
}

export interface UnmetCriterion {
  criterion: string;
  reason: string;
}

export type NominationStyle = "narrative" | "structured";

export interface NominationInput {
  mainRole: string;
  additionalService: string;
  keyAchievements: string;
  achievementsPeriod: "since_last_award" | "entire_service";
  levelOfService: string;
  serviceLevelChange: "similar" | "substantially_increased";
  communityInvolvement: string;
  otherInformation: string;
  citation: string;
  extendedCitation?: string;
  narrativeContext?: string;
  style?: NominationStyle;
}

export interface ValidationResult {
  valid: boolean;
  errors: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}

export interface Deadline {
  date: string; // ISO date
  quarter: 1 | 2 | 3 | 4;
  label: string;
}

export interface ProcessingTimeline {
  awardsDispatched: string;
  congratulatoryLetters: string;
  compassUpload: string;
}

// --- Nomination Guidance Types ---

export interface NominationSection {
  title: string;
  fieldName: keyof NominationInput;
  description: string;
  tips: string[];
  constraints?: string;
}

export interface EligibilityWorkflow {
  description: string;
  steps: EligibilityWorkflowStep[];
}

export interface EligibilityWorkflowStep {
  step: number;
  instruction: string;
  details?: string;
}

export interface AwardSpecificGuidance {
  awardName: AwardName;
  evidenceRequired: string;
  typicalProfile: string;
  tips: string[];
}

export interface NominationGuidance {
  sections: NominationSection[];
  eligibilityWorkflow: EligibilityWorkflow;
  awardSpecificGuidance?: AwardSpecificGuidance;
}

// --- Sample Citations Types ---

export interface SampleNomination {
  nomineeName: string;
  awardLevel: AwardName;
  mainRole: string;
  additionalService: string;
  keyAchievements: string;
  levelOfService: string;
  communityInvolvement: string;
  otherInformation: string;
  citation: string;
}

export interface SampleCitationsResponse {
  samples: SampleNomination[];
  awardLevel: AwardName | "all";
  note?: string;
}

// --- Writing Tips Types ---

export interface WritingTips {
  generalTips: string[];
  narrativeStructure: string[];
  commonMistakes: string[];
  testimonialGuidance: string[];
  awardSpecificTips?: string[];
}

// --- Nomination Workflow Types ---

export interface WorkflowState {
  membershipNumber?: string;
  nomineeName?: string;
  currentRoles?: {
    hasNonProvisionalRole: boolean;
    totalRoles: number;
  };
  historicRoles?: {
    earliestStartDate: string; // ISO date
    totalServiceYears: number;
  };
  currentAwards?: {
    highestAward: AwardName | "none";
  };
  criminalRecordCheck?: boolean;
  mandatoryLearning?: boolean;
  personalStory?: {
    motivation: string;
    characterTraits?: string;
    definingMoments?: string;
  };
  lineManagers?: {
    confirmed: boolean;
    input?: LineManagerInput[];
  };
}

export interface LineManagerInput {
  name: string;
  quote: string;
  observation: string;
  example: string;
}

export type StepId =
  | "membership_number"
  | "nominee_name"
  | "current_roles"
  | "historic_roles"
  | "current_awards"
  | "criminal_record_check"
  | "mandatory_learning"
  | "eligibility_result"
  | "personal_story"
  | "line_managers"
  | "line_manager_input"
  | "summary";

export type WorkflowResponse = StepResponse | ResultResponse | ErrorResponse;

export interface StepResponse {
  step: StepId;
  prompt: string;
  instructions?: string;
  field: string;
  nextStep: StepId;
}

export interface EligibilityAssessment {
  eligible: boolean;
  hasValidAppointment: boolean;
  totalServiceYears: number;
  highestCurrentAward: AwardName | "none";
  nextAwardInProgression: AwardName | null;
  unmetCriteria?: UnmetCriterion[];
}

export interface ResultResponse {
  step: "eligibility_result" | "summary";
  assessment?: EligibilityAssessment;
  summary?: NominationSummary;
}

export interface NominationSectionStatus {
  section: string;
  status: "populatable" | "requires_input";
  description: string;
}

export interface PersonalStory {
  motivation: string;
  characterTraits?: string;
  definingMoments?: string;
}

export interface NarrativeGuidance {
  personalStory: PersonalStory | null;
  writingApproach: string;
  structuralGuidance: string[];
}

export interface NominationSummary {
  sections: NominationSectionStatus[];
  narrativeGuidance?: NarrativeGuidance;
  availableTools: Array<{ name: string; purpose: string }>;
}

export interface ErrorResponse {
  error: true;
  message: string;
  invalidFields?: string[];
}
