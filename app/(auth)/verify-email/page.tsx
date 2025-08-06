// app/verify-email/page.tsx
// This is a Server Component that handles the email verification process.
// It extracts the token from the URL and calls the verifyEmail Server Action.

import { verifyEmail } from "@/actions/auth"; // Import the Server Action
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

// Define the props for the page, which include search parameters
interface VerifyEmailPageProps {
  searchParams: {
    token?: string; // The verification token from the URL query
  };
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = searchParams; // Extract the token from search parameters

  let verificationResult = {
    success: false,
    message: "Invalid or missing verification token.",
  };

  // If a token is present, attempt to verify the email
  if (token) {
    verificationResult = await verifyEmail(token);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {verificationResult.success
              ? "Your email has been successfully verified!"
              : "There was an issue verifying your email."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationResult.success ? (
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
          )}
          <p className="text-lg font-medium">{verificationResult.message}</p>
          <Link href="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
