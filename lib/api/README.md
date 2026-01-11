# API Client Layer

Deze module bevat de API client layer voor communicatie met de Jobly Jobs backend API.

## Architectuur

De API client volgt het **Repository Pattern** en bevat:

- **Base Client** (`client.ts`) - Low-level fetch wrapper met error handling
- **Repository** (`vacancy-repository.ts`) - Domain-specifieke API calls
- **Domain Types** (`domain/vacancy.types.ts`) - TypeScript interfaces op basis van OpenAPI spec
- **MSW Handlers** (`__mocks__/handlers.ts`) - Mock Service Worker handlers voor testing

## Gebruik

### Basis API Calls

```typescript
import { get, post } from '@/lib/api'

// GET request
const data = await get<ResponseType>('/endpoint')

// POST request
const result = await post<ResponseType>('/endpoint', { key: 'value' })
```

### Vacancy Generatie - Complete Workflow

```typescript
import { createCompanyAndVacancy, Country, SeniorityLevel, WritingStyle, Language, SalaryPeriod } from '@/lib/api'

// Definieer bedrijfsinformatie
const companyInfo = {
  companyName: 'Tech Innovators BV',
  companyWebsite: 'www.techinnovators.nl',
  country: Country.THE_NETHERLANDS,
  exampleVacancyUrl: 'www.techinnovators.nl/careers/senior-developer'
}

// Definieer job informatie
const jobInfo = {
  jobTitle: 'Senior Full Stack Developer',
  seniorityLevel: SeniorityLevel.SENIOR,
  jobSummary: 'We zijn op zoek naar een ervaren Full Stack Developer...',
  tasks: 'Ontwerp en ontwikkel schaalbare web applicaties...',
  skills: 'Java, Spring Boot, React, TypeScript, AWS...',
  teamDescription: 'Sluit je aan bij ons team van 8 developers...',
  writingStyle: {
    writingStyle: WritingStyle.BUSINESS_CASUAL,
    language: Language.DUTCH
  },
  benefits: {
    salaryPeriod: SalaryPeriod.YEARLY,
    minSalary: 65000,
    maxSalary: 85000,
    extraPerks: 'Flexibele werktijden, remote work, training budget'
  },
  contactInfo: {
    name: 'Sarah Johnson',
    mail: 'sarah.johnson@example.com',
    phoneNumber: '+31 20 123 4567'
  }
}

// Genereer vacature (2 stappen in één)
try {
  const vacancy = await createCompanyAndVacancy(companyInfo, jobInfo)
  console.log(vacancy.summary)
  console.log(vacancy.jobDescription)
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.status}: ${error.message}`)
  }
}
```

### Vacancy Generatie - Handmatige Stappen

Als je meer controle wilt over het proces:

```typescript
import { createCompanyInfo, createVacancy } from '@/lib/api'

// Stap 1: Creëer bedrijfsinformatie
const { token } = await createCompanyInfo(companyInfo)

// Stap 2: Gebruik token om vacature te genereren
const vacancy = await createVacancy(token, jobInfo)
```

## Error Handling

De API client gebruikt een custom `ApiError` class:

```typescript
import { ApiError } from '@/lib/api'

try {
  const result = await createVacancy(token, jobInfo)
} catch (error) {
  if (error instanceof ApiError) {
    // HTTP error van de API
    console.error(`Status: ${error.status}`)
    console.error(`Message: ${error.message}`)
    console.error(`Response:`, error.response)
  } else {
    // Andere errors (network, timeout, etc.)
    console.error('Unexpected error:', error)
  }
}
```

### Error Status Codes

- `400` - Validation error (ongeldige request data)
- `404` - Request ID niet gevonden of verlopen
- `408` - Request timeout
- `0` - Network error (geen verbinding met server)

## Configuration

De API base URL kan geconfigureerd worden via environment variabele:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8090/api/v1
```

Default: `http://localhost:8090/api/v1`

## Domain Types

Alle types zijn beschikbaar via de index export:

```typescript
import type {
  CompanyInfoRequest,
  JobInfoRequest,
  GeneratedVacancy,
  WritingStyleRequest,
  BenefitsRequest,
  ContactInfoRequest
} from '@/lib/api'

import {
  Country,
  SeniorityLevel,
  WritingStyle,
  Language,
  SalaryPeriod
} from '@/lib/api'
```

### Enums

#### Country
- `THE_NETHERLANDS`
- `BELGIUM`
- `GERMANY`

