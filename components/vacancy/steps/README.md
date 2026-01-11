# Vacancy Wizard Steps

Deze map bevat alle stappen van de vacancy creation wizard. Elke stap is een gecontroleerd formulier component met real-time validatie.

## Overzicht

De wizard bestaat uit 5 stappen:

1. **CompanyInfoStep** - Bedrijfsinformatie
2. **JobBasicsStep** - Basis functie informatie
3. **JobRequirementsStep** - Functie eisen en vaardigheden
4. **JobDetailsStep** - Schrijfstijl, salaris en voordelen
5. **ReviewStep** - Overzicht van alle gegevens

## Stap Details

### 1. CompanyInfoStep

Verzamelt bedrijfsinformatie voor de vacature.

**Velden:**
- `companyName` (optioneel, max 50 karakters)
- `companyWebsite` (verplicht, moet beginnen met 'www.')
- `country` (verplicht, enum: THE_NETHERLANDS | BELGIUM | GERMANY)
- `exampleVacancyUrl` (optioneel, max 100 karakters)

**Validatie:**
- Real-time validatie met Zod schemas
- Error messages worden alleen getoond na blur event
- Website URL moet correct formaat hebben

### 2. JobBasicsStep

Verzamelt basis informatie over de functie.

**Velden:**
- `jobTitle` (optioneel, 2-75 karakters)
- `seniorityLevel` (verplicht, enum: INTERN | JUNIOR | MEDIOR | SENIOR)
- `jobSummary` (optioneel, 20-300 karakters, textarea)

**Features:**
- Character counter voor jobSummary
- Responsive textarea met auto-resize
- Live validatie feedback

### 3. JobRequirementsStep

Verzamelt taken, vaardigheden en team informatie.

**Velden:**
- `tasks` (optioneel, 10-300 karakters, textarea)
- `skills` (optioneel, 10-300 karakters, textarea)
- `teamDescription` (optioneel, 10-300 karakters, textarea)

**Features:**
- Character counters voor alle velden
- Consistent validatie gedrag
- Duidelijke placeholder teksten

### 4. JobDetailsStep

Verzamelt schrijfstijl, salaris en contact informatie.

**Secties:**

#### Schrijfstijl (verplicht)
- `writingStyle` (enum: FORMAL | BUSINESS_CASUAL | CASUAL | CREATIVE | TECHNICAL)
- `language` (enum: DUTCH | ENGLISH | FLEMISH | FRENCH | GERMAN)

#### Salaris & Voordelen (optioneel)
- `salaryPeriod` (enum)
- `minSalary` (number, 0-999999.99)
- `maxSalary` (number, 0-999999.99, moet >= minSalary zijn)
- `extraPerks` (string, 10-100 karakters)

#### Contactinformatie (optioneel)
- `name` (max 25 karakters)
- `mail` (email format, max 50 karakters)
- `phoneNumber` (10-15 karakters, alleen cijfers en +/- tekens)

**Validatie:**
- Cross-field validatie voor min/max salaris
- Email format validatie
- Telefoonnummer format validatie

### 5. ReviewStep

Toont een overzicht van alle ingevoerde gegevens in een read-only formaat.

**Features:**
- Gestructureerd overzicht per sectie
- Vertaling van enum waarden naar leesbare labels
- Formatting van salaris met locale (€ formatting)
- Truncatie van lange teksten (max 100 karakters preview)
- Conditionele rendering van optionele secties
- Info melding over bewerken na generatie

## Gebruik

### Basis Gebruik

```tsx
import {
  CompanyInfoStep,
  JobBasicsStep,
  JobRequirementsStep,
  JobDetailsStep,
  ReviewStep,
} from '@/components/vacancy/steps'

function MyWizard() {
  const [data, setData] = useState<VacancyFormData>({
    companyInfo: {},
    jobInfo: {},
  })

  return (
    <VacancyWizard
      steps={wizardSteps}
      initialData={data}
      onSubmit={handleSubmit}
      renderStep={({ stepId, formData, updateFormData }) => {
        switch (stepId) {
          case 'company':
            return (
              <CompanyInfoStep
                data={formData.companyInfo}
                onChange={(companyInfo) => updateFormData({ companyInfo })}
              />
            )
          // ... andere steps
        }
      }}
    />
  )
}
```

### Met VacancyWizard Container

Zie `app/vacancies/create/page.tsx` voor een volledig werkend voorbeeld.

## Validatie Pattern

Alle steps volgen hetzelfde validatie pattern:

1. **Touched State**: Validatie errors worden alleen getoond nadat een veld is aangeraakt (blur event)
2. **Real-time Updates**: Na de eerste blur wordt validatie bij elke onChange uitgevoerd
3. **Clear Feedback**: Error messages zijn duidelijk en in het Nederlands
4. **Helper Text**: Alle velden hebben helper text met uitleg en limieten

## Styling

Alle steps gebruiken consistente styling:

- **Design System**: Jobzy design style (modern, spacious, light colors)
- **Color Scheme**: Indigo primary, slate grays, red voor errors
- **Spacing**: Generous padding en margins voor leesbaarheid
- **Forms**: Rounded corners (xl), border transitions, focus states
- **Sections**: Background color (slate-50) voor visuele scheiding

## Testing

Elke step heeft uitgebreide unit tests:

- Form field rendering
- OnChange callbacks
- Validatie scenarios (too short, too long, invalid format)
- Character counters
- Display van current values
- Edge cases (empty values, optional fields)

Run tests:
```bash
npm test -- components/vacancy/steps/
```

## Type Safety

Alle steps zijn volledig type-safe met TypeScript:

- Props interfaces voor elke step
- Data interfaces voor form data structuren
- Zod schemas voor runtime validatie
- Type inference van schemas naar TypeScript types

## Toegankelijkheid

- Semantic HTML labels
- ARIA attributes (aria-invalid, aria-describedby)
- Keyboard navigatie support
- Screen reader friendly error messages
- Focus management

## Toekomstige Verbeteringen

- [ ] Autocomplete voor vaak gebruikte waarden
- [ ] Salaris range slider als alternatief voor input velden
- [ ] Rich text editor voor lange tekst velden
- [ ] Skills autocomplete met suggesties
- [ ] Drag & drop reordering van secties in review
- [ ] Save draft functionaliteit
- [ ] Pre-filled templates per industrie
