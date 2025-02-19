"use client";

import { Navbar } from "@/components/home/navbar";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { dashboardRoutes } from "@/lib/constants";
import { Role } from "@prisma/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface VerificationData {
  role: Role;
  verificationStatus: string;
  feedback: string | null;
  institutionProfile?: { institution: { name: string } };
  companyProfile?: { company: { name: string } };
  studentProfile?: { institution: { name: string } };
  governmentProfile?: { government: { name: string } };
}

const VerificationPending = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerificationData | null>(null);
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!message) return;
    toast({
      title: message,
    });
    setMessage(null);
  }, [message, toast]);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const response = await fetch("/api/auth/verification-pending");

        if (!response.ok) {
          setMessage("Failed to fetch");
          return;
        }

        const userData = await response.json();
        setData(userData);

        // Redirect if user is already verified
        if (data?.verificationStatus === "APPROVED") {
          router.push(dashboardRoutes[data.role]);
          return;
        }
      } catch (error) {
        console.error("Error fetching verification status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationStatus();
  }, [router, data?.role, data?.verificationStatus]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  const getOrganizationName = () => {
    if (!data) return "";

    if (data.institutionProfile)
      return data.institutionProfile.institution.name;
    if (data.companyProfile) return data.companyProfile.company.name;
    if (data.studentProfile) return data.studentProfile.institution.name;
    if (data.governmentProfile) return data.governmentProfile.government.name;

    return "";
  };

  const getRoleDisplay = () => {
    if (!data) return "";

    const roleMap: { [key: string]: string } = {
      INSTITUTION_ADMIN: "Institution Administrator",
      COMPANY_REPRESENTATIVE: "Company Representative",
      STUDENT: "Student",
      GOVERNMENT_REPRESENTATIVE: "Government Representative",
    };

    return roleMap[data.role] || data.role;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle>
              Verification Status: {data?.verificationStatus}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.verificationStatus === "PENDING" && (
              <div className="space-y-2">
                <p className="text-lg">
                  Your verification as{" "}
                  <span className="font-medium">{getRoleDisplay()}</span>
                  {getOrganizationName() && (
                    <>
                      {" "}
                      for{" "}
                      <span className="font-medium">
                        {getOrganizationName()}
                      </span>
                    </>
                  )}{" "}
                  is currently under review.
                </p>
                <p className="text-muted-foreground">
                  Our team is reviewing your submitted documents. This process
                  typically takes 1-2 business days.
                </p>
              </div>
            )}
            {data?.feedback && (
              <div className="flex justify-between gap-2 p-4 border rounded-lg">
                <div className="flex flex-col">
                  <p className="font-medium">Feedback from reviewers:</p>
                  <p className="mt-2">{data.feedback}</p>
                </div>
                <Link
                  className={buttonVariants({ variant: "outline" })}
                  href="/auth/profile-setup"
                >
                  Apply Again
                </Link>
              </div>
            )}
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                If you have any questions or need to update your information,
                please contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPending;
