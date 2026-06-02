# Requirements Document

## Introduction

An MCP (Model Context Protocol) server that assists Scouts volunteers with Good Service Award nominations. The server provides two core capabilities: checking whether a member is eligible for a specific Good Service Award, and helping create a nomination form with all required information so it can be submitted. The server is intended to be distributed as a standalone package that others can install and use with any MCP-compatible client.

## Glossary

- **MCP_Server**: The Model Context Protocol server application that exposes tools for eligibility checking and nomination form creation
- **Eligibility_Checker**: The tool within the MCP server that determines whether a nominee meets the criteria for a specific Good Service Award
- **Nomination_Builder**: The tool within the MCP server that guides users through creating a complete nomination form
- **Nominee**: The adult member of Scouts being considered for a Good Service Award
- **Nominator**: The person using the MCP server to check eligibility and create a nomination
- **Award_Hierarchy**: The ordered progression of Good Service Awards from Chief Scout's Commendation through to Silver Wolf
- **Lower_Awards**: Chief Scout's Commendation for Good Service, Award for Merit, Bar to the Award for Merit, and Silver Acorn
- **Higher_Awards**: Bar to the Silver Acorn and Silver Wolf
- **Service_Years**: The number of years of qualifying service a nominee has accumulated
- **Previous_Award**: The most recent Good Service Award held by the nominee, if any
- **Nomination_Form**: The structured data containing all required fields for submitting a Good Service Award nomination
- **Citation**: A summary statement of why the member is deserving of the award, read aloud when the award is presented

## Requirements

### Requirement 1: Eligibility Checking Tool

**User Story:** As a Nominator, I want to check whether a Nominee is eligible for a specific Good Service Award, so that I can determine if it is worth proceeding with a nomination.

#### Acceptance Criteria

