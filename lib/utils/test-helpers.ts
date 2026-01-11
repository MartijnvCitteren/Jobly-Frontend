/**
 * Test Helper Utilities
 *
 * Herbruikbare utility functies voor testing
 */

/**
 * Simpele helper functie om te testen of de testing setup werkt
 */
export function formatJobTitle(title: string): string {
  return title.trim().replace(/\s+/g, ' ')
}

/**
 * Helper om async operations te simuleren in tests
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Mock data generator voor vacancy objects
 */
export function createMockVacancy(overrides = {}) {
  return {
    id: 'test-id-123',
    title: 'Test Job Title',
    content: 'Test job content',
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}
