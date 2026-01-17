# ================================
# Multi-stage Dockerfile voor Jobly Frontend
# Ondersteunt runtime environment variables
#
# Platform: Gebruik --platform=linux/amd64 in build commando
# voor compatibiliteit met Azure Container Apps
# ================================

# ---- Dependencies Stage ----
FROM node:20-alpine AS deps

# Installeer alleen de dependencies die nodig zijn voor native builds
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Kopieer package files
COPY package.json package-lock.json* ./

# Installeer dependencies
RUN npm ci

# ---- Builder Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Kopieer node_modules van deps stage
COPY --from=deps /app/node_modules ./node_modules

# Kopieer source code
COPY . .

# Build de Next.js applicatie
# Next.js verzamelt telemetrie, disable dit voor privacy
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- Runner Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

# Maak non-root user voor security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kopieer publieke bestanden
COPY --from=builder /app/public ./public

# Kopieer standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Kopieer startup script
COPY --chown=nextjs:nodejs docker/startup.sh /app/startup.sh
RUN chmod +x /app/startup.sh

# Maak runtime config file en zorg voor schrijfrechten
RUN echo 'window.__RUNTIME_CONFIG__ = { API_BASE_URL: "__API_BASE_URL__" };' > /app/public/runtime-config.js && \
    chown nextjs:nodejs /app/public/runtime-config.js && \
    chmod 666 /app/public/runtime-config.js

# Zorg dat de public directory de juiste permissions heeft voor nextjs user
RUN chown -R nextjs:nodejs /app/public && \
    chmod 755 /app/public

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Switch naar non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start de applicatie via startup script
ENTRYPOINT ["/app/startup.sh"]
