"use server";

import { db } from "@/lib/db";

export async function validateResetTokenAction(token: string) {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        token,
        type: "PASSWORD_RESET",
        expiresAt: { gt: new Date() },
      },
    });

    console.log(
      "verificationToken --validate.reset.password.token is ",
      verificationToken
    );

    if (!verificationToken) {
      return {
        isValid: false,
        message: "Invalid or expired password reset link.",
      };
    }

    const user = await db.user.findUnique({
      where: { email: verificationToken.email },
    });

    console.log("user --validate.reset.password.token is ", user);

    if (!user) {
      return {
        isValid: false,
        message: "User account not found.",
      };
    }

    if (!user.isVerified) {
      return {
        isValid: false,
        message: "Please verify your email first.",
      };
    }

    if (!user.isApproved) {
      return {
        isValid: false,
        message: "Your account is pending approval.",
      };
    }

    return {
      isValid: true,
      message: "Token is valid.",
      expiresAt: verificationToken.expiresAt,
    };
  } catch (error) {
    console.log("Token validation error:", error);
    return {
      isValid: false,
      message: "An error occurred during token validation.",
    };
  }
}
