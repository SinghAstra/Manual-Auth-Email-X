import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { Role, VerificationStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and super admin status
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (admin?.role !== Role.SUPER_ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { status, feedback, role } = body;

    // Validate request body
    if (!status || !Object.values(VerificationStatus).includes(status)) {
      return NextResponse.json(
        { error: "Invalid verification status" },
        { status: 400 }
      );
    }

    // If approving, role is required
    if (status === VerificationStatus.APPROVED && !role) {
      return NextResponse.json(
        { error: "Role is required for approval" },
        { status: 400 }
      );
    }

    // Get user and their documents
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { documents: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If approving, verify the role matches the documents
    if (status === VerificationStatus.APPROVED) {
      const hasValidDocuments = user.documents.some((doc) => {
        switch (role) {
          case Role.INSTITUTION_ADMIN:
            return ["INSTITUTION_ID", "AUTHORIZATION_LETTER"].includes(
              doc.type
            );
          case Role.COMPANY_REPRESENTATIVE:
            return ["COMPANY_ID", "BUSINESS_CARD"].includes(doc.type);
          case Role.GOVERNMENT:
            return ["GOVERNMENT_ID", "DEPARTMENT_LETTER"].includes(doc.type);
          default:
            return false;
        }
      });

      if (!hasValidDocuments) {
        return NextResponse.json(
          { error: "Submitted documents do not match the requested role" },
          { status: 400 }
        );
      }
    }

    // Update user verification status
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        verificationStatus: status,
        role: status === VerificationStatus.APPROVED ? role : undefined,
        verified: status === VerificationStatus.APPROVED,
        feedback: feedback || undefined,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating verification:", error);
    return NextResponse.json(
      { error: "Failed to update verification" },
      { status: 500 }
    );
  }
}
