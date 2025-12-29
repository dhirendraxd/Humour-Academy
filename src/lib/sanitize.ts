import DOMPurify from "dompurify";

/**
 * Sanitize an HTML string for safe rendering in the browser.
 * Use this to wrap any content passed into `dangerouslySetInnerHTML`.
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["script", "style"],
    FORBID_ATTR: ["onerror", "onclick", "onload", "style"],
  });
}

/**
 * Strip all HTML tags, returning plain text.
 */
export function stripHTML(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
