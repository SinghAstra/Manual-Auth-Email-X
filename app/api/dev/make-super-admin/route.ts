import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This route is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to use this route" },
        { status: 401 }
      );
    }

    // Update the user's role to SUPER_ADMIN
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        role: "SUPER_ADMIN",
        verified: true,
        verificationStatus: "APPROVED",
      },
    });

    return NextResponse.json({
      message: "Successfully updated user to SUPER_ADMIN",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
