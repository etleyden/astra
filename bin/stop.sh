#!/bin/bash

# Stop all running docker containers
CURRENT_DIR="$(pwd)"
echo "Root Directory: $CURRENT_DIR"

cd $CURRENT_DIR/containers
docker compose down