import winston from "winston";
import { config } from "../config";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return stack
    ? `${ts} [${level}]: ${message}${metaStr}\n${stack}`
    : `${ts} [${level}]: ${message}${metaStr}`;
});

export const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
});

if (config.isProduction && process.env.VERCEL !== "1") {
  logger.add(
    new winston.transports.File({ filename: "logs/error.log", level: "error" })
  );
  logger.add(new winston.transports.File({ filename: "logs/combined.log" }));
}

export default logger;
