"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import DocumentUploadCard from "@/components/verification/document-upload-card";
import { useToast } from "@/hooks/use-toast";
import { Document, DocumentType } from "@prisma/client";
import {
  Building2,
  CheckCircle2,
  Clock,
  Landmark,
  Library,
  Upload,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
// ------------------------------------------------------------------------------

type VerificationState = {
  verified: boolean;
  documents: Document[];
};

const VerificationStatus = ({ state }: { state: VerificationState }) => {
  if (state.documents.length === 0) return null;

  const getStatus = () => {
    if (state.verified) return "APPROVED";
    const hasRejected = state.documents.some(
      (doc) => doc.status === "REJECTED"
    );
    return hasRejected ? "REJECTED" : "PENDING";
  };

  const getFeedback = () =>
    state.documents
      .filter((doc) => doc.feedback)
      .map((doc) => doc.feedback)
      .join(". ");

  const status = getStatus();

  const statusConfig = {
    PENDING: {
      icon: Clock,
      title: "Verification in Progress",
      description:
        "Your documents are being reviewed. We'll notify you once complete.",
      color: "text-yellow-600",
    },
    REJECTED: {
      icon: X,
      title: "Verification Failed",
      description:
        getFeedback() ||
        "Documents rejected. Please review feedback and resubmit.",
      color: "text-red-600",
    },
    APPROVED: {
      icon: CheckCircle2,
      title: "Verification Complete",
      description:
        "Your account has been verified. You now have access to all features.",
      color: "text-green-600",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Alert className="mb-8">
      <Icon className={`h-5 w-5 ${config.color}`} />
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription>{config.description}</AlertDescription>
    </Alert>
  );
};
// ------------------------------------------------------------------------------

type UploadedFiles = {
  [key in DocumentType]?: File;
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

const VerificationPage = () => {
  // ------------------------------------------------------------------------------
  const [verificationState, setVerificationState] =
    useState<VerificationState>();
  const [isFetchingVerificationStatus, setIsFetchingVerificationStatus] =
    useState(false);
  // ------------------------------------------------------------------------------

  const router = useRouter();
  const searchParams = useSearchParams();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({});
  const selectedRole = searchParams.get("role");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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

      const response = await fetch("/api/verification/submit", {
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

  // ------------------------------------------------------------------------------

  // Fetch user's verification status on mount
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        setIsFetchingVerificationStatus(true);
        const response = await fetch("/api/verification/status");
        const data = await response.json();

        if (response.ok) {
          setVerificationState(data);
        } else {
          toast({
            title: data.error || "Failed to fetch verification status",
          });
        }
      } catch (error) {
        console.error("Failed to fetch verification status:", error);
      } finally {
        setIsFetchingVerificationStatus(false);
      }
    };

    fetchVerificationStatus();
  }, [toast]);

  if (isFetchingVerificationStatus) {
    return <div>Loading...</div>;
  }

  if (!verificationState) {
    return <div>Some Error Occurred Please try Again Later.</div>;
  }

  // If verified, show success and prevent further submissions
  if (verificationState.verified) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <VerificationStatus state={verificationState} />
        Your docs are verified
      </div>
    );
  }

  // If verification is pending, don't allow new submissions
  // If documents are pending review, don't allow new submissions
  const isPending = verificationState.documents.every(
    (doc) => doc.status === "PENDING"
  );
  if (isPending) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <VerificationStatus state={verificationState} />
        <div className="text-center">
          <Button variant="outline" disabled>
            Document submission in review
          </Button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------------------

  return (
    <div className="container mx-auto p-6 space-y-8">
      <VerificationStatus state={verificationState} />
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
