# Testing Guide - Jobly Frontend

## Overzicht

Dit project gebruikt een moderne testing stack voor het testen van React componenten en TypeScript code:

- **Jest** - Test framework
- **React Testing Library** - Voor het testen van React componenten
- **MSW (Mock Service Worker)** - Voor het mocken van API calls (beschikbaar, maar optioneel)

## Installed Dependencies

```json
{
  "devDependencies": {
    "jest": "^x.x.x",
    "@types/jest": "^x.x.x",
    "jest-environment-jsdom": "^x.x.x",
    "@testing-library/react": "^x.x.x",
    "@testing-library/jest-dom": "^x.x.x",
    "@testing-library/user-event": "^x.x.x",
    "msw": "^x.x.x",
    "undici": "^x.x.x"
  }
}
```

## Test Scripts

Voeg de volgende scripts toe aan je workflow:

### `npm test`

Voert alle tests uit in watch mode (standaard)

```bash
npm test
```

### `npm run test:watch`

Voert tests uit in watch mode - herlaadt automatisch bij wijzigingen

```bash
npm run test:watch
```

### `npm run test:coverage`

Voert tests uit en genereert een coverage report

```bash
npm run test:coverage
```

### `npm run test:ci`

Voert tests uit in CI mode (geen watch, met coverage, max 2 workers)

```bash
npm run test:ci
```

## Project Structuur (Co-located Tests)

Tests staan **naast** de code die ze testen voor betere onderhoudbaarheid:

```
├── components/            # React componenten
│   └── ui/
│       ├── Button.tsx
│       └── Button.test.tsx         ← Test co-located met component
├── lib/                   # Business logic en utilities
│   ├── api/
│   │   ├── client.ts
│   │   ├── client.test.ts          ← Test co-located met code
│   │   └── __mocks__/              # MSW handlers (optioneel)
│   │       ├── server.ts
│   │       ├── handlers.ts
│   │       └── browser.ts
│   └── utils/
│       ├── test-helpers.ts
│       └── test-helpers.test.ts    ← Test co-located met code
├── jest.config.js         # Jest configuratie
└── jest.setup.js          # Test setup file
```

**Voordelen van co-located tests:**

- ✅ Makkelijker te vinden en te onderhouden
- ✅ Tests blijven gesynchroniseerd bij refactoring
- ✅ Kortere import paths
- ✅ Duidelijk welke code getest is
- ✅ Moderne React/TypeScript best practice

## Test Voorbeelden

### Unit Test Voorbeeld (Utility Function)

```typescript
// lib/utils/formatters.ts
export function formatJobTitle(title: string): string {
  return title.trim().replace(/\s+/g, ' ')
}

// __tests__/lib/utils/formatters.test.ts
import { formatJobTitle } from '@/lib/utils/formatters'

describe('formatJobTitle', () => {
  it('should trim whitespace', () => {
    expect(formatJobTitle('  Developer  ')).toBe('Developer')
  })
})
```

### Component Test Voorbeeld (React Testing Library)

```typescript
// components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'  // ← Relatieve import (korter!)

describe('Button', () => {
  it('should call onClick when clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### API Test Voorbeeld (Mock Fetch)

```typescript
// lib/api/client.test.ts
import { get } from './client' // ← Co-located, korte import!

// Mock global fetch
global.fetch = jest.fn()

describe('API Client', () => {
  beforeEach(() => {
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('should fetch data', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
    })

    const result = await get('/endpoint')

    expect(result).toEqual({ data: 'test' })
  })
})
```

## MSW (Mock Service Worker) - Optioneel

MSW is geïnstalleerd en geconfigureerd, maar wordt **niet** automatisch geladen in alle tests. Dit geeft je de flexibiliteit om het alleen te gebruiken waar nodig.

### MSW in Tests Gebruiken

```typescript
import { server } from '@/lib/api/__mocks__/server'
import { http, HttpResponse } from 'msw'

// Setup MSW voor deze test suite
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('API Integration Tests', () => {
  it('should call API endpoint', async () => {
    server.use(
      http.get('/api/endpoint', () => {
        return HttpResponse.json({ data: 'mocked' })
      })
    )

    // Your test here
  })
})
```

### MSW Handlers Toevoegen

Voeg nieuwe API mock handlers toe in `lib/api/__mocks__/handlers.ts`:

```typescript
export const handlers = [
  http.post('/api/vacancies/generate', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(
      {
        id: 'mock-id',
        title: body.jobTitle,
        // ...
      },
      { status: 201 }
    )
  }),
]
```

## Coverage Thresholds

Het project heeft de volgende coverage thresholds ingesteld:

- **Branches**: 70%
- **Functions**: 75%
- **Lines**: 75%
- **Statements**: 75%

Deze zijn geconfigureerd in `jest.config.js` en worden gecontroleerd bij `npm run test:coverage`.

## Best Practices

### 1. Test Naming

- Gebruik beschrijvende namen die het gedrag beschrijven
- Begin test namen met "should" (bijv. "should render button")

### 2. Test Organisatie

- Groepeer gerelateerde tests met `describe` blocks
- Gebruik `beforeEach`/`afterEach` voor setup/cleanup
- Een test per gedrag/scenario

### 3. Testing Library Queries

- Prefer: `getByRole` (meest toegankelijk)
- Use: `getByLabelText`, `getByPlaceholderText`
- Avoid: `getByTestId` (alleen als laatste optie)

### 4. Async Testing

- Gebruik `async/await` voor async operations
- Gebruik `waitFor` voor async state updates
- Setup userEvent met `userEvent.setup()`

### 5. Mocking

- Mock externe dependencies (API, timers, etc.)
- Clear mocks tussen tests met `beforeEach`
- Gebruik `jest.fn()` voor function spies

## Troubleshooting

### Tests falen door ontbrekende globals

Als tests falen met "X is not defined" errors, kan het zijn dat bepaalde browser APIs niet beschikbaar zijn in de test environment. Voeg polyfills toe aan `jest.setup.js`.

### MSW werkt niet

Zorg ervoor dat je MSW server correct setup hebt in je test file:

```typescript
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Coverage te laag

Voeg meer tests toe of pas de threshold aan in `jest.config.js` onder `coverageThreshold`.

## Workflow: Nieuwe Feature Toevoegen met Tests

Met co-located tests is het workflow simpel:

1. **Maak component/functie**

   ```bash
   touch components/vacancy/VacancyCard.tsx
   ```

2. **Maak test ernaast**

   ```bash
   touch components/vacancy/VacancyCard.test.tsx
   ```

3. **Schrijf test eerst** (TDD)

   ```typescript
   // VacancyCard.test.tsx
   describe('VacancyCard', () => {
     it('should render vacancy title', () => {
       // Test hier
     })
   })
   ```

4. **Implementeer feature**

   ```typescript
   // VacancyCard.tsx
   export const VacancyCard = () => {
     // Implementatie hier
   }
   ```

5. **Tests draaien automatisch**
   ```bash
   npm run test:watch  # Auto-detect nieuwe tests
   ```

## Volgende Stappen

Nu de testing infrastructure is opgezet, kun je:

1. ✅ Tests schrijven voor nieuwe features (co-located!)
2. ✅ TDD (Test-Driven Development) toepassen
3. ✅ Coverage verhogen door meer tests toe te voegen
4. ✅ Integration tests toevoegen met MSW
5. ✅ E2E tests overwegen (Playwright/Cypress)

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
