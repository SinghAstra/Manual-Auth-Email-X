"use server";
import { CompanySize } from "@prisma/client";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { db } from "../db";
import { sendEmail } from "../mail";
import { handleDocumentUpload } from "../supabase";
import { corporateFormSchema } from "../validations/corporateSchema";

export async function registerCorporate(
  data: z.infer<typeof corporateFormSchema>
) {
  try {
    const validatedData = corporateFormSchema.parse(data);

    const companySizeMap: Record<string, CompanySize> = {
      "1-50": CompanySize.SMALL,
      "51-200": CompanySize.MEDIUM,
      "201-500": CompanySize.LARGE,
      "500+": CompanySize.ENTERPRISE,
    };

    const existingCorporate = await db.corporate.findFirst({
      where: {
        email: validatedData.email,
      },
    });

    if (existingCorporate) {
      return {
        success: false,
        message: "A corporate with this email already exists.",
      };
    }

    const existingUser = await db.user.findFirst({
      where: {
        email: validatedData.adminDetails.email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this admin email already exists.",
      };
    }

    const hashedPassword = await hash(validatedData.adminDetails.password, 10);

    const objData = {
      name: validatedData.companyName,
      industry: validatedData.industry,
      companyType: validatedData.companyType,
      companySize: companySizeMap[validatedData.companySize],
      establishedYear: parseInt(validatedData.establishedYear),
      registrationNumber: validatedData.registrationNumber,
      gstNumber: validatedData.gstNumber,
      description: validatedData.companyDescription,
      email: validatedData.email,
      phone: validatedData.phone,
      website: validatedData.website,
      address: validatedData.address,
      hrContact: validatedData.hrContact,
    };

    console.log("objData is ", objData);

    const result = await db.$transaction(async (tx) => {
      const corporate = await tx.corporate.create({
        data: {
          name: validatedData.companyName,
          industry: validatedData.industry,
          companyType: validatedData.companyType,
          companySize: companySizeMap[validatedData.companySize],
          establishedYear: parseInt(validatedData.establishedYear),
          registrationNumber: validatedData.registrationNumber,
          gstNumber: validatedData.gstNumber,
          description: validatedData.companyDescription,
          email: validatedData.email,
          phone: validatedData.phone,
          website: validatedData.website,
          address: validatedData.address,
          hrContact: validatedData.hrContact,
        },
      });

      console.log("corporate is ", corporate);

      const user = await tx.user.create({
        data: {
          email: validatedData.adminDetails.email,
          password: hashedPassword,
          role: "CORPORATE",
          corporateId: corporate.id,
        },
      });

      console.log("user is ", user);

      if (
        validatedData.registrationCertificate ||
        validatedData.taxDocument ||
        validatedData.companyProfile
      ) {
        const storageFolder = "corporate-documents";
        const [registrationCertificateUrl, taxDocumentUrl, companyProfileUrl] =
          await Promise.all([
            handleDocumentUpload(
              storageFolder,
              validatedData.registrationCertificate
            ),
            handleDocumentUpload(storageFolder, validatedData.taxDocument),
            handleDocumentUpload(storageFolder, validatedData.companyProfile),
          ]);

        console.log(
          "registrationCertificateUrl is ",
          registrationCertificateUrl
        );
        console.log("taxDocumentUrl is ", taxDocumentUrl);
        console.log("companyProfileUrl is ", companyProfileUrl);

        const corporateDocument = await tx.corporateDocument.create({
          data: {
            corporateId: corporate.id,
            registrationCertificate: registrationCertificateUrl,
            taxDocument: taxDocumentUrl,
            companyProfile: companyProfileUrl,
          },
        });
        console.log("corporateDocument is ", corporateDocument);
      }

      const verificationToken = await tx.verificationToken.create({
        data: {
          token: uuidv4(),
          email: validatedData.adminDetails.email,
          type: "EMAIL_VERIFICATION",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      console.log("verificationToken is ", verificationToken);

      return { corporate, user, verificationToken };
    });

    console.log("sendEmail Args is ", {
      email: validatedData.adminDetails.email,
      name: validatedData.companyName,
      token: result.verificationToken.token,
      type: "EMAIL_VERIFICATION",
    });

    await sendEmail({
      email: validatedData.adminDetails.email,
      name: validatedData.companyName,
      token: result.verificationToken.token,
      type: "EMAIL_VERIFICATION",
    });

    return { success: true, corporateId: result.corporate.id };
  } catch (error) {
    console.log("Corporate registration error:", error);
    return {
      success: false,
      error: "Failed to register corporate",
    };
  }
}
