/**
 * Vacancy Repository
 *
 * Repository pattern voor vacancy API calls.
 * Volgt het Repository Pattern voor clean separation of concerns.
 */

import { post } from './client'
import { API_ENDPOINTS, API_CONFIG } from '@/lib/config/constants'
import type {
  CompanyInfoRequest,
  CompanyInfoResponse,
  JobInfoRequest,
  GeneratedVacancy,
} from '@/lib/domain/vacancy.types'

/**
 * Creëer bedrijfsinformatie en ontvang een token
 *
 * @param companyInfo - Bedrijfsinformatie
 * @returns Promise met token
 */
export async function createCompanyInfo(
  companyInfo: CompanyInfoRequest
): Promise<CompanyInfoResponse> {
  return post<CompanyInfoResponse>(API_ENDPOINTS.COMPANY_INFO, companyInfo)
}

/**
 * Genereer vacaturetekst op basis van job informatie
 *
 * @param requestId - Token ontvangen van createCompanyInfo (wordt in header meegegeven)
 * @param jobInfo - Job informatie voor het genereren van de vacature
 * @returns Promise met gegenereerde vacaturetekst
 */
export async function createVacancy(
  requestId: string,
  jobInfo: JobInfoRequest
): Promise<GeneratedVacancy> {
  return post<GeneratedVacancy>(
    API_ENDPOINTS.CREATE_VACANCY,
    jobInfo,
    {
      headers: {
        [API_CONFIG.REQUEST_ID_HEADER]: requestId,
      },
    }
  )
}

/**
 * Complete workflow: creëer bedrijf en genereer vacature in één keer
 *
 * @param companyInfo - Bedrijfsinformatie
 * @param jobInfo - Job informatie
 * @returns Promise met gegenereerde vacaturetekst
 */
export async function createCompanyAndVacancy(
  companyInfo: CompanyInfoRequest,
  jobInfo: JobInfoRequest
): Promise<GeneratedVacancy> {
  // Stap 1: Maak bedrijfsinformatie aan en ontvang token
  const { token } = await createCompanyInfo(companyInfo)

  // Stap 2: Gebruik token om vacature te genereren
  return createVacancy(token, jobInfo)
}
