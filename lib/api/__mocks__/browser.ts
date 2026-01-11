import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Setup MSW worker voor browser (development)
// Dit kan handig zijn voor development zonder een echte backend
export const worker = setupWorker(...handlers)
