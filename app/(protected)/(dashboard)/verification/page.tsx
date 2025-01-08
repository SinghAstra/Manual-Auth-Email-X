"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Building2,
  CheckCircle2,
  FileIcon,
  HelpCircle,
  Landmark,
  Library,
  Upload,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const roles = [
  {
    id: "INSTITUTION_ADMIN",
    title: "Institution Admin",
    description: "Manage institution profile and student placement data",
    icon: Library,
    requiredDocs: ["Institution ID", "Authorization Letter"],
  },
  {
    id: "COMPANY_REPRESENTATIVE",
    title: "Company Representative",
    description: "Verify placement claims and manage company profile",
    icon: Building2,
    requiredDocs: ["Company ID", "Business Card"],
  },
  {
    id: "GOVERNMENT",
    title: "Government Official",
    description: "Access analytics and oversee placement data",
    icon: Landmark,
    requiredDocs: ["Government ID", "Department Letter"],
  },
];

const DocumentUploadCard = ({ docName, file, onFileChange, onRemove }) => {
  const inputRef = React.useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-accent");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-accent");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-accent");
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      onFileChange(docName, droppedFile);
    }
  };

  const isValidFile = (file) => {
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && isValidFile(selectedFile)) {
      onFileChange(docName, selectedFile);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileIcon className="w-5 h-5 text-primary" />
            <span>{docName}</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload a clear, readable copy of your {docName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {file ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div className="flex items-center space-x-2">
                <FileIcon className="w-5 h-5" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(docName)}
                className="text-destructive hover:text-destructive/90"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            {file.type.startsWith("image/") && (
              <div className="relative h-48 bg-accent/50 rounded-lg overflow-hidden">
                {/* <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview of ${docName}`}
                  className="w-full h-full object-contain"
                /> */}
              </div>
            )}
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
              Drag and drop your {docName} here, or click to select file
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
      </CardContent>
    </Card>
  );
};

const VerificationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [uploadedFiles, setUploadedFiles] = useState({});

  const selectedRole = searchParams.get("role");

  const handleRoleSelect = (roleTitle) => {
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

  const handleFileChange = (docName, file) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [docName]: file,
    }));
  };

  const handleFileRemove = (docName) => {
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

  return (
    <div className="container mx-auto p-6 space-y-8">
      {!selectedRole && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-tight">Apply For Verification</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-200 hover:bg-accent ${
                  selectedRole === role.title ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleRoleSelect(role.title)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <role.icon className="w-6 h-6 text-primary" />
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{role.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedRole && currentRole && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
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
            disabled={
              currentRole.requiredDocs.length !==
              Object.keys(uploadedFiles).length
            }
          >
            Submit Documents
          </Button>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
