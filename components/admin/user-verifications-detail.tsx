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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatEnumValue } from "@/lib/utils/utils";
import { DocumentType, VerificationStatus } from "@prisma/client";
import {
  Calendar,
  CheckCircle,
  FileText,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { UserWithDocuments } from "./pending-user-item";

interface UserVerificationDetailsProps {
  user: UserWithDocuments;
  onClose: () => void;
  onStatusUpdate: () => void;
}

export default function UserVerificationDetails({
  user,
  onClose,
  onStatusUpdate,
}: UserVerificationDetailsProps) {
  const [feedback, setFeedback] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: VerificationStatus) => {
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
        }),
      });

      if (!response.ok) throw new Error("Failed to update verification status");

      onStatusUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating verification status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getRequiredDocuments = (role: string): DocumentType[] => {
    switch (role) {
      case "INSTITUTION_ADMIN":
        return [DocumentType.INSTITUTION_ID, DocumentType.AUTHORIZATION_LETTER];
      case "COMPANY_REPRESENTATIVE":
        return [DocumentType.COMPANY_ID, DocumentType.BUSINESS_CARD];
      case "GOVERNMENT":
        return [DocumentType.GOVERNMENT_ID, DocumentType.DEPARTMENT_LETTER];
      default:
        return [];
    }
  };

  const requiredDocs = getRequiredDocuments(user.role);
  const uploadedDocTypes = user.documents.map((doc) => doc.type);
  const missingDocs = requiredDocs.filter(
    (doc) => !uploadedDocTypes.includes(doc)
  );

  return (
    <Card className="max-w-2xl w-full mx-auto">
      <CardHeader>
        <CardTitle>User Verification Details</CardTitle>
        <CardDescription>
          Review user documents and update verification status
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">{formatEnumValue(user.role)}</Badge>
            <Badge variant="secondary">
              {formatEnumValue(user.verificationStatus)}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
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
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(doc.fileUrl, "_blank")}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}

          {missingDocs.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-destructive">
                Missing Documents:
              </h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {missingDocs.map((doc) => (
                  <li key={doc}>{formatEnumValue(doc)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Feedback Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Feedback</label>
          <Textarea
            placeholder="Enter feedback for the user..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
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
              <Button
                variant="default"
                disabled={isUpdating || missingDocs.length > 0}
              >
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
      </CardFooter>
    </Card>
  );
}
