## Getting Started

Dependencies (make sure these are installed first):

- npm v11.4.2
- Node v24.2.0
- Docker
- [mkcert](https://github.com/FiloSottile/mkcert)

Obviously you should already have NPM/Node installed. This is being developed with Node v24.2.0 and npm v11.4.2
Make sure you have [mkcert](https://github.com/FiloSottile/mkcert) installed to help set up the certs to run on HTTPS locally. This script assumes you have already run `mkcert -install` on your system.

Run our setup script. Note that this will generate database credentials for the local development db (we're fine with this because it's the same for everyone). If you have your own db or if the setup script is supposed to be setting up a production environment, you will have to set up your own db credentials.

```
npm run setup
```

## I want to...

Work in a development environment: `npm run dev` in the root directory.

Compile the Electron app: `npm run build-electron && npm run electron` in `packages/ui/`.

Debug the development DB using pgAdmin:

- with the docker containers up, visit http://localhost:5050
- Login with credentials (check `containers/docker-compose.yml`)
- Right click in the Object Explorer > Register > Server
- Host name/address: `db`; The rest of the development credentials are in `docker-compose.yml`
