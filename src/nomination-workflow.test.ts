import { describe, it, expect } from "vitest";
import { resolveNextStep } from "./nomination-workflow.js";
import type {
  WorkflowState,
  StepResponse,
  ResultResponse,
  ErrorResponse,
} from "./types.js";

const baseEligibleState: WorkflowState = {
  membershipNumber: "12345",
  nomineeName: "John Smith",
  currentRoles: { hasNonProvisionalRole: true, totalRoles: 2 },
  historicRoles: { earliestStartDate: "2010-01-01", totalServiceYears: 12 },
  currentAwards: { highestAward: "none" },
  criminalRecordCheck: true,
  mandatoryLearning: true,
};

describe("resolveNextStep", () => {
  describe("empty state returns membership_number step", () => {
    it("returns membership_number step for empty state", () => {
      const result = resolveNextStep({});
      expect(result).toMatchObject({ step: "membership_number" });
    });

    it("returns membership_number step for undefined fields", () => {
      const result = resolveNextStep({
        membershipNumber: undefined,
      } as WorkflowState);
      expect(result).toMatchObject({ step: "membership_number" });
    });
  });

  describe("step transitions with minimal valid state", () => {
    it("membershipNumber → nominee_name", () => {
      const result = resolveNextStep({ membershipNumber: "12345" });
      expect(result).toMatchObject({ step: "nominee_name" });
    });

    it("membershipNumber + nomineeName → current_roles", () => {
      const result = resolveNextStep({
        membershipNumber: "12345",
        nomineeName: "John Smith",
      });
      expect(result).toMatchObject({ step: "current_roles" });
    });

    it("+ currentRoles → historic_roles", () => {
      const result = resolveNextStep({
        membershipNumber: "12345",
        nomineeName: "John Smith",
        currentRoles: { hasNonProvisionalRole: true, totalRoles: 1 },
      });
      expect(result).toMatchObject({ step: "historic_roles" });
    });

    it("+ historicRoles → current_awards", () => {
      const result = resolveNextStep({
        membershipNumber: "12345",
        nomineeName: "John Smith",
        currentRoles: { hasNonProvisionalRole: true, totalRoles: 1 },
        historicRoles: { earliestStartDate: "2015-01-01", totalServiceYears: 8 },
      });
      expect(result).toMatchObject({ step: "current_awards" });
    });

    it("+ currentAwards → criminal_record_check", () => {
      const result = resolveNextStep({
        membershipNumber: "12345",
        nomineeName: "John Smith",
        currentRoles: { hasNonProvisionalRole: true, totalRoles: 1 },
        historicRoles: { earliestStartDate: "2015-01-01", totalServiceYears: 8 },
        currentAwards: { highestAward: "none" },
      });
      expect(result).toMatchObject({ step: "criminal_record_check" });
    });

    it("+ criminalRecordCheck → mandatory_learning", () => {
      const result = resolveNextStep({
        membershipNumber: "12345",
        nomineeName: "John Smith",
        currentRoles: { hasNonProvisionalRole: true, totalRoles: 1 },
        historicRoles: { earliestStartDate: "2015-01-01", totalServiceYears: 8 },
        currentAwards: { highestAward: "none" },
        criminalRecordCheck: true,
      });
      expect(result).toMatchObject({ step: "mandatory_learning" });
    });

    it("+ mandatoryLearning → eligibility_result", () => {
      const result = resolveNextStep(baseEligibleState);
      expect(result).toMatchObject({ step: "eligibility_result" });
    });
  });

  describe("response content includes expected prompts and navigation instructions", () => {
    it("current_roles step includes navigation path", () => {
      const result = resolveNextStep({
        membershipNumber: "12345",
        nomineeName: "John Smith",
      }) as StepResponse;
      expect(result.instructions).toContain("Member record");
      expect(result.instructions).toContain("Roles tab");
    });

    it("historic_roles step includes navigation instructions", () => {
      const result = resolveNextStep({
        membershipNumber: "12345",
        nomineeName: "John Smith",
        currentRoles: { hasNonProvisionalRole: true, totalRoles: 1 },
      }) as StepResponse;
      expect(result.instructions).toContain("Historic roles");
      expect(result.instructions).toContain("start/end dates");
    });

    it("current_awards step includes navigation instructions", () => {
      const result = resolveNextStep({
        membershipNumber: "12345",
        nomineeName: "John Smith",
        currentRoles: { hasNonProvisionalRole: true, totalRoles: 1 },
        historicRoles: { earliestStartDate: "2015-01-01", totalServiceYears: 8 },
      }) as StepResponse;
      expect(result.instructions).toContain("Awards tab");
    });

    it("step responses include field and nextStep", () => {
      const result = resolveNextStep({}) as StepResponse;
      expect(result.field).toBe("membershipNumber");
      expect(result.nextStep).toBe("nominee_name");
    });
  });

  describe("whitespace-only values do not advance the step", () => {
    it("whitespace-only membershipNumber returns membership_number step", () => {
      const result = resolveNextStep({ membershipNumber: "   " });
      expect(result).toMatchObject({ step: "membership_number" });
    });

    it("whitespace-only nomineeName returns nominee_name step", () => {
      const result = resolveNextStep({
        membershipNumber: "12345",
        nomineeName: "  ",
      });
      expect(result).toMatchObject({ step: "nominee_name" });
    });

    it("tabs and newlines in membershipNumber returns membership_number step", () => {
      const result = resolveNextStep({ membershipNumber: "\t\n" });
      expect(result).toMatchObject({ step: "membership_number" });
    });
  });

  describe("nomineeName length validation (2–100 chars)", () => {
    it("single character name does not advance", () => {
      const result = resolveNextStep({
        membershipNumber: "12345",
        nomineeName: "A",
      });
      expect(result).toMatchObject({ step: "nominee_name" });
    });

    it("101-character name does not advance", () => {
      const result = resolveNextStep({
        membershipNumber: "12345",
        nomineeName: "A".repeat(101),
      });
      expect(result).toMatchObject({ step: "nominee_name" });
    });

    it("2-character name advances to current_roles", () => {
      const result = resolveNextStep({
        membershipNumber: "12345",
        nomineeName: "Jo",
      });
      expect(result).toMatchObject({ step: "current_roles" });
    });

    it("100-character name advances to current_roles", () => {
      const result = resolveNextStep({
        membershipNumber: "12345",
        nomineeName: "A".repeat(100),
      });
      expect(result).toMatchObject({ step: "current_roles" });
    });
  });

  describe("eligibility assessment shape", () => {
    it("returns correct shape for eligible nominee", () => {
      const result = resolveNextStep(baseEligibleState) as ResultResponse;
      expect(result.step).toBe("eligibility_result");
      expect(result.assessment).toBeDefined();
      expect(result.assessment!.eligible).toBe(true);
      expect(result.assessment!.hasValidAppointment).toBe(true);
      expect(result.assessment!.totalServiceYears).toBe(12);
      expect(result.assessment!.highestCurrentAward).toBe("none");
      expect(result.assessment!.nextAwardInProgression).toBeDefined();
    });

    it("eligible assessment has no unmetCriteria", () => {
      const result = resolveNextStep(baseEligibleState) as ResultResponse;
      expect(result.assessment!.unmetCriteria).toBeUndefined();
    });

    it("returns correct shape for ineligible nominee (no valid appointment)", () => {
      const result = resolveNextStep({
        ...baseEligibleState,
        currentRoles: { hasNonProvisionalRole: false, totalRoles: 1 },
      }) as ResultResponse;
      expect(result.step).toBe("eligibility_result");
      expect(result.assessment!.eligible).toBe(false);
      expect(result.assessment!.hasValidAppointment).toBe(false);
    });

    it("returns correct shape for ineligible nominee (insufficient service years)", () => {
      const result = resolveNextStep({
        ...baseEligibleState,
        historicRoles: { earliestStartDate: "2023-01-01", totalServiceYears: 2 },
      }) as ResultResponse;
      expect(result.step).toBe("eligibility_result");
      expect(result.assessment!.eligible).toBe(false);
    });
  });

  describe("line manager confirmation blocking", () => {
    it("unconfirmed line managers returns line_managers step", () => {
      const result = resolveNextStep({
        ...baseEligibleState,
        personalStory: { motivation: "Loves Scouting" },
        lineManagers: { confirmed: false },
      });
      expect(result).toMatchObject({ step: "line_managers" });
    });

    it("confirmed line managers without input returns line_manager_input step", () => {
      const result = resolveNextStep({
        ...baseEligibleState,
        personalStory: { motivation: "Loves Scouting" },
        lineManagers: { confirmed: true },
      });
      expect(result).toMatchObject({ step: "line_manager_input" });
    });

    it("confirmed line managers with empty input array returns line_manager_input step", () => {
      const result = resolveNextStep({
        ...baseEligibleState,
        personalStory: { motivation: "Loves Scouting" },
        lineManagers: { confirmed: true, input: [] },
      });
      expect(result).toMatchObject({ step: "line_manager_input" });
    });
  });

  describe("summary includes all 7 sections and 3 tool references", () => {
    const fullState: WorkflowState = {
      ...baseEligibleState,
      personalStory: { motivation: "Loves Scouting", characterTraits: "Reliable and dedicated" },
      lineManagers: {
        confirmed: true,
        input: [
          {
            name: "Jane Doe",
            quote: "Excellent volunteer",
            observation: "Always goes above and beyond",
            example: "Organised district camp for 200 young people",
          },
        ],
      },
    };

    it("returns summary step", () => {
      const result = resolveNextStep(fullState) as ResultResponse;
      expect(result.step).toBe("summary");
    });

    it("summary has exactly 7 sections", () => {
      const result = resolveNextStep(fullState) as ResultResponse;
      expect(result.summary!.sections).toHaveLength(7);
    });

    it("summary sections cover all nomination form fields", () => {
      const result = resolveNextStep(fullState) as ResultResponse;
      const sectionNames = result.summary!.sections.map((s) => s.section);
      expect(sectionNames).toContain("Main Role");
      expect(sectionNames).toContain("Additional Service");
      expect(sectionNames).toContain("Key Achievements");
      expect(sectionNames).toContain("Level of Service");
      expect(sectionNames).toContain("Community Involvement");
      expect(sectionNames).toContain("Other Information");
      expect(sectionNames).toContain("Citation");
    });

    it("summary has exactly 3 available tools", () => {
      const result = resolveNextStep(fullState) as ResultResponse;
      expect(result.summary!.availableTools).toHaveLength(3);
    });

    it("summary references correct tool names", () => {
      const result = resolveNextStep(fullState) as ResultResponse;
      const toolNames = result.summary!.availableTools.map((t) => t.name);
      expect(toolNames).toContain("get_nomination_guidance");
      expect(toolNames).toContain("get_sample_citations");
      expect(toolNames).toContain("get_writing_tips");
    });
  });

  describe("error response for invalid state", () => {
    it("negative totalRoles returns error response", () => {
      const result = resolveNextStep({
        membershipNumber: "12345",
        nomineeName: "John Smith",
        currentRoles: { hasNonProvisionalRole: true, totalRoles: -1 },
      }) as ErrorResponse;
      expect(result.error).toBe(true);
      expect(result.message).toBeDefined();
      expect(result.invalidFields).toContain("currentRoles.totalRoles");
    });

    it("negative totalServiceYears returns error response", () => {
      const result = resolveNextStep({
        membershipNumber: "12345",
        nomineeName: "John Smith",
        currentRoles: { hasNonProvisionalRole: true, totalRoles: 1 },
        historicRoles: { earliestStartDate: "2020-01-01", totalServiceYears: -5 },
      }) as ErrorResponse;
      expect(result.error).toBe(true);
      expect(result.message).toBeDefined();
      expect(result.invalidFields).toContain("historicRoles.totalServiceYears");
    });
  });
});
