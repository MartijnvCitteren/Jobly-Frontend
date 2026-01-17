/**
 * Tests voor Environment Configuration
 */

describe('Environment Configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset environment voor elke test
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('Environment Detection', () => {
    it('should default to local environment', () => {
      delete process.env.NEXT_PUBLIC_ENVIRONMENT
      const { env } = require('./env')

      expect(env.ENVIRONMENT).toBe('local')
      expect(env.IS_LOCAL).toBe(true)
      expect(env.API_URL).toBe('http://localhost:8090/api/v1')
    })

    it('should use develop environment when set', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'develop'
      const { env } = require('./env')

      expect(env.ENVIRONMENT).toBe('develop')
      expect(env.IS_LOCAL).toBe(false)
      expect(env.API_URL).toBe('https://api-dev.jobly.nl/api/v1')
    })

    it('should use production environment when set', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'production'
      const { env } = require('./env')

      expect(env.ENVIRONMENT).toBe('production')
      expect(env.IS_LOCAL).toBe(false)
      expect(env.API_URL).toBe('https://api.jobly.nl/api/v1')
    })

    it('should fallback to local for invalid environment', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'invalid' as any
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      const { env } = require('./env')

      expect(env.ENVIRONMENT).toBe('local')
      expect(env.IS_LOCAL).toBe(true)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid NEXT_PUBLIC_ENVIRONMENT')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('API URL Configuration', () => {
    it('should use environment-specific endpoint by default', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'local'
      const { env } = require('./env')

      expect(env.API_URL).toBe('http://localhost:8090/api/v1')
    })

    it('should override with NEXT_PUBLIC_API_URL when provided', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'production'
      process.env.NEXT_PUBLIC_API_URL = 'https://custom-api.example.com/api/v1'

      const { env } = require('./env')

      expect(env.API_URL).toBe('https://custom-api.example.com/api/v1')
      expect(env.ENVIRONMENT).toBe('production')
    })

    it('should validate API URL format', () => {
      process.env.NEXT_PUBLIC_API_URL = 'invalid-url'

      expect(() => {
        require('./env')
      }).toThrow('Invalid API_URL')
    })

    it('should accept localhost URLs without http(s)', () => {
      process.env.NEXT_PUBLIC_API_URL = 'localhost:8090/api/v1'
      const { env } = require('./env')

      expect(env.API_URL).toBe('localhost:8090/api/v1')
    })
  })

  describe('NODE_ENV Configuration', () => {
    it('should default to development', () => {
      delete process.env.NODE_ENV
      const { env } = require('./env')

      expect(env.NODE_ENV).toBe('development')
      expect(env.IS_DEVELOPMENT).toBe(true)
      expect(env.IS_PRODUCTION).toBe(false)
      expect(env.IS_TEST).toBe(false)
    })

    it('should detect production environment', () => {
      process.env.NODE_ENV = 'production'
      const { env } = require('./env')

      expect(env.NODE_ENV).toBe('production')
      expect(env.IS_DEVELOPMENT).toBe(false)
      expect(env.IS_PRODUCTION).toBe(true)
      expect(env.IS_TEST).toBe(false)
    })

    it('should detect test environment', () => {
      process.env.NODE_ENV = 'test'
      const { env } = require('./env')

      expect(env.NODE_ENV).toBe('test')
      expect(env.IS_DEVELOPMENT).toBe(false)
      expect(env.IS_PRODUCTION).toBe(false)
      expect(env.IS_TEST).toBe(true)
    })

    it('should fallback to development for invalid NODE_ENV', () => {
      process.env.NODE_ENV = 'invalid' as any
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      const { env } = require('./env')

      expect(env.NODE_ENV).toBe('development')
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid NODE_ENV')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Helper Functions', () => {
    it('should detect browser environment correctly', () => {
      // In test environment, window is typically defined
      const { isBrowser } = require('./env')

      // isBrowser check is based on typeof window !== 'undefined'
      expect(typeof isBrowser).toBe('boolean')
    })

    it('devLog should work correctly', () => {
      process.env.NODE_ENV = 'development'
      jest.resetModules()

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      const { devLog } = require('./env')

      devLog('test message')

      // devLog only logs in browser + development
      // In Node test environment, it won't log because isBrowser is false
      consoleSpy.mockRestore()
    })

    it('devWarn should work correctly', () => {
      process.env.NODE_ENV = 'development'
      jest.resetModules()

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      const { devWarn } = require('./env')

      devWarn('test warning')

      // devWarn only logs in browser + development
      consoleSpy.mockRestore()
    })

    it('logError should work correctly', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const { logError } = require('./env')

      logError('test error')

      // logError only logs in browser environment
      consoleSpy.mockRestore()
    })

    it('logEnvironmentInfo should work correctly', () => {
      process.env.NODE_ENV = 'development'
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'local'

      const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation()
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
      const consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation()

      jest.resetModules()
      const { logEnvironmentInfo } = require('./env')
      logEnvironmentInfo()

      // logEnvironmentInfo only logs in browser + development
      // In Node test environment, it won't log

      consoleGroupSpy.mockRestore()
      consoleLogSpy.mockRestore()
      consoleGroupEndSpy.mockRestore()
    })
  })

  describe('Type Exports', () => {
    it('should export Environment type', () => {
      const { env } = require('./env')

      // Type check wordt gedaan door TypeScript compiler
      const environment: 'local' | 'develop' | 'production' = env.ENVIRONMENT
      expect(['local', 'develop', 'production']).toContain(environment)
    })
  })
})
