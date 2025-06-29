## Getting Started

Dependencies (make sure these are installed first):
- npm  v11.4.2
- Node v24.2.0
- Docker

Obviously you should already have NPM/Node installed. This is being developed with Node v24.2.0 and npm v11.4.2
Make sure you have [mkcert](https://github.com/FiloSottile/mkcert) installed to help set up the certs to run on HTTPS locally. This script assumes you have already run `mkcert -install` on your system. 

Run our setup script:
```
bash bin/setup.sh
```

## I want too...

Work in a development environment: `npm run dev` in the root directory.

Compile the Electron app: `npm run build-electron && npm run electron` in `packages/ui/`.