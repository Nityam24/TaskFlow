import { createApp } from "../backend/src/app";
import { connectDatabase } from "../backend/src/config/database";
import logger from "../backend/src/utils/logger";

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
