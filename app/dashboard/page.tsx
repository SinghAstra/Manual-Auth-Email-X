"use server";

import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import DashboardClientPage from "./dashboard-client-page";

export default async function DashboardPage() {
  console.log("In Dashboard Server Component.");
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  return <DashboardClientPage user={user} />;
}
