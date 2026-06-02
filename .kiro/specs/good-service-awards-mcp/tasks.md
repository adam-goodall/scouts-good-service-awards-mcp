# Implementation Plan: Good Service Awards MCP Server

## Overview

Build a standalone TypeScript MCP server that exposes four tools (check_eligibility, build_nomination, get_award_info, get_deadlines) over stdio transport. The implementation follows a layered architecture: static data constants → pure domain functions → tool handlers → MCP server entry point. Distributed via npm/npx with no external dependencies beyond the MCP SDK.

## Tasks

- [x] 1. Set up project structure and dependencies
  - [x] 1.1 Initialise TypeScript project with MCP SDK
    - Create package.json with name, bin entry, and dependencies (@modelcontextprotocol/sdk, zod)
    - Create tsconfig.json targeting ES2022 with strict mode
    - Add dev dependencies (vitest, fast-check, typescript)
    - Create src/ directory structure
    - _Requirements: 5.1, 5.2_

  - [x] 1.2 Define shared types and constants (`src/types.ts`)
    - Define AwardName union type, AwardClassification, Award interface
    - Define EligibilityInput, EligibilityResult, UnmetCriterion interfaces
    - Define NominationInput, ValidationResult, FieldError interfaces
    - Define Deadline, ProcessingTimeline interfaces
    - _Requirements: 1.1, 2.1, 3.1, 4.1_

- [x] 2. Implement award data module
  - [x] 2.1 Create static award hierarchy data (`src/awards.ts`)
    - Define AWARD_HIERARCHY constant array with all six awards, their minimum service years, classification, prerequisite, approval authority, gap requirement, and description
    - Implement getAwardByName, getNextAward, isValidProgression functions
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 1.4, 1.5_

  - [x] 2.2 Write property test for award progression validation (Property 4)
    - **Property 4: Award progression validation**
    - For any invalid (previousAward, targetAward) combination, eligibility result includes an unmet criterion
    - **Validates: Requirements 1.5, 1.7**

- [x] 3. Implement eligibility rules engine
  - [x] 3.1 Create eligibility checking functions (`src/eligibility.ts`)
    - Implement checkEligibility: evaluates all criteria for a target award
    - Implement getEligibleAwards: determines all awards a nominee qualifies for
    - Implement checkGeneralCriteria: membership, appointment, learning, CRC checks
    - Implement checkAwardSpecificCriteria: service years, progression, 5-year gap
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [x] 3.2 Write property test for eligibility result consistency (Property 1)
    - **Property 1: Eligibility result consistency**
    - For any valid EligibilityInput with a target award, eligible === (unmetCriteria.length === 0)
    - **Validates: Requirements 1.1, 1.2**

  - [x] 3.3 Write property test for eligible awards list completeness (Property 2)
    - **Property 2: Eligible awards list completeness**
    - For any valid input without target, each award in eligibleAwards returns eligible:true when checked individually
    - **Validates: Requirements 1.3**

  - [x] 3.4 Write property test for service years threshold (Property 3)
    - **Property 3: Service years threshold**
    - For any serviceYears below the minimum for a target award, unmetCriteria includes insufficient service years
    - **Validates: Requirements 1.4**

  - [x] 3.5 Write property test for five-year gap rule (Property 5)
    - **Property 5: Five-year gap rule**
    - For any dateOfLastAward less than 5 years before evaluation, result is ineligible with gap criterion
    - **Validates: Requirements 1.6**

  - [x] 3.6 Write property test for invalid service years validation (Property 10)
    - **Property 10: Invalid service years validation**
    - For any non-positive-integer serviceYears, a validation error is returned
    - **Validates: Requirements 6.1**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement nomination form module
  - [x] 5.1 Create nomination validation and formatting (`src/nomination.ts`)
    - Implement validateNominationForm: checks all fields non-empty, citation ≤ 300 chars
    - Implement formatNominationForm: produces structured text output containing all field values
    - Include eligibility reminder in output when appropriate
    - _Requirements: 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 6.3, 6.5_

  - [x] 5.2 Write property test for nomination form output completeness (Property 6)
    - **Property 6: Nomination form output contains all inputs**
    - For any valid NominationInput, the formatted output contains every field value
    - **Validates: Requirements 2.3**

  - [x] 5.3 Write property test for citation length boundary (Property 7)
    - **Property 7: Citation length boundary**
    - Strings > 300 chars are rejected; strings 1–300 chars are accepted
    - **Validates: Requirements 2.4**

  - [x] 5.4 Write property test for whitespace-only field rejection (Property 8)
    - **Property 8: Whitespace-only field rejection**
    - For any required field with whitespace-only input, validation rejects with field-specific error
    - **Validates: Requirements 2.7, 6.5**

- [x] 6. Implement deadlines module
  - [x] 6.1 Create deadline calculation functions (`src/deadlines.ts`)
    - Implement getNextDeadline: returns the next quarterly deadline on or after a given date
    - Implement getAllDeadlines: returns all four quarterly deadlines
    - Implement getProcessingTimeline: returns dispatch, letters, and Compass upload dates
    - Include draft expiry warning information
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 6.2 Write property test for next deadline correctness (Property 9)
    - **Property 9: Next deadline correctness**
    - For any date, the returned next deadline is a valid quarterly deadline on or after that date with no other deadline between
    - **Validates: Requirements 4.2**

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Wire up MCP server and tool handlers
  - [x] 8.1 Create MCP server entry point (`src/index.ts`)
    - Create McpServer instance with server name and version
    - Register check_eligibility tool with Zod input schema, calling eligibility domain functions
    - Register build_nomination tool with Zod input schema, calling nomination domain functions
    - Register get_award_info tool with Zod input schema, calling awards domain functions
    - Register get_deadlines tool with Zod input schema, calling deadlines domain functions
    - Connect via StdioServerTransport
    - Add shebang line for npx execution
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.4_

  - [x] 8.2 Configure package.json bin entry and build script
    - Set bin field pointing to compiled entry point
    - Add build script (tsc)
    - Add start script for local testing
    - Ensure package is runnable via npx
    - _Requirements: 5.1_

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The design uses TypeScript throughout — all implementation uses TypeScript
- All award data is static (no network calls, no API keys)
- The MCP SDK handles schema-level validation via Zod automatically; domain-level validation is in tool handlers

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["2.1", "6.1"] },
    { "id": 3, "tasks": ["3.1", "5.1", "2.2", "6.2"] },
    { "id": 4, "tasks": ["3.2", "3.3", "3.4", "3.5", "3.6", "5.2", "5.3", "5.4"] },
    { "id": 5, "tasks": ["8.1"] },
    { "id": 6, "tasks": ["8.2"] }
  ]
}
```
