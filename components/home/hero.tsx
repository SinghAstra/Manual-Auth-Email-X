"use client";

import { siteConfig } from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import { dashboardRoutes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { VerificationStatus } from "@prisma/client";
import { ArrowRight, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FadeInUp } from "../animation/fade-in-up";
import { Icons } from "../Icons";
import { GradientText } from "../ui-components/gradient-text";
import { Button, buttonVariants } from "../ui/button";

export function Hero() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();
  const { toast } = useToast();
  const [isStarting, setIsStarting] = useState(false);

  const handleGetStarted = () => {
    setIsStarting(true);
    if (status === "loading") {
      toast({
        title: "Authenticating",
        description: "Checking your authentication status...",
      });
      return;
    }

    if (status === "unauthenticated") {
      router.push("/auth/sign-in");
      return;
    }

    console.log("user --handleGetStarted is ", user);

    if (user) {
      if (user.verificationStatus === ("NOT_APPLIED" as VerificationStatus)) {
        router.push("/auth/profile-setup");
        return;
      }

      if (user.verificationStatus === ("PENDING" as VerificationStatus)) {
        router.push("/auth/verification-status");
      }

      if (user.verificationStatus === ("APPROVED" as VerificationStatus)) {
        router.push(dashboardRoutes[user.role]);
      }
    }
    setIsStarting(false);
  };

  return (
    <div className="max-w-3xl flex flex-col items-center text-center gap-8">
      <FadeInUp delay={0.4}>
        <div className="min-h-screen flex flex-col items-center  text-center gap-8 max-w-3xl">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl mt-16">
            <GradientText variant="secondary" animate>
              Transforming
            </GradientText>{" "}
            Campus Placement
            <br />
            <GradientText variant="secondary" animate>
              Analytics
            </GradientText>
          </h1>

          <Button
            onClick={handleGetStarted}
            disabled={status === "loading" || isStarting}
            variant={"outline"}
            size={"lg"}
          >
            {isStarting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Starting....
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Get Started <ArrowRight className="animate-move-x" />
              </span>
            )}
          </Button>
        </div>
      </FadeInUp>
      <FadeInUp delay={0.4}>
        <div className="min-h-screen flex flex-col items-center text-center gap-8 max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Track{" "}
            <GradientText variant="accent" animate>
              Real-time Data
            </GradientText>{" "}
            across Universities for{" "}
            <GradientText variant="accent" animate>
              informed decisions
            </GradientText>
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGetStarted}
              disabled={status === "loading"}
              variant={"outline"}
              size={"lg"}
            >
              Get Started <ArrowRight className="animate-move-x" />
            </Button>
            <Link
              href={siteConfig.links.twitter}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              target="_blank"
            >
              <Icons.twitter />
              Follow Updates
            </Link>
          </div>
        </div>
      </FadeInUp>
      <FadeInUp delay={0.4}>
        <div className="min-h-screen flex flex-col items-center text-center gap-8 max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Access{" "}
            <GradientText variant="success" animate>
              Comprehensive Analytics
            </GradientText>{" "}
            for Placements and{" "}
            <GradientText variant="success" animate>
              Industry Trends
            </GradientText>
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGetStarted}
              disabled={status === "loading"}
              variant={"outline"}
              size={"lg"}
              className="space-x-2"
            >
              Get Started <ArrowRight className="animate-move-x" />
            </Button>
            <Link
              href={siteConfig.links.github}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              target="_blank"
            >
              <Icons.gitLogo />
              Star on GitHub
            </Link>
          </div>
        </div>
      </FadeInUp>
      <FadeInUp delay={0.4}>
        <div className="min-h-screen flex flex-col items-center text-center gap-8 max-w-3xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={siteConfig.links.twitter}
              className={cn(buttonVariants({ variant: "outline" }))}
              target="_blank"
            >
              <Icons.twitter />
              Follow Updates
            </Link>
            <Link
              href={siteConfig.links.github}
              className={cn(buttonVariants({ variant: "outline" }))}
              target="_blank"
            >
              <Icons.gitLogo />
              Star on GitHub
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Generate{" "}
            <GradientText variant="warning" animate>
              Insights
            </GradientText>{" "}
            from{" "}
            <GradientText variant="warning" animate>
              Nationwide Data
            </GradientText>
          </h1>
          <Button
            onClick={handleGetStarted}
            disabled={status === "loading"}
            variant={"outline"}
            size={"lg"}
            className="space-x-2"
          >
            Get Started <ArrowRight className="animate-move-x" />
          </Button>
        </div>
      </FadeInUp>
    </div>
  );
}
