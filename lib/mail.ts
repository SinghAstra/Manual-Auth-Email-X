"use server";
import nodemailer from "nodemailer";

export type EmailType =
  | "EMAIL_VERIFICATION"
  | "PASSWORD_RESET"
  | "ACCOUNT_APPROVAL"
  | "GENERAL_NOTIFICATION";

interface EmailOptions {
  email: string;
  name: string;
  token: string;
  type: EmailType;
}

export async function sendEmail({ email, name, token, type }: EmailOptions) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  const emailTemplates = {
    EMAIL_VERIFICATION: {
      subject: "Verify Your Account",
      link: `${baseUrl}/auth/verify-email?token=${token}`,
      html: (verificationLink: string) => `
        <h1>Welcome, ${name}!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    },
    PASSWORD_RESET: {
      subject: "Password Reset Request",
      link: `${baseUrl}/auth/reset-password?token=${token}`,
      html: (resetLink: string) => `
        <h1>Password Reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    },
    ACCOUNT_APPROVAL: {
      subject: "Account Approval Notification",
      link: `${baseUrl}/dashboard`,
      html: () => `
        <h1>Account Approved</h1>
        <p>Your account has been approved. You can now log in:</p>
        <a href="${baseUrl}/login">Login</a>
      `,
    },
    GENERAL_NOTIFICATION: {
      subject: "Important Notification",
      link: `${baseUrl}`,
      html: () => `
        <h1>Notification</h1>
        <p>You have a new notification.</p>
      `,
    },
  };

  const template = emailTemplates[type];

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: template.subject,
    html: template.html(template.link),
  });

  return {
    success: true,
    message: `${type} email sent successfully`,
  };
}
