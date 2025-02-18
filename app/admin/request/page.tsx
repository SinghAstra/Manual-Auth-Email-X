"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Institution } from "@prisma/client";
import { Briefcase, Building, Check, Landmark, X } from "lucide-react";
import React, { useEffect, useState } from "react";

type TabsOptions = "institutions" | "companies" | "government";

const AdminRequestPage = () => {
  const [activeTab, setActiveTab] = useState("institutions");
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isFetchingInstitutions, setIsFetchingInstitutions] = useState(false);
  const [message, setMessage] = useState<string>();
  const { toast } = useToast();

  // Mock data for companies and government
  const companies = [
    {
      id: "1",
      name: "TechCorp",
      website: "techcorp.com",
      address: "101 Corporate Drive, New York, NY",
      verificationStatus: "NOT_VERIFIED",
    },
    {
      id: "2",
      name: "Global Solutions",
      website: "globalsolutions.com",
      address: "202 Business Blvd, Chicago, IL",
      verificationStatus: "NOT_VERIFIED",
    },
    {
      id: "3",
      name: "Innovative Systems",
      website: "innovativesystems.com",
      address: "303 Startup Street, Seattle, WA",
      verificationStatus: "NOT_VERIFIED",
    },
  ];

  const government = [
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

  useEffect(() => {
    const fetchUnverifiedInstitutions = async () => {
      if (activeTab !== "institutions") return;

      try {
        setIsFetchingInstitutions(true);
        const response = await fetch(
          "/api/institutions?verificationStatus=NOT_VERIFIED"
        );
        if (!response.ok) {
          setMessage("Failed to fetch institutions");
        }
        const data = await response.json();
        setInstitutions(data);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        setMessage("Internal Server Error");
      } finally {
        setIsFetchingInstitutions(false);
      }
    };

    fetchUnverifiedInstitutions();
  }, [activeTab]);

  useEffect(() => {
    if (!message) return;
    toast({
      title: message,
    });
  }, [toast, message]);

  const handleApprove = async (id: string, type: TabsOptions) => {
    if (type === ("institution" as TabsOptions)) {
      try {
        const response = await fetch(`/api/institutions/${id}/verify`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ verificationStatus: "VERIFIED" }),
        });
        const data = await response.json();
        if (!response.ok) {
          setMessage(data.message || "Failed to approve institution");
        }

        // Remove the approved institution from the list
        setInstitutions(institutions.filter((inst) => inst.id !== id));
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        setMessage("Internal Server Error --handleApprove");
        // You might want to show an error toast here
      }
    } else {
      console.log(`Approving ${type} with ID: ${id}`);
      // Implement approval logic for other entity types here
    }
  };

  const handleReject = async (id: string, type: TabsOptions) => {
    if (type === ("institution" as TabsOptions)) {
      try {
        const response = await fetch(`/api/institutions/${id}/verify`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ verificationStatus: "REJECTED" }),
        });
        const data = await response.json();
        if (!response.ok) {
          setMessage(data.message || "Failed to reject institution");
        }

        // Remove the rejected institution from the list
        setInstitutions(institutions.filter((inst) => inst.id !== id));
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        setMessage("Internal Server Error --handleReject");
      }
    } else {
      console.log(`Rejecting ${type} with ID: ${id}`);
      // Implement rejection logic for other entity types here
    }
  };

  const renderInstitutionCards = () => {
    if (isFetchingInstitutions) {
      return Array(3)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="mb-4 border rounded-md p-4 space-y-4">
            <div className="flex flex-row items-start justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-4 w-72" />
              </div>
              <Skeleton className="h-6 w-32" />
            </div>
            <div>
              <div className="flex justify-end gap-2 mt-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          </div>
        ));
    }

    if (institutions.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground text-center">
              No pending institution verification requests.
            </p>
          </CardContent>
        </Card>
      );
    }

    return institutions.map((institution) => (
      <div
        key={institution.id}
        className="mb-4 border rounded-md p-4 space-y-4"
      >
        <div className="flex flex-row items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <span className="text-lg">{institution.name}</span>
            </div>
            <span className="text-muted-foreground text-sm">
              {institution.address}, {institution.city}, {institution.state}
            </span>
            {institution.website && (
              <a
                href={
                  institution.website.startsWith("http")
                    ? institution.website
                    : `https://${institution.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/80 hover:text-primary text-sm"
              >
                {institution.website}
              </a>
            )}
          </div>
          <Badge variant="outline" className="text-muted-foreground">
            {institution.verificationStatus === "NOT_VERIFIED"
              ? "Pending"
              : institution.verificationStatus}
          </Badge>
        </div>
        <div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() =>
                handleReject(institution.id, "institution" as TabsOptions)
              }
            >
              <X className="h-4 w-4 mr-1" /> Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-emerald-500 hover:bg-emerald-500/10"
              onClick={() =>
                handleApprove(institution.id, "institution" as TabsOptions)
              }
            >
              <Check className="h-4 w-4 mr-1" /> Approve
            </Button>
          </div>
        </div>
      </div>
    ));
  };

  const renderCompanyCards = () => {
    return companies.map((company) => (
      <Card key={company.id} className="mb-4">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <CardTitle className="text-lg">{company.name}</CardTitle>
            </div>
            <CardDescription className="mt-1">
              {company.address}
              <br />
              <a
                href={`https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/80 hover:text-primary"
              >
                {company.website}
              </a>
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-secondary text-secondary-foreground"
          >
            {company.verificationStatus === "NOT_VERIFIED"
              ? "Pending Verification"
              : company.verificationStatus}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => handleReject(company.id, "companies")}
            >
              <X className="h-4 w-4 mr-1" /> Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-emerald-500 hover:bg-emerald-500/10"
              onClick={() => handleApprove(company.id, "companies")}
            >
              <Check className="h-4 w-4 mr-1" /> Approve
            </Button>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const renderGovernmentCards = () => {
    return government.map((gov) => (
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
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => handleReject(gov.id, "government")}
            >
              <X className="h-4 w-4 mr-1" /> Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-emerald-500 hover:bg-emerald-500/10"
              onClick={() => handleApprove(gov.id, "government")}
            >
              <Check className="h-4 w-4 mr-1" /> Approve
            </Button>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Verification Requests</h1>
        <p className="text-muted-foreground">
          Review and approve verification requests from institutions, companies,
          and government entities.
        </p>
      </div>

      <Tabs
        defaultValue="institutions"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full mb-6">
          <TabsTrigger value="institutions" className="flex-1">
            <Building className="h-4 w-4 mr-2" /> Institutions
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex-1">
            <Briefcase className="h-4 w-4 mr-2" /> Companies
          </TabsTrigger>
          <TabsTrigger value="government" className="flex-1">
            <Landmark className="h-4 w-4 mr-2" /> Government
          </TabsTrigger>
        </TabsList>

        <TabsContent value="institutions" className="mt-0">
          <div className="space-y-4">{renderInstitutionCards()}</div>
        </TabsContent>

        <TabsContent value="companies" className="mt-0">
          <div className="space-y-4">{renderCompanyCards()}</div>
        </TabsContent>

        <TabsContent value="government" className="mt-0">
          <div className="space-y-4">{renderGovernmentCards()}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRequestPage;
