import { render, screen } from '@testing-library/react'
import { ReviewStep, ReviewStepData } from './ReviewStep'
import {
  Country,
  SeniorityLevel,
  WritingStyle,
  Language,
  SalaryPeriod,
} from '@/lib/domain/vacancy.types'

describe('ReviewStep', () => {
  const completeData: ReviewStepData = {
    companyInfo: {
      companyName: 'TechCorp',
      companyWebsite: 'www.techcorp.nl',
      country: Country.THE_NETHERLANDS,
      exampleVacancyUrl: 'www.example.com/job',
    },
    jobInfo: {
      jobTitle: 'Senior Java Developer',
      seniorityLevel: SeniorityLevel.SENIOR,
      jobSummary: 'An exciting opportunity to work with cutting-edge technology',
      tasks: 'Develop and maintain enterprise applications',
      skills: 'Java, Spring Boot, Microservices',
      teamDescription: 'A dynamic team of experienced developers',
      writingStyle: {
        writingStyle: WritingStyle.BUSINESS_CASUAL,
        language: Language.DUTCH,
      },
      benefits: {
        salaryPeriod: SalaryPeriod.YEARLY,
        minSalary: 60000,
        maxSalary: 80000,
        extraPerks: 'Company car, remote work, pension plan',
      },
      contactInfo: {
        name: 'Jan Jansen',
        mail: 'jan@techcorp.nl',
        phoneNumber: '+31 20 123 4567',
      },
    },
  }

  it('should render all company information', () => {
    render(<ReviewStep data={completeData} />)

    expect(screen.getByText('TechCorp')).toBeInTheDocument()
    expect(screen.getByText('www.techcorp.nl')).toBeInTheDocument()
    expect(screen.getByText('Nederland')).toBeInTheDocument()
    expect(screen.getByText('www.example.com/job')).toBeInTheDocument()
  })

  it('should render all job basics information', () => {
    render(<ReviewStep data={completeData} />)

    expect(screen.getByText('Senior Java Developer')).toBeInTheDocument()
    expect(screen.getByText('Senior')).toBeInTheDocument()
    expect(screen.getByText(/exciting opportunity/i)).toBeInTheDocument()
  })

  it('should render all job requirements information', () => {
    render(<ReviewStep data={completeData} />)

    expect(screen.getByText(/develop and maintain/i)).toBeInTheDocument()
    expect(screen.getByText(/java, spring boot/i)).toBeInTheDocument()
    expect(screen.getByText(/dynamic team/i)).toBeInTheDocument()
  })

  it('should render writing style information', () => {
    render(<ReviewStep data={completeData} />)

    expect(screen.getByText('Zakelijk Informeel')).toBeInTheDocument()
    expect(screen.getByText('Nederlands')).toBeInTheDocument()
  })

  it('should render salary information correctly formatted', () => {
    render(<ReviewStep data={completeData} />)

    expect(screen.getByText(/€60\.000 - €80\.000 per jaar/i)).toBeInTheDocument()
    expect(screen.getByText(/company car, remote work/i)).toBeInTheDocument()
  })

  it('should render contact information', () => {
    render(<ReviewStep data={completeData} />)

    expect(screen.getByText('Jan Jansen')).toBeInTheDocument()
    expect(screen.getByText('jan@techcorp.nl')).toBeInTheDocument()
    expect(screen.getByText('+31 20 123 4567')).toBeInTheDocument()
  })

  it('should display "-" for missing optional fields', () => {
    const minimalData: ReviewStepData = {
      companyInfo: {
        companyWebsite: 'www.example.nl',
        country: Country.BELGIUM,
      },
      jobInfo: {
        seniorityLevel: SeniorityLevel.JUNIOR,
        writingStyle: {
          writingStyle: WritingStyle.FORMAL,
          language: Language.FLEMISH,
        },
      },
    }

    render(<ReviewStep data={minimalData} />)

    // Should show multiple "-" for missing fields
    const placeholders = screen.getAllByText('-')
    expect(placeholders.length).toBeGreaterThan(0)
  })

  it('should truncate long text fields', () => {
    const dataWithLongText: ReviewStepData = {
      companyInfo: {
        companyWebsite: 'www.example.nl',
        country: Country.GERMANY,
      },
      jobInfo: {
        seniorityLevel: SeniorityLevel.MEDIOR,
        jobSummary: 'A'.repeat(150), // Longer than 100 characters
        writingStyle: {
          writingStyle: WritingStyle.TECHNICAL,
          language: Language.GERMAN,
        },
      },
    }

    render(<ReviewStep data={dataWithLongText} />)

    // Should show truncated text with ellipsis
    expect(screen.getByText(/A{100}\.\.\./)).toBeInTheDocument()
  })

  it('should format salary with only minimum value', () => {
    const dataWithMinSalary: ReviewStepData = {
      companyInfo: {
        companyWebsite: 'www.example.nl',
        country: Country.THE_NETHERLANDS,
      },
      jobInfo: {
        seniorityLevel: SeniorityLevel.SENIOR,
        writingStyle: {
          writingStyle: WritingStyle.CASUAL,
          language: Language.DUTCH,
        },
        benefits: {
          salaryPeriod: SalaryPeriod.MONTHLY,
          minSalary: 5000,
        },
      },
    }

    render(<ReviewStep data={dataWithMinSalary} />)

    expect(screen.getByText(/vanaf €5\.000 per maand/i)).toBeInTheDocument()
  })

  it('should format salary with only maximum value', () => {
    const dataWithMaxSalary: ReviewStepData = {
      companyInfo: {
        companyWebsite: 'www.example.nl',
        country: Country.THE_NETHERLANDS,
      },
      jobInfo: {
        seniorityLevel: SeniorityLevel.INTERN,
        writingStyle: {
          writingStyle: WritingStyle.CREATIVE,
          language: Language.ENGLISH,
        },
        benefits: {
          salaryPeriod: SalaryPeriod.HOURLY,
          maxSalary: 25,
        },
      },
    }

    render(<ReviewStep data={dataWithMaxSalary} />)

    expect(screen.getByText(/tot €25 per uur/i)).toBeInTheDocument()
  })

  it('should not render benefits section when no benefits are provided', () => {
    const dataWithoutBenefits: ReviewStepData = {
      companyInfo: {
        companyWebsite: 'www.example.nl',
        country: Country.BELGIUM,
      },
      jobInfo: {
        seniorityLevel: SeniorityLevel.JUNIOR,
        writingStyle: {
          writingStyle: WritingStyle.FORMAL,
          language: Language.FRENCH,
        },
      },
    }

    render(<ReviewStep data={dataWithoutBenefits} />)

    expect(screen.queryByText(/salaris & voordelen/i)).not.toBeInTheDocument()
  })

  it('should not render contact section when no contact info is provided', () => {
    const dataWithoutContact: ReviewStepData = {
      companyInfo: {
        companyWebsite: 'www.example.nl',
        country: Country.GERMANY,
      },
      jobInfo: {
        seniorityLevel: SeniorityLevel.MEDIOR,
        writingStyle: {
          writingStyle: WritingStyle.TECHNICAL,
          language: Language.GERMAN,
        },
      },
    }

    render(<ReviewStep data={dataWithoutContact} />)

    expect(screen.queryByText(/contactinformatie/i)).not.toBeInTheDocument()
  })

  it('should display info message about editing after generation', () => {
    render(<ReviewStep data={completeData} />)

    expect(
      screen.getByText(/na het genereren kun je de vacaturetekst nog bewerken/i)
    ).toBeInTheDocument()
  })
})
