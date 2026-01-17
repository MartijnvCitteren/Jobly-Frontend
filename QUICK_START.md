# 🚀 Quick Start - Jobly Frontend Docker

Snelle referentie voor het bouwen en deployen van de Jobly Frontend.

## 📦 1. Image Bouwen

```bash
# Optie 1: Met build script (makkelijkst)
./docker-build.sh

# Optie 2: Handmatig met platform flag
docker build --platform linux/amd64 -t jobzy/frontend:latest .

# Verificatie
docker images | grep jobzy/frontend

# Check platform (optioneel)
docker inspect jobzy/frontend:latest | grep Architecture
```

## 🏃 2. Lokaal Testen

### Optie A: Docker Run

```bash
# Start container
docker run -d \
  --name jobly-frontend \
  -p 3000:3000 \
  -e API_BASE_URL=http://localhost:8090 \
  -e ENVIRONMENT=local \
  jobly-frontend:latest

# Check logs
docker logs -f jobly-frontend

# Open in browser
open http://localhost:3000
```

### Optie B: Docker Compose

```bash
# Start
docker-compose up -d

# Logs bekijken
docker-compose logs -f

# Stop
docker-compose down
```

## ☁️ 3. Deploy naar Azure

### Stap 1: Tag en Push naar Registry

```bash
# Login
az acr login --name <jouw-registry>

# Tag image
docker tag jobly-frontend:latest <registry>.azurecr.io/jobly-frontend:latest

# Push
docker push <registry>.azurecr.io/jobly-frontend:latest
```

### Stap 2: Update Container App

**Development:**
```bash
az containerapp update \
  --name jobly-frontend-dev \
  --resource-group jobly-rg \
  --image <registry>.azurecr.io/jobly-frontend:latest \
  --set-env-vars \
    API_BASE_URL=https://api-dev.jobzy.app \
    ENVIRONMENT=dev
```

**Production:**
```bash
az containerapp update \
  --name jobly-frontend-prod \
  --resource-group jobly-rg \
  --image <registry>.azurecr.io/jobly-frontend:latest \
  --set-env-vars \
    API_BASE_URL=https://api.jobzy.app \
    ENVIRONMENT=prod
```

## 🔍 4. Verificatie

```bash
# Check container status
docker ps | grep jobly-frontend

# Bekijk logs
docker logs jobly-frontend

# Check runtime config
docker exec jobly-frontend cat /app/public/runtime-config.js

# Test in browser
curl http://localhost:3000
```

## 🛠️ 5. Troubleshooting

### Container start niet
```bash
docker logs jobly-frontend
docker inspect jobly-frontend
```

### API calls falen
```bash
# Check environment variables
docker exec jobly-frontend sh -c 'echo $API_BASE_URL'

# Check runtime config
docker exec jobly-frontend cat /app/public/runtime-config.js
```

### Port conflict
```bash
# Gebruik andere port
docker run -d -p 3001:3000 -e API_BASE_URL=http://localhost:8090 jobly-frontend
```

## 📝 Environment Variables

| Variable | Local | Dev | Prod |
|----------|-------|-----|------|
| `API_BASE_URL` | `http://localhost:8090` | `https://api-dev.jobzy.app` | `https://api.jobzy.app` |
| `ENVIRONMENT` | `local` | `dev` | `prod` |

## 🔄 Update Workflow

```bash
# 1. Pull laatste code
git pull

# 2. Rebuild image
docker build -t jobly-frontend:latest .

# 3. Test lokaal
docker-compose up -d
# Test in browser: http://localhost:3000

# 4. Tag voor registry
docker tag jobly-frontend:latest <registry>.azurecr.io/jobly-frontend:v1.0.x

# 5. Push
docker push <registry>.azurecr.io/jobly-frontend:v1.0.x
docker push <registry>.azurecr.io/jobly-frontend:latest

# 6. Deploy naar dev eerst
az containerapp update \
  --name jobly-frontend-dev \
  --resource-group jobly-rg \
  --image <registry>.azurecr.io/jobly-frontend:v1.0.x

# 7. Test dev environment
# Open: https://jobly-frontend-dev.azurewebsites.net

# 8. Als alles werkt, deploy naar prod
az containerapp update \
  --name jobly-frontend-prod \
  --resource-group jobly-rg \
  --image <registry>.azurecr.io/jobly-frontend:v1.0.x
```

## 📚 Meer Info

- [RUNTIME_CONFIG.md](./RUNTIME_CONFIG.md) - Uitleg over runtime configuratie
- [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) - Volledige deployment guide
- [docker/README.md](./docker/README.md) - Startup script details

## 💡 Tips

- Test altijd lokaal met docker-compose voordat je deploy
- Gebruik versie tags (v1.0.x) naast latest
- Deploy eerst naar dev, dan naar prod
- Monitor logs na deployment
- Gebruik health checks om status te verifiëren
