# ⚙️ Runtime Configuration - Jobly Frontend

## 📖 Overzicht

De Jobly Frontend gebruikt **runtime environment variables** om de API endpoint dynamisch te configureren. Dit betekent dat **één Docker image** werkt voor alle omgevingen zonder opnieuw te bouwen.

## 🎯 Waarom Runtime Configuration?

### ❌ Probleem met Build-time Variables

Traditioneel worden environment variables tijdens de build ingebakken:

```bash
# Build voor dev
NEXT_PUBLIC_API_URL=https://api-dev.jobzy.app npm run build

# Build voor prod
NEXT_PUBLIC_API_URL=https://api.jobzy.app npm run build
```

**Nadelen:**
- Je moet voor elke omgeving een aparte image bouwen
- Langere deployment tijd
- Meer storage nodig voor meerdere images
- Moeilijker te onderhouden

### ✅ Oplossing: Runtime Variables

Met runtime configuratie:

```bash
# Bouw één keer
docker build -t jobly-frontend .

# Deploy naar dev
docker run -e API_BASE_URL=https://api-dev.jobzy.app jobly-frontend

# Deploy naar prod (dezelfde image!)
docker run -e API_BASE_URL=https://api.jobzy.app jobly-frontend
```

**Voordelen:**
- ✅ Eén image voor alle omgevingen
- ✅ Snellere deployments
- ✅ Minder storage gebruik
- ✅ Eenvoudiger te onderhouden
- ✅ Makkelijker te testen

## 🔧 Hoe het Werkt

### 1. Runtime Config File

Bij het bouwen van de image wordt een placeholder config aangemaakt:

```javascript
// public/runtime-config.js
window.__RUNTIME_CONFIG__ = {
  API_BASE_URL: '__API_BASE_URL__'  // Placeholder
};
```

### 2. Startup Script

Wanneer de container start, vervangt het startup script de placeholder:

```bash
# docker/startup.sh
sed -i "s|__API_BASE_URL__|${API_BASE_URL}|g" /app/public/runtime-config.js
```

**Resultaat:**
```javascript
window.__RUNTIME_CONFIG__ = {
  API_BASE_URL: 'https://api-dev.jobzy.app'  // Echte waarde!
};
```

### 3. Config Laden in Browser

Het script wordt geladen **voor** de React app start:

```tsx
// app/layout.tsx
<Script src="/runtime-config.js" strategy="beforeInteractive" />
```

### 4. Config Gebruiken in Code

De `env.ts` leest de runtime config:

```typescript
// lib/config/env.ts
function getRuntimeConfig(): RuntimeConfig {
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) {
    return window.__RUNTIME_CONFIG__
  }
  return {}
}

// Prioriteit:
// 1. Runtime config (Docker) ← Hoogste prioriteit
// 2. NEXT_PUBLIC_API_URL (development)
// 3. Fallback naar localhost
```

## 🚀 Gebruik

### Lokale Ontwikkeling (zonder Docker)

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8090/api/v1

# Start dev server
npm run dev
```

### Docker - Local Environment

```bash
docker run -d \
  -p 3000:3000 \
  -e API_BASE_URL=http://localhost:8090 \
  -e ENVIRONMENT=local \
  jobly-frontend:latest
```

### Docker - Development Environment

```bash
docker run -d \
  -p 3000:3000 \
  -e API_BASE_URL=https://api-dev.jobzy.app \
  -e ENVIRONMENT=dev \
  jobly-frontend:latest
```

### Docker - Production Environment

```bash
docker run -d \
  -p 3000:3000 \
  -e API_BASE_URL=https://api.jobzy.app \
  -e ENVIRONMENT=prod \
  jobly-frontend:latest
```

## ☁️ Azure Container Apps

### Via Azure CLI

```bash
# Development
az containerapp update \
  --name jobly-frontend-dev \
  --resource-group jobly-rg \
  --set-env-vars \
    API_BASE_URL=https://api-dev.jobzy.app \
    ENVIRONMENT=dev

# Production
az containerapp update \
  --name jobly-frontend-prod \
  --resource-group jobly-rg \
  --set-env-vars \
    API_BASE_URL=https://api.jobzy.app \
    ENVIRONMENT=prod
```

### Via Azure Portal

1. Ga naar je Container App
2. **Containers** → Selecteer container → **Environment variables**
3. Voeg toe:
   - `API_BASE_URL`: `https://api-dev.jobzy.app`
   - `ENVIRONMENT`: `dev`
4. **Save** en de container herstart automatisch

## 🔍 Verificatie

