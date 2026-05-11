import type { AwardName } from "./types.js";
import type {
  NominationSection,
  NominationGuidance,
  EligibilityWorkflow,
  AwardSpecificGuidance,
} from "./types.js";

export const NOMINATION_SECTIONS: NominationSection[] = [
  {
    title: "Main Role",
    fieldName: "mainRole",
    description:
      "Describe the nominee's primary Scouting role and responsibilities. Open by establishing who this person is and what drives them, then describe the scope and scale of their contribution.",
    tips: [
      "Open with the nominee's personal connection to Scouting — what motivates them. This sets the narrative tone for the entire nomination.",
      "State the role title and how long they have held it",
      "Describe the scale of their responsibility (e.g. number of young people, groups, or districts) using specific figures",
      "Explain what makes their contribution in this role exceptional rather than routine",
      "Weave in a quote from a colleague that captures how they approach the role",
      "Show the human behind the role — their time commitment, their reliability, their character",
    ],
  },
  {
    title: "Additional Service",
    fieldName: "additionalService",
    description:
      "Other roles, committees, training teams, or support the nominee provides beyond their main role. Paint a picture of someone whose contribution touches many areas of Scouting.",
    tips: [
      "Frame additional service as a narrative of breadth — show how this person's contribution extends across Scouting",
      "Group related activities thematically (e.g., international, training, events) rather than as a chronological list",
      "Include informal contributions like mentoring, event support, or advisory work",
      "Show how these additional roles complement and extend their main contribution",
      "Use specific figures: number of events, young people reached, years of involvement",
    ],
  },
  {
    title: "Key Achievements",
    fieldName: "keyAchievements",
    description:
      "Specific accomplishments that demonstrate the nominee's exceptional service. Tell the story of challenges they rose to meet, with concrete outcomes.",
    tips: [
      "Frame each achievement as a mini-narrative: context (the challenge), action (what they did), outcome (the impact)",
      "Quote specific figures where possible (e.g. 'trained 45 leaders', 'grew the group from 20 to 80 young people')",
      "Focus on outcomes and impact rather than just activities",
      "Include achievements that go beyond what would normally be expected of the role",
      "For nominees with a previous award, focus on achievements since that award was granted",
      "Weave in testimonials at the point where they evidence a specific achievement",
    ],
  },
  {
    title: "Level of Service",
    fieldName: "levelOfService",
    description:
      "How the nominee's service has grown, been sustained, or increased over time. Show the arc of their journey and build the argument for why they deserve this specific award.",
    tips: [
      "Tell the story of their journey — where they started, how they grew, where they are now",
      "Highlight any increase in responsibility or scope over time",
      "Show sustained commitment through challenges or changing circumstances",
      "For higher awards, demonstrate service that goes substantially beyond what was recognised previously",
      "Close this section with a compelling argument for why this person deserves this specific award",
      "Connect back to their personal motivation — show how the scale has changed but the dedication has not",
    ],
  },
  {
    title: "Community Involvement",
    fieldName: "communityInvolvement",
    description:
      "Impact beyond Scouting — community projects, partnerships with other organisations, and wider contributions that benefit the community.",
    tips: [
      "Do not leave this section empty — it is a common mistake that weakens nominations",
      "Include partnerships with schools, councils, charities, or faith groups",
      "Describe community events or projects the nominee has led or supported",
      "Show how their Scouting work creates wider community benefit",
      "Connect their community involvement to the same values and character traits shown in their Scouting service",
    ],
  },
  {
    title: "Other Information",
    fieldName: "otherInformation",
    description:
      "Context that doesn't fit elsewhere — bring testimonials together to paint a final portrait of the nominee, mention personal challenges overcome, and close with a powerful summary statement.",
    tips: [
      "Bring together the strongest testimonials from colleagues, weaving them into a final portrait",
      "Mention personal challenges overcome while maintaining service (e.g. health issues, family circumstances)",
      "Close with a powerful summary statement that captures the essence of why this person deserves recognition",
      "The final paragraph should leave the reader in no doubt about the nominee's worthiness",
    ],
  },
  {
    title: "Citation",
    fieldName: "citation",
    description:
      "A concise summary (max 300 characters) read aloud at the award presentation ceremony. Use the extended citation field for a richer summary for the panel.",
    tips: [
      "Write in the third person (e.g. 'For exceptional service to Scouting in...')",
      "Capture the essence of their contribution in a single compelling statement",
      "Keep it formal but warm — this will be read aloud to an audience",
      "Use the extendedCitation field for a longer, more evocative summary that captures the full arc of their story — this supports the panel's decision but is not read aloud",
    ],
    constraints: "Maximum 300 characters. This is read aloud at the award presentation. Use the extendedCitation field for a longer version.",
  },
];

