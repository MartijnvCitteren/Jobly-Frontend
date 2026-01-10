/**
 * Vacancy Domain Validation Schemas
 *
 * Zod schemas voor runtime validatie van vacancy data
 * Gebaseerd op OpenAPI specificatie validatieregels
 */

import { z } from 'zod'

// ============================================================================
// Enums
// ============================================================================

export const CountrySchema = z.enum([
  'THE_NETHERLANDS',
  'BELGIUM',
  'GERMANY',
])

export const SeniorityLevelSchema = z.enum([
  'INTERN',
  'JUNIOR',
  'MEDIOR',
  'SENIOR',
])

export const WritingStyleSchema = z.enum([
  'FORMAL',
  'BUSINESS_CASUAL',
  'CASUAL',
  'CREATIVE',
  'TECHNICAL',
])

export const LanguageSchema = z.enum([
  'DUTCH',
  'ENGLISH',
  'FLEMISH',
  'FRENCH',
  'GERMAN',
])

export const SalaryPeriodSchema = z.enum([
  'YEARLY',
  'MONTHLY',
  'WEEKLY',
  'DAILY',
  'HOURLY',
])

// ============================================================================
// Request Schemas
// ============================================================================

/**
 * Company Info Request Schema
 * Validatie voor bedrijfsinformatie aanmaken
 */
export const CompanyInfoRequestSchema = z.object({
  companyName: z
    .string()
    .min(1, 'Bedrijfsnaam moet minimaal 1 karakter bevatten')
    .max(50, 'Bedrijfsnaam mag maximaal 50 karakters bevatten')
    .optional(),
  companyWebsite: z
    .string()
    .min(1, 'Website is verplicht')
    .max(50, 'Website mag maximaal 50 karakters bevatten')
    .regex(/^www\..+\..+$/, "Website moet beginnen met 'www.' en een geldig domein bevatten"),
  country: CountrySchema,
  exampleVacancyUrl: z
    .string()
    .max(100, 'Voorbeeld vacature URL mag maximaal 100 karakters bevatten')
    .regex(/^www\..+\..+$/, "URL moet beginnen met 'www.' en een geldig domein bevatten")
    .optional(),
})

/**
 * Writing Style Request Schema
 */
export const WritingStyleRequestSchema = z.object({
  writingStyle: WritingStyleSchema,
  language: LanguageSchema,
})

/**
 * Benefits Request Schema
 * Validatie voor salaris en voordelen
 */
export const BenefitsRequestSchema = z.object({
  salaryPeriod: SalaryPeriodSchema,
  minSalary: z
    .number()
    .min(0, 'Minimum salaris moet 0 of hoger zijn')
    .max(999999.99, 'Minimum salaris mag niet hoger zijn dan 999999.99')
    .multipleOf(0.01, 'Salaris moet in centen nauwkeurig zijn')
    .optional(),
  maxSalary: z
    .number()
    .min(0, 'Maximum salaris moet 0 of hoger zijn')
    .max(999999.99, 'Maximum salaris mag niet hoger zijn dan 999999.99')
    .multipleOf(0.01, 'Salaris moet in centen nauwkeurig zijn')
    .optional(),
  extraPerks: z
    .string()
    .min(10, 'Extra voordelen moeten minimaal 10 karakters bevatten')
    .max(100, 'Extra voordelen mogen maximaal 100 karakters bevatten')
    .optional(),
}).refine(
  (data) => {
    // Als beide salaris velden ingevuld zijn, moet max >= min zijn
    if (data.minSalary !== undefined && data.maxSalary !== undefined) {
      return data.maxSalary >= data.minSalary
    }
    return true
  },
  {
    message: 'Maximum salaris moet gelijk of hoger zijn dan minimum salaris',
    path: ['maxSalary'],
  }
)

/**
 * Contact Info Request Schema
 */
export const ContactInfoRequestSchema = z.object({
  name: z
    .string()
    .max(25, 'Naam mag maximaal 25 karakters bevatten')
    .optional(),
  mail: z
    .string()
    .max(50, 'Email mag maximaal 50 karakters bevatten')
    .email('Ongeldig email formaat')
    .optional(),
  phoneNumber: z
    .string()
    .min(10, 'Telefoonnummer moet minimaal 10 karakters bevatten')
    .max(15, 'Telefoonnummer mag maximaal 15 karakters bevatten')
    .regex(/^[0-9\-+ ]+$/, 'Telefoonnummer mag alleen cijfers, -, + en spaties bevatten')
    .optional(),
})

/**
 * Job Info Request Schema
 * Validatie voor vacature informatie
 */
export const JobInfoRequestSchema = z.object({
  jobTitle: z
    .string()
    .min(2, 'Functietitel moet minimaal 2 karakters bevatten')
    .max(75, 'Functietitel mag maximaal 75 karakters bevatten')
    .optional(),
  seniorityLevel: SeniorityLevelSchema,
  jobSummary: z
    .string()
    .min(20, 'Functie samenvatting moet minimaal 20 karakters bevatten')
    .max(300, 'Functie samenvatting mag maximaal 300 karakters bevatten')
    .optional(),
  tasks: z
    .string()
    .min(10, 'Taken moeten minimaal 10 karakters bevatten')
    .max(300, 'Taken mogen maximaal 300 karakters bevatten')
    .optional(),
  skills: z
    .string()
    .min(10, 'Vaardigheden moeten minimaal 10 karakters bevatten')
    .max(300, 'Vaardigheden mogen maximaal 300 karakters bevatten')
    .optional(),
  teamDescription: z
    .string()
    .min(10, 'Team beschrijving moet minimaal 10 karakters bevatten')
    .max(300, 'Team beschrijving mag maximaal 300 karakters bevatten')
    .optional(),
  writingStyle: WritingStyleRequestSchema,
  benefits: BenefitsRequestSchema.optional(),
  contactInfo: ContactInfoRequestSchema.optional(),
})

// ============================================================================
// Response Schemas
// ============================================================================

/**
 * Company Info Response Schema
 */
export const CompanyInfoResponseSchema = z.object({
  token: z.string().uuid('Token moet een geldige UUID zijn'),
})

/**
 * Generated Vacancy Schema
 */
export const GeneratedVacancySchema = z.object({
  summary: z.string().optional(),
  companyDescription: z.string().optional(),
  teamDescription: z.string().optional(),
  dayToDayDescription: z.string().optional(),
  jobDescription: z.string().optional(),
  jobUniqueSellingPoints: z.string().optional(),
  requirements: z.string().optional(),
  offer: z.string().optional(),
  contactInformation: z.string().optional(),
})

/**
 * API Error Schema
 */
export const ApiErrorSchema = z.object({
  message: z.string().optional(),
  details: z.string().optional(),
})

// ============================================================================
// Type Inference - exporteer inferred types voor gebruik in components
// ============================================================================

export type CompanyInfoRequestInput = z.input<typeof CompanyInfoRequestSchema>
export type CompanyInfoRequestOutput = z.output<typeof CompanyInfoRequestSchema>

export type JobInfoRequestInput = z.input<typeof JobInfoRequestSchema>
export type JobInfoRequestOutput = z.output<typeof JobInfoRequestSchema>

export type GeneratedVacancyOutput = z.output<typeof GeneratedVacancySchema>
export type ApiErrorOutput = z.output<typeof ApiErrorSchema>
