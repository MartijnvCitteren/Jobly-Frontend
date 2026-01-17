/**
 * Environment Configuration
 *
 * Type-safe environment variable access met runtime validatie.
 * Alle environment variables worden hier gecentraliseerd en gevalideerd.
 *
 * Ondersteunt runtime configuratie via window.__RUNTIME_CONFIG__ voor Docker deployments.
 */

/**
 * Runtime configuratie interface (geladen vanuit window object)
 */
interface RuntimeConfig {
  API_BASE_URL?: string
}

/**
 * Extend Window interface voor runtime config
 */
declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig
  }
}

/**
 * Environment variable schema
 */
interface EnvConfig {
  API_URL: string
  NODE_ENV: 'development' | 'production' | 'test'
  IS_DEVELOPMENT: boolean
  IS_PRODUCTION: boolean
  IS_TEST: boolean
}

/**
 * Haal runtime configuratie op vanuit window object (alleen in browser)
 */
function getRuntimeConfig(): RuntimeConfig {
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) {
    return window.__RUNTIME_CONFIG__
  }
  return {}
}

/**
 * Valideer API URL format
 */
function validateApiUrl(url: string): string {
  try {
    // Check if it's a valid URL format
    if (url.startsWith('http://') || url.startsWith('https://')) {
      new URL(url)
      return url
    }

    // Als het niet met http(s) begint, accepteer het als localhost URL
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      return url
    }

    throw new Error('Invalid URL format')
  } catch (error) {
    throw new Error(
      `Invalid API_URL: ${url}. Must be a valid HTTP(S) URL. ` +
      `Example: http://localhost:8090/api/v1`
    )
  }
}

/**
 * Get en valideer node environment
 */
function getNodeEnv(): 'development' | 'production' | 'test' {
  const env = process.env.NODE_ENV || 'development'

  if (env !== 'development' && env !== 'production' && env !== 'test') {
    console.warn(`Invalid NODE_ENV: ${env}. Defaulting to 'development'`)
    return 'development'
  }

  return env
}

/**
 * Parse en valideer alle environment variables
 *
 * Prioriteit voor API URL:
 * 1. Runtime config (window.__RUNTIME_CONFIG__.API_BASE_URL) - voor Docker
 * 2. Build-time env var (NEXT_PUBLIC_API_URL) - voor development
 * 3. Fallback naar localhost
 */
function parseEnv(): EnvConfig {
  const nodeEnv = getNodeEnv()

  // Haal runtime config op (alleen in browser)
  const runtimeConfig = getRuntimeConfig()

  // Bepaal API base URL met prioriteit
  let apiBaseUrl: string

  if (runtimeConfig.API_BASE_URL && runtimeConfig.API_BASE_URL !== '__API_BASE_URL__') {
    // Runtime config heeft prioriteit (Docker deployment)
    apiBaseUrl = runtimeConfig.API_BASE_URL
  } else if (process.env.NEXT_PUBLIC_API_URL) {
    // Build-time environment variable (development)
    apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
  } else {
    // Fallback voor local development
    apiBaseUrl = 'http://localhost:8090'
  }

  // Voeg /api/v1 toe als het er niet al is
  let apiUrl = apiBaseUrl
  if (!apiUrl.endsWith('/api/v1')) {
    apiUrl = `${apiUrl.replace(/\/$/, '')}/api/v1`
  }

  // Valideer de uiteindelijke API URL
  const validatedApiUrl = validateApiUrl(apiUrl)

  return {
    API_URL: validatedApiUrl,
    NODE_ENV: nodeEnv,
    IS_DEVELOPMENT: nodeEnv === 'development',
    IS_PRODUCTION: nodeEnv === 'production',
    IS_TEST: nodeEnv === 'test',
  }
}

/**
 * Gevalideerde environment configuratie
 *
 * Gebruik dit object overal in de applicatie voor type-safe
 * toegang tot environment variables.
 *
 * @example
 * ```typescript
 * import { env } from '@/lib/config/env'
 *
 * const apiUrl = env.API_URL
 * if (env.IS_DEVELOPMENT) {
 *   console.log('Running in development mode')
 * }
 * ```
 */
export const env = parseEnv()

/**
 * Type guard om te checken of we in de browser zijn
 */
export const isBrowser = typeof window !== 'undefined'

/**
 * Type guard om te checken of we op de server zijn
 */
export const isServer = !isBrowser

/**
 * Helper om te loggen alleen in development
 */
export function devLog(...args: unknown[]): void {
  if (env.IS_DEVELOPMENT && isBrowser) {
    console.log(...args)
  }
}

/**
 * Helper om te waarschuwen alleen in development
 */
export function devWarn(...args: unknown[]): void {
  if (env.IS_DEVELOPMENT && isBrowser) {
    console.warn(...args)
  }
}

/**
 * Helper om errors te loggen (in alle environments)
 */
export function logError(...args: unknown[]): void {
  if (isBrowser) {
    console.error(...args)
  }
}
