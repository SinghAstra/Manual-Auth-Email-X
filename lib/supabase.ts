"use server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

interface DocumentUploadConfig {
  allowedFileTypes?: string[];
  maxFileSizeInMB?: number;
  customFileNamePrefix?: string;
  storageFolder?: string;
}

interface DocumentUploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
  metadata?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadedAt: string;
  };
}

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log("SUPABASE_URL is ", SUPABASE_URL);
  console.log("SUPABASE_ANON_KEY is ", SUPABASE_ANON_KEY);
  throw new Error("Missing Supabase environment variables");
}

class DocumentUploadService {
  private static instance: DocumentUploadService;
  private supabase: SupabaseClient;
  private readonly BUCKET_NAME = "documents";
  private config: DocumentUploadConfig;

  private defaultConfig: DocumentUploadConfig = {
    allowedFileTypes: ["pdf", "doc", "docx", "txt", "rtf", "xls", "xlsx"],
    maxFileSizeInMB: 5,
    customFileNamePrefix: "",
    storageFolder: "",
  };

  private constructor(config?: Partial<DocumentUploadConfig>) {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    this.config = { ...this.defaultConfig, ...config };
  }

  public static getInstance(
    config?: Partial<DocumentUploadConfig>
  ): DocumentUploadService {
    if (!DocumentUploadService.instance) {
      DocumentUploadService.instance = new DocumentUploadService(config);
    }
    return DocumentUploadService.instance;
  }

  private sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[~_]/g, "-")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-\.]/g, "")
      .replace(/\-+/g, "-")
      .toLowerCase();
  }

  private validateFile(file: File): string | null {
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const fileSizeInMB = file.size / (1024 * 1024);

    if (!fileExt || !this.config.allowedFileTypes?.includes(fileExt)) {
      return `File type .${fileExt} is not allowed. Allowed types: ${this.config.allowedFileTypes?.join(
        ", "
      )}`;
    }

    if (fileSizeInMB > (this.config.maxFileSizeInMB || 5)) {
      return `File size exceeds ${this.config.maxFileSizeInMB}MB limit`;
    }

    return null;
  }

  private generateFileName(originalName: string): string {
    const fileExt = originalName.split(".").pop();
    const baseFileName = originalName.substring(
      0,
      originalName.lastIndexOf(".")
    );
    const sanitizedName = this.sanitizeFileName(baseFileName);
    const timestamp = Date.now();
    const prefix = this.config.customFileNamePrefix
      ? `${this.sanitizeFileName(this.config.customFileNamePrefix)}-`
      : "";

    return `${
      this.config.storageFolder ? this.config.storageFolder + "/" : ""
    }${prefix}${timestamp}-${sanitizedName}.${fileExt}`;
  }

  async uploadDocument(file: File): Promise<DocumentUploadResult> {
    try {
      if (!file) {
        return {
          success: false,
          error: "No file provided",
        };
      }

      const validationError = this.validateFile(file);
      if (validationError) {
        return {
          success: false,
          error: validationError,
        };
      }

      const fileName = this.generateFileName(file.name);

      const { error } = await this.supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error.message);
        return {
          success: false,
          error: error.message,
        };
      }

      const {
        data: { publicUrl },
      } = this.supabase.storage.from(this.BUCKET_NAME).getPublicUrl(fileName);

      return {
        success: true,
        publicUrl,
        metadata: {
          fileName,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("Upload failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async deleteDocument(
    fileName: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.storage
        .from(this.BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

export async function handleDocumentUpload(
  storageFolder: string,
  file: File | undefined
) {
  if (!file) return null;

  const documentService = DocumentUploadService.getInstance({
    allowedFileTypes: ["pdf"],
    maxFileSizeInMB: 5,
    storageFolder,
  });

  const result = await documentService.uploadDocument(file);
  if (!result.success) {
    console.log("Document upload failed:", result.error);
    throw new Error(`Document upload failed: ${result.error}`);
  }

  return result.publicUrl || null;
}
