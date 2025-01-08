import { Role } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import withAuth, { NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { prisma } from "./lib/utils/prisma";

// Define routes that require specific roles
const roleRoutes: Record<Role, string[]> = {
  SUPER_ADMIN: ["/admin", "/verification"],
  INSTITUTION_ADMIN: ["/institution", "/students"],
  COMPANY_REPRESENTATIVE: ["/company", "/verify-placements"],
  STUDENT: ["/profile", "/placements"],
  GOVERNMENT: ["/analytics", "/reports"],
};

const onboardingRoutes = [
  "/onboarding/role-selection",
  "/onboarding/institution/profile",
  "/onboarding/company/profile",
  "/onboarding/government/profile",
  "/onboarding/student/profile",
  "/onboarding/documents",
  "/onboarding/verification-pending",
  "/onboarding/verification-rejected",
];

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const token = await getToken({
      req,
      secret: process.env.NEXT_AUTH_SECRET,
    });

    if (!token?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { email: token.email },
      include: {
        documents: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get the requested path
    const path = req.nextUrl.pathname;

    // If user exists but isn't verified, handle onboarding flow
    if (!user.verified) {
      // Allow access to onboarding routes
      if (onboardingRoutes.some((route) => path.startsWith(route))) {
        // If no role selected yet, force to role selection
        if (!user.role && path !== "/onboarding/role-selection") {
          return NextResponse.redirect(
            new URL("/onboarding/role-selection", req.url)
          );
        }

        // If role selected but no docs, force to document upload
        if (
          user.role &&
          user.documents.length === 0 &&
          !path.includes("/documents")
        ) {
          return NextResponse.redirect(
            new URL(`/onboarding/${user.role.toLowerCase()}/documents`, req.url)
          );
        }

        // If docs pending verification, show pending screen
        if (user.documents.some((doc) => doc.status === "PENDING")) {
          return NextResponse.redirect(
            new URL("/onboarding/verification-pending", req.url)
          );
        }

        // If docs rejected, show rejection screen
        if (user.documents.some((doc) => doc.status === "REJECTED")) {
          return NextResponse.redirect(
            new URL("/onboarding/verification-rejected", req.url)
          );
        }

        return NextResponse.next();
      }

      // If trying to access main app routes while not verified, redirect to appropriate onboarding step
      return NextResponse.redirect(
        new URL("/onboarding/role-selection", req.url)
      );
    }

    // For verified users, prevent access to onboarding routes
    if (onboardingRoutes.some((route) => path.startsWith(route))) {
      return NextResponse.redirect(
        new URL(`/${user.role.toLowerCase()}/dashboard`, req.url)
      );
    }

    // Check role-based access
    const allowedRoutes = roleRoutes[user.role] || [];
    const hasRouteAccess = allowedRoutes.some((route) =>
      path.startsWith(route)
    );

    console.log("hasRouteAccess", hasRouteAccess);

    if (!hasRouteAccess) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
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
