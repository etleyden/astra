import "reflect-metadata";
import express from "express";
import fs from "fs";
import https from "https";
import { useExpressServer } from "routing-controllers";
import { controllers } from "./routes";
import { GlobalErrorHandler } from "./middleware/GlobalErrorHandler";
import { CustomErrorHandler } from "./middleware/CustomErrorHandler";

const app = express();

app.use(express.json());

useExpressServer(app, {
  routePrefix: "/api",
  controllers,
  middlewares: [CustomErrorHandler, GlobalErrorHandler],
  defaultErrorHandler: false, // we've implemented our own error handler
  classTransformer: true,
  validation: true, // automatically validate @Body() with class-validator
});

// 🔐 mkcert certs
// TODO: change certs and port to be environment variables
const httpsOptions = {
  key: fs.readFileSync("certs/localhost-key.pem"),
  cert: fs.readFileSync("certs/localhost.pem"),
};

const PORT = 3001;

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running at https://localhost:${PORT}`);
});
