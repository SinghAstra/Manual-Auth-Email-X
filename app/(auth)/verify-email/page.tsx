import { verifyEmail } from "@/actions/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface VerifyEmailPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;

  let verificationResult = {
    success: false,
    message: "Invalid or missing verification token.",
  };

  if (token) {
    verificationResult = await verifyEmail(token);
  }

  if (!token) {
    redirect("/register");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md text-center border bg-muted/40 px-3 py-2 flex flex-col gap-2">
        <div>
          <h1 className="text-2xl">Email Verification</h1>
          <p>
            {verificationResult.success
              ? "Your email has been successfully verified!"
              : "There was an issue verifying your email."}
          </p>
        </div>
        <div className="space-y-4">
          {verificationResult.success ? (
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
          )}
          <p className="text-lg">{verificationResult.message}</p>
          <Link href="/login" className={cn(buttonVariants(), "w-full")}>
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
