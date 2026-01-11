/**
 * Application Constants
 *
 * Centrale locatie voor alle constanten in de applicatie.
 * Voorkomt magic strings/numbers en maakt refactoring makkelijker.
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  REQUEST_ID_HEADER: 'requestId',
} as const

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  COMPANY_INFO: '/create-company-info',
  CREATE_VACANCY: '/create-vacancy',
} as const

/**
 * Form Validation
 */
export const VALIDATION = {
  COMPANY_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  WEBSITE: {
    MAX_LENGTH: 50,
    PATTERN: /^www\..+\..+$/,
  },
  JOB_TITLE: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 75,
  },
  JOB_SUMMARY: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 300,
  },
  TASKS: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 300,
  },
  SKILLS: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 300,
  },
  TEAM_DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 300,
  },
  SALARY: {
    MIN: 0,
    MAX: 999999.99,
  },
  EXTRA_PERKS: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 100,
  },
  CONTACT: {
    NAME_MAX_LENGTH: 25,
    EMAIL_MAX_LENGTH: 50,
    PHONE_MIN_LENGTH: 10,
    PHONE_MAX_LENGTH: 15,
    PHONE_PATTERN: /^[0-9\-+ ]+$/,
  },
  EXAMPLE_VACANCY_URL: {
    MAX_LENGTH: 100,
  },
} as const

/**
 * UI Constants
 */
export const UI = {
  TOAST_DURATION: 3000, // 3 seconds
  DEBOUNCE_DELAY: 300, // 300ms
  ANIMATION_DURATION: 200, // 200ms
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  VACANCY_DRAFT: 'jobly_vacancy_draft',
  USER_PREFERENCES: 'jobly_user_preferences',
  LAST_COMPANY_INFO: 'jobly_last_company_info',
} as const

/**
 * Export Formats
 */
export const EXPORT = {
  PDF: {
    MARGIN: 20,
    FONT_SIZE: {
      TITLE: 20,
      SECTION_TITLE: 14,
      BODY: 11,
    },
    LINE_HEIGHT: {
      TITLE: 15,
      SECTION_TITLE: 3,
      BODY: 8,
    },
  },
  FILE_NAME_PREFIX: 'vacature',
} as const

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK: 'Er is een probleem met de netwerkverbinding. Controleer je internetverbinding en probeer het opnieuw.',
  TIMEOUT: 'De aanvraag duurde te lang. Probeer het later opnieuw.',
  BAD_REQUEST: 'De ingevoerde gegevens zijn ongeldig. Controleer je invoer.',
  NOT_FOUND: 'De gevraagde resource kon niet worden gevonden.',
  SERVER_ERROR: 'Er is een serverfout opgetreden. Probeer het later opnieuw.',
  VALIDATION: 'De ingevoerde gegevens zijn ongeldig.',
  UNKNOWN: 'Er is een onverwachte fout opgetreden. Probeer het later opnieuw.',
  EXPORT_PDF: 'Kon vacature niet exporteren als PDF',
  EXPORT_WORD: 'Kon vacature niet exporteren als Word document',
  COPY_CLIPBOARD: 'Kon tekst niet kopiëren naar klembord',
} as const

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  VACANCY_GENERATED: 'Vacature succesvol gegenereerd!',
  COPIED: 'Gekopieerd naar klembord',
  EXPORTED: 'Document succesvol geëxporteerd',
} as const

/**
 * App Metadata
 */
export const APP_META = {
  NAME: 'Jobly',
  DESCRIPTION: 'AI-powered vacature generator',
  VERSION: '1.0.0',
} as const

/**
 * Security
 */
export const SECURITY = {
  CSP_DIRECTIVES: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': ["'self'"],
  },
  MAX_INPUT_LENGTH: 10000, // Maximum length for any text input
} as const

/**
 * Type exports for constants
 */
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS]
export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS]
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]
