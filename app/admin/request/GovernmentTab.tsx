import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Check, Landmark, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Government {
  id: string;
  department: string;
  designation: string;
  jurisdiction: string;
  verificationStatus: string;
}

// Mock data for government entities
const mockGovernment = [
  {
    id: "1",
    department: "Department of Education",
    designation: "State Office",
    jurisdiction: "State",
    verificationStatus: "NOT_VERIFIED",
  },
  {
    id: "2",
    department: "Ministry of Innovation",
    designation: "Federal Office",
    jurisdiction: "National",
    verificationStatus: "NOT_VERIFIED",
  },
  {
    id: "3",
    department: "Bureau of Statistics",
    designation: "Regional Branch",
    jurisdiction: "Regional",
    verificationStatus: "NOT_VERIFIED",
  },
];

interface GovernmentTabProps {
  active: boolean;
}

export const GovernmentTab: React.FC<GovernmentTabProps> = ({ active }) => {
  const [government, setGovernment] = useState<Government[]>([]);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    // For now, we're using mock data
    if (active) {
      setGovernment(mockGovernment);
    }
  }, [active]);

  const addToProcessing = (id: string) => {
    setProcessingIds((prev) => [...prev, id]);
  };

  const handleApprove = async (id: string) => {
    try {
      addToProcessing(id);
      // Mock API call - in a real app, this would be a fetch to your API
      console.log(`Approving government entity with ID: ${id}`);

      // Remove the approved entity from the list
      setGovernment(government.filter((gov) => gov.id !== id));
      toast({ title: "Government entity approved successfully" });
    } catch (error) {
      console.log("error is ", error);
      toast({ title: "Failed to approve government entity" });
    }
  };

  const handleReject = async (id: string) => {
    try {
      addToProcessing(id);
      // Mock API call - in a real app, this would be a fetch to your API
      console.log(`Rejecting government entity with ID: ${id}`);

      // Remove the rejected entity from the list
      setGovernment(government.filter((gov) => gov.id !== id));
      toast({ title: "Government entity rejected successfully" });
    } catch (error) {
      console.log("error is ", error);
      toast({ title: "Failed to reject government entity" });
    }
  };

  if (government.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground text-center">
            No pending government entity verification requests.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {government.map((gov) => {
        const isProcessing = processingIds.includes(gov.id);
        return (
          <Card key={gov.id} className="mb-4">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Landmark className="h-5 w-5" />
                  <CardTitle className="text-lg">{gov.department}</CardTitle>
                </div>
                <CardDescription className="mt-1">
                  {gov.designation} • {gov.jurisdiction} Jurisdiction
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="bg-secondary text-secondary-foreground"
              >
                {gov.verificationStatus === "NOT_VERIFIED"
                  ? "Pending Verification"
                  : gov.verificationStatus}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-2 mt-2">
                {isProcessing ? (
                  <Button variant="outline" size="sm" disabled>
                    Processing...
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleReject(gov.id)}
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-emerald-500 hover:bg-emerald-500/10"
                      onClick={() => handleApprove(gov.id)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
