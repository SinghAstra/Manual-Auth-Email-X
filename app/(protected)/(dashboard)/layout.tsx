"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { FileText, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navigation = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    variant: "default",
  },
  {
    title: "Verification",
    href: "/verification",
    icon: FileText,
    variant: "default",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const { data: session } = useSession();
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r fixed top-0 left-0 bottom-0">
        <div className="flex h-14 items-center border-b px-4">
          <h2 className="text-lg text-primary">{siteConfig.name}</h2>
        </div>

        <ScrollArea className="flex-1 px-2 py-4">
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "flex gap-2 items-center justify-start",
                  pathName === item.href &&
                    "font-medium text-primary bg-secondary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </ScrollArea>

        <Link href="/profile">
          <div className="bg-secondary/50 border-t p-4">
            <div className="flex gap-2">
              <Avatar>
                {session?.user.image && (
                  <AvatarImage
                    src={session?.user.image}
                    className="shadow ring"
                  />
                )}
                <AvatarFallback>
                  {session?.user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <CardTitle className="text-sm font-medium ">
                  Account Status
                </CardTitle>
                <CardDescription>
                  {session?.user.verified
                    ? `Verified ${session.user.role.toLowerCase()}`
                    : `Verification Pending`}
                </CardDescription>
              </div>
            </div>
          </div>
        </Link>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto lg:pl-64">{children}</main>
    </div>
  );
}
