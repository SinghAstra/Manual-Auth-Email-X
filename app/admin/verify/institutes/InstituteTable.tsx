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
import { InstituteVerificationModal } from "./InstituteVerificationModal";

interface InstituteTableProps {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
}

const institutes = [
  {
    id: "inst_1",
    name: "Tech University",
    type: "university",
    location: "New York, USA",
    status: "pending",
    submittedAt: "2024-01-20T10:30:00Z",
    regNumber: "TU123456",
    email: "admin@techuniversity.edu",
    phone: "+1 234-567-8900",
  },
  {
    id: "inst_2",
    name: "City College",
    type: "college",
    location: "London, UK",
    status: "approved",
    submittedAt: "2024-01-19T15:45:00Z",
    regNumber: "CC789012",
    email: "info@citycollege.edu",
    phone: "+44 20 7123 4567",
  },
  {
    id: "inst_3",
    name: "Technical Institute",
    type: "technical",
    location: "Berlin, Germany",
    status: "rejected",
    submittedAt: "2024-01-18T09:15:00Z",
    regNumber: "TI345678",
    email: "contact@techinstitute.edu",
    phone: "+49 30 1234 5678",
  },
];

export function InstituteTable({
  searchQuery,
  statusFilter,
  typeFilter,
}: InstituteTableProps) {
  const [selectedInstitute, setSelectedInstitute] = useState<
    (typeof institutes)[0] | null
  >(null);

  const filteredInstitutes = institutes.filter((institute) => {
    const matchesSearch = institute.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || institute.status === statusFilter;
    const matchesType = typeFilter === "all" || institute.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <>
      <div className="rounded-md border border-gray-800 bg-gray-900/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Institute</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInstitutes.map((institute) => (
              <TableRow key={institute.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium">{institute.name}</div>
                      <div className="text-sm text-gray-400">
                        {institute.regNumber}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{institute.type}</TableCell>
                <TableCell>{institute.location}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  {format(new Date(institute.submittedAt), "MMM d, yyyy")}
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
                        onClick={() => setSelectedInstitute(institute)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Request Info
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <InstituteVerificationModal
        institute={selectedInstitute}
        onClose={() => setSelectedInstitute(null)}
      />
    </>
  );
}
