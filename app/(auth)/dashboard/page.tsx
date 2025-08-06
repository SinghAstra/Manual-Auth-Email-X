// app/dashboard/page.tsx
// This is a protected Server Component that displays user information
// and provides a logout button. It demonstrates how to access authenticated user data.

import { getCurrentUser, logoutUser } from "@/actions/auth"; // Import auth actions
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation"; // For server-side redirection

export default async function DashboardPage() {
  // Get the current user. This function handles token verification and refresh.
  const user = await getCurrentUser();

  // If no user is found (not authenticated or session expired), redirect to login
  if (!user) {
    redirect("/login");
  }

  // Server Action to handle logout
  const handleLogout = async () => {
    "use server"; // Mark this inline function as a Server Action
    await logoutUser(); // Call the logout Server Action
    // The logoutUser action already handles redirection, so no need for explicit redirect here.
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to your Dashboard!</CardTitle>
          <CardDescription>
            This is a protected page, accessible only to authenticated users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-medium">Hello, {user.name}!</p>
            <p className="text-muted-foreground">Your email: {user.email}</p>
            <p className="text-muted-foreground">
              Email Verified: {user.emailVerified ? "Yes" : "No"}
            </p>
            {user.bio && (
              <p className="text-muted-foreground">Bio: {user.bio}</p>
            )}
          </div>
          <form action={handleLogout}>
            <Button type="submit" variant="destructive" className="w-full">
              Logout
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
