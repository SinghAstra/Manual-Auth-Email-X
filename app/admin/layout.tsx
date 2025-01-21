// app/(admin)/admin/layout.tsx
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { VariantProps } from "class-variance-authority";
import {
  Building,
  Building2,
  LayoutDashboard,
  User,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    variant: "ghost" as ButtonVariant,
  },
  {
    title: "Institutions",
    href: "/admin/institutions",
    icon: Building2,
    variant: "ghost" as ButtonVariant,
  },
  {
    title: "Companies",
    href: "/admin/companies",
    icon: Building,
    variant: "ghost" as ButtonVariant,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    variant: "ghost" as ButtonVariant,
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: User,
    variant: "ghost" as ButtonVariant,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
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
                  buttonVariants({ variant: item.variant }),
                  "flex gap-2 items-center justify-start w-full",
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

        <Link href="/admin/profile">
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
                  {session?.user.name?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 overflow-hidden">
                <div className="text-sm font-medium">{session?.user.name}</div>
                <span className="text-xs text-muted-foreground truncate">
                  {session?.user.email}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto lg:pl-64 p-6">{children}</main>
    </div>
  );
}
