"use client";

import { logOutUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@prisma/client";
import React from "react";

interface DashboardClientPageProps {
  user: User;
}

const DashboardClientPage = ({ user }: DashboardClientPageProps) => {
  const handleLogOut = async () => {
    await logOutUser("/");
  };
  return (
    <div className="flex min-h-screen items-center justify-center b p-4">
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
          <Button
            onClick={handleLogOut}
            variant="destructive"
            className="w-full"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardClientPage;
