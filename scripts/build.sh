#!/bin/bash
# ==============================================================================
# build.sh
# Build and optionally push container images for deployment
# ==============================================================================

set -euo pipefail

TAG=${1:-latest}
REGISTRY=${REGISTRY:-""}  # Set this in CI or your terminal if needed

BACKEND_IMAGE="${REGISTRY:+$REGISTRY/}sockpuppet-sentinel-backend:$TAG"
FRONTEND_IMAGE="${REGISTRY:+$REGISTRY/}sockpuppet-sentinel-frontend:$TAG"

echo "[INFO] Building backend image: $BACKEND_IMAGE"
docker build -t "$BACKEND_IMAGE" -f backend/Dockerfile backend

echo "[INFO] Building frontend image: $FRONTEND_IMAGE"
docker build -t "$FRONTEND_IMAGE" -f frontend/Dockerfile .

if [ -n "$REGISTRY" ]; then
  echo "[INFO] Pushing images to $REGISTRY..."
  docker push "$BACKEND_IMAGE"
  docker push "$FRONTEND_IMAGE"
fi

echo "[SUCCESS] Images built${REGISTRY:+ and pushed} successfully."
