
import { AppDataSource, connectWithRetry } from "./data-source";
export { AppDataSource, connectWithRetry } from "./data-source";
export * from "./entities";
export const getDB = async () => {
  if (!AppDataSource.isInitialized) {
    await connectWithRetry();
  }
  return AppDataSource;
};