import { Feature } from "@/interfaces/feature";
import { BarChart, Briefcase, School, User } from "lucide-react";

export const features: Feature[] = [
  {
    title: "Centralized Placement Data",
    description:
      "Aggregate placement records from institutions nationwide into a unified platform.",
    icon: BarChart,
    colorClass: "stats-blue",
  },
  {
    title: "Role-Based Access Control",
    description:
      "Different user roles like Super Admin, Institution Admin, Company Representative, Student, and Government, each with specific access and actions.",
    icon: User,
    colorClass: "stats-purple",
  },
  {
    title: "Document Verification",
    description:
      "Manual document verification with feedback for institutions, companies, and government profiles.",
    icon: Briefcase,
    colorClass: "stats-pink",
  },
  {
    title: "Institution Management",
    description:
      "Enable institutions to manage profiles, upload student data, and report placement records.",
    icon: School,
    colorClass: "stats-orange",
  },
  {
    title: "Corporate Validation",
    description:
      "Allow company representatives to verify student placement claims and provide feedback.",
    icon: Briefcase,
    colorClass: "stats-blue",
  },
  {
    title: "Government Analytics",
    description:
      "Provide analytics to help policymakers track placement trends and form employment strategies.",
    icon: BarChart,
    colorClass: "stats-purple",
  },
  {
    title: "Placement Record Management",
    description:
      "Track student placement status, company feedback, and verification progress.",
    icon: Briefcase,
    colorClass: "stats-pink",
  },
  {
    title: "Dynamic Analytics",
    description:
      "Visualize trends like placement rates, top recruiters, and skill demands across institutions.",
    icon: BarChart,
    colorClass: "stats-orange",
  },
  {
    title: "Google Authentication",
    description:
      "Secure login with Google to verify user emails and simplify onboarding.",
    icon: User,
    colorClass: "stats-blue",
  },
  {
    title: "Notification System",
    description:
      "Send email alerts for document rejections, approvals, and placement verifications.",
    icon: Briefcase,
    colorClass: "stats-purple",
  },
];
