import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a URL-friendly slug from a string (typically a tour title)
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '');
}

/**
 * Generates a tour details URL using the tour's slug
 * @param tourTitle - The tour title to convert to a slug
 * @returns The tour details URL with slug
 */
export function generateTourDetailsUrl(tourTitle: string): string {
  const slug = generateSlug(tourTitle);
  return `/tour-details/${slug}`;
}

/**
 * Generates a sign-up URL using the tour's slug
 * @param tourTitle - The tour title to convert to a slug
 * @returns The sign-up URL with slug
 */
export function generateSignUpUrl(tourTitle: string): string {
  const slug = generateSlug(tourTitle);
  return `/sign-up/${slug}`;
}

const MONTH_MAP: Record<string, number> = {
  JANUARY: 0, FEBRUARY: 1, MARCH: 2, APRIL: 3, MAY: 4, JUNE: 5,
  JULY: 6, AUGUST: 7, SEPTEMBER: 8, OCTOBER: 9, NOVEMBER: 10, DECEMBER: 11,
};

const SEASON_MAP: Record<string, number> = {
  SPRING: 2,   // March
  SUMMER: 5,   // June
  FALL: 8,     // September
  AUTUMN: 8,   // September
  WINTER: 11,  // December
};

/**
 * Checks if a tour date string refers to a future date (i.e. the tour is "incoming").
 * Handles formats like "OCTOBER 2025", "FALL 2026", "1 - 8 OCTOBER 2025",
 * "31 MARCH - 10 APRIL 2026", "JULY 4", etc.
 * Extracts the last month+year or season+year found in the string.
 */
export function isTourIncoming(dateStr: string | undefined): boolean {
  if (!dateStr) return false;

  const upper = dateStr.toUpperCase();
  const now = new Date();

  // Try to find a 4-digit year
  const yearMatch = upper.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : null;

  if (!year) return false;

  // Try season match first (FALL 2026, SPRING 2026, etc.)
  for (const [season, month] of Object.entries(SEASON_MAP)) {
    if (upper.includes(season)) {
      // Compare end of that season's starting month
      const seasonDate = new Date(year, month + 1, 0); // last day of the month
      return seasonDate >= now;
    }
  }

  // Find all month names in the string, use the last one (e.g. "31 MARCH - 10 APRIL 2026" → APRIL)
  let lastMonth: number | null = null;
  for (const [name, idx] of Object.entries(MONTH_MAP)) {
    if (upper.includes(name)) {
      lastMonth = idx;
    }
  }

  if (lastMonth !== null) {
    const tourEndOfMonth = new Date(year, lastMonth + 1, 0); // last day of that month
    return tourEndOfMonth >= now;
  }

  return false;
}
