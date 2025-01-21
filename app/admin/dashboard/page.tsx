"use client";

import PendingUserItem from "@/components/admin/pending-user-item";
import StatsCard from "@/components/admin/stats-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User } from "@prisma/client";
import { Building2, GraduationCap, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [
    isFetchingPendingVerificationUsers,
    setIsFetchingPendingVerificationUsers,
  ] = useState(true);
  const [pendingUsers, setPendingUsers] = useState<User[]>();

  // Static data for now
  const stats = {
    totalUsers: 1250,
    totalInstitutions: 45,
    totalCompanies: 78,
    totalPlacements: 856,
  };

  useEffect(() => {
    const fetchPendingVerifications = async () => {
      try {
        setIsFetchingPendingVerificationUsers(true);
        const response = await fetch("/api/admin/verifications");
        if (!response.ok) {
          throw new Error("Error in fetchPendingVerificationStatus Response.");
        }
        const data = await response.json();
        console.log("data --/api/admin/verifications is ", data);
        setPendingUsers(data.users);
      } catch (error) {
        console.log("Error in fetchPendingVerificationStatus.");
        if (error instanceof Error) {
          console.log("error.message is ", error.message);
          console.log("error.stack is ", error.stack);
        }
      } finally {
        setIsFetchingPendingVerificationUsers(false);
      }
    };
    fetchPendingVerifications();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl container mx-auto">
      {/* Overview Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Users" value={stats.totalUsers} icon={Users} />
        <StatsCard
          title="Institutions"
          value={stats.totalInstitutions}
          icon={Building2}
        />
        <StatsCard
          title="Companies"
          value={stats.totalCompanies}
          icon={Building2}
        />
        <StatsCard
          title="Placements"
          value={stats.totalPlacements}
          icon={GraduationCap}
        />
      </div>

      {/* Pending Verifications */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Pending Verifications</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {isFetchingPendingVerificationUsers ? (
            <p>Loading...</p>
          ) : !pendingUsers || pendingUsers?.length === 0 ? (
            <p>No pending verifications</p>
          ) : (
            pendingUsers.map((pendingUser) => (
              <PendingUserItem key={pendingUser.id} pendingUser={pendingUser} />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
