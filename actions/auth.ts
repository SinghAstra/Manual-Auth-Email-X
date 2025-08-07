"use server";

import { siteConfig } from "@/config/site";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  verifyAccessToken,
} from "@/lib/auth";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/lib/constants";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import {
  LoginFormData,
  loginSchema,
  SignUpFormData,
  signUpSchema,
} from "@/validations/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ValidationError } from "yup";

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

  console.log("cookiesStore is ", cookieStore);
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

export async function registerUser(formData: SignUpFormData) {
  try {
    const { name, email, password } = formData;

    // 1. Perform Server Side Validation on req body
    await signUpSchema.validate(
      { name, email, password },
      { abortEarly: false }
    );

    // 2. Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return {
        success: false,
        message: "Email already registered.",
      };
    }

    console.log("existingUser is ", existingUser);

    // 3. Hash the password
    const hashedPassword = await hashPassword(password);

    console.log("hashedPassword is ", hashedPassword);

    // 3. Create the user in the database (initially unverified)
    const newUser = await db.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        emailVerified: false,
      },
    });

    console.log("newUser is ", newUser);

    // 4. Generate and store a verification token
    const verificationToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newVerificationToken = await db.verificationToken.create({
      data: {
        userId: newUser.id,
        token: verificationToken,
        expiresAt: expiresAt,
      },
    });

    console.log("newVerificationToken is ", newVerificationToken);

    // 5. Send verification email
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
    const emailSubject = `Verify Your Email for ${siteConfig.name}`;
    const emailText = `Please verify your email by clicking on this link: ${verificationLink}`;
    const emailHtml = `<p>Welcome to ${siteConfig.name}! Please verify your email by clicking the link below:</p><p><a href="${verificationLink}">Verify Email</a></p><p>This link will expire in 24 hours.</p>`;

    const emailResult = await sendEmail(
      newUser.email,
      emailSubject,
      emailText,
      emailHtml
    );

    console.log("emailResult is ", emailResult);

    return {
      success: true,
      message:
        "Registration successful! Please check your email for a verification link.",
    };
  } catch (error) {
    console.log("Registration failed.");
    if (error instanceof ValidationError) {
      return {
        success: false,
        message: "Validation failed.",
      };
    }
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return {
      success: false,
      message: "An unexpected error occurred during registration.",
    };
  }
}

export async function loginUser(formData: LoginFormData) {
  try {
    const { email, password } = formData;

    // 1. Perform Server Side Validation on req body
    await loginSchema.validate({ email, password }, { abortEarly: false });

    // 2. Find user by email
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, message: "Invalid credentials." };
    }

    console.log("user is ", user);

    // 3. Compare password
    const passwordMatch = await comparePassword(password, user.passwordHash);
    if (!passwordMatch) {
      return { success: false, message: "Invalid credentials." };
    }

    console.log("passwordMatch is ", passwordMatch);

    // 4. Check if email is verified
    if (!user.emailVerified) {
      return {
        success: false,
        message: "Please verify your email before logging in.",
      };
    }

    // 5. Generate Access and Refresh Tokens
    const accessTokenPayload = {
      userId: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    };
    const accessToken = generateAccessToken(accessTokenPayload);
    const refreshToken = generateRefreshToken();

    console.log("accessToken is ", accessToken);
    console.log("refreshToken is ", refreshToken);

    // 6. Store Refresh Token in the database (Session model)
    await db.session.create({
      data: {
        userId: user.id,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 7. Set tokens as HTTP-only cookies
    setAuthCookies(accessToken, refreshToken);

    return { success: true, message: "Login successful!" };
  } catch (error) {
    console.log("Login failed.");
    if (error instanceof ValidationError) {
      return {
        success: false,
        message: "Validation failed.",
      };
    }
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return {
      success: false,
      message: "An unexpected error occurred during login.",
    };
  }
}

export async function verifyEmail(token: string) {
  try {
    // 1. Find the verification token
    const verificationRecord = await db.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    console.log("verificationRecord is ", verificationRecord);

    if (!verificationRecord) {
      return { success: false, message: "Invalid verification token." };
    }

    // 2. Check if token has expired
    if (verificationRecord.expiresAt < new Date()) {
      // Delete expired token to clean up
      await db.verificationToken.delete({
        where: { id: verificationRecord.id },
      });
      return {
        success: false,
        message: "Verification token has expired. Please request a new one.",
      };
    }

    // 3. Check if user is already verified
    if (verificationRecord.user.emailVerified) {
      // Delete token even if already verified to prevent reuse
      await db.verificationToken.delete({
        where: { id: verificationRecord.id },
      });
      return { success: true, message: "Email already verified." };
    }

    // 4. Update user's emailVerified status
    await db.user.update({
      where: { id: verificationRecord.userId },
      data: { emailVerified: true },
    });

    // 5. Delete the used verification token
    await db.verificationToken.delete({ where: { id: verificationRecord.id } });

    return {
      success: true,
      message: "Email verified successfully! You can now log in.",
    };
  } catch (error) {
    console.log("Email verification failed.");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return {
      success: false,
      message: "An unexpected error occurred during email verification.",
    };
  }
}

// --- Logout Action ---
/**
 * Handles user logout.
 * - Clears authentication cookies.
 * - Deletes the refresh token session from the database.
 * @returns An ActionResponse indicating success.
 */
export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (refreshToken) {
      // Delete the session record from the database
      await db.session.deleteMany({
        where: { refreshToken: refreshToken },
      });
    }

    // Clear cookies on the client side
    clearAuthCookies();

    return { success: true, message: "Logged out successfully." };
  } catch (error) {
    console.error("Logout failed:", error);
    return {
      success: false,
      message: "An unexpected error occurred during logout.",
    };
  } finally {
    // Always redirect to login page after logout attempt
    redirect("/login");
  }
}

// --- Refresh Token Action (for client-side initiated refresh) ---
/**
 * This action is called by the client when an access token expires.
 * It uses the refresh token to issue a new access token and a new refresh token (rotation).
 * @returns An ActionResponse with new tokens or an error.
 */
export async function refreshAuthTokens() {
  try {
    const cookieStore = await cookies();
    const currentRefreshToken = cookieStore.get("refresh_token")?.value;

    if (!currentRefreshToken) {
      clearAuthCookies();
      return {
        success: false,
        message: "No refresh token found. Please log in again.",
      };
    }

    // 1. Find the session in the database
    const session = await db.session.findUnique({
      where: { refreshToken: currentRefreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      // Refresh token invalid or expired in DB, delete it
      await db.session.deleteMany({
        where: { refreshToken: currentRefreshToken },
      });
      clearAuthCookies();
      return {
        success: false,
        message: "Session expired or invalid. Please log in again.",
      };
    }

    // 2. Generate new Access Token
    const newAccessTokenPayload = {
      userId: session.user.id,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
    };
    const newAccessToken = generateAccessToken(newAccessTokenPayload);

    // 3. Generate new Refresh Token (Rotation)
    const newRefreshToken = generateRefreshToken();

    // 4. Update the session in the database with the new refresh token and extended expiry
    await db.session.update({
      where: { id: session.id },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Extend refresh token life
      },
    });

    // 5. Set new tokens as HTTP-only cookies
    setAuthCookies(newAccessToken, newRefreshToken);

    return {
      success: true,
      message: "Tokens refreshed successfully.",
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    };
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearAuthCookies(); // Clear cookies on any refresh failure
    return {
      success: false,
      message: "Failed to refresh session. Please log in again.",
    };
  }
}
