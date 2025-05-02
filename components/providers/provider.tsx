"use client";

import { siteConfig } from "@/config/site";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import React, { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center animate-fade-in">
      <div className="flex gap-4 items-center">
        <Image
          src={"/favicon.ico"}
          width={48}
          height={48}
          alt={siteConfig.name}
        />
        <p className="text-5xl tracking-wide relative">
          {siteConfig.name}
          <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary animate-width-grow"></span>
        </p>
      </div>
      <p className="text-xl tracking-wide flex items-center lg:max-w-3xl">
        {siteConfig.description}
        <span className="inline-flex ml-1">
          <span className="animate-loading-dot">.</span>
          <span className="animate-loading-dot animation-delay-200">.</span>
          <span className="animate-loading-dot animation-delay-400">.</span>
        </span>
      </p>
    </div>
  );
};

const Providers = ({ children }: Props) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SessionProvider>{children}</SessionProvider>
    </Suspense>
  );
};

export default Providers;
