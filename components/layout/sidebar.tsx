import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileCheck, LayoutDashboard, Settings, Users } from "lucide-react";

const navigation = [
  { name: "Overview", href: "#", icon: LayoutDashboard },
  { name: "Verifications", href: "#", icon: FileCheck },
  { name: "Users", href: "#", icon: Users },
  { name: "Settings", href: "#", icon: Settings },
];

export function Sidebar() {
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
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-x-3",
                        item.name === "Overview" && "bg-gray-800"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
