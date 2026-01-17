/**
 * Tests voor Logger Service
 *
 * Note: In test environment wordt MIN_LOG_LEVEL ingesteld op WARN,
 * wat betekent dat DEBUG en INFO logs worden gefilterd.
 * Dit is bewust gedrag voor schone test output.
 */

import { createLogger, logger, LogLevel } from './logger'

describe('Logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'debug').mockImplementation()
    jest.spyOn(console, 'info').mockImplementation()
    jest.spyOn(console, 'warn').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('createLogger', () => {
    it('should create logger with context', () => {
      const contextLogger = createLogger('TestContext')
      expect(contextLogger).toBeDefined()
      expect(typeof contextLogger.debug).toBe('function')
      expect(typeof contextLogger.info).toBe('function')
      expect(typeof contextLogger.warn).toBe('function')
      expect(typeof contextLogger.error).toBe('function')
    })

    it('should create independent loggers', () => {
      const logger1 = createLogger('Context1')
      const logger2 = createLogger('Context2')

      expect(logger1).not.toBe(logger2)
    })
  })

  describe('Log Levels', () => {
    it('should have correct log level enum values', () => {
      expect(LogLevel.DEBUG).toBe('DEBUG')
      expect(LogLevel.INFO).toBe('INFO')
      expect(LogLevel.WARN).toBe('WARN')
      expect(LogLevel.ERROR).toBe('ERROR')
    })
  })

  describe('Log methods', () => {
    it('should accept debug calls without throwing', () => {
      expect(() => logger.debug('test')).not.toThrow()
      expect(() => logger.debug('test', { data: 'value' })).not.toThrow()
    })

    it('should accept info calls without throwing', () => {
      expect(() => logger.info('test')).not.toThrow()
      expect(() => logger.info('test', { data: 'value' })).not.toThrow()
    })

    it('should accept warn calls without throwing', () => {
      expect(() => logger.warn('test')).not.toThrow()
      expect(() => logger.warn('test', { data: 'value' })).not.toThrow()
    })

    it('should accept error calls without throwing', () => {
      expect(() => logger.error('test')).not.toThrow()
      expect(() => logger.error('test', new Error('test'))).not.toThrow()
    })
  })

  describe('Warning logging', () => {
    it('should log warning messages', () => {
      logger.warn('warning message')
      expect(console.warn).toHaveBeenCalled()
    })

    it('should log warning messages with data', () => {
      const warning = { code: 'WARN_001' }
      logger.warn('warning message', warning)

      const call = (console.warn as jest.Mock).mock.calls[0]
      expect(call[1]).toEqual(warning)
    })
  })

  describe('Error logging', () => {
    it('should log error messages', () => {
      logger.error('error message')
      expect(console.error).toHaveBeenCalled()
    })

    it('should log error messages with error object', () => {
      const error = new Error('test error')
      logger.error('error message', error)

      const call = (console.error as jest.Mock).mock.calls[0]
      expect(call[1]).toEqual(error)
    })

    it('should log error messages with custom error data', () => {
      const errorData = { status: 500, message: 'Server error' }
      logger.error('API failed', errorData)

      const call = (console.error as jest.Mock).mock.calls[0]
      expect(call[1]).toEqual(errorData)
    })
  })

  describe('API logging helpers', () => {
    describe('apiRequest', () => {
      it('should accept API request logs', () => {
        expect(() => logger.apiRequest('GET', '/api/v1/test')).not.toThrow()
        expect(() => logger.apiRequest('POST', '/api/v1/create', { data: 'value' })).not.toThrow()
      })
    })

    describe('apiResponse', () => {
      it('should log error responses', () => {
        logger.apiResponse('POST', '/api/v1/create', 500)

        expect(console.error).toHaveBeenCalled()

        const message = (console.error as jest.Mock).mock.calls[0][0]
        expect(message).toContain('API Response')
        expect(message).toContain('Status: 500')
      })

      it('should log 4xx responses as errors', () => {
        logger.apiResponse('GET', '/api/v1/notfound', 404)

        expect(console.error).toHaveBeenCalled()

        const message = (console.error as jest.Mock).mock.calls[0][0]
        expect(message).toContain('Status: 404')
      })

      it('should accept successful responses without throwing', () => {
        expect(() => logger.apiResponse('GET', '/api/v1/test', 200)).not.toThrow()
      })
    })

    describe('apiError', () => {
      it('should log API errors', () => {
        const error = new Error('Network error')
        logger.apiError('GET', '/api/v1/vacancies', error)

        expect(console.error).toHaveBeenCalled()

        const call = (console.error as jest.Mock).mock.calls[0]
        expect(call[0]).toContain('API Error')
        expect(call[0]).toContain('GET')
        expect(call[0]).toContain('/api/v1/vacancies')
        expect(call[1]).toEqual(error)
      })

      it('should log API errors with error details', () => {
        const errorDetails = {
          status: 500,
          message: 'Internal Server Error',
          code: 'ERR_INTERNAL'
        }
        logger.apiError('POST', '/api/v1/create', errorDetails)

        const call = (console.error as jest.Mock).mock.calls[0]
        expect(call[1]).toEqual(errorDetails)
      })
    })
  })

  describe('Context logger', () => {
    it('should create independent loggers with different contexts', () => {
      const logger1 = createLogger('Context1')
      const logger2 = createLogger('Context2')

      logger1.error('error from logger1')
      logger2.error('error from logger2')

      expect(console.error).toHaveBeenCalledTimes(2)

      const call1 = (console.error as jest.Mock).mock.calls[0][0]
      const call2 = (console.error as jest.Mock).mock.calls[1][0]

      expect(call1).toContain('[Context1]')
      expect(call2).toContain('[Context2]')
    })

    it('should work with complex context names', () => {
      const contextLogger = createLogger('VacancyService::generateVacancy')
      contextLogger.error('test error')

      const message = (console.error as jest.Mock).mock.calls[0][0]
      expect(message).toContain('[VacancyService::generateVacancy]')
    })
  })

  describe('Message formatting', () => {
    it('should include timestamp in log messages', () => {
      logger.error('test message')

      const message = (console.error as jest.Mock).mock.calls[0][0]
      // Check for ISO timestamp pattern
      expect(message).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('should include log level in messages', () => {
      logger.warn('test')
      const message = (console.warn as jest.Mock).mock.calls[0][0]
      expect(message).toContain('WARN')
    })

    it('should format error messages consistently', () => {
      const contextLogger = createLogger('TestContext')
      contextLogger.error('error message')

      const message = (console.error as jest.Mock).mock.calls[0][0]

      // Should have format: [timestamp] LEVEL [context] message
      expect(message).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] ERROR \[TestContext\] error message/)
    })
  })

  describe('Data handling', () => {
    it('should handle undefined data gracefully', () => {
      expect(() => logger.warn('message', undefined)).not.toThrow()
    })

    it('should handle null data', () => {
      expect(() => logger.error('message', null)).not.toThrow()
    })

    it('should handle complex objects', () => {
      const complexData = {
        nested: {
          deep: {
            value: 42
          }
        },
        array: [1, 2, 3]
      }

      logger.error('complex', complexData)

      const call = (console.error as jest.Mock).mock.calls[0]
      expect(call[1]).toEqual(complexData)
    })
  })

  describe('Default logger instance', () => {
    it('should export default logger instance', () => {
      expect(logger).toBeDefined()
      expect(typeof logger.debug).toBe('function')
      expect(typeof logger.info).toBe('function')
      expect(typeof logger.warn).toBe('function')
      expect(typeof logger.error).toBe('function')
      expect(typeof logger.apiRequest).toBe('function')
      expect(typeof logger.apiResponse).toBe('function')
      expect(typeof logger.apiError).toBe('function')
    })

    it('should work without context', () => {
      logger.error('test without context')

      const message = (console.error as jest.Mock).mock.calls[0][0]
      expect(message).toContain('ERROR')
      expect(message).toContain('test without context')
    })
  })

  describe('Integration scenarios', () => {
    it('should handle rapid consecutive logs', () => {
      for (let i = 0; i < 10; i++) {
        logger.error(`Error ${i}`)
      }

      expect(console.error).toHaveBeenCalledTimes(10)
    })

    it('should handle mixed log levels', () => {
      logger.debug('debug') // filtered
      logger.info('info')   // filtered
      logger.warn('warn')   // logged
      logger.error('error') // logged

      expect(console.debug).not.toHaveBeenCalled()
      expect(console.info).not.toHaveBeenCalled()
      expect(console.warn).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledTimes(1)
    })
  })
})
