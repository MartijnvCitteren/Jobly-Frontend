/**
 * Environment Configuration
 *
 * Type-safe environment variable access met runtime validatie.
 * Alle environment variables worden hier gecentraliseerd en gevalideerd.
 *
 * BELANGRIJK: NEXT_PUBLIC_* variabelen worden bij BUILD-TIME ingebakken.
 * Voor runtime configuratie, gebruik NEXT_PUBLIC_ENVIRONMENT.
 */

/**
 * Ondersteunde omgevingen
 */
export type Environment = 'local' | 'develop' | 'production'

/**
 * API endpoints per omgeving
 * Deze kunnen aangepast worden aan jouw infrastructuur
 */
const API_ENDPOINTS: Record<Environment, string> = {
  local: 'http://localhost:8090/api/v1',
  develop: 'https://api-dev.jobly.nl/api/v1', // Pas aan naar jouw dev endpoint
  production: 'https://api.jobly.nl/api/v1', // Pas aan naar jouw prod endpoint
}

/**
 * Environment variable schema
 */
interface EnvConfig {
  API_URL: string
  ENVIRONMENT: Environment
  NODE_ENV: 'development' | 'production' | 'test'
  IS_DEVELOPMENT: boolean
  IS_PRODUCTION: boolean
  IS_TEST: boolean
  IS_LOCAL: boolean
}

/**
 * Get en valideer de applicatie environment
 */
function getEnvironment(): Environment {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT || 'local'

  if (env === 'local' || env === 'develop' || env === 'production') {
    return env
  }

  console.warn(
    `Invalid NEXT_PUBLIC_ENVIRONMENT: ${env}. ` +
      `Must be one of: local, develop, production. Defaulting to 'local'`
  )
  return 'local'
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
  } catch {
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
 */
function parseEnv(): EnvConfig {
  const nodeEnv = getNodeEnv()
  const environment = getEnvironment()

  // Bepaal API URL:
  // 1. Gebruik NEXT_PUBLIC_API_URL als die expliciet is gezet
  // 2. Anders gebruik het endpoint voor de huidige environment
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
    ? validateApiUrl(process.env.NEXT_PUBLIC_API_URL)
    : validateApiUrl(API_ENDPOINTS[environment])

  return {
    API_URL: apiUrl,
    ENVIRONMENT: environment,
    NODE_ENV: nodeEnv === 'test' ? 'test' : nodeEnv,
    IS_DEVELOPMENT: nodeEnv === 'development',
    IS_PRODUCTION: nodeEnv === 'production',
    IS_TEST: nodeEnv === 'test',
    IS_LOCAL: environment === 'local',
  }
}

/**
 * Gevalideerde environment configuratie
 *
 * Gebruik dit object overal in de applicatie voor type-safe
 * toegang tot environment variables.
 *
 * ENVIRONMENT CONFIGURATIE:
 * - Zet NEXT_PUBLIC_ENVIRONMENT naar 'local', 'develop', of 'production'
 * - Elk environment heeft een vooraf gedefinieerd API endpoint
 * - Je kunt NEXT_PUBLIC_API_URL gebruiken om het endpoint handmatig te overschrijven
 *
 * LET OP: NEXT_PUBLIC_* variabelen worden bij BUILD-TIME ingebakken!
 * Voor Azure deployments: set NEXT_PUBLIC_ENVIRONMENT bij build-time,
 * niet als runtime environment variable.
 *
 * @example
 * ```typescript
 * import { env } from '@/lib/config/env'
 *
 * // Check welke omgeving actief is
 * console.log(env.ENVIRONMENT) // 'local' | 'develop' | 'production'
 *
 * // Gebruik de juiste API URL voor de omgeving
 * const response = await fetch(`${env.API_URL}/vacancies`)
 *
 * if (env.IS_LOCAL) {
 *   console.log('Running in local environment')
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

/**
 * Log environment configuratie (alleen in development)
 * Handig voor debugging
 */
export function logEnvironmentInfo(): void {
  if (env.IS_DEVELOPMENT && isBrowser) {
    console.group('🌍 Environment Configuration')
    console.log('Environment:', env.ENVIRONMENT)
    console.log('API URL:', env.API_URL)
    console.log('Node ENV:', env.NODE_ENV)
    console.log('Available endpoints:', API_ENDPOINTS)
    console.groupEnd()
  }
}
