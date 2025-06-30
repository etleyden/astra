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
SERVICES_ENV_PATH=$CURRENT_DIR/packages/services/.env
DB_ENV_PATH=$CURRENT_DIR/packages/db/.env
DB_ENV_TEXT=$(cat <<EOF
# App environment variables
NODE_ENV=development
VITE_API_URL=http://localhost:3000
DB_USER=astra
DB_PASSWORD=4stra!
DB_NAME=astradb
DB_HOST=localhost
DB_PORT=5432
EOF
)

if [ ! -f $SERVICES_ENV_PATH ]; then
    echo "$DB_ENV_TEXT" > $SERVICES_ENV_PATH
    echo "services/.env created"
else
    echo "services/.env already exists. Skipping..."
fi
if [ ! -f $DB_ENV_PATH ]; then
    echo "$DB_ENV_TEXT" > $DB_ENV_PATH
    echo "db/.env created"
else
    echo "db/.env already exists. Skipping..."
fi
echo "Setup is done!"