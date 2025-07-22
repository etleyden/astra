// src/db/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import * as Entities from "./entities";
import * as dotenv from "dotenv";

dotenv.config();

const entities = Object.values(Entities);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "db",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // set to false in prod!
  logging: true,
  entities: entities,
  migrations: ["src/db/migrations/*.ts"],
  subscribers: [],
});

export const connectWithRetry = async (retries = 10, delayMs = 3000) => {
  while (retries > 0) {
    try {
      await AppDataSource.initialize();
      console.log("✅ Database connection successful!");
      return;
    } catch (err) {
      console.error(err);
      console.warn(`❌ Failed to connect to DB. Retries left: ${retries - 1}`);
      retries--;
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  console.error("❗ Could not connect to DB after multiple retries.");
  process.exit(1);
};

// Only run if file is directly executed (like `node dist/data-source.js`)
if (require.main === module) {
  AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization:", err);
    });
}

