// lib/mail.ts
// This file configures and exports a Nodemailer transporter for sending emails.
// It's set up to use Google SMTP, but can be easily adapted for other services.

import nodemailer from "nodemailer";

// Ensure environment variables are set for email credentials
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS; // For Gmail, this should be an App Password

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn(
    "Email credentials (EMAIL_USER, EMAIL_PASS) are not fully set. Email sending might fail."
  );
  console.warn(
    "If using Gmail, ensure you generate an App Password for EMAIL_PASS."
  );
}

// Create a Nodemailer transporter using SMTP
// This configuration is for Gmail SMTP.
const transporter = nodemailer.createTransport({
  service: "gmail", // Use 'gmail' for Google SMTP
  auth: {
    user: EMAIL_USER, // Your Gmail address
    pass: EMAIL_PASS, // Your Gmail App Password
  },
  // Optional: Secure connection settings (usually handled by 'service' property)
  // secure: true, // Use SSL/TLS
  // port: 465, // Port for secure SMTP
});

/**
 * Sends an email using the configured Nodemailer transporter.
 * @param to The recipient's email address.
 * @param subject The subject line of the email.
 * @param text The plain-text body of the email.
 * @param html The HTML body of the email.
 * @returns A Promise that resolves when the email is sent.
 */
export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html: string
) {
  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Mini LinkedIn" <${EMAIL_USER}>`, // Sender address
      to: to, // List of receivers
      subject: subject, // Subject line
      text: text, // Plain text body
      html: html, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: (error as Error).message };
  }
}
