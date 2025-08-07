import { ACCESS_TOKEN_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, "", {
      expires: new Date(0),
      path: "/",
    });

    return NextResponse.json(
      { success: true, message: "Logged out successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.log("Logout API failed.");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred during logout.",
      },
      { status: 500 }
    );
  }
}
