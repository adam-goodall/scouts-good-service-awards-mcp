import { describe, it, expect } from "vitest";
import {
  getNextDeadline,
  getAllDeadlines,
  getProcessingTimeline,
  DRAFT_EXPIRY_WARNING,
} from "./deadlines.js";

describe("getNextDeadline", () => {
  it("returns Q1 deadline when date is in January", () => {
    const result = getNextDeadline(new Date(2025, 0, 15)); // 15 Jan 2025
    expect(result).toEqual({
      date: "2025-03-31",
      quarter: 1,
      label: "Q1 – 31 March",
    });
  });

  it("returns Q2 deadline when date is in April", () => {
    const result = getNextDeadline(new Date(2025, 3, 1)); // 1 Apr 2025
    expect(result).toEqual({
      date: "2025-06-30",
      quarter: 2,
      label: "Q2 – 30 June",
    });
  });

  it("returns Q3 deadline when date is in July", () => {
    const result = getNextDeadline(new Date(2025, 6, 10)); // 10 Jul 2025
    expect(result).toEqual({
      date: "2025-09-30",
      quarter: 3,
      label: "Q3 – 30 September",
    });
  });

  it("returns Q4 deadline when date is in October", () => {
    const result = getNextDeadline(new Date(2025, 9, 5)); // 5 Oct 2025
    expect(result).toEqual({
      date: "2025-12-31",
      quarter: 4,
      label: "Q4 – 31 December",
    });
  });

  it("returns the same deadline when date IS the deadline", () => {
    const result = getNextDeadline(new Date(2025, 2, 31)); // 31 Mar 2025
    expect(result).toEqual({
      date: "2025-03-31",
      quarter: 1,
      label: "Q1 – 31 March",
    });
  });

  it("returns Q1 of next year when past all deadlines", () => {
    const result = getNextDeadline(new Date(2025, 11, 32)); // 1 Jan 2026 (overflow)
    expect(result.date).toBe("2026-03-31");
    expect(result.quarter).toBe(1);
  });
});

describe("getAllDeadlines", () => {
  it("returns exactly four deadlines", () => {
    const deadlines = getAllDeadlines();
    expect(deadlines).toHaveLength(4);
  });

  it("returns deadlines in quarter order", () => {
    const deadlines = getAllDeadlines();
    expect(deadlines.map((d) => d.quarter)).toEqual([1, 2, 3, 4]);
  });

  it("returns correct dates for the current year", () => {
    const year = new Date().getFullYear();
    const deadlines = getAllDeadlines();
    expect(deadlines[0].date).toBe(`${year}-03-31`);
    expect(deadlines[1].date).toBe(`${year}-06-30`);
    expect(deadlines[2].date).toBe(`${year}-09-30`);
    expect(deadlines[3].date).toBe(`${year}-12-31`);
  });
});

describe("getProcessingTimeline", () => {
  it("returns correct timeline for Q1 deadline", () => {
    const deadline = new Date(2025, 2, 31); // 31 Mar 2025
    const timeline = getProcessingTimeline(deadline);
    expect(timeline.awardsDispatched).toBe("2025-05-31");
    expect(timeline.congratulatoryLetters).toBe("2025-06-30"); // Jun has 30 days, clamped from 31
    expect(timeline.compassUpload).toBe("2025-07-31");
  });

  it("returns correct timeline for Q2 deadline", () => {
    const deadline = new Date(2025, 5, 30); // 30 Jun 2025
    const timeline = getProcessingTimeline(deadline);
    expect(timeline.awardsDispatched).toBe("2025-08-30");
    expect(timeline.congratulatoryLetters).toBe("2025-09-30");
    expect(timeline.compassUpload).toBe("2025-10-30");
  });

  it("returns correct timeline for Q4 deadline", () => {
    const deadline = new Date(2025, 11, 31); // 31 Dec 2025
    const timeline = getProcessingTimeline(deadline);
    expect(timeline.awardsDispatched).toBe("2026-02-28"); // Feb 2026 has 28 days, clamped from 31
    expect(timeline.congratulatoryLetters).toBe("2026-03-31");
    expect(timeline.compassUpload).toBe("2026-04-30"); // Apr has 30 days, clamped from 31
  });
});

describe("DRAFT_EXPIRY_WARNING", () => {
  it("mentions 3 months", () => {
    expect(DRAFT_EXPIRY_WARNING).toContain("3 months");
  });

  it("mentions Draft status", () => {
    expect(DRAFT_EXPIRY_WARNING).toContain("Draft");
  });

  it("mentions Under review – Locally status", () => {
    expect(DRAFT_EXPIRY_WARNING).toContain("Under review – Locally");
  });

  it("mentions automatic rejection", () => {
    expect(DRAFT_EXPIRY_WARNING).toContain("automatically rejected");
  });
});
