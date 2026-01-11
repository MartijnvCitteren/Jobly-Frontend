'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { VacancyWizard } from '@/components/vacancy/VacancyWizard'
import {
  CompanyInfoStep,
  JobBasicsStep,
  JobRequirementsStep,
  JobDetailsStep,
  ReviewStep,
} from '@/components/vacancy/steps'
import type { WizardStep } from '@/lib/hooks/useFormWizard'
import type {
  CompanyInfoRequest,
  JobInfoRequest,
  WritingStyle,
  Language,
  SeniorityLevel,
} from '@/lib/domain/vacancy.types'

interface VacancyFormData {
  companyInfo: Partial<CompanyInfoRequest>
  jobInfo: Partial<JobInfoRequest>
}

/**
 * Create Vacancy Page
 *
 * Wizard pagina voor het aanmaken van een nieuwe vacature
 */
export default function CreateVacancyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companyToken, setCompanyToken] = useState<string | null>(null)
  const [formData, setFormData] = useState<VacancyFormData>({
    companyInfo: {},
    jobInfo: {
      writingStyle: {
        writingStyle: '' as WritingStyle,
        language: '' as Language,
      },
      seniorityLevel: '' as SeniorityLevel,
    },
  })

  // Initiële form data
  const initialData: VacancyFormData = {
    companyInfo: {},
    jobInfo: {
      writingStyle: {
        writingStyle: '' as WritingStyle,
        language: '' as Language,
      },
      seniorityLevel: '' as SeniorityLevel,
    },
  }

  // Wizard stappen configuratie - deze moet binnen de component zijn om toegang tot formData te hebben
  const steps: WizardStep[] = [
    {
      id: 'company',
      label: 'Bedrijf',
      validate: () => {
        // Verplichte velden: companyWebsite en country
        return !!(
          formData.companyInfo.companyWebsite &&
          formData.companyInfo.companyWebsite.length > 0 &&
          formData.companyInfo.country
        )
      },
    },
    {
      id: 'basics',
      label: 'Basis',
      validate: () => {
        // Verplicht veld: seniorityLevel
        return !!formData.jobInfo.seniorityLevel
      },
    },
    {
      id: 'requirements',
      label: 'Eisen',
      validate: () => true, // Alle velden zijn optioneel
    },
    {
      id: 'details',
      label: 'Details',
      validate: () => {
        // Verplichte velden: writingStyle en language
        return !!(
          formData.jobInfo.writingStyle?.writingStyle && formData.jobInfo.writingStyle?.language
        )
      },
    },
    {
      id: 'review',
      label: 'Controleren',
      validate: () => true, // Review stap heeft geen extra validatie
    },
  ]

  // Render functie voor de huidige stap
  const renderStep = ({
    stepId,
    formData: wizardFormData,
    updateFormData,
  }: {
    stepId: string
    stepIndex: number
    formData: VacancyFormData
    updateFormData: (data: Partial<VacancyFormData>) => void
  }) => {
    // Update local state wanneer wizard data verandert
    if (wizardFormData !== formData) {
      setFormData(wizardFormData)
    }

    switch (stepId) {
      case 'company':
        return (
          <CompanyInfoStep
            data={wizardFormData.companyInfo}
            onChange={(companyInfo) => {
              const newData = { companyInfo }
              updateFormData(newData)
              setFormData({ ...wizardFormData, ...newData })
            }}
          />
        )

      case 'basics':
        return (
          <JobBasicsStep
            data={{
              jobTitle: wizardFormData.jobInfo.jobTitle,
              seniorityLevel: wizardFormData.jobInfo.seniorityLevel!,
              jobSummary: wizardFormData.jobInfo.jobSummary,
            }}
            onChange={(jobBasics) => {
              const newData = {
                jobInfo: {
                  ...wizardFormData.jobInfo,
                  ...jobBasics,
                },
              }
              updateFormData(newData)
              setFormData({ ...wizardFormData, ...newData })
            }}
          />
        )

      case 'requirements':
        return (
          <JobRequirementsStep
            data={{
              tasks: wizardFormData.jobInfo.tasks,
              skills: wizardFormData.jobInfo.skills,
              teamDescription: wizardFormData.jobInfo.teamDescription,
            }}
            onChange={(requirements) => {
              const newData = {
                jobInfo: {
                  ...wizardFormData.jobInfo,
                  ...requirements,
                },
              }
              updateFormData(newData)
              setFormData({ ...wizardFormData, ...newData })
            }}
          />
        )

      case 'details':
        return (
          <JobDetailsStep
            data={{
              writingStyle: wizardFormData.jobInfo.writingStyle!,
              benefits: wizardFormData.jobInfo.benefits,
              contactInfo: wizardFormData.jobInfo.contactInfo,
            }}
            onChange={(details) => {
              const newData = {
                jobInfo: {
                  ...wizardFormData.jobInfo,
                  ...details,
                },
              }
              updateFormData(newData)
              setFormData({ ...wizardFormData, ...newData })
            }}
          />
        )

      case 'review':
        return (
          <ReviewStep
            data={{
              companyInfo: wizardFormData.companyInfo,
              jobInfo: wizardFormData.jobInfo,
            }}
          />
        )

      default:
        return <div>Onbekende stap</div>
    }
  }

  // Handler wanneer gebruiker naar een andere stap gaat
  const handleStepChange = async ({
    fromStepId,
    formData: currentFormData,
  }: {
    fromStepIndex: number
    toStepIndex: number
    fromStepId: string
    toStepId: string
    formData: VacancyFormData
  }) => {
    // Als gebruiker stap 1 (company) verlaat en we hebben nog geen token
    if (fromStepId === 'company' && !companyToken) {
      try {
        console.log('Verzenden bedrijfsinformatie naar API...')

        // Import de repository functie
        const { createCompanyInfo } = await import('@/lib/api/vacancy-repository')

        // Cast de data naar de juiste types (alle required velden zijn gevalideerd)
        const companyInfo = currentFormData.companyInfo as CompanyInfoRequest

        // Fire-and-forget: roep API aan maar wacht niet op response
        // We doen dit asynchroon zodat de gebruiker direct naar de volgende stap kan
        createCompanyInfo(companyInfo)
          .then((response) => {
            console.log('✅ Bedrijfsinformatie succesvol verstuurd, token ontvangen:', response.token)
            setCompanyToken(response.token)
          })
          .catch((error) => {
            console.error('❌ Fout bij het verzenden van bedrijfsinformatie:', error)
            console.error('Error details:', {
              name: error?.name,
              message: error?.message,
              status: error?.status,
              response: error?.response,
              stack: error?.stack,
            })

            // Alleen als er meteen een error is, tonen we deze
            const errorMessage =
              error instanceof Error ? error.message : 'Er is een onbekende fout opgetreden'
            alert(
              `Er is een fout opgetreden bij het verwerken van de bedrijfsinformatie:\n\n${errorMessage}\n\nJe kunt doorgaan, maar het genereren van de vacature kan later mislukken.`
            )
          })
      } catch (error) {
        console.error('Onverwachte fout:', error)
      }
    }
  }

  // Submit handler
  const handleSubmit = async (data: VacancyFormData) => {
    setIsSubmitting(true)
    try {
      console.log('Genereren vacature...')

      // Import de repository functie
      const { createVacancy, createCompanyInfo } = await import('@/lib/api/vacancy-repository')

      // Cast de data naar de juiste types (alle required velden zijn gevalideerd)
      const jobInfo = data.jobInfo as JobInfoRequest

      let token = companyToken

      // Als we om een of andere reden nog geen token hebben, maak dan alsnog company info aan
      if (!token) {
        console.log('Geen token gevonden, bedrijfsinformatie wordt nu verstuurd...')
        const companyInfo = data.companyInfo as CompanyInfoRequest
        const response = await createCompanyInfo(companyInfo)
        token = response.token
        setCompanyToken(token)
      }

      // Genereer de vacature met de token
      const generatedVacancy = await createVacancy(token, jobInfo)

      console.log('Vacancy created successfully!', generatedVacancy)

      // Sla het resultaat op in sessionStorage voor de result pagina
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('generatedVacancy', JSON.stringify(generatedVacancy))
        sessionStorage.setItem('vacancyFormData', JSON.stringify(data))
      }

      // Navigate naar result pagina
      router.push('/vacancies/result')
    } catch (error) {
      console.error('Error creating vacancy:', error)

      // Toon specifieke error message
      const errorMessage =
        error instanceof Error ? error.message : 'Er is een onbekende fout opgetreden'

      alert(`Fout bij het aanmaken van de vacature:\n\n${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <VacancyWizard
        steps={steps}
        initialData={initialData}
        onSubmit={handleSubmit}
        onStepChange={handleStepChange}
        renderStep={renderStep}
        title="Maak een Vacature"
        description="Vul de informatie in om een professionele vacature te genereren"
        isLoading={isSubmitting}
      />
    </div>
  )
}
