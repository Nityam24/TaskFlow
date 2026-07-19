import mongoose from "mongoose";
import { config } from "../config";
import logger from "../utils/logger";

export const connectDatabase = async (): Promise<void> => {
  mongoose.set("strictQuery", true);

  await mongoose.connect(config.mongodbUri, {
    maxPoolSize: 5,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  logger.info("MongoDB connected successfully");

  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
};
