import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { DocumentType, VerificationStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
// import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get the form data
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    console.log("files is ", files);

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // 3. Validate files
    const validFileTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!validFileTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}` },
          { status: 400 }
        );
      }
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: "File size exceeds 5MB limit" },
          { status: 400 }
        );
      }
    }

    // 4. Upload files and create document records
    const uploadPromises = files.map(async (file) => {
      // Generate a unique filename
      const timestamp = Date.now();
      const filename = `${session.user.id}-${timestamp}-${file.name}`;
      console.log("filename : ", filename);

      // Upload to blob storage
      //   const blob = await put(filename, file, {
      //     access: "private",
      //   });

      // Create document record in database
      // const document = await prisma.document.create({
      //   data: {
      //     userId: session.user.id,
      //     type: ,
      //     fileUrl: ,
      //     status: VerificationStatus.PENDING,
      //   },
      // });

      return {
        // documentId: document.id,
        // fileUrl: blob.url,
        filename: file.name,
      };
    });

    const uploadResults = await Promise.all(uploadPromises);

    console.log("uploadedResults is ", uploadResults);

    // 5. Update user verification status
    // await db.user.update({
    //   where: { id: session.user.id },
    //   data: { verified: false }, // Reset to false until documents are verified
    // });

    return NextResponse.json({
      message: "Files uploaded successfully",
      documents: uploadResults,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await db.document.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
