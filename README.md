## Development

### Getting Started

To set up your development environment, you'll need to complete the following steps:

**Database Setup**

- Make sure postgres is installed and set up on your environment. [\[Arch Linux\]](https://gist.github.com/NickMcSweeney/3444ce99209ee9bd9393ae6ab48599d8)
- Make sure a clean database is available for use. I create a separate role/user that represents the backend of the site interacting with the db

1. Create a database in postgres
```SQL
CREATE DATABASE astral_db;
```
2. In the `db_setup/` directory, there is a DDL to create the relations in `astral.sql`. In postgres, execute `\i /path/to/astral.sql`. If successful, output will look something like this: 
```
psql:astral.sql:1: NOTICE:  table "vendor" does not exist, skipping
psql:astral.sql:1: NOTICE:  table "txn" does not exist, skipping
psql:astral.sql:1: NOTICE:  table "app_user" does not exist, skipping
psql:astral.sql:1: NOTICE:  table "acct" does not exist, skipping
psql:astral.sql:1: NOTICE:  table "category" does not exist, skipping
DROP TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE 
```
3. Now, in `astral_backend`, create a `.env` with the following variables: 
```
ASTRAL_DB_USER=[username]
ASTRAL_DB_HOST=localhost
ASTRAL_DB_PORT=5432
ASTRAL_DB_NAME=[dbname]
```

**Development Environment Setup**

Repeat the following steps for `astral_frontend` and `astral_backend`:

```
npm install
npm run start
```
