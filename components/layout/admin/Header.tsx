import { authOptions } from "@/auth.options";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Header() {
  const session = await getServerSession(authOptions);
  console.log("session --header is ", session);

  if (!session) {
    redirect("/");
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl px-6">
      <div className="flex items-center gap-x-4 ml-auto">
        <Link href="/admin/profile">
          <Avatar className="border-2 border-primary">
            <AvatarImage
              src={session.user.image || "/default-avatar.png"}
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
