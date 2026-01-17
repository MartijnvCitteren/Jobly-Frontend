#!/bin/bash

# ================================
# Docker Build Script voor Jobly Frontend
# ================================

# Kleuren voor output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Versie (pas aan indien nodig)
VERSION="${1:-latest}"

echo -e "${BLUE}🐳 Building Jobly Frontend Docker Image${NC}"
echo -e "${BLUE}📦 Version: ${VERSION}${NC}"
echo -e "${BLUE}🏗️  Platform: linux/amd64${NC}"
echo ""

# Build de image met linux/amd64 platform
docker build \
  --platform linux/amd64 \
  -t jobzy/frontend:${VERSION} \
  -t jobzy/frontend:latest \
  .

if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✅ Build succesvol!${NC}"
  echo ""
  echo "📋 Gebouwde images:"
  docker images | grep "jobzy/frontend"
  echo ""
  echo "🚀 Volgende stappen:"
  echo "   - Test lokaal: docker run -d -p 3000:3000 -e API_BASE_URL=http://localhost:8090 jobzy/frontend:latest"
  echo "   - Push naar registry: docker push jobzy-ckdebtfedthpdhcd.azurecr.io/jobzy/frontend:${VERSION}"
else
  echo ""
  echo -e "${RED}❌ Build gefaald!${NC}"
  exit 1
fi
