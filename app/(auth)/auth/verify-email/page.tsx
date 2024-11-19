"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { verifyEmail } from "@/lib/actions/auth/verify.email";
import { ArrowLeft, Mail, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "error"
  >("pending");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      handleEmailVerification(token);
    }
  }, [searchParams]);

  // Email verification handler
  const handleEmailVerification = async (token: string) => {
    try {
      const result = await verifyEmail(token);

      if (result.success) {
        toast({
          title: "Email Verified Successfully.",
          description: result.message,
        });
        router.push("/auth/login");
      } else {
        setVerificationStatus("error");
        toast({
          title: "OOPS!",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      setVerificationStatus("error");
      toast({
        title: "Email Verification Failed!",
        description: "Some Internal Error",
        variant: "destructive",
      });
    }
  };

  // Error or pending verification view
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {verificationStatus === "error"
              ? "Verification Failed"
              : "Verify your email"}
          </CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === "error"
              ? "Invalid or Expired Link"
              : "We've sent a verification link to your email address. Please check your inbox and click the link to verify your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {verificationStatus === "error"
                ? "Please try resending the verification email or contact support."
                : "Didn't receive the email? Check your spam folder or request a new verification link."}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center flex-col">
          {verificationStatus === "error" &&  <Button variant="ghost" className="bg-gray-700">
            <MailIcon className="mr-3"/>
            Resend Email</Button>}
          <Link href="/auth/login">
            <Button variant="ghost" className="bg-gray-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
