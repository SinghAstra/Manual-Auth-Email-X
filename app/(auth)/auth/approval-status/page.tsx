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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ApprovalStatus, getApprovalStatus } from "@/lib/data/approval-status";
import { format } from "date-fns";
import { ArrowLeft, Hourglass, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const ApprovalStatusPage = () => {
  const [status, setStatus] = useState<ApprovalStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const data = await getApprovalStatus();
      setStatus(data);
    } catch (error) {
      console.log("error --fetchStatus is ", error);
      toast({
        title: "Error",
        description: "Failed to fetch approval status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + 1, 100);
        if (newProgress === 100) {
          clearInterval(timer);
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setProgress(0);
    await fetchStatus();
  };

  const handleContactSupport = () => {
    toast({
      title: "Support Request Sent",
      description: "Our team will contact you shortly via email.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <Card className="w-full max-w-md bg-gray-900/60 border border-gray-800 backdrop-blur-xl">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-4">
            <Hourglass className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Application Under Review
          </CardTitle>
          <CardDescription className="text-center">
            Thank you for your patience. Our team is carefully reviewing your
            application.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </div>
          ) : (
            status && (
              <>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium capitalize">
                        {status.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reference</span>
                      <span className="font-medium">{status.reference}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Submitted</span>
                      <span className="font-medium">
                        {format(new Date(status.submissionDate), "PPp")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium capitalize">
                        {status.type}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Review Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Estimated review time:{" "}
                      <span className="font-medium text-foreground">
                        {status.estimatedTime}
                      </span>
                    </p>
                    {status.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {status.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Status
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleContactSupport}
                    className="w-full"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                </div>
              </>
            )
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApprovalStatusPage;
