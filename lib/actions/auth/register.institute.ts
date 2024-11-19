import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { db } from "../db";
import { sendEmail } from "../mail";
import { handleDocumentUpload } from "../supabase";
import { institutionFormSchema } from "../validations/institutionSchema";

export async function registerInstitution(
  data: z.infer<typeof institutionFormSchema>
) {
  try {
    const validatedData = institutionFormSchema.parse(data);

    console.log("validatedData is ", validatedData);

    const existingInstitution = await db.institution.findFirst({
      where: {
        email: validatedData.email,
      },
    });

    if (existingInstitution) {
      return {
        success: false,
        message: "An institution with this email already exists.",
      };
    }

    const existingUser = await db.user.findFirst({
      where: {
        email: validatedData.adminEmail,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this admin email already exists.",
      };
    }

    const hashedPassword = await hash(validatedData.adminPassword, 10);

    const result = await db.$transaction(
      async (tx) => {
        const institution = await tx.institution.create({
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

        const user = await tx.user.create({
          data: {
            email: validatedData.adminEmail,
            password: hashedPassword,
            role: "INSTITUTION",
            institutionId: institution.id,
            isVerified: false,
            isApproved: false,
          },
        });

        if (
          validatedData.affiliationCertificate ||
          validatedData.governmentRecognition ||
          validatedData.letterhead
        ) {
          const storageFolder = "institution-documents";
          const [
            affiliationCertificateUrl,
            governmentRecognitionUrl,
            letterheadUrl,
          ] = await Promise.all([
            handleDocumentUpload(
              storageFolder,
              validatedData.affiliationCertificate
            ),
            handleDocumentUpload(
              storageFolder,
              validatedData.governmentRecognition
            ),
            handleDocumentUpload(storageFolder, validatedData.letterhead),
          ]);

          await tx.institutionDocument.create({
            data: {
              institutionId: institution.id,
              affiliationCertificate: affiliationCertificateUrl,
              governmentRecognition: governmentRecognitionUrl,
              letterhead: letterheadUrl,
            },
          });
        }

        const verificationToken = await tx.verificationToken.create({
          data: {
            token: uuidv4(),
            email: validatedData.adminEmail,
            type: "EMAIL_VERIFICATION",
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          },
        });

        return { institution, user, verificationToken };
      },
      {
        maxWait: 10000,
        timeout: 30000,
      }
    );

    // Send verification email
    await sendEmail({
      email: validatedData.adminEmail,
      name: validatedData.adminName,
      token: result.verificationToken.token,
      type: "EMAIL_VERIFICATION",
    });

    return {
      success: true,
      message:
        "Institution registered successfully. Please check your email to verify your account.",
      userId: result.user.id,
    };
  } catch (error) {
    console.log("Institution Registration Error:", error);

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
