"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl px-6">
        <div className="flex items-center gap-x-4 ml-auto">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </header>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl px-6">
      <div className="flex items-center gap-x-4 ml-auto">
        <Link href="/admin/profile">
          <Avatar className="border-2 border-primary">
            <AvatarImage
              src={session.user.image}
              alt={`${session.user.name}'s avatar`}
            />
            <AvatarFallback>
              {session.user.name ? session.user.name[0].toUpperCase() : "UN"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
