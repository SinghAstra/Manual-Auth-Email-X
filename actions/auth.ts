"use server";

import { siteConfig } from "@/config/site";
import { hashPassword } from "@/lib/auth";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/lib/constants";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import { SignUpFormData, signUpSchema } from "@/validations/auth";
import { cookies } from "next/headers";
import { ValidationError } from "yup";

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

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, "", {
    expires: new Date(0),
    path: "/",
  });
}
