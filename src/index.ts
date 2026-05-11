#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { checkEligibility } from "./eligibility.js";
import { validateNominationForm, formatNominationForm } from "./nomination.js";
import { AWARD_HIERARCHY, getAwardByName } from "./awards.js";
import {
  getNextDeadline,
  getAllDeadlines,
  getProcessingTimeline,
  DRAFT_EXPIRY_WARNING,
} from "./deadlines.js";
import { getNominationGuidance } from "./nomination-guidance.js";
import { getSampleCitations } from "./sample-citations.js";
import { getWritingTips } from "./writing-tips.js";
import { resolveNextStep } from "./nomination-workflow.js";

const AWARD_NAMES = [
  "Chief Scout's Commendation for Good Service",
  "Award for Merit",
  "Bar to the Award for Merit",
  "Silver Acorn",
  "Bar to the Silver Acorn",
  "Silver Wolf",
] as const;

const server = new McpServer({
  name: "scouts-good-service-awards-mcp",
  version: "0.1.0",
});

server.tool(
  "check_eligibility",
  "Check whether a nominee is eligible for a specific Good Service Award, or determine which awards they qualify for",
  {
    serviceYears: z.number().int().positive(),
    isMember: z.boolean(),
    isAppointed: z.boolean(),
    mandatoryLearningComplete: z.boolean(),
    criminalRecordCheckValid: z.boolean(),
    previousAward: z.enum([...AWARD_NAMES, "none"]).optional(),
    dateOfLastAward: z.string().date().optional(),
    targetAward: z.enum(AWARD_NAMES).optional(),
  },
  async (params) => {
    const result = checkEligibility({
      serviceYears: params.serviceYears,
      isMember: params.isMember,
      isAppointed: params.isAppointed,
      mandatoryLearningComplete: params.mandatoryLearningComplete,
      criminalRecordCheckValid: params.criminalRecordCheckValid,
      previousAward: params.previousAward ?? "none",
      dateOfLastAward: params.dateOfLastAward,
      targetAward: params.targetAward,
    });

    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
    };
  },
);

server.tool(
  "build_nomination",
  "Create a complete Good Service Award nomination form with all required fields",
  {
    mainRole: z.string().min(1),
    additionalService: z.string().min(1),
    keyAchievements: z.string().min(1),
    achievementsPeriod: z.enum(["since_last_award", "entire_service"]),
    levelOfService: z.string().min(1),
    serviceLevelChange: z.enum(["similar", "substantially_increased"]),
    communityInvolvement: z.string().min(1),
    otherInformation: z.string().min(1),
    citation: z.string().min(1).max(300),
    extendedCitation: z.string().min(1).optional(),
    narrativeContext: z.string().min(1).optional(),
    style: z.enum(["narrative", "structured"]).optional(),
  },
  async (params) => {
    const validation = validateNominationForm(params);

    if (!validation.valid) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: true,
              validationErrors: validation.errors,
            }),
          },
        ],
      };
    }

    const formatted = formatNominationForm(params);
    return {
      content: [{ type: "text", text: formatted }],
    };
  },
);

server.tool(
  "get_award_info",
  "Get information about the Good Service Award hierarchy and individual award requirements",
  {
    award: z.enum(AWARD_NAMES).optional(),
  },
  async (params) => {
    if (!params.award) {
      const response = {
        hierarchy: AWARD_HIERARCHY,
        note: "Lower awards (Chief Scout's Commendation, Award for Merit, Bar to Award for Merit, Silver Acorn) are approved locally by District, County, or Area Lead Volunteers. Higher awards (Bar to Silver Acorn, Silver Wolf) require local support followed by a decision from the National Awards Advisory Group.",
      };
      return {
        content: [{ type: "text", text: JSON.stringify(response) }],
      };
    }

    const award = getAwardByName(params.award);
    const response = {
      ...award,
      note:
        award.classification === "lower"
          ? "Lower awards are approved locally by District, County, or Area Lead Volunteers."
          : "Higher awards require local support followed by a decision from the National Awards Advisory Group.",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
);

server.tool(
  "get_deadlines",
  "Get quarterly submission deadlines and post-deadline processing timelines",
  {
    currentDate: z.string().date().optional(),
  },
  async (params) => {
    const date = params.currentDate ? new Date(params.currentDate) : new Date();
    const nextDeadline = getNextDeadline(date);
    const allDeadlines = getAllDeadlines();
    const processingTimeline = getProcessingTimeline(
      new Date(nextDeadline.date),
    );

    const response = {
      allDeadlines,
      nextDeadline,
      processingTimeline,
      draftExpiryWarning: DRAFT_EXPIRY_WARNING,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
);

server.tool(
  "get_nomination_guidance",
  "Get the nomination form structure, field guidance, and eligibility workflow instructions for writing a Good Service Award nomination",
  {
    awardName: z.enum(AWARD_NAMES).optional(),
  },
  async (params) => {
    const guidance = getNominationGuidance(params.awardName);
    return {
      content: [{ type: "text", text: JSON.stringify(guidance) }],
    };
  },
);

server.tool(
  "get_sample_citations",
  "Get complete example nominations for a given award level to use as style and tone reference when writing nominations",
  {
    awardName: z.enum(AWARD_NAMES).optional(),
  },
  async (params) => {
    const samples = getSampleCitations(params.awardName);
    return {
      content: [{ type: "text", text: JSON.stringify(samples) }],
    };
  },
);

server.tool(
  "get_writing_tips",
  "Get citation masterclass guidance and best practices for writing effective Good Service Award nominations",
  {
    awardName: z.enum(AWARD_NAMES).optional(),
  },
  async (params) => {
    const tips = getWritingTips(params.awardName);
    return {
      content: [{ type: "text", text: JSON.stringify(tips) }],
    };
  },
);

server.tool(
  "nomination_workflow",
  "Guide the user step-by-step through collecting nominee data for a Good Service Award nomination",
  {
    state: z.object({
      membershipNumber: z.string().optional(),
      nomineeName: z.string().optional(),
      currentRoles: z.object({
        hasNonProvisionalRole: z.boolean(),
        totalRoles: z.number().int().nonnegative(),
      }).optional(),
      historicRoles: z.object({
        earliestStartDate: z.string(),
        totalServiceYears: z.number().int().nonnegative(),
      }).optional(),
      currentAwards: z.object({
        highestAward: z.enum([
          "Chief Scout's Commendation for Good Service",
          "Award for Merit",
          "Bar to the Award for Merit",
          "Silver Acorn",
          "Bar to the Silver Acorn",
          "Silver Wolf",
          "none",
        ]),
      }).optional(),
      criminalRecordCheck: z.boolean().optional(),
      mandatoryLearning: z.boolean().optional(),
      personalStory: z.object({
        motivation: z.string(),
        characterTraits: z.string().optional(),
        definingMoments: z.string().optional(),
      }).optional(),
      lineManagers: z.object({
        confirmed: z.boolean(),
        input: z.array(z.object({
          name: z.string(),
          quote: z.string(),
          observation: z.string(),
          example: z.string(),
        })).optional(),
      }).optional(),
    }).default({}),
  },
  async (params) => {
    try {
      const result = resolveNextStep(params.state);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: JSON.stringify({ error: true, message: "Unexpected error during workflow step resolution" }) }],
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
