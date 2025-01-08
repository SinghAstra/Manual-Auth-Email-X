"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@prisma/client";
import { format } from "date-fns";
import { AlertCircle, CalendarDays, Mail } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfileView() {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="space-y-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
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
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">Verification Status</p>
                <p className="text-sm text-muted-foreground">
                  {user.verified ? "Verified" : "Pending Verification"}
                </p>
              </div>
              <Badge variant={"outline"}>
                {user.verified ? "Verified" : "Unverified"}
              </Badge>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">Account Type</p>
                <p className="text-sm text-muted-foreground">Student Account</p>
              </div>
              <Badge variant="secondary">{user.role}</Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              Joined {format(new Date(user.createdAt), "MMMM yyyy")}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-[120px]" />
        </div>
      </CardContent>
    </Card>
  );
}
