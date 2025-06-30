// src/db/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as Entities from './entities';
import * as dotenv from 'dotenv';

dotenv.config();

const entities = Object.values(Entities);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // set to false in prod!
  logging: true,
  entities: entities,
  migrations: ['src/db/migrations/*.ts'],
  subscribers: [],
});
