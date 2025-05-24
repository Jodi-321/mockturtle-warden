#!/bin/bash
#
# Validate containers locally with health checks and diagnostics
#

set -euo pipefail

# Color Output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'


info() { echo -e "${BLUE}[INFO]${NC} $1";}
success() { echo -e "${GREEN}[SUCCESS]${NC} $1";}
error() { echo -e "${RED}[ERROR]${NC} $1"; }

BACKEND_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:5173"
MAX_RETRIES=10

## Start Containers
info "Building and starting containers..."
docker-compose -f docker-compose.yml -f docker-compose.security.yml up -d --build

## Wait for health check
wait_for_health() {
    local url=$1
    local name=$2
    local retries=0

    info "Waiting for ${name} to be ready at ${url}..."

    until curl -fs "${url}/health" > /dev/null 2>&1; do
        sleep 5
        retried=$((retries + 1))
        if [ $retries -ge $MAX_RETRIES ]; then
            error "${name} did not become healthy in time"
            exit 1
        fi
        info "${name} not ready yet... retry ${retries}/${MAX_RETRIES}"
    done 

    success "${name} is healthy"
}

wait_for_health "$BACKEND_URL" "Backend"
wait_for_health "$FRONTEND_URL" "Frontend"

## Backend API test
info "Testing backend /chat endpoint..."
TOKEN=$(curl -s -X POST "$BACKEND_URL/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=admin@example.com&password=securepassword123" | jq -r .access_token)

    if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
        error "Failed to authenticate with backend"
        exit 1
    fi

RESPONSE=$(curl -s -X POST "$BACKEND_URL/chat" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"message": "Hello"}')

if echo "$RESPONSE" | grep -q "reply"; then
    success "Chat endpoint working: $RESPONSE"
else
    error "Chat endpoint test failed: $RESPONSE"
    exit 1
fi

## Frontend response test
info "Validating frontend HTML delivery..."
if curl -fs "$FRONTEND_URL" | grep -q "<html"; then
    success "Frontend loaded HTML succesfully"
else
    error "Frontend test failed"
    exit 1
fi

## Print Respurce Usage
info "Caontainer status:"
docker-compose ps

info "Container resource usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

success "All tests passed!"