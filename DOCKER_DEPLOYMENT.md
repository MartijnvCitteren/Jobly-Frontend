# 🐳 Docker Deployment Guide - Jobly Frontend

Deze guide legt uit hoe je de Jobly Frontend Docker image bouwt en gebruikt voor verschillende omgevingen.

## 📋 Overzicht

De Docker setup ondersteunt **runtime environment variables**, wat betekent dat één image werkt voor alle omgevingen:
- 🏠 **Local**: `http://localhost:8090`
- 🔧 **Development**: `https://api-dev.jobzy.app`
- 🚀 **Production**: `https://api.jobzy.app`

## 🏗️ Image Bouwen

### Optie 1: Met Build Script (Aanbevolen)

```bash
# Bouw met standaard versie (latest)
./docker-build.sh

# Bouw met specifieke versie
./docker-build.sh v1.0.0
```

### Optie 2: Handmatig

```bash
# Bouw de Docker image voor linux/amd64 platform
docker build --platform linux/amd64 -t jobzy/frontend:latest .

# Of met specifieke versie
docker build --platform linux/amd64 \
  -t jobzy/frontend:v1.0.0 \
  -t jobzy/frontend:latest \
  .
```

**Note**: Het `--platform linux/amd64` flag zorgt ervoor dat de image compatibel is met Azure Container Apps, zelfs als je op een Mac M1/M2 (ARM) bouwt.

## 🚀 Container Starten

### Local Development
```bash
docker run -d \
  --name jobly-frontend-local \
  -p 3000:3000 \
  -e API_BASE_URL=http://localhost:8090 \
  -e ENVIRONMENT=local \
  jobly-frontend:latest
```

### Development Environment
```bash
docker run -d \
  --name jobly-frontend-dev \
  -p 3000:3000 \
  -e API_BASE_URL=https://api-dev.jobzy.app \
  -e ENVIRONMENT=dev \
  jobly-frontend:latest
```

### Production Environment
```bash
docker run -d \
  --name jobly-frontend-prod \
  -p 3000:3000 \
  -e API_BASE_URL=https://api.jobzy.app \
  -e ENVIRONMENT=prod \
  jobly-frontend:latest
```

## 🎯 Docker Compose Gebruiken

### Start local environment
```bash
docker-compose up frontend-local
```

### Start development environment
```bash
docker-compose --profile dev up frontend-dev
```

### Start production environment
```bash
docker-compose --profile prod up frontend-prod
```

### Alle environments tegelijk (voor testing)
```bash
docker-compose --profile dev --profile prod up
```

Dit start:
- Local op poort 3000
- Dev op poort 3001
- Prod op poort 3002

## ☁️ Azure Container Apps

### Environment Variables Instellen

Voor **Development Container App**:
```bash
az containerapp update \
  --name jobly-frontend-dev \
  --resource-group jobly-rg \
  --set-env-vars \
    API_BASE_URL=https://api-dev.jobzy.app \
    ENVIRONMENT=dev \
    NODE_ENV=production
```

Voor **Production Container App**:
```bash
az containerapp update \
  --name jobly-frontend-prod \
  --resource-group jobly-rg \
  --set-env-vars \
    API_BASE_URL=https://api.jobzy.app \
    ENVIRONMENT=prod \
    NODE_ENV=production
```

### Via Azure Portal

1. Ga naar je Container App
2. Klik op **"Containers"** in het menu
3. Selecteer je container
4. Ga naar **"Environment variables"** tab
5. Voeg toe:
   - **Name**: `API_BASE_URL`
   - **Value**: `https://api-dev.jobzy.app` (of prod URL)
   - **Name**: `ENVIRONMENT`
   - **Value**: `dev` (of `prod`)

## 🔍 Verificatie

### Check of de runtime config correct is geladen
```bash
# Exec into de container
docker exec -it jobly-frontend-local sh

# Bekijk de runtime config
cat /app/public/runtime-config.js

# Verwachte output:
# window.__RUNTIME_CONFIG__ = { API_BASE_URL: "http://localhost:8090" };
```

### Test de applicatie
```bash
# Open in browser
open http://localhost:3000

# Check de API URL in de browser console
window.__RUNTIME_CONFIG__
```

### Health Check
```bash
# Check container health
docker ps --filter name=jobly-frontend

# Bekijk logs
docker logs jobly-frontend-local

# Verwachte output:
# 🚀 Starting Jobly Frontend...
# 📝 Configuring runtime environment variables...
# ✅ Using provided API_BASE_URL: http://localhost:8090
# 🔧 Injecting API_BASE_URL into runtime config...
# ✅ Runtime configuration complete!
# 🌐 API Base URL: http://localhost:8090
# 🎯 Environment: local
# 🚀 Starting Next.js server on port 3000...
```

## 🛠️ Troubleshooting

### Container start niet
```bash
# Bekijk logs voor errors
docker logs jobly-frontend-local

# Check of runtime-config.js bestaat
docker exec -it jobly-frontend-local cat /app/public/runtime-config.js
```

### API calls falen
```bash
# Verify API_BASE_URL in container
docker exec -it jobly-frontend-local sh -c 'echo $API_BASE_URL'

# Check runtime config in browser
# Open DevTools Console en run:
window.__RUNTIME_CONFIG__
```

### Port conflicts
```bash
# Gebruik een andere host port
docker run -d \
  --name jobly-frontend \
  -p 3001:3000 \
  -e API_BASE_URL=http://localhost:8090 \
  jobly-frontend:latest
```

## 📝 Environment Variables

| Variable | Beschrijving | Default | Voorbeeld |
|----------|-------------|---------|-----------|
| `API_BASE_URL` | Base URL van de API (zonder /api/v1) | - | `https://api-dev.jobzy.app` |
| `ENVIRONMENT` | Omgeving indicator | `local` | `dev`, `prod` |
| `NODE_ENV` | Node environment | `production` | `production` |
| `PORT` | Container port (intern) | `3000` | `3000` |

## 🔐 Security Best Practices

1. ✅ Container draait als non-root user (`nextjs`)
2. ✅ Security headers geconfigureerd in Next.js
3. ✅ Health check ingebouwd
4. ✅ Telemetrie uitgeschakeld voor privacy
5. ✅ Minimale image size door multi-stage build
6. ✅ Geen gevoelige data in logs

## 📦 Image Size Optimalisatie

De Dockerfile gebruikt multi-stage builds om de image size te minimaliseren:

```bash
# Check image size
docker images jobly-frontend

# Verwachte size: ~150-200MB (afhankelijk van dependencies)
```

## 🔄 Updates Deployen

```bash
# 1. Bouw nieuwe image
docker build -t jobly-frontend:v1.0.1 .

# 2. Tag als latest
docker tag jobly-frontend:v1.0.1 jobly-frontend:latest

# 3. Push naar registry (Azure Container Registry)
docker push <registry>.azurecr.io/jobly-frontend:v1.0.1
docker push <registry>.azurecr.io/jobly-frontend:latest

# 4. Update Container App
az containerapp update \
  --name jobly-frontend-prod \
  --resource-group jobly-rg \
  --image <registry>.azurecr.io/jobly-frontend:v1.0.1
```

## 💡 Tips

- Gebruik altijd dezelfde image voor alle omgevingen
- Test de image lokaal voordat je deploy naar dev/prod
- Monitor de startup logs om te verifiëren dat env vars correct zijn
- Gebruik Docker Compose voor lokale ontwikkeling met meerdere services

## 📚 Gerelateerde Documentatie

- [Next.js Standalone Output](https://nextjs.org/docs/advanced-features/output-file-tracing)
- [Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
