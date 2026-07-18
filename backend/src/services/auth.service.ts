import { User, UserDocument } from "../models/User";
import { RefreshToken } from "../models/RefreshToken";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/AppError";
import { JwtPayload } from "../types";
import logger from "../utils/logger";
import {
  generateAccessToken,
  generateRefreshTokenValue,
  getRefreshTokenExpiry,
  hashToken,
} from "../utils/token.utils";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const buildPayload = (user: UserDocument): JwtPayload => ({
  userId: user._id.toString(),
  email: user.email,
});

const createRefreshToken = async (userId: string): Promise<string> => {
  const refreshToken = generateRefreshTokenValue();
  const tokenHash = hashToken(refreshToken);

  await RefreshToken.create({
    user: userId,
    tokenHash,
    expiresAt: getRefreshTokenExpiry(),
  });

  return refreshToken;
};

const issueTokens = async (user: UserDocument): Promise<AuthTokens> => {
  const accessToken = generateAccessToken(buildPayload(user));
  const refreshToken = await createRefreshToken(user._id.toString());

  return { accessToken, refreshToken };
};

export const registerUser = async (
  input: RegisterInput,
): Promise<{
  user: UserDocument;
  accessToken: string;
  refreshToken: string;
}> => {
  const existingUser = await User.findOne({ email: input.email }).lean();

  if (existingUser) {
    throw new ConflictError("Email already registered");
  }

  const user = await User.create(input);
  const tokens = await issueTokens(user);

  logger.info(`User registered: ${user.email}`);

  return { user, ...tokens };
};

export const loginUser = async (
  input: LoginInput,
): Promise<{
  user: UserDocument;
  accessToken: string;
  refreshToken: string;
}> => {
  const user = await User.findOne({ email: input.email }).select("+password");

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(input.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const tokens = await issueTokens(user);

  logger.info(`User logged in: ${user.email}`);

  return { user, ...tokens };
};

export const refreshSession = async (
  refreshTokenValue: string,
): Promise<AuthTokens> => {
  const tokenHash = hashToken(refreshTokenValue);

  const storedToken = await RefreshToken.findOne({
    tokenHash,
    revoked: false,
    expiresAt: { $gt: new Date() },
  });

  if (!storedToken) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  const user = await User.findById(storedToken.user);

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  storedToken.revoked = true;
  await storedToken.save();

  const tokens = await issueTokens(user);

  logger.info(`Token refreshed for user: ${user.email}`);

  return tokens;
};

export const logoutSession = async (
  accessToken?: string,
  refreshToken?: string,
): Promise<void> => {
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await RefreshToken.updateOne({ tokenHash }, { revoked: true });
  }

  if (accessToken) {
    const { blacklistToken } = await import("../middlewares/auth.middleware");
    blacklistToken(accessToken);
  }
};

export const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

export const authService = {
  register: registerUser,
  login: loginUser,
  refresh: refreshSession,
  logout: logoutSession,
  getProfile: getUserProfile,
};
