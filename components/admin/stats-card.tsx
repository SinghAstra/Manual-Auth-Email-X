import { LucideIcon } from "lucide-react";
import React from "react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
}

export function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
  return (
    <div className="p-6 flex items-center space-x-4 border-2 rounded-md ">
      <div className="p-2 bg-primary/10 rounded-full">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}

export default StatsCard;
