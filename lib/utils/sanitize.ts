/**
 * Input Sanitization Utilities
 *
 * Utilities voor het sanitizen van user input ter bescherming tegen XSS attacks.
 * Volgt OWASP best practices voor input validation en sanitization.
 */

import { SECURITY } from '@/lib/config/constants'

/**
 * HTML entities die ge-escaped moeten worden
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
}

/**
 * Escape HTML entities in een string
 *
 * @param str - Input string
 * @returns Escaped string
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"'/]/g, (char) => HTML_ENTITIES[char] || char)
}

/**
 * Strip alle HTML tags uit een string
 *
 * @param str - Input string
 * @returns String zonder HTML tags
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}

/**
 * Sanitize een string voor veilige weergave
 *
 * @param str - Input string
 * @param options - Sanitization opties
 * @returns Gesanitizeerde string
 */
export function sanitizeString(
  str: string,
  options: {
    maxLength?: number
    stripHtml?: boolean
    trim?: boolean
  } = {}
): string {
  const { maxLength = SECURITY.MAX_INPUT_LENGTH, stripHtml: strip = true, trim = true } = options

  let sanitized = str

  // Trim whitespace
  if (trim) {
    sanitized = sanitized.trim()
  }

  // Strip HTML tags
  if (strip) {
    sanitized = stripHtml(sanitized)
  }

  // Escape HTML entities
  sanitized = escapeHtml(sanitized)

  // Truncate to max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength)
  }

  return sanitized
}

/**
 * Sanitize een URL
 *
 * @param url - Input URL
 * @returns Gesanitizeerde URL of null als invalid
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const trimmed = url.trim()

    // Reject javascript: protocol (XSS vector)
    if (trimmed.toLowerCase().startsWith('javascript:')) {
      return null
    }

    // Reject data: protocol (XSS vector)
    if (trimmed.toLowerCase().startsWith('data:')) {
      return null
    }

    // Alleen http(s) en mailto toestaan
    const urlObj = new URL(trimmed)
    if (!['http:', 'https:', 'mailto:'].includes(urlObj.protocol)) {
      return null
    }

    return urlObj.toString()
  } catch {
    return null
  }
}

/**
 * Sanitize een email address
 *
 * @param email - Input email
 * @returns Gesanitizeerde email of null als invalid
 */
export function sanitizeEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase()

  // Basic email validation pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(trimmed)) {
    return null
  }

  return escapeHtml(trimmed)
}

/**
 * Sanitize een phone number
 *
 * @param phone - Input phone number
 * @returns Gesanitizeerd phone number
 */
export function sanitizePhone(phone: string): string {
  // Remove alle karakters behalve cijfers, +, - en spaties
  return phone.replace(/[^0-9\-+ ]/g, '').trim()
}

/**
 * Sanitize een nummer input
 *
 * @param value - Input value (string of number)
 * @param options - Opties voor min/max
 * @returns Gesanitizeerd nummer of null als invalid
 */
export function sanitizeNumber(
  value: string | number,
  options: { min?: number; max?: number; decimals?: number } = {}
): number | null {
  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num) || !isFinite(num)) {
    return null
  }

  // Check min/max bounds
  if (options.min !== undefined && num < options.min) {
    return options.min
  }
  if (options.max !== undefined && num > options.max) {
    return options.max
  }

  // Round to specified decimals
  if (options.decimals !== undefined) {
    return Math.round(num * Math.pow(10, options.decimals)) / Math.pow(10, options.decimals)
  }

  return num
}

/**
 * Sanitize een object recursively
 *
 * @param obj - Input object
 * @returns Gesanitizeerd object
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else if (typeof value === 'number') {
      sanitized[key] = sanitizeNumber(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'object' && item !== null ? sanitizeObject(item as Record<string, unknown>) : item
      )
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized as T
}

/**
 * Validate en sanitize form data
 *
 * @param data - Form data
 * @returns Gesanitizeerde form data
 */
export function sanitizeFormData<T extends Record<string, unknown>>(data: T): T {
  return sanitizeObject(data)
}

/**
 * Check of een string potentieel gevaarlijke content bevat
 *
 * @param str - Input string
 * @returns true als potentieel gevaarlijk
 */
export function containsDangerousContent(str: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // event handlers zoals onclick=
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /data:text\/html/i,
  ]

  return dangerousPatterns.some((pattern) => pattern.test(str))
}

/**
 * Sanitize een textarea waarde (behoudt newlines)
 *
 * @param str - Input string
 * @returns Gesanitizeerde string met behoud van newlines
 */
export function sanitizeTextarea(str: string): string {
  // Escape HTML maar behoud newlines
  return escapeHtml(str.trim())
}
