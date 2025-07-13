CURRENT_DIR=$(pwd)

# Execute the TypeORM code. Will connect to the DB via .env credentials
cd $CURRENT_DIR/packages/db
npm run build || echo "Building the DB failed... Is it running?"