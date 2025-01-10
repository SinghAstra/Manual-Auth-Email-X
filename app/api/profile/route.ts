import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await getServerSession(authOptions);
    let userId;
    console.log("session --/profile is ", session);
    if (!session?.user?.id) {
      if (!authHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      } else {
        userId = authHeader.replace("Bearer ", "");
        console.log("userId is ", userId);
        if (!userId) {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
      }
    } else {
      userId = session.user.id;
    }

    console.log("userId is ", userId);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
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
