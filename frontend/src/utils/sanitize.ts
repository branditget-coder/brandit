/**
 * Lightweight, zero-dependency HTML sanitizer for rendering trusted preview content.
 * Neutralizes XSS vectors (<script>, <iframe>, <object>, <embed>, event handlers, javascript: URIs).
 */
export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return ''

  // Remove script, iframe, object, embed, form tags and their contents
  let clean = rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')

  // Remove inline JavaScript event handlers (e.g. onload=, onerror=, onclick=)
  clean = clean.replace(/ on\w+\s*=\s*["'][^"']*["']/gi, '')
  clean = clean.replace(/ on\w+\s*=\s*[^ >]+/gi, '')

  // Neutralize javascript: pseudoprotocol URLs in href/src
  clean = clean.replace(/(href|src)\s*=\s*["']\s*javascript:[^"']*["']/gi, '$1="#"')
  clean = clean.replace(/(href|src)\s*=\s*javascript:[^ >]+/gi, '$1="#"')

  return clean
}

export default sanitizeHtml
