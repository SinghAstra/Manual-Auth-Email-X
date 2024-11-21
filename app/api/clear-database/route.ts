import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await db.verificationToken.deleteMany();
    await db.institutionDocument.deleteMany();
    await db.corporateDocument.deleteMany();
    await db.user.deleteMany();
    await db.institution.deleteMany();
    await db.corporate.deleteMany();
    await db.account.deleteMany();
    await db.session.deleteMany();

    return NextResponse.json(
      { message: "Database cleared successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in GET request:", error);
    return NextResponse.json(
      { error: "Failed to clear database" },
      { status: 500 }
    );
  }
}
