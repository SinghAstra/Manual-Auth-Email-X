"use client";

// import { SessionProvider } from "next-auth/react";
import React from "react";
import { TooltipProvider } from "../ui/tooltip";

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    // <SessionProvider>
    <TooltipProvider>{children}</TooltipProvider>
    // </SessionProvider>
  );
};

export default Providers;
