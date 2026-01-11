# Vacancy Components

Multi-step wizard framework componenten voor het creëren van vacatures.

## Overzicht

Deze module bevat een complete set van componenten voor het bouwen van multi-step wizards, specifiek ontworpen voor de vacature generatie flow maar herbruikbaar voor elke multi-step form.

## Componenten

### VacancyWizard

De hoofd wizard component die alles samenbrengt. Gebruikt het **Compound Component Pattern** en integreert met de `useFormWizard` hook.

**Features:**
- Automatische state management via `useFormWizard`
- Progress indicator met klikbare stappen
- Navigatie met Previous/Next buttons
- Form validatie per stap
- Loading states
- Type-safe met TypeScript generics
- **onStepChange callback** voor progressive actions (NIEUW!)

**Gebruik:**

```tsx
import { VacancyWizard } from '@/components/vacancy'
import { WizardStep } from '@/lib/hooks/useFormWizard'

interface MyFormData {
  jobTitle: string
  company: string
  description: string
}

function CreateVacancyPage() {
  const steps: WizardStep[] = [
    {
      id: 'basics',
      label: 'Basis Informatie',
      validate: () => !!formData.jobTitle && !!formData.company
    },
    {
      id: 'details',
      label: 'Details',
      validate: () => !!formData.description
    },
    {
      id: 'review',
      label: 'Controleren'
    }
  ]

  const handleSubmit = async (data: MyFormData) => {
    console.log('Submitting:', data)
    // API call hier
  }

  // NIEUW: Handler voor wanneer gebruiker naar een andere stap gaat
  const handleStepChange = async ({ fromStepId, formData }) => {
    // Bijvoorbeeld: fire-and-forget API call bij verlaten van eerste stap
    if (fromStepId === 'basics') {
      // Verzend data in achtergrond, zonder te wachten
      sendBasicInfoToAPI(formData).catch(error => {
        console.error('Background API call failed:', error)
      })
    }
  }

  const renderStep = ({ stepId, formData, updateFormData }) => {
    switch (stepId) {
      case 'basics':
        return <BasicInfoStep data={formData} onChange={updateFormData} />
      case 'details':
        return <DetailsStep data={formData} onChange={updateFormData} />
      case 'review':
        return <ReviewStep data={formData} />
    }
  }

  return (
    <VacancyWizard
      steps={steps}
      initialData={{ jobTitle: '', company: '', description: '' }}
      onSubmit={handleSubmit}
      onStepChange={handleStepChange}  // NIEUW!
      renderStep={renderStep}
      title="Maak een Vacature"
      description="Vul de informatie in om een professionele vacature te genereren"
    />
  )
}
```

**onStepChange Callback:**

De `onStepChange` callback wordt aangeroepen telkens wanneer de gebruiker naar een andere stap navigeert (via Next, Previous, of door op een stap te klikken in de progress indicator).

**Parameters:**
- `fromStepIndex`: Index van de stap waar de gebruiker vandaan komt (number)
- `toStepIndex`: Index van de stap waar de gebruiker naartoe gaat (number)
- `fromStepId`: ID van de stap waar de gebruiker vandaan komt (string)
- `toStepId`: ID van de stap waar de gebruiker naartoe gaat (string)
- `formData`: De huidige form data (T)

**Use Cases:**
- ✅ **Fire-and-forget API calls**: Verzend data in achtergrond bij verlaten van een stap voor betere UX
- ✅ **Progressive data validation**: Valideer data tegen backend terwijl gebruiker doorgaat
- ✅ **Analytics tracking**: Track wizard voortgang en drop-off punten
- ✅ **Auto-save functionaliteit**: Sla form data automatisch op bij elke stap
- ✅ **Conditional logic**: Toon/verberg stappen op basis van eerdere antwoorden

**Voorbeeld: Fire-and-Forget API Pattern**

```tsx
const handleStepChange = async ({ fromStepId, formData }) => {
  if (fromStepId === 'company') {
    // Verzend company info in achtergrond
    // Gebruiker hoeft niet te wachten
    createCompanyInfo(formData.companyInfo)
      .then(response => {
        // Bewaar token voor later gebruik
        setCompanyToken(response.token)
      })
      .catch(error => {
        // Toon alleen directe errors
        console.error('API error:', error)
      })
  }
}
```

### VacancyWizardContainer

Alternative wizard container die meer flexibiliteit biedt via children render prop:

```tsx
<VacancyWizardContainer
  steps={steps}
  initialData={initialData}
  onSubmit={handleSubmit}
  title="Maak een Vacature"
>
  {(wizard) => (
    <Card padding="lg">
      <WizardStep
        id={wizard.currentStep.id}
        title={wizard.currentStep.label}
        isActive={true}
      >
        {/* Your step content here */}
        <YourStepComponent
          data={wizard.formData}
          onChange={wizard.updateFormData}
        />
      </WizardStep>

      <WizardNavigation
        {...wizard}
        onSubmit={wizard.handleSubmit}
      />
    </Card>
  )}
</VacancyWizardContainer>
```

### ProgressIndicator

Visuele progress bar met stap indicatoren.

**Features:**
- Horizontale progress bar met animatie
- Klikbare stappen (configureerbaar)
- Checkmarks voor voltooide stappen
- Responsive design
- Accessible (ARIA labels)

**Props:**
- `totalSteps` - Totaal aantal stappen
- `currentStep` - Huidige stap index (0-based)
- `stepLabels` - Labels voor elke stap
- `onStepClick` - Callback wanneer op stap geklikt wordt
- `onlyCompletedClickable` - Alleen voltooide stappen klikbaar (default: true)

