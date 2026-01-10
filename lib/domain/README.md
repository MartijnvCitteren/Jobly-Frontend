# Domain Layer

Deze map bevat de **domain models** en **validation schemas** voor de Jobly applicatie.

## Overzicht

De domain layer bevat:

- **TypeScript interfaces** (`vacancy.types.ts`) - Type definities voor compile-time type safety
- **Zod validation schemas** (`vacancy.schema.ts`) - Runtime validatie van data

## Bestanden

### `vacancy.types.ts`

Bevat alle TypeScript interfaces en enums, gegenereerd op basis van de OpenAPI specificatie:

```typescript
import { CompanyInfoRequest, JobInfoRequest, GeneratedVacancy } from '@/lib/domain/vacancy.types'
```

**Gebruik voor:**
- Type annotaties in functie parameters en return types
- Component props typing
- Compile-time type checking

### `vacancy.schema.ts`

Bevat Zod schemas voor runtime validatie:

```typescript
import { CompanyInfoRequestSchema, JobInfoRequestSchema } from '@/lib/domain/vacancy.schema'

// Valideer data
const result = CompanyInfoRequestSchema.safeParse(formData)
if (result.success) {
  // Data is geldig, gebruik result.data
  console.log(result.data)
} else {
  // Data is ongeldig, toon errors
  console.error(result.error.issues)
}
```

**Gebruik voor:**
- Form validatie
- API request/response validatie
- Runtime data checking

## Waarom beide?

### TypeScript Interfaces
- ✅ Compile-time type safety
- ✅ Auto-completion in IDE
- ✅ Geen runtime overhead
- ❌ Geen runtime validatie

### Zod Schemas
- ✅ Runtime validatie
- ✅ Gebruiksvriendelijke error messages
- ✅ Type inference (automatische TypeScript types)
- ✅ Complex validatie regels (min/max, regex, custom logic)
- ❌ Kleine runtime overhead

## Voorbeelden

### Formulier Validatie

```typescript
import { JobInfoRequestSchema } from '@/lib/domain/vacancy.schema'

const handleSubmit = (formData: unknown) => {
  const result = JobInfoRequestSchema.safeParse(formData)

  if (!result.success) {
    // Toon validatie errors aan gebruiker
    result.error.issues.forEach(issue => {
      console.error(`${issue.path.join('.')}: ${issue.message}`)
    })
    return
  }

  // Data is geldig, verstuur naar API
  submitToAPI(result.data)
}
```

### API Response Validatie

```typescript
import { GeneratedVacancySchema } from '@/lib/domain/vacancy.schema'

const fetchVacancy = async (id: string) => {
  const response = await fetch(`/api/vacancies/${id}`)
  const data = await response.json()

  // Valideer dat API correcte data teruggeeft
  const validated = GeneratedVacancySchema.parse(data)
  return validated
}
```

### Type Inference

Zod schemas kunnen automatisch TypeScript types genereren:

```typescript
import { z } from 'zod'
import { CompanyInfoRequestSchema } from '@/lib/domain/vacancy.schema'

// Gebruik z.infer om type te halen uit schema
type CompanyInfoRequest = z.infer<typeof CompanyInfoRequestSchema>

// Of gebruik de ge-exporteerde types
import type { CompanyInfoRequestInput, CompanyInfoRequestOutput } from '@/lib/domain/vacancy.schema'
```

## Validatie Regels

Alle validatie regels komen overeen met de OpenAPI specificatie:

- **String lengths**: min/max karakters
- **Patterns**: regex validatie (bijv. website URLs, telefoonnummers)
- **Numbers**: min/max waarden, decimal precision
- **Email**: RFC compliant email validatie
- **UUID**: UUID formaat voor tokens
- **Custom rules**: Complexe validatie (bijv. maxSalary >= minSalary)

## Testing

Tests voor de schemas bevinden zich in `__tests__/lib/domain/vacancy.schema.test.ts`.

Run tests met:

```bash
npm test vacancy.schema
```

## Integratie met React Hook Form

Deze schemas kunnen eenvoudig geïntegreerd worden met React Hook Form via `@hookform/resolvers/zod`:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { JobInfoRequestSchema } from '@/lib/domain/vacancy.schema'

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(JobInfoRequestSchema)
  })

  // ...
}
```

## Referenties

- [Zod Documentation](https://zod.dev/)
- [OpenAPI Specification](../../openapi.yaml)
