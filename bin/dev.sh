#!/bin/bash

# Build all the components of the app into a live development environment
# Parse flags
BUILD_FLAG=false
while getopts "b" opt; do
  case $opt in
    b)
      BUILD_FLAG=true
      ;;
    *)
      echo "Usage: $0 [-b]"
      exit 1
      ;;
  esac
done
CURRENT_DIR="$(pwd)"
echo "Root Directory: $CURRENT_DIR"

npm --workspaces run build

cd $CURRENT_DIR/containers
docker rm -f astra-dev-db 2>/dev/null || true
if [ "$BUILD_FLAG" = true ]; then
  echo "Running docker compose up with --build..."
  docker compose build --no-cache
  docker compose up -d
else
  echo "Running docker compose up..."
  docker compose up -d
fi


echo "Waiting for Postgres to be ready..."
# Wait until the DB is accepting connections (adjust host/port as needed)
until docker exec astra-dev-db pg_isready -U astra; do
  sleep 1
done

echo "Postgres is ready. Running TypeORM sync..."

# Run TypeORM sync or migrations inside the container
docker exec -w /app/packages astra-api \
  npx ts-node db/data-source.ts

echo "Dev environment is ready."