# Vacancy Result Components

Deze map bevat componenten voor het weergeven, bewerken en exporteren van gegenereerde vacatures.

## Componenten

### VacancyResult

**Doel:** Pure presentatie component voor het weergeven van een gegenereerde vacature.

**Features:**
- Toont alle secties van een vacature in een clean, leesbaar format
- Optionele edit mode met inline textareas
- Visuele highlighting van belangrijke secties (zoals samenvatting)
- Responsive layout met Cards
- Animaties voor smooth transitions

**Props:**
```typescript
interface VacancyResultProps {
  vacancy: GeneratedVacancy
  editable?: boolean
  onEdit?: (section: keyof GeneratedVacancy, value: string) => void
}
```

**Gebruik:**
```tsx
import { VacancyResult } from '@/components/vacancy'

// Read-only weergave
<VacancyResult vacancy={generatedVacancy} />

// Editable weergave
<VacancyResult
  vacancy={generatedVacancy}
  editable={true}
  onEdit={(section, value) => handleEdit(section, value)}
/>
```

### VacancyEditor

**Doel:** Volledig bewerkbare versie van de vacancy display met rich editing features.

**Features:**
- Alle secties zijn bewerkbaar via textareas
- Character count per sectie
- Save/Cancel/Reset functionaliteit
- Unsaved changes indicator
- Sticky footer met action buttons
- Automatische state management

**Props:**
```typescript
interface VacancyEditorProps {
  vacancy: GeneratedVacancy
  onSave?: (updatedVacancy: GeneratedVacancy) => void
  onCancel?: () => void
}
```

**Gebruik:**
```tsx
import { VacancyEditor } from '@/components/vacancy'

<VacancyEditor
  vacancy={generatedVacancy}
  onSave={(updated) => handleSave(updated)}
  onCancel={() => setEditMode(false)}
/>
```

### ExportOptions

**Doel:** Biedt verschillende export en deel opties voor vacatures.

**Features:**
- ✅ Kopiëren naar klembord (volledig geïmplementeerd)
- ✅ Email delen via mailto link (volledig geïmplementeerd)
- ✅ PDF export met jsPDF (volledig geïmplementeerd)
- 🚧 Word export (in ontwikkeling)
- Visual feedback voor acties
- Uitgebreide error handling
- Responsive button layout

**Props:**
```typescript
interface ExportOptionsProps {
  vacancy: GeneratedVacancy
  className?: string
  showLabels?: boolean
}
```

**Gebruik:**
```tsx
import { ExportOptions } from '@/components/vacancy'

<ExportOptions
  vacancy={generatedVacancy}
  showLabels={true}
  className="my-custom-class"
/>
```

**PDF Export Implementatie:**
De PDF export maakt gebruik van jsPDF om een professioneel ogende PDF te genereren:
- Automatische text wrapping op pagina breedte
- Pagina overflow handling (nieuwe pagina's worden automatisch toegevoegd)
- Sectie titels in bold met grotere font size
- Content in normale font met leesbare spacing
- Margins en padding voor professionele uitstraling

```typescript
// PDF generatie flow:
1. Maak nieuwe jsPDF instance
2. Itereer door alle vacancy secties
3. Format titels en content met juiste font sizes
4. Wrap text automatisch binnen marges
5. Handel pagina overflow af
6. Download PDF met timestamp in filename
```

## Design Principes

### Jobzy Design Style
Gebaseerd op `design-examples/design-style`:
- **Modern**: Clean, minimalistisch design
- **Easy-going**: Lichte kleuren, vriendelijke UI
- **Spacious**: Ruime witruimte, niet te druk

### Kleuren
- Primary: Indigo/Blue gradient (`from-slate-50 via-blue-50 to-indigo-50`)
- Accents: Indigo-600 voor CTAs
- Text: Slate-800 voor headings, Slate-700 voor body
- Borders: Slate-200/300 voor subtiele scheiding

### Iconen
Emoji's worden gebruikt voor een vriendelijke, toegankelijke feel:
- 📝 Samenvatting
- 🏢 Bedrijf
- 👥 Team
- 📅 Dagelijks werk
- 💼 Functie
- ✨ USPs
- 🎯 Vereisten
- 🎁 Aanbod
- 📞 Contact

## Architectuur

### Component Hiërarchie
```
VacancyResultPage (app/vacancies/result/page.tsx)
├── VacancyResult (read-only display)
│   └── Card (per sectie)
├── VacancyEditor (edit mode)
│   └── Card (per sectie met textarea)
└── ExportOptions (sidebar)
    └── Export buttons
```

### State Management
- **Page Level**: Edit mode toggle, vacancy data
- **Component Level**: Local edit state (VacancyEditor), export states (ExportOptions)
- **Session Storage**: Persistence tussen page navigations

## Testing

Alle componenten hebben uitgebreide test coverage:

### VacancyResult.test.tsx
- Rendering van alle secties
- Conditional rendering (alleen secties met content)
- Edit mode functionality
- Styling en classes

### VacancyEditor.test.tsx
- Editable textareas
- Save/Cancel/Reset functionaliteit
- Character counting
- Unsaved changes indicator
- State updates

### ExportOptions.test.tsx
- Clipboard copying
- Email sharing
- Export button states
- Error handling
- Text formatting

**Run tests:**
```bash
npm test -- VacancyResult
npm test -- VacancyEditor
npm test -- ExportOptions
```

## Toekomstige Verbeteringen

1. **Rich Text Editor**
   - Markdown support
   - Formatting toolbar (bold, italic, lists)
   - Preview mode

2. **Export Functionaliteit**
   - ✅ PDF generatie met jsPDF geïmplementeerd
   - 🚧 Word document export (met docx library)
   - Custom templates voor export
   - PDF styling en layout verbeteringen
   - Logo/branding in PDF exports

3. **Collaboration**
   - Delen met team members
   - Comments/feedback systeem
   - Version history

4. **AI Improvements**
   - Inline AI suggestions tijdens editing
   - Tone adjustment
   - Length optimization

5. **Templates**
   - Opslaan als template
   - Template library
   - Industry-specific templates

## Afhankelijkheden

- React 18+
- Next.js 14+
- TailwindCSS
- jsPDF - PDF generatie library
- UI Components (`@/components/ui`)
- Domain Types (`@/lib/domain/vacancy.types`)

## Gerelateerde Files

- `app/vacancies/result/page.tsx` - Result page die deze componenten gebruikt
- `lib/domain/vacancy.types.ts` - TypeScript types
- `components/ui/` - Basis UI componenten (Button, Card, etc.)
