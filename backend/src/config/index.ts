import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"] as const;
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0 && process.env.NODE_ENV === "production") {
  throw new Error(
    `Missing required environment variable(s): ${missingEnvVars.join(", ")}`,
  );
}

export const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/task-management",
  jwt: {
    secret: process.env.JWT_SECRET || "dev-secret",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresInDays: parseInt(
      process.env.JWT_REFRESH_EXPIRES_DAYS || "7",
      10,
    ),
  },
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  logLevel: process.env.LOG_LEVEL || "info",
  isProduction: process.env.NODE_ENV === "production",
} as const;
