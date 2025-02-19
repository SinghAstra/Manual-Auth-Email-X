"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const sidebarLinks = [
    { name: "Organization Request", href: "/admin/organization-request" },
    { name: "Verified Organization ", href: "/admin/verified-organization" },
    { name: "Pending Verification", href: "/admin/pending-verification" },
    { name: "Verified", href: "/admin/users" },
  ];

  const pathname = usePathname();
  return (
    <div className="fixed inset-y-0 left-0 w-96 bg-background border-r pt-20 pr-8 pl-4">
      <div className="flex flex-col h-full space-y-2">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block px-4 py-2 transition border-l border-l-muted hover:bg-muted",
              pathname === link.href && "border-l-primary"
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