1. WHEN the Nominator provides nominee details (membership status, appointment status, mandatory learning completion, Service_Years, Criminal Records Check status, Previous_Award if any, and date of most recent Good Service Award if any) and a target award, THE Eligibility_Checker SHALL evaluate all general eligibility criteria and return an eligible or ineligible result
2. IF the Nominee does not meet one or more eligibility criteria, THEN THE Eligibility_Checker SHALL identify each unmet criterion with an explanation of why it is not satisfied
3. IF the Nominator does not specify a target award, THEN THE Eligibility_Checker SHALL determine which awards in the Award_Hierarchy the Nominee is eligible for based on their service history and Previous_Award
4. THE Eligibility_Checker SHALL validate that the Nominee has the minimum required Service_Years for the target award (5 years for Chief Scout's Commendation, 10 years for Award for Merit, 15 years for Bar to Award for Merit, 20 years for Silver Acorn, 25 years for Bar to Silver Acorn, 30 years for Silver Wolf) where Service_Years is measured as total qualifying adult service
5. WHEN the Nominee already holds a Previous_Award, THE Eligibility_Checker SHALL verify that the target award is the correct next step in the Award_Hierarchy
6. WHEN the Nominee has received any Good Service Award within the last 5 years, THE Eligibility_Checker SHALL report the Nominee as ineligible with the date of the previous award
7. WHEN the Nominee already holds the target award, THE Eligibility_Checker SHALL report the Nominee as ineligible

### Requirement 2: Nomination Form Builder Tool

**User Story:** As a Nominator, I want help creating a complete nomination form, so that I can submit a well-structured nomination with all required information.

#### Acceptance Criteria

1. THE Nomination_Builder SHALL accept input for all required nomination form fields: main role description, additional service, key achievements, level of service, community involvement, other relevant information, and citation
2. WHEN the Nominator provides information for a nomination field, THE Nomination_Builder SHALL store the response and indicate which required fields remain incomplete
3. WHEN all required fields have been completed, THE Nomination_Builder SHALL produce a complete Nomination_Form containing all field responses structured as a single output suitable for copying into the Scouts nomination submission
4. THE Nomination_Builder SHALL validate that the citation field contains no more than 300 characters, as it must serve as a brief summary read aloud at an award presentation
5. WHEN the Nominator provides key achievements, THE Nomination_Builder SHALL ask the Nominator to confirm whether the achievements relate to the period since the Nominee's last Good Service Award, or to their entire service period if the Nominee holds no Previous_Award
6. WHEN the Nominator is completing the level of service field, THE Nomination_Builder SHALL prompt the Nominator to indicate whether the Nominee's level of service has continued at a similar level or substantially increased
7. IF the Nominator provides an empty or whitespace-only value for a required field, THEN THE Nomination_Builder SHALL reject the input and indicate that the field requires a non-empty response
8. WHEN the Nominator provides information for a field that has already been completed, THE Nomination_Builder SHALL replace the previous response with the new value and confirm the update

### Requirement 3: Award Hierarchy Information Tool

**User Story:** As a Nominator, I want to understand the award hierarchy and requirements, so that I can nominate for the appropriate award level.

#### Acceptance Criteria

1. WHEN the Nominator requests information about the Award_Hierarchy, THE MCP_Server SHALL return all six awards in progression order (Chief Scout's Commendation, Award for Merit, Bar to Award for Merit, Silver Acorn, Bar to Silver Acorn, Silver Wolf), each with its minimum Service_Years requirement, classification as Lower_Award or Higher_Award, and a brief description of the award's purpose
2. WHEN the Nominator requests details about a specific award, THE MCP_Server SHALL return the minimum Service_Years, prerequisite Previous_Award if any, classification as Lower_Award or Higher_Award, the approval authority, and whether a minimum 5-year gap since the last Good Service Award applies
3. WHEN the Nominator requests details about Silver Wolf, THE MCP_Server SHALL indicate that it is the Chief Scout's unrestricted gift, that it is rarely awarded for less than 30 years of service, and that it normally requires the Nominee to hold Silver Acorn
4. WHEN the Nominator requests hierarchy or award detail information, THE MCP_Server SHALL indicate that Lower_Awards are approved locally by District, County, or Area Lead Volunteers, and that Higher_Awards require local support followed by a decision from the National Awards Advisory Group

### Requirement 4: Submission Deadline Awareness

**User Story:** As a Nominator, I want to know the relevant submission deadlines, so that I can submit my nomination in time.

#### Acceptance Criteria

1. WHEN the Nominator requests deadline information, THE MCP_Server SHALL return the quarterly submission deadlines (31 March, 30 June, 30 September, 31 December)
2. WHEN the Nominator requests deadline information, THE MCP_Server SHALL identify the next upcoming deadline based on the current date
3. WHEN the Nominator requests deadline information, THE MCP_Server SHALL indicate that draft nominations with 'Draft' or 'Under review – Locally' status not modified within 3 months may be automatically rejected
4. WHEN the Nominator requests deadline information, THE MCP_Server SHALL return the post-deadline processing timeline: awards dispatched within 2 months, congratulatory letters sent within 3 months, and awards uploaded to Compass within 4 months of the submission deadline

### Requirement 5: MCP Server Distribution and Configuration

**User Story:** As a developer, I want to install and configure the MCP server easily, so that I can use it with my MCP-compatible client.

#### Acceptance Criteria

1. THE MCP_Server SHALL be distributable as a standalone package that can be installed and run via a standard package manager runner (npx or uvx) without requiring manual cloning or build steps
2. THE MCP_Server SHALL expose its tools using the Model Context Protocol standard over stdio transport so that any MCP-compatible client can discover and invoke them
3. THE MCP_Server SHALL operate without requiring external API keys, authentication to third-party services, or network connectivity
4. THE MCP_Server SHALL provide tool descriptions that state the tool's purpose and expected inputs, and parameter schemas that specify each parameter's name, type, and whether it is required, so that MCP clients can present prompts to users without needing additional documentation
5. WHEN an MCP client requests the tool list, THE MCP_Server SHALL return entries for the Eligibility_Checker, Nomination_Builder, award hierarchy information, and submission deadline tools

### Requirement 6: Input Validation

**User Story:** As a Nominator, I want clear feedback when I provide incomplete or invalid information, so that I can correct my input.

#### Acceptance Criteria

1. WHEN the Nominator provides a Service_Years value that is not a positive integer, THE Eligibility_Checker SHALL return a validation error indicating that Service_Years must be a whole number greater than zero
2. WHEN the Nominator specifies an award name that does not match any award in the Award_Hierarchy, THE MCP_Server SHALL return a validation error listing the valid award names
3. IF the Nominator attempts to build a nomination without first confirming eligibility, THEN THE Nomination_Builder SHALL proceed but include a reminder that eligibility should be verified before submission
4. IF the Nominator invokes a tool without providing a required parameter, THEN THE MCP_Server SHALL return a validation error identifying the missing parameter and its expected type
5. IF the Nominator provides an empty value for a required Nomination_Form field, THEN THE Nomination_Builder SHALL return a validation error identifying the field and indicating that a non-empty value is required
