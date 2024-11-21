"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Building2,
  FileCheck,
  GraduationCap,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Institutes", href: "/admin/verify/institutes", icon: GraduationCap },
  { name: "Corporate", href: "/admin/verify/corporate", icon: Building2 },
  { name: "Settings", href: "#", icon: Settings },
  { name: "Profile", href: "/admin/profile", icon: User },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900/50 backdrop-blur-xl px-6 pb-4 border-r border-gray-800">
        <div className="flex h-16 shrink-0 items-center">
          <FileCheck className="h-8 w-8 text-primary" />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "w-full justify-start gap-x-3",
                          isActive && "bg-accent"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
