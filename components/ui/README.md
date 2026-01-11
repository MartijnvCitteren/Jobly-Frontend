# UI Component Library

Moderne, herbruikbare UI componenten voor de Jobzy applicatie. Gebouwd met React, TypeScript en TailwindCSS.

## Design Principes

- **Modern & Licht**: Gebruik van zachte kleuren (indigo, slate) voor een professionele, vriendelijke uitstraling
- **Ruimtelijk**: Ruime padding en spacing voor een luchtige layout
- **Toegankelijk**: ARIA labels, keyboard navigatie, en screen reader support
- **Composable**: Flexibele componenten die gemakkelijk te combineren zijn

## Componenten

### Button

Een veelzijdige button component met verschillende variants en states.

**Props:**

- `variant`: `'primary' | 'secondary' | 'outline'` (default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `isLoading`: `boolean` - Toont loading spinner
- `disabled`: `boolean` - Disabled state
- Alle standaard HTML button attributen

**Voorbeelden:**

```tsx
import { Button } from '@/components/ui'

// Primary button
<Button onClick={handleClick}>Versturen</Button>

// Secondary button
<Button variant="secondary">Annuleren</Button>

// Outline button
<Button variant="outline">Meer info</Button>

// Loading state
<Button isLoading>Bezig met laden...</Button>

// Different sizes
<Button size="sm">Klein</Button>
<Button size="md">Medium</Button>
<Button size="lg">Groot</Button>
```

---

### Input

Een form input component met label, error handling, en icon support.

**Props:**

- `label`: `string` - Label boven het input veld
- `error`: `string` - Error boodschap (toont rode border)
- `helperText`: `string` - Helper tekst onder het input
- `leftIcon`: `ReactNode` - Icon aan de linkerkant
- `rightIcon`: `ReactNode` - Icon aan de rechterkant
- Alle standaard HTML input attributen

**Voorbeelden:**

```tsx
import { Input } from '@/components/ui'

// Basic input
<Input label="Naam" placeholder="Vul je naam in" />

// With error
<Input
  label="Email"
  type="email"
  error="Email is verplicht"
/>

// With helper text
<Input
  label="Wachtwoord"
  type="password"
  helperText="Minimaal 8 karakters"
/>

// With icons
<Input
  label="Zoeken"
  leftIcon={<SearchIcon />}
  placeholder="Zoek..."
/>

<Input
  label="Username"
  rightIcon={<CheckIcon />}
/>
```

---

### Select

Een dropdown select component met label en error handling.

**Props:**

- `label`: `string` - Label boven de select
- `error`: `string` - Error boodschap
- `helperText`: `string` - Helper tekst
- `options`: `SelectOption[]` - Array van opties
- `placeholder`: `string` - Placeholder tekst
- Alle standaard HTML select attributen

**SelectOption Type:**

```typescript
interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}
```

**Voorbeelden:**

```tsx
import { Select } from '@/components/ui'

const ervaringOpties = [
  { value: 'junior', label: 'Junior (0-2 jaar)' },
  { value: 'medior', label: 'Medior (2-5 jaar)' },
  { value: 'senior', label: 'Senior (5+ jaar)' },
]

// Basic select
<Select
  label="Ervaringsniveau"
  options={ervaringOpties}
/>

// With error
<Select
  label="Land"
  options={landOpties}
  error="Selecteer een land"
/>

// With disabled option
<Select
  options={[
    { value: 'option1', label: 'Beschikbaar' },
    { value: 'option2', label: 'Niet beschikbaar', disabled: true },
  ]}
/>
```

---

### Card

Een container component voor het groeperen van content met schaduwen en borders.

**Props:**

- `padding`: `'none' | 'sm' | 'md' | 'lg'` (default: `'md'`)
- `hover`: `boolean` - Hover effect
- `onClick`: `() => void` - Maakt de card klikbaar
- `className`: `string` - Extra CSS classes

**Sub-componenten:**

- `CardHeader` - Header sectie
- `CardTitle` - Titel (h3)
- `CardDescription` - Beschrijving
- `CardContent` - Main content
- `CardFooter` - Footer met buttons

**Voorbeelden:**

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from '@/components/ui'

// Basic card
<Card>
  <p>Simple card content</p>
</Card>

// Complete card met alle onderdelen
<Card>
  <CardHeader>
    <CardTitle>Vacature: Senior Developer</CardTitle>
    <CardDescription>Amsterdam, Nederland</CardDescription>
  </CardHeader>
  <CardContent>
    <p>
      Wij zijn op zoek naar een ervaren developer...
    </p>
  </CardContent>
  <CardFooter>
    <Button>Bekijk vacature</Button>
    <Button variant="outline">Deel</Button>
  </CardFooter>
</Card>

// Clickable card met hover
<Card hover onClick={handleCardClick}>
  <CardTitle>Klikbare Card</CardTitle>
</Card>

// Card zonder padding
<Card padding="none">
  <img src="image.jpg" alt="Cover" />
  <div className="p-4">
    <CardTitle>Custom padding</CardTitle>
  </div>
</Card>
```

---

### LoadingSpinner

Een animated spinner voor loading states.

**Props:**

- `size`: `'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
- `color`: `'primary' | 'secondary' | 'white'` (default: `'primary'`)
- `label`: `string` - Zichtbaar label
- `className`: `string` - Extra CSS classes

**Voorbeelden:**

```tsx
import { LoadingSpinner, FullPageLoading } from '@/components/ui'

// Basic spinner
<LoadingSpinner />

// Met label
<LoadingSpinner label="Data aan het laden..." />

// Verschillende sizes
<LoadingSpinner size="sm" />
<LoadingSpinner size="xl" />

// Verschillende kleuren
<LoadingSpinner color="primary" />
<LoadingSpinner color="secondary" />
<LoadingSpinner color="white" />

// Full page loading overlay
<FullPageLoading message="Vacature wordt gegenereerd..." />
```

---

## Importeren

Je kunt componenten individueel importeren of via de index:

```tsx
// Via index (aanbevolen)
import { Button, Input, Select, Card } from '@/components/ui'

// Direct import
import { Button } from '@/components/ui/Button'
```

## Type Definitions

Alle componenten zijn volledig getypeerd met TypeScript. Import de types voor gebruik in je eigen componenten:

```tsx
import type { ButtonProps, InputProps, SelectOption } from '@/components/ui'
```

## Styling Aanpassen

Alle componenten accepteren een `className` prop voor custom styling:

```tsx
<Button className="mt-4 w-full">
  Custom styling
</Button>
```

## Toegankelijkheid

Alle componenten volgen WCAG 2.1 richtlijnen:

- ✅ Keyboard navigatie
- ✅ ARIA labels en roles
- ✅ Screen reader support
- ✅ Focus states
- ✅ Error states met aria-invalid en aria-describedby

## Testing

Alle componenten hebben uitgebreide unit tests. Run de tests met:

```bash
npm test -- components/ui
```

## Kleurenschema

De componenten gebruiken het volgende kleurenschema:

- **Primary**: Indigo (indigo-400 tot indigo-600)
- **Secondary**: Slate (slate-200 tot slate-700)
- **Error**: Red (red-300 tot red-600)
- **Background**: White met lichte borders (slate-100)

## Browser Support

- Chrome (laatste 2 versies)
- Firefox (laatste 2 versies)
- Safari (laatste 2 versies)
- Edge (laatste 2 versies)
