// Feature: good-service-awards-mcp, Property 9: Next deadline correctness
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { getNextDeadline } from "./deadlines.js";

/**
 * **Validates: Requirements 4.2**
 *
 * Property 9: Next deadline correctness
 * For any date, the returned next deadline SHALL be a valid quarterly deadline
 * (31 March, 30 June, 30 September, or 31 December) that falls on or after
 * the given date, and no other quarterly deadline SHALL fall between the given
 * date and the returned deadline.
 */

/** All valid quarterly deadlines as (month, day) pairs (month is 0-indexed). */
const QUARTERLY_DEADLINES = [
  { month: 2, day: 31 }, // 31 March
  { month: 5, day: 30 }, // 30 June
  { month: 8, day: 30 }, // 30 September
  { month: 11, day: 31 }, // 31 December
];

function isValidQuarterlyDate(isoDate: string): boolean {
  const [yearStr, monthStr, dayStr] = isoDate.split("-");
  const month = parseInt(monthStr, 10) - 1; // convert to 0-indexed
  const day = parseInt(dayStr, 10);
  return QUARTERLY_DEADLINES.some((q) => q.month === month && q.day === day);
}

function getAllQuarterlyDatesInRange(from: Date, to: Date): Date[] {
  const results: Date[] = [];
  const startYear = from.getFullYear();
  const endYear = to.getFullYear();

  for (let year = startYear; year <= endYear; year++) {
    for (const q of QUARTERLY_DEADLINES) {
      const d = new Date(year, q.month, q.day);
      if (d >= from && d < to) {
        results.push(d);
      }
    }
  }
  return results;
}

describe("Property 9: Next deadline correctness", () => {
  it("returned deadline is a valid quarterly date, on or after the input, with no closer deadline between", () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date(2000, 0, 1), max: new Date(2100, 11, 31) }),
        (inputDate) => {
          const result = getNextDeadline(inputDate);

          // 1. The returned deadline is a valid quarterly date
          expect(isValidQuarterlyDate(result.date)).toBe(true);

          // 2. The returned deadline is on or after the input date
          const [yearStr, monthStr, dayStr] = result.date.split("-");
          const deadlineDate = new Date(
            parseInt(yearStr, 10),
            parseInt(monthStr, 10) - 1,
            parseInt(dayStr, 10),
          );
          expect(deadlineDate >= inputDate).toBe(true);

          // 3. No other quarterly deadline falls between the input date and the returned deadline
          const betweenDates = getAllQuarterlyDatesInRange(inputDate, deadlineDate);
          expect(betweenDates.length).toBe(0);
        },
      ),
      { numRuns: 100 },
    );
  });
});
