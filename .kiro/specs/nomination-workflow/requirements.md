# Requirements Document

## Introduction

An interactive nomination workflow tool for the Scouts Good Service Awards MCP server that guides the user step-by-step through gathering nominee data from the membership system. The workflow collects membership details, role information (via screenshots), award history, and line manager input, then determines eligibility and tells the user what additional information is needed to generate the full nomination form.

This tool orchestrates the conversational flow — it does not replace the existing stateless tools (check_eligibility, build_nomination, etc.) but provides a structured sequence of prompts that the MCP client (e.g. Kiro, Claude) follows to collect all required data before invoking those tools.

## Glossary

- **Nomination_Workflow_Tool**: The MCP tool that returns the next step in the nomination data-gathering sequence based on current workflow state
- **Workflow_State**: The accumulated data collected so far during the nomination workflow (membership number, name, roles, awards, etc.)
- **Membership_Number**: The unique identifier for a volunteer in the Scouts membership system
- **Role_Status**: The status of a role assignment — "Full", "Provisional", or "Provisional + System"
- **Current_Roles**: The list of roles a nominee currently holds, as displayed on their membership system profile
- **Historic_Roles**: The list of roles a nominee has previously held, used to calculate total service years
- **Current_Awards**: The Good Service Awards a nominee currently holds, as displayed on their membership system awards page
- **Line_Manager**: A person in the nominee's reporting chain whose input is required for the citation
- **Eligibility_Assessment**: The determination of whether a nominee qualifies for a specific award based on collected data

## Requirements

### Requirement 1: Workflow Initiation

**User Story:** As a Nominator, I want to start a nomination workflow by saying something like "start nomination", so that I am guided through the data-gathering process step by step.

#### Acceptance Criteria

1. WHEN the Nomination_Workflow_Tool is invoked with a Workflow_State that contains no Membership_Number, THE Nomination_Workflow_Tool SHALL return step 1 prompting the user for the nominee's Membership_Number
2. THE Nomination_Workflow_Tool SHALL accept a Workflow_State parameter representing data collected so far, defaulting to an empty object (no fields populated) on first invocation
3. THE Nomination_Workflow_Tool SHALL return a structured response containing: the current step number (integer starting at 1), a prompt to display to the user, the data field name being collected, and any instructions for what the user needs to do
4. IF the Workflow_State parameter is not a valid object, THEN THE Nomination_Workflow_Tool SHALL return an error response indicating that the provided state is malformed

### Requirement 2: Nominee Identification

**User Story:** As a Nominator, I want to provide the nominee's membership number and name, so that the workflow can track who the nomination is for.

#### Acceptance Criteria

1. WHEN the workflow state contains no Membership_Number, THE Nomination_Workflow_Tool SHALL prompt the user to provide the nominee's Membership_Number
2. WHEN the workflow state contains a Membership_Number but no nominee name, THE Nomination_Workflow_Tool SHALL prompt the user to provide the nominee's full name (given name and surname as a single text field, between 2 and 100 characters)
3. WHEN the user provides a Membership_Number and name, THE Nomination_Workflow_Tool SHALL include both values in the returned Workflow_State so that subsequent invocations can access them
4. IF the user provides an empty or whitespace-only value for Membership_Number or name, THEN THE Nomination_Workflow_Tool SHALL repeat the prompt for the missing field without advancing to the next step

### Requirement 3: Current Role Collection via Screenshot

**User Story:** As a Nominator, I want to be guided to take a screenshot of the nominee's current roles from the membership system, so that the workflow can assess whether they hold a valid appointment.

#### Acceptance Criteria

1. WHEN the workflow state contains the nominee's name but no Current_Roles data, THE Nomination_Workflow_Tool SHALL prompt the user to navigate to the nominee's role list in the membership system and take a screenshot, including a navigation path describing how to reach the role list page from the nominee's member record
2. THE Nomination_Workflow_Tool SHALL instruct the user that the nominee must hold at least one role with a Role_Status of "Full" (i.e. not "Provisional" or "Provisional + System") to be considered as holding a valid appointment
3. WHEN the user provides role data extracted from the screenshot, THE Nomination_Workflow_Tool SHALL store in the Workflow_State whether the nominee holds at least one role with a non-provisional status and the total number of current roles identified
4. IF the user provides data that does not contain identifiable role information, THEN THE Nomination_Workflow_Tool SHALL re-prompt the user to provide a screenshot of the nominee's current roles page

