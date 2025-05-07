import Navbar from "@/components/home/navbar";
import { authOptions } from "@/lib/auth/auth-options";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default async function HomeLayout({ children }: ProfileLayoutProps) {
  const session = await getServerSession(authOptions);
  return (
    <div className="relative z-0">
      <Navbar user={session?.user} />
      {children}
    </div>
  );
}
