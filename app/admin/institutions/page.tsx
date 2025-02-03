"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  Document,
  Institution,
  InstitutionProfile,
  User,
} from "@prisma/client";
import { FileText, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface InstitutionProfileWithRelation extends InstitutionProfile {
  institution: Institution;
}

interface InstitutionWithRelation extends User {
  institutionProfile: InstitutionProfileWithRelation;
  documents: Document[];
}

const Institutions = () => {
  const [institutions, setInstitutions] = useState<InstitutionWithRelation[]>(
    []
  );
  const [isFetchingInstitutions, setIsFetchingInstitutions] = useState(true);
  const [message, setMessage] = useState<string>();
  const { toast } = useToast();

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await fetch("/api/admin/institutions");
        if (!response.ok) {
          throw new Error("Failed to fetch institutions");
        }
        const data = await response.json();
        setInstitutions(data);
      } catch (error) {
        setMessage("Something went wrong while fetching Institutions.");
        console.log("Error in fetchInstitutions.");
        if (error instanceof Error) {
          console.log("error.message is ", error.message);
          console.log("error.stack is ", error.stack);
        }
      } finally {
        setIsFetchingInstitutions(false);
      }
    };

    fetchInstitutions();
  }, []);

  useEffect(() => {
    if (!message) return;
    toast({
      title: message,
    });
  }, [message, toast]);

  if (isFetchingInstitutions) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Institution Administrators</CardTitle>
        <CardDescription>
          Manage and view all institution administrators and their verification
          status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Documents</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {institutions?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.institutionProfile?.institution?.name || "N/A"}
                </TableCell>
                <TableCell>
                  {user.institutionProfile?.designation || "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.verificationStatus === "APPROVED"
                        ? "default"
                        : user.verificationStatus === "REJECTED"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {user.verificationStatus.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{user.documents?.length || 0}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Number of uploaded documents</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Institutions;
