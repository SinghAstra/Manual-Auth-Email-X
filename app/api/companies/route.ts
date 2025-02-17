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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch all companies
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        website: true,
        address: true,
        city: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.log("Error fetching companies.");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

const companySchema = z.object({
  name: z.string().min(2),
  website: z.string().url(),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
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
        { message: "Not authorized to create companies" },
        { status: 403 }
      );
    }

    // Parse and validate the request body
    const body = await req.json();
    const data = companySchema.parse(body);

    // Create the company
    const company = await prisma.company.create({
      data: {
        name: data.name,
        website: data.website || null,
        address: data.address,
        city: data.city,
        state: data.state,
      },
    });

    return NextResponse.json(company, { status: 201 });
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
      { message: "Failed to create company" },
      { status: 500 }
    );
  }
}
