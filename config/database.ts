import "dotenv/config";
import { Sequelize } from "sequelize";

const requiredEnvVars = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
] as const;

function getDatabaseConfig() {
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing database environment variables: ${missingEnvVars.join(", ")}`
    );
  }

  return {
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
  };
}

const databaseConfig = getDatabaseConfig();

export const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: "postgres",
    logging: false,
  }
);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function connectToDatabase(
  maxRetries = 5,
  retryDelayMs = 3000
): Promise<void> {
  let lastError: unknown;
  console.log("Attempting to connect to PostgreSQL database...");

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    console.log(`Database connection attempt ${attempt} of ${maxRetries}`);
    try {
      await sequelize.authenticate();
      console.log("PostgreSQL connected successfully");
      return;
    } catch (error) {
      lastError = error;
      console.warn(
        `Database connection attempt ${attempt}/${maxRetries} failed`
      );

      if (attempt < maxRetries) {
        await sleep(retryDelayMs);
      }
    }
    console.error("Database connection failed after all attempts", lastError);
  }

  throw lastError;
}
