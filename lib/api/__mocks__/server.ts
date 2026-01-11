import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Setup MSW server met de gedefinieerde handlers
export const server = setupServer(...handlers)
