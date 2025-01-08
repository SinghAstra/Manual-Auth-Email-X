import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, GraduationCap, Landmark, ShieldCheck } from "lucide-react";
import React from "react";

const RoleSelectionPage = () => {
  const roles = [
    {
      id: "INSTITUTION_ADMIN",
      title: "Institution Administrator",
      description:
        "Manage your institution profile and student placement records",
      icon: Building2,
      requirements: [
        "Institution ID",
        "Official email",
        "Authorization letter",
      ],
    },
    {
      id: "COMPANY_REPRESENTATIVE",
      title: "Company Representative",
      description: "Verify placement records and manage company profile",
      icon: ShieldCheck,
      requirements: ["Company ID", "Corporate email", "Authorization document"],
    },
    {
      id: "GOVERNMENT",
      title: "Government Official",
      description: "Access analytics and placement statistics",
      icon: Landmark,
      requirements: [
        "Government ID",
        "Official email",
        "Department authorization",
      ],
    },
    {
      id: "STUDENT",
      title: "Student",
      description: "View your profile and placement status",
      icon: GraduationCap,
      requirements: ["Student ID", "Institution email", "Enrollment proof"],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to the Platform</h1>
          <p className="text-gray-600">Please select your role to continue</p>
        </div>

        <div className="grid gap-4">
          {roles.map((role) => (
            <Card
              key={role.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-row items-center space-x-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <role.icon className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle>{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-600">
                    Required Documents:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-500">
                    {role.requirements.map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
