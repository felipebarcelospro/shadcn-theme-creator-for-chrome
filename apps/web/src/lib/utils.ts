/**
 * Formats a date string into a localized, human-readable format.
 * 
 * @param {string} dateString - The date string to format (e.g., ISO 8601 format).
 * @returns {string} The formatted date string in the format "Month Day, Year" (e.g., "January 1, 2023").
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