export const ELIGIBILITY_WORKFLOW: EligibilityWorkflow = {
  description:
    "Before writing the nomination, confirm the nominee is eligible for the target award by extracting data from their member record and calling the check_eligibility tool.",
  steps: [
    {
      step: 1,
      instruction:
        "Extract eligibility-relevant data from user-provided member record screenshots.",
      details:
        "Look for: service years, previous awards held, date of last award, membership status (active member), appointment status (currently appointed to a role), mandatory learning completion, and criminal record check status (valid/expired).",
    },
    {
      step: 2,
      instruction:
        "Call the check_eligibility tool with the extracted data to confirm the nominee qualifies for the target award.",
      details:
        "Pass serviceYears, isMember, isAppointed, mandatoryLearningComplete, criminalRecordCheckValid, previousAward, dateOfLastAward, and targetAward to the check_eligibility tool.",
    },
    {
      step: 3,
      instruction:
        "Report the eligibility result to the user, including any unmet criteria.",
      details:
        "If eligible, confirm and proceed with writing the nomination. If there are unmet criteria, explain each one clearly so the user can decide whether to proceed or address the issues first.",
    },
    {
      step: 4,
      instruction:
        "If the nominee is ineligible for the target award, suggest which awards they do qualify for.",
      details:
        "Call check_eligibility without a targetAward parameter to get the list of all awards the nominee currently qualifies for. Present these alternatives to the user.",
    },
  ],
};

export const AWARD_SPECIFIC_GUIDANCE: Record<AwardName, AwardSpecificGuidance> =
  {
    "Chief Scout's Commendation for Good Service": {
      awardName: "Chief Scout's Commendation for Good Service",
      evidenceRequired:
        "Evidence of at least 5 years of outstanding service to Scouting that goes beyond what would normally be expected of the role.",
      typicalProfile:
        "An active volunteer who has made a notable contribution over at least 5 years, typically at Group or District level. They go above and beyond their role requirements consistently.",
      tips: [
        "This is often a first award — focus on establishing a clear picture of sustained good service",
        "Emphasise quality of contribution rather than just length of service",
        "Show how the nominee's efforts have benefited young people directly",
      ],
    },
    "Award for Merit": {
      awardName: "Award for Merit",
      evidenceRequired:
        "Evidence of at least 10 years of outstanding service to Scouting, demonstrating sustained commitment and significant impact.",
      typicalProfile:
        "A volunteer with a decade or more of dedicated service, often holding multiple roles or making significant contributions at District or County level.",
      tips: [
        "Demonstrate progression and growth in contribution over the 10+ year period",
        "Show impact at a broader level than just their immediate group",
        "Include evidence of how they have developed others or built capacity in Scouting",
      ],
    },
    "Bar to the Award for Merit": {
      awardName: "Bar to the Award for Merit",
      evidenceRequired:
        "Evidence of continued outstanding service since the Award for Merit was granted, demonstrating sustained or increased contribution over at least 5 further years.",
      typicalProfile:
        "A volunteer who has continued to deliver exceptional service since receiving the Award for Merit, often taking on additional responsibilities or expanding their impact.",
      tips: [
        "Focus on achievements and contributions since the Award for Merit was granted",
        "Show how their service has been sustained or has grown since the previous award",
        "Demonstrate continued impact rather than simply repeating what was said before",
      ],
    },
    "Silver Acorn": {
      awardName: "Silver Acorn",
      evidenceRequired:
        "Evidence of at least 20 years of specially distinguished service to Scouting, demonstrating exceptional and sustained contribution at a significant level.",
      typicalProfile:
        "A volunteer with two decades of exceptional service, typically with significant impact at County level or above, who has shaped Scouting in their area.",
      tips: [
        "Emphasise the 'specially distinguished' nature of their service — this is above and beyond outstanding",
        "Show breadth and depth of contribution across multiple areas of Scouting",
        "Demonstrate lasting impact on Scouting in their area or specialism",
        "Include evidence of leadership, innovation, or transformational change",
      ],
    },
    "Bar to the Silver Acorn": {
      awardName: "Bar to the Silver Acorn",
      evidenceRequired:
        "Evidence of continued specially distinguished service since the Silver Acorn was granted, demonstrating sustained exceptional contribution over at least 5 further years. This is a higher award requiring National Awards Advisory Group approval.",
      typicalProfile:
        "A volunteer who has continued to deliver specially distinguished service since receiving the Silver Acorn, with impact that extends beyond their local area.",
      tips: [
        "Focus exclusively on service and achievements since the Silver Acorn was granted",
        "Demonstrate that their contribution has been sustained at an exceptional level or has increased",
        "Show impact at regional or national level where possible",
        "This is assessed nationally — the nomination must stand on its own without local context assumptions",
      ],
    },
    "Silver Wolf": {
      awardName: "Silver Wolf",
      evidenceRequired:
        "Evidence of service of a most exceptional nature over normally at least 30 years. The Silver Wolf is the Chief Scout's unrestricted personal gift and is rarely awarded. The nominee normally holds the Silver Acorn.",
      typicalProfile:
        "A volunteer whose service is truly exceptional and transformational, typically with 30+ years of contribution that has shaped Scouting at regional or national level. Their impact is widely recognised and enduring.",
      tips: [
        "This is the highest award — the nomination must demonstrate 'service of a most exceptional nature'",
        "Show how the nominee's contribution has been transformational, not just sustained",
        "Demonstrate impact that extends well beyond their immediate area",
        "Include evidence of innovation, leadership at the highest levels, or unique contributions to Scouting",
        "The nominee normally holds the Silver Acorn — explain the progression beyond that level",
      ],
    },
  };

export function getNominationGuidance(
  awardName?: AwardName,
): NominationGuidance {
  return {
    sections: NOMINATION_SECTIONS,
    eligibilityWorkflow: ELIGIBILITY_WORKFLOW,
    awardSpecificGuidance: awardName
      ? AWARD_SPECIFIC_GUIDANCE[awardName]
      : undefined,
  };
}
