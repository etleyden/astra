import express from 'express';

import cors from "cors";
// routes
import authRoutes from "./routes/auth";
import metaRoutes from "./routes/meta";
import userRoutes from "./routes/user";

// NOTE/TODO: Differentiate between development and production environments to 
// enforce HTTPS and change URLS/etc
const app = express();
app.use(express.json())


const port = 3001;

app.use("/api/auth", authRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/user", userRoutes);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});