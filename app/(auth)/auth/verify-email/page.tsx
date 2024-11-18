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
import { cn } from "@/lib/utils";
import { ArrowLeft, CheckCircle2, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setCountdown(60);
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Email Verified
            </CardTitle>
            <CardDescription className="text-center">
              Your email has been successfully verified. You can now access your
              account.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-4">
            <Link href="/auth/login" className="w-full">
              <Button className="w-full">Continue to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Verify your email
          </CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent a verification link to your email address. Please
            check your inbox and click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or request a
              new verification link.
            </p>
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleResendEmail}
                disabled={countdown > 0 || isResending}
                className="relative"
              >
                <RefreshCw
                  className={cn("mr-2 h-4 w-4", isResending && "animate-spin")}
                />
                {isResending
                  ? "Sending..."
                  : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Resend email"}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/auth/login">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
