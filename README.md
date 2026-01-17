# 🚀 Jobly Frontend

AI-powered vacature generator gebouwd met Next.js 15, React 19, en TypeScript.

## 📋 Overzicht

Jobly helpt recruiters en HR professionals om snel professionele vacatureteksten te genereren met behulp van AI. De applicatie biedt een stapsgewijze wizard interface voor het invoeren van bedrijfs- en functie-informatie, en genereert vervolgens een complete vacaturetekst.

## ✨ Features

- 🎯 **Multi-step Wizard**: Intuïtieve stapsgewijze interface
- 🤖 **AI-powered**: Automatische vacaturetekst generatie
- 📱 **Responsive Design**: Werkt op desktop, tablet en mobile
- 🎨 **Modern UI**: Gebouwd met Tailwind CSS
- 🔒 **Type-safe**: Volledig TypeScript met Zod validatie
- 🧪 **Well-tested**: Uitgebreide test coverage met Jest
- 🐳 **Docker Ready**: Multi-environment Docker support
- ☁️ **Azure Compatible**: Klaar voor Azure Container Apps

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Validation**: Zod
- **Testing**: Jest + React Testing Library
- **API Client**: Native Fetch met custom wrapper
- **Containerization**: Docker + Docker Compose

## 🚀 Quick Start

### Lokale Ontwikkeling

```bash
# Installeer dependencies
npm install

# Kopieer environment variables
cp .env.example .env.local

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

### Docker

```bash
# Bouw en start met Docker Compose
docker-compose up -d

# Of handmatig
./docker-build.sh
docker run -d -p 3000:3000 \
  -e API_BASE_URL=http://localhost:8090 \
  -e ENVIRONMENT=local \
  jobzy/frontend:latest
```

## 📚 Documentatie

- [🚀 Quick Start Guide](./QUICK_START.md) - Snelle referentie voor deployment
- [⚙️ Runtime Configuration](./RUNTIME_CONFIG.md) - Uitleg over runtime env vars
- [🐳 Docker Deployment](./DOCKER_DEPLOYMENT.md) - Complete deployment guide
- [📝 Environment Config](./ENV_CONFIG.md) - Environment variables details

## 🏗️ Project Structuur

```
jobly-frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout met runtime config
│   ├── page.tsx             # Homepage
│   └── vacancies/           # Vacature routes
│       ├── create/          # Wizard pagina
│       └── result/          # Resultaat pagina
├── components/              # React componenten
│   ├── common/              # Gedeelde componenten (Error, Loading)
│   ├── ui/                  # UI componenten (Button, Input, Card)
│   └── vacancy/             # Vacature-specifieke componenten
│       ├── steps/           # Wizard stappen
│       ├── VacancyWizard.tsx
│       └── VacancyResult.tsx
├── lib/                     # Utilities en business logic
│   ├── api/                 # API client en repositories
│   ├── config/              # Configuratie (env, constants)
│   ├── domain/              # Domain models en schemas
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Utility functies
├── public/                  # Statische bestanden
│   └── runtime-config.js    # Runtime configuratie (Docker)
├── docker/                  # Docker scripts
│   ├── startup.sh           # Container startup script
│   └── README.md
├── Dockerfile               # Multi-stage Docker build
├── docker-compose.yml       # Lokale development setup
└── __tests__/               # Test bestanden
```

## 🧪 Testing

```bash
# Run alle tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Open coverage report
open coverage/lcov-report/index.html
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build voor productie
npm start            # Start productie server
npm run lint         # Run ESLint
npm test             # Run tests
npm run test:watch   # Tests in watch mode
npm run test:coverage # Tests met coverage
```

### Environment Variables

#### Development (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8090/api/v1
NODE_ENV=development
```

#### Docker Runtime

```bash
API_BASE_URL=https://api-dev.jobzy.app  # Base URL (zonder /api/v1)
ENVIRONMENT=dev                          # local | dev | prod
```

## 🐳 Docker Deployment

### Één Image voor Alle Omgevingen

De applicatie gebruikt runtime environment variables, wat betekent dat je **één Docker image** kunt gebruiken voor local, dev, en prod:

```bash
# 1. Bouw image
docker build -t jobly-frontend:latest .

# 2. Deploy naar verschillende omgevingen
# Local
docker run -e API_BASE_URL=http://localhost:8090 jobly-frontend

# Dev
docker run -e API_BASE_URL=https://api-dev.jobzy.app jobly-frontend

# Prod
docker run -e API_BASE_URL=https://api.jobzy.app jobly-frontend
```

Zie [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) voor meer details.

## ☁️ Azure Container Apps

### Deploy naar Azure

```bash
# Login
az login

# Tag en push naar registry
docker tag jobly-frontend:latest <registry>.azurecr.io/jobly-frontend:latest
docker push <registry>.azurecr.io/jobly-frontend:latest

# Update Container App
az containerapp update \
  --name jobly-frontend-prod \
  --resource-group jobly-rg \
  --image <registry>.azurecr.io/jobly-frontend:latest \
  --set-env-vars \
    API_BASE_URL=https://api.jobzy.app \
    ENVIRONMENT=prod
```

## 🌐 API Endpoints

De applicatie communiceert met de backend API:

| Omgeving | API Base URL | Volledige URL |
|----------|--------------|---------------|
| Local | `http://localhost:8090` | `http://localhost:8090/api/v1` |
| Dev | `https://api-dev.jobzy.app` | `https://api-dev.jobzy.app/api/v1` |
| Prod | `https://api.jobzy.app` | `https://api.jobzy.app/api/v1` |

### Belangrijke Endpoints

- `POST /api/v1/create-company-info` - Bedrijfsinformatie
- `POST /api/v1/create-job-basics` - Basis functie-informatie
- `POST /api/v1/create-job-details` - Gedetailleerde functie-informatie
- `POST /api/v1/create-job-requirements` - Functie-eisen
- `POST /api/v1/generate-vacancy` - Genereer complete vacature

## 🔒 Security

- ✅ TypeScript voor type safety
- ✅ Zod voor runtime validatie
- ✅ Security headers geconfigureerd
- ✅ CSRF protection headers
- ✅ Input sanitization
- ✅ Error boundary voor graceful errors
- ✅ Non-root Docker user
- ✅ No secrets in runtime config

## 📊 Code Quality

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured voor Next.js
- **Testing**: Jest + React Testing Library
- **Coverage**: Uitgebreide test coverage
- **Documentation**: Inline comments en README's

## 🤝 Contributing

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je changes (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

### Development Guidelines

- Schrijf tests voor nieuwe features
- Volg de bestaande code style
- Update documentatie waar nodig
- Gebruik TypeScript strict mode
- Valideer input met Zod schemas

## 📝 License

Dit project is gelicenseerd onder de MIT License - zie het [LICENSE](LICENSE) bestand voor details.

## 👥 Team

Ontwikkeld door het Jobly Team

## 🐛 Bug Reports

Vond je een bug? [Open een issue](https://github.com/jouw-org/jobly-frontend/issues)

## 💡 Feature Requests

Heb je een idee? [Open een feature request](https://github.com/jouw-org/jobly-frontend/issues/new)

## 📞 Support

Voor vragen of support, neem contact op via [support@jobzy.app](mailto:support@jobzy.app)

---

**Built with ❤️ using Next.js, React, and TypeScript**
