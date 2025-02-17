import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    // Get the session to check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" });
    }

    // Fetch all institutions
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        website: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(institutions);
  } catch (error) {
    console.log("Error fetching institutions.");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json({ message: "Internal server error" });
  }
}

const institutionSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  website: z.string().url(),
});

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if user has appropriate role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Not authorized to create institutions" },
        { status: 403 }
      );
    }

    // Parse and validate the request body
    const body = await req.json();
    const data = institutionSchema.parse(body);

    // Create the institution
    const institution = await prisma.institution.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        website: data.website || null,
      },
    });

    return NextResponse.json(institution, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid data", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create institution" },
      { status: 500 }
    );
  }
}
