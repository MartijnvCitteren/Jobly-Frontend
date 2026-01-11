'use client'

import { useState } from 'react'
import {
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  LoadingSpinner,
} from '@/components/ui'
import {
  VacancyWizard,
  WizardStep,
  WizardStepSection,
  ProgressIndicator,
  WizardNavigation,
} from '@/components/vacancy'
import { WizardStep as WizardStepConfig } from '@/lib/hooks/useFormWizard'

/**
 * Demo page voor alle UI componenten
 *
 * Deze page toont alle beschikbare componenten met verschillende variants
 */
interface VacancyFormData {
  jobTitle: string
  company: string
  location: string
  experience: string
  salary: string
  description: string
}

export default function ComponentsDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [showWizardDemo, setShowWizardDemo] = useState(false)

  const handleLoadingDemo = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const experienceOptions = [
    { value: 'junior', label: 'Junior (0-2 jaar)' },
    { value: 'medior', label: 'Medior (2-5 jaar)' },
    { value: 'senior', label: 'Senior (5+ jaar)' },
  ]

  // Wizard demo configuration
  const wizardSteps: WizardStepConfig[] = [
    {
      id: 'basics',
      label: 'Basis Info',
      description: 'Algemene informatie over de functie',
      validate: () => {
        const data = wizardInitialData as VacancyFormData
        return !!(data.jobTitle && data.company && data.location)
      },
    },
    {
      id: 'details',
      label: 'Details',
      description: 'Ervaring en salaris',
      validate: () => {
        const data = wizardInitialData as VacancyFormData
        return !!(data.experience)
      },
    },
    {
      id: 'description',
      label: 'Beschrijving',
      description: 'Functieomschrijving',
    },
    {
      id: 'review',
      label: 'Controleren',
      description: 'Bekijk en bevestig',
    },
  ]

  const wizardInitialData: VacancyFormData = {
    jobTitle: '',
    company: '',
    location: '',
    experience: '',
    salary: '',
    description: '',
  }

  const handleWizardSubmit = async (data: VacancyFormData) => {
    console.log('Wizard submitted:', data)

    try {
      // Dit is een demo, dus we maken een minimale dataset voor de API
      // In productie zou je naar /vacancies/create moeten gaan voor de volledige wizard
      const { createCompanyAndVacancy } = await import('@/lib/api/vacancy-repository')
      const {
        Country,
        SeniorityLevel,
        WritingStyle,
        Language,
      } = await import('@/lib/domain/vacancy.types')

      // Map de demo data naar het juiste formaat
      const seniorityMap: Record<string, any> = {
        junior: SeniorityLevel.JUNIOR,
        medior: SeniorityLevel.MEDIOR,
        senior: SeniorityLevel.SENIOR,
      }

      // Maak een geldige API request
      const result = await createCompanyAndVacancy(
        {
          companyName: data.company,
          companyWebsite: 'www.example.com', // Demo website
          country: Country.THE_NETHERLANDS,
        },
        {
          jobTitle: data.jobTitle,
          seniorityLevel: seniorityMap[data.experience] || SeniorityLevel.MEDIOR,
          jobSummary: data.description || 'Demo vacature gemaakt via de component demo',
          writingStyle: {
            writingStyle: WritingStyle.BUSINESS_CASUAL,
            language: Language.DUTCH,
          },
        }
      )

      console.log('Vacancy generated:', result)
      alert(
        'Vacature succesvol gegenereerd via de API!\n\n' +
          `Samenvatting: ${result.summary || 'N/A'}\n\n` +
          'Check de console voor de volledige response.'
      )
    } catch (error) {
      console.error('API Error:', error)
      alert(
        'Demo API call:\n\n' +
          `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
          'Check de console voor meer details.'
      )
    } finally {
      setShowWizardDemo(false)
    }
  }

  const renderWizardStep = ({
    stepId,
    formData,
    updateFormData,
  }: {
    stepId: string
    stepIndex: number
    formData: VacancyFormData
    updateFormData: (data: Partial<VacancyFormData>) => void
  }) => {
    switch (stepId) {
      case 'basics':
        return (
          <WizardStep
            id="basics"
            title="Basis Informatie"
            description="Vul de algemene gegevens in over de functie"
            isActive={true}
          >
            <WizardStepSection>
              <Input
                label="Functietitel"
                placeholder="bijv. Senior React Developer"
                value={formData.jobTitle}
                onChange={(e) => updateFormData({ jobTitle: e.target.value })}
                required
              />
              <Input
                label="Bedrijfsnaam"
                placeholder="bijv. Jobzy B.V."
                value={formData.company}
                onChange={(e) => updateFormData({ company: e.target.value })}
                required
              />
              <Input
                label="Locatie"
                placeholder="bijv. Amsterdam"
                value={formData.location}
                onChange={(e) => updateFormData({ location: e.target.value })}
                required
              />
            </WizardStepSection>
          </WizardStep>
        )

      case 'details':
        return (
          <WizardStep
            id="details"
            title="Functie Details"
            description="Specificeer ervaring en salaris"
            isActive={true}
          >
            <WizardStepSection>
              <Select
                label="Ervaringsniveau"
                options={experienceOptions}
                value={formData.experience}
                onChange={(e) => updateFormData({ experience: e.target.value })}
                required
              />
              <Input
                label="Salaris indicatie"
                placeholder="bijv. €60.000 - €80.000"
                value={formData.salary}
                onChange={(e) => updateFormData({ salary: e.target.value })}
                helperText="Optioneel, maar verhoogt respons"
              />
            </WizardStepSection>
          </WizardStep>
        )

      case 'description':
        return (
          <WizardStep
            id="description"
            title="Functieomschrijving"
            description="Beschrijf de functie in detail"
            isActive={true}
          >
            <WizardStepSection>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Beschrijving
                </label>
                <textarea
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  rows={8}
                  placeholder="Beschrijf de functie, taken, verantwoordelijkheden..."
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                />
              </div>
            </WizardStepSection>
          </WizardStep>
        )

      case 'review':
        return (
          <WizardStep
            id="review"
            title="Controleer je gegevens"
            description="Bekijk alle informatie voordat je de vacature genereert"
            isActive={true}
          >
            <div className="space-y-6">
              <div className="rounded-xl bg-slate-50 p-6">
                <h4 className="mb-4 text-lg font-semibold text-slate-800">Overzicht</h4>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-slate-600">Functietitel</dt>
                    <dd className="mt-1 text-base text-slate-900">{formData.jobTitle || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-600">Bedrijf</dt>
                    <dd className="mt-1 text-base text-slate-900">{formData.company || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-600">Locatie</dt>
                    <dd className="mt-1 text-base text-slate-900">{formData.location || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-600">Ervaring</dt>
                    <dd className="mt-1 text-base text-slate-900">
                      {experienceOptions.find((opt) => opt.value === formData.experience)?.label ||
                        '-'}
                    </dd>
                  </div>
                  {formData.salary && (
                    <div>
                      <dt className="text-sm font-medium text-slate-600">Salaris</dt>
                      <dd className="mt-1 text-base text-slate-900">{formData.salary}</dd>
                    </div>
                  )}
                  {formData.description && (
                    <div>
                      <dt className="text-sm font-medium text-slate-600">Beschrijving</dt>
                      <dd className="mt-1 text-base text-slate-900">{formData.description}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </WizardStep>
        )

      default:
        return <div>Unknown step</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-5xl font-bold text-slate-800">
            Jobzy UI Component Library
          </h1>
          <p className="text-lg text-slate-600">
            Moderne, toegankelijke componenten voor recruitment gemaakt gemakkelijk
          </p>
        </div>

        {/* Button Section */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>
                Verschillende button variants en sizes voor alle situaties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Variants */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-slate-700">Variants</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="outline">Outline Button</Button>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-slate-700">Sizes</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                {/* States */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-slate-700">States</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button disabled>Disabled</Button>
                    <Button isLoading={isLoading} onClick={handleLoadingDemo}>
                      {isLoading ? 'Loading...' : 'Click voor loading'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Input Section */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>
                Form inputs met labels, errors, en helper tekst
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Naam"
                  placeholder="Vul je naam in"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="naam@voorbeeld.nl"
                  helperText="We delen je email nooit met anderen"
                />

                <Input
                  label="Email met error"
                  type="email"
                  error="Dit email adres is al in gebruik"
                />

                <Input
                  label="Disabled input"
                  placeholder="Niet beschikbaar"
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Select Section */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Select Dropdowns</CardTitle>
              <CardDescription>Dropdown menus voor opties selecteren</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <Select
                  label="Ervaringsniveau"
                  options={experienceOptions}
                  value={selectValue}
                  onChange={(e) => setSelectValue(e.target.value)}
                />

                <Select
                  label="Met error"
                  options={experienceOptions}
                  error="Selecteer een optie"
                />

                <Select
                  label="Disabled select"
                  options={experienceOptions}
                  disabled
                />

                <Select
                  label="Met helper text"
                  options={experienceOptions}
                  helperText="Kies het juiste ervaringsniveau"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Card Section */}
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-800">Cards</h2>
            <p className="text-slate-600">Containers voor content grouping</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Simple Card */}
            <Card>
              <CardTitle>Simple Card</CardTitle>
              <CardContent className="mt-3">
                <p className="text-slate-600">
                  Een basic card met alleen een titel en content.
                </p>
              </CardContent>
            </Card>

            {/* Complete Card */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Card</CardTitle>
                <CardDescription>Met alle onderdelen</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Deze card heeft header, content én footer.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>

            {/* Hover Card */}
            <Card hover onClick={() => alert('Card clicked!')}>
              <CardHeader>
                <CardTitle>Clickable Card</CardTitle>
                <CardDescription>Met hover effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Klik op deze card om de actie te zien.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Loading Spinner Section */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Loading Spinners</CardTitle>
              <CardDescription>Animated loading indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Sizes */}
                <div>
                  <h4 className="mb-4 text-sm font-semibold text-slate-700">Sizes</h4>
                  <div className="flex flex-wrap items-center gap-8">
                    <LoadingSpinner size="sm" />
                    <LoadingSpinner size="md" />
                    <LoadingSpinner size="lg" />
                    <LoadingSpinner size="xl" />
                  </div>
                </div>

                {/* With labels */}
                <div>
                  <h4 className="mb-4 text-sm font-semibold text-slate-700">With Labels</h4>
                  <div className="flex flex-wrap items-start gap-8">
                    <LoadingSpinner label="Laden..." />
                    <LoadingSpinner label="Data ophalen..." color="secondary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Wizard Components Section */}
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-800">Wizard Components</h2>
            <p className="text-slate-600">Multi-step form framework voor complexe flows</p>
          </div>

          {!showWizardDemo ? (
            <Card>
              <CardHeader>
                <CardTitle>Vacancy Wizard Demo</CardTitle>
                <CardDescription>
                  Interactieve multi-step wizard voor het aanmaken van vacatures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-600">
                    De wizard component biedt een complete oplossing voor multi-step forms met:
                  </p>
                  <ul className="list-inside list-disc space-y-2 text-slate-600">
                    <li>Visuele progress indicator met klikbare stappen</li>
                    <li>Automatische validatie per stap</li>
                    <li>Smooth animaties tussen stappen</li>
                    <li>Type-safe form data management</li>
                    <li>Loading states en error handling</li>
                  </ul>

                  <div className="pt-4">
                    <Button size="lg" onClick={() => setShowWizardDemo(true)}>
                      Start Wizard Demo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              <VacancyWizard
                steps={wizardSteps}
                initialData={wizardInitialData}
                onSubmit={handleWizardSubmit}
                renderStep={renderWizardStep}
                title="Vacature Aanmaken"
                description="Maak in 4 eenvoudige stappen een professionele vacature"
              />
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={() => setShowWizardDemo(false)}>
                  Sluit Wizard Demo
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Standalone Wizard Components */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Standalone Wizard Componenten</CardTitle>
              <CardDescription>
                Individuele componenten die je kunt gebruiken voor custom wizards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Progress Indicator */}
                <div>
                  <h4 className="mb-4 text-sm font-semibold text-slate-700">
                    Progress Indicator
                  </h4>
                  <ProgressIndicator
                    totalSteps={4}
                    currentStep={1}
                    stepLabels={['Start', 'Details', 'Extra', 'Klaar']}
                  />
                </div>

                {/* Wizard Navigation */}
                <div>
                  <h4 className="mb-4 text-sm font-semibold text-slate-700">
                    Wizard Navigation
                  </h4>
                  <WizardNavigation
                    hasPreviousStep={true}
                    hasNextStep={true}
                    isFirstStep={false}
                    isLastStep={false}
                    isCurrentStepValid={true}
                    onPrevious={() => console.log('Previous')}
                    onNext={() => console.log('Next')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Form Example */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Complete Form Voorbeeld</CardTitle>
              <CardDescription>
                Combinatie van meerdere componenten in een form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  alert('Form submitted!')
                }}
              >
                <div className="space-y-4">
                  <Input label="Functietitel" placeholder="bijv. Senior Developer" required />

                  <Input label="Bedrijfsnaam" placeholder="bijv. Tech Corp" required />

                  <Select
                    label="Ervaringsniveau"
                    options={experienceOptions}
                    required
                  />

                  <Input
                    label="Salaris indicatie"
                    placeholder="bijv. €60.000 - €80.000"
                    helperText="Optioneel, maar verhoogt respons"
                  />

                  <div className="flex gap-3 pt-4">
                    <Button type="submit">Vacature Genereren</Button>
                    <Button type="button" variant="secondary">
                      Annuleren
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-slate-600">
            Gebouwd met React, TypeScript & TailwindCSS
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Jobzy - Recruitment made eazy
          </p>
        </footer>
      </div>
    </div>
  )
}
