import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { DocumentType, VerificationStatus } from "@prisma/client";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get and Process FormData
    const formData = await req.formData();
    console.log("DocumentType is ", DocumentType);
    const uploadedFiles: { type: DocumentType; file: File }[] = [];

    // Process each document type
    Object.values(DocumentType).forEach((docType) => {
      const file = formData.get(docType) as File | null;
      if (file) {
        uploadedFiles.push({ type: docType, file });
      }
    });

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { error: "No valid documents provided" },
        { status: 400 }
      );
    }

    // 3. Validate files
    const validFileTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const uploadedFile of uploadedFiles) {
      if (!validFileTypes.includes(uploadedFile.file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${uploadedFile.file.type}` },
          { status: 400 }
        );
      }
      if (uploadedFile.file.size > maxSize) {
        return NextResponse.json(
          { error: "File size exceeds 5MB limit" },
          { status: 400 }
        );
      }
    }

    // 4. Upload files and create document records
    const uploadPromises = uploadedFiles.map(async (uploadedFile) => {
      const file = uploadedFile.file;
      // Generate a unique filename
      const timestamp = Date.now();
      const filename = `${session.user.id}-${timestamp}-${file.name}`;
      console.log("filename : ", filename);

      // Upload to blob storage
      const blob = await put(filename, file, {
        access: "public",
        addRandomSuffix: true, // Adds random suffix to prevent naming conflicts
      });

      console.log("blob.url is ", blob.url);

      // Create document record in database
      const document = await prisma.document.create({
        data: {
          userId: session.user.id,
          type: uploadedFile.type,
          fileUrl: blob.url,
          status: VerificationStatus.PENDING,
        },
      });

      return {
        documentId: document.id,
        fileUrl: blob.url,
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
