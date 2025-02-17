"use client";

import { useParams } from "next/navigation";
import React from "react";

import { Navbar } from "@/components/home/navbar";
import CompanyRepresentativeUploadDocs from "@/components/uploads/CompanyRepresentativeUploadDocs";
import GovernmentUploadDocs from "@/components/uploads/GovernmentUploadDocs";
import InstitutionAdminUploadDocs from "@/components/uploads/InstitutionAdminUploadDocs";
import StudentUploadDocs from "@/components/uploads/StudentUploadDocs";

const UploadDocs = () => {
  const params = useParams();
  const role = params.role as string;

  // Parse the role from kebab-case to camelCase
  const roleArray = role.split("-");
  const parsedRoleArray = roleArray.map((role, index) => {
    if (index === 0) {
      return role;
    }
    return role.charAt(0).toUpperCase() + role.substring(1);
  });
  const parsedRole = parsedRoleArray.join("");
  console.log("parsedRole is ", parsedRole);

  const roleComponents: Record<string, React.FC> = {
    institutionAdmin: InstitutionAdminUploadDocs,
    companyRepresentative: CompanyRepresentativeUploadDocs,
    student: StudentUploadDocs,
    government: GovernmentUploadDocs,
  };

  if (!roleComponents[parsedRole]) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="p-8 bg-secondary/20 border border-border rounded-lg text-center shadow-md">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Invalid Role
            </h2>
            <p className="text-muted-foreground">
              The specified route is not recognized. Please check the URL and
              try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const FormComponent = roleComponents[parsedRole];

  return (
    <div className="min-h-screen flex flex-col bg-background bg-grid-white">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <FormComponent />
      </div>
    </div>
  );
};

export default UploadDocs;
