"use client";

import PendingUserItem from "@/components/admin/pending-user-item";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [
    isFetchingPendingVerificationUsers,
    setIsFetchingPendingVerificationUsers,
  ] = useState(true);
  const [pendingUsers, setPendingUsers] = useState<User[]>();

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
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Pending Verifications</h2>
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
      </div>
    </div>
  );
}
