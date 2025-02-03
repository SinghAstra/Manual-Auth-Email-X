import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify super admin role
    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (currentUser?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findMany({
      where: {
        role: "INSTITUTION_ADMIN",
      },
      include: {
        documents: true,
        institutionProfile: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("Error fetching institutions.");
    if (error instanceof Error) {
      console.log("error.message: ", error.message);
      console.log("error.stack: ", error.stack);
    }
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}
