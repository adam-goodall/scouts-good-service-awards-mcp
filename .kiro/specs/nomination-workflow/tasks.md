# Implementation Plan: Nomination Workflow

## Overview

Implement a stateless, step-based `nomination_workflow` MCP tool that guides users through collecting nominee data from the Scouts membership system. The tool uses a pure `resolveNextStep` function to determine the next step based on the current workflow state, reuses the existing `checkEligibility` logic for eligibility assessment, and returns structured JSON responses in the same format as existing tools.

## Tasks

- [x] 1. Define types and interfaces
  - [x] 1.1 Add workflow types to `src/types.ts`
    - Add `WorkflowState`, `LineManagerInput`, `StepId`, `StepResponse`, `ResultResponse`, `ErrorResponse`, `WorkflowResponse`, `EligibilityAssessment`, `NominationSectionStatus`, `NominationSummary` types as defined in the design document
    - _Requirements: 10.1, 10.4, 10.6_

- [x] 2. Implement core step-resolution logic
  - [x] 2.1 Create `src/nomination-workflow.ts` with `resolveNextStep` function
    - Implement the pure function that inspects `WorkflowState` and returns the appropriate `WorkflowResponse`
    - Implement step resolution in the defined order: membership_number → nominee_name → current_roles → historic_roles → current_awards → criminal_record_check → mandatory_learning → eligibility_result → line_managers → line_manager_input → summary
    - Handle whitespace-only strings for `membershipNumber` and `nomineeName` as absent (re-prompt same step)
    - Validate `nomineeName` is 2–100 characters after trimming
    - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.4, 3.1, 4.1, 5.1, 6.1, 7.5, 10.1, 10.6_

  - [x] 2.2 Implement eligibility assessment step
    - Derive `EligibilityInput` from workflow state using `deriveEligibilityInput` helper
    - Call existing `checkEligibility` from `eligibility.ts`
    - Map result to `EligibilityAssessment` with `eligible`, `hasValidAppointment`, `totalServiceYears`, `highestCurrentAward`, `nextAwardInProgression`, and `unmetCriteria`
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 2.3 Implement line manager steps
    - When eligible and `lineManagers` is absent or `confirmed` is false, return `line_managers` step prompting user to confirm they've spoken with all line managers
    - When `confirmed` is true but `input` is missing/empty, return `line_manager_input` step prompting for quotes, observations, and examples
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 2.4 Implement summary step
    - When all data is collected (eligible nominee with line manager input), return summary with 7 nomination form sections classified as `"populatable"` or `"requires_input"`
    - Include `availableTools` array referencing `get_nomination_guidance`, `get_sample_citations`, and `get_writing_tips` with their purposes
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 2.5 Implement error handling
    - Wrap `resolveNextStep` logic to catch unexpected errors and return `ErrorResponse`
    - Return error response for unrecognised step states or invalid field combinations that pass Zod but are semantically invalid
    - _Requirements: 1.4, 10.5_

- [x] 3. Register tool on MCP server
  - [x] 3.1 Register `nomination_workflow` tool in `src/index.ts`
    - Add Zod schema for the `state` parameter matching the design's tool registration
    - Wire handler to call `resolveNextStep` and wrap result in `content` array with `text` type
    - Wrap handler in try-catch to return error response for unexpected exceptions
    - _Requirements: 10.2, 10.3, 10.4_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Unit tests
  - [x] 5.1 Write unit tests in `src/nomination-workflow.test.ts`
    - Test empty state returns `membership_number` step
    - Test each step transition with minimal valid state
    - Test response content includes expected prompts and navigation instructions
    - Test whitespace-only values do not advance the step
    - Test `nomineeName` length validation (2–100 chars)
    - Test eligibility assessment returns correct shape for eligible and ineligible nominees
    - Test line manager confirmation blocking
    - Test summary includes all 7 sections and 3 tool references
    - Test error response for invalid state
    - _Requirements: 1.1, 1.3, 1.4, 2.1, 2.2, 2.4, 3.1, 4.1, 5.1, 6.1, 7.1, 7.2, 7.3, 7.4, 8.2, 8.3, 9.1, 9.4, 10.5_

  - [x] 5.2 Write property test: step resolution follows defined field order
    - **Property 1: Step resolution follows defined field order**
    - **Validates: Requirements 1.1, 2.1, 2.2, 3.1, 4.1, 5.1, 6.1, 7.5**

  - [x] 5.3 Write property test: step responses contain all required fields
    - **Property 2: Step responses contain all required fields**
    - **Validates: Requirements 1.3, 10.6**

  - [x] 5.4 Write property test: invalid state produces error response
    - **Property 3: Invalid state produces error response**
    - **Validates: Requirements 1.4, 10.5**

  - [x] 5.5 Write property test: whitespace-only values do not advance the step
    - **Property 4: Whitespace-only values do not advance the step**
    - **Validates: Requirements 2.4**

  - [x] 5.6 Write property test: complete eligibility state produces assessment with all required fields
    - **Property 5: Complete eligibility state produces assessment with all required fields**
    - **Validates: Requirements 7.1, 7.2**

  - [x] 5.7 Write property test: ineligible nominees get unmet criteria reported
    - **Property 6: Ineligible nominees get unmet criteria reported**
    - **Validates: Requirements 7.3**

  - [x] 5.8 Write property test: eligible nominees get positive result with next award identified
    - **Property 7: Eligible nominees get positive result with next award identified**
    - **Validates: Requirements 7.4**

  - [x] 5.9 Write property test: unconfirmed line managers block advancement
    - **Property 8: Unconfirmed line managers block advancement**
    - **Validates: Requirements 8.2**

  - [x] 5.10 Write property test: confirmed line managers without input prompts for input
    - **Property 9: Confirmed line managers without input prompts for input**
    - **Validates: Requirements 8.3**

  - [x] 5.11 Write property test: fully-populated state produces summary with correct section classification
    - **Property 10: Fully-populated state produces summary with correct section classification**
    - **Validates: Requirements 9.1, 9.2, 9.3**

  - [x] 5.12 Write property test: resolveNextStep is deterministic
    - **Property 11: resolveNextStep is deterministic**
    - **Validates: Requirements 10.1**

- [x] 6. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document using `fast-check`
- Unit tests validate specific examples and edge cases
- The implementation reuses the existing `checkEligibility` function from `eligibility.ts`
- All property tests go in `src/nomination-workflow.property.test.ts`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.5"] },
    { "id": 3, "tasks": ["2.4"] },
    { "id": 4, "tasks": ["3.1"] },
    { "id": 5, "tasks": ["5.1"] },
    { "id": 6, "tasks": ["5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8", "5.9", "5.10", "5.11", "5.12"] }
  ]
}
```
