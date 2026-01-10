import {
  createCompanyInfo,
  createVacancy,
  createCompanyAndVacancy,
} from '@/lib/api/vacancy-repository'
import {
  Country,
  SeniorityLevel,
  WritingStyle,
  Language,
  SalaryPeriod,
} from '@/lib/domain/vacancy.types'
import type { CompanyInfoRequest, JobInfoRequest } from '@/lib/domain/vacancy.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/api/v1'

// Mock global fetch
global.fetch = jest.fn()

beforeEach(() => {
  ;(global.fetch as jest.Mock).mockClear()
})

describe('Vacancy Repository', () => {
  describe('createCompanyInfo', () => {
    it('should successfully create company info and return token', async () => {
      const companyInfo: CompanyInfoRequest = {
        companyName: 'Tech Innovators BV',
        companyWebsite: 'www.techinnovators.nl',
        country: Country.THE_NETHERLANDS,
        exampleVacancyUrl: 'www.techinnovators.nl/careers/senior-developer',
      }

      const mockResponse = {
        token: '550e8400-e29b-41d4-a716-446655440000',
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const response = await createCompanyInfo(companyInfo)

      expect(response).toEqual(mockResponse)
      expect(response.token).toBeDefined()
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/create-company-info`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(companyInfo),
        })
      )
    })

    it('should handle validation error', async () => {
      const invalidCompanyInfo: CompanyInfoRequest = {
        companyWebsite: '',
        country: Country.THE_NETHERLANDS,
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          message: 'Validation failed',
          details: "website address should look like 'www.example.com'",
        }),
      })

      await expect(createCompanyInfo(invalidCompanyInfo)).rejects.toThrow()
    })
  })

  describe('createVacancy', () => {
    it('should successfully create vacancy with requestId', async () => {
      const requestId = '550e8400-e29b-41d4-a716-446655440000'
      const jobInfo: JobInfoRequest = {
        jobTitle: 'Senior Full Stack Developer',
        seniorityLevel: SeniorityLevel.SENIOR,
        jobSummary:
          'We are looking for an experienced Full Stack Developer to join our innovative team working on cutting-edge cloud solutions.',
        tasks:
          'Design and develop scalable web applications, mentor junior developers, participate in architecture decisions, conduct code reviews.',
        skills:
          'Java, Spring Boot, React, TypeScript, AWS, Docker, Kubernetes, microservices architecture, CI/CD pipelines.',
        teamDescription:
          'Join our agile team of 8 passionate developers working on innovative cloud-based SaaS products used by thousands of customers.',
        writingStyle: {
          writingStyle: WritingStyle.BUSINESS_CASUAL,
          language: Language.ENGLISH,
        },
        benefits: {
          salaryPeriod: SalaryPeriod.YEARLY,
          minSalary: 65000.0,
          maxSalary: 85000.0,
          extraPerks:
            'Flexible working hours, remote work options, yearly training budget, company laptop and phone',
        },
        contactInfo: {
          name: 'Sarah Johnson',
          mail: 'sarah.johnson@example.com',
          phoneNumber: '+31 20 123 4567',
        },
      }

      const mockResponse = {
        summary: 'Join our team as a Senior Full Stack Developer',
        companyDescription:
          'Tech Innovators BV is a leading software company specializing in cloud-based solutions...',
        teamDescription:
          'Work alongside a talented team of 8 developers in an agile environment...',
        dayToDayDescription:
          'Your day will involve designing scalable applications, mentoring team members...',
        jobDescription:
          "As a Senior Full Stack Developer, you'll be responsible for building and maintaining...",
        jobUniqueSellingPoints:
          'Work on cutting-edge technology, influence architectural decisions...',
        requirements: '5+ years of Java development, strong React skills, experience with AWS...',
        offer:
          'Competitive salary between €65,000 and €85,000, flexible hours, remote work...',
        contactInformation:
          'Interested? Contact Sarah Johnson at sarah.johnson@example.com or +31 20 123 4567',
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const response = await createVacancy(requestId, jobInfo)

      expect(response).toEqual(mockResponse)
      expect(response.summary).toBeDefined()
      expect(response.jobDescription).toBeDefined()
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/create-vacancy?requestId=${requestId}`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(jobInfo),
        })
      )
    })

    it('should handle invalid requestId', async () => {
      const invalidRequestId = 'invalid-token'
      const jobInfo: JobInfoRequest = {
        seniorityLevel: SeniorityLevel.SENIOR,
        writingStyle: {
          writingStyle: WritingStyle.BUSINESS_CASUAL,
          language: Language.ENGLISH,
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          message: 'Request ID not found',
          details: 'The provided requestId does not exist or has expired',
        }),
      })

      await expect(createVacancy(invalidRequestId, jobInfo)).rejects.toThrow()
    })

    it('should handle validation error for missing required fields', async () => {
      const requestId = '550e8400-e29b-41d4-a716-446655440000'
      const invalidJobInfo = {} as JobInfoRequest

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          message: 'Validation failed',
          details: 'seniorityLevel and writingStyle are required',
        }),
      })

      await expect(createVacancy(requestId, invalidJobInfo)).rejects.toThrow()
    })
  })

  describe('createCompanyAndVacancy', () => {
    it('should create company and vacancy in one workflow', async () => {
      const companyInfo: CompanyInfoRequest = {
        companyName: 'Tech Innovators BV',
        companyWebsite: 'www.techinnovators.nl',
        country: Country.THE_NETHERLANDS,
      }

      const jobInfo: JobInfoRequest = {
        jobTitle: 'Senior Java Developer',
        seniorityLevel: SeniorityLevel.SENIOR,
        writingStyle: {
          writingStyle: WritingStyle.BUSINESS_CASUAL,
          language: Language.ENGLISH,
        },
      }

      const mockToken = {
        token: '550e8400-e29b-41d4-a716-446655440000',
      }

      const mockVacancy = {
        summary: 'Join our team as a Senior Java Developer',
        jobDescription: 'Exciting opportunity for a Senior Java Developer...',
      }

      // Mock eerste call (company info)
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockToken,
      })

      // Mock tweede call (vacancy)
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockVacancy,
      })

      const response = await createCompanyAndVacancy(companyInfo, jobInfo)

      expect(response).toEqual(mockVacancy)
      expect(global.fetch).toHaveBeenCalledTimes(2)

      // Verify eerste call
      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        `${API_BASE_URL}/create-company-info`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(companyInfo),
        })
      )

      // Verify tweede call met token
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        `${API_BASE_URL}/create-vacancy?requestId=${mockToken.token}`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(jobInfo),
        })
      )
    })

    it('should fail if company creation fails', async () => {
      const companyInfo: CompanyInfoRequest = {
        companyWebsite: 'invalid',
        country: Country.THE_NETHERLANDS,
      }

      const jobInfo: JobInfoRequest = {
        seniorityLevel: SeniorityLevel.SENIOR,
        writingStyle: {
          writingStyle: WritingStyle.BUSINESS_CASUAL,
          language: Language.ENGLISH,
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          message: 'Validation failed',
          details: "website address should look like 'www.example.com'",
        }),
      })

      await expect(createCompanyAndVacancy(companyInfo, jobInfo)).rejects.toThrow()

      // Verify dat er geen tweede call is gemaakt
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('Different seniority levels', () => {
    it('should handle INTERN vacancy', async () => {
      const requestId = '550e8400-e29b-41d4-a716-446655440000'
      const jobInfo: JobInfoRequest = {
        jobTitle: 'Software Development Intern',
        seniorityLevel: SeniorityLevel.INTERN,
        writingStyle: {
          writingStyle: WritingStyle.CASUAL,
          language: Language.DUTCH,
        },
        benefits: {
          salaryPeriod: SalaryPeriod.MONTHLY,
          minSalary: 500.0,
          maxSalary: 750.0,
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          summary: 'Stagiair gezocht!',
          jobDescription: 'Leuke stage bij een innovatief bedrijf...',
        }),
      })

      const response = await createVacancy(requestId, jobInfo)

      expect(response).toBeDefined()
      expect(response.summary).toBeDefined()
    })
  })

  describe('Different countries', () => {
    it.each([
      [Country.THE_NETHERLANDS, 'www.example.nl'],
      [Country.BELGIUM, 'www.example.be'],
      [Country.GERMANY, 'www.example.de'],
    ])('should handle country: %s', async (country, website) => {
      const companyInfo: CompanyInfoRequest = {
        companyName: 'Test Company',
        companyWebsite: website,
        country,
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'mock-token' }),
      })

      const response = await createCompanyInfo(companyInfo)

      expect(response.token).toBeDefined()
    })
  })
})