### WizardStep

Wrapper component voor individuele stappen.

**Features:**
- Consistent header styling
- Smooth fade-in animatie
- Title en description
- Conditional rendering (alleen actieve stap)

**Props:**
- `id` - Unieke identifier
- `title` - Stap titel
- `description` - Optionele beschrijving
- `isActive` - Of de stap actief is
- `children` - Stap content

### WizardStepSection

Helper component voor het groeperen van velden binnen een stap:

```tsx
<WizardStep id="basics" title="Basis Informatie" isActive={true}>
  <WizardStepSection
    title="Bedrijfsgegevens"
    description="Informatie over het bedrijf"
  >
    <Input label="Bedrijfsnaam" {...} />
    <Input label="Locatie" {...} />
  </WizardStepSection>

  <WizardStepSection title="Functiegegevens">
    <Input label="Functietitel" {...} />
    <Select label="Niveau" {...} />
  </WizardStepSection>
</WizardStep>
```

### WizardNavigation

Navigatie component met Previous/Next/Submit buttons.

**Features:**
- Automatische button state management
- Loading states
- Disabled states op basis van validatie
- Icons voor visuele feedback
- Accessible labels

**Props:**
- `hasPreviousStep` - Of vorige stap beschikbaar is
- `hasNextStep` - Of volgende stap beschikbaar is
- `isFirstStep` - Of dit de eerste stap is
- `isLastStep` - Of dit de laatste stap is
- `isCurrentStepValid` - Of huidige stap valide is
- `onPrevious` - Previous callback
- `onNext` - Next callback
- `onSubmit` - Submit callback (laatste stap)
- `isLoading` - Loading state

### WizardNavigationSimple

Vereenvoudigde navigatie zonder alle extra features:

```tsx
<WizardNavigationSimple
  showPrevious={currentStep > 0}
  showNext={currentStep < totalSteps - 1}
  nextDisabled={!isValid}
  onPrevious={goBack}
  onNext={goForward}
/>
```

## Design Patterns

### 1. Compound Component Pattern

De wizard componenten gebruiken het Compound Component Pattern voor maximale flexibiliteit:

```tsx
<VacancyWizard>
  <WizardStep>
    <WizardStepSection>
      {/* Content */}
    </WizardStepSection>
  </WizardStep>
  <WizardNavigation />
</VacancyWizard>
```

### 2. Render Props Pattern

Voor dynamische content rendering:

```tsx
renderStep={({ stepId, formData, updateFormData }) => (
  <YourComponent data={formData} onChange={updateFormData} />
)}
```

### 3. Custom Hook Integration

Alle state management gebeurt via `useFormWizard`:

```tsx
const wizard = useFormWizard({
  steps,
  initialData,
})

// Wizard geeft je:
// - currentStepIndex, currentStep
// - formData, updateFormData
// - nextStep, previousStep, goToStep
// - isFirstStep, isLastStep
// - isCurrentStepValid, progress
```

## Styling

De componenten gebruiken:
- **TailwindCSS** voor styling
- **Indigo** als primaire kleur (consistent met Jobzy brand)
- **Rounded corners** (rounded-2xl) voor modern design
- **Shadows** voor depth
- **Animations** voor smooth transitions

### Kleuren Schema

```css
Primary: Indigo (indigo-500, indigo-600)
Secondary: Slate (slate-200, slate-300)
Text: Slate (slate-700, slate-800, slate-900)
Border: Slate (slate-100, slate-200)
Background: White
```

## Accessibility

Alle componenten zijn gebouwd met accessibility in gedachten:

- **ARIA labels** voor screen readers
- **Keyboard navigation** support
- **Focus management** met focus rings
- **Semantic HTML** (proper heading hierarchy)
- **Role attributes** waar nodig

## Testing

Voor het testen van wizard componenten:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { VacancyWizard } from '@/components/vacancy'

test('navigates through wizard steps', () => {
  const handleSubmit = jest.fn()

  render(
    <VacancyWizard
      steps={mockSteps}
      initialData={mockData}
      onSubmit={handleSubmit}
      renderStep={mockRenderStep}
    />
  )

  // Test initial state
  expect(screen.getByText('Stap 1')).toBeInTheDocument()

  // Click next
  fireEvent.click(screen.getByText('Volgende'))
  expect(screen.getByText('Stap 2')).toBeInTheDocument()

  // Go back
  fireEvent.click(screen.getByText('Vorige'))
  expect(screen.getByText('Stap 1')).toBeInTheDocument()
})
```

## Best Practices

1. **Validatie per stap**: Definieer validate functies voor elke stap
2. **Type safety**: Gebruik TypeScript generics voor form data
3. **Error handling**: Vang errors op in onSubmit
4. **Loading states**: Toon loading tijdens API calls
5. **Accessibility**: Test met keyboard en screen reader
6. **Responsive**: Test op mobile devices

## Voorbeelden

Zie `app/components-demo/page.tsx` voor een complete demo van alle wizard componenten.

## Gerelateerde Componenten

- **UI Components**: `components/ui/Button`, `components/ui/Card`, `components/ui/Input`
- **Hooks**: `lib/hooks/useFormWizard`
- **Types**: `lib/domain/vacancy.types.ts`

## Toekomstige Uitbreidingen

- [ ] Wizard state persistence (localStorage)
- [ ] Conditional steps (skip steps based on answers)
- [ ] Side navigation variant (vertical progress)
- [ ] Save draft functionality
- [ ] Step validation indicators
- [ ] Custom animations/transitions
