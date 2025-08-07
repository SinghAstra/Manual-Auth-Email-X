import { AccessTokenPayload } from "@/interfaces/auth";
import { comparePassword, generateAccessToken } from "@/lib/auth";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/lib/constants";
import { db } from "@/lib/db";
import { loginSchema } from "@/validations/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ValidationError } from "yup";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("body is ", body);

    // 1. Server-side validation using Yup
    await loginSchema.validate({ email, password }, { abortEarly: false });

    // 2. Find user by email
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    console.log("user is ", user);

    // 3. Compare password
    const passwordMatch = await comparePassword(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    console.log("passwordMatch is ", passwordMatch);

    // 4. Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your email before logging in.",
        },
        { status: 403 }
      );
    }

    // 5. Generate Access and Refresh Tokens
    const accessTokenPayload: AccessTokenPayload = {
      userId: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    };
    const accessToken = generateAccessToken(accessTokenPayload);

    console.log("accessToken is ", accessToken);

    // 7. Set tokens as HTTP-only cookies using the Server Action helper
    const accessExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const cookieStore = await cookies();

    cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: accessExpires,
    });

    console.log(
      "cookieStore.get(ACCESS_TOKEN_COOKIE_NAME) is ",
      cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)
    );

    return NextResponse.json({
      success: true,
      message: "Logged In Successfully.",
    });
  } catch (error) {
    console.log("Login API failed.");
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, message: "Validation failed." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
