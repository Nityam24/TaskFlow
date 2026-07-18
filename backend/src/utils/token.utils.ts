import crypto from "crypto";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { JwtPayload } from "../types";

export const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

export const generateRefreshTokenValue = (): string =>
  crypto.randomBytes(64).toString("hex");

export const generateAccessToken = (payload: JwtPayload): string =>
  jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn as jwt.SignOptions["expiresIn"],
  });

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, config.jwt.secret) as JwtPayload;

export const getRefreshTokenExpiry = (): Date => {
  const days = config.jwt.refreshExpiresInDays;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};
