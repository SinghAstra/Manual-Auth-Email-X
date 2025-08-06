import { AccessTokenPayload } from "@/interfaces/auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "./constants";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_EXPIRATION = "15m";

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "JWT_SECRET and REFRESH_TOKEN_SECRET must be defined in environment variables."
  );
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(password, hashedPassword);
}

export function generateAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET as string
    ) as unknown as AccessTokenPayload;
    return decoded;
  } catch (error) {
    console.log("Access token verification failed.");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return null;
  }
}

export function generateRefreshToken() {
  return crypto.randomUUID();
}

export async function hashRefreshToken(token: string) {
  return bcrypt.hash(token, 10);
}

export async function compareRefreshToken(token: string, hashedToken: string) {
  return bcrypt.compare(token, hashedToken);
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
) {
  const accessExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: accessExpires,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: refreshExpires,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, "", {
    expires: new Date(0),
    path: "/",
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, "", {
    expires: new Date(0),
    path: "/",
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!accessToken) {
    return null;
  }

  // Verify the access token
  const payload = verifyAccessToken(accessToken);

  if (!payload) {
    // If access token is invalid or expired, try to refresh it
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

    if (!refreshToken) {
      clearAuthCookies(); // No refresh token, clear everything
      return null;
    }

    // Attempt to refresh the token
    try {
      const session = await db.session.findUnique({
        where: { refreshToken },
        include: { user: true },
      });

      if (!session || session.expiresAt < new Date()) {
        await db.session.deleteMany({ where: { refreshToken } });
        clearAuthCookies();
        return null;
      }

      const newAccessToken = generateAccessToken({
        userId: session.user.id,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
      });
      const newRefreshToken = generateRefreshToken();

      // Update session in DB with new refresh token (rotation)
      await db.session.update({
        where: { id: session.id },
        data: {
          refreshToken: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      // Set new cookies
      setAuthCookies(newAccessToken, newRefreshToken);

      return session.user; // Return the user from the refreshed session
    } catch (error) {
      console.error("Error refreshing token:", error);
      clearAuthCookies();
      return null;
    }
  }

  const user = await db.user.findUnique({
    where: { id: payload.userId },
  });

  // Ensure the user exists and email verification status matches (optional but good for consistency)
  if (user && user.emailVerified === payload.emailVerified) {
    return user;
  }

  // If user not found or verification status mismatch, clear cookies and return null
  clearAuthCookies();
  return null;
}
