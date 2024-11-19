"use server";

import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import { v4 as uuidv4 } from "uuid";

export async function resendVerificationEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    console.log("user --resendVerificationEmail is ", user);

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    if (user.isVerified) {
      return {
        success: false,
        message: "Email is already verified",
      };
    }

    await db.verificationToken.deleteMany({
      where: {
        email: user.email,
        type: "EMAIL_VERIFICATION",
      },
    });

    const verificationToken = await db.verificationToken.create({
      data: {
        email: user.email,
        token: uuidv4(),
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    console.log(
      "verificationToken --resendVerificationEmail is ",
      verificationToken
    );

    await sendEmail({
      email: user.email,
      name: user.email.split("@")[0],
      token: verificationToken.token,
      type: "EMAIL_VERIFICATION",
    });

    return {
      success: true,
      message: "Verification email resent successfully",
    };
  } catch (error) {
    console.log("Resend verification email error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
