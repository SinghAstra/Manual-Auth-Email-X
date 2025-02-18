import { Role } from "@prisma/client";

type DashboardRoutesType = {
  [key in Role]: string;
};

export const dashboardRoutes: DashboardRoutesType = {
  SUPER_ADMIN: "/admin",
  INSTITUTION_ADMIN: "/institution/dashboard",
  COMPANY_REPRESENTATIVE: "/company/dashboard",
  STUDENT: "/student/dashboard",
  GOVERNMENT: "/government/dashboard",
  UNVERIFIED: "/auth/profile-setup",
};
