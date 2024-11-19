import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_API_KEY!
);

function sanitizeFileName(fileName: string): string {
  // Remove special characters and spaces
  return fileName
    .replace(/[~_]/g, "-") // Replace ~ and _ with -
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-\.]/g, "") // Remove any other special characters
    .replace(/\-+/g, "-") // Replace multiple consecutive dashes with single dash
    .toLowerCase(); // Convert to lowercase for consistency
}

export async function uploadDocument(file: File) {
  try {
    console.log("In uploadDocument");
    if (!file) {
      throw new Error("No file provided");
    }

    const fileExt = file.name.split(".").pop();

    const baseFileName = file.name.substring(0, file.name.lastIndexOf("."));
    const sanitizedName = sanitizeFileName(baseFileName);
    const fileName = `${Date.now()}-${sanitizedName}.${fileExt}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from("institution-documents") // bucket name
      .upload(fileName, file);

    if (error) {
      console.log("Upload error --uploadDocument:", error.message);
      return null;
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("institution-documents").getPublicUrl(fileName);

    console.log("publicUrl --uploadDocument is ", publicUrl);

    return publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
}
