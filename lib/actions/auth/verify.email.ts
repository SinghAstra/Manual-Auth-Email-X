"use server";
import { db } from "@/lib/db";

export async function verifyEmail(token: string) {
  try {
    console.log("token --verify-email is ", token);

    const result = await db.$transaction(async (tx) => {
      const verificationToken = await tx.verificationToken.findUnique({
        where: {
          token: token,
          type: "EMAIL_VERIFICATION",
          expiresAt: { gt: new Date() },
        },
      });

      console.log("verificationToken --verify.email is ", verificationToken);

      if (!verificationToken) {
        return {
          success: false,
          message: "Invalid or expired verification token",
        };
      }

      const user = await tx.user.findUnique({
        where: { email: verificationToken.email },
      });

      console.log("user --verify.email is ", user);

      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      await tx.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
        },
      });

      await tx.verificationToken.delete({
        where: { id: verificationToken.id },
      });

      return {
        success: true,
        message: "Email verified successfully",
        userId: user.id,
        userRole: user.role,
      };
    });

    return result;
  } catch (error) {
    console.log("Email verification error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during verification",
    };
  }
}
