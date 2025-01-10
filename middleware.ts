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

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXT_AUTH_SECRET,
    });
    console.log("token --middleware is ", token);
    if (!token?.id) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    const path = req.nextUrl.pathname;

    console.log("path is ", path);

    // Construct absolute URL for role verification
    const baseUrl = process.env.NEXT_AUTH_URL || req.nextUrl.origin;
    const response = await fetch(`${baseUrl}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token.id}`,
      },
    });
    const data = await response.json();

    console.log(" req.nextUrl.origin is ", req.nextUrl.origin);
    console.log("data --middleware is ", data);

    if (!response.ok) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    const currentUser: User = data;
    const userRole = currentUser?.role;

    if (!userRole) {
      return new NextResponse("Unauthorized: No role assigned", {
        status: 403,
      });
    }

    // TODO:Redirect authenticated users away from auth routes

    // Check role-based access
    const allowedRoutes = roleRoutes[userRole] || [];
    const hasRouteAccess = allowedRoutes.some((route) =>
      path.startsWith(route)
    );

    console.log("hasRouteAccess is ", hasRouteAccess);

    if (!hasRouteAccess) {
      // Redirect to role's default route
      const defaultRoute = roleDefaultRoutes[userRole] || "/";
      return NextResponse.redirect(new URL(defaultRoute, req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log("Error in middleware.");
    if (error instanceof Error) {
      console.log("error.message: " + error.message);
      console.log("error.stack: " + error.stack);
    }

    // Handle unknown errors
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*"],
};
