"use client";

import { siteConfig } from "@/config/site";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { AvatarMenu } from "./avatar-menu";
import SignInButton from "./sign-in-button";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className=" container mx-auto py-4 flex items-center justify-between">
      <Link href="/" className=" hover:opacity-80 transition-opacity">
        <span className="tracking-wide text-5xl font-medium">
          {siteConfig.name}
        </span>
      </Link>

      {status === "loading" ? (
        <Skeleton className="h-10 w-10 rounded-full  border-primary border-2" />
      ) : session?.user ? (
        <AvatarMenu />
      ) : (
        <SignInButton />
      )}
    </header>
  );
}
