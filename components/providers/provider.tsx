"use client";

import { SessionProvider } from "next-auth/react";
import React, { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      This is Loading Fallback You Specified in components/providers/provider
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
