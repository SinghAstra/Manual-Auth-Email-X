"use client";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const features = [
  {
    title: "Placement Record Management",
    description:
      "Allow institutions to upload student data and placement records, with company verification mechanisms.",
    icon: <Icons.database className="w-5 h-5" />,
  },
  {
    title: "Analytics Dashboard",
    description:
      "Provide data insights for institutions and governments, such as placement rates and skill demand trends.",
    icon: <Icons.barChart className="w-5 h-5" />,
  },
];

export default function SignIn() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  console.log("callbackUrl is ", callbackUrl);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error("GitHub Sign-In Error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min=h-screen overflow-hidden">
      {/* Left Panel - Info Section */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-background via-secondary to-background relative z-10">
        <div className="absolute inset-0 bg-grid-white" />
        <div className="z-10 w-full p-12 flex flex-col justify-between">
          <div>
            <Link href="/">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-primary">
                {siteConfig.name}
              </h1>
            </Link>
            <p className="text-muted-foreground mt-2 text-lg">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="space-y-8 max-w-2xl">
            <h2 className="text-3xl font-semibold text-foreground">
              {siteConfig.headline}
            </h2>
            <p className="text-muted-foreground text-lg">
              {siteConfig.subHeadline}
            </p>

            <div className="grid gap-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-secondary/50 backdrop-blur-sm "
                >
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            © 2024 {siteConfig.name}. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Section */}
      <div className="w-full lg:w-2/5 flex items-center justify-center">
        <div className=" flex items-center justify-center p-8 relative">
          {/* Decorative elements */}
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

          <Card className="w-full max-w-md p-8 bg-card/50 backdrop-blur-sm ">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold">
                  Welcome to{" "}
                  <span className="text-primary">{siteConfig.name}</span>
                </h2>
              </div>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full text-primary"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <>
                      <Icons.loader className="w-5 h-5 animate-spin" />
                      Wait ...
                    </>
                  ) : (
                    <>
                      <Image
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        width={18}
                        height={18}
                        className="mr-2"
                      />
                      Continue with Google
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  By continuing, you agree to our{" "}
                  <a href="#" className="underline hover:text-primary">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline hover:text-primary">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </Card>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
