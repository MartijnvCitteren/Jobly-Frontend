/**
 * Logger Service
 *
 * Centralized logging service met verschillende log levels en formattering.
 * In production kunnen logs naar externe services gestuurd worden (Sentry, LogRocket, etc.)
 */

import { env, isBrowser } from '@/lib/config/env'

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Log level prioriteit (voor filtering)
 */
const LOG_LEVEL_PRIORITY = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
}

/**
 * Minimum log level per environment
 */
const MIN_LOG_LEVEL = env.IS_PRODUCTION ? LogLevel.WARN : LogLevel.DEBUG

/**
 * Log entry interface
 */
interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: string
  data?: unknown
}

/**
 * Format timestamp
 */
function formatTimestamp(): string {
  return new Date().toISOString()
}

/**
 * Check of log level getoond moet worden
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[MIN_LOG_LEVEL]
}

/**
 * Format log entry voor console output
 */
function formatLogEntry(entry: LogEntry): string {
  const contextStr = entry.context ? `[${entry.context}]` : ''
  return `[${entry.timestamp}] ${entry.level} ${contextStr} ${entry.message}`
}

/**
 * Send log to external service (placeholder voor toekomstige integratie)
 */
function sendToExternalService(entry: LogEntry): void {
  // TODO: Implementeer externe logging service integratie
  // Bijvoorbeeld: Sentry, LogRocket, Datadog, etc.

  if (env.IS_PRODUCTION && entry.level === LogLevel.ERROR) {
    // In production, zou je hier naar Sentry kunnen sturen
    // Sentry.captureException(entry)
  }
}

/**
 * Core log functie
 */
function log(level: LogLevel, message: string, context?: string, data?: unknown): void {
  if (!shouldLog(level)) {
    return
  }

  const entry: LogEntry = {
    level,
    message,
    timestamp: formatTimestamp(),
    context,
    data,
  }

  // Console output (alleen in development of voor errors/warnings)
  if (isBrowser && (env.IS_DEVELOPMENT || level === LogLevel.ERROR || level === LogLevel.WARN)) {
    const formattedMessage = formatLogEntry(entry)

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, data || '')
        break
      case LogLevel.INFO:
        console.info(formattedMessage, data || '')
        break
      case LogLevel.WARN:
        console.warn(formattedMessage, data || '')
        break
      case LogLevel.ERROR:
        console.error(formattedMessage, data || '')
        break
    }
  }

  // Send naar externe service indien nodig
  sendToExternalService(entry)
}

/**
 * Logger class met convenience methods
 */
class Logger {
  private context?: string

  constructor(context?: string) {
    this.context = context
  }

  /**
   * Create een nieuwe logger instance met context
   */
  static create(context: string): Logger {
    return new Logger(context)
  }

  /**
   * Debug level log
   */
  debug(message: string, data?: unknown): void {
    log(LogLevel.DEBUG, message, this.context, data)
  }

  /**
   * Info level log
   */
  info(message: string, data?: unknown): void {
    log(LogLevel.INFO, message, this.context, data)
  }

  /**
   * Warning level log
   */
  warn(message: string, data?: unknown): void {
    log(LogLevel.WARN, message, this.context, data)
  }

  /**
   * Error level log
   */
  error(message: string, error?: unknown): void {
    log(LogLevel.ERROR, message, this.context, error)
  }

  /**
   * Log API request
   */
  apiRequest(method: string, url: string, data?: unknown): void {
    this.debug(`API Request: ${method} ${url}`, data)
  }

  /**
   * Log API response
   */
  apiResponse(method: string, url: string, status: number, data?: unknown): void {
    const message = `API Response: ${method} ${url} - Status: ${status}`

    if (status >= 400) {
      this.error(message, data)
    } else {
      this.debug(message, data)
    }
  }

  /**
   * Log API error
   */
  apiError(method: string, url: string, error: unknown): void {
    this.error(`API Error: ${method} ${url}`, error)
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger()

/**
 * Create logger met specifieke context
 *
 * @example
 * ```typescript
 * const logger = createLogger('VacancyService')
 * logger.info('Generating vacancy')
 * logger.error('Failed to generate', error)
 * ```
 */
export function createLogger(context: string): Logger {
  return Logger.create(context)
}

/**
 * Export convenience functions
 */
export const debug = logger.debug.bind(logger)
export const info = logger.info.bind(logger)
export const warn = logger.warn.bind(logger)
export const error = logger.error.bind(logger)
