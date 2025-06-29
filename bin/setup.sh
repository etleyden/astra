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

