"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { formatDocumentName } from "@/lib/utils/formatter";
import { cn } from "@/lib/utils/utils";
import { DocumentType } from "@prisma/client";
import {
  Building2,
  Eye,
  FileIcon,
  HelpCircle,
  Landmark,
  Library,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

type UploadedFiles = {
  [key in DocumentType]?: File;
};

type FilePreview = {
  url: string;
  type: string;
};

const roles = [
  {
    id: "INSTITUTION_ADMIN",
    title: "Institution Admin",
    description: "Manage institution profile and student placement data",
    icon: Library,
    requiredDocs: [
      DocumentType.INSTITUTION_ID,
      DocumentType.AUTHORIZATION_LETTER,
    ],
  },
  {
    id: "COMPANY_REPRESENTATIVE",
    title: "Company Representative",
    description: "Verify placement claims and manage company profile",
    icon: Building2,
    requiredDocs: [DocumentType.COMPANY_ID, DocumentType.BUSINESS_CARD],
  },
  {
    id: "GOVERNMENT",
    title: "Government Official",
    description: "Access analytics and oversee placement data",
    icon: Landmark,
    requiredDocs: [DocumentType.GOVERNMENT_ID, DocumentType.DEPARTMENT_LETTER],
  },
];

const DocumentUploadCard = ({
  docName,
  file,
  onFileChange,
  onRemove,
}: {
  docName: DocumentType;
  file: File | undefined;
  onFileChange: (docName: DocumentType, file: File) => void;
  onRemove: (docName: DocumentType) => void;
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<FilePreview | null>(null);

  console.log("preview is ", preview);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-accent");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-accent");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-accent");
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      onFileChange(docName, droppedFile);
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile)) {
      onFileChange(docName, selectedFile);
    }
  };

  // Create a function to generate preview
  const generatePreview = useCallback((file: File) => {
    // Clean up previous preview URL to prevent memory leaks
    // if (preview?.url) {
    //   URL.revokeObjectURL(preview.url);
    // }

    // Generate new preview URL
    const url = URL.createObjectURL(file);
    setPreview({ url, type: file.type });
  }, []);

  // Use useEffect to generate preview when file changes
  useEffect(() => {
    if (file) {
      generatePreview(file);
    }

    // Cleanup function to revoke object URL when component unmounts
    // or when file changes
    // return () => {
    //   if (preview?.url) {
    //     URL.revokeObjectURL(preview.url);
    //   }
    // };
  }, [file, generatePreview]);

  return (
    <div className="border bg-card/50 backdrop-blur-sm p-4 space-y-4 rounded-md">
      <div className="text-lg flex items-center justify-between ">
        <div className="flex items-center space-x-2">
          <FileIcon className="w-5 h-5 text-primary" />
          <span>{formatDocumentName(docName)}</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Upload a clear, readable copy of your{" "}
                {formatDocumentName(docName)}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div>
        {file && preview ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between border backdrop-blur-lg rounded-md py-2 px-4">
              <div className="flex items-center min-w-0 space-x-2 flex-1 mr-4">
                <FileIcon className="w-5 h-5" />
                <span className="text-sm font-medium truncate">
                  {formatDocumentName(docName)}
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <div className="flex gap-2 items-center flex-shrink-0">
                <Link
                  href={preview.url}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "flex gap-2 whitespace-nowrap"
                  )}
                  target="_blank"
                >
                  <Eye />
                  Preview
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(docName)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop your {formatDocumentName(docName)} here, or click to
              select file
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: PDF, JPG, PNG (Max size: 5MB)
            </p>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const VerificationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({});
  const selectedRole = searchParams.get("role");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  console.log("uploadedFiles is ", uploadedFiles);

  const handleRoleSelect = (roleTitle: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("role", roleTitle);
    router.push(`/verification?${params.toString()}`, { scroll: false });
    setUploadedFiles({});
  };

  const handleClearRole = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("role");
    router.push(`/verification?${params.toString()}`, { scroll: false });
    setUploadedFiles({});
  }, [router, searchParams]);

  const handleFileChange = (docName: DocumentType, file: File) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [docName]: file,
    }));
  };

  const handleFileRemove = (docName: DocumentType) => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[docName];
      return newFiles;
    });
  };

  useEffect(() => {
    if (selectedRole && !roles.find((r) => r.title === selectedRole)) {
      handleClearRole();
    }
  }, [selectedRole, handleClearRole]);

  const currentRole = roles.find((r) => r.title === selectedRole);

  const handleSubmit = async () => {
    if (!currentRole || !Object.keys(uploadedFiles).length) return;
    try {
      setIsUploading(true);

      // Create FormData
      const formData = new FormData();

      Object.entries(uploadedFiles).forEach(([docType, file]) => {
        formData.append(docType, file);
      });

      const response = await fetch("/api/submit-verification-docs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }
      // Show success message
      toast({ title: "Documents uploaded successfully" });

      // Clear the form
      setUploadedFiles({});
    } catch (error) {
      console.log("Upload error --VerificationPage:", error);
      toast({
        title:
          error instanceof Error ? error.message : "Failed to upload documents",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {!selectedRole && (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-tight">Apply For Verification</h2>
          </div>
          <div className="w-full flex flex-col gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`cursor-pointer p-2 px-4 rounded-md border bg-card/50 backdrop-blur-sm transition-all duration-200 hover:bg-accent ${
                  selectedRole === role.title ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleRoleSelect(role.title)}
              >
                <div className="flex items-center space-x-2 py-2">
                  <role.icon className="w-6 h-6 text-primary" />
                  <span className="text-lg">{role.title}</span>
                </div>
                <span>{role.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedRole && currentRole && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b py-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Document Upload</span>
              </div>
              <span className="text-muted-foreground">
                Please upload the following required documents
              </span>
            </div>

            <Button variant="outline" onClick={handleClearRole}>
              Clear Selection
            </Button>
          </div>

          {currentRole.requiredDocs.map((doc) => (
            <DocumentUploadCard
              key={doc}
              docName={doc}
              file={uploadedFiles[doc]}
              onFileChange={handleFileChange}
              onRemove={handleFileRemove}
            />
          ))}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={
              isUploading ||
              currentRole.requiredDocs.length !==
                Object.keys(uploadedFiles).length
            }
          >
            {isUploading ? "Uploading..." : "Submit Documents"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
