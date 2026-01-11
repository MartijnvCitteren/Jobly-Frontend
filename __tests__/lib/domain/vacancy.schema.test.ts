/**
 * Tests voor Vacancy Domain Validation Schemas
 */

import {
  CompanyInfoRequestSchema,
  JobInfoRequestSchema,
  BenefitsRequestSchema,
  ContactInfoRequestSchema,
  WritingStyleRequestSchema,
  CompanyInfoResponseSchema,
  GeneratedVacancySchema,
} from '@/lib/domain/vacancy.schema'

describe('CompanyInfoRequestSchema', () => {
  it('valideert correcte bedrijfsinformatie', () => {
    const validData = {
      companyName: 'Tech Innovators BV',
      companyWebsite: 'www.techinnovators.nl',
      country: 'THE_NETHERLANDS' as const,
      exampleVacancyUrl: 'www.techinnovators.nl/careers',
    }

    const result = CompanyInfoRequestSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepteert data zonder optionele velden', () => {
    const minimalData = {
      companyWebsite: 'www.example.com',
      country: 'BELGIUM' as const,
    }

    const result = CompanyInfoRequestSchema.safeParse(minimalData)
    expect(result.success).toBe(true)
  })

  it('weigert ongeldige website formaten', () => {
    const invalidData = {
      companyWebsite: 'https://example.com', // Moet beginnen met www.
      country: 'THE_NETHERLANDS' as const,
    }

    const result = CompanyInfoRequestSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('www.')
    }
  })

  it('weigert te lange bedrijfsnaam', () => {
    const invalidData = {
      companyName: 'A'.repeat(51), // Max 50 karakters
      companyWebsite: 'www.example.com',
      country: 'GERMANY' as const,
    }

    const result = CompanyInfoRequestSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('WritingStyleRequestSchema', () => {
  it('valideert correcte schrijfstijl configuratie', () => {
    const validData = {
      writingStyle: 'BUSINESS_CASUAL' as const,
      language: 'DUTCH' as const,
    }

    const result = WritingStyleRequestSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('weigert ongeldige schrijfstijl', () => {
    const invalidData = {
      writingStyle: 'INVALID_STYLE',
      language: 'DUTCH' as const,
    }

    const result = WritingStyleRequestSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('BenefitsRequestSchema', () => {
  it('valideert correcte salaris informatie', () => {
    const validData = {
      salaryPeriod: 'YEARLY' as const,
      minSalary: 50000.0,
      maxSalary: 70000.0,
      extraPerks: 'Flexible hours, remote work',
    }

    const result = BenefitsRequestSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepteert data zonder optionele salaris velden', () => {
    const minimalData = {
      salaryPeriod: 'MONTHLY' as const,
    }

    const result = BenefitsRequestSchema.safeParse(minimalData)
    expect(result.success).toBe(true)
  })

  it('weigert maxSalary lager dan minSalary', () => {
    const invalidData = {
      salaryPeriod: 'YEARLY' as const,
      minSalary: 70000.0,
      maxSalary: 50000.0, // Lager dan minimum
    }

    const result = BenefitsRequestSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Maximum salaris')
    }
  })

  it('weigert te korte extraPerks', () => {
    const invalidData = {
      salaryPeriod: 'YEARLY' as const,
      extraPerks: 'Short', // Min 10 karakters
    }

    const result = BenefitsRequestSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('weigert salaris boven het maximum', () => {
    const invalidData = {
      salaryPeriod: 'YEARLY' as const,
      minSalary: 1000000.0, // Boven 999999.99
    }

    const result = BenefitsRequestSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('ContactInfoRequestSchema', () => {
  it('valideert correcte contactinformatie', () => {
    const validData = {
      name: 'Sarah Johnson',
      mail: 'sarah@example.com',
      phoneNumber: '+31 20 123 4567',
    }

    const result = ContactInfoRequestSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepteert lege contactinformatie', () => {
    const emptyData = {}

    const result = ContactInfoRequestSchema.safeParse(emptyData)
    expect(result.success).toBe(true)
  })

  it('weigert ongeldig email formaat', () => {
    const invalidData = {
      mail: 'invalid-email',
    }

    const result = ContactInfoRequestSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('weigert te kort telefoonnummer', () => {
    const invalidData = {
      phoneNumber: '123', // Min 10 karakters
    }

    const result = ContactInfoRequestSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('weigert ongeldige karakters in telefoonnummer', () => {
    const invalidData = {
      phoneNumber: '+31-20-ABC-1234', // ABC is niet toegestaan
    }

    const result = ContactInfoRequestSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('JobInfoRequestSchema', () => {
  it('valideert complete vacature informatie', () => {
    const validData = {
      jobTitle: 'Senior Full Stack Developer',
      seniorityLevel: 'SENIOR' as const,
      jobSummary:
        'We are looking for an experienced Full Stack Developer to join our innovative team.',
      tasks: 'Design and develop scalable web applications, mentor junior developers.',
      skills: 'Java, Spring Boot, React, TypeScript, AWS, Docker.',
      teamDescription: 'Join our agile team of 8 passionate developers.',
      writingStyle: {
        writingStyle: 'BUSINESS_CASUAL' as const,
        language: 'ENGLISH' as const,
      },
      benefits: {
        salaryPeriod: 'YEARLY' as const,
        minSalary: 65000.0,
        maxSalary: 85000.0,
        extraPerks: 'Flexible working hours, remote work options',
      },
      contactInfo: {
        name: 'Sarah Johnson',
        mail: 'sarah@example.com',
        phoneNumber: '+31201234567',
      },
    }

    const result = JobInfoRequestSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepteert minimale vereiste velden', () => {
    const minimalData = {
      seniorityLevel: 'JUNIOR' as const,
      writingStyle: {
        writingStyle: 'CASUAL' as const,
        language: 'DUTCH' as const,
      },
    }

    const result = JobInfoRequestSchema.safeParse(minimalData)
    expect(result.success).toBe(true)
  })

  it('weigert te korte functietitel', () => {
    const invalidData = {
      jobTitle: 'A', // Min 2 karakters
      seniorityLevel: 'SENIOR' as const,
      writingStyle: {
        writingStyle: 'FORMAL' as const,
        language: 'ENGLISH' as const,
      },
    }

    const result = JobInfoRequestSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('weigert te korte jobSummary', () => {
    const invalidData = {
      jobSummary: 'Too short', // Min 20 karakters
      seniorityLevel: 'MEDIOR' as const,
      writingStyle: {
        writingStyle: 'TECHNICAL' as const,
        language: 'GERMAN' as const,
      },
    }

    const result = JobInfoRequestSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('CompanyInfoResponseSchema', () => {
  it('valideert correcte token response', () => {
    const validData = {
      token: '550e8400-e29b-41d4-a716-446655440000',
    }

    const result = CompanyInfoResponseSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('weigert ongeldige UUID', () => {
    const invalidData = {
      token: 'not-a-uuid',
    }

    const result = CompanyInfoResponseSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('GeneratedVacancySchema', () => {
  it('valideert complete gegenereerde vacature', () => {
    const validData = {
      summary: 'Join our team as a Senior Developer',
      companyDescription: 'We are a leading tech company...',
      teamDescription: 'Our team consists of 10 developers...',
      dayToDayDescription: 'Your typical day will involve...',
      jobDescription: 'As a Senior Developer you will...',
      jobUniqueSellingPoints: 'Work with cutting-edge tech...',
      requirements: '5+ years of experience...',
      offer: 'Competitive salary and benefits...',
      contactInformation: 'Contact Sarah at sarah@example.com',
    }

    const result = GeneratedVacancySchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepteert lege gegenereerde vacature', () => {
    const emptyData = {}

    const result = GeneratedVacancySchema.safeParse(emptyData)
    expect(result.success).toBe(true)
  })
})
