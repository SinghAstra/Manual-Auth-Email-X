import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

type ErrorResponse = {
  error: string;
};

export async function GET(): Promise<NextResponse<User | ErrorResponse>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: {
        AND: [{ id: session.user.id }, { role: "STUDENT" }],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("Error occurred in /api/profile");
    if (error instanceof Error) {
      console.log("error.message is ", error.message);
      console.log("error.stack is ", error.stack);
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
