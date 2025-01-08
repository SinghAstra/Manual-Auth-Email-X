import { Role } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Define routes that require specific roles
const roleRoutes: Record<Role, string[]> = {
  SUPER_ADMIN: ["/admin", "/verification"],
  INSTITUTION_ADMIN: ["/institution", "/students"],
  COMPANY_REPRESENTATIVE: ["/company", "/verify-placements"],
  STUDENT: ["/profile", "/dashboard", "/verification"],
  GOVERNMENT: ["/analytics", "/reports"],
};

export const roleDefaultRoutes: Record<Role, string> = {
  SUPER_ADMIN: "/admin",
  INSTITUTION_ADMIN: "/institution",
  COMPANY_REPRESENTATIVE: "/company",
  STUDENT: "/profile",
  GOVERNMENT: "/analytics",
};

const authRoutes = ["/auth/sign-in"];

export async function middleware(req: NextRequest) {
  const user = await getToken({
    req,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  if (!user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const path = req.nextUrl.pathname;
  const isAuthRoutes = authRoutes.some((route) => path.startsWith(route));

  console.log("path is ", path);
  console.log("isAuthRoutes is ", isAuthRoutes);

  if (isAuthRoutes) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Check role-based access
  const allowedRoutes = roleRoutes[user.role] || [];
  const hasRouteAccess = allowedRoutes.some((route) => path.startsWith(route));

  console.log("hasRouteAccess is ", hasRouteAccess);

  if (!hasRouteAccess) {
    // Redirect to / page
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/onboarding/:path*",
    "/admin/:path*",
    "/institution/:path*",
    "/company/:path*",
    "/profile/:path*",
    "/analytics/:path*",
    "/verification/:path*",
    "/verify-placements/:path*",
    "/placements/:path*",
    "/reports/:path*",
    "/students/:path*",
  ],
};
