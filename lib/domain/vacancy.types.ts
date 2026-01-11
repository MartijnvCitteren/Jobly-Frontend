/**
 * Vacancy Domain Types
 *
 * TypeScript interfaces gegenereerd op basis van OpenAPI specificatie
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Land waar het bedrijf is gevestigd
 */
export enum Country {
  THE_NETHERLANDS = 'THE_NETHERLANDS',
  BELGIUM = 'BELGIUM',
  GERMANY = 'GERMANY',
}

/**
 * Seniority level van de functie
 */
export enum SeniorityLevel {
  INTERN = 'INTERN',
  JUNIOR = 'JUNIOR',
  MEDIOR = 'MEDIOR',
  SENIOR = 'SENIOR',
}

/**
 * Schrijfstijl voor de vacaturetekst
 */
export enum WritingStyle {
  FORMAL = 'FORMAL',
  BUSINESS_CASUAL = 'BUSINESS_CASUAL',
  CASUAL = 'CASUAL',
  CREATIVE = 'CREATIVE',
  TECHNICAL = 'TECHNICAL',
}

/**
 * Taal voor de gegenereerde vacaturetekst
 */
export enum Language {
  DUTCH = 'DUTCH',
  ENGLISH = 'ENGLISH',
  FLEMISH = 'FLEMISH',
  FRENCH = 'FRENCH',
  GERMAN = 'GERMAN',
}

/**
 * Periode voor salaris berekening
 */
export enum SalaryPeriod {
  YEARLY = 'YEARLY',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  DAILY = 'DAILY',
  HOURLY = 'HOURLY',
}

// ============================================================================
// Request DTOs
// ============================================================================

/**
 * Request voor het aanmaken van bedrijfsinformatie
 */
export interface CompanyInfoRequest {
  companyName?: string
  companyWebsite: string
  country: Country
  exampleVacancyUrl?: string
}

/**
 * Schrijfstijl configuratie
 */
export interface WritingStyleRequest {
  writingStyle: WritingStyle
  language: Language
}

/**
 * Voordelen en salarisinformatie
 */
export interface BenefitsRequest {
  salaryPeriod: SalaryPeriod
  minSalary?: number
  maxSalary?: number
  extraPerks?: string
}

/**
 * Contactinformatie voor vacature
 */
export interface ContactInfoRequest {
  name?: string
  mail?: string
  phoneNumber?: string
}

/**
 * Request voor het genereren van een vacature
 */
export interface JobInfoRequest {
  jobTitle?: string
  seniorityLevel: SeniorityLevel
  jobSummary?: string
  tasks?: string
  skills?: string
  teamDescription?: string
  writingStyle: WritingStyleRequest
  benefits?: BenefitsRequest
  contactInfo?: ContactInfoRequest
}

// ============================================================================
// Response DTOs
// ============================================================================

/**
 * Response met token na aanmaken bedrijfsinformatie
 */
export interface CompanyInfoResponse {
  token: string
}

/**
 * Gegenereerde vacaturetekst
 */
export interface GeneratedVacancy {
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

/**
 * Error response van de API
 */
export interface ApiError {
  message?: string
  details?: string
}
