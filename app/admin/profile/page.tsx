"use client";

import ProfileSkeleton from "@/components/skeleton/user-profile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { formatEnumValue } from "@/lib/utils/utils";
import { User } from "@prisma/client";
import { format } from "date-fns";
import { AlertCircle, CalendarDays, LogOut, Mail } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProfileView() {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      setUser(await response.json());
    } catch (error) {
      console.log("Error in fetchProfile - ProfileView /profile");
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Internal Server Error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !user) {
    return (
      <Alert variant="destructive" className="flex items-center">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center">
          Failed to load profile. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 p-4 border rounded-md bg-card/50 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            {user.image && <AvatarImage src={user.image} />}
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{user.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {user.email}
            </CardDescription>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to logout?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You will be signed out of your account and redirected to the
                home page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="space-y-1">
            <p className="text-sm font-medium">Verification Status</p>
          </div>
          <Badge variant={"outline"}>
            {formatEnumValue(user.verificationStatus)}
          </Badge>
        </div>

        <div className="flex items-center justify-between border-b pb-3">
          <div className="space-y-1">
            <p className="text-sm font-medium">Account Type</p>
          </div>
          <Badge variant="secondary">{formatEnumValue(user.role)}</Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          Joined {format(new Date(user.createdAt), "MMMM yyyy")}
        </div>
      </div>
    </div>
  );
}
