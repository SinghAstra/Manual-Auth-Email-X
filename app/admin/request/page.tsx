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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Building, Check, Landmark, X } from "lucide-react";
import React, { useState } from "react";

const AdminRequestPage = () => {
  const [activeTab, setActiveTab] = useState("institutions");

  // Mock data - in a real app, you would fetch this from your API
  const institutions = [
    {
      id: "1",
      name: "University of Technology",
      address: "123 Tech Avenue, San Francisco, CA",
      verificationStatus: "NOT_VERIFIED",
    },
    {
      id: "2",
      name: "State College",
      address: "456 Education Lane, Boston, MA",
      verificationStatus: "NOT_VERIFIED",
    },
    {
      id: "3",
      name: "Innovation Institute",
      address: "789 Research Road, Austin, TX",
      verificationStatus: "NOT_VERIFIED",
    },
  ];

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

  const handleApprove = (id, type) => {
    console.log(`Approving ${type} with ID: ${id}`);
    // Implement your approval logic here
  };

  const handleReject = (id, type) => {
    console.log(`Rejecting ${type} with ID: ${id}`);
    // Implement your rejection logic here
  };

  const renderInstitutionCards = () => {
    return institutions.map((institution) => (
      <Card key={institution.id} className="mb-4">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <CardTitle className="text-lg">{institution.name}</CardTitle>
            </div>
            <CardDescription className="mt-1">
              {institution.address}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-secondary text-secondary-foreground"
          >
            {institution.verificationStatus === "NOT_VERIFIED"
              ? "Pending Verification"
              : institution.verificationStatus}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => handleReject(institution.id, "institution")}
            >
              <X className="h-4 w-4 mr-1" /> Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-emerald-500 hover:bg-emerald-500/10"
              onClick={() => handleApprove(institution.id, "institution")}
            >
              <Check className="h-4 w-4 mr-1" /> Approve
            </Button>
          </div>
        </CardContent>
      </Card>
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
              onClick={() => handleReject(company.id, "company")}
            >
              <X className="h-4 w-4 mr-1" /> Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-emerald-500 hover:bg-emerald-500/10"
              onClick={() => handleApprove(company.id, "company")}
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
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Verification Requests</h1>
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
          <div className="space-y-4">
            {institutions.length > 0 ? (
              renderInstitutionCards()
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground text-center">
                    No pending institution verification requests.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="companies" className="mt-0">
          <div className="space-y-4">
            {companies.length > 0 ? (
              renderCompanyCards()
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground text-center">
                    No pending company verification requests.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="government" className="mt-0">
          <div className="space-y-4">
            {government.length > 0 ? (
              renderGovernmentCards()
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground text-center">
                    No pending government verification requests.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRequestPage;
