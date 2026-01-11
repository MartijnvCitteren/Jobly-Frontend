// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

/**
 * Note: MSW setup is NOT included here globally.
 *
 * Import en setup MSW in individuele test files waar je het nodig hebt:
 *
 * import { server } from '@/lib/api/__mocks__/server'
 *
 * beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
 * afterEach(() => server.resetHandlers())
 * afterAll(() => server.close())
 */

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}
