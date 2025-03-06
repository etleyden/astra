import express from 'express';
import cors from "cors";
import authRoutes from "./routes/auth";

// NOTE/TODO: Differentiate between development and production environments to 
// enforce HTTPS and change URLS/etc
const app = express();
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

const port = 3001;

app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});