import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing required environment variables");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteFilesInDirectory(bucketName: string, path: string = "") {
  try {
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list(path);

    console.log("bucketName is ", bucketName);
    console.log("files is ", files);

    if (listError) throw listError;
    if (!files) return;

    for (const file of files) {
      const fullPath = path ? `${path}/${file.name}` : file.name;

      if (!file.metadata) {
        await deleteFilesInDirectory(bucketName, fullPath);
      } else {
        const { error: deleteError } = await supabase.storage
          .from(bucketName)
          .remove([fullPath]);

        if (deleteError) throw deleteError;
        console.log(`Deleted file: ${fullPath}`);
      }
    }
  } catch (error) {
    throw error;
  }
}

export async function GET() {
  try {
    const bucketName = "documents";

    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { message: "This route is only available in development mode" },
        { status: 403 }
      );
    }

    try {
      await deleteFilesInDirectory(bucketName);
      console.log("Successfully deleted all files and subdirectories");
    } catch (error) {
      return NextResponse.json(
        {
          message: "Error deleting files and subdirectories",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    const { error: deleteBucketError } = await supabase.storage.deleteBucket(
      bucketName
    );

    if (deleteBucketError) {
      return NextResponse.json(
        {
          message: "Error deleting bucket",
          error: deleteBucketError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: `Bucket "${bucketName}" and all its contents deleted successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in delete bucket operation:", error);
    return NextResponse.json(
      {
        message: "Failed to delete bucket",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
