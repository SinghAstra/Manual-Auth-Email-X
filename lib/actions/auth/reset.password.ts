"use server";

import { db } from "@/lib/db";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { hash } from "bcryptjs";
import { z } from "zod";

export async function resetPasswordAction(
  token: string,
  data: z.infer<typeof resetPasswordSchema>
) {
  try {
    const validatedData = resetPasswordSchema.parse(data);
    const { password } = validatedData;

    console.log("validatedData is ", validatedData);

    const result = await db.$transaction(async (prisma) => {
      const verificationToken = await prisma.verificationToken.findFirst({
        where: {
          token,
          type: "PASSWORD_RESET",
          expiresAt: { gt: new Date() },
        },
      });

      console.log("verificationToken is ", verificationToken);

      if (!verificationToken) {
        return {
          status: false,
          message: "Invalid or expired password reset link.",
        };
      }

      const user = await prisma.user.findUnique({
        where: { email: verificationToken.email },
      });

      if (!user) {
        return {
          status: false,
          message: "User account not found.",
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
          message: "Your account is pending approval.",
        };
      }

      const hashedPassword = await hash(password, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      });

      return {
        status: true,
        message: "Password reset successful.",
      };
    });

    return {
      success: result.status,
      message: result.message,
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: "An error occurred. Please try again.",
    };
  }
}
