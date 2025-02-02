import { Role } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const roleRoutes: Record<Role, string> = {
  SUPER_ADMIN: "/admin",
  INSTITUTION_ADMIN: "/institution",
  COMPANY_REPRESENTATIVE: "/company",
  STUDENT: "/student",
  GOVERNMENT: "/gov",
};

export const roleDefaultRoutes: Record<Role, string> = {
  SUPER_ADMIN: "/admin/dashboard",
  INSTITUTION_ADMIN: "/institution",
  COMPANY_REPRESENTATIVE: "/company",
  STUDENT: "/student/profile",
  GOVERNMENT: "/analytics",
};

// Helper function to check if the path requires authentication
const requiresAuth = (path: string): boolean => {
  return Object.values(roleRoutes).some((route) => path.startsWith(route));
};

export async function middleware(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname;

    // Only proceed with auth check if path starts with a protected route
    if (!requiresAuth(path)) {
      return NextResponse.next();
    }

    const token = await getToken({
      req,
      secret: process.env.NEXT_AUTH_SECRET,
    });

    if (!token?.id) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    console.log("token --middleware is ", token);
    console.log("path --middleware is ", path);

    const userRole = token.role;
    const isAccessingOwnRole = path.startsWith(roleRoutes[userRole]);
    if (!isAccessingOwnRole) {
      // Redirect to their default route if they try to access unauthorized area
      return NextResponse.redirect(
        new URL(roleDefaultRoutes[userRole], req.url)
      );
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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
