import { siteConfig } from "@/config/site";
import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error(
    "EMAIL_USER and EMAIL_PASS must be defined in environment variables."
  );
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  secure: true,
  port: 465,
});

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html: string
) {
  try {
    const info = await transporter.sendMail({
      from: `${siteConfig.name} <${EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });

    console.log("Message sent: ", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.log("Error sending email.");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return { success: false, message: "Failed sending email." };
  }
}
