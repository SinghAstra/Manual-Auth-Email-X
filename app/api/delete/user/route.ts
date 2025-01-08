import { prisma } from "@/lib/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if user has admin privileges
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "This method works only in development mode." },
        { status: 403 }
      );
    }

    // Delete all users
    const deletedUsers = await prisma.user.deleteMany();

    // Return success response
    return NextResponse.json({
      message: "All users deleted successfully",
      count: deletedUsers.count,
    });
  } catch (error) {
    console.log("Error deleting users:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
