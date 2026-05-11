# Scouts Good Service Awards MCP Server

An MCP (Model Context Protocol) server that assists Scouts volunteers with Good Service Award nominations. It checks eligibility, helps build nomination forms, provides award hierarchy information, tracks submission deadlines, and supplies reference material for writing high-quality nominations.

## Installation

### From npm (once published)

Add to your MCP client configuration (e.g. Claude Desktop, Kiro, or any MCP-compatible client):

```json
{
  "mcpServers": {
    "scouts-good-service-awards": {
      "command": "npx",
      "args": ["scouts-good-service-awards-mcp"]
    }
  }
}
```

### From a local clone

Clone the repo, install dependencies, and build:

```bash
git clone <repo-url>
cd scouts-good-service-awards-mcp
npm install
npm run build
```

Then point your MCP client at the built entry point:

```json
{
  "mcpServers": {
    "scouts-good-service-awards": {
      "command": "node",
      "args": ["/absolute/path/to/scouts-good-service-awards-mcp/dist/index.js"]
    }
  }
}
```

No API keys or network access required — all award data is embedded in the package.

## Tools

### check_eligibility

Check whether a nominee is eligible for a specific Good Service Award, or determine which awards they qualify for.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `serviceYears` | integer | Yes | Total years of qualifying adult service |
| `isMember` | boolean | Yes | Whether the nominee is a current member |
| `isAppointed` | boolean | Yes | Whether the nominee holds a current appointment |
| `mandatoryLearningComplete` | boolean | Yes | Whether mandatory learning is complete |
| `criminalRecordCheckValid` | boolean | Yes | Whether CRC is valid |
| `previousAward` | string | No | Most recent Good Service Award held, or "none" |
| `dateOfLastAward` | string (ISO date) | No | Date the previous award was received |
| `targetAward` | string | No | Specific award to check eligibility for |

**Valid award names:** Chief Scout's Commendation for Good Service, Award for Merit, Bar to the Award for Merit, Silver Acorn, Bar to the Silver Acorn, Silver Wolf

**Behaviour:**
- If `targetAward` is provided: returns whether the nominee is eligible for that specific award, with details of any unmet criteria
- If `targetAward` is omitted: returns a list of all awards the nominee currently qualifies for

### build_nomination

Create a complete Good Service Award nomination form with all required fields.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mainRole` | string | Yes | Description of the nominee's main role |
| `additionalService` | string | Yes | Other service contributions |
| `keyAchievements` | string | Yes | Notable achievements |
| `achievementsPeriod` | string | Yes | `"since_last_award"` or `"entire_service"` |
| `levelOfService` | string | Yes | Description of service level |
| `serviceLevelChange` | string | Yes | `"similar"` or `"substantially_increased"` |
| `communityInvolvement` | string | Yes | Community involvement details |
| `otherInformation` | string | Yes | Any other relevant information |
| `citation` | string | Yes | Brief summary (max 300 characters) read aloud at presentation |

**Returns:** A formatted nomination form ready to copy into the Scouts nomination submission system.

### get_award_info

Get information about the Good Service Award hierarchy and individual award requirements.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `award` | string | No | Specific award to get details for |

**Behaviour:**
- If `award` is omitted: returns the full hierarchy with all six awards
- If `award` is provided: returns detailed information including minimum service years, prerequisites, classification, and approval authority

### get_deadlines

Get quarterly submission deadlines and post-deadline processing timelines.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `currentDate` | string (ISO date) | No | Date to calculate from (defaults to today) |

**Returns:** All four quarterly deadlines (31 March, 30 June, 30 September, 31 December), the next upcoming deadline, expected processing timeline, and draft expiry warning.

### get_nomination_guidance

Get the nomination form structure, field guidance, and eligibility workflow instructions for writing a Good Service Award nomination.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `awardName` | string | No | Specific award to tailor guidance for |

**Returns:**
- `sections` — the 7 nomination form sections with titles, descriptions, tips, and constraints (e.g. citation max 300 characters)
- `eligibilityWorkflow` — step-by-step instructions for checking eligibility from member record data before writing
- `awardSpecificGuidance` — tailored guidance for the requested award level (evidence required, typical profile, tips)

### get_sample_citations

Get complete example nominations for a given award level to use as style and tone reference when writing nominations.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `awardName` | string | No | Award level to get examples for |

**Behaviour:**
- If `awardName` is provided: returns example nominations for that specific award level
- If `awardName` is omitted: returns all available examples across all award levels

Examples are sourced from the [Scouts citation masterclass](https://www.scouts.org.uk/volunteers/learning-development-and-awards/awards-and-recognition/citation-masterclass/good-service-award-nomination-form-examples/) and include complete 7-section nominations demonstrating the expected depth and tone for each award level.

### get_writing_tips

Get citation masterclass guidance and best practices for writing effective Good Service Award nominations.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `awardName` | string | No | Award level to get specific tips for |

**Returns:**
- `generalTips` — guidance on narrative cohesion, quantification, community involvement, level of service progression, and citation brevity
- `commonMistakes` — pitfalls to avoid (CV-style writing, empty community involvement, inconsistent quantification)
- `testimonialGuidance` — how to weave quotes into narrative effectively
- `awardSpecificTips` — tailored advice for the requested award level (if provided)

## Award Hierarchy

| Award | Min. Service | Classification | Approved By |
|-------|-------------|----------------|-------------|
| Chief Scout's Commendation for Good Service | 5 years | Lower | Local (District/County/Area) |
| Award for Merit | 10 years | Lower | Local (District/County/Area) |
| Bar to the Award for Merit | 15 years | Lower | Local (District/County/Area) |
| Silver Acorn | 20 years | Lower | Local (District/County/Area) |
| Bar to the Silver Acorn | 25 years | Higher | National Awards Advisory Group |
| Silver Wolf | 30 years | Higher | National Awards Advisory Group |

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Run locally
npm start
```

## License

MIT
