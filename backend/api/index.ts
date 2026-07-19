import { createApp } from "../src/app";
import { connectDatabase } from "../src/config/database";
import { config } from "../src/config";
import logger from "../src/utils/logger";

let cachedApp: ReturnType<typeof createApp> | null = null;

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    try {
      await connectDatabase();
      cachedApp = createApp();
    } catch (error) {
      logger.error("Failed to initialize API app:", error);
      res.status(500).json({ message: "Server initialization failed" });
      return;
    }
  }

  return cachedApp(req, res);
}
