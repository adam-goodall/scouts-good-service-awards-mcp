import type { AwardName, WritingTips } from "./types.js";

export const GENERAL_TIPS: string[] = [
  "Tell a human story — paint a portrait of the nominee as a person, not a list of roles and dates. The reader should feel they know this individual by the end.",
  "Quantify impact wherever possible — use specific figures (e.g., 'trained 45 leaders', 'supported 200 young people annually', 'ran 12 camps over 8 years') to make achievements concrete and credible.",
  "Give community involvement real weight — this section demonstrates impact beyond Scouting and is often underdeveloped. Show how the nominee's Scouting skills and values have benefited the wider community.",
  "Frame level of service as a progression — show how the nominee's contribution has grown, deepened, or been sustained over time rather than simply restating what they do now.",
  "Keep the citation brief and impactful — it is read aloud at the presentation ceremony and must be no more than 300 characters. Distil the essence of why this person deserves recognition into a single compelling sentence.",
];

export const COMMON_MISTAKES: string[] = [
  "Writing like a CV — listing roles, dates, and job titles without conveying the human impact or personal qualities that make the nominee exceptional.",
  "Leaving community involvement empty or vague — this section is required and should contain specific examples of how the nominee has contributed beyond Scouting (e.g., charity work, school governance, community events).",
  "Inconsistent quantification — using precise figures in one section but vague language in another undermines credibility. If you quantify in Key Achievements, maintain that standard throughout.",
];

export const TESTIMONIAL_GUIDANCE: string[] = [
  "Weave quotes into the narrative rather than listing them — a testimonial should support a specific point you are making, not stand alone as a disconnected endorsement.",
  "Use quotes to evidence personal qualities — a quote from a young person saying 'she always made me feel I could do anything' is more powerful than the nominator asserting 'she is encouraging'.",
  "Attribute quotes briefly — 'As one parent noted...' or 'A fellow leader observed...' is sufficient. Full names are not needed.",
];

export const AWARD_SPECIFIC_TIPS: Record<AwardName, string[]> = {
  "Chief Scout's Commendation for Good Service": [
    "Focus on the quality of 5+ years of service rather than length alone — what has the nominee done that goes above and beyond their role?",
    "Highlight specific examples of initiative or dedication that distinguish this person from others in similar roles.",
    "This is often a first nomination — ensure the form tells a complete story even if the service period is relatively short.",
  ],
  "Award for Merit": [
    "Demonstrate sustained outstanding service over 10+ years — show consistency and dedication, not just a single peak of activity.",
    "Show breadth of contribution across different areas of Scouting (e.g., programme delivery, training, governance, events).",
    "Include evidence of how the nominee has developed others — mentoring, training, or inspiring new leaders.",
  ],
  "Bar to the Award for Merit": [
    "Clearly demonstrate what has changed or grown since the Award for Merit was received — the nomination must show continued or increased contribution, not simply more of the same.",
    "Highlight new roles, responsibilities, or initiatives taken on since the previous award.",
    "Show that the nominee's influence has expanded — perhaps from local to county level, or from delivery to strategic leadership.",
  ],
  "Silver Acorn": [
    "This is a higher award requiring evidence of especially distinguished service — the nomination should convey exceptional and sustained impact.",
    "Demonstrate influence beyond the nominee's immediate unit or district — show county-level, regional, or national contribution.",
    "Include evidence of lasting legacy — programmes established, leaders developed, or systemic improvements made.",
    "The narrative should make clear why this person's contribution stands out from others with similar length of service.",
  ],
  "Bar to the Silver Acorn": [
    "Show significant continued or increased contribution since the Silver Acorn was awarded — the bar recognises that service has not plateaued.",
    "Demonstrate new areas of impact or deepened influence since the previous award.",
    "Evidence should show the nominee continues to go above and beyond despite already being highly recognised.",
  ],
  "Silver Wolf": [
    "This is the highest award for 'service of a most exceptional nature' — the nomination must convey truly extraordinary and sustained contribution.",
    "Demonstrate clear progression beyond Silver Acorn — what has the nominee achieved or contributed that elevates them above that already exceptional level?",
    "Show breadth and depth of impact across multiple levels of Scouting (local, county, national) and over a sustained period.",
    "Include evidence of transformational impact — how has Scouting been materially different because of this person?",
    "The narrative should leave no doubt that this is one of the most outstanding contributors in their generation.",
  ],
};

export function getWritingTips(awardName?: AwardName): WritingTips {
  return {
    generalTips: GENERAL_TIPS,
    commonMistakes: COMMON_MISTAKES,
    testimonialGuidance: TESTIMONIAL_GUIDANCE,
    awardSpecificTips: awardName ? AWARD_SPECIFIC_TIPS[awardName] : undefined,
  };
}
