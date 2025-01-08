import { Role } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

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

export async function middleware(req: NextRequest) {
  const user = await getToken({
    req,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  console.log("user --middleware is", user);

  if (!user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const path = req.nextUrl.pathname;

  // Handle unverified users and onboarding flow
  if (!user.verified) {
    if (onboardingRoutes.some((route) => path.startsWith(route))) {
      // Role selection check
      if (!user.role && path !== "/onboarding/role-selection") {
        return NextResponse.redirect(
          new URL("/onboarding/role-selection", req.url)
        );
      }

      // Document upload check
      if (
        user.role &&
        user.documents.length === 0 &&
        !path.includes("/documents")
      ) {
        return NextResponse.redirect(
          new URL(`/onboarding/${user.role.toLowerCase()}/documents`, req.url)
        );
      }

      // Verification status checks
      //   if (user.documents.some((doc) => doc.status === "PENDING")) {
      //     return NextResponse.redirect(
      //       new URL("/onboarding/verification-pending", req.url)
      //     );
      //   }

      //   if (user.documents.some((doc) => doc.status === "REJECTED")) {
      //     return NextResponse.redirect(
      //       new URL("/onboarding/verification-rejected", req.url)
      //     );
      //   }

      return NextResponse.next();
    }

    // Redirect unverified users trying to access main app
    return NextResponse.redirect(
      new URL("/onboarding/role-selection", req.url)
    );
  }

  // Redirect verified users away from onboarding
  if (onboardingRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.redirect(
      new URL(`/${user.role.toLowerCase()}/dashboard`, req.url)
    );
  }

  // Check role-based access
  const allowedRoutes = roleRoutes[user.role] || [];
  const hasRouteAccess = allowedRoutes.some((route) => path.startsWith(route));

  if (!hasRouteAccess) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

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