### In de Container

```bash
# Exec into container
docker exec -it jobly-frontend sh

# Check runtime config
cat /app/public/runtime-config.js

# Verwacht:
# window.__RUNTIME_CONFIG__ = { API_BASE_URL: "https://api-dev.jobzy.app" };
```

### In de Browser

Open DevTools Console:

```javascript
// Check runtime config
console.log(window.__RUNTIME_CONFIG__)
// Output: { API_BASE_URL: "https://api-dev.jobzy.app" }

// Check of API client de juiste URL gebruikt
// (Open Network tab en kijk naar API calls)
```

### Container Logs

```bash
docker logs jobly-frontend

# Verwachte output:
# 🚀 Starting Jobly Frontend...
# 📝 Configuring runtime environment variables...
# ✅ Using provided API_BASE_URL: https://api-dev.jobzy.app
# 🔧 Injecting API_BASE_URL into runtime config...
# ✅ Runtime configuration complete!
# 🌐 API Base URL: https://api-dev.jobzy.app
# 🎯 Environment: dev
# 🚀 Starting Next.js server on port 3000...
```

## 📊 API Endpoint Overzicht

| Omgeving | Base URL | Volledige API URL |
|----------|----------|-------------------|
| **Local** | `http://localhost:8090` | `http://localhost:8090/api/v1` |
| **Development** | `https://api-dev.jobzy.app` | `https://api-dev.jobzy.app/api/v1` |
| **Production** | `https://api.jobzy.app` | `https://api.jobzy.app/api/v1` |

### Voorbeeld API Calls

```typescript
// De API client voegt automatisch /api/v1 toe
import { post } from '@/lib/api/client'

// Wordt: https://api-dev.jobzy.app/api/v1/create-company-info
const result = await post('/create-company-info', data)
```

## 🛠️ Troubleshooting

### API calls gaan naar verkeerde URL

**Probleem:** API calls gaan nog steeds naar localhost

**Oplossing:**
```bash
# 1. Check of runtime config correct is
docker exec -it jobly-frontend cat /app/public/runtime-config.js

# 2. Check environment variable in container
docker exec -it jobly-frontend sh -c 'echo $API_BASE_URL'

# 3. Herstart container met correcte env var
docker restart jobly-frontend
```

### Runtime config niet geladen

**Probleem:** `window.__RUNTIME_CONFIG__` is undefined

**Oplossing:**
1. Check of `/runtime-config.js` laadt in Network tab
2. Verifieer dat Script tag in `layout.tsx` aanwezig is
3. Check browser console voor errors

### Placeholder niet vervangen

**Probleem:** Config bevat nog steeds `__API_BASE_URL__`

**Oplossing:**
```bash
# Check startup script permissions
docker exec -it jobly-frontend ls -la /app/startup.sh

# Check of sed command werkt
docker exec -it jobly-frontend sh -c 'sed --version'

# Rebuild image als nodig
docker build --no-cache -t jobly-frontend .
```

## 🔐 Security Overwegingen

### ✅ Wat is Veilig

- Runtime config bevat alleen **publieke** configuratie (API URLs)
- Geen secrets of API keys in runtime config
- Config is read-only na injection

### ⚠️ Wat NIET in Runtime Config

Plaats **nooit** gevoelige data in runtime config:
- ❌ API keys
- ❌ Secrets
- ❌ Passwords
- ❌ Private tokens

Voor gevoelige data, gebruik:
- Azure Key Vault
- Environment variables die niet in browser komen
- Server-side API routes

## 📚 Gerelateerde Bestanden

- `Dockerfile` - Multi-stage build configuratie
- `docker/startup.sh` - Runtime injection script
- `lib/config/env.ts` - Environment configuratie
- `app/layout.tsx` - Runtime config laden
- `public/runtime-config.js` - Runtime config file
- `docker-compose.yml` - Lokale development setup

## 💡 Best Practices

1. **Test lokaal eerst**: Gebruik docker-compose om te testen voordat je deploy
2. **Verifieer na deployment**: Check altijd de logs en runtime config
3. **Gebruik ENVIRONMENT variable**: Helpt met debugging en monitoring
4. **Monitor API calls**: Check Network tab om te verifiëren dat juiste endpoints worden gebruikt
5. **Documenteer wijzigingen**: Update deze docs als je de configuratie aanpast

## 🎓 Meer Informatie

- [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) - Complete deployment guide
- [docker/README.md](./docker/README.md) - Startup script documentatie
- [ENV_CONFIG.md](./ENV_CONFIG.md) - Environment configuratie details
