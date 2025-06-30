#!/bin/bash

CURRENT_DIR="$(pwd)"
echo "Root Directory: $CURRENT_DIR"

# set up the UI package, npm install & https certs
cd $CURRENT_DIR/packages/ui
npm install
mkdir $CURRENT_DIR/packages/ui/certs
cd $CURRENT_DIR/packages/ui/certs
mkcert localhost

cd $CURRENT_DIR

# set up the Postgres DB using docker and creating the correct .env file
SERVICES_ENV_PATH = $CURRENT_DIR/packages/services/.env
if [ ! -f $SERVICES_ENV_PATH ]; then
    cat > $SERVICES_ENV_PATH <<EOF
# App environment variables
NODE_ENV=development
VITE_API_URL=http://localhost:3000
DB_USER=astra
DB_PASSWORD=4stra!
DB_NAME=astradb
DB_HOST=localhost
DB_PORT=5432
EOF
    echo "services/.env created"
else
    echo "services/.env already exists. Skipping..."
