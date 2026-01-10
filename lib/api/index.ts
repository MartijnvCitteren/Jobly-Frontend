/**
 * API Module Export
 *
 * Centraal export punt voor alle API gerelateerde modules
 */

// Export base client
export { apiFetch, get, post, put, del, ApiError } from './client'
export type { FetchOptions } from './client'

// Export vacancy repository
export { createCompanyInfo, createVacancy, createCompanyAndVacancy } from './vacancy-repository'

// Export domain types
export type {
  CompanyInfoRequest,
  CompanyInfoResponse,
  JobInfoRequest,
  GeneratedVacancy,
  WritingStyleRequest,
  BenefitsRequest,
  ContactInfoRequest,
  ApiError as ApiErrorResponse,
} from '@/lib/domain/vacancy.types'

export {
  Country,
  SeniorityLevel,
  WritingStyle,
  Language,
  SalaryPeriod,
} from '@/lib/domain/vacancy.types'
