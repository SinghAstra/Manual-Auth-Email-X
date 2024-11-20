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
import { resendVerificationEmail } from "@/lib/actions/auth/resend.verify.email";
import { verifyEmail } from "@/lib/actions/auth/verify.email";
import { ArrowLeft, Loader2, Mail, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function LoadingCard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <Card className="w-full max-w-md bg-gray-900/60 border border-gray-800 backdrop-blur-xl">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-4">
            <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Loading...
          </CardTitle>
          <CardDescription className="text-center">
            Please wait while we verify your email
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

function VerifyEmailContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "error" | "success"
  >("pending");
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (emailParam) {
      setEmail(emailParam);
    }

    if (token) {
      handleEmailVerification(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleEmailVerification = async (token: string) => {
    try {
      const result = await verifyEmail(token);

      if (result.success) {
        setVerificationStatus("success");
        toast({
          title: "Email Verified Successfully",
          description: result.message,
        });
        // Delay redirect to show success state
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setVerificationStatus("error");
        toast({
          title: "Verification Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Email verification error:", error);
      setVerificationStatus("error");
      toast({
        title: "Verification Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "No email address found",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      const result = await resendVerificationEmail(email);

      if (result.success) {
        toast({
          title: "Verification Email Sent",
          description: "Please check your inbox for the verification link",
        });
        setVerificationStatus("pending");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Resend verification email error:", error);
      toast({
        title: "Error",
        description:
          "Failed to resend verification email. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <Card className="w-full max-w-md bg-gray-900/60 border border-gray-800 backdrop-blur-xl">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-4">
            {verificationStatus === "success" ? (
              <Mail className="h-12 w-12 text-green-500" />
            ) : verificationStatus === "error" ? (
              <Mail className="h-12 w-12 text-red-500" />
            ) : (
              <Mail className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {verificationStatus === "success"
              ? "Email Verified!"
              : verificationStatus === "error"
              ? "Verification Failed"
              : "Verify your email"}
          </CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === "success"
              ? "Your email has been successfully verified. Redirecting to login..."
              : verificationStatus === "error"
              ? "The verification link is invalid or has expired"
              : "We've sent a verification link to your email address. Please check your inbox and click the link to verify your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {verificationStatus === "error"
                ? "Please try resending the verification email or contact support if the problem persists."
                : "Didn't receive the email? Check your spam folder or request a new verification link."}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center flex-col gap-2">
          {verificationStatus === "error" && email && (
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              variant="ghost"
              className="bg-primary w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <MailIcon className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </Button>
          )}
          {verificationStatus !== "success" && (
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
