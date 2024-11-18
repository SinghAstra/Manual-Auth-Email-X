"use server";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { db } from "../db";
import { sendEmail } from "../mail";
import { institutionFormSchema } from "../validations/auth";

export async function registerInstitution(
  data: z.infer<typeof institutionFormSchema>
) {
  try {
    console.log("data --registerInstitution is ", data);
    const validatedData = institutionFormSchema.parse(data);

    // Hash the admin password
    const hashedPassword = await hash(validatedData.adminPassword, 10);

    // Create institution record
    const institution = await db.institution.create({
      data: {
        name: validatedData.institutionName,
        type: validatedData.type,
        establishedYear: parseInt(validatedData.establishedYear),
        affiliationNumber: validatedData.affiliationNumber,
        location: validatedData.location,
        email: validatedData.email,
        phone: validatedData.phone,
        alternatePhone: validatedData.alternatePhone,
        address: validatedData.address,
        zipCode: validatedData.zipCode,
        adminName: validatedData.adminName,
        adminDesignation: validatedData.designation,
      },
    });

    // Create user for the institution admin
    const user = await db.user.create({
      data: {
        email: validatedData.adminEmail,
        password: hashedPassword,
        role: "INSTITUTION",
        institutionId: institution.id,
        isVerified: false,
        isApproved: false,
      },
    });

    // Handle document uploads
    if (
      validatedData.affiliationCertificate ||
      validatedData.governmentRecognition ||
      validatedData.letterhead
    ) {
      await db.institutionDocument.create({
        data: {
          institutionId: institution.id,
          affiliationCertificate: validatedData.affiliationCertificate
            ? await uploadDocument(validatedData.affiliationCertificate)
            : null,
          governmentRecognition: validatedData.governmentRecognition
            ? await uploadDocument(validatedData.governmentRecognition)
            : null,
          letterhead: validatedData.letterhead
            ? await uploadDocument(validatedData.letterhead)
            : null,
        },
      });
    }

    // Generate verification token
    const verificationToken = await db.verificationToken.create({
      data: {
        token: uuidv4(),
        email: validatedData.adminEmail,
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send verification email
    await sendEmail({
      email: validatedData.adminEmail,
      name: validatedData.adminName,
      token: verificationToken.token,
      type: "EMAIL_VERIFICATION",
    });

    return {
      success: true,
      message:
        "Institution registered successfully. Please check your email to verify your account.",
      userId: user.id,
    };
  } catch (error) {
    console.log("Institution Registration Error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Invalid input. Please check your details.",
        errors: error.errors,
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

// Placeholder for document upload function
async function uploadDocument(file: any): Promise<string> {
  // Implement actual file upload logic (e.g., to S3 or cloud storage)
  // This is a placeholder - replace with actual implementation
  return "uploaded-document-url";
}
