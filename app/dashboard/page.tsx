"use server";

import { verifyAccessToken } from "@/lib/auth";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/lib/constants";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClientPage from "./dashboard-client-page";

export default async function DashboardPage() {
  console.log("In Dashboard Server Component.");
  const cookieStore = await cookies();
  console.log(
    "cookieStore.get(ACCESS_TOKEN_COOKIE_NAME) is ",
    cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)
  );
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  console.log("accessToken is ", accessToken);
  if (!accessToken) {
    console.log("Not accessToken ");
    redirect("/login");
  }

  const payload = verifyAccessToken(accessToken);
  console.log("payload is ", payload);

  if (!payload) {
    console.log("Not payload ");
    redirect("/login");
  }

  console.log("payload is ", payload);

  const user = await db.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    console.log("Not user ");
    redirect("/login");
  }
  console.log("user is ", user);

  return <DashboardClientPage user={user} />;
}
