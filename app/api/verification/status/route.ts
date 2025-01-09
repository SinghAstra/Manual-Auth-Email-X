import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user with their documents
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        verified: true,
        documents: {
          orderBy: { createdAt: "desc" },
          select: {
            type: true,
            fileUrl: true,
            status: true,
            feedback: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      verified: user.verified,
      documents: user.documents,
    });
  } catch (error) {
    console.log("Verification status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch verification status" },
      { status: 500 }
    );
  }
}
