import { Role, User } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Define routes that require specific roles
const roleRoutes: Record<Role, string[]> = {
  SUPER_ADMIN: [
    "/admin/dashboard",
    "/admin/institutions",
    "/admin/companies",
    "/admin/users",
  ],
  INSTITUTION_ADMIN: ["/institution", "/students"],
  COMPANY_REPRESENTATIVE: ["/company", "/verify-placements"],
  STUDENT: ["/student/profile", "/student/verification"],
  GOVERNMENT: ["/analytics", "/reports"],
};

export const roleDefaultRoutes: Record<Role, string> = {
  SUPER_ADMIN: "/dashboard",
  INSTITUTION_ADMIN: "/institution",
  COMPANY_REPRESENTATIVE: "/company",
  STUDENT: "/student/profile",
  GOVERNMENT: "/analytics",
};

const authRoutes = ["/auth/sign-in"];

export async function middleware(req: NextRequest) {
  const user = await getToken({
    req,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  if (!user) {
    return new NextResponse("Unauthorized", { status: 404 });
  }

  // const response = await fetch("/api/profile");

  // if (!response.ok) {
  //   return new NextResponse("Unauthorized", { status: 404 });
  // }

  // const userProfile: User = await response.json();

  const path = req.nextUrl.pathname;
  const isAuthRoutes = authRoutes.some((route) => path.startsWith(route));

  console.log("path is ", path);
  console.log("isAuthRoutes is ", isAuthRoutes);

  if (isAuthRoutes) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Check role-based access
  const allowedRoutes = roleRoutes["STUDENT"] || [];
  const hasRouteAccess = allowedRoutes.some((route) => path.startsWith(route));

  console.log("hasRouteAccess is ", hasRouteAccess);

  if (!hasRouteAccess) {
    // Redirect to / page
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*"],
};
