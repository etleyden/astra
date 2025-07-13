#!/bin/bash

# Build all the components of the app into a live development environment
CURRENT_DIR="$(pwd)"
echo "Root Directory: $CURRENT_DIR"

cd $CURRENT_DIR/containers
docker rm -f astra-dev-db 2>/dev/null || true
docker compose up --build --detach

cd $CURRENT_DIR
npm --workspaces run build