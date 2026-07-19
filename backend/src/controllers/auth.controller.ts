import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { ApiResponse } from "../errors/responseHandler";
import { UnauthorizedError } from "../errors/AppError";
import { blacklistToken } from "../middlewares/auth.middleware";
import { sanitizePayload } from "../utils/serialize";

const setRefreshCookie = (res: Response, refreshToken: string): void => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(
      req.body,
    );
    setRefreshCookie(res, refreshToken);

    ApiResponse.created(
      res,
      sanitizePayload({ user, accessToken, refreshToken }),
      "Registration successful",
    );
  } catch (error) {
    next(error);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body,
    );
    setRefreshCookie(res, refreshToken);

    ApiResponse.success({
      res,
      message: "Login successful",
      data: sanitizePayload({ user, accessToken, refreshToken }),
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshTokenValue =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshTokenValue) {
      throw new UnauthorizedError("Refresh token is required");
    }

    const tokens = await authService.refresh(refreshTokenValue);
    setRefreshCookie(res, tokens.refreshToken);

    ApiResponse.success({
      res,
      message: "Token refreshed successfully",
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.refreshToken;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : cookieToken;

    if (token) {
      blacklistToken(token);
    }

    res.clearCookie("refreshToken");

    ApiResponse.success({ res, message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await authService.getProfile(req.user!.userId);
    ApiResponse.success({ res, data: { user: sanitizePayload(user) } });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  register,
  login,
  refresh,
  logout,
  getProfile,
};
