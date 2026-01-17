# Jobly Frontend

Een moderne Next.js applicatie voor het genereren en beheren van vacatures.

## 🚀 Quick Start

### Lokale Development

1. **Clone de repository**
```bash
git clone <repository-url>
cd Jobly-Frontend
```

2. **Installeer dependencies**
```bash
npm install
```

3. **Configureer environment** (optioneel)

Maak een `.env.local` bestand:
```bash
# Voor lokale development (default)
NEXT_PUBLIC_ENVIRONMENT=local
```

4. **Start de development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

De applicatie gebruikt standaard `http://localhost:8090/api/v1` als backend endpoint.

## 🌍 Environment Configuratie

Deze applicatie ondersteunt meerdere omgevingen met vooraf geconfigureerde endpoints.

### Ondersteunde Omgevingen

| Environment | API Endpoint | Gebruik |
|-------------|--------------|---------|
| `local` | `http://localhost:8090/api/v1` | Lokale development |
| `develop` | `https://api-dev.jobly.nl/api/v1` | Development/Staging |
| `production` | `https://api.jobly.nl/api/v1` | Productie |

**⚠️ Let op:** Pas de develop en production URLs aan in `lib/config/env.ts` naar jouw daadwerkelijke endpoints!

### Environment Instellen

**Optie 1: Via .env.local** (aanbevolen voor lokale development)
```bash
NEXT_PUBLIC_ENVIRONMENT=local
```

**Optie 2: Via build command**
```bash
npm run build:develop
# of
npm run build:production
```

**Optie 3: Via environment variable**
```bash
NEXT_PUBLIC_ENVIRONMENT=production npm run build
```

### 📚 Gedetailleerde Configuratie

Voor uitgebreide informatie over environment configuratie, Docker deployments, en Azure setup, zie [ENV_CONFIG.md](./ENV_CONFIG.md).

## 🛠️ Beschikbare Scripts

### Development
```bash
npm run dev              # Start development server
npm run build            # Build voor huidige environment
npm run build:local      # Build voor local environment
npm run build:develop    # Build voor develop environment
npm run build:production # Build voor production environment
npm start                # Start production server
```

### Code Kwaliteit
```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code met Prettier
npm run format:check     # Check code formatting
npm run type-check       # TypeScript type checking
npm run validate         # Run alle checks (type-check + lint + test)
```

### Testing
```bash
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests met coverage report
npm run test:ci          # Run tests in CI mode
npm run test:debug       # Debug tests
```

### Docker
```bash
npm run docker:build:local      # Build Docker image voor local
npm run docker:build:develop    # Build Docker image voor develop
npm run docker:build:production # Build Docker image voor production
```

Of gebruik docker-compose:
```bash
docker-compose up --build
```

## 🐳 Docker Deployment

### Build voor specifieke omgeving

```bash
docker build --build-arg NEXT_PUBLIC_ENVIRONMENT=production -t jobly-frontend:prod .
```

### Run de container

```bash
docker run -p 3000:3000 jobly-frontend:prod
```

### Docker Compose

```bash
docker-compose up -d
```

**Let op:** Pas `NEXT_PUBLIC_ENVIRONMENT` aan in `docker-compose.yml` voor de gewenste omgeving.

## 📁 Project Structuur

```
├── app/                    # Next.js App Router pages
│   ├── vacancies/         # Vacature gerelateerde pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React componenten
│   ├── common/           # Gedeelde componenten
│   ├── ui/               # UI componenten (Button, Input, etc.)
│   └── vacancy/          # Vacature specifieke componenten
├── lib/                   # Utilities en configuratie
│   ├── api/              # API client en repositories
│   ├── config/           # Environment en configuratie
│   ├── domain/           # Domain models en schemas
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Helper functies
├── __tests__/            # Test bestanden
└── public/               # Statische assets
```

## 🧪 Testing

Het project gebruikt Jest en React Testing Library voor testing.

```bash
# Run alle tests
npm test

# Watch mode voor development
npm run test:watch

# Met coverage report
npm run test:coverage
```

Coverage reports worden gegenereerd in `/coverage`.

## 🔧 Configuratie Bestanden

- `next.config.ts` - Next.js configuratie
- `tsconfig.json` - TypeScript configuratie
- `jest.config.js` - Jest test configuratie
- `eslint.config.mjs` - ESLint configuratie
- `postcss.config.mjs` - PostCSS configuratie (Tailwind)
- `lib/config/env.ts` - Environment configuratie ⭐

## 🚢 Deployment

### Azure Container Apps

1. **Build de image met de juiste environment:**
```bash
docker build --build-arg NEXT_PUBLIC_ENVIRONMENT=production -t myregistry.azurecr.io/jobly-frontend:latest .
```

2. **Push naar Azure Container Registry:**
```bash
docker push myregistry.azurecr.io/jobly-frontend:latest
```

3. **Deploy naar Azure Container Apps**

Zie [ENV_CONFIG.md](./ENV_CONFIG.md) voor gedetailleerde Azure deployment instructies.

### Aanbevolen: Reverse Proxy Setup

Voor production deployments raden we aan om de frontend en backend achter dezelfde domain te plaatsen met een reverse proxy (Azure Front Door, nginx, etc.):

```
https://jobly.nl/          → Frontend
https://jobly.nl/api/*     → Backend
```

Dit voorkomt CORS issues en elimineert de noodzaak voor per-environment builds.

## 🔍 Debugging

### Environment Info Loggen

```typescript
import { logEnvironmentInfo } from '@/lib/config/env'

// In je component
logEnvironmentInfo()
```

Dit toont de huidige configuratie in de browser console.

### Environment Variabelen Checken

```typescript
import { env } from '@/lib/config/env'

console.log('Environment:', env.ENVIRONMENT)
console.log('API URL:', env.API_URL)
console.log('Is Local:', env.IS_LOCAL)
```

## 📚 Meer Informatie

- [Next.js Documentation](https://nextjs.org/docs)
- [Environment Configuratie Guide](./ENV_CONFIG.md) ⭐
- [API Client Documentation](./lib/api/README.md)
- [Component Documentation](./components/README.md)

## 🤝 Contributing

1. Maak een feature branch: `git checkout -b feature/nieuwe-feature`
2. Commit je changes: `git commit -m 'Add nieuwe feature'`
3. Push naar de branch: `git push origin feature/nieuwe-feature`
4. Open een Pull Request

## 📝 License

[Zie LICENSE bestand](./LICENSE)
