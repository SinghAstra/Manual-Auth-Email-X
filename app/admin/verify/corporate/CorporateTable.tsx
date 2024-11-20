"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Eye,
  MoreHorizontal,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import CorporateVerificationModal from "./CorporateVerificationModal";

interface CorporateTableProps {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
}

const companies = [
  {
    id: "corp_1",
    name: "TechCorp Solutions",
    type: "technology",
    industry: "Software Development",
    size: "LARGE",
    location: "San Francisco, USA",
    status: "pending",
    submittedAt: "2024-01-20T10:30:00Z",
    regNumber: "TC123456",
    website: "https://techcorp.com",
    email: "contact@techcorp.com",
    phone: "+1 234-567-8900",
    documents: {
      total: 4,
      verified: 2,
    },
  },
  {
    id: "corp_2",
    name: "Global Manufacturing Inc",
    type: "manufacturing",
    industry: "Automotive",
    size: "ENTERPRISE",
    location: "Detroit, USA",
    status: "approved",
    submittedAt: "2024-01-19T15:45:00Z",
    regNumber: "GM789012",
    website: "https://globalmfg.com",
    email: "info@globalmfg.com",
    phone: "+1 345-678-9012",
    documents: {
      total: 4,
      verified: 4,
    },
  },
  {
    id: "corp_3",
    name: "ServicePro Ltd",
    type: "services",
    industry: "Consulting",
    size: "MEDIUM",
    location: "London, UK",
    status: "info-required",
    submittedAt: "2024-01-18T09:15:00Z",
    regNumber: "SP345678",
    website: "https://servicepro.co.uk",
    email: "contact@servicepro.co.uk",
    phone: "+44 20 7123 4567",
    documents: {
      total: 4,
      verified: 1,
    },
  },
];

export function CorporateTable({
  searchQuery,
  statusFilter,
  typeFilter,
}: CorporateTableProps) {
  const [selectedCompany, setSelectedCompany] = useState<
    (typeof companies)[0] | null
  >(null);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || company.status === statusFilter;
    const matchesType = typeFilter === "all" || company.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <>
      <div className="rounded-md border border-gray-800 bg-gray-900/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.map((company) => (
              <TableRow key={company.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium">{company.name}</div>
                      <div className="text-sm text-gray-400">
                        {company.regNumber}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell className="capitalize">
                  {company.size.toLowerCase()}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${
                            (company.documents.verified /
                              company.documents.total) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-400">
                      {company.documents.verified}/{company.documents.total}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(company.submittedAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem
                        onClick={() => setSelectedCompany(company)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Request Info
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CorporateVerificationModal
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
      />
    </>
  );
}
