import { Pool } from "pg";
require("dotenv").config();

const pool = new Pool({
    user: process.env.ASTRAL_DB_USER,
    host: process.env.ASTRAL_DB_HOST,
    database: process.env.ASTRAL_DB_NAME,
    password: process.env.ASTRAL_DB_PASS,
    port: process.env.ASTRAL_DB_PORT ? Number(process.env.ASTRAL_DB_PORT) : 5432
});


export default pool;