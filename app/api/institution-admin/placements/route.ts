import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 }
    );
  }

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

  const { companyId, placements } = await req.json();

  if (!companyId || !Array.isArray(placements)) {
    return NextResponse.json(
      { message: "Invalid request data" },
      { status: 400 }
    );
  }

  try {
    // Validate company
    const company = await prisma.company.findFirst({
      where: { id: companyId, verificationStatus: "VERIFIED" },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Company not found or not verified" },
        { status: 404 }
      );
    }

    // Validate students
    const studentIds = placements.map((p) => p.studentId);
    const validStudents = await prisma.studentProfile.findMany({
      where: {
        id: { in: studentIds },
        institutionId,
      },
    });

    const validStudentIds = validStudents.map((s) => s.id);
    const invalidStudents = studentIds.filter(
      (id) => !validStudentIds.includes(id)
    );

    if (invalidStudents.length > 0) {
      return NextResponse.json(
        { message: `Invalid student IDs: ${invalidStudents.join(", ")}` },
        { status: 400 }
      );
    }

    // Insert placements
    await prisma.placementRecord.createMany({
      data: placements.map((p) => ({
        studentId: p.studentId,
        companyId,
        position: p.position,
        salary: p.salary,
        joiningDate: p.joiningDate ? new Date(p.joiningDate) : null,
        verificationStatus: "NOT_VERIFIED",
      })),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
