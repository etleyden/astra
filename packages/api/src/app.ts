import "reflect-metadata";
import express from "express";
import fs from "fs";
import https from "https";
import { useExpressServer } from "routing-controllers";
import { controllers } from "./routes";

const app = express();

useExpressServer(app, {
  controllers,
});

// 🔐 mkcert certs
const httpsOptions = {
  key: fs.readFileSync("certs/localhost-key.pem"),
  cert: fs.readFileSync("certs/localhost.pem"),
};

const PORT = 3443;

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running at https://localhost:${PORT}`);
});
