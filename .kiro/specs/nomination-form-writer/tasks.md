# Implementation Plan: Nomination Form Writer Knowledge Tools

## Overview

Add three knowledge-provider tools (`get_nomination_guidance`, `get_sample_citations`, `get_writing_tips`) to the existing Scouts Good Service Awards MCP server. Each tool returns static embedded reference data to help an LLM client write nomination forms. Implementation adds new types, three data modules, and registers the tools in the existing server entry point.

## Tasks

- [x] 1. Add new types to src/types.ts
  - [x] 1.1 Add nomination guidance, sample citations, and writing tips interfaces to src/types.ts
    - Add `NominationSection`, `EligibilityWorkflow`, `EligibilityWorkflowStep`, `AwardSpecificGuidance`, `NominationGuidance`, `SampleNomination`, `SampleCitationsResponse`, and `WritingTips` interfaces
    - These are appended to the existing types file, not replacing anything
    - _Requirements: 1.1, 1.2, 2.1, 2.5, 3.1_

- [x] 2. Implement nomination guidance module
  - [x] 2.1 Create src/nomination-guidance.ts with static data and accessor function
    - Define `NOMINATION_SECTIONS` array with all 7 sections (Main Role, Additional Service, Key Achievements, Level of Service, Community Involvement, Other Information, Citation) — each with title, fieldName, description, tips, and constraints where applicable
    - Citation section must include the 300-character constraint
    - Define `ELIGIBILITY_WORKFLOW` with steps for extracting data from screenshots, calling check_eligibility, reporting results, and fallback for ineligible nominees
    - Define `AWARD_SPECIFIC_GUIDANCE` record keyed by AwardName with evidenceRequired, typicalProfile, and tips for each award
    - Export `getNominationGuidance(awardName?: AwardName): NominationGuidance` function
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.2, 5.3, 5.4_

  - [x] 2.2 Write property test for section completeness (Property 1)
    - **Property 1: Section completeness**
    - For any section returned by `getNominationGuidance()`, it SHALL have a non-empty title, a non-empty description, and a non-empty tips array with at least one entry
    - **Validates: Requirements 1.2**

  - [x] 2.3 Write property test for award-specific guidance availability (Property 2)
    - **Property 2: Award-specific guidance availability**
    - For any valid AwardName, calling `getNominationGuidance(awardName)` SHALL return a response where awardSpecificGuidance is defined, has a matching awardName field, and contains non-empty evidenceRequired, typicalProfile, and tips fields
    - **Validates: Requirements 1.4, 1.5**

- [x] 3. Implement sample citations module
  - [x] 3.1 Create src/sample-citations.ts with embedded example nominations and accessor function
    - Define `SAMPLE_NOMINATIONS` array with two complete Silver Wolf examples: George Macgregor and Mohammad Sagir
    - Each example must have all 7 section fields populated as non-empty strings (mainRole, additionalService, keyAchievements, levelOfService, communityInvolvement, otherInformation, citation)
    - Export `getSampleCitations(awardName?: AwardName): SampleCitationsResponse` function
    - When called with "Silver Wolf", return the Silver Wolf samples directly
    - When called with any other award name, return the Silver Wolf samples with a note indicating the award level difference
    - When called without a parameter, return all available samples
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.1_

  - [x] 3.2 Write property test for fallback samples with note (Property 3)
    - **Property 3: Fallback samples with note**
    - For any valid AwardName that is not "Silver Wolf", calling `getSampleCitations(awardName)` SHALL return a response with at least one sample and a non-empty note field
    - **Validates: Requirements 2.3**

  - [x] 3.3 Write property test for sample nomination completeness (Property 4)
    - **Property 4: Sample nomination completeness**
    - For any sample nomination returned by `getSampleCitations()`, all 7 section fields SHALL be non-empty strings
    - **Validates: Requirements 2.5**

- [x] 4. Implement writing tips module
  - [x] 4.1 Create src/writing-tips.ts with static data and accessor function
    - Define `GENERAL_TIPS` array covering: narrative cohesion, quantification, community involvement, level of service progression, citation brevity
    - Define `COMMON_MISTAKES` array covering: writing like a CV, leaving community involvement empty, inconsistent quantification
    - Define `TESTIMONIAL_GUIDANCE` array covering: weaving quotes into narrative rather than listing them
    - Define `AWARD_SPECIFIC_TIPS` record keyed by AwardName with tailored advice for each award level
    - Export `getWritingTips(awardName?: AwardName): WritingTips` function
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.2_

  - [x] 4.2 Write property test for award-specific writing tips availability (Property 5)
    - **Property 5: Award-specific writing tips availability**
    - For any valid AwardName, calling `getWritingTips(awardName)` SHALL return a response where awardSpecificTips is a non-empty array of strings
    - **Validates: Requirements 3.5**

- [x] 5. Checkpoint - Ensure data modules are correct
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Register new tools in src/index.ts
  - [x] 6.1 Add get_nomination_guidance, get_sample_citations, and get_writing_tips tool registrations to src/index.ts
    - Import `getNominationGuidance` from `./nomination-guidance.js`
    - Import `getSampleCitations` from `./sample-citations.js`
    - Import `getWritingTips` from `./writing-tips.js`
    - Register each tool with snake_case name, descriptive description, optional `awardName` parameter using `z.enum(AWARD_NAMES).optional()`, and handler that calls the accessor function and returns `{ content: [{ type: "text", text: JSON.stringify(result) }] }`
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 6.2 Write unit tests for tool registration and response shape
    - Verify the server exposes 7 tools total (4 existing + 3 new)
    - Verify tool names are snake_case
    - Verify tool descriptions are non-empty
    - Verify each new tool returns structured JSON with content array
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All data is static TypeScript constants — no network calls or external dependencies
- The sample citations (George Macgregor and Mohammad Sagir) are substantial multi-paragraph text constants embedded directly in the source

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "3.1", "4.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "3.2", "3.3", "4.2"] },
    { "id": 3, "tasks": ["6.1"] },
    { "id": 4, "tasks": ["6.2"] }
  ]
}
```
