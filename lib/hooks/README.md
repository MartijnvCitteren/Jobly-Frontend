# Hooks

Custom React hooks voor herbruikbare stateful logic in de Jobly applicatie.

## Overzicht

Deze directory bevat custom hooks die business logica en state management encapsuleren volgens React best practices. Alle hooks zijn volledig type-safe en uitgebreid getest.

## Available Hooks

### useVacancyGeneration

Hook voor het beheren van vacancy generatie workflow, inclusief API calls en state management.

**Features:**
- Loading, success en error states
- Automatische error handling
- Reset functionaliteit
- Type-safe API integratie

**Gebruik:**

```typescript
import { useVacancyGeneration } from '@/lib/hooks'

function VacancyForm() {
  const {
    generateVacancy,
    isLoading,
    vacancy,
    error,
    reset
  } = useVacancyGeneration()

  const handleSubmit = async (companyInfo, jobInfo) => {
    await generateVacancy(companyInfo, jobInfo)
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (vacancy) return <VacancyResult data={vacancy} />

  return <VacancyForm onSubmit={handleSubmit} />
}
```

**API:**

- `status`: Huidige status (`'idle' | 'loading' | 'success' | 'error'`)
- `vacancy`: Gegenereerde vacancy data (indien success)
- `error`: Error message (indien error)
- `generateVacancy()`: Functie om vacancy te genereren
- `reset()`: Reset naar initiële state
- `isLoading`, `isSuccess`, `isError`, `isIdle`: Convenience booleans

### useFormWizard

Hook voor het beheren van multi-step form navigation en state management.

**Features:**
- Stap navigatie (next, previous, goto)
- Form data management met partial updates
- Per-stap validatie
- Progress tracking
- Type-safe met generics

**Gebruik:**

```typescript
import { useFormWizard, WizardStep } from '@/lib/hooks'

interface RegistrationData {
  name: string
  email: string
  preferences: string[]
}

function RegistrationWizard() {
  const steps: WizardStep[] = [
    {
      id: 'personal',
      label: 'Persoonlijke Info',
      validate: () => formData.name.length > 0
    },
    {
      id: 'contact',
      label: 'Contact Info',
      validate: () => /^.+@.+\..+$/.test(formData.email)
    },
    {
      id: 'preferences',
      label: 'Voorkeuren'
    },
  ]

  const wizard = useFormWizard<RegistrationData>({
    steps,
    initialData: { name: '', email: '', preferences: [] }
  })

  return (
    <div>
      <ProgressBar value={wizard.progress} />

      <CurrentStepComponent
        data={wizard.formData}
        onChange={wizard.updateFormData}
      />

      <div>
        <button
          onClick={wizard.previousStep}
          disabled={!wizard.hasPreviousStep}
        >
          Vorige
        </button>

        <button
          onClick={wizard.nextStep}
          disabled={!wizard.hasNextStep || !wizard.isCurrentStepValid}
        >
          {wizard.isLastStep ? 'Voltooien' : 'Volgende'}
        </button>
      </div>
    </div>
  )
}
```

**API:**

- `currentStepIndex`: Index van huidige stap (0-based)
- `currentStep`: Configuratie van huidige stap
- `steps`: Alle stappen
- `formData`: Huidige form data
- `updateFormData(data)`: Merge partial data
- `setFormData(data)`: Set complete data
- `nextStep()`: Ga naar volgende stap
- `previousStep()`: Ga naar vorige stap
- `goToStep(index)`: Ga naar specifieke stap
- `hasNextStep`, `hasPreviousStep`: Navigatie checks
- `isFirstStep`, `isLastStep`: Positie checks
- `isCurrentStepValid`: Validatie status
- `progress`: Progress percentage (0-100)
- `reset()`: Reset naar initiële state

## Design Patterns

### Custom Hooks Pattern

Custom hooks volgen het React hooks pattern:
- Beginnen met `use` prefix
- Encapsuleren stateful logic
- Zijn herbruikbaar over componenten
- Retourneren data en control functies

### Repository Pattern

`useVacancyGeneration` integreert met de repository layer (`vacancy-repository.ts`) voor API calls, volgens het separation of concerns principe.

### Type Safety

Alle hooks zijn volledig type-safe:
- Generic types voor flexibiliteit (`useFormWizard<T>`)
- Expliciete return types
- Type-safe API integratie

## Testing

Alle hooks hebben uitgebreide test coverage:

- `useVacancyGeneration.test.ts` - ~90% coverage
- `useFormWizard.test.ts` - ~95% coverage

Tests dekken:
- Happy path scenarios
- Error handling
- Edge cases
- State transitions
- Type safety

**Run tests:**

```bash
npm test lib/hooks
```

## Best Practices

1. **Single Responsibility**: Elke hook heeft één duidelijk doel
2. **Memoization**: Gebruik `useCallback` en `useMemo` voor performance
3. **Error Handling**: Altijd errors afhandelen en exposed naar caller
4. **Type Safety**: Gebruik TypeScript types en generics waar mogelijk
5. **Testing**: Schrijf tests voor alle edge cases en state transitions

## Toekomstige Hooks

Potentiële hooks voor toekomstige development:

- `useFormValidation` - Generieke form validatie
- `useDebounce` - Debounce user input
- `useLocalStorage` - Persist state in localStorage
- `useMediaQuery` - Responsive design helpers
- `useSocialMediaGeneration` - Social media post generatie

## Bronnen

- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [Custom Hooks Guide](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Testing React Hooks](https://react-hooks-testing-library.com/)
