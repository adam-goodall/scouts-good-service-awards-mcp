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
