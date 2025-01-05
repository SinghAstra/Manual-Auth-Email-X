import { LucideIcon } from "lucide-react";

export type ColorVariant =
  | "stats-blue"
  | "stats-purple"
  | "stats-pink"
  | "stats-orange";

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: ColorVariant;
}
