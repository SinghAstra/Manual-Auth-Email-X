"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ExternalLink, FileText, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

type Document = {
  id: string;
  type: string;
  fileUrl: string;
  createdAt: string;
};

type Institution = {
  id: string;
  name: string;
  verificationStatus: string;
};

type InstitutionProfile = {
  id: string;
  institution: Institution;
  institutionId: string;
};

type PendingUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  verificationStatus: string;
  documents: Document[];
  institutionProfile: InstitutionProfile;
};

interface InstitutionsAdminTabProps {
  active: boolean;
}

const InstitutionsAdminTab: React.FC<InstitutionsAdminTabProps> = ({
  active,
}) => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [feedback, setFeedback] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log("inside useEffect")
    console.log("active is ",active)
    if (!active) {
      return;
    }
    const fetchPendingUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/admin/pending-verification?role=INSTITUTION_ADMIN&status=PENDING"
        );
        const data = await response.json();
        console.log("data is ", data);
        if (!response.ok) {
          throw new Error("Failed to fetch pending users");
        }
        setPendingUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching pending users:", error);
        toast({
          title: "Error",
          description: "Failed to load pending verification requests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, [active, toast]);

  const handleVerificationUpdate = async (
    userId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      setProcessingId(userId);
      const response = await fetch("/api/admin/pending-verification", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          status,
          feedback: status === "REJECTED" ? feedback : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update verification status");
      }

      // Refresh the list
      // TODO : Remove the Institute
      setSelectedUser(null);
      setFeedback("");
      toast({
        title: `User ${status.toLowerCase()}`,
        description: `The user has been successfully ${status.toLowerCase()}`,
        variant: status === "APPROVED" ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error updating verification status:", error);
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openDocumentInNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (pendingUsers.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <CheckCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No pending verification requests at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {pendingUsers.map((user) => (
        <Card key={user.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className="bg-secondary text-secondary-foreground"
                  >
                    {user.role.replace("_", " ")}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Institution</h4>
                  <p className="text-sm">
                    {user.institutionProfile?.institution.name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Submitted Documents</h4>
                {user.documents.length > 0 ? (
                  <div className="space-y-2">
                    {user.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start gap-2"
                          onClick={() => openDocumentInNewTab(doc.fileUrl)}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="truncate">{doc.type}</span>
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No documents submitted
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-4 md:items-end md:justify-end">
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 md:flex-none"
                    onClick={() =>
                      handleVerificationUpdate(user.id, "APPROVED")
                    }
                    disabled={!!processingId}
                  >
                    {processingId === user.id ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" /> Approve
                      </span>
                    )}
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="flex-1 md:flex-none"
                        onClick={() => setSelectedUser(user)}
                      >
                        <XCircle className="h-4 w-4 mr-2" /> Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Verification Request</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="feedback">Feedback (Optional)</Label>
                          <Textarea
                            id="feedback"
                            placeholder="Provide feedback on why the verification is being rejected"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            selectedUser &&
                            handleVerificationUpdate(
                              selectedUser.id,
                              "REJECTED"
                            )
                          }
                          disabled={!!processingId}
                        >
                          {processingId === selectedUser?.id ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Processing...
                            </span>
                          ) : (
                            "Confirm Rejection"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-xs text-muted-foreground">
                  Submitted on{" "}
                  {new Date(
                    user.documents[0]?.createdAt || Date.now()
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InstitutionsAdminTab;
