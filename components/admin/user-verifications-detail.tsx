import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatEnumValue } from "@/lib/utils/utils";
import { Role, VerificationStatus } from "@prisma/client";
import { CheckCircle, FileText, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { UserWithDocuments } from "./pending-user-item";

interface UserVerificationDetailsProps {
  user: UserWithDocuments;
  onClose: () => void;
}

const DOCUMENT_ROLE_MAP = {
  INSTITUTION_ID: Role.INSTITUTION_ADMIN,
  AUTHORIZATION_LETTER: Role.INSTITUTION_ADMIN,
  COMPANY_ID: Role.COMPANY_REPRESENTATIVE,
  BUSINESS_CARD: Role.COMPANY_REPRESENTATIVE,
  GOVERNMENT_ID: Role.GOVERNMENT,
  DEPARTMENT_LETTER: Role.GOVERNMENT,
};

export default function UserVerificationDetails({
  user,
  onClose,
}: UserVerificationDetailsProps) {
  const [feedback, setFeedback] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<string>();
  const { toast } = useToast();

  // Determine role based on uploaded documents
  const determineRole = () => {
    const roles = new Set(
      user.documents.map((doc) => DOCUMENT_ROLE_MAP[doc.type])
    );

    // If we find exactly one role from the documents, return it
    if (roles.size === 1) {
      return Array.from(roles)[0];
    }

    // If no clear role can be determined, return null
    return null;
  };

  const determinedRole = determineRole();

  const handleStatusUpdate = async (newStatus: VerificationStatus) => {
    if (newStatus === VerificationStatus.APPROVED && !determinedRole) {
      setMessage("No determined Role");
      return;
    }

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/admin/verifications/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          feedback: feedback.trim(),
          role:
            newStatus === VerificationStatus.APPROVED ? determinedRole : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update verification status");
      setMessage("Updated Verification Status");

      onClose();
    } catch (error) {
      console.error("Error updating verification status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    toast({
      title: message,
    });
  }, [message, toast]);

  return (
    <div className="w-full mx-auto flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="leading-loose">User Verification Details</h1>
        <span className="text-muted-foreground text-sm">
          Review user documents and update verification status
        </span>
      </div>

      <div className="space-y-6">
        {/* User Information */}
        <div className="flex items-center gap-2">
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{formatEnumValue(user.role)}</Badge>
            <Badge variant="secondary">
              {formatEnumValue(user.verificationStatus)}
            </Badge>
          </div>
        </div>

        {/* Documents Section */}
        <div className="space-y-4">
          <h3 className="font-medium">Uploaded Documents</h3>
          {user.documents.length === 0 ? (
            <p className="text-muted-foreground">No documents uploaded yet</p>
          ) : (
            <div className="grid gap-2">
              {user.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{formatEnumValue(doc.type)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(doc.fileUrl, "_blank")}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feedback Section */}
        <div className="space-y-2 p-2">
          <label className="text-sm font-medium">Feedback</label>
          <Textarea
            placeholder="Enter feedback for the user..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isUpdating}>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject Verification</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reject this verification request? The
                  user will be notified and will need to resubmit their
                  documents.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    handleStatusUpdate(VerificationStatus.REJECTED)
                  }
                >
                  Reject
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" disabled={isUpdating}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Approve Verification</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to approve this verification request?
                  The user will be granted access based on their role.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    handleStatusUpdate(VerificationStatus.APPROVED)
                  }
                >
                  Approve
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
