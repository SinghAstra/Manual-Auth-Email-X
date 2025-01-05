"use client";

import { siteConfig } from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FadeInUp } from "../animation/fade-in-up";
import { AnimatedButton } from "../custom-ui/animated-button";
import { GradientText } from "../custom-ui/gradient-text";
import { Icons } from "../Icons";

export function Hero() {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const handleGetStarted = () => {
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

    if (status === "authenticated") {
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center">
      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center space-y-8 text-center">
          <FadeInUp>
            <div className="flex flex-col sm:flex-row gap-3">
              <AnimatedButton
                href={siteConfig.links.github}
                icon={<Icons.gitLogo />}
                label="Star on GitHub"
                className="bg-primary/10 text-primary hover:bg-primary/20"
                isExternal
              />
              <AnimatedButton
                href={siteConfig.links.twitter}
                icon={<Icons.twitter />}
                label="Follow Updates"
                className="bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20"
                isExternal
              />
            </div>
          </FadeInUp>

          <FadeInUp delay={0.4}>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                One Stop Solution For
                <br />
                <GradientText animate>Campus Placement</GradientText>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                {siteConfig.subHeadline}
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.4}>
            <AnimatedButton
              label={
                <div className="flex items-center gap-2">
                  <span className="text-base">Get Started</span>
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Icons.arrowRight />
                  </motion.div>
                </div>
              }
              onClick={handleGetStarted}
              disabled={status === "loading"}
              className="h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90"
            />
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}
