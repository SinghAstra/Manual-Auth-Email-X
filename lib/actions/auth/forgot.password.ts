"use server";

import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export async function forgotPasswordAction(
  data: z.infer<typeof forgotPasswordSchema>
) {
  try {
    const validatedData = forgotPasswordSchema.parse(data);
    const { email } = validatedData;

    const result = await db.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      console.log("user is ", user);

      if (!user) {
        return {
          status: false,
          message: "If an account exists, a password reset link will be sent.",
        };
      }

      if (!user.isVerified) {
        return {
          status: false,
          message: "Please verify your email first.",
        };
      }

      if (!user.isApproved) {
        return {
          status: false,
          redirectToApproval: true,
          message: "Your account is pending approval.",
        };
      }

      const verificationToken = await prisma.verificationToken.create({
        data: {
          token: uuidv4(),
          email: email.toLowerCase(),
          type: "PASSWORD_RESET",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      return {
        status: true,
        verificationToken,
        email: user.email,
      };
    });

    if (!result.status) {
      return {
        success: false,
        redirectToApproval: result.redirectToApproval,
        message: result.message,
      };
    }

    if (result.verificationToken) {
      await sendEmail({
        email: result.verificationToken.email,
        name: result.email,
        token: result.verificationToken.token,
        type: "PASSWORD_RESET",
      });
    }

    return {
      success: true,
      message: "Password reset link sent to your email.",
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: "An error occurred. Please try again.",
    };
  }
}