### Requirement 4: Historic Role Collection via Screenshot

**User Story:** As a Nominator, I want to be guided to take a screenshot of the nominee's historic roles, so that the workflow can determine total years of service.

#### Acceptance Criteria

1. WHEN the workflow state contains Current_Roles data but no Historic_Roles data, THE Nomination_Workflow_Tool SHALL prompt the user to navigate to the nominee's historic roles page and take a screenshot
2. THE Nomination_Workflow_Tool SHALL instruct the user that historic roles are used to calculate total qualifying adult service years, and that the screenshot should show role titles and start/end dates
3. THE Nomination_Workflow_Tool SHALL include instructions on where to find the historic roles in the membership system
4. WHEN the user provides historic role data, THE Nomination_Workflow_Tool SHALL record the earliest adult role start date and calculate total qualifying service years for use in the Eligibility_Assessment
5. IF the user indicates that the nominee has no historic roles, THEN THE Nomination_Workflow_Tool SHALL calculate qualifying service years based solely on Current_Roles data

### Requirement 5: Current Awards Collection via Screenshot

**User Story:** As a Nominator, I want to be guided to take a screenshot of the nominee's current awards, so that the workflow can determine award progression eligibility.

#### Acceptance Criteria

1. WHEN the workflow state contains Historic_Roles data but no Current_Awards data, THE Nomination_Workflow_Tool SHALL prompt the user to navigate to the nominee's awards page in the membership system and take a screenshot
2. THE Nomination_Workflow_Tool SHALL instruct the user that the awards page shows previously received Good Service Awards, which determines the next eligible award in the hierarchy, and that having no previous awards means the nominee would be considered for the first award in the hierarchy
3. THE Nomination_Workflow_Tool SHALL include instructions on where to find the awards page in the membership system
4. WHEN the user provides award data, THE Nomination_Workflow_Tool SHALL record the nominee's highest current Good Service Award (or that they hold none) in the Workflow_State for use in the Eligibility_Assessment

### Requirement 6: Criminal Record Check Status

**User Story:** As a Nominator, I want to confirm whether the nominee has a current criminal records disclosure check, so that this eligibility criterion can be assessed.

#### Acceptance Criteria

1. WHEN the workflow state contains Current_Awards data but no criminal record check status, THE Nomination_Workflow_Tool SHALL prompt the user to confirm whether the nominee has a current criminal records disclosure check, accepting a yes or no response
2. THE Nomination_Workflow_Tool SHALL explain that a valid disclosure check is required for eligibility and that the nominee must hold a current check at the time of nomination
3. WHEN the user confirms or denies the criminal record check status, THE Nomination_Workflow_Tool SHALL store the response as a boolean value in the workflow state for use in the Eligibility_Assessment
4. IF the user provides a response that cannot be interpreted as a yes or no confirmation, THEN THE Nomination_Workflow_Tool SHALL re-prompt the user indicating that a yes or no answer is required

### Requirement 7: Eligibility Determination

**User Story:** As a Nominator, I want the workflow to determine the nominee's eligibility based on all collected data, so that I know whether to proceed with the nomination and which award to target.

#### Acceptance Criteria

