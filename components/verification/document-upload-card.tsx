import { formatDocumentName } from "@/lib/utils/formatter";
import { cn } from "@/lib/utils/utils";
import { DocumentType } from "@prisma/client";
import { Eye, FileIcon, HelpCircle, Upload, X } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type FilePreview = {
  url: string;
  type: string;
};

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
    const url = URL.createObjectURL(file);
    setPreview({ url, type: file.type });
  }, []);

  // Use useEffect to generate preview when file changes
  useEffect(() => {
    if (file) {
      generatePreview(file);
    }
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

export default DocumentUploadCard;
