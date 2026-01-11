# Common Components

Herbruikbare componenten die door de hele applicatie gebruikt kunnen worden.

## Error Handling

### ErrorBoundary

React Error Boundary voor het vangen van rendering errors.

**Gebruik:**

```tsx
import { ErrorBoundary } from '@/components/common'

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  )
}
```

**Met custom fallback:**

```tsx
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <h1>Oops!</h1>
      <p>{error.userMessage}</p>
      <button onClick={reset}>Probeer opnieuw</button>
    </div>
  )}
>
  <MyComponent />
</ErrorBoundary>
```

**Met error callback:**

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log naar externe service
    logErrorToService(error, errorInfo)
  }}
>
  <MyComponent />
</ErrorBoundary>
```

### ErrorMessage

Component voor het tonen van error messages.

**Gebruik:**

```tsx
import { ErrorMessage } from '@/components/common'

function MyComponent() {
  const [error, setError] = useState<AppError | null>(null)

  return (
    <ErrorMessage
      error={error}
      title="Er is iets misgegaan"
      showRetry
      onRetry={() => {
        // Retry logic
        setError(null)
      }}
    />
  )
}
```

**Met string error:**

```tsx
<ErrorMessage error="Er is een fout opgetreden" />
```

### InlineErrorMessage

Compacte error message voor inline gebruik (bijv. bij form velden).

**Gebruik:**

```tsx
import { InlineErrorMessage } from '@/components/common'

function MyForm() {
  return (
    <div>
      <input type="text" />
      <InlineErrorMessage message="Dit veld is verplicht" />
    </div>
  )
}
```

### useErrorHandler Hook

Hook voor het programmatisch triggeren van error boundaries.

**Gebruik:**

```tsx
import { useErrorHandler } from '@/components/common'

function MyComponent() {
  const handleError = useErrorHandler()

  async function loadData() {
    try {
      // Load data
    } catch (error) {
      // Trigger error boundary
      handleError(error)
    }
  }

  return <button onClick={loadData}>Load</button>
}
```

## Error Handling Utilities

Zie `lib/utils/error-handler.ts` voor utility functies:

- `handleError(error, context)` - Normaliseer en log error
- `normalizeError(error)` - Converteer naar AppError
- `getUserFriendlyMessage(error)` - Krijg user-friendly message
- `retryWithBackoff(fn, maxRetries, delay)` - Retry met exponential backoff
- `isRecoverableError(error)` - Check of error recoverable is

**Voorbeeld:**

```tsx
import { handleError, retryWithBackoff } from '@/lib/utils'

// Error handling
try {
  await apiCall()
} catch (error) {
  const appError = handleError(error, 'MyComponent.apiCall')
  setError(appError)
}

// Retry met backoff
const data = await retryWithBackoff(
  () => fetch('/api/data'),
  3,  // max retries
  1000  // initial delay (ms)
)
```

## Best Practices

### 1. Wrap hoofdcomponenten in ErrorBoundary

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

### 2. Gebruik handleError voor async errors

Error Boundaries vangen alleen rendering errors. Voor async errors:

```tsx
async function handleSubmit() {
  try {
    await submitForm(data)
  } catch (error) {
    const appError = handleError(error, 'FormComponent.handleSubmit')
    setError(appError)
  }
}

return <ErrorMessage error={error} />
```

### 3. Retry recoverable errors

```tsx
import { isRecoverableError, retryWithBackoff } from '@/lib/utils'

async function loadData() {
  try {
    if (isRecoverableError(lastError)) {
      const data = await retryWithBackoff(() => fetchData())
      return data
    }
  } catch (error) {
    // Handle error
  }
}
```

### 4. Show appropriate error UI

```tsx
// Voor form validation
<InlineErrorMessage message="Email is verplicht" />

// Voor component errors
<ErrorMessage
  error={error}
  showRetry
  onRetry={handleRetry}
/>

// Voor critical errors
<ErrorBoundary>
  <CriticalComponent />
</ErrorBoundary>
```

## Error Types

De applicatie gebruikt verschillende error types:

- `NETWORK` - Netwerkproblemen (status 0)
- `TIMEOUT` - Request timeout (status 408)
- `API` - API errors (status 4xx, 5xx)
- `VALIDATION` - Validatie errors
- `UNKNOWN` - Onbekende errors

Elk type heeft zijn eigen styling en gebruiksvriendelijke message.
