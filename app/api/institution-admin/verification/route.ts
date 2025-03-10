import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { UserVerificationStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch students based on verification status
export async function GET(request: NextRequest) {
  try {
    // 1. Get the current session to identify the admin
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    // 2. Check if the user is an institution admin
    const adminUser = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        // role: "INSTITUTION_ADMIN",
      },
      include: {
        institutionProfile: true,
      },
    });

    if (!adminUser || !adminUser.institutionProfile) {
      return NextResponse.json(
        {
          message:
            "Access denied. Only institution admins can access this resource.",
        },
        { status: 403 }
      );
    }

    const institutionId = adminUser.institutionProfile.institutionId;

    // 3. Get query status parameter
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        {
          message:
            "Invalid status parameter. Use PENDING, APPROVED, or REJECTED.",
        },
        { status: 400 }
      );
    }

    // 4. Fetch students based on query status
    const students = await prisma.user.findMany({
      where: {
        studentProfile: {
          institutionId: institutionId,
        },
        verificationStatus: status as UserVerificationStatus,
      },
      select: {
        id: true,
        name: true,
        email: true,
        verificationStatus: true,
        feedback: true,
        studentProfile: {
          select: {
            enrollmentNo: true,
            graduationYear: true,
          },
        },
        documents: {
          select: {
            id: true,
            type: true,
            fileUrl: true,
            createdAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log("students is ", students);

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      { message: "Failed to fetch verification requests" },
      { status: 500 }
    );
  }
}
