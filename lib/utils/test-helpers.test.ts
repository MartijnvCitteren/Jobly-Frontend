import { formatJobTitle, delay, createMockVacancy } from '@/lib/utils/test-helpers'

describe('Test Helpers', () => {
  describe('formatJobTitle', () => {
    it('should trim whitespace from job title', () => {
      const result = formatJobTitle('  Senior Developer  ')
      expect(result).toBe('Senior Developer')
    })

    it('should replace multiple spaces with single space', () => {
      const result = formatJobTitle('Senior    Java    Developer')
      expect(result).toBe('Senior Java Developer')
    })

    it('should handle empty string', () => {
      const result = formatJobTitle('')
      expect(result).toBe('')
    })
  })

  describe('delay', () => {
    it('should resolve after specified time', async () => {
      const start = Date.now()
      await delay(100)
      const end = Date.now()
      expect(end - start).toBeGreaterThanOrEqual(100)
    })
  })

  describe('createMockVacancy', () => {
    it('should create a mock vacancy with default values', () => {
      const vacancy = createMockVacancy()

      expect(vacancy).toHaveProperty('id')
      expect(vacancy).toHaveProperty('title')
      expect(vacancy).toHaveProperty('content')
      expect(vacancy).toHaveProperty('createdAt')
    })

    it('should allow overriding default values', () => {
      const customTitle = 'Custom Job Title'
      const vacancy = createMockVacancy({ title: customTitle })

      expect(vacancy.title).toBe(customTitle)
      expect(vacancy.id).toBe('test-id-123') // default value still present
    })
  })
})
