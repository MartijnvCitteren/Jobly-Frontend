# Dockerfile voor Jobly Frontend (Next.js)

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Installeer alleen production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Environment arguments voor build-time configuratie
# Gebruik: docker build --build-arg NEXT_PUBLIC_ENVIRONMENT=production
ARG NEXT_PUBLIC_ENVIRONMENT=production
ARG NEXT_PUBLIC_API_URL

# Zet environment variables voor de build
ENV NEXT_PUBLIC_ENVIRONMENT=${NEXT_PUBLIC_ENVIRONMENT}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Kopieer dependencies van deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./

# Installeer dev dependencies voor build
RUN npm ci

# Kopieer source code
COPY . .

# Log build configuratie (voor debugging)
RUN echo "Building with NEXT_PUBLIC_ENVIRONMENT=${NEXT_PUBLIC_ENVIRONMENT}"

# Build de applicatie
RUN npm run build

# Stage 3: Runner (productie)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Maak non-root user aan
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Kopieer alleen noodzakelijke bestanden
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Zet ownership naar nextjs user
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
