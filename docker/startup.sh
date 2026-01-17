#!/bin/sh
set -e

# ================================
# Runtime Environment Configuration Script
# ================================

echo "🚀 Starting Jobly Frontend..."
echo "📝 Configuring runtime environment variables..."

# Default API base URLs per environment
DEFAULT_LOCAL="http://localhost:8090"
DEFAULT_DEV="https://api-dev.jobzy.app"
DEFAULT_PROD="https://api.jobzy.app"

# Get API_BASE_URL from environment or use default based on ENVIRONMENT
if [ -z "$API_BASE_URL" ]; then
  case "${ENVIRONMENT:-local}" in
    local)
      API_BASE_URL="$DEFAULT_LOCAL"
      ;;
    dev)
      API_BASE_URL="$DEFAULT_DEV"
      ;;
    prod)
      API_BASE_URL="$DEFAULT_PROD"
      ;;
    *)
      API_BASE_URL="$DEFAULT_LOCAL"
      ;;
  esac
  echo "⚙️  No API_BASE_URL set, using default for ${ENVIRONMENT:-local}: $API_BASE_URL"
else
  echo "✅ Using provided API_BASE_URL: $API_BASE_URL"
fi

# Ensure API_BASE_URL doesn't end with a slash
API_BASE_URL=$(echo "$API_BASE_URL" | sed 's:/*$::')

# Create runtime config with actual values
echo "🔧 Injecting API_BASE_URL into runtime config..."
cat > /app/public/runtime-config.js << EOF
// Runtime Configuration
// Dit bestand wordt tijdens het starten van de container aangepast met de juiste waarden
window.__RUNTIME_CONFIG__ = {
  API_BASE_URL: "${API_BASE_URL}"
};
EOF
echo "✅ Runtime configuration complete!"

echo "🌐 API Base URL: $API_BASE_URL"
echo "🎯 Environment: ${ENVIRONMENT:-local}"
echo "🚀 Starting Next.js server on port ${PORT:-3000}..."
echo ""

# Start Next.js server
exec node server.js
