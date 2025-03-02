// /api/institution-admin/verification/route.ts

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { UserVerificationStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

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

// PUT: Update verification status of a user
export async function PUT(request: NextRequest) {
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

    // 3. Validate request body using parse() which throws on error
    const requestSchema = z.object({
      userId: z.string().min(1, "User ID is required"),
      status: z.enum(["APPROVED", "REJECTED"], {
        errorMap: () => ({
          message: "Status must be either APPROVED or REJECTED",
        }),
      }),
      feedback: z.string().optional(),
    });

    const body = await request.json();
    // This will throw if validation fails
    const { userId, status, feedback } = requestSchema.parse(body);

    // 4. Check if the user belongs to the admin's institution
    const student = await prisma.user.findFirst({
      where: {
        id: userId,
        studentProfile: {
          institutionId: institutionId,
        },
      },
      include: {
        studentProfile: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found or does not belong to your institution" },
        { status: 404 }
      );
    }

    // 5. Update verification status
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        verificationStatus: status,
        feedback: feedback || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        verificationStatus: true,
        feedback: true,
      },
    });

    // 6. Delete the Student Profile if status is REJECTED
    if (status === "REJECTED") {
      await prisma.studentProfile.delete({ where: { userId } });
    }

    return NextResponse.json(
      {
        message: `Student verification status updated to ${status}`,
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating verification status:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const errors = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { message: "Failed to update verification status" },
      { status: 500 }
    );
  }
}
