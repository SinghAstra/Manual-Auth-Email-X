import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Building2, Mail, Phone } from "lucide-react";

interface InstituteVerificationModalProps {
  institute: {
    id: string;
    name: string;
    type: string;
    location: string;
    status: string;
    regNumber: string;
    email: string;
    phone: string;
  } | null;
  onClose: () => void;
}

export function InstituteVerificationModal({
  institute,
  onClose,
}: InstituteVerificationModalProps) {
  if (!institute) return null;

  return (
    <Dialog open={!!institute} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Institute Verification Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {/* Institute Header */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-800/50">
              <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{institute.name}</h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      institute.status === "approved" &&
                        "border-green-500 text-green-500",
                      institute.status === "rejected" &&
                        "border-red-500 text-red-500",
                      institute.status === "pending" &&
                        "border-yellow-500 text-yellow-500"
                    )}
                  >
                    {institute.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">
                  Registration: {institute.regNumber}
                </p>
                <div className="mt-2 flex gap-4">
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Mail className="h-4 w-4" />
                    {institute.email}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Phone className="h-4 w-4" />
                    {institute.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline">Request More Info</Button>
              <Button variant="destructive">Reject</Button>
              <Button>Approve</Button>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="text-center py-8 text-gray-400">
              Document preview section coming soon
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="text-center py-8 text-gray-400">
              Verification history coming soon
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
