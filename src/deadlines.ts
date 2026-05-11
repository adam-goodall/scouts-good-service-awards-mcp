import type { Deadline, ProcessingTimeline } from "./types.js";

/**
 * Warning message about draft nomination expiry.
 * Requirement 4.3: Draft nominations with 'Draft' or 'Under review – Locally' status
 * not modified within 3 months may be automatically rejected.
 */
export const DRAFT_EXPIRY_WARNING =
  "Draft nominations with 'Draft' or 'Under review – Locally' status that have not been modified within 3 months may be automatically rejected.";

/** The four quarterly deadlines as month (0-indexed) and day pairs. */
const QUARTERLY_DEADLINES: { month: number; day: number; quarter: 1 | 2 | 3 | 4; label: string }[] = [
  { month: 2, day: 31, quarter: 1, label: "Q1 – 31 March" },
  { month: 5, day: 30, quarter: 2, label: "Q2 – 30 June" },
  { month: 8, day: 30, quarter: 3, label: "Q3 – 30 September" },
  { month: 11, day: 31, quarter: 4, label: "Q4 – 31 December" },
];

function toISODate(year: number, month: number, day: number): string {
  const y = String(year).padStart(4, "0");
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Returns the next quarterly deadline on or after the given date.
 */
export function getNextDeadline(currentDate: Date): Deadline {
  const year = currentDate.getFullYear();

  for (const q of QUARTERLY_DEADLINES) {
    const deadlineDate = new Date(year, q.month, q.day);
    if (deadlineDate >= currentDate) {
      return {
        date: toISODate(year, q.month, q.day),
        quarter: q.quarter,
        label: q.label,
      };
    }
  }

  // If past all deadlines this year, return Q1 of next year
  const next = QUARTERLY_DEADLINES[0];
  return {
    date: toISODate(year + 1, next.month, next.day),
    quarter: next.quarter,
    label: next.label,
  };
}

/**
 * Returns all four quarterly deadlines for the current year.
 */
export function getAllDeadlines(): Deadline[] {
  const year = new Date().getFullYear();
  return QUARTERLY_DEADLINES.map((q) => ({
    date: toISODate(year, q.month, q.day),
    quarter: q.quarter,
    label: q.label,
  }));
}

/**
 * Returns the post-deadline processing timeline.
 * - Awards dispatched: within 2 months of deadline
 * - Congratulatory letters: within 3 months of deadline
 * - Compass upload: within 4 months of deadline
 */
export function getProcessingTimeline(deadline: Date): ProcessingTimeline {
  const addMonths = (date: Date, months: number): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + months;
    const day = date.getDate();
    // Create the date — JS Date handles month overflow (e.g. month 14 → Feb next year)
    // but we need to clamp the day to the last day of the target month
    const target = new Date(year, month, 1);
    const lastDayOfMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    const clampedDay = Math.min(day, lastDayOfMonth);
    return toISODate(target.getFullYear(), target.getMonth(), clampedDay);
  };

  return {
    awardsDispatched: addMonths(deadline, 2),
    congratulatoryLetters: addMonths(deadline, 3),
    compassUpload: addMonths(deadline, 4),
  };
}
