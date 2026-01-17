# 🐳 Docker Scripts

Deze folder bevat scripts die worden gebruikt tijdens het starten van de Docker container.

## 📁 Bestanden

### `startup.sh`

Het startup script dat wordt uitgevoerd wanneer de container start. Dit script:

1. **Leest environment variables** (`API_BASE_URL`, `ENVIRONMENT`)
2. **Injecteert runtime configuratie** in `/app/public/runtime-config.js`
3. **Start de Next.js server**

#### Hoe het werkt

```bash
# Script wordt aangeroepen door Dockerfile ENTRYPOINT
ENTRYPOINT ["/app/startup.sh"]
```

#### Environment Variables

Het script gebruikt de volgende environment variables:

| Variable | Beschrijving | Default |
|----------|-------------|---------|
| `API_BASE_URL` | De base URL van de backend API | Afhankelijk van `ENVIRONMENT` |
| `ENVIRONMENT` | De omgeving (`local`, `dev`, `prod`) | `local` |
| `PORT` | De poort waarop de server luistert | `3000` |

#### Default URLs per Environment

Als `API_BASE_URL` niet is ingesteld, gebruikt het script defaults:

- **local**: `http://localhost:8090`
- **dev**: `https://api-dev.jobzy.app`
- **prod**: `https://api.jobzy.app`

#### Runtime Config Injection

Het script past `/app/public/runtime-config.js` aan:

**Voor injection:**
```javascript
window.__RUNTIME_CONFIG__ = { API_BASE_URL: "__API_BASE_URL__" };
```

**Na injection:**
```javascript
window.__RUNTIME_CONFIG__ = { API_BASE_URL: "https://api-dev.jobzy.app" };
```

#### Logging

Het script toont nuttige informatie tijdens het opstarten:

```
🚀 Starting Jobly Frontend...
📝 Configuring runtime environment variables...
✅ Using provided API_BASE_URL: https://api-dev.jobzy.app
🔧 Injecting API_BASE_URL into runtime config...
✅ Runtime configuration complete!
🌐 API Base URL: https://api-dev.jobzy.app
🎯 Environment: dev
🚀 Starting Next.js server on port 3000...
```

## 🔧 Aanpassingen Maken

Als je het script wilt aanpassen:

1. Bewerk `startup.sh`
2. Zorg dat het executable blijft: `chmod +x docker/startup.sh`
3. Rebuild de Docker image: `docker build -t jobly-frontend .`

## 🧪 Script Testen

Je kunt het script lokaal testen:

```bash
# Maak het executable
chmod +x docker/startup.sh

# Test met environment variables
API_BASE_URL=https://test.example.com ENVIRONMENT=dev ./docker/startup.sh
```

## 📝 Vereisten

Het script verwacht dat:
- `/app/public/runtime-config.js` bestaat
- `/app/server.js` bestaat (Next.js standalone server)
- De nodige permissions zijn ingesteld

Deze worden allemaal geconfigureerd in de `Dockerfile`.
