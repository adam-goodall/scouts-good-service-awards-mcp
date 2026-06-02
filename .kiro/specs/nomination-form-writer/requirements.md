# Requirements Document

## Introduction

Knowledge-provider tools for the Scouts Good Service Awards MCP server that supply the LLM client with the reference material it needs to write nomination forms. The MCP server does NOT generate nomination text itself — it provides sample citations, form structure guidance, writing tips, and award criteria so that the model (Claude, etc.) can produce high-quality nominations from user-provided input (testimonials, screenshots, facts). This keeps the MCP server as a stateless knowledge layer while the model handles the creative writing and conversational iteration.

## Glossary

- **Nomination_Guidance_Tool**: The MCP tool that returns the nomination form structure, field descriptions, and what each section should contain
- **Sample_Citations_Tool**: The MCP tool that returns embedded example nominations for a given award level, providing style and tone reference
- **Writing_Tips_Tool**: The MCP tool that returns citation masterclass guidance on how to write effective nominations
- **Nomination_Sections**: The 7 required sections of a Good Service Award nomination form (Main role, Additional service, Key achievements, Level of service, Community involvement, Other information, Citation)
- **Style_Reference**: Embedded sample nominations that demonstrate the expected quality, tone, and structure for each award level
- **Citation_Masterclass**: Guidance from the Scouts website on writing effective nominations, including common mistakes and best practices

## Requirements

### Requirement 1: Nomination Form Structure and Guidance Tool

**User Story:** As a model assisting a Nominator, I want to retrieve the nomination form structure and field guidance, so that I can produce output that matches the required format.

#### Acceptance Criteria

1. WHEN the model requests nomination guidance, THE Nomination_Guidance_Tool SHALL return the complete list of 7 Nomination_Sections with their titles, descriptions, and guidance on what each section should contain
2. THE Nomination_Guidance_Tool SHALL include for each section: the section title, a description of what information belongs there, and tips on what makes a strong entry (e.g., "quote specific figures where possible" for Key achievements)
3. THE Nomination_Guidance_Tool SHALL include the constraint that the Citation section must be no more than 300 characters and is read aloud at the award presentation
4. WHEN the model requests guidance for a specific award level, THE Nomination_Guidance_Tool SHALL return any award-specific guidance (e.g., Silver Wolf requires evidence of "service of a most exceptional nature" and normally requires Silver Acorn to have been previously awarded)
5. THE Nomination_Guidance_Tool SHALL accept an optional award name parameter to tailor the guidance to the specific award being nominated for

### Requirement 2: Sample Citations Tool

**User Story:** As a model assisting a Nominator, I want to retrieve example nominations for the relevant award level, so that I can match the expected tone, structure, and quality in my output.

#### Acceptance Criteria

1. WHEN the model requests sample citations, THE Sample_Citations_Tool SHALL return one or more complete example nominations for the specified award level
2. THE Sample_Citations_Tool SHALL embed at least two Silver Wolf example nominations (George Macgregor and Mohammad Sagir) as Style_Reference material
3. WHEN the model requests samples for an award level where no specific examples are embedded, THE Sample_Citations_Tool SHALL return the closest available examples with a note indicating the award level difference
4. THE Sample_Citations_Tool SHALL accept an award name parameter to filter examples by award level
5. THE Sample_Citations_Tool SHALL return examples with all 7 Nomination_Sections populated so the model can see the expected depth and detail for each section

### Requirement 3: Writing Tips Tool

**User Story:** As a model assisting a Nominator, I want to retrieve best-practice writing guidance, so that I can avoid common mistakes and produce nominations that are likely to succeed.

#### Acceptance Criteria

1. WHEN the model requests writing tips, THE Writing_Tips_Tool SHALL return guidance derived from the Scouts citation masterclass on how to write effective nominations
2. THE Writing_Tips_Tool SHALL include guidance on: narrative cohesion (telling a human story, not just listing facts), quantification (using specific figures), the importance of community involvement, how to frame level of service progression, and citation brevity
3. THE Writing_Tips_Tool SHALL include common mistakes to avoid (e.g., writing like a CV rather than a portrait, leaving community involvement empty, inconsistent quantification)
4. THE Writing_Tips_Tool SHALL include guidance on how to incorporate testimonials effectively (weaving quotes into narrative rather than listing them)
5. THE Writing_Tips_Tool SHALL accept an optional award name parameter to return award-specific writing advice (e.g., Silver Wolf nominations should demonstrate "service of a most exceptional nature" and show progression beyond Silver Acorn)

### Requirement 4: Integration with Existing Tools

**User Story:** As a model assisting a Nominator, I want the knowledge tools to complement the existing eligibility and award info tools, so that I have a complete picture when writing a nomination.

#### Acceptance Criteria

1. THE new tools SHALL be registered on the same MCP server instance as the existing check_eligibility, build_nomination, get_award_info, and get_deadlines tools
2. THE new tools SHALL use consistent naming conventions with the existing tools (snake_case tool names)
3. THE new tools SHALL return structured JSON responses in the same format as existing tools (content array with text type)
4. THE new tools SHALL provide tool descriptions that clearly state their purpose so MCP clients can present them appropriately to users

### Requirement 5: Eligibility Workflow Guidance

**User Story:** As a model assisting a Nominator, I want the nomination guidance to instruct me to check eligibility from member record data, so that I can confirm the nominee qualifies before writing the nomination.

#### Acceptance Criteria

1. WHEN the Nomination_Guidance_Tool returns guidance, THE response SHALL include instructions for the model to extract eligibility-relevant data from user-provided member record screenshots (service years, previous awards, date of last award, membership status)
2. THE guidance SHALL instruct the model to call the existing check_eligibility tool with the extracted data to confirm the nominee qualifies for the target award before proceeding with the nomination
3. THE guidance SHALL instruct the model to report the eligibility result to the user, including any unmet criteria, before writing the nomination form
4. THE guidance SHALL instruct the model that if the nominee is ineligible for the target award, it should suggest which awards the nominee does qualify for (using the check_eligibility tool without a target award)

### Requirement 6: Embedded Reference Data

**User Story:** As a developer, I want all reference material embedded in the server package, so that the tools work without network access or external dependencies.

#### Acceptance Criteria

1. THE MCP_Server SHALL embed all sample citations as static data within the package, requiring no network access to retrieve them
2. THE MCP_Server SHALL embed all writing tips and citation masterclass guidance as static data within the package
3. THE MCP_Server SHALL embed all nomination form structure and field guidance as static data within the package
4. THE embedded data SHALL be maintainable — stored in clearly structured TypeScript constants or data files that can be updated when Scouts guidance changes
5. THE MCP_Server SHALL continue to operate without external API keys, authentication, or network connectivity (consistent with existing Requirement 5.3 from the original spec)
