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
