// lib/auth.ts
// This file contains core authentication utilities:
// - Password hashing and comparison using bcrypt.
// - JWT (JSON Web Token) generation and verification for access tokens.
// - Refresh token generation and hashing/comparison.
// - Cookie management for setting and clearing auth tokens.

import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from './db'; // Prisma client instance

// --- Configuration from Environment Variables ---
// Ensure these are set in your .env.local file and Vercel environment variables
const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const ACCESS_TOKEN_EXPIRATION = '15m'; // Access token expires in 15 minutes
const REFRESH_TOKEN_EXPIRATION = '7d'; // Refresh token expires in 7 days

// Check if secrets are defined, throw error if not (critical for security)
if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('JWT_SECRET and REFRESH_TOKEN_SECRET must be defined in environment variables.');
}

// --- Password Utilities ---

/**
 * Hashes a plain-text password using bcrypt.
 * @param password The plain-text password to hash.
 * @returns The hashed password string.
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate a salt and hash the password. Cost factor (10) determines the computational effort.
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plain-text password with a hashed password.
 * @param password The plain-text password.
 * @param hashedPassword The hashed password from the database.
 * @returns True if passwords match, false otherwise.
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// --- JWT (Access Token) Utilities ---

// Define the payload structure for the access token
export interface AccessTokenPayload {
  userId: string;
  email: string;
  emailVerified: boolean;
}

/**
 * Generates a new JWT (access token).
 * @param payload The data to include in the token.
 * @returns The signed JWT string.
 */
export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
}

/**
 * Verifies a JWT (access token).
 * @param token The JWT string to verify.
 * @returns The decoded payload if valid, null otherwise.
 */
export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    // Verify the token using the secret and decode its payload
    const decoded = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
    return decoded;
  } catch (error) {
    // If verification fails (e.g., token expired, invalid signature), return null
    console.error('Access token verification failed:', error);
    return null;
  }
}

// --- Refresh Token Utilities ---

/**
 * Generates a cryptographically secure refresh token.
 * We use UUID for simplicity and uniqueness, but a longer random string could also be used.
 * @returns A unique refresh token string.
 */
export function generateRefreshToken(): string {
  return crypto.randomUUID(); // Generates a UUID (Universally Unique Identifier)
}

/**
 * Hashes a refresh token for secure storage in the database.
 * While UUIDs are unique, hashing adds an extra layer of security if the DB is compromised.
 * @param token The refresh token string to hash.
 * @returns The hashed refresh token string.
 */
export async function hashRefreshToken(token: string): Promise<string> {
  // Using bcrypt for refresh token hashing for consistency and strong security
  return bcrypt.hash(token, 10);
}

/**
 * Compares a plain-text refresh token with its hashed version from the database.
 * @param token The plain-text refresh token.
 * @param hashedToken The hashed refresh token from the database.
 * @returns True if tokens match, false otherwise.
 */
export async function compareRefreshToken(token: string, hashedToken: string): Promise<boolean> {
  return bcrypt.compare(token, hashedToken);
}

// --- Cookie Management Utilities ---

// Define cookie names for consistency
const ACCESS_TOKEN_COOKIE_NAME = 'access_token';
const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

/**
 * Sets the access and refresh tokens as HTTP-only cookies.
 * @param accessToken The JWT access token.
 * @param refreshToken The refresh token.
 * @param res The Next.js response object (implicitly handled by `cookies()`).
 */
export function setAuthCookies(accessToken: string, refreshToken: string) {
  const accessExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Set access token cookie
  cookies().set(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true, // Prevents client-side JavaScript access
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'lax', // Protection against CSRF attacks
    path: '/', // Available across the entire site
    expires: accessExpires, // Expiration date
  });

  // Set refresh token cookie
  cookies().set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: refreshExpires,
  });
}

/**
 * Clears the access and refresh token cookies.
 * @param res The Next.js response object (implicitly handled by `cookies()`).
 */
export function clearAuthCookies() {
  cookies().set(ACCESS_TOKEN_COOKIE_NAME, '', { expires: new Date(0), path: '/' });
  cookies().set(REFRESH_TOKEN_COOKIE_NAME, '', { expires: new Date(0), path: '/' });
}

// --- Current User Retrieval (Server-Side) ---

/**
 * Retrieves the current authenticated user from the access token cookie.
 * This function is designed for use in Server Components or Server Actions.
 * @returns The User object if authenticated and token is valid, null otherwise.
 */
export async function getCurrentUser(): Promise<User | null> {
  const accessToken = cookies().get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!accessToken) {
    return null;
  }

  // Verify the access token
  const payload = verifyAccessToken(accessToken);

  if (!payload) {
    // If access token is invalid or expired, try to refresh it
    const refreshToken = cookies().get(REFRESH_TOKEN_COOKIE_NAME)?.value;

    if (!refreshToken) {
      clearAuthCookies(); // No refresh token, clear everything
      return null;
    }

    // Attempt to refresh the token
    try {
      const session = await db.session.findUnique({
        where: { refreshToken }, // Assuming refresh token is stored directly
        include: { user: true },
      });

      if (!session || session.expiresAt < new Date()) {
        // Refresh token invalid or expired in DB
        await db.session.deleteMany({ where: { refreshToken } }); // Clean up expired/invalid token
        clearAuthCookies();
        return null;
      }

      // Generate new tokens
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
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Extend refresh token life
        },
      });

      // Set new cookies
      setAuthCookies(newAccessToken, newRefreshToken);

      return session.user; // Return the user from the refreshed session
    } catch (error) {
      console.error('Error refreshing token:', error);
      clearAuthCookies();
      return null;
    }
  }

  // If access token is valid, fetch user from DB to ensure it's up-to-date
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
