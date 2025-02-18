import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { uploadToBlob } from "@/lib/utils/upload-to-blob";
import { DocumentType, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the session to verify the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Allow uploads for users who have never applied or have been rejected
    if (
      user.verificationStatus !== "NOT_APPLIED" &&
      user.verificationStatus !== "REJECTED"
    ) {
      return NextResponse.json(
        {
          message: `Verification already ${user.verificationStatus.toLowerCase()}`,
        },
        { status: 400 }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();

    // Get role from form data
    const role = formData.get("role") as string | null;
    if (!role || !Object.values(Role).includes(role as Role)) {
      return NextResponse.json(
        { message: "Invalid role provided" },
        { status: 400 }
      );
    }

    // Check if all required documents are provided
    const fileEntries: [string, File][] = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && key !== "role") {
        fileEntries.push([key, value]);
      }
    }

    if (fileEntries.length === 0) {
      return NextResponse.json(
        { message: "No files uploaded" },
        { status: 400 }
      );
    }

    // Upload each file using the provided uploadToBlob function
    const uploadedDocuments = [];
    for (const [fieldName, file] of fileEntries) {
      // Validate document type
      const docType = formData.get(`${fieldName}_type`) as string | null;
      console.log("docType is ", docType);
      if (
        !docType ||
        !Object.values(DocumentType).includes(docType as DocumentType)
      ) {
        return NextResponse.json(
          { message: `Invalid document type for ${fieldName}` },
          { status: 400 }
        );
      }

      const fileUrl = await uploadToBlob(file);

      // Create document record in database
      const document = await prisma.document.create({
        data: {
          userId: user.id,
          type: docType as DocumentType,
          fileUrl,
        },
      });

      uploadedDocuments.push(document);
    }

    // Update user role and verification status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: role as Role,
        verificationStatus: "PENDING",
      },
    });

    return NextResponse.json(
      {
        message: "Documents uploaded successfully. Verification pending.",
        documents: uploadedDocuments,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      { message: "Error uploading documents", error },
      { status: 500 }
    );
  }
}

// // Helper function to create the appropriate profile based on role
async function createProfileBasedOnRole(
  userId: string,
  role: Role,
  formData: FormData
): Promise<void> {
  switch (role) {
    case "INSTITUTION_ADMIN":
      // Create or find institution and link to admin
      const institutionId = formData.get("institutionId") as string | null;
      if (institutionId) {
        await prisma.institutionProfile.create({
          data: {
            userId,
            institutionId,
          },
        });
      } else {
        const institution = await prisma.institution.create({
          data: {
            name: formData.get("institutionName") as string,
            address: formData.get("institutionAddress") as string,
            city: formData.get("institutionCity") as string,
            state: formData.get("institutionState") as string,
            website: formData.get("institutionWebsite") as string,
          },
        });

        await prisma.institutionProfile.create({
          data: {
            userId,
            institutionId: institution.id,
          },
        });
      }
      break;

    case "COMPANY_REPRESENTATIVE":
      // Create or find company and link to representative
      const companyId = formData.get("companyId") as string | null;
      if (companyId) {
        await prisma.companyProfile.create({
          data: {
            userId,
            companyId,
          },
        });
      } else {
        const company = await prisma.company.create({
          data: {
            name: formData.get("companyName") as string,
            website: formData.get("companyWebsite") as string,
            address: formData.get("companyAddress") as string,
            city: formData.get("companyCity") as string,
            state: formData.get("companyState") as string,
          },
        });

        await prisma.companyProfile.create({
          data: {
            userId,
            companyId: company.id,
          },
        });
      }
      break;

    case "STUDENT":
      await prisma.studentProfile.create({
        data: {
          userId,
          institutionId: formData.get("institutionId") as string,
          enrollmentNo: formData.get("enrollmentNo") as string,
          graduationYear: parseInt(
            formData.get("graduationYear") as string,
            10
          ),
        },
      });
      break;

    case "GOVERNMENT":
      await prisma.governmentProfile.create({
        data: {
          userId,
          department: formData.get("department") as string,
          designation: formData.get("designation") as string,
          jurisdiction: formData.get("jurisdiction") as string,
        },
      });
      break;

    default:
      break;
  }
}
