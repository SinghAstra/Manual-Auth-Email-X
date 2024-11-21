import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { message: "This route is only available in development mode" },
        { status: 403 }
      );
    }

    const adminName = "adminName";
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        {
          message:
            "Admin credentials not properly configured in environment variables",
        },
        { status: 500 }
      );
    }

    const existingAdmin = await db.user.findUnique({
      where: {
        email: adminEmail,
      },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin user already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await db.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true,
        isApproved: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...adminWithoutPassword } = admin;

    return NextResponse.json(
      {
        message: "Admin created successfully",
        admin: adminWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating admin:", error);
    return NextResponse.json(
      { message: "Failed to create admin user" },
      { status: 500 }
    );
  }
}