#### SeniorityLevel
- `INTERN`
- `JUNIOR`
- `MEDIOR`
- `SENIOR`

#### WritingStyle
- `FORMAL` - Professioneel en precies
- `BUSINESS_CASUAL` - Ontspannen maar professioneel
- `CASUAL` - Informeel en vriendelijk
- `CREATIVE` - Expressief en creatief
- `TECHNICAL` - Technisch met domein-specifieke terminologie

#### Language
- `DUTCH`
- `ENGLISH`
- `FLEMISH`
- `FRENCH`
- `GERMAN`

#### SalaryPeriod
- `YEARLY`
- `MONTHLY`
- `WEEKLY`
- `DAILY`
- `HOURLY`

## Testing

De API module bevat uitgebreide tests met MSW (Mock Service Worker) voor API mocking:

```bash
# Run alle API tests
npm test lib/api

# Run specifieke test file
npm test lib/api/vacancy-repository.test.ts
```

### MSW Handlers

Voor testing worden automatisch MSW handlers gebruikt die de backend API simuleren. Deze zijn geconfigureerd in `__mocks__/handlers.ts` en worden automatisch geladen via `jest.setup.js`.

## Validatie

De API enforced de volgende validatie regels:

### CompanyInfoRequest
- `companyWebsite` (required): Pattern `www.example.com`, max 50 chars
- `country` (required): Een van de Country enum waarden
- `companyName` (optional): Max 50 chars
- `exampleVacancyUrl` (optional): Pattern `www.example.com`, max 100 chars

### JobInfoRequest
- `seniorityLevel` (required): Een van de SeniorityLevel enum waarden
- `writingStyle` (required): WritingStyleRequest object
- `jobTitle` (optional): 2-75 chars
- `jobSummary` (optional): 20-300 chars
- `tasks` (optional): 10-300 chars
- `skills` (optional): 10-300 chars
- `teamDescription` (optional): 10-300 chars

### ContactInfo
- `name` (optional): Max 25 chars
- `mail` (optional): Valid email, max 50 chars
- `phoneNumber` (optional): Min 10 chars, pattern `[0-9\-\+ ]+`, max 15 chars

### Benefits
- `minSalary`/`maxSalary` (optional): 0.00 - 999999.99
- `extraPerks` (optional): 10-100 chars

## Best Practices

1. **Gebruik enums** voor constante waarden (Country, SeniorityLevel, etc.)
2. **Error handling** - Wrap API calls altijd in try-catch
3. **TypeScript types** - Gebruik de provided types voor type safety
4. **Complete workflow** - Gebruik `createCompanyAndVacancy` voor eenvoud
5. **Token management** - Tokens zijn éénmalig te gebruiken per vacature
6. **Validation** - Valideer input data client-side voordat je API calls maakt

## API Endpoints

### POST /create-company-info

Creëert bedrijfsinformatie en retourneert een token.

**Request:**
```typescript
{
  companyName?: string
  companyWebsite: string
  country: Country
  exampleVacancyUrl?: string
}
```

**Response (201):**
```typescript
{
  token: string  // UUID format
}
```

### POST /create-vacancy?requestId={token}

Genereert vacaturetekst op basis van job informatie.

**Query Parameters:**
- `requestId` (required): Token van create-company-info

**Request:**
```typescript
{
  jobTitle?: string
  seniorityLevel: SeniorityLevel
  jobSummary?: string
  tasks?: string
  skills?: string
  teamDescription?: string
  writingStyle: {
    writingStyle: WritingStyle
    language: Language
  }
  benefits?: {
    salaryPeriod: SalaryPeriod
    minSalary?: number
    maxSalary?: number
    extraPerks?: string
  }
  contactInfo?: {
    name?: string
    mail?: string
    phoneNumber?: string
  }
}
```

**Response (201):**
```typescript
{
  summary?: string
  companyDescription?: string
  teamDescription?: string
  dayToDayDescription?: string
  jobDescription?: string
  jobUniqueSellingPoints?: string
  requirements?: string
  offer?: string
  contactInformation?: string
}
```

## Zie Ook

- [OpenAPI Specification](../../openapi.yaml) - Complete API specificatie
- [Testing Guide](../../TESTING.md) - Testing best practices
- [Development Plan](../../.cursor/plans/jobly_frontend_setup_33fd30ba.plan.md) - Ontwikkelplan
