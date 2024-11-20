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
import {
  AlertCircle,
  Building2,
  CheckCircle,
  FileText,
  Globe,
  Mail,
  Phone,
  XCircle,
} from "lucide-react";

interface CorporateVerificationModalProps {
  company: {
    id: string;
    name: string;
    type: string;
    industry: string;
    size: string;
    location: string;
    status: string;
    regNumber: string;
    website: string;
    email: string;
    phone: string;
    documents: {
      total: number;
      verified: number;
    };
  } | null;
  onClose: () => void;
}

const requiredDocs = [
  { type: "Registration Certificate", required: true },
  { type: "Tax Registration", required: true },
  { type: "Company Profile", required: false },
  { type: "Additional Documents", required: false },
];

const CorporateVerificationModal = ({
  company,
  onClose,
}: CorporateVerificationModalProps) => {
  if (!company) return null;

  return (
    <Dialog open={!!company} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Company Verification Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {/* Company Header */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-800/50">
              <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{company.name}</h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      company.status === "approved" &&
                        "border-green-500 text-green-500",
                      company.status === "rejected" &&
                        "border-red-500 text-red-500",
                      company.status === "pending" &&
                        "border-yellow-500 text-yellow-500",
                      company.status === "info-required" &&
                        "border-blue-500 text-blue-500"
                    )}
                  >
                    {company.status.replace("-", " ")}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">
                  Registration: {company.regNumber}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Globe className="h-4 w-4" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      {company.website.replace("https://", "")}
                    </a>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Mail className="h-4 w-4" />
                    {company.email}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Phone className="h-4 w-4" />
                    {company.phone}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Building2 className="h-4 w-4" />
                    {company.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Industry</label>
                <p className="font-medium">{company.industry}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Company Size</label>
                <p className="font-medium capitalize">
                  {company.size.toLowerCase()}
                </p>
              </div>
            </div>

            {/* Document Progress */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                Document Verification
              </label>
              <div className="flex items-center gap-2">
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${
                        (company.documents.verified / company.documents.total) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-400 whitespace-nowrap">
                  {company.documents.verified}/{company.documents.total}{" "}
                  Verified
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <AlertCircle className="mr-2 h-4 w-4" />
                Request More Info
              </Button>
              <Button variant="destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            {requiredDocs.map((doc) => (
              <div
                key={doc.type}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{doc.type}</p>
                    <p className="text-sm text-gray-400">
                      {doc.required ? "Required" : "Optional"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Document
                </Button>
              </div>
            ))}
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
};

export default CorporateVerificationModal;
