import { formatEnumValue } from "@/lib/utils/utils";
import { Document, User } from "@prisma/client";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import UserVerificationDetails from "./user-verifications-detail";

interface PendingUserItemProps {
  pendingUser: User;
}

export interface UserWithDocuments extends User {
  documents: Document[];
}

function PendingUserItem({ pendingUser }: PendingUserItemProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [user, setUser] = useState<UserWithDocuments>();

  const handleViewDetails = async () => {
    try {
      const response = await fetch(`/api/admin/users/${pendingUser.id}`);
      if (!response.ok) throw new Error("Failed to fetch user details");
      const userData = await response.json();
      setUser(userData);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <h3 className="font-medium">{pendingUser.name}</h3>
        <p className="text-sm text-muted-foreground">{pendingUser.email}</p>
      </div>
      <div className="flex gap-2">
        <Badge className="text-sm" variant={"outline"}>
          {formatEnumValue(pendingUser.role)}
        </Badge>
        <Button variant="outline" size="sm" onClick={handleViewDetails}>
          View Details
        </Button>
      </div>
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {user && (
            <UserVerificationDetails
              user={user}
              onClose={() => setIsDetailsOpen(false)}
              onStatusUpdate={() => {
                // Refresh the parent component's data
                // window.location.reload();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PendingUserItem;