1. WHEN the workflow state contains all eligibility-relevant data (roles, historic roles, awards, criminal record check status, mandatory learning status), THE Nomination_Workflow_Tool SHALL return an Eligibility_Assessment evaluating the following criteria: whether the nominee holds a valid appointment (at least one non-provisional role), whether the nominee is a current member, whether mandatory learning is complete, whether the criminal record check is valid, and whether the nominee's total service years meet the minimum for the next award in the progression hierarchy
2. THE Eligibility_Assessment SHALL identify: whether the nominee holds a valid appointment (non-provisional role), the calculated total service years, the highest current Good Service Award held (or "none" if no previous award), and the next award in the progression hierarchy
3. IF the nominee does not meet one or more eligibility criteria, THEN THE Nomination_Workflow_Tool SHALL report each unmet criterion and indicate what condition must be satisfied before a nomination can proceed
4. IF the nominee meets all eligibility criteria, THEN THE Nomination_Workflow_Tool SHALL confirm eligibility and state which award the nominee qualifies for next in the progression hierarchy
5. WHEN the workflow state contains Current_Awards data and criminal record check status but no mandatory learning status, THE Nomination_Workflow_Tool SHALL prompt the user to confirm whether the nominee has completed their mandatory learning before performing the eligibility assessment

### Requirement 8: Line Manager Input Collection

**User Story:** As a Nominator, I want to be prompted to gather input from each of the nominee's line managers, so that I have testimonial material for the citation.

#### Acceptance Criteria

1. WHEN the nominee is determined eligible, THE Nomination_Workflow_Tool SHALL prompt the user to identify the nominee's line managers based on their Current_Roles and confirm whether they have spoken with each one
2. IF the user has not spoken with one or more line managers, THEN THE Nomination_Workflow_Tool SHALL advise the user to speak with all line managers before proceeding and not advance to the next workflow step
3. WHEN the user confirms they have spoken with all line managers, THE Nomination_Workflow_Tool SHALL request that the user provide input from each line manager, including at least one direct quote, one observation about the nominee's contribution, and one specific example of the nominee's service per line manager
4. THE Nomination_Workflow_Tool SHALL explain that line manager input is used to build the narrative for the nomination citation

### Requirement 9: Additional Information Summary

**User Story:** As a Nominator, I want the workflow to tell me what additional information is needed to generate the full nomination, so that I can gather everything before writing begins.

#### Acceptance Criteria

1. WHEN all eligibility data and line manager input have been collected, THE Nomination_Workflow_Tool SHALL return a summary listing each of the 7 nomination form sections (main role, additional service, key achievements, level of service, community involvement, other information, citation) with a status indicating whether the section can be populated from data already collected or requires further input from the user
2. THE Nomination_Workflow_Tool SHALL mark a section as populatable from collected data only if the workflow state contains information directly relevant to that section (e.g. current roles for "main role", line manager quotes for "key achievements"), and SHALL mark all other sections as requiring further input
3. FOR each section marked as requiring further input, THE summary SHALL describe what kind of information the user needs to provide for that section (e.g. examples of community involvement, details of service beyond the main role)
4. THE summary SHALL include the tool names get_nomination_guidance, get_sample_citations, and get_writing_tips, and for each tool SHALL state its purpose so the model can invoke them when writing the nomination

### Requirement 10: Stateless Step-Based Design

**User Story:** As a developer, I want the workflow tool to be stateless and step-based, so that it integrates cleanly with the existing MCP server architecture.

#### Acceptance Criteria

1. THE Nomination_Workflow_Tool SHALL accept the complete Workflow_State as input on each invocation — including the current step identifier and all data collected in previous steps — and return a deterministic next step based solely on that input state
2. THE Nomination_Workflow_Tool SHALL not maintain any server-side session or state between invocations
3. THE Nomination_Workflow_Tool SHALL be registered on the same MCP server instance as the existing tools using snake_case naming conventions
4. THE Nomination_Workflow_Tool SHALL return structured JSON responses in the same format as existing tools (content array with text type containing a JSON-serialised payload)
5. IF the Nomination_Workflow_Tool receives a Workflow_State with missing required fields or an unrecognised step identifier, THEN THE Nomination_Workflow_Tool SHALL return an error response indicating which fields are missing or which step identifier is invalid, without throwing an unhandled exception
6. THE Nomination_Workflow_Tool SHALL include in each response the current step identifier, any prompt or instructions for the user, the list of fields to collect, and the next step identifier to transition to upon completion
